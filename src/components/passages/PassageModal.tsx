import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { Passage, VerificationStatus } from '../../types';
import { generateTextChecksum } from '../../services/checksum';
import { PATRISTIC_AUTHORS_CATALOG, CANONICAL_CONCEPTS, PassagePreset } from '../../data/patristicCatalog';
import { BookOpen, Save, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface PassageModalProps {
  isOpen: boolean;
  passageToEdit?: Passage | null;
  defaultSourceId?: string;
  onClose: () => void;
}

export const PassageModal: React.FC<PassageModalProps> = ({
  isOpen,
  passageToEdit,
  defaultSourceId,
  onClose
}) => {
  const { t, locale } = useI18n();
  const { currentProject, sources, savePassage } = useProject();

  const [sourceId, setSourceId] = useState(defaultSourceId || '');
  const [selectedPassagePresetId, setSelectedPassagePresetId] = useState('');
  const [passageLocator, setPassageLocator] = useState('');
  const [originalText, setOriginalText] = useState('');
  const [translationText, setTranslationText] = useState('');
  const [translationLanguage, setTranslationLanguage] = useState<'en' | 'zh-Hant'>(locale);
  const [concepts, setConcepts] = useState<string[]>([]);
  const [customConcept, setCustomConcept] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('attested');
  const [notes, setNotes] = useState('');

  // Collect all available passage presets from catalog
  const allCatalogPassages: { authorName: string; workTitle: string; passage: PassagePreset }[] = [];
  PATRISTIC_AUTHORS_CATALOG.forEach(author => {
    author.works.forEach(work => {
      work.passages.forEach(p => {
        allCatalogPassages.push({
          authorName: author.name,
          workTitle: work.title,
          passage: p
        });
      });
    });
  });

  useEffect(() => {
    if (passageToEdit) {
      setSourceId(passageToEdit.sourceId);
      setPassageLocator(passageToEdit.passageLocator);
      setOriginalText(passageToEdit.originalText);
      setTranslationText(passageToEdit.translationText || '');
      setTranslationLanguage(passageToEdit.translationLanguage);
      setConcepts(passageToEdit.concepts);
      setVerificationStatus(passageToEdit.verificationStatus);
      setNotes(passageToEdit.notes || '');
      setSelectedPassagePresetId('');
    } else {
      setSourceId(defaultSourceId || (sources[0]?.id || ''));
      setPassageLocator('');
      setOriginalText('');
      setTranslationText('');
      setTranslationLanguage(locale);
      setConcepts(['Concupiscentia / Desire']);
      setVerificationStatus('attested');
      setNotes('');
      setSelectedPassagePresetId('');
    }
  }, [passageToEdit, defaultSourceId, isOpen, sources, locale]);

  if (!isOpen || !currentProject) return null;

  const handleSelectPassagePreset = (presetId: string) => {
    setSelectedPassagePresetId(presetId);
    const found = allCatalogPassages.find(p => p.passage.id === presetId);
    if (!found) return;

    setPassageLocator(found.passage.locator);
    setOriginalText(found.passage.originalText);
    setTranslationText(locale === 'zh-Hant' ? found.passage.translationZh : found.passage.translationEn);
    setConcepts(found.passage.concepts);
    if (found.passage.notes) {
      setNotes(found.passage.notes);
    }
  };

  const toggleConcept = (c: string) => {
    setConcepts(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const handleAddCustomConcept = () => {
    if (customConcept.trim() && !concepts.includes(customConcept.trim())) {
      setConcepts(prev => [...prev, customConcept.trim()]);
      setCustomConcept('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceId || !passageLocator.trim() || !originalText.trim()) return;

    const checksum = await generateTextChecksum(originalText);

    const newPassage: Passage = {
      id: passageToEdit?.id || `pas-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId: currentProject.id,
      sourceId,
      passageLocator: passageLocator.trim(),
      originalText: originalText.trim(),
      translationText: translationText.trim(),
      translationLanguage,
      concepts: concepts.length > 0 ? concepts : ['General Concept'],
      verificationStatus,
      snapshot: {
        importedAt: passageToEdit?.snapshot.importedAt || new Date().toISOString(),
        sourceChecksum: checksum,
        isImmutable: true
      },
      notes: notes.trim() || undefined,
      createdAt: passageToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await savePassage(newPassage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#D1CEBD] text-[#1A1A1A] rounded-lg max-w-2xl w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-[#F1EDE4] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-[#8B7E66]">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">
                {passageToEdit 
                  ? (locale === 'zh-Hant' ? '編輯經文選段' : 'Edit Primary Passage') 
                  : (locale === 'zh-Hant' ? '新增原始古經文選段' : 'Add Primary Source Passage')}
              </h2>
              <p className="text-xs text-[#666155]">
                {locale === 'zh-Hant' ? '謄錄原文（希臘文／拉丁文），綁定概念標籤與加密快照' : 'Transcribe original text, assign concepts, and create immutable snapshot.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8B7E66] hover:text-[#1A1A1A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick Preset Pull-Down Menu */}
          <div className="p-3 bg-[#FAF8F5] border border-[#D1CEBD] rounded-lg space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7E66]" />
              <span>{locale === 'zh-Hant' ? '經典經文選段下拉快捷載入 (Canonical Loci Preset)' : 'Canonical Loci Preset Menu (Instant Auto-Fill)'}</span>
            </div>
            <select
              value={selectedPassagePresetId}
              onChange={(e) => handleSelectPassagePreset(e.target.value)}
              className="w-full bg-white border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="">{locale === 'zh-Hant' ? '-- 從教父經文庫中選擇經典段落（自動填入原文、譯文與標籤）--' : '-- Select attested passage from catalog (Auto-fills original text & translation) --'}</option>
              {allCatalogPassages.map(item => (
                <option key={item.passage.id} value={item.passage.id}>
                  {item.authorName.split('(')[0]} • {item.workTitle} [{item.passage.locator}] — {item.passage.originalText.slice(0, 45)}...
                </option>
              ))}
            </select>
            {selectedPassagePresetId && (
              <p className="text-[10px] text-[#2B6CB0] flex items-center gap-1 font-medium pt-0.5">
                <CheckCircle2 className="w-3 h-3 text-[#2B6CB0]" />
                <span>
                  {locale === 'zh-Hant'
                    ? '已自動帶入：確切章節定位碼、權威希臘文/拉丁文原典、學術譯文與神學概念標籤'
                    : 'Auto-populated: Exact locator, authentic Greek/Latin text, scholarly translation & concepts.'}
                </span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {locale === 'zh-Hant' ? '所屬文獻出處' : 'Parent Source Record'} *
              </label>
              <select
                required
                value={sourceId}
                onChange={(e) => setSourceId(e.target.value)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                {sources.length === 0 ? (
                  <option value="">{locale === 'zh-Hant' ? '（請先登錄出處）' : '(No sources available)'}</option>
                ) : (
                  sources.map(s => (
                    <option key={s.id} value={s.id}>
                      {s.author} — {s.workTitle} ({s.edition})
                    </option>
                  ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.locator} *
              </label>
              <input
                type="text"
                required
                value={passageLocator}
                onChange={(e) => setPassageLocator(e.target.value)}
                placeholder="e.g. XIV.16 or VIII.7.17 or 54.3"
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
              {t.fields.originalText} *
            </label>
            <textarea
              required
              rows={4}
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Paste exact Greek, Latin, or Syriac critical text..."
              className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded p-3 text-xs text-[#1A1A1A] font-serif leading-relaxed focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-[#1A1A1A] uppercase tracking-wider">
                {t.fields.translation}
              </label>
              <div className="flex items-center gap-2 text-[11px]">
                <button
                  type="button"
                  onClick={() => setTranslationLanguage('en')}
                  className={`px-2 py-0.5 rounded border transition-colors ${translationLanguage === 'en' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-[#FAF8F5] text-[#666155] border-[#D1CEBD]'}`}
                >
                  English
                </button>
                <button
                  type="button"
                  onClick={() => setTranslationLanguage('zh-Hant')}
                  className={`px-2 py-0.5 rounded border transition-colors ${translationLanguage === 'zh-Hant' ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]' : 'bg-[#FAF8F5] text-[#666155] border-[#D1CEBD]'}`}
                >
                  繁體中文
                </button>
              </div>
            </div>
            <textarea
              rows={3}
              value={translationText}
              onChange={(e) => setTranslationText(e.target.value)}
              placeholder={locale === 'zh-Hant' ? '學者學術中文譯本...' : 'Enter scholarly English translation...'}
              className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded p-3 text-xs text-[#1A1A1A] leading-relaxed focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          {/* Concepts Selector with Extended Canonical Tags */}
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
              {locale === 'zh-Hant' ? '點擊選擇概念標籤 (Click to Select Concept Tags)' : 'Concept Tags (Click to Select)'}
            </label>
            <div className="flex flex-wrap gap-1.5 mb-2 max-h-32 overflow-y-auto p-1.5 bg-[#FAF8F5] border border-[#D1CEBD] rounded">
              {CANONICAL_CONCEPTS.map(c => {
                const isSelected = concepts.includes(c);
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => toggleConcept(c)}
                    className={`px-2 py-1 rounded text-[11px] font-semibold border transition-colors ${
                      isSelected
                        ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white shadow-xs'
                        : 'bg-white border-[#D1CEBD] text-[#666155] hover:text-[#1A1A1A] hover:bg-[#F1EDE4]'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={customConcept}
                onChange={(e) => setCustomConcept(e.target.value)}
                placeholder={locale === 'zh-Hant' ? '或輸入自訂概念標籤...' : 'Or add custom concept tag...'}
                className="flex-1 bg-[#FAF8F5] border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A]"
              />
              <button
                type="button"
                onClick={handleAddCustomConcept}
                className="px-3 py-1.5 text-xs bg-[#FAF8F5] hover:bg-[#F1EDE4] text-[#1A1A1A] border border-[#D1CEBD] rounded font-bold transition-colors"
              >
                +
              </button>
            </div>
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
                {locale === 'zh-Hant' ? '批判校勘備註' : 'Apparatus / Notes'}
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Variant readings or context"
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
