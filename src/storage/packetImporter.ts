import { ProjectPacket, SourceRecord, Passage, EvidenceCard, ResearchProject, VerifiedSecondaryLiterature } from '../types';
import { generateTextChecksum } from '../services/checksum';

export interface ImportValidationResult {
  success: boolean;
  project?: ResearchProject;
  sources: SourceRecord[];
  passages: Passage[];
  evidenceCards: EvidenceCard[];
  secondaryLiterature: VerifiedSecondaryLiterature[];
  errors: string[];
  warnings: string[];
  duplicatePassagesDetected: number;
}

export async function parseAndValidateJsonPacket(
  jsonString: string,
  targetProjectId?: string
): Promise<ImportValidationResult> {
  const errors: string[] = [];
  const warnings: string[] = [];
  let duplicateCount = 0;

  try {
    const raw = JSON.parse(jsonString);

    if (!raw.project || !raw.project.title) {
      errors.push('Invalid packet: Missing project title or project metadata');
    }

    const projectId = targetProjectId || raw.project?.id || `proj-${Date.now()}`;

    const project: ResearchProject = {
      id: projectId,
      title: String(raw.project?.title || 'Imported Project'),
      subtitle: raw.project?.subtitle ? String(raw.project.subtitle) : undefined,
      researchQuestion: String(raw.project?.researchQuestion || 'Unspecified Research Question'),
      methodologyNote: String(raw.project?.methodologyNote || ''),
      language: raw.project?.language === 'zh-Hant' ? 'zh-Hant' : 'en',
      dateRange: {
        startYear: Number(raw.project?.dateRange?.startYear ?? 30),
        endYear: Number(raw.project?.dateRange?.endYear ?? 800)
      },
      createdAt: raw.project?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      curatedPacketId: raw.project?.curatedPacketId
    };

    const validSources: SourceRecord[] = [];
    const sourceIdMap = new Map<string, string>();

    if (Array.isArray(raw.sources)) {
      for (const s of raw.sources) {
        if (!s.author || !s.workTitle) {
          warnings.push(`Skipped malformed source without author/title: ${JSON.stringify(s)}`);
          continue;
        }

        const newSourceId = s.id || `src-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
        sourceIdMap.set(s.id, newSourceId);

        if (s.sourceProvider === 'Perseus') {
          warnings.push(`Source "${s.author} - ${s.workTitle}" imported from Perseus. Caution: Must be verified against a scholarly critical edition (CSEL, CCSL, SC).`);
        }

        if (s.compositionDate?.certainty === 'contested' || s.compositionDate?.certainty === 'unknown') {
          warnings.push(`Source "${s.author} - ${s.workTitle}" has contested or unknown dating.`);
        }

        validSources.push({
          id: newSourceId,
          projectId: project.id,
          author: String(s.author),
          authorTradition: s.authorTradition || 'Other',
          workTitle: String(s.workTitle),
          originalLanguage: s.originalLanguage || 'grc',
          compositionDate: {
            startYear: Number(s.compositionDate?.startYear ?? 300),
            endYear: Number(s.compositionDate?.endYear ?? 400),
            certainty: s.compositionDate?.certainty || 'approximate',
            note: s.compositionDate?.note
          },
          authenticityStatus: s.authenticityStatus || 'authentic',
          sourceProvider: s.sourceProvider || 'Other_Critical_Edition',
          providerUrl: s.providerUrl,
          clavisId: s.clavisId,
          tlgId: s.tlgId,
          ctsUrn: s.ctsUrn,
          edition: String(s.edition || 'Critical Edition Not Specified'),
          translator: s.translator,
          rightsAccessNote: s.rightsAccessNote,
          bibliographyCitation: s.bibliographyCitation || `${s.author}. ${s.workTitle}. ${s.edition || ''}`,
          verificationStatus: s.verificationStatus || 'attested',
          researcherNotes: s.researcherNotes,
          createdAt: s.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    const validPassages: Passage[] = [];
    const passageChecksumSet = new Set<string>();

    if (Array.isArray(raw.passages)) {
      for (const p of raw.passages) {
        if (!p.originalText || !p.passageLocator) {
          warnings.push(`Skipped passage missing original text or locator`);
          continue;
        }

        const checksum = p.snapshot?.sourceChecksum || await generateTextChecksum(p.originalText);
        if (passageChecksumSet.has(checksum)) {
          duplicateCount++;
          warnings.push(`Duplicate passage text detected at locator [${p.passageLocator}].`);
          continue;
        }
        passageChecksumSet.add(checksum);

        const mappedSourceId = sourceIdMap.get(p.sourceId) || p.sourceId;

        validPassages.push({
          id: p.id || `pas-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          projectId: project.id,
          sourceId: mappedSourceId,
          passageLocator: String(p.passageLocator),
          originalText: String(p.originalText),
          translationText: String(p.translationText || ''),
          translationLanguage: p.translationLanguage === 'zh-Hant' ? 'zh-Hant' : 'en',
          concepts: Array.isArray(p.concepts) ? p.concepts : ['Concupiscentia / Desire'],
          verificationStatus: p.verificationStatus || 'attested',
          snapshot: {
            importedAt: p.snapshot?.importedAt || new Date().toISOString(),
            sourceChecksum: checksum,
            providerUri: p.snapshot?.providerUri,
            isImmutable: true
          },
          notes: p.notes,
          createdAt: p.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    const validEvidenceCards: EvidenceCard[] = [];
    if (Array.isArray(raw.evidenceCards)) {
      for (const ec of raw.evidenceCards) {
        if (!ec.sourcePassageId || !ec.relationType) {
          warnings.push(`Skipped incomplete evidence card missing passage linkage or relation type`);
          continue;
        }

        validEvidenceCards.push({
          id: ec.id || `ec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          projectId: project.id,
          sourcePassageId: ec.sourcePassageId,
          targetPassageId: ec.targetPassageId,
          sourceConcept: ec.sourceConcept || 'General Patristic Concept',
          targetConcept: ec.targetConcept,
          sourceNodeId: ec.sourceNodeId || ec.sourcePassageId,
          targetNodeId: ec.targetNodeId || ec.targetPassageId || ec.sourcePassageId,
          exactLocators: Array.isArray(ec.exactLocators) ? ec.exactLocators : [],
          relationType: ec.relationType || 'conceptual_development',
          confidence: ec.confidence || 'high',
          evidenceExcerpt: ec.evidenceExcerpt || '',
          researcherExplanation: ec.researcherExplanation || 'Primary textual connection established in critical edition.',
          aiInterpretation: ec.aiInterpretation,
          verificationStatus: ec.verificationStatus || 'attested',
          reviewerNotes: ec.reviewerNotes,
          cautionNote: ec.cautionNote,
          createdAt: ec.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    const validSecondaryLiterature: VerifiedSecondaryLiterature[] = [];
    if (Array.isArray(raw.secondaryLiterature)) {
      for (const sl of raw.secondaryLiterature) {
        if (!sl.title || !sl.authors) continue;
        validSecondaryLiterature.push({
          id: sl.id || `sec-lit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
          projectId: project.id,
          doi: sl.doi,
          title: String(sl.title),
          authors: Array.isArray(sl.authors) ? sl.authors : [String(sl.authors)],
          year: sl.year ? Number(sl.year) : undefined,
          venue: String(sl.venue || 'Academic Publication'),
          abstract: sl.abstract,
          isOa: !!sl.isOa,
          oaUrl: sl.oaUrl,
          landingUrl: sl.landingUrl,
          crossrefData: sl.crossrefData,
          openAlexData: sl.openAlexData,
          sciteTallies: sl.sciteTallies,
          formattedCitation: sl.formattedCitation,
          linkedPassageIds: Array.isArray(sl.linkedPassageIds) ? sl.linkedPassageIds : [],
          linkedEvidenceCardIds: Array.isArray(sl.linkedEvidenceCardIds) ? sl.linkedEvidenceCardIds : [],
          researcherNotes: sl.researcherNotes || '',
          responsibleVerdict: sl.responsibleVerdict || 'credible_neutral',
          createdAt: sl.createdAt || new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });
      }
    }

    return {
      success: errors.length === 0,
      project,
      sources: validSources,
      passages: validPassages,
      evidenceCards: validEvidenceCards,
      secondaryLiterature: validSecondaryLiterature,
      errors,
      warnings,
      duplicatePassagesDetected: duplicateCount
    };
  } catch (err: any) {
    return {
      success: false,
      sources: [],
      passages: [],
      evidenceCards: [],
      secondaryLiterature: [],
      errors: [`JSON parsing error: ${err.message}`],
      warnings: [],
      duplicatePassagesDetected: 0
    };
  }
}

export async function parseCsvSources(csvText: string, projectId: string): Promise<{ sources: SourceRecord[]; warnings: string[] }> {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) return { sources: [], warnings: ['CSV is empty or missing headers'] };

  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''));
  const sources: SourceRecord[] = [];
  const warnings: string[] = [];

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;
    // Simple CSV parse handling quotes
    const values: string[] = [];
    let insideQuote = false;
    let currentVal = '';
    for (let charIdx = 0; charIdx < line.length; charIdx++) {
      const char = line[charIdx];
      if (char === '"') {
        insideQuote = !insideQuote;
      } else if (char === ',' && !insideQuote) {
        values.push(currentVal.trim().replace(/^"|"$/g, ''));
        currentVal = '';
      } else {
        currentVal += char;
      }
    }
    values.push(currentVal.trim().replace(/^"|"$/g, ''));

    const row: Record<string, string> = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] || '';
    });

    if (!row.author || !row.workTitle) {
      warnings.push(`Row ${i + 1}: Missing author or work title`);
      continue;
    }

    if (row.sourceProvider === 'Perseus') {
      warnings.push(`Row ${i + 1}: Perseus import requires verification against a critical edition.`);
    }

    sources.push({
      id: `src-csv-${Date.now()}-${i}`,
      projectId,
      author: row.author,
      authorTradition: (row.authorTradition as any) || 'Other',
      workTitle: row.workTitle,
      originalLanguage: (row.originalLanguage as any) || 'grc',
      compositionDate: {
        startYear: parseInt(row.startYear, 10) || 300,
        endYear: parseInt(row.endYear, 10) || 400,
        certainty: (row.certainty as any) || 'probable'
      },
      authenticityStatus: (row.authenticityStatus as any) || 'authentic',
      sourceProvider: (row.sourceProvider as any) || 'Other_Critical_Edition',
      edition: row.edition || 'Critical Edition',
      clavisId: row.clavisId || undefined,
      tlgId: row.tlgId || undefined,
      ctsUrn: row.ctsUrn || undefined,
      bibliographyCitation: row.bibliographyCitation || `${row.author}. ${row.workTitle}.`,
      verificationStatus: (row.verificationStatus as any) || 'attested',
      researcherNotes: row.researcherNotes || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });
  }

  return { sources, warnings };
}
