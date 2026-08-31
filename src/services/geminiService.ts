import { GoogleGenAI } from '@google/genai';
import { Passage, SourceRecord, EvidenceCard, BoundedAiAnalysisResult, Locale } from '../types';

const SESSION_STORAGE_KEY = 'patristic_researcher_gemini_key';

export function getSessionApiKey(): string | null {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem(SESSION_STORAGE_KEY);
}

export function setSessionApiKey(key: string): void {
  if (typeof window === 'undefined') return;
  sessionStorage.setItem(SESSION_STORAGE_KEY, key.trim());
}

export function clearSessionApiKey(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(SESSION_STORAGE_KEY);
}

export async function validateApiKey(apiKey: string): Promise<{ valid: boolean; message?: string }> {
  if (!apiKey || apiKey.trim().length < 10) {
    return { valid: false, message: 'API key format is invalid.' };
  }

  try {
    const ai = new GoogleGenAI({ apiKey: apiKey.trim() });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: 'Ping: Respond with single word "OK" for API authentication test.',
      config: {
        maxOutputTokens: 10,
        temperature: 0.1,
      }
    });

    if (response && response.text) {
      return { valid: true };
    }
    return { valid: false, message: 'Empty response received during validation.' };
  } catch (err: any) {
    return {
      valid: false,
      message: err?.message || 'Failed to authenticate with Google Gemini API.'
    };
  }
}

export interface BoundedPassageAnalysisOutput {
  synthesis: string;
  citedPassages: Array<{
    locator: string;
    exactQuote: string;
    relevance: string;
  }>;
  proposedRelationships: Array<{
    sourceLocator: string;
    targetLocator: string;
    sourceConcept: string;
    targetConcept: string;
    relationType: string;
    confidence: string;
    rationale: string;
  }>;
  limitations: string;
  cautionFlags: string;
  timestamp: string;
}

export async function runBoundedPassageAnalysis(
  selectedPassages: Passage[],
  sources: SourceRecord[],
  evidenceCards: EvidenceCard[],
  prompt: string,
  apiKey: string,
  locale: Locale
): Promise<{ success: boolean; result?: BoundedPassageAnalysisOutput; error?: string }> {
  if (!apiKey) {
    return { success: false, error: 'No API key provided.' };
  }

  if (selectedPassages.length === 0) {
    return { success: false, error: 'No passages selected for analysis.' };
  }

  const isZh = locale === 'zh-Hant';

  const corpusText = selectedPassages.map((p, idx) => {
    const s = sources.find(src => src.id === p.sourceId);
    return `
--- PASSAGE [ID: ${p.id}] ---
Author: ${s?.author || 'Unknown'} (Tradition: ${s?.authorTradition || 'Unknown'})
Work: ${s?.workTitle || 'Unknown'} (Locator: ${p.passageLocator})
Critical Edition: ${s?.edition || 'Critical apparatus'} (Clavis: ${s?.clavisId || 'N/A'}, TLG: ${s?.tlgId || 'N/A'})
Original Text (${s?.originalLanguage || 'grc/la'}):
${p.originalText}
Translation (${p.translationLanguage}):
${p.translationText || 'N/A'}
Concepts Tagged: ${p.concepts.join(', ')}
Verification Status: ${p.verificationStatus}
`;
  }).join('\n');

  const cardsText = evidenceCards.map(ec => `
- Evidence Card [${ec.id}]: ${ec.sourceConcept} -> ${ec.targetConcept || ''} (${ec.relationType}, confidence: ${ec.confidence})
  Locators: ${ec.exactLocators.join(', ')}
  Excerpt: ${ec.evidenceExcerpt}
  Researcher Rationale: ${ec.researcherExplanation}
`).join('\n');

  const systemInstruction = `You are a rigorous Patristic Scholar and Philologist specializing in early Christian concepts (1st-8th century CE).
ACADEMIC INTEGRITY BOUNDS:
1. You may ONLY make claims strictly grounded in the provided primary source passages below.
2. NEVER fabricate quotations, locators, historical connections, editions, or influences.
3. Distinguish clearly between direct textual evidence and scholarly inference.
4. If a connection is only a thematic parallel and not a demonstrated textual influence, tag it as a parallel/resonance rather than direct lineage.
5. If the evidence is insufficient, explicitly state what is missing and what manuscript/edition checks are required.
${isZh ? '6. OUTPUT LANGUAGE REQUIREMENT: Write in elegant, fluent, native academic Traditional Chinese (香港與台灣學術規範，如「教父學」、「源文依據」、「校勘本」、「克拉維斯 (Clavis) 編號」、「欲念 (concupiscentia)」、「神化 (theosis)」、「聖言 (Logos)」等規範術語，避免生硬英漢直譯語法）。' : '6. Write in high-level scholarly English.'}

Return valid JSON conforming to this schema:
{
  "synthesis": "string",
  "citedPassages": [
    {
      "locator": "string",
      "exactQuote": "string",
      "relevance": "string"
    }
  ],
  "proposedRelationships": [
    {
      "sourceLocator": "string",
      "targetLocator": "string",
      "sourceConcept": "string",
      "targetConcept": "string",
      "relationType": "direct_citation" | "explicit_interpretation" | "lexical_continuity" | "translation_interpretation" | "conceptual_development" | "inversion_rejection" | "parallel_resonance" | "reception_reuse" | "disputed_proposal",
      "confidence": "high" | "medium" | "low",
      "rationale": "string"
    }
  ],
  "limitations": "string",
  "cautionFlags": "string"
}`;

  const userPrompt = `
RESEARCH QUESTION / PROMPT: "${prompt}"

PRIMARY SOURCE PASSAGES IN EVIDENCE CORPUS:
${corpusText}

ATTACHED EVIDENCE CARDS:
${cardsText || 'No attached evidence cards yet.'}

Analyze the primary evidence bounded strictly by these texts. Return JSON only.`;

  try {
    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: userPrompt,
      config: {
        systemInstruction,
        temperature: 0.2,
        responseMimeType: 'application/json',
      }
    });

    const responseText = response.text || '{}';
    let parsed: any;
    try {
      parsed = JSON.parse(responseText);
    } catch {
      const cleaned = responseText.replace(/```json\n?|```/g, '').trim();
      parsed = JSON.parse(cleaned);
    }

    return {
      success: true,
      result: {
        synthesis: parsed.synthesis || 'Synthesis complete.',
        citedPassages: Array.isArray(parsed.citedPassages) ? parsed.citedPassages : [],
        proposedRelationships: Array.isArray(parsed.proposedRelationships) ? parsed.proposedRelationships : [],
        limitations: parsed.limitations || 'Analysis bounded strictly by provided corpus.',
        cautionFlags: parsed.cautionFlags || 'All claims require manual verification against critical editions.',
        timestamp: new Date().toISOString()
      }
    };
  } catch (err: any) {
    return {
      success: false,
      error: `Analysis failure: ${err.message || 'Unknown network or API error'}`
    };
  }
}

export async function runBoundedAnalysis(params: {
  analysisType: 'passage' | 'comparison' | 'evidence_explanation' | 'synthesis' | 'gap_identification';
  projectQuestion: string;
  selectedPassages: Passage[];
  sources: SourceRecord[];
  evidenceCards: EvidenceCard[];
  locale: Locale;
  customPromptInstruction?: string;
}): Promise<BoundedAiAnalysisResult> {
  const apiKey = getSessionApiKey();
  if (!apiKey) {
    throw new Error('MISSING_API_KEY: No researcher API key found in browser session storage.');
  }

  const res = await runBoundedPassageAnalysis(
    params.selectedPassages,
    params.sources,
    params.evidenceCards,
    params.projectQuestion,
    apiKey,
    params.locale
  );

  if (!res.success || !res.result) {
    throw new Error(res.error || 'Failed to generate bounded analysis');
  }

  const evidenceUsed = params.selectedPassages.map(p => {
    const s = params.sources.find(src => src.id === p.sourceId);
    return {
      passageId: p.id,
      author: s?.author || 'Unknown',
      work: s?.workTitle || 'Unknown',
      locator: p.passageLocator,
      verbatimExcerpt: p.originalText.slice(0, 160) + (p.originalText.length > 160 ? '...' : ''),
      verificationStatus: p.verificationStatus
    };
  });

  return {
    analysisType: params.analysisType,
    projectQuestion: params.projectQuestion,
    timestamp: new Date().toISOString(),
    evidenceUsed,
    claimsSupported: res.result.citedPassages.map(cp => ({
      claim: cp.relevance,
      supportStrength: 'strong',
      groundedInPassageIds: [cp.locator]
    })),
    unresolvedQuestions: [res.result.limitations],
    claimsRequiringVerification: [res.result.cautionFlags],
    scholarlySynthesis: res.result.synthesis,
    methodologicalLimitations: res.result.limitations
  };
}
