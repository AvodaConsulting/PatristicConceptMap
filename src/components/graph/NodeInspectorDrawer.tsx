import React from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { GraphNode, GraphLink, EvidenceCard, SourceRecord, Passage } from '../../types';
import { X, Network, FileCheck2, BookOpen, Library, ShieldCheck, ArrowRight, Sparkles } from 'lucide-react';

interface NodeInspectorDrawerProps {
  selectedNode: GraphNode | null;
  selectedLink: GraphLink | null;
  evidenceCards: EvidenceCard[];
  sources: SourceRecord[];
  passages: Passage[];
  onClose: () => void;
  onNavigateToAnalysisWithPassages?: (passageIds: string[]) => void;
}

export const NodeInspectorDrawer: React.FC<NodeInspectorDrawerProps> = ({
  selectedNode,
  selectedLink,
  evidenceCards,
  sources,
  passages,
  onClose,
  onNavigateToAnalysisWithPassages
}) => {
  const { t, locale } = useI18n();

  if (!selectedNode && !selectedLink) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-white border-l border-[#D1CEBD] text-[#1A1A1A] shadow-2xl p-6 overflow-y-auto space-y-5 animate-in slide-in-from-right duration-300">
      {/* Header */}
      <div className="flex items-start justify-between border-b border-[#F1EDE4] pb-3">
        <div className="flex items-center gap-2">
          <Network className="w-5 h-5 text-[#8B7E66]" />
          <h2 className="text-base font-serif font-bold text-[#1A1A1A]">
            {selectedNode ? (locale === 'zh-Hant' ? '節點考證檔案' : 'Node Inspector') : (locale === 'zh-Hant' ? '關係考證檔案' : 'Link Inspector')}
          </h2>
        </div>
        <button
          onClick={onClose}
          className="text-[#8B7E66] hover:text-[#1A1A1A] p-1"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Selected Node Details */}
      {selectedNode && (
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] px-2 py-0.5 rounded font-bold">
              {selectedNode.type}
            </span>
            <h3 className="font-serif font-bold text-lg text-[#1A1A1A] mt-1.5">
              {selectedNode.label}
            </h3>
            {selectedNode.sublabel && (
              <p className="text-xs text-[#666155] italic">{selectedNode.sublabel}</p>
            )}
          </div>

          {selectedNode.tradition && (
            <div className="p-2.5 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs">
              <span className="text-[#8B7E66] font-mono text-[10px] block font-bold uppercase">{locale === 'zh-Hant' ? '思想與地域流派' : 'Tradition'}:</span>
              <span className="text-[#1A1A1A] font-semibold">{selectedNode.tradition}</span>
            </div>
          )}

          {/* Node Passages */}
          {selectedNode.passageId && (
            <div>
              <h4 className="text-xs font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5 mb-2">
                <BookOpen className="w-3.5 h-3.5 text-[#8B7E66]" />
                <span>{locale === 'zh-Hant' ? '關聯原始經文' : 'Associated Primary Passage'}</span>
              </h4>
              {(() => {
                const p = passages.find(x => x.id === selectedNode.passageId);
                const s = p ? sources.find(src => src.id === p.sourceId) : null;
                if (!p) return <p className="text-xs text-[#8B7E66]">No passage found</p>;

                return (
                  <div className="p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-[#8B7E66] font-mono">
                      <span>{s?.author} [{p.passageLocator}]</span>
                      <span className="text-[#065F46] font-bold">{p.verificationStatus}</span>
                    </div>
                    <blockquote className="font-serif italic text-[#1A1A1A] text-xs leading-relaxed">
                      "{p.originalText}"
                    </blockquote>
                    <p className="text-[#595347] text-xs pt-1 border-t border-[#D1CEBD]">
                      {p.translationText}
                    </p>
                  </div>
                );
              })()}
            </div>
          )}

          {/* Relevant Evidence Cards & Concept Context */}
          <div>
            <h4 className="text-xs font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5 mb-2">
              <FileCheck2 className="w-3.5 h-3.5 text-[#8B7E66]" />
              <span>{locale === 'zh-Hant' ? '支撐此節點之實證卡' : 'Supporting Evidence Cards'}</span>
            </h4>
            {(() => {
              const nodeLabelNorm = selectedNode.label.toLowerCase().trim();
              const matchingCards = evidenceCards.filter(c => {
                if (selectedNode.id && (c.sourceNodeId === selectedNode.id || c.targetNodeId === selectedNode.id)) return true;
                if (selectedNode.passageId && (c.sourcePassageId === selectedNode.passageId || c.targetPassageId === selectedNode.passageId)) return true;
                if (selectedNode.label) {
                  const srcC = (c.sourceConcept || '').toLowerCase().trim();
                  const tgtC = (c.targetConcept || '').toLowerCase().trim();
                  if (srcC.includes(nodeLabelNorm) || nodeLabelNorm.includes(srcC) || tgtC.includes(nodeLabelNorm) || nodeLabelNorm.includes(tgtC)) return true;
                }
                return false;
              });

              if (matchingCards.length === 0) {
                return (
                  <div className="p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs space-y-2">
                    <p className="text-[#595347] leading-relaxed">
                      {selectedNode.type === 'concept'
                        ? (locale === 'zh-Hant'
                            ? '此概念節點源自經文關鍵詞標籤。目前尚未建立以此概念為起點或終點的專屬「實證卡（Evidence Card）」。'
                            : 'This concept node is derived from passage keywords. No dedicated directional Evidence Card has been linked to this concept yet.')
                        : (locale === 'zh-Hant'
                            ? '此經文已收錄於專案語料庫中，但尚未建立跨文本流變的單獨實證卡。'
                            : 'This primary passage is in the corpus, but does not yet have a dedicated cross-textual Evidence Card.')}
                    </p>
                    <p className="text-[11px] text-[#8B7E66]">
                      {locale === 'zh-Hant'
                        ? '💡 提示：前往「實證卡管理」或在「源文約束考析」中，可針對此經文／概念一鍵建立考據關係卡。'
                        : '💡 Tip: Go to Evidence Cards or Bounded AI Analysis to synthesize links for this locus.'}
                    </p>
                  </div>
                );
              }

              return (
                <div className="space-y-2">
                  {matchingCards.map(c => (
                    <div key={c.id} className="p-2.5 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs space-y-1.5">
                      <div className="flex items-center justify-between text-[10px] font-mono">
                        <span className="text-[#1A1A1A] font-bold">{t.relationTypes[c.relationType] || c.relationType}</span>
                        <span className="text-[#065F46] uppercase font-bold">{c.confidence}</span>
                      </div>
                      <p className="text-[#4A453A] text-xs leading-relaxed">{c.researcherExplanation}</p>
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>

          {/* Passages mentioning this concept (if concept node) */}
          {selectedNode.type === 'concept' && (() => {
            const relatedPassages = passages.filter(p => 
              p.concepts.some(c => c.toLowerCase().includes(selectedNode.label.toLowerCase()) || selectedNode.label.toLowerCase().includes(c.toLowerCase()))
            );
            if (relatedPassages.length === 0) return null;

            return (
              <div className="pt-2 border-t border-[#F1EDE4] space-y-2">
                <h4 className="text-xs font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5">
                  <Library className="w-3.5 h-3.5 text-[#8B7E66]" />
                  <span>{locale === 'zh-Hant' ? `提及此概念之原始經文 (${relatedPassages.length})` : `Passages Featuring Concept (${relatedPassages.length})`}</span>
                </h4>
                <div className="space-y-1.5 max-h-48 overflow-y-auto">
                  {relatedPassages.map(p => {
                    const src = sources.find(s => s.id === p.sourceId);
                    return (
                      <div key={p.id} className="p-2 rounded bg-[#FAF8F5] border border-[#E5DFD3] text-[11px] space-y-1">
                        <div className="flex items-center justify-between text-[#8B7E66] font-mono">
                          <span className="font-semibold text-[#1A1A1A]">{src?.author}: {p.passageLocator}</span>
                          <span>{src?.compositionDate.startYear} CE</span>
                        </div>
                        <p className="font-serif italic text-[#4A453A] line-clamp-2">
                          "{p.originalText}"
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Selected Link Details */}
      {selectedLink && (
        <div className="space-y-4">
          <div>
            <span className="text-[10px] font-mono uppercase bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] px-2 py-0.5 rounded font-bold">
              {t.relationTypes[selectedLink.relationType] || selectedLink.relationType}
            </span>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-serif font-bold text-[#1A1A1A]">
                {typeof selectedLink.source === 'object' ? selectedLink.source.label : selectedLink.source}
              </span>
              <ArrowRight className="w-4 h-4 text-[#8B7E66] shrink-0" />
              <span className="font-serif font-bold text-[#1A1A1A]">
                {typeof selectedLink.target === 'object' ? selectedLink.target.label : selectedLink.target}
              </span>
            </div>
          </div>

          <div className="p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs space-y-1.5">
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#666155]">{t.fields.confidence}:</span>
              <span className={`font-mono uppercase font-bold ${
                selectedLink.confidence === 'high' ? 'text-[#065F46]' : selectedLink.confidence === 'medium' ? 'text-[#92400E]' : 'text-[#666155]'
              }`}>
                {selectedLink.confidence}
              </span>
            </div>
            <div className="flex items-center justify-between text-[11px]">
              <span className="text-[#666155]">{t.fields.status}:</span>
              <span className="font-mono text-[#1A1A1A] font-medium">{selectedLink.verificationStatus}</span>
            </div>
          </div>

          {/* Attached Evidence Cards */}
          <div>
            <h4 className="text-xs font-serif font-bold text-[#1A1A1A] flex items-center gap-1.5 mb-2">
              <FileCheck2 className="w-3.5 h-3.5 text-[#8B7E66]" />
              <span>{locale === 'zh-Hant' ? '綁定之考據證據卡' : 'Attached Evidence Cards'}</span>
            </h4>
            <div className="space-y-3">
              {selectedLink.evidenceCardIds.map(cardId => {
                const card = evidenceCards.find(c => c.id === cardId);
                if (!card) return null;
                return (
                  <div key={card.id} className="p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs space-y-2">
                    <div className="flex items-center justify-between text-[11px] font-mono text-[#8B7E66]">
                      <span>Locators: {card.exactLocators.join(', ')}</span>
                      <span className="text-[#065F46] uppercase font-bold">{card.confidence}</span>
                    </div>
                    {card.evidenceExcerpt && (
                      <blockquote className="font-serif italic text-[#1A1A1A] text-xs border-l-2 border-[#1A1A1A] pl-2">
                        "{card.evidenceExcerpt}"
                      </blockquote>
                    )}
                    <p className="text-[#4A453A] text-xs leading-relaxed">
                      {card.researcherExplanation}
                    </p>
                    {card.aiInterpretation && (
                      <div className="p-2 rounded bg-white text-[11px] text-[#595347] border border-[#D1CEBD]">
                        <strong>[AI]:</strong> {card.aiInterpretation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
