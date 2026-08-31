import React, { useState } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { Passage } from '../../types';
import { 
  BookOpen, 
  Plus, 
  Search, 
  CheckSquare, 
  Square, 
  ShieldCheck, 
  Edit3, 
  Trash2, 
  Sparkles, 
  FileCheck2,
  Copy,
  Check,
  Tag
} from 'lucide-react';

interface PassageReaderProps {
  onOpenAddPassage: () => void;
  onOpenEditPassage: (passage: Passage) => void;
  onNavigateToAnalysis: () => void;
  onNavigateToEvidence: (sourcePassageId: string) => void;
}

export const PassageReader: React.FC<PassageReaderProps> = ({
  onOpenAddPassage,
  onOpenEditPassage,
  onNavigateToAnalysis,
  onNavigateToEvidence
}) => {
  const { t, locale } = useI18n();
  const { 
    currentProject, 
    passages, 
    sources, 
    deletePassage, 
    selectedPassageIds, 
    togglePassageSelection, 
    selectAllPassages, 
    clearPassageSelection 
  } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedConcept, setSelectedConcept] = useState<string>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  if (!currentProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-stone-400">
        <p>{locale === 'zh-Hant' ? '請先於工作區建立或選定研究專案。' : 'Please create or select a research project in the Workspace tab.'}</p>
      </div>
    );
  }

  // Get all unique concepts
  const allConcepts = Array.from(new Set(passages.flatMap(p => p.concepts)));

  const filteredPassages = passages.filter(p => {
    const s = sources.find(src => src.id === p.sourceId);
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      p.originalText.toLowerCase().includes(q) ||
      p.translationText.toLowerCase().includes(q) ||
      p.passageLocator.toLowerCase().includes(q) ||
      (s && s.author.toLowerCase().includes(q)) ||
      (s && s.workTitle.toLowerCase().includes(q));

    const matchesConcept = selectedConcept === 'all' || p.concepts.includes(selectedConcept);

    return matchesSearch && matchesConcept;
  });

  const handleCopyCitation = (passage: Passage) => {
    const s = sources.find(src => src.id === passage.sourceId);
    const citation = s 
      ? `${s.author}, ${s.workTitle} ${passage.passageLocator} (${s.edition})`
      : `Passage ${passage.passageLocator}`;
    
    navigator.clipboard.writeText(citation);
    setCopiedId(passage.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D1CEBD] pb-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-[#8B7E66]" />
            <span>{t.nav.passages}</span>
          </h1>
          <p className="text-xs text-[#666155] mt-0.5">
            {locale === 'zh-Hant'
              ? '原始古經文（希臘文／拉丁文）雙語閱讀器，帶有 SHA-256 加密快照校驗碼與概念標籤'
              : 'Primary text reader with verbatim excerpts, translations, immutable hashes, and concept tagging.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {selectedPassageIds.length > 0 && (
            <button
              onClick={onNavigateToAnalysis}
              className="px-3.5 py-1.5 text-xs font-medium text-[#1A1A1A] bg-[#E5D5B0] hover:bg-[#DAC79B] border border-[#C5B58D] rounded flex items-center gap-1.5 transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>
                {locale === 'zh-Hant' 
                  ? `考析所選 ${selectedPassageIds.length} 段經文` 
                  : `Analyze Selected (${selectedPassageIds.length})`}
              </span>
            </button>
          )}

          <button
            onClick={onOpenAddPassage}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-[#E5D5B0]" />
            <span>{t.actions.addPassage}</span>
          </button>
        </div>
      </div>

      {/* Filter and Selection Control Bar */}
      <div className="bg-white border border-[#D1CEBD] rounded-lg p-2.5 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-3 w-full md:w-auto flex-1">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#8B7E66] absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={locale === 'zh-Hant' ? '檢索原文、譯文或出處...' : 'Search passages, texts, locators...'}
              className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded pl-9 pr-3 py-1.5 text-xs text-[#1A1A1A] placeholder-[#8B7E66] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <select
            value={selectedConcept}
            onChange={(e) => setSelectedConcept(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] text-xs rounded px-2.5 py-1.5 focus:outline-none max-w-[200px]"
          >
            <option value="all">{locale === 'zh-Hant' ? '全部概念標籤' : 'All Concepts'}</option>
            {allConcepts.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Selection toggles */}
        <div className="flex items-center gap-2 text-xs text-[#8B7E66] self-end md:self-center font-mono">
          <button
            onClick={selectAllPassages}
            className="hover:text-[#1A1A1A] underline text-[11px]"
          >
            {locale === 'zh-Hant' ? '全選' : 'Select All'}
          </button>
          <span>·</span>
          <button
            onClick={clearPassageSelection}
            className="hover:text-[#1A1A1A] underline text-[11px]"
          >
            {locale === 'zh-Hant' ? '清除選取' : 'Clear'}
          </button>
        </div>
      </div>

      {/* Passages List */}
      {filteredPassages.length === 0 ? (
        <div className="bg-[#FAF8F5] border border-dashed border-[#D1CEBD] rounded-lg p-8 text-center space-y-3">
          <p className="text-xs text-[#666155]">
            {passages.length === 0
              ? (locale === 'zh-Hant' ? '專案內尚無經文選段。請點擊「新增經文選段」輸入古經文。' : 'No passages recorded in this project yet.')
              : (locale === 'zh-Hant' ? '無符合篩選條件的經文。' : 'No passages matching the current search.')}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredPassages.map((passage) => {
            const s = sources.find(src => src.id === passage.sourceId);
            const isSelected = selectedPassageIds.includes(passage.id);

            return (
              <div
                key={passage.id}
                className={`bg-white border rounded-lg p-5 transition-all space-y-3 shadow-xs ${
                  isSelected
                    ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A] bg-[#FAF8F5]/80'
                    : 'border-[#D1CEBD] hover:border-[#8B7E66]'
                }`}
              >
                {/* Passage Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#F1EDE4] pb-3">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => togglePassageSelection(passage.id)}
                      className="text-[#8B7E66] hover:text-[#1A1A1A] transition-colors"
                      title="Select for AI Analysis"
                    >
                      {isSelected ? (
                        <CheckSquare className="w-4 h-4 text-[#1A1A1A]" />
                      ) : (
                        <Square className="w-4 h-4 text-[#D1CEBD]" />
                      )}
                    </button>

                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-serif font-semibold text-[#1A1A1A] text-sm sm:text-base">
                          {s ? `${s.author}, ${s.workTitle}` : 'Unknown Source'}
                        </h3>
                        <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#FAF8F5] text-[#1A1A1A] font-semibold border border-[#D1CEBD]">
                          {passage.passageLocator}
                        </span>
                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded font-bold uppercase border ${
                          passage.verificationStatus === 'attested'
                            ? 'bg-[#E8F0FE] text-[#1A56DB] border-[#BFDBFE]'
                            : 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                        }`}>
                          {passage.verificationStatus}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 self-end sm:self-center">
                    <button
                      onClick={() => handleCopyCitation(passage)}
                      title="Copy SBL/Chicago locator citation"
                      className="px-2 py-1 text-xs text-[#595347] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] rounded border border-[#D1CEBD] flex items-center gap-1"
                    >
                      {copiedId === passage.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span className="text-[11px]">{copiedId === passage.id ? (locale === 'zh-Hant' ? '已複製' : 'Copied') : (locale === 'zh-Hant' ? '引文' : 'Cite')}</span>
                    </button>

                    <button
                      onClick={() => onNavigateToEvidence(passage.id)}
                      title={locale === 'zh-Hant' ? '建立關聯證據卡' : 'Create Evidence Card'}
                      className="px-2 py-1 text-xs text-[#1A1A1A] hover:bg-[#E5D5B0] bg-[#FAF8F5] rounded border border-[#D1CEBD] flex items-center gap-1"
                    >
                      <FileCheck2 className="w-3.5 h-3.5 text-[#8B7E66]" />
                      <span className="text-[11px]">{locale === 'zh-Hant' ? '建證據卡' : 'Evidence Card'}</span>
                    </button>

                    <button
                      onClick={() => onOpenEditPassage(passage)}
                      title={t.actions.edit}
                      className="p-1.5 text-[#8B7E66] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] rounded"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => {
                        if (confirm(locale === 'zh-Hant' ? '確定要刪除此經文選段嗎？' : 'Delete this passage?')) {
                          deletePassage(passage.id);
                        }
                      }}
                      title={t.actions.delete}
                      className="p-1.5 text-[#8B7E66] hover:text-red-600 hover:bg-red-50 rounded"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Primary Text & Translation Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-1">
                  {/* Original ancient text */}
                  <div className="p-3.5 rounded bg-[#FAF8F5] border border-[#D1CEBD] space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#8B7E66] font-mono">
                      <span>{locale === 'zh-Hant' ? '原始語言校勘文本' : 'Original Critical Text'} ({s?.originalLanguage.toUpperCase() || 'LAT/GRC'})</span>
                      <span className="text-[#8B7E66]">{s?.edition || 'Critical apparatus'}</span>
                    </div>
                    <p className="font-serif text-sm text-[#1A1A1A] leading-relaxed italic select-text">
                      {passage.originalText}
                    </p>
                  </div>

                  {/* Scholarly translation */}
                  <div className="p-3.5 rounded bg-white border border-[#D1CEBD] space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#8B7E66] font-mono">
                      <span>{locale === 'zh-Hant' ? '學術翻譯文本' : 'Scholarly Translation'} ({passage.translationLanguage.toUpperCase()})</span>
                    </div>
                    <p className="text-xs sm:text-sm text-[#4A453A] leading-relaxed select-text">
                      {passage.translationText || <span className="italic text-[#8B7E66]">No translation supplied.</span>}
                    </p>
                  </div>
                </div>

                {/* Concepts & Checksum Footer */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 text-[11px] text-[#8B7E66]">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <Tag className="w-3 h-3 text-[#1A1A1A] shrink-0" />
                    {passage.concepts.map(c => (
                      <span
                        key={c}
                        className="px-2 py-0.5 rounded bg-[#FAF8F5] text-[#1A1A1A] border border-[#D1CEBD] text-[10px] font-medium"
                      >
                        {c}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-2 font-mono text-[10px] text-[#8B7E66]">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    <span>Snapshot Checksum: <code className="text-[#1A1A1A] font-bold">{passage.snapshot.sourceChecksum}</code></span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
