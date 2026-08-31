import React, { useState } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { SourceRecord, VerificationStatus, AuthorTradition } from '../../types';
import { auditSourceStrategy } from '../../services/patristicSources';
import { 
  Library, 
  Plus, 
  Upload, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  HelpCircle, 
  FileSearch, 
  ExternalLink, 
  BookOpen, 
  Calendar,
  AlertTriangle,
  Database,
  ShieldCheck,
  Compass
} from 'lucide-react';

interface SourceRegistryProps {
  onOpenAddSource: () => void;
  onOpenEditSource: (source: SourceRecord) => void;
  onOpenImportModal: () => void;
  onAddPassageForSource: (sourceId: string) => void;
}

export const SourceRegistry: React.FC<SourceRegistryProps> = ({
  onOpenAddSource,
  onOpenEditSource,
  onOpenImportModal,
  onAddPassageForSource
}) => {
  const { t, locale } = useI18n();
  const { currentProject, sources, passages, deleteSource } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterTradition, setFilterTradition] = useState<string>('all');
  const [showStrategyGuide, setShowStrategyGuide] = useState(false);

  if (!currentProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-stone-400">
        <p>{locale === 'zh-Hant' ? '請先於工作區建立或選定研究專案。' : 'Please create or select a research project in the Workspace tab.'}</p>
      </div>
    );
  }

  const filteredSources = sources.filter(s => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      s.author.toLowerCase().includes(q) ||
      s.workTitle.toLowerCase().includes(q) ||
      s.edition.toLowerCase().includes(q) ||
      (s.clavisId && s.clavisId.toLowerCase().includes(q)) ||
      (s.tlgId && s.tlgId.toLowerCase().includes(q));

    const matchesStatus = filterStatus === 'all' || s.verificationStatus === filterStatus;
    const matchesTradition = filterTradition === 'all' || s.authorTradition === filterTradition;

    return matchesSearch && matchesStatus && matchesTradition;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Header & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D1CEBD] pb-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            <Library className="w-5 h-5 text-[#8B7E66]" />
            <span>{t.nav.sources}</span>
          </h1>
          <p className="text-xs text-[#666155] mt-0.5">
            {locale === 'zh-Hant'
              ? '收錄權威批判校勘本（CSEL, CCSL, SC, GCS, PTA）與克拉維斯/TLG 編號之古文獻出處檔案'
              : 'Scholarly source registry grounded in critical editions (CSEL, CCSL, SC, GCS, PTA) and Clavis authority.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowStrategyGuide(!showStrategyGuide)}
            className="px-3 py-1.5 text-xs font-medium text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#F1EDE4] border border-[#D1CEBD] rounded flex items-center gap-1.5 transition-colors"
          >
            <Compass className="w-3.5 h-3.5 text-[#8B7E66]" />
            <span>{locale === 'zh-Hant' ? '真實出處策略指南' : 'Source Strategy Guide'}</span>
          </button>

          <button
            onClick={onOpenImportModal}
            className="px-3 py-1.5 text-xs font-medium text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#F1EDE4] border border-[#D1CEBD] rounded flex items-center gap-1.5 transition-colors"
          >
            <Upload className="w-3.5 h-3.5 text-[#8B7E66]" />
            <span>{locale === 'zh-Hant' ? '批次匯入' : 'Batch Import'}</span>
          </button>

          <button
            onClick={onOpenAddSource}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-[#E5D5B0]" />
            <span>{t.actions.addSource}</span>
          </button>
        </div>
      </div>

      {/* Real Source Strategy Policy Callout */}
      {showStrategyGuide && (
        <div className="bg-[#FAF8F5] border border-[#D1CEBD] rounded-lg p-4 space-y-3 animate-in fade-in text-xs">
          <div className="flex items-center justify-between border-b border-[#E7E2D6] pb-2">
            <div className="flex items-center gap-2 font-bold text-[#1A1A1A]">
              <ShieldCheck className="w-4 h-4 text-[#1A1A1A]" />
              <span>{locale === 'zh-Hant' ? '學術文獻源層級策略 (Real Source Strategy)' : 'Academic Source Layering & Strategy'}</span>
            </div>
            <button
              onClick={() => setShowStrategyGuide(false)}
              className="text-[#8B7E66] hover:text-[#1A1A1A] text-xs"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Clavis Clavium */}
            <div className="p-3 bg-white border border-[#D1CEBD] rounded space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A1A1A] font-mono">1. Clavis Clavium</span>
                <a
                  href="https://clavis.brepols.net/clavisclavium/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-[#1A56DB] underline flex items-center gap-0.5"
                >
                  <span>Brepols</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-[11px] text-[#595347] leading-relaxed">
                {locale === 'zh-Hant'
                  ? '作為元數據權威與識別標識層（CPL/CPG），嚴禁未授權爬取。專門用於作者歸屬、真偽判準、斷代年代學、手稿傳承與校勘版本史考證。'
                  : 'Used as metadata authority & identifier layer (CPL/CPG), not an unlicensed scraping target. Essential for authorship, authenticity, chronology, manuscript transmission, and editorial history.'}
              </p>
            </div>

            {/* Patristic Text Archive */}
            <div className="p-3 bg-white border border-[#D1CEBD] rounded space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A1A1A] font-mono">2. Patristic Text Archive</span>
                <a
                  href="https://patristic-text-archive.de/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-[#1A56DB] underline flex items-center gap-0.5"
                >
                  <span>BBAW PTA</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-[11px] text-[#595347] leading-relaxed">
                {locale === 'zh-Hant'
                  ? '覆蓋範圍內首選之首要轉接器：提供具版本控制之 CTS 永久連結、可下載 TEI 數據及 Clavis/TLG 標識。自動語言標註不完整處保留顯式查證狀態。'
                  : 'First-choice primary adapter where coverage permits: provides versioned CTS permalinks, downloadable data, and Clavis/TLG links. Retains explicit verification states for in-progress linguistic annotations.'}
              </p>
            </div>

            {/* Perseus Digital Library */}
            <div className="p-3 bg-white border border-[#D1CEBD] rounded space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-[#1A1A1A] font-mono">3. Perseus Greek/Latin</span>
                <a
                  href="http://www.perseus.tufts.edu/hopper/"
                  target="_blank"
                  rel="noreferrer"
                  className="text-[10px] text-[#1A56DB] underline flex items-center gap-0.5"
                >
                  <span>Perseus</span>
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </div>
              <p className="text-[11px] text-[#595347] leading-relaxed">
                {locale === 'zh-Hant'
                  ? '僅作為文獻探索與匯入輔助：其希臘語/拉丁語語料庫處於持續建設中且標頭未完全核驗，所有經文必須對校現代權威校勘本（CSEL, CCSL, SC, PTA）。'
                  : 'Discovery/import assistance only: canonical Greek corpus is explicitly a work in progress with unchecked headers. All passages must be collated against critical editions.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D1CEBD] rounded-lg p-2.5 flex flex-col md:flex-row items-center gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8B7E66] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.actions.search}
            className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded pl-9 pr-3 py-1.5 text-xs text-[#1A1A1A] placeholder-[#8B7E66] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] text-xs rounded px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">{locale === 'zh-Hant' ? '全部查證狀態' : 'All Verification States'}</option>
            <option value="attested">{t.provenance.attested}</option>
            <option value="provisional">{t.provenance.provisional}</option>
            <option value="discovery_lead">{t.provenance.discovery_lead}</option>
          </select>

          <select
            value={filterTradition}
            onChange={(e) => setFilterTradition(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] text-xs rounded px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">{locale === 'zh-Hant' ? '全部神學傳統' : 'All Traditions'}</option>
            {Object.entries(t.traditions).map(([k, _v]) => (
              <option key={k} value={k}>{k}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Sources Grid */}
      {filteredSources.length === 0 ? (
        <div className="bg-[#FAF8F5] border border-dashed border-[#D1CEBD] rounded-lg p-8 text-center space-y-3">
          <p className="text-xs text-[#666155]">
            {sources.length === 0
              ? (locale === 'zh-Hant' ? '當前專案尚未登錄任何古文獻出處。請點擊上方按鈕手動登錄或批次匯入。' : 'No source records in this project yet.')
              : (locale === 'zh-Hant' ? '無符合篩選條件的文獻記錄。' : 'No sources matching the current filter.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSources.map((source) => {
            const passageCount = passages.filter(p => p.sourceId === source.id).length;
            const strategy = auditSourceStrategy(source.sourceProvider, source.ctsUrn, source.clavisId);
            const isPerseus = source.sourceProvider === 'Perseus';

            return (
              <div
                key={source.id}
                className="bg-white border border-[#D1CEBD] hover:border-[#8B7E66] rounded-lg p-4 flex flex-col justify-between space-y-3 transition-all shadow-xs"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold border ${
                          source.verificationStatus === 'attested'
                            ? 'bg-[#E8F0FE] text-[#1A56DB] border-[#BFDBFE]'
                            : source.verificationStatus === 'provisional'
                            ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                            : 'bg-[#F3E8FF] text-[#6B21A8] border-[#E9D5FF]'
                        }`}>
                          {source.verificationStatus}
                        </span>

                        <span className="text-[9px] bg-[#FAF8F5] text-[#595347] border border-[#D1CEBD] px-1.5 py-0.5 rounded font-mono font-bold">
                          {source.originalLanguage.toUpperCase()}
                        </span>

                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded border ${strategy.badgeColor}`}>
                          {source.sourceProvider}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-[#1A1A1A] text-base mt-1.5">
                        {source.author}
                      </h3>
                      <p className="font-serif italic text-[#8B7E66] text-sm font-medium">
                        {source.workTitle}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEditSource(source)}
                        title={t.actions.edit}
                        className="p-1 text-[#8B7E66] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] rounded"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(locale === 'zh-Hant' ? '確定要刪除此出處記錄嗎？' : 'Delete this source record?')) {
                            deleteSource(source.id);
                          }
                        }}
                        title={t.actions.delete}
                        className="p-1 text-[#8B7E66] hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {isPerseus && (
                    <div className="p-2 rounded bg-[#FEF3C7] border border-[#FDE68A] text-[11px] text-[#92400E] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#B45309] shrink-0" />
                      <span>{locale === 'zh-Hant' ? 'Perseus 探索來源：須對校現代校勘本' : 'Perseus discovery source (collation required)'}</span>
                    </div>
                  )}

                  <div className="text-xs text-[#595347] space-y-1 pt-1">
                    <p className="text-[11px] text-[#8B7E66] flex items-center gap-1 font-mono">
                      <Calendar className="w-3 h-3 text-[#1A1A1A]" />
                      <span>{source.compositionDate.startYear} — {source.compositionDate.endYear} CE</span>
                      <span className="text-[#8B7E66]">({source.compositionDate.certainty})</span>
                    </p>

                    <p className="text-[11px] text-[#595347] line-clamp-1">
                      <strong className="text-[#1A1A1A] font-medium">{locale === 'zh-Hant' ? '校勘本' : 'Edition'}:</strong> {source.edition}
                    </p>

                    {(source.clavisId || source.tlgId || source.ctsUrn) && (
                      <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                        {source.clavisId && (
                          <span className="text-[10px] bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] px-1.5 py-0.5 rounded font-mono font-semibold">
                            {source.clavisId}
                          </span>
                        )}
                        {source.tlgId && (
                          <span className="text-[10px] bg-[#FAF8F5] border border-[#D1CEBD] text-[#595347] px-1.5 py-0.5 rounded font-mono">
                            {source.tlgId}
                          </span>
                        )}
                        {source.ctsUrn && (
                          <span className="text-[10px] bg-[#FAF8F5] border border-[#D1CEBD] text-[#8B7E66] px-1.5 py-0.5 rounded font-mono truncate max-w-[200px]" title={source.ctsUrn}>
                            {source.ctsUrn}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-[#F1EDE4] text-xs">
                  <span className="text-[#8B7E66] font-mono text-[11px]">
                    {passageCount} {locale === 'zh-Hant' ? '段經文' : 'passages'}
                  </span>

                  <button
                    onClick={() => onAddPassageForSource(source.id)}
                    className="text-xs text-[#1A1A1A] hover:text-[#8B7E66] font-bold flex items-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{locale === 'zh-Hant' ? '新增經文' : 'Add Passage'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

