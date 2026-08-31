import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { EvidenceCard, RelationType, ConfidenceLevel, VerificationStatus } from '../../types';
import { CANONICAL_CONCEPTS, SYNTHESIS_TEMPLATES, SynthesisTemplate } from '../../data/patristicCatalog';
import { FileCheck2, Save, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface EvidenceCardModalProps {
  isOpen: boolean;
  cardToEdit?: EvidenceCard | null;
  defaultSourcePassageId?: string;
  onClose: () => void;
}

export const EvidenceCardModal: React.FC<EvidenceCardModalProps> = ({
  isOpen,
  cardToEdit,
  defaultSourcePassageId,
  onClose
}) => {
  const { t, locale } = useI18n();
  const { currentProject, passages, sources, saveEvidenceCard } = useProject();

  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [sourcePassageId, setSourcePassageId] = useState(defaultSourcePassageId || '');
  const [targetPassageId, setTargetPassageId] = useState('');
  const [sourceConcept, setSourceConcept] = useState('Concupiscentia / Desire');
  const [targetConcept, setTargetConcept] = useState('Gratia / Grace');
  const [relationType, setRelationType] = useState<RelationType>('explicit_interpretation');
  const [confidence, setConfidence] = useState<ConfidenceLevel>('high');
  const [evidenceExcerpt, setEvidenceExcerpt] = useState('');
  const [researcherExplanation, setResearcherExplanation] = useState('');
  const [aiInterpretation, setAiInterpretation] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('attested');
  const [reviewerNotes, setReviewerNotes] = useState('');
  const [cautionNote, setCautionNote] = useState('');

  useEffect(() => {
    if (cardToEdit) {
      setSourcePassageId(cardToEdit.sourcePassageId);
      setTargetPassageId(cardToEdit.targetPassageId || '');
      setSourceConcept(cardToEdit.sourceConcept);
      setTargetConcept(cardToEdit.targetConcept || '');
      setRelationType(cardToEdit.relationType);
      setConfidence(cardToEdit.confidence);
      setEvidenceExcerpt(cardToEdit.evidenceExcerpt);
      setResearcherExplanation(cardToEdit.researcherExplanation);
      setAiInterpretation(cardToEdit.aiInterpretation || '');
      setVerificationStatus(cardToEdit.verificationStatus);
      setReviewerNotes(cardToEdit.reviewerNotes || '');
      setCautionNote(cardToEdit.cautionNote || '');
      setSelectedTemplateId('');
    } else {
      const initialSrc = defaultSourcePassageId || (passages[0]?.id || '');
      setSourcePassageId(initialSrc);
      setTargetPassageId(passages.length > 1 ? passages[1].id : '');
      setSourceConcept('Concupiscentia / Desire');
      setTargetConcept('Gratia / Grace');
      setRelationType('explicit_interpretation');
      setConfidence('high');
      setEvidenceExcerpt('');
      setResearcherExplanation('');
      setAiInterpretation('');
      setVerificationStatus('attested');
      setReviewerNotes('');
      setCautionNote('');
      setSelectedTemplateId('');
    }
  }, [cardToEdit, defaultSourcePassageId, isOpen, passages]);

  // Auto-populate excerpt when source passage changes if excerpt is empty
  const handleSourcePassageChange = (pId: string) => {
    setSourcePassageId(pId);
    if (!evidenceExcerpt) {
      const p = passages.find(x => x.id === pId);
      if (p) setEvidenceExcerpt(p.originalText);
    }
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = SYNTHESIS_TEMPLATES.find(t => t.id === templateId);
    if (!tmpl) return;

    setSourceConcept(tmpl.sourceConcept);
    setTargetConcept(tmpl.targetConcept);
    setRelationType(tmpl.relationType);
    setConfidence(tmpl.confidence);
    setResearcherExplanation(locale === 'zh-Hant' ? tmpl.explanationZh : tmpl.explanationEn);
  };

  if (!isOpen || !currentProject) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourcePassageId || !researcherExplanation.trim()) return;

    const srcPassage = passages.find(p => p.id === sourcePassageId);
    const tgtPassage = targetPassageId ? passages.find(p => p.id === targetPassageId) : null;
    const srcSource = srcPassage ? sources.find(s => s.id === srcPassage.sourceId) : null;
    const tgtSource = tgtPassage ? sources.find(s => s.id === tgtPassage.sourceId) : null;

    const exactLocators: string[] = [];
    if (srcSource && srcPassage) {
      exactLocators.push(`${srcSource.workTitle} ${srcPassage.passageLocator}`);
    }
    if (tgtSource && tgtPassage) {
      exactLocators.push(`${tgtSource.workTitle} ${tgtPassage.passageLocator}`);
    }

    const card: EvidenceCard = {
      id: cardToEdit?.id || `ec-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId: currentProject.id,
      sourcePassageId,
      targetPassageId: targetPassageId || undefined,
      sourceConcept,
      targetConcept: targetConcept || undefined,
      sourceNodeId: sourcePassageId,
      targetNodeId: targetPassageId || sourcePassageId,
      exactLocators,
      relationType,
      confidence,
      evidenceExcerpt: evidenceExcerpt.trim() || (srcPassage?.originalText || ''),
      researcherExplanation: researcherExplanation.trim(),
      aiInterpretation: aiInterpretation.trim() || undefined,
      verificationStatus,
      reviewerNotes: reviewerNotes.trim() || undefined,
      cautionNote: cautionNote.trim() || undefined,
      createdAt: cardToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveEvidenceCard(card);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#D1CEBD] text-[#1A1A1A] rounded-lg max-w-2xl w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-[#F1EDE4] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-[#8B7E66]">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">
                {cardToEdit 
                  ? (locale === 'zh-Hant' ? '編輯考據證據卡' : 'Edit Evidence Card') 
                  : (locale === 'zh-Hant' ? '建立源文考據證據卡' : 'Create Source-Attested Evidence Card')}
              </h2>
              <p className="text-xs text-[#666155]">
                {locale === 'zh-Hant' 
                  ? '每條圖譜關係均須綁定證據卡。請指定確切經文出處、關聯類型與考據論據。' 
                  : 'Every graph link requires an evidence card with primary locators and rationale.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8B7E66] hover:text-[#1A1A1A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick-Fill Synthesis Template Pull-Down */}
          <div className="p-3 bg-[#FAF8F5] border border-[#D1CEBD] rounded-lg space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7E66]" />
              <span>{locale === 'zh-Hant' ? '神學論證範本快捷填入 (Theological Template Fast-Fill)' : 'Synthesis Template Fast-Fill (Instant Auto-Populate)'}</span>
            </div>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full bg-white border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="">{locale === 'zh-Hant' ? '-- 選擇經典神學論證模式範本 (自動填入概念、關聯與論述) --' : '-- Choose Theological Argument Template (Auto-fills concepts, relation & rationale) --'}</option>
              {SYNTHESIS_TEMPLATES.map(tmpl => (
                <option key={tmpl.id} value={tmpl.id}>
                  {locale === 'zh-Hant' ? tmpl.labelZh : tmpl.labelEn} ({tmpl.sourceConcept} ➔ {tmpl.targetConcept})
                </option>
              ))}
            </select>
            {selectedTemplateId && (
              <p className="text-[10px] text-[#2B6CB0] flex items-center gap-1 font-medium pt-0.5">
                <CheckCircle2 className="w-3 h-3 text-[#2B6CB0]" />
                <span>
                  {locale === 'zh-Hant'
                    ? '已自動帶入：起訖核心概念、關聯類型、嚴謹度與學術論證闡釋'
                    : 'Auto-populated: Source & target concepts, relation type, confidence & scholarly rationale.'}
                </span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {locale === 'zh-Hant' ? '來源經文選段' : 'Source Passage'} *
              </label>
              <select
                required
                value={sourcePassageId}
                onChange={(e) => handleSourcePassageChange(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                {passages.map(p => {
                  const s = sources.find(src => src.id === p.sourceId);
                  return (
                    <option key={p.id} value={p.id}>
                      {s ? `${s.author} - ${s.workTitle}` : 'Source'} [{p.passageLocator}]
                    </option>
                  );
                })}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {locale === 'zh-Hant' ? '對照／後繼經文選段（可選）' : 'Target / Consequent Passage (Optional)'}
              </label>
              <select
                value={targetPassageId}
                onChange={(e) => setTargetPassageId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                <option value="">{locale === 'zh-Hant' ? '（單一經文概念扎根，不連結其他經文）' : '(None - Single passage concept grounding)'}</option>
                {passages.map(p => {
                  const s = sources.find(src => src.id === p.sourceId);
                  return (
                    <option key={p.id} value={p.id}>
                      {s ? `${s.author} - ${s.workTitle}` : 'Source'} [{p.passageLocator}]
                    </option>
                  );
                })}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {locale === 'zh-Hant' ? '核心概念 (Source Concept)' : 'Source Concept'}
              </label>
              <select
                value={sourceConcept}
                onChange={(e) => setSourceConcept(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                {CANONICAL_CONCEPTS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {locale === 'zh-Hant' ? '流變概念 (Target Concept)' : 'Target Concept'}
              </label>
              <select
                value={targetConcept}
                onChange={(e) => setTargetConcept(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                <option value="">{locale === 'zh-Hant' ? '（無目標概念）' : '(None)'}</option>
                {CANONICAL_CONCEPTS.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.relationType} *
              </label>
              <select
                value={relationType}
                onChange={(e) => setRelationType(e.target.value as RelationType)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                {Object.entries(t.relationTypes).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.confidence} *
              </label>
              <select
                value={confidence}
                onChange={(e) => setConfidence(e.target.value as ConfidenceLevel)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                {Object.entries(t.confidences).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
              {locale === 'zh-Hant' ? '原始經文直接引證 (Verbatim Excerpt)' : 'Verbatim Primary Excerpt'}
            </label>
            <textarea
              rows={2}
              value={evidenceExcerpt}
              onChange={(e) => setEvidenceExcerpt(e.target.value)}
              placeholder="Paste exact Greek or Latin keywords / phrases..."
              className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded p-2.5 text-xs text-[#1A1A1A] font-serif italic focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
              {t.fields.scholarRationale} *
            </label>
            <textarea
              required
              rows={3}
              value={researcherExplanation}
              onChange={(e) => setResearcherExplanation(e.target.value)}
              placeholder={locale === 'zh-Hant' ? '闡述經文間的直接引用、詞彙延續、詮釋轉化或神學論戰根據...' : 'State the textual, lexical, or theological basis for this relationship...'}
              className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded p-2.5 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
              {t.fields.aiInterpretation} ({locale === 'zh-Hant' ? '由學者審核並明確標記' : 'Tagged distinctly'})
            </label>
            <textarea
              rows={2}
              value={aiInterpretation}
              onChange={(e) => setAiInterpretation(e.target.value)}
              placeholder={locale === 'zh-Hant' ? '選填：若有參考 AI 輔助詮釋建議，請在此明確註明...' : 'Optional: LLM interpretation notes (distinctly separated from primary evidence)...'}
              className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded p-2.5 text-xs text-[#595347] focus:outline-none focus:border-[#1A1A1A] font-sans"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.status}
              </label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A]"
              >
                <option value="attested">{t.provenance.attested}</option>
                <option value="provisional">{t.provenance.provisional}</option>
                <option value="discovery_lead">{t.provenance.discovery_lead}</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.reviewerNotes}
              </label>
              <input
                type="text"
                value={reviewerNotes}
                onChange={(e) => setReviewerNotes(e.target.value)}
                placeholder="Peer review or collation notes"
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A]"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2.5 pt-3 border-t border-[#F1EDE4]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-[#595347] hover:text-[#1A1A1A] border border-[#D1CEBD] rounded hover:bg-[#FAF8F5] transition-colors"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              className="px-4 py-1.5 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded flex items-center gap-1.5 shadow-xs transition-colors"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{t.actions.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
