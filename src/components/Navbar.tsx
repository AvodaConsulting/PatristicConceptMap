import React, { useState } from 'react';
import { useI18n } from '../i18n/i18nContext';
import { useProject } from '../context/ProjectContext';
import { getSessionApiKey } from '../services/geminiService';
import { 
  FolderGit2, 
  Library, 
  BookOpen, 
  FileCheck2, 
  Network, 
  Clock, 
  Sparkles, 
  FileDown, 
  Key, 
  Languages, 
  Layers,
  ShieldCheck
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  onTabChange?: (tab: string) => void;
  setActiveTab?: (tab: string) => void;
  onOpenApiKeyModal: () => void;
  onOpenCuratedModal: () => void;
  onOpenNewProject?: () => void;
  onOpenNewProjectModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  onTabChange,
  setActiveTab,
  onOpenApiKeyModal,
  onOpenCuratedModal,
  onOpenNewProject,
  onOpenNewProjectModal
}) => {
  const switchTab = onTabChange || setActiveTab || (() => {});
  const createNewProject = onOpenNewProject || onOpenNewProjectModal || (() => {});

  const { locale, setLocale, t } = useI18n();
  const { currentProject, projects, selectProject } = useProject();
  const hasApiKey = !!getSessionApiKey();

  const navItems = [
    { id: 'workspace', label: t.nav.projects, icon: FolderGit2 },
    { id: 'sources', label: t.nav.sources, icon: Library },
    { id: 'passages', label: t.nav.passages, icon: BookOpen },
    { id: 'evidence', label: t.nav.evidence, icon: FileCheck2 },
    { id: 'genealogy', label: t.nav.genealogy, icon: Network },
    { id: 'timeline', label: t.nav.timeline, icon: Clock },
    { id: 'boundedAi', label: t.nav.boundedAi, icon: Sparkles },
    { id: 'literature', label: t.nav.literature, icon: ShieldCheck },
    { id: 'dossier', label: t.nav.dossier, icon: FileDown },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#1A1A1A] text-white border-b border-[#D1CEBD] select-none">
      {/* Top Iron Row: Brand, API key status badge, and controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-12 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-baseline gap-3 shrink-0">
          <div className="w-6 h-6 rounded bg-[#E5D5B0]/20 border border-[#E5D5B0]/40 flex items-center justify-center text-[#E5D5B0] font-serif font-bold text-xs">
            Ψ
          </div>
          <h1 className="text-base sm:text-lg font-serif italic tracking-tight font-semibold text-[#E5D5B0] whitespace-nowrap">
            {t.appName}
          </h1>
          <span className="hidden md:inline text-[9px] uppercase tracking-widest text-[#D1CEBD]/70 font-mono">
            {locale === 'zh-Hant' ? '實證教父概念流變圖譜' : 'Source-Attested Concept Atlas'}
          </span>
        </div>

        {/* Top Right Actions */}
        <div className="flex items-center gap-2.5 shrink-0">
          {/* API Key Status Pill */}
          <button
            onClick={onOpenApiKeyModal}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-[11px] font-mono border transition-colors ${
              hasApiKey
                ? 'bg-emerald-950/70 border-emerald-500/50 text-emerald-300 hover:bg-emerald-900/60'
                : 'bg-white/10 border-white/20 text-white/80 hover:bg-white/15'
            }`}
          >
            <div className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
            <span className="hidden sm:inline">
              {hasApiKey ? 'KEY: ACTIVE' : 'API KEY: SETUP'}
            </span>
          </button>

          {/* Curated Packets Shortcut */}
          <button
            onClick={onOpenCuratedModal}
            title={t.actions.curatedSamplePacket}
            className="flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-[#E5D5B0] bg-white/5 border border-[#E5D5B0]/30 hover:bg-white/10 rounded transition-colors"
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{locale === 'zh-Hant' ? '精選庫' : 'Curated'}</span>
          </button>

          {/* Language Toggle */}
          <div className="flex items-center text-xs border border-white/20 rounded overflow-hidden">
            <button
              onClick={() => setLocale('en')}
              className={`px-2 py-0.5 text-[10px] font-mono transition-colors ${
                locale === 'en' ? 'bg-[#E5D5B0] text-[#1A1A1A] font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              EN
            </button>
            <button
              onClick={() => setLocale('zh-Hant')}
              className={`px-2 py-0.5 text-[10px] font-mono transition-colors ${
                locale === 'zh-Hant' ? 'bg-[#E5D5B0] text-[#1A1A1A] font-bold' : 'bg-white/5 text-white/70 hover:bg-white/10'
              }`}
            >
              繁中
            </button>
          </div>
        </div>
      </div>

      {/* Linen High-Density Subnav Bar */}
      <nav className="bg-[#F1EDE4] border-t border-[#D1CEBD] text-[#1A1A1A] px-4 sm:px-6 py-1.5 flex items-center justify-between gap-3 overflow-x-auto scrollbar-none shadow-xs">
        <div className="flex items-center gap-3 shrink-0">
          {/* Project Pill Selector */}
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[10px] font-bold text-[#8B7E66] uppercase tracking-wider hidden sm:inline">
              {locale === 'zh-Hant' ? '專案:' : 'Project:'}
            </span>
            <select
              value={currentProject?.id || ''}
              onChange={(e) => {
                if (e.target.value === '__new__') {
                  createNewProject();
                } else {
                  selectProject(e.target.value);
                }
              }}
              className="bg-white border border-[#D1CEBD] text-[#1A1A1A] text-xs rounded px-2.5 py-1 max-w-[200px] sm:max-w-[280px] truncate shadow-xs font-medium focus:outline-none focus:border-[#8B7E66]"
            >
              {projects.map((p) => {
                const isCurated = p.id === 'curated-concupiscence-grace' || p.id === 'curated-theosis-logos' || !!p.curatedPacketId;
                return (
                  <option key={p.id} value={p.id}>
                    {isCurated ? `[${locale === 'zh-Hant' ? '範例' : 'Demo'}] ` : ''}{p.title}
                  </option>
                );
              })}
              <option value="__new__">+ {t.actions.createProject}</option>
            </select>
          </div>

          <div className="h-4 w-px bg-[#D1CEBD] hidden sm:block" />

          {/* Nav Items */}
          <div className="flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => switchTab(item.id)}
                  className={`flex items-center gap-1 px-2.5 py-1 text-xs transition-colors whitespace-nowrap shrink-0 rounded-sm ${
                    isActive
                      ? 'bg-[#E5D5B0] text-[#1A1A1A] font-bold border-b-2 border-[#1A1A1A] shadow-xs'
                      : 'text-[#4A453A] hover:bg-[#E5D5B0]/50 hover:text-[#1A1A1A]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 text-[#8B7E66]" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>
    </header>
  );
};
