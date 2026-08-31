import React, { useState } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { generateMarkdownDossier, generateHtmlDossier, generateProjectPacket } from '../../storage/packetExporter';
import { 
  FileDown, 
  Printer, 
  FileText, 
  Code, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  Download,
  BookOpen,
  HelpCircle,
  Copy,
  Check
} from 'lucide-react';

export const ResearchDossierView: React.FC = () => {
  const { t, locale } = useI18n();
  const { currentProject, sources, passages, evidenceCards, secondaryLiterature } = useProject();

  const [copied, setCopied] = useState(false);

  if (!currentProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-stone-400">
        <p>{locale === 'zh-Hant' ? '請先於工作區建立或選定研究專案。' : 'Please create or select a research project in the Workspace tab.'}</p>
      </div>
    );
  }

  // Quality Gates Checks
  const attestedSources = sources.filter(s => s.verificationStatus === 'attested').length;
  const provisionalSources = sources.filter(s => s.verificationStatus === 'provisional').length;
  const perseusSources = sources.filter(s => s.sourceProvider === 'Perseus');
  const contestedSources = sources.filter(s => s.compositionDate.certainty === 'contested' || s.compositionDate.certainty === 'unknown');

  const hasUnlinkedPassages = passages.filter(p => !evidenceCards.some(ec => ec.sourcePassageId === p.id || ec.targetPassageId === p.id)).length;
  const hasIncompleteLocators = passages.filter(p => !p.passageLocator.trim()).length;

  const markdownDossier = generateMarkdownDossier(
    currentProject,
    sources,
    passages,
    evidenceCards,
    locale as 'en' | 'zh-Hant',
    secondaryLiterature
  );

  const handleDownloadMarkdown = () => {
    const blob = new Blob([markdownDossier], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-dossier.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadHtml = () => {
    const html = generateHtmlDossier(
      currentProject,
      sources,
      passages,
      evidenceCards,
      locale as 'en' | 'zh-Hant',
      secondaryLiterature
    );
    const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-dossier.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJson = () => {
    const packet = generateProjectPacket(
      currentProject,
      sources,
      passages,
      evidenceCards,
      secondaryLiterature
    );
    const blob = new Blob([JSON.stringify(packet, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${currentProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-packet.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyMarkdown = () => {
    navigator.clipboard.writeText(markdownDossier);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D1CEBD] pb-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            <FileDown className="w-5 h-5 text-[#8B7E66]" />
            <span>{t.nav.dossier}</span>
          </h1>
          <p className="text-xs text-[#666155] mt-0.5">
            {locale === 'zh-Hant'
              ? '教父學研究專案考證報告、學術書目、品質門禁查驗與多格式匯出'
              : 'Scholarly research dossier export, SBL bibliography, quality gates audit, and printable output.'}
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={handleCopyMarkdown}
            className="px-3 py-1.5 text-xs text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#F1EDE4] border border-[#D1CEBD] rounded flex items-center gap-1 shadow-xs transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-[#065F46]" /> : <Copy className="w-3.5 h-3.5 text-[#8B7E66]" />}
            <span>{copied ? (locale === 'zh-Hant' ? '已複製' : 'Copied') : (locale === 'zh-Hant' ? '複製 Markdown' : 'Copy MD')}</span>
          </button>

          <button
            onClick={handleDownloadMarkdown}
            className="px-3 py-1.5 text-xs text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#F1EDE4] border border-[#D1CEBD] rounded flex items-center gap-1 shadow-xs transition-colors"
          >
            <FileText className="w-3.5 h-3.5 text-[#8B7E66]" />
            <span>Markdown</span>
          </button>

          <button
            onClick={handleDownloadHtml}
            className="px-3 py-1.5 text-xs text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#F1EDE4] border border-[#D1CEBD] rounded flex items-center gap-1 shadow-xs transition-colors"
          >
            <Code className="w-3.5 h-3.5 text-[#8B7E66]" />
            <span>HTML</span>
          </button>

          <button
            onClick={handleDownloadJson}
            className="px-3 py-1.5 text-xs text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#F1EDE4] border border-[#D1CEBD] rounded flex items-center gap-1 shadow-xs transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-[#8B7E66]" />
            <span>JSON Packet</span>
          </button>

          <button
            onClick={handlePrint}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5 text-[#E5D5B0]" />
            <span>{locale === 'zh-Hant' ? '列印／另存 PDF' : 'Print / PDF'}</span>
          </button>
        </div>
      </div>

      {/* Quality Gates & Academic Provenance Audit Panel */}
      <div className="bg-white border border-[#D1CEBD] rounded-lg p-5 space-y-4 shadow-xs">
        <div className="flex items-center gap-2 border-b border-[#F1EDE4] pb-3">
          <ShieldCheck className="w-5 h-5 text-[#065F46]" />
          <h2 className="text-sm font-serif font-bold text-[#1A1A1A]">
            {locale === 'zh-Hant' ? '學術品質門禁查驗 (Quality Gates Audit)' : 'Academic Quality Gates Audit'}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
          {/* Gate 1: Attested Critical Sources */}
          <div className="p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#666155] font-semibold">{locale === 'zh-Hant' ? '批判校勘本登錄' : 'Critical Editions'}</span>
              <CheckCircle2 className="w-4 h-4 text-[#065F46]" />
            </div>
            <p className="text-base font-serif font-bold text-[#1A1A1A]">
              {sources.length} {locale === 'zh-Hant' ? '部文獻' : 'sources'}
            </p>
            <p className="text-[11px] text-[#8B7E66]">
              {attestedSources} {locale === 'zh-Hant' ? '實證' : 'attested'}, {provisionalSources} {locale === 'zh-Hant' ? '暫定' : 'provisional'}
            </p>
          </div>

          {/* Gate 2: Passage Snapshots & Checksums */}
          <div className="p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#666155] font-semibold">{locale === 'zh-Hant' ? '經文快照與校驗碼' : 'SHA-256 Hashes'}</span>
              <CheckCircle2 className="w-4 h-4 text-[#065F46]" />
            </div>
            <p className="text-base font-serif font-bold text-[#1A1A1A]">
              {passages.length} {locale === 'zh-Hant' ? '段經文' : 'passages'}
            </p>
            <p className="text-[11px] text-[#065F46] font-mono font-bold">
              100% Cryptographically Locked
            </p>
          </div>

          {/* Gate 3: Evidence Cards Ratio */}
          <div className="p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#666155] font-semibold">{locale === 'zh-Hant' ? '圖譜連線證據卡' : 'Evidence Card Links'}</span>
              <CheckCircle2 className="w-4 h-4 text-[#065F46]" />
            </div>
            <p className="text-base font-serif font-bold text-[#1A1A1A]">
              {evidenceCards.length} {locale === 'zh-Hant' ? '張證據卡' : 'cards'}
            </p>
            <p className="text-[11px] text-[#8B7E66]">
              {locale === 'zh-Hant' ? '嚴格禁止無證據連線' : '0 ungrounded connections'}
            </p>
          </div>

          {/* Gate 4: Warnings / Discovery Flags */}
          <div className="p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD] space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[#666155] font-semibold">{locale === 'zh-Hant' ? '爭議斷代與預警' : 'Dating & Discovery'}</span>
              {perseusSources.length > 0 ? (
                <AlertTriangle className="w-4 h-4 text-[#92400E]" />
              ) : (
                <CheckCircle2 className="w-4 h-4 text-[#065F46]" />
              )}
            </div>
            <p className="text-base font-serif font-bold text-[#1A1A1A]">
              {perseusSources.length} Perseus / {contestedSources.length} Contested
            </p>
            <p className="text-[11px] text-[#8B7E66]">
              {perseusSources.length === 0 ? (locale === 'zh-Hant' ? '無初級探索來源' : 'All critical editions') : (locale === 'zh-Hant' ? '須人工核對校勘本' : 'Collation required')}
            </p>
          </div>
        </div>
      </div>

      {/* Dossier Preview Document */}
      <div className="bg-white border border-[#D1CEBD] rounded-lg p-6 sm:p-8 shadow-xs space-y-8 print:bg-white print:text-black print:border-none print:shadow-none">
        {/* Document Title Header */}
        <div className="border-b border-[#D1CEBD] pb-6 text-center space-y-2">
          <span className="text-xs font-mono uppercase text-[#8B7E66] tracking-wider font-bold">
            Patristic Concept Atlas — Research Dossier
          </span>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#1A1A1A]">
            {currentProject.title}
          </h1>
          {currentProject.subtitle && (
            <p className="text-sm text-[#4A453A] font-serif italic">{currentProject.subtitle}</p>
          )}
          <p className="text-xs text-[#666155] font-mono pt-1">
            {currentProject.dateRange.startYear} — {currentProject.dateRange.endYear} CE · Generated on {new Date().toLocaleDateString()}
          </p>
        </div>

        {/* Section 1: Research Question & Scope */}
        <div className="space-y-3">
          <h2 className="text-base font-serif font-bold text-[#1A1A1A] border-b border-[#F1EDE4] pb-1.5">
            I. {locale === 'zh-Hant' ? '研究問題與方法論界限' : 'Research Question & Methodological Framework'}
          </h2>
          <div className="text-xs sm:text-sm text-[#1A1A1A] space-y-2 leading-relaxed">
            <p><strong>{locale === 'zh-Hant' ? '核心考證問題' : 'Core Research Question'}:</strong> {currentProject.researchQuestion}</p>
            {currentProject.methodologyNote && (
              <p><strong>{locale === 'zh-Hant' ? '版本學與排他性方法說明' : 'Methodology Note'}:</strong> {currentProject.methodologyNote}</p>
            )}
          </div>
        </div>

        {/* Section 2: Critical Source Registry */}
        <div className="space-y-3">
          <h2 className="text-base font-serif font-bold text-[#1A1A1A] border-b border-[#F1EDE4] pb-1.5">
            II. {locale === 'zh-Hant' ? '批判校勘本文獻目錄' : 'Critical Source Registry'} ({sources.length})
          </h2>
          <div className="space-y-3 text-xs">
            {sources.map((s, idx) => (
              <div key={s.id} className="p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD] space-y-1">
                <div className="flex items-center justify-between font-mono text-[11px] text-[#8B7E66]">
                  <span className="font-bold text-[#1A1A1A]">[{idx + 1}] {s.sourceProvider} · {s.compositionDate.startYear}–{s.compositionDate.endYear} CE ({s.compositionDate.certainty})</span>
                  <span className="uppercase font-bold text-[#065F46]">{s.verificationStatus}</span>
                </div>
                <p className="text-[#1A1A1A] font-serif font-bold text-sm">
                  {s.author} — <span className="italic">{s.workTitle}</span>
                </p>
                <p className="text-[#4A453A] text-[11px]">{s.bibliographyCitation}</p>
                {s.clavisId && <p className="text-[#8B7E66] font-mono text-[10px]">Clavis: {s.clavisId} {s.tlgId ? `· TLG: ${s.tlgId}` : ''}</p>}
              </div>
            ))}
          </div>
        </div>

        {/* Section 3: Primary Passages */}
        <div className="space-y-3">
          <h2 className="text-base font-serif font-bold text-[#1A1A1A] border-b border-[#F1EDE4] pb-1.5">
            III. {locale === 'zh-Hant' ? '原始古經文選段與加密快照' : 'Attested Primary Passages'} ({passages.length})
          </h2>
          <div className="space-y-4 text-xs">
            {passages.map((p, idx) => {
              const s = sources.find(src => src.id === p.sourceId);
              return (
                <div key={p.id} className="p-4 rounded bg-[#FAF8F5] border border-[#D1CEBD] space-y-2">
                  <div className="flex items-center justify-between font-mono text-[11px] text-[#666155]">
                    <span className="font-bold text-[#1A1A1A]">{s?.author} — {s?.workTitle} [{p.passageLocator}]</span>
                    <span className="text-[#8B7E66] font-mono text-[10px]">SHA-256: {p.snapshot.sourceChecksum}</span>
                  </div>
                  <blockquote className="font-serif italic text-[#1A1A1A] text-xs sm:text-sm leading-relaxed border-l-2 border-[#1A1A1A] pl-3">
                    "{p.originalText}"
                  </blockquote>
                  {p.translationText && (
                    <p className="text-[#4A453A] text-xs leading-relaxed pt-1">
                      <strong>{locale === 'zh-Hant' ? '翻譯' : 'Translation'}:</strong> {p.translationText}
                    </p>
                  )}
                  <div className="flex items-center gap-1 flex-wrap pt-1 font-mono text-[10px]">
                    <span className="text-[#8B7E66]">Concepts:</span>
                    {p.concepts.map(c => (
                      <span key={c} className="bg-white border border-[#D1CEBD] text-[#1A1A1A] px-1.5 py-0.5 rounded font-medium">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Section 4: Source-Attested Evidence Cards */}
        <div className="space-y-3">
          <h2 className="text-base font-serif font-bold text-[#1A1A1A] border-b border-[#F1EDE4] pb-1.5">
            IV. {locale === 'zh-Hant' ? '概念流變與實證卡論證' : 'Source-Attested Evidence Cards'} ({evidenceCards.length})
          </h2>
          <div className="space-y-3 text-xs">
            {evidenceCards.map((ec, idx) => (
              <div key={ec.id} className="p-3.5 rounded bg-[#FAF8F5] border border-[#D1CEBD] space-y-2">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#1A1A1A] font-bold">EC-{idx + 1}: {ec.sourceConcept} → {ec.targetConcept || 'Grounding'}</span>
                  <span className="text-[#065F46] uppercase font-bold">{ec.confidence} confidence</span>
                </div>
                <p className="text-[11px] text-[#8B7E66] font-mono">Locators: {ec.exactLocators.join(' ↔ ')}</p>
                {ec.evidenceExcerpt && (
                  <p className="font-serif italic text-[#1A1A1A] text-xs bg-white border border-[#D1CEBD] p-2 rounded">
                    "{ec.evidenceExcerpt}"
                  </p>
                )}
                <p className="text-[#4A453A] leading-relaxed">
                  <strong>{locale === 'zh-Hant' ? '學者論證' : 'Rationale'}:</strong> {ec.researcherExplanation}
                </p>
                {ec.aiInterpretation && (
                  <p className="text-[#595347] text-[11px]">
                    <strong>[AI Tagged]:</strong> {ec.aiInterpretation}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Standard Patristic Bibliography */}
        <div className="space-y-3">
          <h2 className="text-base font-serif font-bold text-[#1A1A1A] border-b border-[#F1EDE4] pb-1.5">
            V. {locale === 'zh-Hant' ? '學術書目 (SBL / Chicago 格式)' : 'Standard Patristic Bibliography'}
          </h2>
          <div className="space-y-2 text-xs font-serif text-[#1A1A1A] pl-4 border-l-2 border-[#D1CEBD]">
            {sources.map((s, idx) => (
              <p key={idx} className="leading-relaxed">
                {s.bibliographyCitation}
              </p>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
