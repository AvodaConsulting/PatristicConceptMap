import React, { useState } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { runBoundedPassageAnalysis, getSessionApiKey } from '../../services/geminiService';
import { BoundedAiAnalysisResult, EvidenceCard } from '../../types';
import { SAMPLE_AI_ANALYSES } from '../../data/patristicCatalog';
import { 
  Sparkles, 
  Key, 
  BookOpen, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  FileCheck2, 
  ArrowRight,
  RefreshCw,
  Plus,
  Zap,
  ShieldCheck
} from 'lucide-react';

interface BoundedAiAnalysisProps {
  onOpenApiKeyModal: () => void;
  onOpenAddCard: (initialData?: Partial<EvidenceCard>) => void;
  onNavigateToLiterature?: () => void;
}

export const BoundedAiAnalysis: React.FC<BoundedAiAnalysisProps> = ({
  onOpenApiKeyModal,
  onOpenAddCard,
  onNavigateToLiterature
}) => {
  const { t, locale } = useI18n();
  const { 
    currentProject, 
    sources, 
    passages, 
    evidenceCards, 
    selectedPassageIds, 
    togglePassageSelection, 
    selectAllPassages, 
    clearPassageSelection,
    saveEvidenceCard
  } = useProject();

  const [researchPrompt, setResearchPrompt] = useState(
    currentProject?.researchQuestion || 'Compare the lexical usage of concupiscentia/epithumia and their relationship to will and grace across the selected patristic passages.'
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<BoundedAiAnalysisResult | null>(null);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  if (!currentProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-stone-400">
        <p>{locale === 'zh-Hant' ? '請先於工作區建立或選定研究專案。' : 'Please create or select a research project in the Workspace tab.'}</p>
      </div>
    );
  }

  const apiKey = getSessionApiKey();
  const selectedPassages = passages.filter(p => selectedPassageIds.includes(p.id));

  const handleRunAnalysis = async () => {
    if (!apiKey) {
      onOpenApiKeyModal();
      return;
    }

    if (selectedPassages.length === 0) {
      setAnalysisError(locale === 'zh-Hant' ? '請至少選取一段經文以進行源文約束考析。' : 'Please select at least one passage for bounded analysis.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    const relevantSources = sources.filter(s => selectedPassages.some(p => p.sourceId === s.id));

    const result = await runBoundedPassageAnalysis(
      selectedPassages,
      relevantSources,
      evidenceCards,
      researchPrompt,
      apiKey,
      locale
    );

    if (result.success && result.result) {
      setAnalysisResult(result.result);
    } else {
      setAnalysisError(result.error || 'Failed to complete analysis. Please verify your API key and network.');
    }

    setIsAnalyzing(false);
  };

  const handleLoadSampleAnalysis = () => {
    const key = currentProject.curatedPacketId || currentProject.id;
    const sample = SAMPLE_AI_ANALYSES[key] || SAMPLE_AI_ANALYSES['curated-concupiscence-grace'];
    if (sample) {
      setAnalysisResult(sample.result as any);
      setAnalysisError(null);
    }
  };

  const handleCreateCardFromProposed = async (prop: any) => {
    const srcPassage = passages.find(p => p.passageLocator.includes(prop.sourceLocator) || prop.sourceLocator.includes(p.passageLocator)) || selectedPassages[0];
    const tgtPassage = passages.find(p => p.passageLocator.includes(prop.targetLocator) || prop.targetLocator.includes(p.passageLocator));

    const newCard: EvidenceCard = {
      id: `ec-ai-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId: currentProject.id,
      sourcePassageId: srcPassage ? srcPassage.id : selectedPassages[0].id,
      targetPassageId: tgtPassage ? tgtPassage.id : undefined,
      sourceConcept: prop.sourceConcept || 'Concupiscentia / Desire',
      targetConcept: prop.targetConcept || 'Gratia / Grace',
      sourceNodeId: srcPassage ? `p-${srcPassage.id}` : `p-${selectedPassages[0].id}`,
      targetNodeId: tgtPassage ? `p-${tgtPassage.id}` : `c-${(prop.sourceConcept || 'concept').toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
      exactLocators: [prop.sourceLocator, prop.targetLocator].filter(Boolean),
      relationType: (prop.relationType as any) || 'explicit_interpretation',
      confidence: (prop.confidence as any) || 'medium',
      evidenceExcerpt: srcPassage ? srcPassage.originalText.slice(0, 150) : '',
      researcherExplanation: `[Researcher verified from AI synthesis]: ${prop.rationale}`,
      aiInterpretation: prop.rationale,
      verificationStatus: 'provisional',
      cautionNote: 'Formulated during bounded LLM hermeneutic pass; requires final manual collation with critical apparatus.',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveEvidenceCard(newCard);
    alert(locale === 'zh-Hant' ? '已成功將 AI 考據轉化為暫定證據卡！' : 'Successfully saved as a Provisional Evidence Card!');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D1CEBD] pb-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-[#8B7E66]" />
            <span>{t.nav.boundedAi}</span>
          </h1>
          <p className="text-xs text-[#666155] mt-0.5">
            {locale === 'zh-Hant'
              ? '源文約束神學考析：嚴格限定於所選經文與實證卡，絕不虛構出處或外部引文'
              : 'Hermeneutic analysis strictly bounded to selected passages. Zero ungrounded hallucination allowed.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {onNavigateToLiterature && (
            <button
              onClick={onNavigateToLiterature}
              className="px-3.5 py-1.5 text-xs font-medium text-[#1A1A1A] bg-[#E5D5B0]/30 hover:bg-[#E5D5B0]/60 border border-[#8B7E66]/40 rounded flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#8B7E66]" />
              <span>{locale === 'zh-Hant' ? 'Scite/OpenAlex 外部考證' : 'Literature Verification'}</span>
            </button>
          )}

          {!apiKey ? (
            <button
              onClick={onOpenApiKeyModal}
              className="px-3.5 py-1.5 text-xs font-medium text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#F1EDE4] border border-[#D1CEBD] rounded flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Key className="w-3.5 h-3.5 text-[#8B7E66]" />
              <span>{t.actions.apiKeySettings}</span>
            </button>
          ) : (
            <button
              onClick={onOpenApiKeyModal}
              className="px-3 py-1.5 text-xs font-mono text-[#065F46] bg-[#ECFDF5] border border-[#A7F3D0] rounded flex items-center gap-1.5 font-bold"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669]" />
              <span>SESSION KEY ACTIVE</span>
            </button>
          )}
        </div>
      </div>

      {/* Non-Negotiable Academic Warning */}
      <div className="bg-[#FEF3C7] border border-[#FDE68A] rounded-lg p-4 text-xs text-[#92400E] flex items-start gap-3 shadow-xs">
        <ShieldAlert className="w-5 h-5 text-[#B45309] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-serif font-bold text-[#78350F]">
            {locale === 'zh-Hant' ? '學術誠信原則：大語言模型輸出僅為詮釋，絕非原始證據' : 'Academic Integrity Rule: LLM output is interpretation, never primary evidence.'}
          </p>
          <p className="text-[#92400E] text-[11px] leading-relaxed">
            {locale === 'zh-Hant'
              ? '本考析引擎僅接收下方您親自選定的真實文獻經文。所有生成的學術陳述均須標註對應的經文選段號。研究者應當對所有推論進行二次校勘。'
              : 'The model is provided only with the primary texts and evidence cards you explicitly select below. Every claim is tagged with locators.'}
          </p>
        </div>
      </div>

      {/* Selected Passages Selector Card */}
      <div className="bg-white border border-[#D1CEBD] rounded-lg p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1EDE4] pb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-[#8B7E66]" />
            <h2 className="text-sm font-serif font-bold text-[#1A1A1A]">
              {locale === 'zh-Hant' ? '考析語料範疇：選取經文選段' : 'Analysis Corpus: Select Target Passages'}
            </h2>
            <span className="text-xs font-mono font-bold text-[#1A1A1A] bg-[#FAF8F5] px-2 py-0.5 rounded border border-[#D1CEBD]">
              {selectedPassageIds.length} / {passages.length} {locale === 'zh-Hant' ? '已選取' : 'Selected'}
            </span>
          </div>

          <div className="flex items-center gap-2 text-xs text-[#8B7E66] font-mono">
            <button onClick={selectAllPassages} className="hover:text-[#1A1A1A] underline text-[11px]">
              {locale === 'zh-Hant' ? '全選' : 'Select All'}
            </button>
            <span>·</span>
            <button onClick={clearPassageSelection} className="hover:text-[#1A1A1A] underline text-[11px]">
              {locale === 'zh-Hant' ? '清除' : 'Clear'}
            </button>
          </div>
        </div>

        {passages.length === 0 ? (
          <p className="text-xs text-[#8B7E66] italic">
            {locale === 'zh-Hant' ? '專案尚無經文選段。請先至「經文閱讀」新增。' : 'No passages available. Please add passages first.'}
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5 max-h-56 overflow-y-auto pr-1">
            {passages.map(p => {
              const src = sources.find(s => s.id === p.sourceId);
              const isSelected = selectedPassageIds.includes(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => togglePassageSelection(p.id)}
                  className={`p-2.5 rounded border text-xs cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-[#FAF8F5] border-[#1A1A1A] text-[#1A1A1A] ring-1 ring-[#1A1A1A]'
                      : 'bg-white border-[#D1CEBD] text-[#666155] hover:border-[#8B7E66]'
                  }`}
                >
                  <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                    <span className="font-bold text-[#1A1A1A] truncate">{src?.author}</span>
                    <span className="text-[#8B7E66]">{p.passageLocator}</span>
                  </div>
                  <p className="font-serif italic text-[11px] line-clamp-2 text-[#4A453A]">
                    "{p.originalText}"
                  </p>
                </div>
              );
            })}
          </div>
        )}

        {/* Research Question / Prompt */}
        <div className="space-y-2 pt-2 border-t border-[#F1EDE4]">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
              {locale === 'zh-Hant' ? '研究問題或比較分析提示 (Research Question / Prompt)' : 'Specific Research Question'}
            </label>
            <span className="text-[11px] text-[#8B7E66] font-serif italic">
              {locale === 'zh-Hant' ? '可選用下拉預設或自行調整' : 'Select a preset or customize'}
            </span>
          </div>

          <div className="p-2.5 bg-[#FAF8F5] border border-[#D1CEBD] rounded space-y-1">
            <label className="block text-[11px] font-bold text-[#666155] uppercase tracking-wider">
              {locale === 'zh-Hant' ? '經典研究問題下拉範本 (Inquiry Template Presets)' : 'Scholarly Inquiry Presets'}
            </label>
            <select
              onChange={(e) => {
                if (e.target.value) {
                  setResearchPrompt(e.target.value);
                }
              }}
              className="w-full bg-white border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="">{locale === 'zh-Hant' ? '-- 選擇考析問題範本 (自動填入下方提示) --' : '-- Select Research Inquiry Template --'}</option>
              <option value={locale === 'zh-Hant'
                ? '比較所選教父經文在「慾念 (concupiscentia/epithumia)」與「自由意志／恩典」概念上的詞彙用法、語義位移與神學人論分歧。'
                : 'Compare the lexical usage of concupiscentia/epithumia and their relationship to will and grace across the selected patristic passages.'}>
                {locale === 'zh-Hant' ? '1. 語義流變：慾念、意志與恩典之概念位移' : '1. Lexical Shift: Concupiscence, Will & Grace'}
              </option>
              <option value={locale === 'zh-Hant'
                ? '考析所選經文在面對諾斯底／摩尼教二元論或伯拉糾主義時，如何重新詮釋受造秩序與原罪概念？請嚴格標註出處選段。'
                : 'Analyze how the selected passages articulate created order and the Fall against Gnostic/Manichaean dualism or Pelagianism.'}>
                {locale === 'zh-Hant' ? '2. 護教論戰：反駁二元論與伯拉糾主義之受造觀' : '2. Polemical Discourse: Creation vs Dualism & Pelagianism'}
              </option>
              <option value={locale === 'zh-Hant'
                ? '分析希臘教父（如愛任紐、亞他那修）與拉丁教父（如戴爾都良、奧古斯丁）在救贖論（神化 theosis vs 司法赦罪/恩典法庭）上的文本證據與論述差異。'
                : 'Examine textual divergences between Greek patristic soteriology (theosis/recapitulation) and Latin soteriology (forensic grace/atonement).'}>
                {locale === 'zh-Hant' ? '3. 東西方對比：神化（Theosis）與司法性恩典之論述' : '3. East vs West: Theosis vs Forensic Grace'}
              </option>
              <option value={locale === 'zh-Hant'
                ? '檢視所選經文如何引用與詮釋保羅書信（如羅馬書五至七章、創世記二至三章），指出寓意詮釋與字面／歷史詮釋之轉化。'
                : 'Track the hermeneutical reception and citation of Pauline texts (e.g. Romans 5-7) and Genesis 2-3 across the selected authors.'}>
                {locale === 'zh-Hant' ? '4. 聖經詮釋史：創世記與保羅書信之教父詮釋脈絡' : '4. Biblical Reception: Hermeneutics of Genesis & Romans'}
              </option>
            </select>
          </div>

          <textarea
            rows={2}
            value={researchPrompt}
            onChange={(e) => setResearchPrompt(e.target.value)}
            className="w-full bg-white border border-[#D1CEBD] rounded p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>

        {/* Action Button */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-[#F1EDE4]">
          <button
            type="button"
            onClick={handleLoadSampleAnalysis}
            className="px-3.5 py-1.5 text-xs font-medium text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#F1EDE4] border border-[#D1CEBD] rounded flex items-center gap-1.5 transition-colors"
          >
            <Zap className="w-3.5 h-3.5 text-[#B45309]" />
            <span>{locale === 'zh-Hant' ? '載入預載示範考析成果 (免金鑰即刻體驗)' : 'Load Verified Showcase Output'}</span>
          </button>

          <button
            onClick={handleRunAnalysis}
            disabled={isAnalyzing || selectedPassageIds.length === 0}
            className="px-5 py-2 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed rounded flex items-center gap-2 shadow-xs transition-colors"
          >
            {isAnalyzing ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>{locale === 'zh-Hant' ? '正在嚴格約束於源文考析中...' : 'Analyzing Bounded Corpus...'}</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-[#E5D5B0]" />
                <span>{locale === 'zh-Hant' ? '執行源文約束考析' : 'Run Bounded Hermeneutic Analysis'}</span>
              </>
            )}
          </button>
        </div>

        {analysisError && (
          <div className="p-3 rounded bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-red-600 shrink-0" />
            <span>{analysisError}</span>
          </div>
        )}
      </div>

      {/* Analysis Result Output */}
      {analysisResult && (
        <div className="bg-white border border-[#D1CEBD] rounded-lg p-6 space-y-6 animate-in fade-in shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1EDE4] pb-4">
            <div>
              <span className="text-[10px] font-mono uppercase bg-[#E8F0FE] text-[#1A56DB] border border-[#BFDBFE] px-2 py-0.5 rounded font-bold">
                BOUNDED OUTPUT
              </span>
              <h2 className="text-lg font-serif font-bold text-[#1A1A1A] mt-1.5">
                {locale === 'zh-Hant' ? '源文考析綜合報告' : 'Bounded Synthesis Dossier'}
              </h2>
            </div>
            <span className="text-xs text-[#8B7E66] font-mono">
              Generated: {new Date(analysisResult.timestamp).toLocaleString()}
            </span>
          </div>

          {/* Section: Synthesis */}
          <div className="space-y-2">
            <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">
              1. {locale === 'zh-Hant' ? '概念演化與文本綜合考據' : 'Lexical & Conceptual Synthesis'}
            </h3>
            <div className="p-4 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs text-[#1A1A1A] leading-relaxed whitespace-pre-wrap font-sans">
              {analysisResult.synthesis}
            </div>
          </div>

          {/* Section: Cited Passages */}
          <div className="space-y-2">
            <h3 className="text-sm font-serif font-bold text-[#1A1A1A]">
              2. {locale === 'zh-Hant' ? '精確經文引證對照表' : 'Attested Passage Locators Used'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {analysisResult.citedPassages.map((cp, idx) => (
                <div key={idx} className="p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs space-y-1">
                  <span className="font-mono text-[#1A1A1A] font-bold block">{cp.locator}</span>
                  <blockquote className="font-serif italic text-[#4A453A] text-[11px]">
                    "{cp.exactQuote}"
                  </blockquote>
                  <p className="text-[11px] text-[#8B7E66] pt-1 border-t border-[#D1CEBD]">
                    {cp.relevance}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Section: Proposed Relationships to Convert into Evidence Cards */}
          {analysisResult.proposedRelationships && analysisResult.proposedRelationships.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-[#8B7E66]" />
                <span>3. {locale === 'zh-Hant' ? '考析推論之關係（可一鍵轉為暫定證據卡）' : 'Proposed Relationships (Convertible to Evidence Cards)'}</span>
              </h3>

              <div className="space-y-2">
                {analysisResult.proposedRelationships.map((prop, idx) => (
                  <div key={idx} className="p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-[#1A1A1A]">{prop.sourceConcept}</span>
                        <ArrowRight className="w-3.5 h-3.5 text-[#8B7E66]" />
                        <span className="font-bold text-[#1A1A1A]">{prop.targetConcept}</span>
                        <span className="text-[10px] font-mono bg-white text-[#595347] border border-[#D1CEBD] px-1.5 py-0.5 rounded">
                          {prop.relationType}
                        </span>
                        <span className="text-[10px] font-mono uppercase font-bold text-[#065F46]">
                          {prop.confidence}
                        </span>
                      </div>
                      <p className="text-[#666155] text-xs">{prop.rationale}</p>
                    </div>

                    <button
                      onClick={() => handleCreateCardFromProposed(prop)}
                      className="px-3 py-1.5 text-xs font-medium text-[#1A1A1A] bg-white hover:bg-[#FAF8F5] border border-[#D1CEBD] rounded shrink-0 flex items-center gap-1 shadow-xs"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#8B7E66]" />
                      <span>{locale === 'zh-Hant' ? '轉為證據卡' : 'Save as Card'}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section: Limitations & Caution Flags */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            <div className="p-3.5 rounded bg-[#FAF8F5] border border-[#D1CEBD] space-y-1.5">
              <h4 className="text-xs font-bold text-[#1A1A1A]">{locale === 'zh-Hant' ? '方法論界限與資料空白' : 'Methodological Limitations & Corpus Gaps'}</h4>
              <p className="text-xs text-[#595347] leading-relaxed">{analysisResult.limitations}</p>
            </div>

            <div className="p-3.5 rounded bg-[#FEF3C7] border border-[#FDE68A] space-y-1.5">
              <h4 className="text-xs font-bold text-[#92400E] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-[#B45309]" />
                <span>{locale === 'zh-Hant' ? '考據警示旗標 (Caution Flags)' : 'Caution Flags'}</span>
              </h4>
              <p className="text-xs text-[#92400E] leading-relaxed">{analysisResult.cautionFlags}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
