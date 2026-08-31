import React from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { CURATED_PACKETS } from '../../data/curatedPackets';
import { Layers, BookOpen, Calendar, CheckCircle2, ArrowRight } from 'lucide-react';

interface CuratedPacketModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CuratedPacketModal: React.FC<CuratedPacketModalProps> = ({ isOpen, onClose }) => {
  const { t, locale } = useI18n();
  const { importProjectPacket } = useProject();

  if (!isOpen) return null;

  const handleSelect = async (packet: typeof CURATED_PACKETS[0]) => {
    await importProjectPacket(packet);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#D1CEBD] text-[#1A1A1A] rounded-lg max-w-2xl w-full p-6 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-[#F1EDE4] pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-[#8B7E66]">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">
                {locale === 'zh-Hant' ? '權威教父學精選研究資料包' : 'Curated Scholarly Research Packets'}
              </h2>
              <p className="text-xs text-[#666155]">
                {locale === 'zh-Hant' 
                  ? '包含完整批判校勘出處、真實原文經文選段與實證證據卡，無虛構資料'
                  : 'Source-attested critical editions, authentic Greek/Latin passages, and verified evidence cards.'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8B7E66] hover:text-[#1A1A1A] text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {CURATED_PACKETS.map((packet) => (
            <div
              key={packet.project.id}
              className="bg-[#FAF8F5] border border-[#D1CEBD] hover:border-[#1A1A1A] rounded-lg p-4 transition-all space-y-3 shadow-xs"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                <div>
                  <h3 className="font-serif font-bold text-[#1A1A1A] text-sm sm:text-base">
                    {packet.project.title}
                  </h3>
                  {packet.project.subtitle && (
                    <p className="text-xs text-[#666155] mt-0.5">{packet.project.subtitle}</p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-[#595347] shrink-0 font-mono bg-white px-2 py-1 rounded border border-[#D1CEBD]">
                  <Calendar className="w-3.5 h-3.5 text-[#8B7E66]" />
                  <span>{packet.project.dateRange.startYear} — {packet.project.dateRange.endYear} CE</span>
                </div>
              </div>

              <p className="text-xs text-[#595347] italic border-l-2 border-[#8B7E66] pl-3">
                "{packet.project.researchQuestion}"
              </p>

              <div className="flex flex-wrap items-center gap-2 pt-1 text-[11px] text-[#666155]">
                <span className="bg-white px-2 py-0.5 rounded border border-[#D1CEBD]">
                  {packet.sources.length} {locale === 'zh-Hant' ? '部文獻出處' : 'Critical Sources'} (CSEL / CCSL / SC)
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-[#D1CEBD]">
                  {packet.passages.length} {locale === 'zh-Hant' ? '段古經文' : 'Passages'}
                </span>
                <span className="bg-white px-2 py-0.5 rounded border border-[#D1CEBD]">
                  {packet.evidenceCards.length} {locale === 'zh-Hant' ? '張實證證據卡' : 'Evidence Cards'}
                </span>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  onClick={() => handleSelect(packet)}
                  className="px-4 py-1.5 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] rounded flex items-center gap-1.5 shadow-xs transition-colors"
                >
                  <span>{locale === 'zh-Hant' ? '匯入此專案資料包' : 'Load Project Packet'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
