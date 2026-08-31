import React from 'react';
import { useI18n } from '../i18n/i18nContext';
import { useProject } from '../context/ProjectContext';
import { 
  CheckCircle2, 
  Circle, 
  ArrowRight, 
  FolderPlus, 
  Library, 
  BookOpen, 
  FileCheck2, 
  Network, 
  Sparkles, 
  FileDown 
} from 'lucide-react';

interface FirstProjectChecklistProps {
  onNavigateTab: (tabId: string) => void;
  onOpenNewProject: () => void;
  onOpenAddSource: () => void;
  onOpenAddPassage: () => void;
  onOpenAddCard: () => void;
  onOpenCuratedPacket: () => void;
}

export const FirstProjectChecklist: React.FC<FirstProjectChecklistProps> = ({
  onNavigateTab,
  onOpenNewProject,
  onOpenAddSource,
  onOpenAddPassage,
  onOpenAddCard,
  onOpenCuratedPacket
}) => {
  const { t, locale } = useI18n();
  const { currentProject, sources, passages, evidenceCards, checklistStatus } = useProject();

  const steps = [
    {
      id: 1,
      label: t.checklist.step1,
      isDone: checklistStatus.hasProject,
      detail: currentProject ? currentProject.title : (locale === 'zh-Hant' ? '尚未選定專案' : 'No project active'),
      actionLabel: currentProject ? (locale === 'zh-Hant' ? '切換專案' : 'Switch') : (locale === 'zh-Hant' ? '建立專案' : 'Create Project'),
      onAction: onOpenNewProject,
      icon: FolderPlus
    },
    {
      id: 2,
      label: t.checklist.step2,
      isDone: checklistStatus.hasSources,
      detail: `${sources.length} ${locale === 'zh-Hant' ? '部文獻已登錄' : 'sources registered'}`,
      actionLabel: locale === 'zh-Hant' ? '登錄文獻' : 'Add Source',
      onAction: () => {
        onNavigateTab('sources');
        onOpenAddSource();
      },
      icon: Library
    },
    {
      id: 3,
      label: t.checklist.step3,
      isDone: checklistStatus.hasPassages,
      detail: `${passages.length} ${locale === 'zh-Hant' ? '段經文選段' : 'passages ingested'} (目標 ≥ 2)`,
      actionLabel: locale === 'zh-Hant' ? '新增經文' : 'Add Passage',
      onAction: () => {
        onNavigateTab('passages');
        onOpenAddPassage();
      },
      icon: BookOpen
    },
    {
      id: 4,
      label: t.checklist.step4,
      isDone: checklistStatus.hasEvidenceCards,
      detail: `${evidenceCards.length} ${locale === 'zh-Hant' ? '張證據卡已綁定' : 'cards bound'} (目標 ≥ 1)`,
      actionLabel: locale === 'zh-Hant' ? '建立證據卡' : 'Create Card',
      onAction: () => {
        onNavigateTab('evidence');
        onOpenAddCard();
      },
      icon: FileCheck2
    },
    {
      id: 5,
      label: t.checklist.step5,
      isDone: checklistStatus.hasGraphViewed,
      detail: locale === 'zh-Hant' ? '力導向概念譜系圖譜' : 'Force-directed genealogy graph',
      actionLabel: locale === 'zh-Hant' ? '檢視圖譜' : 'View Graph',
      onAction: () => onNavigateTab('genealogy'),
      icon: Network
    },
    {
      id: 6,
      label: t.checklist.step6,
      isDone: checklistStatus.hasAiRun,
      detail: locale === 'zh-Hant' ? '源文約束考析' : 'Evidence-bounded hermeneutic pass',
      actionLabel: locale === 'zh-Hant' ? '執行考析' : 'Run AI Analysis',
      onAction: () => onNavigateTab('boundedAi'),
      icon: Sparkles
    },
    {
      id: 7,
      label: t.checklist.step7,
      isDone: checklistStatus.hasDossierExported,
      detail: locale === 'zh-Hant' ? '完整研究檔案報告' : 'Complete research dossier export',
      actionLabel: locale === 'zh-Hant' ? '匯出報告' : 'Export Dossier',
      onAction: () => onNavigateTab('dossier'),
      icon: FileDown
    }
  ];

  const completedCount = steps.filter(s => s.isDone).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  return (
    <div className="bg-white border border-[#D1CEBD] rounded-lg p-5 sm:p-6 shadow-xs space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#F1EDE4] pb-4">
        <div>
          <h2 className="text-base sm:text-lg font-serif font-semibold text-[#1A1A1A] flex items-center gap-2">
            <span>{t.checklist.title}</span>
            <span className="text-xs px-2 py-0.5 rounded font-mono bg-[#FAF8F5] border border-[#D1CEBD] text-[#8B7E66] font-bold">
              {completedCount} / {steps.length} {locale === 'zh-Hant' ? '已達成' : 'DONE'}
            </span>
          </h2>
          <p className="text-xs text-[#666155] mt-0.5">
            {t.checklist.subtitle}
          </p>
        </div>

        <button
          onClick={onOpenCuratedPacket}
          className="self-start sm:self-center text-xs font-medium px-3 py-1.5 rounded bg-[#FAF8F5] hover:bg-[#F1EDE4] text-[#1A1A1A] border border-[#D1CEBD] transition-colors flex items-center gap-1.5"
        >
          <span>{locale === 'zh-Hant' ? '匯入權威範例專案' : 'Load Curated Project Packet'}</span>
          <ArrowRight className="w-3.5 h-3.5 text-[#1A1A1A]" />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-[#FAF8F5] rounded-full h-2 overflow-hidden border border-[#D1CEBD]">
        <div 
          className="bg-[#1A1A1A] h-2 transition-all duration-500 rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      {/* Steps List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 pt-2">
        {steps.map((step) => {
          return (
            <div
              key={step.id}
              className={`p-3 rounded border text-xs flex flex-col justify-between transition-colors ${
                step.isDone
                  ? 'bg-white border-[#D1CEBD] text-[#1A1A1A]'
                  : 'bg-[#FAF8F5] border-[#E5E0D5] text-[#8B7E66]'
              }`}
            >
              <div className="space-y-1.5">
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    {step.isDone ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    ) : (
                      <Circle className="w-4 h-4 text-[#D1CEBD] shrink-0" />
                    )}
                    <span className={`font-semibold ${step.isDone ? 'text-[#1A1A1A]' : 'text-[#666155]'}`}>
                      {step.label}
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-[#8B7E66] pl-6 font-mono">
                  {step.detail}
                </p>
              </div>

              <div className="pt-2 pl-6">
                <button
                  onClick={step.onAction}
                  className="text-[11px] font-bold text-[#1A1A1A] hover:text-[#8B7E66] flex items-center gap-1 group"
                >
                  <span>{step.actionLabel}</span>
                  <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
