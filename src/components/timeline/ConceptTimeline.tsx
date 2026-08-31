import React, { useState } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { Calendar, Clock, AlertTriangle, CheckCircle2, BookOpen, ShieldCheck, Tag } from 'lucide-react';

export const ConceptTimeline: React.FC = () => {
  const { t, locale } = useI18n();
  const { currentProject, sources, passages, evidenceCards } = useProject();

  const [selectedCentury, setSelectedCentury] = useState<string>('all');

  if (!currentProject) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12 text-center text-stone-400">
        <p>{locale === 'zh-Hant' ? '請先於工作區建立或選定研究專案。' : 'Please create or select a research project in the Workspace tab.'}</p>
      </div>
    );
  }

  // Sort sources chronologically
  const sortedSources = [...sources].sort((a, b) => a.compositionDate.startYear - b.compositionDate.startYear);

  // Group by Century
  const getCentury = (year: number) => {
    if (year <= 100) return '1st Century (Apostolic)';
    if (year <= 200) return '2nd Century (Apologists & Early)';
    if (year <= 300) return '3rd Century (Pre-Nicene Fathers)';
    if (year <= 400) return '4th Century (Nicene Era)';
    if (year <= 500) return '5th Century (Post-Nicene & Chalcedonian)';
    if (year <= 600) return '6th Century (Late Patristic)';
    return '7th–8th Century (Byzantine / Synthesis)';
  };

  const centuries = Array.from(new Set(sortedSources.map(s => getCentury(s.compositionDate.startYear))));

  const filteredSources = selectedCentury === 'all'
    ? sortedSources
    : sortedSources.filter(s => getCentury(s.compositionDate.startYear) === selectedCentury);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-serif font-bold text-[#1A1A1A] flex items-center gap-2">
            <Clock className="w-5 h-5 text-[#8B7E66]" />
            <span>{t.nav.timeline}</span>
          </h1>
          <p className="text-xs text-[#666155] mt-0.5">
            {locale === 'zh-Hant'
              ? '按成書年代與斷代確證度（確鑿、大概、約略、存疑）排列之概念演化時間軸'
              : 'Chronological timeline of patristic sources with explicit dating certainty classifications.'}
          </p>
        </div>

        {/* Century Filter */}
        <div className="flex items-center gap-2">
          <select
            value={selectedCentury}
            onChange={(e) => setSelectedCentury(e.target.value)}
            className="bg-white border border-[#D1CEBD] text-[#1A1A1A] text-xs rounded px-3 py-1.5 focus:outline-none focus:border-[#1A1A1A]"
          >
            <option value="all">{locale === 'zh-Hant' ? '全部歷史世紀' : 'All Historical Eras'}</option>
            {centuries.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Timeline Stream */}
      {filteredSources.length === 0 ? (
        <div className="bg-[#FAF8F5] border border-dashed border-[#D1CEBD] rounded-lg p-8 text-center space-y-3">
          <p className="text-xs text-[#666155]">
            {sources.length === 0
              ? (locale === 'zh-Hant' ? '專案內尚無文獻。請先登錄文獻。' : 'No source records in this project yet.')
              : (locale === 'zh-Hant' ? '無符合該世紀的文獻。' : 'No sources in this era.')}
          </p>
        </div>
      ) : (
        <div className="relative border-l-2 border-[#D1CEBD] ml-4 sm:ml-6 space-y-8 pb-8">
          {filteredSources.map((source) => {
            const sourcePassages = passages.filter(p => p.sourceId === source.id);
            const isContested = source.compositionDate.certainty === 'contested' || source.compositionDate.certainty === 'unknown';

            return (
              <div key={source.id} className="relative pl-6 sm:pl-8 group">
                {/* Timeline node dot */}
                <div className={`absolute -left-[9px] top-1 w-4 h-4 rounded-full border-2 border-white ${
                  isContested ? 'bg-[#D97706]' : 'bg-[#1A1A1A]'
                } group-hover:scale-125 transition-transform`} />

                <div className="bg-white border border-[#D1CEBD] rounded-lg p-5 space-y-3 hover:border-[#1A1A1A] transition-all shadow-xs">
                  {/* Era, Author, Title, Date */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-mono text-xs font-bold text-[#1A1A1A] bg-[#FAF8F5] border border-[#D1CEBD] px-2 py-0.5 rounded">
                          {source.compositionDate.startYear} — {source.compositionDate.endYear} CE
                        </span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                          source.compositionDate.certainty === 'exact'
                            ? 'bg-[#ECFDF5] text-[#065F46] border border-[#A7F3D0]'
                            : source.compositionDate.certainty === 'probable'
                            ? 'bg-[#E8F0FE] text-[#1A56DB] border border-[#BFDBFE]'
                            : 'bg-[#FEF3C7] text-[#92400E] border border-[#FDE68A]'
                        }`}>
                          {t.certainties[source.compositionDate.certainty] || source.compositionDate.certainty}
                        </span>

                        <span className="text-[10px] bg-[#FAF8F5] text-[#595347] border border-[#D1CEBD] px-2 py-0.5 rounded font-medium">
                          {source.authorTradition}
                        </span>
                      </div>

                      <h3 className="font-serif font-bold text-[#1A1A1A] text-base">
                        {source.author}
                      </h3>
                      <p className="font-serif italic text-sm text-[#595347]">
                        {source.workTitle}
                      </p>
                    </div>

                    <div className="text-xs text-[#666155] font-mono sm:text-right shrink-0">
                      <span className="text-[#1A1A1A] font-semibold">{source.edition}</span>
                      {source.clavisId && <p className="text-[#8B7E66] text-[11px]">{source.clavisId}</p>}
                    </div>
                  </div>

                  {/* Dating note & warnings */}
                  {source.compositionDate.note && (
                    <p className="text-xs text-[#595347] italic border-l-2 border-[#8B7E66] pl-2.5">
                      {source.compositionDate.note}
                    </p>
                  )}

                  {isContested && (
                    <div className="p-2 rounded bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E] flex items-center gap-1.5">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#92400E] shrink-0" />
                      <span>{locale === 'zh-Hant' ? '斷代存在學術分歧（請參考校勘前言註記）' : 'Contested or disputed dating window in scholarship.'}</span>
                    </div>
                  )}

                  {/* Passages from this era */}
                  {sourcePassages.length > 0 && (
                    <div className="pt-2 border-t border-[#F1EDE4] space-y-2">
                      <span className="text-[11px] font-bold text-[#1A1A1A] block font-mono uppercase tracking-wider">
                        {locale === 'zh-Hant' ? '此時段收錄之經文選段：' : 'Attested Passages in this Era:'}
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {sourcePassages.map(p => (
                          <div key={p.id} className="p-2.5 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-xs space-y-1">
                            <div className="flex items-center justify-between text-[11px] text-[#1A1A1A] font-mono font-bold">
                              <span>Loc: {p.passageLocator}</span>
                              <span className="text-[#8B7E66] uppercase text-[10px]">{p.verificationStatus}</span>
                            </div>
                            <p className="font-serif italic text-[#1A1A1A] text-[11px] line-clamp-2">
                              "{p.originalText}"
                            </p>
                            <div className="flex items-center gap-1 flex-wrap pt-1">
                              {p.concepts.map(c => (
                                <span key={c} className="text-[9px] bg-white border border-[#D1CEBD] text-[#595347] px-1.5 py-0.5 rounded">
                                  {c}
                                </span>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
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
