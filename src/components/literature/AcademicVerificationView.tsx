import React, { useState, useEffect } from 'react';
import { useProject } from '../../context/ProjectContext';
import { useI18n } from '../../i18n/i18nContext';
import {
  searchOpenAlexWorks,
  fetchCrossrefByDoi,
  fetchSciteTallies,
  verifyPaperTripleCheck,
  PATRISTIC_SEMINAL_PAPERS,
  generateChicagoCitation
} from '../../services/academicLiteratureService';
import {
  ResponsibleResearchAudit,
  OpenAlexWork,
  VerifiedSecondaryLiterature
} from '../../types';
import {
  Search,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
  ExternalLink,
  ShieldCheck,
  Bookmark,
  BookmarkCheck,
  Copy,
  Check,
  Trash2,
  Link as LinkIcon,
  Sparkles,
  HelpCircle,
  TrendingUp,
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';

export const AcademicVerificationView: React.FC = () => {
  const {
    currentProject,
    passages,
    evidenceCards,
    secondaryLiterature,
    saveSecondaryPaper,
    deleteSecondaryPaper
  } = useProject();
  const { t, locale } = useI18n();
  const isZh = locale === 'zh-Hant';

  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [auditResult, setAuditResult] = useState<ResponsibleResearchAudit | null>(null);
  const [searchResults, setSearchResults] = useState<OpenAlexWork[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [selectedPaperForLinking, setSelectedPaperForLinking] = useState<VerifiedSecondaryLiterature | null>(null);
  const [linkPassageIds, setLinkPassageIds] = useState<string[]>([]);
  const [linkCardIds, setLinkCardIds] = useState<string[]>([]);
  const [editingNotes, setEditingNotes] = useState<{ [id: string]: string }>({});

  const handleAudit = async (queryOrDoi: string) => {
    if (!queryOrDoi.trim()) return;
    setLoading(true);
    try {
      // If it looks like a DOI or specific title
      const isDoi = queryOrDoi.includes('10.') || queryOrDoi.startsWith('doi:');
      if (isDoi) {
        const result = await verifyPaperTripleCheck(queryOrDoi);
        setAuditResult(result);
        setSearchResults([]);
      } else {
        // Run OpenAlex keyword search
        const works = await searchOpenAlexWorks(queryOrDoi, 6);
        setSearchResults(works);
        if (works.length > 0 && works[0].doi) {
          const result = await verifyPaperTripleCheck(works[0].doi);
          setAuditResult(result);
        } else {
          setAuditResult(null);
        }
      }
    } catch (err) {
      console.error('Error during academic literature verification:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectOpenAlexWork = async (work: OpenAlexWork) => {
    setLoading(true);
    try {
      const identifier = work.doi || work.title;
      const result = await verifyPaperTripleCheck(identifier);
      setAuditResult(result);
    } catch (err) {
      console.error('Error auditing selected work:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAuditToProject = async (audit: ResponsibleResearchAudit) => {
    if (!currentProject) return;
    const paperId = `sec-lit-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
    const formattedCitation = generateChicagoCitation(
      audit.authors,
      audit.title,
      audit.venue,
      audit.year,
      audit.canonicalDoi
    );

    const newRecord: VerifiedSecondaryLiterature = {
      id: paperId,
      projectId: currentProject.id,
      doi: audit.canonicalDoi,
      title: audit.title,
      authors: audit.authors,
      year: audit.year,
      venue: audit.venue,
      abstract: audit.openAlex?.abstract,
      isOa: audit.openAlex?.isOa,
      oaUrl: audit.openAlex?.oaUrl,
      landingUrl: audit.openAlex?.landingPageUrl || (audit.canonicalDoi ? `https://doi.org/${audit.canonicalDoi}` : undefined),
      crossrefData: audit.crossref || undefined,
      openAlexData: audit.openAlex || undefined,
      sciteTallies: audit.scite || undefined,
      formattedCitation,
      linkedPassageIds: [],
      linkedEvidenceCardIds: [],
      researcherNotes: '',
      responsibleVerdict: audit.verdict,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveSecondaryPaper(newRecord);
  };

  const handleCopyCitation = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleOpenLinkModal = (paper: VerifiedSecondaryLiterature) => {
    setSelectedPaperForLinking(paper);
    setLinkPassageIds(paper.linkedPassageIds || []);
    setLinkCardIds(paper.linkedEvidenceCardIds || []);
  };

  const handleSaveLinks = async () => {
    if (!selectedPaperForLinking) return;
    const updated = {
      ...selectedPaperForLinking,
      linkedPassageIds: linkPassageIds,
      linkedEvidenceCardIds: linkCardIds,
      updatedAt: new Date().toISOString()
    };
    await saveSecondaryPaper(updated);
    setSelectedPaperForLinking(null);
  };

  const handleSaveNotes = async (paper: VerifiedSecondaryLiterature) => {
    const note = editingNotes[paper.id];
    if (note === undefined) return;
    const updated = {
      ...paper,
      researcherNotes: note,
      updatedAt: new Date().toISOString()
    };
    await saveSecondaryPaper(updated);
  };

  const getVerdictBadge = (verdict: ResponsibleResearchAudit['verdict']) => {
    switch (verdict) {
      case 'highly_credible':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-900/40 text-emerald-300 border border-emerald-700/50">
            <CheckCircle2 className="w-3.5 h-3.5" />
            {t.literature.verdictHighlyCredible}
          </span>
        );
      case 'credible_neutral':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-900/40 text-blue-300 border border-blue-700/50">
            <ShieldCheck className="w-3.5 h-3.5" />
            {t.literature.verdictCredibleNeutral}
          </span>
        );
      case 'debated_caution':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-900/40 text-amber-300 border border-amber-700/50">
            <AlertTriangle className="w-3.5 h-3.5" />
            {t.literature.verdictDebatedCaution}
          </span>
        );
      case 'insufficient_records':
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-800 text-slate-400 border border-slate-700">
            <HelpCircle className="w-3.5 h-3.5" />
            {t.literature.verdictInsufficient}
          </span>
        );
    }
  };

  const isSavedInProject = (doiOrTitle: string) => {
    return secondaryLiterature.some(
      s => (s.doi && s.doi.toLowerCase() === doiOrTitle.toLowerCase()) ||
           (s.title && s.title.toLowerCase() === doiOrTitle.toLowerCase())
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-6 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-3xl -mr-20 -mt-20 pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
                {t.literature.triSourceBadge}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-amber-400" />
              {t.literature.title}
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed">
              {t.literature.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3 self-start md:self-auto shrink-0">
            <div className="text-right text-xs text-slate-400">
              <span className="font-semibold text-slate-200">{secondaryLiterature.length}</span> {isZh ? '篇已存二手文獻' : 'Saved Studies'}
            </div>
          </div>
        </div>
      </div>

      {/* Live Search & Triple-Audit Input */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-4">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleAudit(searchQuery);
          }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <div className="relative flex-1">
            <Search className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.literature.searchPlaceholder}
              className="w-full pl-11 pr-4 py-3 bg-slate-950 border border-slate-700 rounded-lg text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 text-sm"
            />
          </div>
          <button
            type="submit"
            disabled={loading || !searchQuery.trim()}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-medium rounded-lg text-sm flex items-center justify-center gap-2 transition shadow-sm"
          >
            {loading ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                {t.literature.verifying}
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4" />
                {t.literature.auditButton}
              </>
            )}
          </button>
        </form>

        {/* Quick Presets for Patristic Studies */}
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">
            {t.literature.presetsTitle}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
            {PATRISTIC_SEMINAL_PAPERS.map((p) => (
              <button
                key={p.doi}
                onClick={() => {
                  setSearchQuery(p.doi);
                  handleAudit(p.doi);
                }}
                className="text-left p-2.5 rounded-lg bg-slate-950/60 hover:bg-slate-800/80 border border-slate-800 hover:border-slate-700 transition group flex flex-col justify-between"
              >
                <div className="font-medium text-xs text-slate-200 group-hover:text-amber-400 line-clamp-1">
                  {p.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                  <span>{p.authors[0]} ({p.year})</span>
                  <span className="text-[10px] text-amber-500/80">{p.topic}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* OpenAlex Search Result Candidates (if multi-result query) */}
      {searchResults.length > 1 && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-sm space-y-3">
          <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-cyan-400" />
            {isZh ? `OpenAlex 檢索結果 (${searchResults.length} 篇論文，點擊任一篇進行 Scite 三重審查)` : `OpenAlex Search Results (${searchResults.length} papers, click to audit):`}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {searchResults.map((work) => (
              <div
                key={work.id}
                onClick={() => handleSelectOpenAlexWork(work)}
                className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-amber-500/50 cursor-pointer transition group"
              >
                <div className="text-xs font-medium text-slate-200 group-hover:text-amber-400 line-clamp-2">
                  {work.title}
                </div>
                <div className="text-[11px] text-slate-400 mt-1.5 flex flex-wrap items-center gap-2">
                  <span>{work.authors.map(a => a.name).slice(0, 2).join(', ')}</span>
                  <span>•</span>
                  <span>{work.publicationYear || 'N/A'}</span>
                  <span>•</span>
                  <span className="text-slate-400">{work.hostVenue || 'Venue N/A'}</span>
                  {work.isOa && (
                    <span className="px-1.5 py-0.2 text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800 rounded">
                      OA
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Detailed Triple-Audit Card */}
      {auditResult && (
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-6">
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-4 pb-4 border-b border-slate-800">
            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2">
                {getVerdictBadge(auditResult.verdict)}
                {auditResult.openAlex?.isOa && (
                  <a
                    href={auditResult.openAlex.oaUrl || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs bg-emerald-950 text-emerald-300 border border-emerald-800 hover:bg-emerald-900 transition"
                  >
                    <ExternalLink className="w-3 h-3" />
                    {t.literature.openAccess}
                  </a>
                )}
                {auditResult.canonicalDoi && (
                  <span className="text-xs font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                    DOI: {auditResult.canonicalDoi}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-100">
                {auditResult.title}
              </h2>
              <div className="text-sm text-slate-400 flex flex-wrap items-center gap-2">
                <span className="font-medium text-slate-300">
                  {auditResult.authors.join(', ')}
                </span>
                <span>•</span>
                <span>{auditResult.year || 'N/A'}</span>
                <span>•</span>
                <span className="italic text-slate-300">{auditResult.venue}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {isSavedInProject(auditResult.canonicalDoi || auditResult.title) ? (
                <span className="px-3 py-2 bg-emerald-950 text-emerald-300 border border-emerald-800 rounded-lg text-xs font-medium flex items-center gap-1.5">
                  <BookmarkCheck className="w-4 h-4" />
                  {isZh ? '已加入專案書目' : 'Saved in Project'}
                </span>
              ) : (
                <button
                  onClick={() => handleSaveAuditToProject(auditResult)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-medium flex items-center gap-1.5 transition shadow-sm"
                >
                  <Bookmark className="w-4 h-4" />
                  {t.literature.saveToProject}
                </button>
              )}
            </div>
          </div>

          {/* Tri-Source Metadata Breakdown Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* 1. Crossref */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <FileText className="w-4 h-4 text-indigo-400" />
                {t.literature.crossrefLabel}
              </div>
              {auditResult.crossref ? (
                <div className="text-xs space-y-1 text-slate-400">
                  <div><span className="text-slate-500">Publisher:</span> {auditResult.crossref.publisher || 'N/A'}</div>
                  <div><span className="text-slate-500">Container:</span> {auditResult.crossref.containerTitle || 'N/A'}</div>
                  <div><span className="text-slate-500">Volume/Issue:</span> {auditResult.crossref.volume || '-'}/{auditResult.crossref.issue || '-'}</div>
                  <div><span className="text-slate-500">Crossref Cited:</span> {auditResult.crossref.isReferencedByCount} citations</div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  {isZh ? '未找到 Crossref 出版詮釋資料' : 'No direct Crossref record found.'}
                </div>
              )}
            </div>

            {/* 2. OpenAlex */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-400" />
                {t.literature.openAlexLabel}
              </div>
              {auditResult.openAlex ? (
                <div className="text-xs space-y-1 text-slate-400">
                  <div><span className="text-slate-500">Global Citations:</span> {auditResult.openAlex.citedByCount}</div>
                  <div><span className="text-slate-500">OA Status:</span> {auditResult.openAlex.oaStatus || (auditResult.openAlex.isOa ? 'Gold/Green' : 'Closed')}</div>
                  {auditResult.openAlex.concepts && auditResult.openAlex.concepts.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {auditResult.openAlex.concepts.slice(0, 3).map(c => (
                        <span key={c.name} className="px-1.5 py-0.5 rounded text-[10px] bg-slate-800 text-slate-300">
                          {c.name}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  {isZh ? '未找到 OpenAlex 目錄資料' : 'No OpenAlex record found.'}
                </div>
              )}
            </div>

            {/* 3. Scite.ai Smart Citations */}
            <div className="p-4 rounded-lg bg-slate-950 border border-slate-800 space-y-2">
              <div className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4 text-amber-400" />
                {t.literature.sciteLabel}
              </div>
              {auditResult.scite ? (
                <div className="space-y-2">
                  <div className="grid grid-cols-3 gap-1 text-center">
                    <div className="p-1.5 rounded bg-emerald-950/60 border border-emerald-800/40">
                      <div className="text-xs font-bold text-emerald-400">{auditResult.scite.supporting}</div>
                      <div className="text-[9px] text-emerald-300/80">{isZh ? '支持' : 'Support'}</div>
                    </div>
                    <div className="p-1.5 rounded bg-slate-900 border border-slate-700">
                      <div className="text-xs font-bold text-slate-200">{auditResult.scite.mentioning}</div>
                      <div className="text-[9px] text-slate-400">{isZh ? '提及' : 'Mention'}</div>
                    </div>
                    <div className="p-1.5 rounded bg-rose-950/60 border border-rose-800/40">
                      <div className="text-xs font-bold text-rose-400">{auditResult.scite.contrasting}</div>
                      <div className="text-[9px] text-rose-300/80">{isZh ? '異議/爭議' : 'Contrast'}</div>
                    </div>
                  </div>
                  <div className="text-[11px] text-slate-400">
                    <span className="text-slate-500">{isZh ? '總引證文獻數:' : 'Total Citing:'}</span> {auditResult.scite.total}
                  </div>
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">
                  {isZh ? 'Scite 索引中暫無獨立引文立場紀錄' : 'No Scite tallies for this item.'}
                </div>
              )}
            </div>
          </div>

          {/* Dispute Warning Notice if high contrast */}
          {auditResult.scite && auditResult.scite.contrasting > 0 && auditResult.scite.disputeRatio > 0.2 && (
            <div className="p-3.5 rounded-lg bg-amber-950/40 border border-amber-800/60 text-xs text-amber-300 flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">{t.literature.disputeWarning}</span>
                <p className="mt-0.5 text-amber-200/90 leading-relaxed">
                  {isZh
                    ? `引用此研究之論文中，有 ${(auditResult.scite.disputeRatio * 100).toFixed(1)}% 提出了相反文本證據或詮釋異議。建議学者於考證論述中主動呈列學術對立論點。`
                    : `${(auditResult.scite.disputeRatio * 100).toFixed(1)}% of citing works report contrasting or disputed findings. Consider presenting both sides in your research dossier.`}
                </p>
              </div>
            </div>
          )}

          {/* Audit Notes Breakdown */}
          <div className="p-4 rounded-lg bg-slate-950/60 border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-300">
              {t.literature.auditNotesTitle}
            </div>
            <ul className="space-y-1 text-xs text-slate-400">
              {auditResult.auditNotes.map((note, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-amber-500 mt-0.5">•</span>
                  <span>{note}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* Saved Project Secondary Bibliography */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
              <BookmarkCheck className="w-5 h-5 text-amber-400" />
              {t.literature.savedLiterature}
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              {isZh ? '已存入當前研究專案之經審查二次文獻書目，可繫聯至特定經文或證據卡' : 'Audited literature linked to this project and ready for inclusion in research dossiers'}
            </p>
          </div>
        </div>

        {secondaryLiterature.length === 0 ? (
          <div className="p-8 text-center rounded-lg bg-slate-950/50 border border-slate-800/80 space-y-2">
            <BookOpen className="w-8 h-8 text-slate-600 mx-auto" />
            <p className="text-sm text-slate-400 max-w-md mx-auto">
              {t.literature.noSavedLiterature}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {secondaryLiterature.map((paper) => {
              const linkedPassageObjs = passages.filter(p => (paper.linkedPassageIds || []).includes(p.id));
              const linkedCardObjs = evidenceCards.filter(c => (paper.linkedEvidenceCardIds || []).includes(c.id));

              return (
                <div
                  key={paper.id}
                  className="p-4 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition space-y-3"
                >
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3">
                    <div className="space-y-1 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        {getVerdictBadge(paper.responsibleVerdict)}
                        {paper.isOa && (
                          <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950 text-emerald-300 border border-emerald-800">
                            OA
                          </span>
                        )}
                        {paper.doi && (
                          <span className="text-[11px] font-mono text-slate-400">
                            {paper.doi}
                          </span>
                        )}
                      </div>
                      <h3 className="text-sm font-semibold text-slate-200">
                        {paper.title}
                      </h3>
                      <div className="text-xs text-slate-400">
                        {paper.authors.join(', ')} ({paper.year || 'N/A'}) — <span className="italic">{paper.venue}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        onClick={() => handleOpenLinkModal(paper)}
                        className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 transition"
                        title={t.literature.linkToPassages}
                      >
                        <LinkIcon className="w-3.5 h-3.5" />
                        <span>{isZh ? '繫聯' : 'Link'} ({linkedPassageObjs.length + linkedCardObjs.length})</span>
                      </button>

                      {paper.formattedCitation && (
                        <button
                          onClick={() => handleCopyCitation(paper.formattedCitation!, paper.id)}
                          className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded text-xs flex items-center gap-1 transition"
                          title={t.literature.copyCitation}
                        >
                          {copiedId === paper.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                          <span>{copiedId === paper.id ? t.literature.citationCopied : t.literature.copyCitation}</span>
                        </button>
                      )}

                      <button
                        onClick={() => deleteSecondaryPaper(paper.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-400 rounded transition"
                        title={t.literature.removeFromProject}
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Scite Tallies pill if exists */}
                  {paper.sciteTallies && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="text-slate-400 text-[11px] font-medium">{t.literature.sciteLabel}:</span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-emerald-950/80 text-emerald-300 border border-emerald-800/40">
                        {paper.sciteTallies.supporting} {isZh ? '支持' : 'Supporting'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-slate-900 text-slate-300 border border-slate-700">
                        {paper.sciteTallies.mentioning} {isZh ? '提及' : 'Mentioning'}
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] bg-rose-950/80 text-rose-300 border border-rose-800/40">
                        {paper.sciteTallies.contrasting} {isZh ? '異議' : 'Contrasting'}
                      </span>
                    </div>
                  )}

                  {/* Linked items chips */}
                  {(linkedPassageObjs.length > 0 || linkedCardObjs.length > 0) && (
                    <div className="pt-2 border-t border-slate-900 flex flex-wrap items-center gap-1.5 text-xs">
                      <span className="text-slate-400 text-[11px]">{isZh ? '已繫聯古文獻與證據卡:' : 'Linked Items:'}</span>
                      {linkedPassageObjs.map(p => (
                        <span key={p.id} className="px-2 py-0.5 rounded bg-cyan-950/60 text-cyan-300 border border-cyan-800/40 text-[10px]">
                          Passage: {p.passageLocator} ({p.concepts[0] || 'Patristic'})
                        </span>
                      ))}
                      {linkedCardObjs.map(c => (
                        <span key={c.id} className="px-2 py-0.5 rounded bg-amber-950/60 text-amber-300 border border-amber-800/40 text-[10px]">
                          Evidence Card: {c.sourceConcept} → {c.targetConcept || 'Node'}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Researcher Notes Input */}
                  <div className="pt-2">
                    <input
                      type="text"
                      defaultValue={paper.researcherNotes || ''}
                      onChange={(e) => setEditingNotes(prev => ({ ...prev, [paper.id]: e.target.value }))}
                      onBlur={() => handleSaveNotes(paper)}
                      placeholder={t.literature.researcherNotesPlaceholder}
                      className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-800 rounded text-slate-200 placeholder-slate-400 focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Modal for Linking Paper to Passages / Evidence Cards */}
      {selectedPaperForLinking && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-slate-900 border border-slate-800 rounded-xl max-w-2xl w-full p-6 space-y-5 shadow-2xl max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-slate-100 flex items-center gap-2 text-base">
                <LinkIcon className="w-5 h-5 text-amber-400" />
                {t.literature.linkToPassages}: {selectedPaperForLinking.title}
              </h3>
              <button
                onClick={() => setSelectedPaperForLinking(null)}
                className="text-slate-400 hover:text-slate-200 text-sm"
              >
                ✕
              </button>
            </div>

            {/* Link to Passages */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">
                {isZh ? '選擇要繫聯的原始經文選段 (Passages)' : 'Select Primary Passages to Link:'}
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {passages.length === 0 ? (
                  <div className="text-xs text-slate-500 italic">{isZh ? '專案中尚無經文選段' : 'No passages in project.'}</div>
                ) : (
                  passages.map(p => {
                    const isChecked = linkPassageIds.includes(p.id);
                    return (
                      <label
                        key={p.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          isChecked
                            ? 'bg-amber-950/30 border-amber-700/60 text-slate-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setLinkPassageIds(prev =>
                              prev.includes(p.id) ? prev.filter(id => id !== p.id) : [...prev, p.id]
                            );
                          }}
                          className="mt-0.5 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                        />
                        <div>
                          <div className="font-medium text-slate-200">
                            [{p.passageLocator}] {p.concepts.join(', ')}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {p.originalText}
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            {/* Link to Evidence Cards */}
            <div className="space-y-2">
              <div className="text-xs font-semibold text-slate-300">
                {isZh ? '選擇要繫聯的考據證據卡 (Evidence Cards)' : 'Select Evidence Cards to Link:'}
              </div>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {evidenceCards.length === 0 ? (
                  <div className="text-xs text-slate-500 italic">{isZh ? '專案中尚無證據卡' : 'No evidence cards in project.'}</div>
                ) : (
                  evidenceCards.map(c => {
                    const isChecked = linkCardIds.includes(c.id);
                    return (
                      <label
                        key={c.id}
                        className={`flex items-start gap-2.5 p-2.5 rounded-lg border text-xs cursor-pointer transition ${
                          isChecked
                            ? 'bg-amber-950/30 border-amber-700/60 text-slate-200'
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => {
                            setLinkCardIds(prev =>
                              prev.includes(c.id) ? prev.filter(id => id !== c.id) : [...prev, c.id]
                            );
                          }}
                          className="mt-0.5 rounded bg-slate-900 border-slate-700 text-amber-500 focus:ring-amber-500"
                        />
                        <div>
                          <div className="font-medium text-slate-200">
                            {c.sourceConcept} → {c.targetConcept || 'Node'} ({c.relationType})
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {c.researcherExplanation}
                          </div>
                        </div>
                      </label>
                    );
                  })
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <button
                onClick={() => setSelectedPaperForLinking(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium rounded-lg transition"
              >
                {t.actions.cancel}
              </button>
              <button
                onClick={handleSaveLinks}
                className="px-5 py-2 bg-amber-600 hover:bg-amber-500 text-white text-xs font-medium rounded-lg transition"
              >
                {t.actions.save}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
