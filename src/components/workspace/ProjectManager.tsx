import React, { useRef, useState } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { generateProjectPacket } from '../../storage/packetExporter';
import { parseAndValidateJsonPacket } from '../../storage/packetImporter';
import { FirstProjectChecklist } from '../FirstProjectChecklist';
import { CURATED_PACKETS } from '../../data/curatedPackets';
import { 
  FolderPlus, 
  Upload, 
  Download, 
  Copy, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  BookOpen, 
  Calendar, 
  HelpCircle,
  FileCode,
  ShieldCheck,
  RotateCcw,
  Sparkles,
  Compass,
  FileText
} from 'lucide-react';
import { ResearchProject } from '../../types';

interface ProjectManagerProps {
  onOpenNewProject: () => void;
  onOpenEditProject: (project: ResearchProject) => void;
  onOpenCuratedModal: () => void;
  onNavigateTab: (tabId: string) => void;
  onOpenAddSource: () => void;
  onOpenAddPassage: () => void;
  onOpenAddCard: () => void;
}

export const ProjectManager: React.FC<ProjectManagerProps> = ({
  onOpenNewProject,
  onOpenEditProject,
  onOpenCuratedModal,
  onNavigateTab,
  onOpenAddSource,
  onOpenAddPassage,
  onOpenAddCard
}) => {
  const { t, locale } = useI18n();
  const {
    projects,
    currentProject,
    selectProject,
    deleteProject,
    duplicateProject,
    sources,
    passages,
    evidenceCards,
    importProjectPacket,
    loadCuratedPacket,
    resetToCuratedSamples
  } = useProject();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);
  const [isResetting, setIsResetting] = useState(false);

  const handleResetToSamples = async () => {
    const msg = locale === 'zh-Hant'
      ? '確定要重新載入預設的經典教父研究範例專案嗎？（這將還原「情慾與恩典系譜考」與「聖言與神化論」之權威出處與實證卡）'
      : 'Reset to standard curated research packets? This will restore the authentic Pauline-Augustinian and Theosis sample projects.';
    if (window.confirm(msg)) {
      setIsResetting(true);
      try {
        await resetToCuratedSamples();
        setImportStatus(locale === 'zh-Hant' ? '已成功還原預設示範專案！' : 'Successfully reset to curated sample projects.');
      } catch (err: any) {
        setImportStatus(`Reset failed: ${err.message}`);
      } finally {
        setIsResetting(false);
      }
    }
  };

  const handleExportJson = (project: ResearchProject) => {
    const packet = generateProjectPacket(project, sources, passages, evidenceCards);
    const blob = new Blob([JSON.stringify(packet, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-packet.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleFileImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const text = await file.text();
      const result = await parseAndValidateJsonPacket(text);
      if (result.success && result.project) {
        await importProjectPacket({
          version: '1.0.0',
          exportedAt: new Date().toISOString(),
          project: result.project,
          sources: result.sources,
          passages: result.passages,
          evidenceCards: result.evidenceCards,
          metadata: {
            totalSources: result.sources.length,
            totalPassages: result.passages.length,
            totalEvidenceCards: result.evidenceCards.length,
            attestedCount: result.sources.filter(s => s.verificationStatus === 'attested').length,
            provisionalCount: result.sources.filter(s => s.verificationStatus === 'provisional').length,
            discoveryCount: result.sources.filter(s => s.verificationStatus === 'discovery_lead').length
          }
        });
        setImportStatus(locale === 'zh-Hant' ? '專案封包匯入成功！' : 'Project packet imported successfully!');
      } else {
        setImportStatus(`Import Error: ${result.errors.join(', ')}`);
      }
    } catch (err: any) {
      setImportStatus(`Failed to read file: ${err.message}`);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Top Introduction & Hero */}
      <div className="bg-white border border-[#D1CEBD] rounded-lg p-6 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-[#8B7E66] text-xs font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span className="font-semibold uppercase tracking-wider text-[10px] text-[#1A1A1A]">
                {locale === 'zh-Hant' ? '嚴格源文依據之學術工作台' : 'Source-Attested Scholarly Research Workbench'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">
              {t.appName}
            </h1>
            <p className="text-xs sm:text-sm text-[#595347] leading-relaxed">
              {locale === 'zh-Hant'
                ? '專為教父學文獻（1至8世紀）之概念譜系考證而設計。本平台不虛構任何引文、校勘號或流派關係；所有圖譜節點與連線均嚴格繫於附帶精確出處與加密快照之實證卡。'
                : 'A critical research environment for tracing concepts in Early Christianity (1st–8th Century CE). Graph connections strictly require source-attested evidence cards with exact textual locators.'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={onOpenNewProject}
              className="px-3.5 py-1.5 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded shadow-xs flex items-center gap-1.5 transition-colors"
            >
              <FolderPlus className="w-3.5 h-3.5 text-[#E5D5B0]" />
              <span>{t.actions.createProject}</span>
            </button>

            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-1.5 text-xs font-medium text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#F1EDE4] border border-[#D1CEBD] rounded flex items-center gap-1.5 transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-[#8B7E66]" />
              <span>{t.actions.importPacket}</span>
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileImport}
              accept=".json"
              className="hidden"
            />

            <button
              onClick={onOpenCuratedModal}
              className="px-3 py-1.5 text-xs font-medium text-[#1A1A1A] bg-[#E5D5B0] hover:bg-[#DAC79B] border border-[#C5B58D] rounded flex items-center gap-1.5 transition-colors"
            >
              <Layers className="w-3.5 h-3.5 text-[#1A1A1A]" />
              <span>{locale === 'zh-Hant' ? '載入精選範例' : 'Curated Packets'}</span>
            </button>
          </div>
        </div>

        {importStatus && (
          <div className="mt-4 p-2.5 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs text-[#8B7E66] flex items-center justify-between font-mono">
            <span>{importStatus}</span>
            <button onClick={() => setImportStatus(null)} className="text-[#1A1A1A] hover:text-black">✕</button>
          </div>
        )}
      </div>

      {/* Dynamic 7-Step Research Checklist */}
      <FirstProjectChecklist
        onNavigateTab={onNavigateTab}
        onOpenNewProject={onOpenNewProject}
        onOpenAddSource={onOpenAddSource}
        onOpenAddPassage={onOpenAddPassage}
        onOpenAddCard={onOpenAddCard}
        onOpenCuratedPacket={onOpenCuratedModal}
      />

      {/* Curated Showcase Exemplars (Instant Demo & Experience) */}
      <div className="bg-[#FAF8F5] border border-[#D1CEBD] rounded-lg p-5 space-y-3.5 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E5DFD3] pb-3">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8B7E66]" />
            <h2 className="text-sm font-serif font-bold text-[#1A1A1A]">
              {locale === 'zh-Hant' ? '經典權威教父研究範例（即刻展示體驗）' : 'Curated Research Exemplars (Instant Showcase)'}
            </h2>
          </div>
          <button
            onClick={handleResetToSamples}
            disabled={isResetting}
            className="text-xs text-[#8B7E66] hover:text-[#1A1A1A] flex items-center gap-1 font-mono transition-colors"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isResetting ? 'animate-spin' : ''}`} />
            <span>{locale === 'zh-Hant' ? '還原／重載示範專案' : 'Restore Showcase Packets'}</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {CURATED_PACKETS.map((packet) => {
            const isSelected = currentProject?.id === packet.project.id || currentProject?.curatedPacketId === packet.project.id;
            return (
              <div
                key={packet.project.id}
                className={`bg-white rounded border p-4 flex flex-col justify-between transition-all ${
                  isSelected
                    ? 'border-[#1A1A1A] ring-1 ring-[#1A1A1A] shadow-xs'
                    : 'border-[#D1CEBD] hover:border-[#8B7E66]'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider bg-[#FAF8F5] border border-[#D1CEBD] text-[#1A1A1A] px-1.5 py-0.5 rounded">
                          {packet.project.id === 'curated-concupiscence-grace'
                            ? (locale === 'zh-Hant' ? '拉丁教父範例' : 'Latin Tradition')
                            : (locale === 'zh-Hant' ? '希臘教父範例' : 'Greek Tradition')}
                        </span>
                        {isSelected && (
                          <span className="bg-[#1A1A1A] text-[#E5D5B0] text-[10px] px-1.5 py-0.5 rounded font-mono font-bold">
                            {locale === 'zh-Hant' ? '當前載入' : 'ACTIVE'}
                          </span>
                        )}
                      </div>
                      <h3 className="font-serif font-bold text-[#1A1A1A] text-sm mt-1">
                        {packet.project.title}
                      </h3>
                      {packet.project.subtitle && (
                        <p className="text-[11px] text-[#666155]">{packet.project.subtitle}</p>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#595347] italic line-clamp-2 border-l border-[#8B7E66] pl-2">
                    "{packet.project.researchQuestion}"
                  </p>

                  <div className="flex items-center gap-2 text-[11px] text-[#8B7E66] font-mono pt-1">
                    <span>{packet.sources.length} {locale === 'zh-Hant' ? '部文獻' : 'Sources'}</span>
                    <span>•</span>
                    <span>{packet.passages.length} {locale === 'zh-Hant' ? '段經文' : 'Passages'}</span>
                    <span>•</span>
                    <span>{packet.evidenceCards.length} {locale === 'zh-Hant' ? '張實證卡' : 'Cards'}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 mt-3 border-t border-[#F1EDE4]">
                  <span className="text-[11px] text-[#8B7E66] font-mono">
                    {packet.project.dateRange.startYear}–{packet.project.dateRange.endYear} CE
                  </span>

                  {isSelected ? (
                    <button
                      onClick={() => onNavigateTab('evidence-cards')}
                      className="px-3 py-1 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded flex items-center gap-1 shadow-xs"
                    >
                      <span>{locale === 'zh-Hant' ? '檢視實證卡與圖譜' : 'Explore Evidence'}</span>
                      <ArrowRight className="w-3 h-3 text-[#E5D5B0]" />
                    </button>
                  ) : (
                    <button
                      onClick={async () => {
                        const exists = projects.find(p => p.id === packet.project.id);
                        if (exists) {
                          selectProject(packet.project.id);
                        } else {
                          await importProjectPacket(packet);
                        }
                      }}
                      className="px-3 py-1 text-xs font-medium text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#E5D5B0] border border-[#D1CEBD] rounded flex items-center gap-1 transition-colors"
                    >
                      <span>{locale === 'zh-Hant' ? '即刻切換研讀' : 'Load & Explore'}</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-serif font-semibold text-[#1A1A1A]">
            {locale === 'zh-Hant' ? '本機所有研究專案 (IndexedDB)' : 'All Local Research Projects (IndexedDB)'}
          </h2>
          <span className="text-xs text-[#8B7E66] font-mono">
            {projects.length} {locale === 'zh-Hant' ? '個專案' : 'projects'}
          </span>
        </div>

        {projects.length === 0 ? (
          <div className="bg-[#FAF8F5] border border-dashed border-[#D1CEBD] rounded-lg p-8 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-white border border-[#D1CEBD] mx-auto flex items-center justify-center text-[#8B7E66]">
              <BookOpen className="w-6 h-6" />
            </div>
            <div className="max-w-md mx-auto space-y-1">
              <h3 className="text-sm font-serif font-semibold text-[#1A1A1A]">
                {locale === 'zh-Hant' ? '本機出處檔案庫目前為空' : 'Source Registry is Empty'}
              </h3>
              <p className="text-xs text-[#666155] leading-relaxed">
                {locale === 'zh-Hant'
                  ? '本系統恪守學術誠信原則，不預先填塞任何偽造的經文或節點。您可以建立新專案，或匯入包含真實拉丁／希臘教父校勘本之精選研究包。'
                  : 'Following academic integrity rules, the Atlas begins with an empty registry unless you import actual source records or a curated packet.'}
              </p>
            </div>
            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                onClick={onOpenNewProject}
                className="px-4 py-2 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded shadow flex items-center gap-1.5"
              >
                <FolderPlus className="w-4 h-4 text-[#E5D5B0]" />
                <span>{t.actions.createProject}</span>
              </button>
              <button
                onClick={onOpenCuratedModal}
                className="px-4 py-2 text-xs font-medium text-[#1A1A1A] bg-[#FAF8F5] hover:bg-[#F1EDE4] border border-[#D1CEBD] rounded flex items-center gap-1.5"
              >
                <Layers className="w-4 h-4 text-[#8B7E66]" />
                <span>{t.actions.curatedSamplePacket}</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {projects.map((project) => {
              const isCurrent = currentProject?.id === project.id;
              return (
                <div
                  key={project.id}
                  className={`bg-white border rounded-lg p-5 flex flex-col justify-between transition-all ${
                    isCurrent
                      ? 'border-[#1A1A1A] shadow-sm ring-1 ring-[#1A1A1A]'
                      : 'border-[#D1CEBD] hover:border-[#8B7E66]'
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-serif font-semibold text-[#1A1A1A] text-base">
                            {project.title}
                          </h3>
                          {isCurrent && (
                            <span className="bg-[#1A1A1A] text-[#E5D5B0] text-[10px] px-2 py-0.5 rounded font-mono uppercase tracking-wider font-bold">
                              {locale === 'zh-Hant' ? '當前專案' : 'ACTIVE'}
                            </span>
                          )}
                        </div>
                        {project.subtitle && (
                          <p className="text-xs text-[#666155] mt-0.5">{project.subtitle}</p>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => onOpenEditProject(project)}
                          title={t.actions.edit}
                          className="p-1.5 text-[#8B7E66] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] rounded"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => duplicateProject(project.id)}
                          title="Duplicate Project"
                          className="p-1.5 text-[#8B7E66] hover:text-[#1A1A1A] hover:bg-[#FAF8F5] rounded"
                        >
                          <Copy className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm(locale === 'zh-Hant' ? '確定要刪除此專案及其所有關聯文獻與經文嗎？' : 'Delete this project and all its records?')) {
                              deleteProject(project.id);
                            }
                          }}
                          title={t.actions.delete}
                          className="p-1.5 text-[#8B7E66] hover:text-red-600 hover:bg-red-50 rounded"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <p className="text-xs text-[#595347] line-clamp-2 italic border-l-2 border-[#D1CEBD] pl-2.5">
                      "{project.researchQuestion}"
                    </p>

                    <div className="flex items-center gap-3 text-[11px] text-[#8B7E66] font-mono">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#1A1A1A]" />
                        {project.dateRange.startYear} — {project.dateRange.endYear} CE
                      </span>
                      <span>•</span>
                      <span>{project.language === 'zh-Hant' ? '繁體中文' : 'English'}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F1EDE4]">
                    <button
                      onClick={() => handleExportJson(project)}
                      className="text-xs text-[#666155] hover:text-[#1A1A1A] flex items-center gap-1 font-medium"
                    >
                      <Download className="w-3.5 h-3.5 text-[#8B7E66]" />
                      <span>{locale === 'zh-Hant' ? '匯出封包' : 'Export JSON'}</span>
                    </button>

                    {isCurrent ? (
                      <button
                        onClick={() => onNavigateTab('sources')}
                        className="px-3 py-1 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded flex items-center gap-1 shadow-xs"
                      >
                        <span>{locale === 'zh-Hant' ? '開啟研究文獻庫' : 'Open Sources'}</span>
                        <ArrowRight className="w-3 h-3 text-[#E5D5B0]" />
                      </button>
                    ) : (
                      <button
                        onClick={() => selectProject(project.id)}
                        className="px-3 py-1 text-xs font-medium text-[#1A1A1A] hover:bg-[#E5D5B0] bg-[#FAF8F5] border border-[#D1CEBD] rounded"
                      >
                        {locale === 'zh-Hant' ? '切換為當前專案' : 'Set as Active'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
