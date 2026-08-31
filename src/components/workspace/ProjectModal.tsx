import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { ResearchProject } from '../../types';
import { PROJECT_TEMPLATES } from '../../data/patristicCatalog';
import { FolderPlus, Save, X, Sparkles, CheckCircle2 } from 'lucide-react';

interface ProjectModalProps {
  isOpen: boolean;
  projectToEdit?: ResearchProject | null;
  onClose: () => void;
}

export const ProjectModal: React.FC<ProjectModalProps> = ({ isOpen, projectToEdit, onClose }) => {
  const { t, locale } = useI18n();
  const { createProject, updateProject } = useProject();

  const [selectedTemplateId, setSelectedTemplateId] = useState('');
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [researchQuestion, setResearchQuestion] = useState('');
  const [methodologyNote, setMethodologyNote] = useState('');
  const [language, setLanguage] = useState<'en' | 'zh-Hant'>(locale);
  const [startYear, setStartYear] = useState(30);
  const [endYear, setEndYear] = useState(800);

  useEffect(() => {
    if (projectToEdit) {
      setTitle(projectToEdit.title);
      setSubtitle(projectToEdit.subtitle || '');
      setResearchQuestion(projectToEdit.researchQuestion);
      setMethodologyNote(projectToEdit.methodologyNote || '');
      setLanguage(projectToEdit.language);
      setStartYear(projectToEdit.dateRange.startYear);
      setEndYear(projectToEdit.dateRange.endYear);
      setSelectedTemplateId('');
    } else {
      setTitle('');
      setSubtitle('');
      setResearchQuestion('');
      setMethodologyNote('');
      setLanguage(locale);
      setStartYear(30);
      setEndYear(800);
      setSelectedTemplateId('');
    }
  }, [projectToEdit, isOpen, locale]);

  if (!isOpen) return null;

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplateId(templateId);
    const tmpl = PROJECT_TEMPLATES.find(p => p.id === templateId);
    if (!tmpl) return;

    setTitle(locale === 'zh-Hant' ? tmpl.titleZh : tmpl.titleEn);
    setSubtitle(locale === 'zh-Hant' ? tmpl.subtitleZh : tmpl.subtitleEn);
    setResearchQuestion(locale === 'zh-Hant' ? tmpl.researchQuestionZh : tmpl.researchQuestionEn);
    setMethodologyNote(locale === 'zh-Hant' ? tmpl.methodologyNoteZh : tmpl.methodologyNoteEn);
    setStartYear(tmpl.startYear);
    setEndYear(tmpl.endYear);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !researchQuestion.trim()) return;

    if (projectToEdit) {
      await updateProject({
        ...projectToEdit,
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        researchQuestion: researchQuestion.trim(),
        methodologyNote: methodologyNote.trim(),
        language,
        dateRange: { startYear, endYear }
      });
    } else {
      await createProject({
        title: title.trim(),
        subtitle: subtitle.trim() || undefined,
        researchQuestion: researchQuestion.trim(),
        methodologyNote: methodologyNote.trim(),
        language,
        dateRange: { startYear, endYear }
      });
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#D1CEBD] text-[#1A1A1A] rounded-lg max-w-xl w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-[#F1EDE4] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-[#8B7E66]">
              <FolderPlus className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">
                {projectToEdit 
                  ? (locale === 'zh-Hant' ? '編輯研究專案設定' : 'Edit Research Project')
                  : (locale === 'zh-Hant' ? '建立新教父學研究專案' : 'Create New Research Project')}
              </h2>
              <p className="text-xs text-[#666155]">
                {locale === 'zh-Hant' ? '定義研究問題、斷代範圍與方法論界限' : 'Define research question, chronological range, and methodology.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8B7E66] hover:text-[#1A1A1A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick-Fill Project Preset Pull-down Menu */}
          <div className="p-3 bg-[#FAF8F5] border border-[#D1CEBD] rounded-lg space-y-1.5">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7E66]" />
              <span>{locale === 'zh-Hant' ? '研究論題範本下拉快捷載入 (Research Topic Presets)' : 'Research Topic Template (One-Click Auto-Fill)'}</span>
            </div>
            <select
              value={selectedTemplateId}
              onChange={(e) => handleTemplateSelect(e.target.value)}
              className="w-full bg-white border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
            >
              <option value="">{locale === 'zh-Hant' ? '-- 選擇經典教父學研究論題範本 (自動填入問題與方法論) --' : '-- Select Patristic Research Topic (Auto-fills title, research question & methodology) --'}</option>
              {PROJECT_TEMPLATES.map(p => (
                <option key={p.id} value={p.id}>
                  {locale === 'zh-Hant' ? p.titleZh : p.titleEn} ({p.startYear}-{p.endYear} CE)
                </option>
              ))}
            </select>
            {selectedTemplateId && (
              <p className="text-[10px] text-[#2B6CB0] flex items-center gap-1 font-medium pt-0.5">
                <CheckCircle2 className="w-3 h-3 text-[#2B6CB0]" />
                <span>
                  {locale === 'zh-Hant'
                    ? '已自動帶入：主副標題、核心學術研究問題、斷代跨度與批判文獻學方法論'
                    : 'Auto-populated: Title, subtitle, primary research question, chronology & methodology.'}
                </span>
              </p>
            )}
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
              {t.fields.title} *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={locale === 'zh-Hant' ? '例：早期基督宗教中慾念與恩典概念之譜系考證' : 'e.g., Genealogy of Concupiscence & Grace in North African Patristics'}
              className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
              {locale === 'zh-Hant' ? '副標題 / 論題範圍' : 'Subtitle / Sub-theme'}
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder={locale === 'zh-Hant' ? '例：保祿、戴爾都良與奧古斯丁對情慾與意志之詞彙考據' : 'e.g., Pauline, Tertullianic, and Augustinian lexical development'}
              className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
              {t.fields.researchQuestion} *
            </label>
            <textarea
              required
              rows={3}
              value={researchQuestion}
              onChange={(e) => setResearchQuestion(e.target.value)}
              placeholder={locale === 'zh-Hant' ? '寫下您欲考證的具體教父學核心問題...' : 'State your specific patristic research question...'}
              className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {locale === 'zh-Hant' ? '成書起始年 (公元 CE)' : 'Start Year (CE)'}
              </label>
              <input
                type="number"
                value={startYear}
                onChange={(e) => setStartYear(parseInt(e.target.value, 10) || 0)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {locale === 'zh-Hant' ? '成書截止年 (公元 CE)' : 'End Year (CE)'}
              </label>
              <input
                type="number"
                value={endYear}
                onChange={(e) => setEndYear(parseInt(e.target.value, 10) || 800)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
              {t.fields.methodology}
            </label>
            <textarea
              rows={2}
              value={methodologyNote}
              onChange={(e) => setMethodologyNote(e.target.value)}
              placeholder={locale === 'zh-Hant' ? '說明採用的版本批判校勘本（如 CSEL, CCSL, SC, GCS, PTA）及排除標準...' : 'Specify critical editions and methodological boundaries...'}
              className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
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
