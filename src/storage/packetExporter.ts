import { ResearchProject, SourceRecord, Passage, EvidenceCard, ProjectPacket, VerifiedSecondaryLiterature } from '../types';

export function generateProjectPacket(
  project: ResearchProject,
  sources: SourceRecord[],
  passages: Passage[],
  evidenceCards: EvidenceCard[],
  secondaryLiterature: VerifiedSecondaryLiterature[] = []
): ProjectPacket {
  const attestedCount = sources.filter(s => s.verificationStatus === 'attested').length;
  const provisionalCount = sources.filter(s => s.verificationStatus === 'provisional').length;
  const discoveryCount = sources.filter(s => s.verificationStatus === 'discovery_lead').length;

  return {
    version: '1.0.0',
    exportedAt: new Date().toISOString(),
    project,
    sources,
    passages,
    evidenceCards,
    secondaryLiterature,
    metadata: {
      totalSources: sources.length,
      totalPassages: passages.length,
      totalEvidenceCards: evidenceCards.length,
      attestedCount,
      provisionalCount,
      discoveryCount
    }
  };
}

export function generateMarkdownDossier(
  project: ResearchProject,
  sources: SourceRecord[],
  passages: Passage[],
  evidenceCards: EvidenceCard[],
  locale: 'en' | 'zh-Hant' = 'en',
  secondaryLiterature: VerifiedSecondaryLiterature[] = []
): string {
  const isZh = locale === 'zh-Hant';
  const verifiedSources = sources.filter(s => s.verificationStatus === 'attested');
  const provisionalSources = sources.filter(s => s.verificationStatus === 'provisional' || s.verificationStatus === 'discovery_lead');

  let md = '';

  if (isZh) {
    md += `# ${project.title}\n`;
    if (project.subtitle) md += `### ${project.subtitle}\n\n`;
    md += `**核心研究問題 (Research Question)**：${project.researchQuestion}\n\n`;
    md += `**斷代範圍 (Date Range)**：公元 ${project.dateRange.startYear} 年 至 公元 ${project.dateRange.endYear} 年\n\n`;
    md += `**方法論與界限備忘 (Methodology & Scope)**：\n${project.methodologyNote || '以歷史批判文獻學方法，嚴格基於權威批判校勘本之經文選段與精確出處，建構概念傳播與轉化之實證譜系。'}\n\n`;
    md += `---\n\n`;

    md += `## 1. 考據證據登記冊 (Evidence Register)\n\n`;
    if (evidenceCards.length === 0) {
      md += `*尚無已登錄之考據證據卡。*\n\n`;
    } else {
      evidenceCards.forEach((ec, idx) => {
        const srcPassage = passages.find(p => p.id === ec.sourcePassageId);
        const tgtPassage = passages.find(p => p.id === ec.targetPassageId);
        const srcSource = srcPassage ? sources.find(s => s.id === srcPassage.sourceId) : null;
        const tgtSource = tgtPassage ? sources.find(s => s.id === tgtPassage.sourceId) : null;

        md += `### 證據卡 [EC-${idx + 1}]: ${ec.sourceConcept} ${ec.targetConcept ? `→ ${ec.targetConcept}` : ''}\n`;
        md += `- **關聯類型**: ${ec.relationType}\n`;
        md += `- **可信度**: ${ec.confidence.toUpperCase()}\n`;
        md += `- **查證狀態**: ${ec.verificationStatus}\n`;
        md += `- **確切章節出處**: ${ec.exactLocators.join(', ') || '未指定'}\n`;
        if (srcSource) md += `- **來源文獻**: ${srcSource.author}, *${srcSource.workTitle}* (${srcPassage?.passageLocator || ''})\n`;
        if (tgtSource) md += `- **對照文獻**: ${tgtSource.author}, *${tgtSource.workTitle}* (${tgtPassage?.passageLocator || ''})\n`;
        md += `- **原文引證 (Primary Excerpt)**:\n> ${ec.evidenceExcerpt || (srcPassage ? srcPassage.originalText : '無')}\n\n`;
        md += `- **學者考據論述 (Scholar Rationale)**: ${ec.researcherExplanation}\n`;
        if (ec.aiInterpretation) {
          md += `- **[AI 詮釋標記]**: ${ec.aiInterpretation}\n`;
        }
        if (ec.reviewerNotes) {
          md += `- **同儕審查註記**: ${ec.reviewerNotes}\n`;
        }
        md += `\n`;
      });
    }

    md += `## 2. 原始經文快照與加密校驗 (Passage Snapshots)\n\n`;
    passages.forEach((p, idx) => {
      const src = sources.find(s => s.id === p.sourceId);
      md += `### 選段 ${idx + 1}: ${src ? `${src.author}, *${src.workTitle}*` : '未知出處'} [${p.passageLocator}]\n`;
      md += `- **校驗碼 (Checksum)**: \`${p.snapshot.sourceChecksum}\` (${p.snapshot.importedAt})\n`;
      md += `- **概念標籤**: ${p.concepts.join(', ')}\n`;
      md += `- **原文**: \n> ${p.originalText}\n\n`;
      md += `- **翻譯**: \n> ${p.translationText}\n\n`;
    });

    md += `## 3. 權威文獻書目 (Verified Critical Bibliography)\n`;
    md += `*(依據學術規範，僅包含通過實證審查 [Attested] 之批判校勘本，已自動排除暫定與探索來源)*\n\n`;
    if (verifiedSources.length === 0) {
      md += `*尚無通過實證審查之文獻。*\n\n`;
    } else {
      verifiedSources.forEach(s => {
        md += `- **${s.author}**. *${s.workTitle}*. ${s.edition}. ${s.clavisId ? `[${s.clavisId}]` : ''} ${s.tlgId ? `[${s.tlgId}]` : ''}\n`;
        if (s.bibliographyCitation) md += `  - *規範引用格式*: ${s.bibliographyCitation}\n`;
      });
      md += `\n`;
    }

    if (secondaryLiterature.length > 0) {
      md += `## 四、現代二手考證文獻與學術引文立場 (OpenAlex / Crossref / Scite.ai)\n\n`;
      secondaryLiterature.forEach(sl => {
        md += `### ${sl.title} (${sl.year || 'N/A'})\n`;
        md += `- **作者**: ${sl.authors.join(', ')}\n`;
        md += `- **發表期刊/文集**: *${sl.venue}*\n`;
        if (sl.doi) md += `- **DOI**: https://doi.org/${sl.doi}\n`;
        md += `- **負責任審查裁決**: ${sl.responsibleVerdict}\n`;
        if (sl.sciteTallies) {
          md += `- **Scite.ai 智慧引文立場**: 支持: ${sl.sciteTallies.supporting} | 提及: ${sl.sciteTallies.mentioning} | 提出異議/爭議: ${sl.sciteTallies.contrasting} (總引文數: ${sl.sciteTallies.total})\n`;
        }
        if (sl.researcherNotes) {
          md += `- **學者批判備忘**: ${sl.researcherNotes}\n`;
        }
        md += `\n`;
      });
    }

    if (provisionalSources.length > 0) {
      md += `## 附錄：暫定與待核實來源清單 (Provisional & Discovery Appendix)\n`;
      md += `*(以下項目尚未完成批判校勘本雙重對校，不得引為定論根據)*\n\n`;
      provisionalSources.forEach(s => {
        md += `- **[${s.verificationStatus.toUpperCase()}]** ${s.author}, *${s.workTitle}* (${s.sourceProvider}) — 備註: ${s.researcherNotes || '待核實'}\n`;
      });
      md += `\n`;
    }
  } else {
    // English Markdown
    md += `# ${project.title}\n`;
    if (project.subtitle) md += `### ${project.subtitle}\n\n`;
    md += `**Research Question**: ${project.researchQuestion}\n\n`;
    md += `**Chronological Scope**: ${project.dateRange.startYear} CE to ${project.dateRange.endYear} CE\n\n`;
    md += `**Methodology & Scope Note**:\n${project.methodologyNote || 'Historical-critical genealogy bound to critical edition passage locators without ungrounded extrapolation.'}\n\n`;
    md += `---\n\n`;

    md += `## 1. Source-Attested Evidence Register\n\n`;
    if (evidenceCards.length === 0) {
      md += `*No evidence cards registered in this dossier.*\n\n`;
    } else {
      evidenceCards.forEach((ec, idx) => {
        const srcPassage = passages.find(p => p.id === ec.sourcePassageId);
        const tgtPassage = passages.find(p => p.id === ec.targetPassageId);
        const srcSource = srcPassage ? sources.find(s => s.id === srcPassage.sourceId) : null;
        const tgtSource = tgtPassage ? sources.find(s => s.id === tgtPassage.sourceId) : null;

        md += `### Evidence Card [EC-${idx + 1}]: ${ec.sourceConcept} ${ec.targetConcept ? `→ ${ec.targetConcept}` : ''}\n`;
        md += `- **Relation Type**: ${ec.relationType}\n`;
        md += `- **Confidence**: ${ec.confidence.toUpperCase()}\n`;
        md += `- **Status**: ${ec.verificationStatus}\n`;
        md += `- **Locators**: ${ec.exactLocators.join(', ') || 'N/A'}\n`;
        if (srcSource) md += `- **Source Work**: ${srcSource.author}, *${srcSource.workTitle}* (${srcPassage?.passageLocator || ''})\n`;
        if (tgtSource) md += `- **Target Work**: ${tgtSource.author}, *${tgtSource.workTitle}* (${tgtPassage?.passageLocator || ''})\n`;
        md += `- **Verbatim Excerpt**:\n> ${ec.evidenceExcerpt || (srcPassage ? srcPassage.originalText : 'N/A')}\n\n`;
        md += `- **Researcher Explanation**: ${ec.researcherExplanation}\n`;
        if (ec.aiInterpretation) {
          md += `- **[AI Model Interpretation]**: ${ec.aiInterpretation}\n`;
        }
        if (ec.reviewerNotes) {
          md += `- **Reviewer Notes**: ${ec.reviewerNotes}\n`;
        }
        md += `\n`;
      });
    }

    md += `## 2. Primary Passage Snapshots & Immutable Hashes\n\n`;
    passages.forEach((p, idx) => {
      const src = sources.find(s => s.id === p.sourceId);
      md += `### Passage ${idx + 1}: ${src ? `${src.author}, *${src.workTitle}*` : 'Unknown Source'} [${p.passageLocator}]\n`;
      md += `- **Checksum**: \`${p.snapshot.sourceChecksum}\` (${p.snapshot.importedAt})\n`;
      md += `- **Concepts**: ${p.concepts.join(', ')}\n`;
      md += `- **Original Text**: \n> ${p.originalText}\n\n`;
      md += `- **Translation**: \n> ${p.translationText}\n\n`;
    });

    md += `## 3. Verified Critical Bibliography\n`;
    md += `*(Excludes provisional and discovery records per academic standards)*\n\n`;
    if (verifiedSources.length === 0) {
      md += `*No fully verified attested critical sources in registry.*\n\n`;
    } else {
      verifiedSources.forEach(s => {
        md += `- **${s.author}**. *${s.workTitle}*. ${s.edition}. ${s.clavisId ? `[${s.clavisId}]` : ''} ${s.tlgId ? `[${s.tlgId}]` : ''}\n`;
        if (s.bibliographyCitation) md += `  - *Citation*: ${s.bibliographyCitation}\n`;
      });
      md += `\n`;
    }

    if (secondaryLiterature.length > 0) {
      md += `## 4. Verified Secondary Literature & Scite Smart Citations\n\n`;
      secondaryLiterature.forEach(sl => {
        md += `### ${sl.title} (${sl.year || 'N/A'})\n`;
        md += `- **Authors**: ${sl.authors.join(', ')}\n`;
        md += `- **Venue**: *${sl.venue}*\n`;
        if (sl.doi) md += `- **DOI**: https://doi.org/${sl.doi}\n`;
        md += `- **Responsible Audit Verdict**: ${sl.responsibleVerdict}\n`;
        if (sl.sciteTallies) {
          md += `- **Scite Citations**: Supporting: ${sl.sciteTallies.supporting} | Mentioning: ${sl.sciteTallies.mentioning} | Contrasting: ${sl.sciteTallies.contrasting} (Total: ${sl.sciteTallies.total})\n`;
        }
        if (sl.researcherNotes) {
          md += `- **Scholar Notes**: ${sl.researcherNotes}\n`;
        }
        md += `\n`;
      });
    }

    if (provisionalSources.length > 0) {
      md += `## Appendix: Provisional & Discovery Records\n`;
      md += `*(Pending critical apparatus collation)*\n\n`;
      provisionalSources.forEach(s => {
        md += `- **[${s.verificationStatus.toUpperCase()}]** ${s.author}, *${s.workTitle}* (${s.sourceProvider}) — Note: ${s.researcherNotes || 'None'}\n`;
      });
      md += `\n`;
    }
  }

  return md;
}

export function generateHtmlDossier(
  project: ResearchProject,
  sources: SourceRecord[],
  passages: Passage[],
  evidenceCards: EvidenceCard[],
  locale: 'en' | 'zh-Hant' = 'en',
  secondaryLiterature: VerifiedSecondaryLiterature[] = []
): string {
  return generatePrintableHtml(project, sources, passages, evidenceCards, locale, secondaryLiterature);
}

export function generatePrintableHtml(
  project: ResearchProject,
  sources: SourceRecord[],
  passages: Passage[],
  evidenceCards: EvidenceCard[],
  locale: 'en' | 'zh-Hant' = 'en',
  secondaryLiterature: VerifiedSecondaryLiterature[] = []
): string {
  const isZh = locale === 'zh-Hant';
  const verifiedSources = sources.filter(s => s.verificationStatus === 'attested');
  const provisionalSources = sources.filter(s => s.verificationStatus === 'provisional' || s.verificationStatus === 'discovery_lead');

  return `<!DOCTYPE html>
<html lang="${locale}">
<head>
  <meta charset="utf-8" />
  <title>${project.title} - Scholarly Research Dossier</title>
  <style>
    @media print {
      body { font-size: 11pt; }
      .no-print { display: none; }
      .page-break { page-break-before: always; }
    }
    body {
      font-family: 'Cinzel', 'EB Garamond', 'Baskerville', 'Times New Roman', serif;
      line-height: 1.6;
      color: #1a1a1a;
      max-width: 860px;
      margin: 0 auto;
      padding: 40px 24px;
      background: #fff;
    }
    h1 { font-size: 24pt; margin-bottom: 4px; border-bottom: 2px solid #2d3748; padding-bottom: 8px; }
    h2 { font-size: 16pt; margin-top: 28px; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; color: #1e293b; }
    h3 { font-size: 13pt; margin-top: 20px; color: #334155; }
    blockquote {
      margin: 12px 0;
      padding: 8px 16px;
      background: #f8fafc;
      border-left: 4px solid #94a3b8;
      font-style: italic;
    }
    .badge {
      display: inline-block;
      padding: 2px 8px;
      font-size: 8pt;
      font-family: sans-serif;
      font-weight: 600;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .badge-attested { background: #dcfce7; color: #166534; }
    .badge-provisional { background: #fef9c3; color: #854d0e; }
    .badge-discovery { background: #e0f2fe; color: #075985; }
    .meta-table { width: 100%; border-collapse: collapse; margin: 16px 0; font-size: 10pt; }
    .meta-table th, .meta-table td { border: 1px solid #e2e8f0; padding: 6px 10px; text-align: left; }
    .meta-table th { background: #f1f5f9; }
    .footer-note { margin-top: 40px; padding-top: 12px; border-top: 1px solid #cbd5e1; font-size: 9pt; color: #64748b; }
  </style>
</head>
<body>
  <h1>${project.title}</h1>
  ${project.subtitle ? `<p style="font-size: 14pt; color: #475569; margin-top: 0;">${project.subtitle}</p>` : ''}
  
  <table class="meta-table">
    <tr>
      <th style="width: 25%;">${isZh ? '研究問題' : 'Research Question'}</th>
      <td>${project.researchQuestion}</td>
    </tr>
    <tr>
      <th>${isZh ? '斷代界限' : 'Chronological Scope'}</th>
      <td>${project.dateRange.startYear} CE — ${project.dateRange.endYear} CE</td>
    </tr>
    <tr>
      <th>${isZh ? '方法論' : 'Methodology'}</th>
      <td>${project.methodologyNote || (isZh ? '文獻批判校勘與實證譜系' : 'Historical-critical source collation')}</td>
    </tr>
  </table>

  <h2>${isZh ? '一、考據證據卡登記冊' : 'I. Source-Attested Evidence Register'}</h2>
  ${evidenceCards.length === 0 ? `<p><em>${isZh ? '暫無證據卡' : 'No evidence cards registered.'}</em></p>` : evidenceCards.map((ec, idx) => `
    <div style="border: 1px solid #cbd5e1; border-radius: 6px; padding: 12px; margin-bottom: 16px;">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h3 style="margin: 0;">[EC-${idx + 1}] ${ec.sourceConcept} ${ec.targetConcept ? `&rarr; ${ec.targetConcept}` : ''}</h3>
        <span class="badge badge-${ec.verificationStatus}">${ec.verificationStatus}</span>
      </div>
      <p style="margin: 6px 0; font-size: 10pt;">
        <strong>${isZh ? '關聯類型' : 'Relation'}:</strong> ${ec.relationType} | 
        <strong>${isZh ? '可信度' : 'Confidence'}:</strong> ${ec.confidence} | 
        <strong>${isZh ? '章節' : 'Locators'}:</strong> ${ec.exactLocators.join(', ') || 'N/A'}
      </p>
      <blockquote>${ec.evidenceExcerpt}</blockquote>
      <p style="margin: 6px 0;"><strong>${isZh ? '學者考據論述' : 'Scholar Rationale'}:</strong> ${ec.researcherExplanation}</p>
      ${ec.aiInterpretation ? `<p style="margin: 6px 0; color: #1e3a8a;"><strong>${isZh ? '[AI 詮釋標記]' : '[AI Model Interpretation]'}:</strong> ${ec.aiInterpretation}</p>` : ''}
    </div>
  `).join('')}

  <div class="page-break"></div>

  <h2>${isZh ? '二、原始經文快照與不可篡改校驗' : 'II. Primary Passage Snapshots'}</h2>
  ${passages.map((p, idx) => {
    const s = sources.find(src => src.id === p.sourceId);
    return `
      <div style="margin-bottom: 20px;">
        <h3>${idx + 1}. ${s ? `${s.author}, <em>${s.workTitle}</em>` : 'Source'} [${p.passageLocator}]</h3>
        <p style="font-size: 9pt; color: #64748b; margin: 2px 0;">
          Checksum: <code>${p.snapshot.sourceChecksum}</code> | Concepts: ${p.concepts.join(', ')}
        </p>
        <blockquote style="font-family: 'Times New Roman', serif;">${p.originalText}</blockquote>
        <p style="margin-top: 4px;"><strong>${isZh ? '翻譯' : 'Translation'}:</strong> ${p.translationText}</p>
      </div>
    `;
  }).join('')}

  <h2>${isZh ? '三、權威文獻書目 (僅限已實證)' : 'III. Verified Critical Bibliography'}</h2>
  <ul>
    ${verifiedSources.map(s => `
      <li style="margin-bottom: 8px;">
        <strong>${s.author}</strong>. <em>${s.workTitle}</em>. ${s.edition}.
        ${s.clavisId ? `[${s.clavisId}]` : ''} ${s.tlgId ? `[${s.tlgId}]` : ''}
        ${s.bibliographyCitation ? `<br><span style="font-size: 9pt; color: #475569;">${s.bibliographyCitation}</span>` : ''}
      </li>
    `).join('')}
  </ul>

  ${secondaryLiterature.length > 0 ? `
    <h2>${isZh ? '四、現代二手考證文獻與 Scite.ai 智慧引文立場' : 'IV. Verified Secondary Literature & Scite Smart Citations'}</h2>
    <ul>
      ${secondaryLiterature.map(sl => `
        <li style="margin-bottom: 10px;">
          <strong>${sl.title}</strong> (${sl.year || 'N/A'}) — ${sl.authors.join(', ')}<br>
          <em>${sl.venue}</em> ${sl.doi ? `| DOI: ${sl.doi}` : ''}<br>
          <span style="font-size: 9pt; color: #475569;">
            Verdict: <strong>${sl.responsibleVerdict}</strong>
            ${sl.sciteTallies ? ` | Supporting: ${sl.sciteTallies.supporting}, Mentioning: ${sl.sciteTallies.mentioning}, Contrasting: ${sl.sciteTallies.contrasting} (Total: ${sl.sciteTallies.total})` : ''}
          </span>
          ${sl.researcherNotes ? `<br><span style="font-size: 9pt; color: #334155;"><em>Note: ${sl.researcherNotes}</em></span>` : ''}
        </li>
      `).join('')}
    </ul>
  ` : ''}

  ${provisionalSources.length > 0 ? `
    <h2>${isZh ? '附錄：暫定與探索性記錄' : 'Appendix: Provisional & Discovery Sources'}</h2>
    <ul>
      ${provisionalSources.map(s => `
        <li style="margin-bottom: 6px;">
          <span class="badge badge-${s.verificationStatus}">${s.verificationStatus}</span>
          <strong>${s.author}</strong>, <em>${s.workTitle}</em> (${s.sourceProvider}) — ${s.researcherNotes || 'Pending verification'}
        </li>
      `).join('')}
    </ul>
  ` : ''}

  <div class="footer-note">
    <p>Generated by <strong>Patristic Concept Atlas</strong> on ${new Date().toLocaleDateString()}. Compliant with academic source-attested provenance rules.</p>
  </div>
</body>
</html>`;
}
