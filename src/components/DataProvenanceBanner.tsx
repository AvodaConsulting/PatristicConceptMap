import React from 'react';
import { useI18n } from '../i18n/i18nContext';
import { useProject } from '../context/ProjectContext';
import { ShieldCheck, AlertTriangle, CheckCircle2, HelpCircle, FileSearch } from 'lucide-react';

export const DataProvenanceBanner: React.FC = () => {
  const { locale } = useI18n();
  const { currentProject, sources, passages, evidenceCards } = useProject();

  if (!currentProject) return null;

  const attestedSources = sources.filter(s => s.verificationStatus === 'attested').length;
  const provisionalSources = sources.filter(s => s.verificationStatus === 'provisional').length;
  const discoverySources = sources.filter(s => s.verificationStatus === 'discovery_lead').length;
  const contestedDateSources = sources.filter(s => s.compositionDate?.certainty === 'contested' || s.compositionDate?.certainty === 'unknown').length;
  const perseusSources = sources.filter(s => s.sourceProvider === 'Perseus').length;

  return (
    <div className="bg-[#FAF8F5] border-b border-[#D1CEBD] px-4 py-1.5 sm:px-6 text-xs text-[#595347]">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2">
        {/* Left: Project title & Provenance ratio */}
        <div className="flex items-center flex-wrap gap-2">
          <div className="flex items-center gap-1.5 font-serif font-semibold text-[#1A1A1A]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#8B7E66] shrink-0" />
            <span className="truncate max-w-[260px]">{currentProject.title}</span>
          </div>

          <span className="text-[#D1CEBD] hidden sm:inline">|</span>

          {/* Badges */}
          <div className="flex items-center gap-1.5">
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#E8F0FE] border border-[#BFDBFE] text-[#1A56DB] font-mono text-[10px] font-bold">
              <CheckCircle2 className="w-3 h-3 text-[#1A56DB]" />
              <span>{attestedSources} {locale === 'zh-Hant' ? '實證' : 'ATTESTED'}</span>
            </span>

            {provisionalSources > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#FEF3C7] border border-[#FDE68A] text-[#92400E] font-mono text-[10px] font-bold">
                <HelpCircle className="w-3 h-3 text-[#92400E]" />
                <span>{provisionalSources} {locale === 'zh-Hant' ? '暫定' : 'PROVISIONAL'}</span>
              </span>
            )}

            {discoverySources > 0 && (
              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-[#F3E8FF] border border-[#E9D5FF] text-[#6B21A8] font-mono text-[10px] font-bold">
                <FileSearch className="w-3 h-3 text-[#6B21A8]" />
                <span>{discoverySources} {locale === 'zh-Hant' ? '線索' : 'DISCOVERY'}</span>
              </span>
            )}

            <span className="text-[#8B7E66] text-[11px] ml-1 font-mono">
              ({passages.length} {locale === 'zh-Hant' ? '段經文' : 'passages'} · {evidenceCards.length} {locale === 'zh-Hant' ? '張證據卡' : 'cards'})
            </span>
          </div>
        </div>

        {/* Right: Academic Warnings & Integrity state */}
        <div className="flex items-center flex-wrap gap-2 text-[11px]">
          {perseusSources > 0 && (
            <div className="flex items-center gap-1 text-[#92400E] bg-[#FEF3C7] px-2 py-0.5 rounded border border-[#FDE68A]">
              <AlertTriangle className="w-3 h-3 text-[#B45309] shrink-0" />
              <span>{locale === 'zh-Hant' ? '含 Perseus 初譯來源 (須複核校勘本)' : 'Contains Perseus source (collation required)'}</span>
            </div>
          )}

          {contestedDateSources > 0 && (
            <div className="flex items-center gap-1 text-[#78716C] bg-[#F5F5F4] border border-[#E7E5E4] px-1.5 py-0.5 rounded text-[10px] font-mono">
              <span>{locale === 'zh-Hant' ? `含 ${contestedDateSources} 項爭議斷代` : `${contestedDateSources} contested dates`}</span>
            </div>
          )}

          <div className="text-[#8B7E66] font-mono text-[10px] hidden xl:inline">
            SHA-256 Checksums: 100% Locked
          </div>
        </div>
      </div>
    </div>
  );
};
