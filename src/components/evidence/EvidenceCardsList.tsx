import React, { useState } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { EvidenceCard } from '../../types';
import { 
  FileCheck2, 
  Plus, 
  Search, 
  Filter, 
  Edit3, 
  Trash2, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

interface EvidenceCardsListProps {
  onOpenAddCard: () => void;
  onOpenEditCard: (card: EvidenceCard) => void;
  onNavigateToGraph: () => void;
}

export const EvidenceCardsList: React.FC<EvidenceCardsListProps> = ({
  onOpenAddCard,
  onOpenEditCard,
  onNavigateToGraph
}) => {
  const { t, locale } = useI18n();
  const { currentProject, evidenceCards, passages, sources, deleteEvidenceCard } = useProject();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRelation, setFilterRelation] = useState('all');
  const [filterConfidence, setFilterConfidence] = useState('all');

  if (!currentProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-stone-400">
        <p>{locale === 'zh-Hant' ? '請先於工作區建立或選定研究專案。' : 'Please create or select a research project in the Workspace tab.'}</p>
      </div>
    );
  }

  const filteredCards = evidenceCards.filter(card => {
    const q = searchQuery.toLowerCase();
    const matchesSearch = 
      card.sourceConcept.toLowerCase().includes(q) ||
      (card.targetConcept && card.targetConcept.toLowerCase().includes(q)) ||
      card.researcherExplanation.toLowerCase().includes(q) ||
      card.evidenceExcerpt.toLowerCase().includes(q);

    const matchesRelation = filterRelation === 'all' || card.relationType === filterRelation;
    const matchesConfidence = filterConfidence === 'all' || card.confidence === filterConfidence;

    return matchesSearch && matchesRelation && matchesConfidence;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-5">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#D1CEBD] pb-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            <FileCheck2 className="w-5 h-5 text-[#8B7E66]" />
            <span>{t.nav.evidence}</span>
          </h1>
          <p className="text-xs text-[#666155] mt-0.5">
            {locale === 'zh-Hant'
              ? '概念關聯論證卡：本圖譜所有連線必須有至少一張實證卡支持，嚴禁無依據之抽象虛構'
              : 'Source-attested evidence cards: graph links may render only when backed by exact locators.'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {evidenceCards.length > 0 && (
            <button
              onClick={onNavigateToGraph}
              className="px-3.5 py-1.5 text-xs font-medium text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#F1EDE4] border border-[#D1CEBD] rounded flex items-center gap-1.5 transition-colors"
            >
              <span>{locale === 'zh-Hant' ? '在圖譜中檢視譜系' : 'View Genealogy Graph'}</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#1A1A1A]" />
            </button>
          )}

          <button
            onClick={onOpenAddCard}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4 text-[#E5D5B0]" />
            <span>{t.actions.createEvidenceCard}</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-[#D1CEBD] rounded-lg p-2.5 flex flex-col md:flex-row items-center gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-[#8B7E66] absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={locale === 'zh-Hant' ? '檢索概念、引文或考據論據...' : 'Search concepts, excerpts, rationale...'}
            className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded pl-9 pr-3 py-1.5 text-xs text-[#1A1A1A] placeholder-[#8B7E66] focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <select
            value={filterRelation}
            onChange={(e) => setFilterRelation(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] text-xs rounded px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">{locale === 'zh-Hant' ? '全部關聯類型' : 'All Relation Types'}</option>
            {Object.entries(t.relationTypes).map(([k, v]) => (
              <option key={k} value={k}>{v}</option>
            ))}
          </select>

          <select
            value={filterConfidence}
            onChange={(e) => setFilterConfidence(e.target.value)}
            className="bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] text-xs rounded px-2.5 py-1.5 focus:outline-none"
          >
            <option value="all">{locale === 'zh-Hant' ? '全部可信度' : 'All Confidence Levels'}</option>
            <option value="high">{t.confidences.high}</option>
            <option value="medium">{t.confidences.medium}</option>
            <option value="low">{t.confidences.low}</option>
          </select>
        </div>
      </div>

      {/* Cards List */}
      {filteredCards.length === 0 ? (
        <div className="bg-[#FAF8F5] border border-dashed border-[#D1CEBD] rounded-lg p-8 text-center space-y-3">
          <p className="text-xs text-[#666155]">
            {evidenceCards.length === 0
              ? (locale === 'zh-Hant' ? '尚未建立任何考據證據卡。請點擊「建立考據證據卡」以繫聯經文選段與概念。' : 'No evidence cards in this project yet.')
              : (locale === 'zh-Hant' ? '無符合篩選條件的證據卡。' : 'No cards matching the current filter.')}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredCards.map((card, idx) => {
            const srcPassage = passages.find(p => p.id === card.sourcePassageId);
            const tgtPassage = passages.find(p => p.id === card.targetPassageId);
            const srcSource = srcPassage ? sources.find(s => s.id === srcPassage.sourceId) : null;
            const tgtSource = tgtPassage ? sources.find(s => s.id === tgtPassage.sourceId) : null;

            return (
              <div
                key={card.id}
                className="bg-white border border-[#D1CEBD] hover:border-[#8B7E66] rounded-lg p-5 flex flex-col justify-between space-y-4 transition-all shadow-xs"
              >
                <div className="space-y-3">
                  {/* Card Title & Badges */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="text-[11px] font-mono font-bold text-[#1A1A1A] bg-[#E5D5B0] border border-[#C5B58D] px-2 py-0.5 rounded">
                          EC-{idx + 1}
                        </span>

                        <span className={`text-[9px] font-mono px-1.5 py-0.5 rounded uppercase font-bold border ${
                          card.confidence === 'high'
                            ? 'bg-[#E8F0FE] text-[#1A56DB] border-[#BFDBFE]'
                            : card.confidence === 'medium'
                            ? 'bg-[#FEF3C7] text-[#92400E] border-[#FDE68A]'
                            : 'bg-[#F5F5F4] text-[#78716C] border-[#E7E5E4]'
                        }`}>
                          {card.confidence} CONFIDENCE
                        </span>

                        <span className="text-[10px] bg-[#FAF8F5] text-[#595347] px-2 py-0.5 rounded border border-[#D1CEBD] font-medium">
                          {t.relationTypes[card.relationType] || card.relationType}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-[#1A1A1A] text-sm sm:text-base flex items-center gap-1.5 flex-wrap">
                        <span>{card.sourceConcept}</span>
                        {card.targetConcept && (
                          <>
                            <ArrowRight className="w-3.5 h-3.5 text-[#8B7E66]" />
                            <span>{card.targetConcept}</span>
                          </>
                        )}
                      </h3>
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onOpenEditCard(card)}
                        title={t.actions.edit}
                        className="p-1.5 text-[#8B7E66] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] rounded"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => {
                          if (confirm(locale === 'zh-Hant' ? '確定要刪除此證據卡嗎？' : 'Delete this evidence card?')) {
                            deleteEvidenceCard(card.id);
                          }
                        }}
                        title={t.actions.delete}
                        className="p-1.5 text-[#8B7E66] hover:text-red-600 hover:bg-red-50 rounded"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Connected Works & Locators */}
                  <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[11px] text-[#8B7E66]">
                      <span>{locale === 'zh-Hant' ? '文獻繫聯出處：' : 'Textual Linkage:'}</span>
                      <span className="font-mono font-bold text-[#1A1A1A]">{card.exactLocators.join(' ↔ ') || 'Direct'}</span>
                    </div>

                    <p className="text-[#4A453A] text-xs font-serif">
                      <strong>{srcSource?.author || 'Source'}:</strong> <em>{srcSource?.workTitle}</em> [{srcPassage?.passageLocator}]
                      {tgtSource && (
                        <span> → <strong>{tgtSource.author}:</strong> <em>{tgtSource.workTitle}</em> [{tgtPassage?.passageLocator}]</span>
                      )}
                    </p>
                  </div>

                  {/* Verbatim Excerpt */}
                  {card.evidenceExcerpt && (
                    <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#D1CEBD]">
                      <p className="text-[10px] text-[#8B7E66] font-mono mb-1">{locale === 'zh-Hant' ? '原始引證 (Verbatim Excerpt)' : 'Verbatim Primary Excerpt'}:</p>
                      <p className="font-serif italic text-xs text-[#1A1A1A] leading-relaxed">
                        "{card.evidenceExcerpt}"
                      </p>
                    </div>
                  )}

                  {/* Researcher Explanation */}
                  <div className="space-y-1">
                    <p className="text-[10px] text-[#8B7E66] font-bold uppercase tracking-wider">{t.fields.scholarRationale}:</p>
                    <p className="text-xs text-[#4A453A] leading-relaxed">
                      {card.researcherExplanation}
                    </p>
                  </div>

                  {/* AI Interpretation if present */}
                  {card.aiInterpretation && (
                    <div className="p-2 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs text-[#595347] space-y-1">
                      <div className="flex items-center gap-1 text-[10px] text-[#8B7E66] font-mono">
                        <Sparkles className="w-3 h-3 text-[#1A1A1A]" />
                        <span className="font-bold">{locale === 'zh-Hant' ? '[AI 詮釋標記]' : '[AI Model Interpretation]'}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed">
                        {card.aiInterpretation}
                      </p>
                    </div>
                  )}

                  {/* Reviewer Notes */}
                  {card.reviewerNotes && (
                    <p className="text-[11px] text-[#8B7E66] italic">
                      <strong className="text-[#1A1A1A] font-medium">{locale === 'zh-Hant' ? '同儕審查註記' : 'Reviewer Note'}:</strong> {card.reviewerNotes}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
