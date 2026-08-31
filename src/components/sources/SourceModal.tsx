import React, { useState, useEffect } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { SourceRecord, AuthorTradition, PrimaryLanguage, SourceProvider, DateCertainty, AuthenticityStatus, VerificationStatus } from '../../types';
import { parseCtsUrn } from '../../services/ctsService';
import { 
  CLAVIS_AUTHORITY_DATABASE, 
  PTA_ADAPTER_REGISTRY, 
  auditSourceStrategy 
} from '../../services/patristicSources';
import { PATRISTIC_AUTHORS_CATALOG, AuthorPreset, WorkPreset } from '../../data/patristicCatalog';
import { Library, Save, X, AlertTriangle, ExternalLink, Database, BookCheck, ShieldAlert, Sparkles, BookOpen } from 'lucide-react';

interface SourceModalProps {
  isOpen: boolean;
  sourceToEdit?: SourceRecord | null;
  onClose: () => void;
}

export const SourceModal: React.FC<SourceModalProps> = ({ isOpen, sourceToEdit, onClose }) => {
  const { t, locale } = useI18n();
  const { currentProject, saveSource } = useProject();

  const [selectedAuthorPresetId, setSelectedAuthorPresetId] = useState<string>('');
  const [selectedWorkPresetId, setSelectedWorkPresetId] = useState<string>('');

  const [author, setAuthor] = useState('');
  const [authorTradition, setAuthorTradition] = useState<AuthorTradition>('Latin/North African');
  const [workTitle, setWorkTitle] = useState('');
  const [originalLanguage, setOriginalLanguage] = useState<PrimaryLanguage>('la');
  const [startYear, setStartYear] = useState(400);
  const [endYear, setEndYear] = useState(420);
  const [certainty, setCertainty] = useState<DateCertainty>('probable');
  const [dateNote, setDateNote] = useState('');
  const [authenticityStatus, setAuthenticityStatus] = useState<AuthenticityStatus>('authentic');
  const [sourceProvider, setSourceProvider] = useState<SourceProvider>('CSEL');
  const [providerUrl, setProviderUrl] = useState('');
  const [clavisId, setClavisId] = useState('');
  const [tlgId, setTlgId] = useState('');
  const [ctsUrn, setCtsUrn] = useState('');
  const [edition, setEdition] = useState('');
  const [translator, setTranslator] = useState('');
  const [rightsAccessNote, setRightsAccessNote] = useState('');
  const [bibliographyCitation, setBibliographyCitation] = useState('');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>('attested');
  const [researcherNotes, setResearcherNotes] = useState('');
  const [ctsWarning, setCtsWarning] = useState<string | null>(null);

  useEffect(() => {
    if (sourceToEdit) {
      setAuthor(sourceToEdit.author);
      setAuthorTradition(sourceToEdit.authorTradition);
      setWorkTitle(sourceToEdit.workTitle);
      setOriginalLanguage(sourceToEdit.originalLanguage);
      setStartYear(sourceToEdit.compositionDate.startYear);
      setEndYear(sourceToEdit.compositionDate.endYear);
      setCertainty(sourceToEdit.compositionDate.certainty);
      setDateNote(sourceToEdit.compositionDate.note || '');
      setAuthenticityStatus(sourceToEdit.authenticityStatus);
      setSourceProvider(sourceToEdit.sourceProvider);
      setProviderUrl(sourceToEdit.providerUrl || '');
      setClavisId(sourceToEdit.clavisId || '');
      setTlgId(sourceToEdit.tlgId || '');
      setCtsUrn(sourceToEdit.ctsUrn || '');
      setEdition(sourceToEdit.edition);
      setTranslator(sourceToEdit.translator || '');
      setRightsAccessNote(sourceToEdit.rightsAccessNote || '');
      setBibliographyCitation(sourceToEdit.bibliographyCitation);
      setVerificationStatus(sourceToEdit.verificationStatus);
      setResearcherNotes(sourceToEdit.researcherNotes || '');
      setSelectedAuthorPresetId('');
      setSelectedWorkPresetId('');
    } else {
      setAuthor('');
      setAuthorTradition('Latin/North African');
      setWorkTitle('');
      setOriginalLanguage('la');
      setStartYear(400);
      setEndYear(420);
      setCertainty('probable');
      setDateNote('');
      setAuthenticityStatus('authentic');
      setSourceProvider('CSEL');
      setProviderUrl('');
      setClavisId('');
      setTlgId('');
      setCtsUrn('');
      setEdition('');
      setTranslator('');
      setRightsAccessNote('');
      setBibliographyCitation('');
      setVerificationStatus('attested');
      setResearcherNotes('');
      setSelectedAuthorPresetId('');
      setSelectedWorkPresetId('');
    }
  }, [sourceToEdit, isOpen]);

  if (!isOpen || !currentProject) return null;

  const handleAuthorPresetSelect = (authorId: string) => {
    setSelectedAuthorPresetId(authorId);
    setSelectedWorkPresetId('');
    const authorItem = PATRISTIC_AUTHORS_CATALOG.find(a => a.id === authorId);
    if (!authorItem) return;

    setAuthor(authorItem.name);
    setAuthorTradition(authorItem.tradition);
    setOriginalLanguage(authorItem.language);

    if (authorItem.works.length > 0) {
      applyWorkPreset(authorItem.works[0], authorItem);
    }
  };

  const handleWorkPresetSelect = (workId: string) => {
    setSelectedWorkPresetId(workId);
    const authorItem = PATRISTIC_AUTHORS_CATALOG.find(a => a.id === selectedAuthorPresetId) 
      || PATRISTIC_AUTHORS_CATALOG.find(a => a.works.some(w => w.id === workId));
    
    if (authorItem) {
      const work = authorItem.works.find(w => w.id === workId);
      if (work) {
        applyWorkPreset(work, authorItem);
      }
    }
  };

  const applyWorkPreset = (work: WorkPreset, authorItem: AuthorPreset) => {
    setSelectedWorkPresetId(work.id);
    setAuthor(authorItem.name);
    setAuthorTradition(authorItem.tradition);
    setOriginalLanguage(authorItem.language);
    setWorkTitle(work.title);
    setStartYear(work.startYear);
    setEndYear(work.endYear);
    setCertainty(work.certainty);
    setDateNote(work.dateRationale);
    setEdition(work.edition);
    setClavisId(work.clavisId);
    if (work.tlgId) setTlgId(work.tlgId);
    if (work.ctsUrn) setCtsUrn(work.ctsUrn);
    setSourceProvider(work.sourceProvider);
    setBibliographyCitation(work.bibliographyCitation);
    setResearcherNotes(work.researcherNotes);
    setAuthenticityStatus(work.authenticityStatus);
  };

  const handleApplyClavis = (selectedClavisId: string) => {
    const entry = CLAVIS_AUTHORITY_DATABASE[selectedClavisId];
    if (!entry) return;
    setClavisId(entry.clavisId);
    setAuthor(entry.author);
    setAuthorTradition(entry.authorTradition);
    setWorkTitle(entry.workTitle);
    setOriginalLanguage(entry.originalLanguage);
    setAuthenticityStatus(entry.authenticityStatus);
    setStartYear(entry.startYear);
    setEndYear(entry.endYear);
    setCertainty(entry.certainty);
    setDateNote(entry.dateRationale);
    setEdition(entry.criticalEdition);
    setResearcherNotes(`Manuscript Tradition: ${entry.manuscriptTraditionNote}`);
    setBibliographyCitation(`${entry.author}. ${entry.workTitle}. ${entry.criticalEdition}.`);
    if (entry.tlgId) setTlgId(entry.tlgId);
    if (entry.ptaUrn) {
      setCtsUrn(entry.ptaUrn);
      setSourceProvider('PTA');
    }
    setProviderUrl(entry.clavisPermalink);
  };

  const handleApplyPta = (urn: string) => {
    const pta = PTA_ADAPTER_REGISTRY[urn];
    if (!pta) return;
    setCtsUrn(pta.urn);
    setSourceProvider('PTA');
    setWorkTitle(pta.work);
    setAuthor(pta.author);
    setClavisId(pta.clavisId);
    if (pta.tlgId) setTlgId(pta.tlgId);
    if (pta.teiXmlUrl) setProviderUrl(pta.teiXmlUrl);
    setResearcherNotes(pta.annotationWarning);
  };

  const handleCtsChange = (val: string) => {
    setCtsUrn(val);
    if (val.trim()) {
      const parsed = parseCtsUrn(val);
      if (parsed.warning) {
        setCtsWarning(parsed.warning);
      } else {
        setCtsWarning(null);
      }
    } else {
      setCtsWarning(null);
    }
  };

  const currentAuthorItem = PATRISTIC_AUTHORS_CATALOG.find(a => a.id === selectedAuthorPresetId);
  const strategyAudit = auditSourceStrategy(sourceProvider, ctsUrn, clavisId);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !workTitle.trim() || !edition.trim()) return;

    const source: SourceRecord = {
      id: sourceToEdit?.id || `src-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      projectId: currentProject.id,
      author: author.trim(),
      authorTradition,
      workTitle: workTitle.trim(),
      originalLanguage,
      compositionDate: {
        startYear,
        endYear,
        certainty,
        note: dateNote.trim() || undefined
      },
      authenticityStatus,
      sourceProvider,
      providerUrl: providerUrl.trim() || undefined,
      clavisId: clavisId.trim() || undefined,
      tlgId: tlgId.trim() || undefined,
      ctsUrn: ctsUrn.trim() || undefined,
      edition: edition.trim(),
      translator: translator.trim() || undefined,
      rightsAccessNote: rightsAccessNote.trim() || undefined,
      bibliographyCitation: bibliographyCitation.trim() || `${author.trim()}. ${workTitle.trim()}. ${edition.trim()}.`,
      verificationStatus,
      researcherNotes: researcherNotes.trim() || undefined,
      createdAt: sourceToEdit?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await saveSource(source);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#D1CEBD] text-[#1A1A1A] rounded-lg max-w-2xl w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-[#F1EDE4] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-[#8B7E66]">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">
                {sourceToEdit 
                  ? (locale === 'zh-Hant' ? '編輯批判文獻出處記錄' : 'Edit Source Record')
                  : (locale === 'zh-Hant' ? '登錄新批判校勘本文獻' : 'Register Critical Source Record')}
              </h2>
              <p className="text-xs text-[#666155]">
                {locale === 'zh-Hant' ? '嚴謹遵循 Clavis 權威層、PTA 優先轉接器與 Perseus 探索警示之實證出處策略' : 'Grounded in Clavis Clavium authority, PTA primary adapter, and Perseus discovery rules.'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8B7E66] hover:text-[#1A1A1A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Real Source Strategy Quick-Fill & Authority Layer Toolbar */}
        <div className="p-3 bg-[#FAF8F5] border border-[#D1CEBD] rounded-lg space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
              <Database className="w-3.5 h-3.5 text-[#8B7E66]" />
              <span>{locale === 'zh-Hant' ? '權威出處轉接器快捷引用 (Authority Fast-Fill)' : 'Authority Adapters & Presets'}</span>
            </div>
            <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border ${strategyAudit.badgeColor}`}>
              {strategyAudit.badgeLabel}
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-[#666155] font-medium">Clavis Clavium:</span>
            {Object.keys(CLAVIS_AUTHORITY_DATABASE).map(cid => (
              <button
                key={cid}
                type="button"
                onClick={() => handleApplyClavis(cid)}
                className="px-2 py-1 bg-white hover:bg-[#F1EDE4] border border-[#D1CEBD] text-[#1A1A1A] rounded text-[11px] font-mono transition-colors"
              >
                {cid}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <span className="text-[11px] text-[#666155] font-medium">PTA (Preferred Adapter):</span>
            {Object.entries(PTA_ADAPTER_REGISTRY).map(([urn, details]) => (
              <button
                key={urn}
                type="button"
                onClick={() => handleApplyPta(urn)}
                className="px-2 py-1 bg-white hover:bg-[#F1EDE4] border border-[#D1CEBD] text-[#1A1A1A] rounded text-[11px] font-mono transition-colors"
              >
                {details.work} ({details.clavisId})
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Quick-Select Pull-down Menus to Minimize Typing */}
          <div className="p-3 bg-[#FAF8F5] border border-[#D1CEBD] rounded-lg space-y-2">
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#1A1A1A]">
              <Sparkles className="w-3.5 h-3.5 text-[#8B7E66]" />
              <span>{locale === 'zh-Hant' ? '下拉選單快速填入 (Minimal Typing Selection)' : 'Fast-Fill Pull-Down Menus (Select to Fill)'}</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[11px] font-medium text-[#666155] mb-1">
                  {locale === 'zh-Hant' ? '1. 選擇教父作者 (Patristic Author)' : '1. Select Patristic Author'}
                </label>
                <select
                  value={selectedAuthorPresetId}
                  onChange={(e) => handleAuthorPresetSelect(e.target.value)}
                  className="w-full bg-white border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A]"
                >
                  <option value="">{locale === 'zh-Hant' ? '-- 選擇教父作者 (或手動輸入) --' : '-- Choose Author (or type below) --'}</option>
                  {PATRISTIC_AUTHORS_CATALOG.map(auth => (
                    <option key={auth.id} value={auth.id}>
                      {auth.name} ({auth.tradition} • {auth.activePeriod})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-[#666155] mb-1">
                  {locale === 'zh-Hant' ? '2. 選擇經典篇章/論著 (Work / Treatise)' : '2. Select Work / Treatise'}
                </label>
                <select
                  value={selectedWorkPresetId}
                  onChange={(e) => handleWorkPresetSelect(e.target.value)}
                  disabled={!currentAuthorItem && !selectedWorkPresetId}
                  className="w-full bg-white border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] font-medium focus:outline-none focus:border-[#1A1A1A] disabled:opacity-50"
                >
                  <option value="">{locale === 'zh-Hant' ? '-- 選擇教父著作 (自動帶入全套考據元數據) --' : '-- Choose Work (Auto-fills all metadata) --'}</option>
                  {currentAuthorItem?.works.map(w => (
                    <option key={w.id} value={w.id}>
                      {w.title} ({w.clavisId} • {w.startYear}-{w.endYear})
                    </option>
                  ))}
                </select>
              </div>
            </div>
            {selectedWorkPresetId && (
              <p className="text-[10px] text-[#2B6CB0] flex items-center gap-1 font-medium pt-0.5">
                <BookCheck className="w-3 h-3 text-[#2B6CB0]" />
                <span>
                  {locale === 'zh-Hant'
                    ? '已自動帶入：權威校勘本、Clavis/TLG 編號、年代範圍、語言與文獻考證備註'
                    : 'Auto-populated: Critical edition, Clavis/TLG IDs, date range, language & apparatus.'}
                </span>
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.author} *
              </label>
              <input
                type="text"
                required
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="e.g. Augustinus Hipponensis"
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.tradition}
              </label>
              <select
                value={authorTradition}
                onChange={(e) => setAuthorTradition(e.target.value as AuthorTradition)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                {Object.entries(t.traditions).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.work} *
              </label>
              <input
                type="text"
                required
                value={workTitle}
                onChange={(e) => setWorkTitle(e.target.value)}
                placeholder="e.g. De civitate Dei"
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A] font-serif italic"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.language}
              </label>
              <select
                value={originalLanguage}
                onChange={(e) => setOriginalLanguage(e.target.value as PrimaryLanguage)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              >
                {Object.entries(t.languages).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Dating & Certainty */}
          <div className="p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD] space-y-3">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                  {locale === 'zh-Hant' ? '成書始年 (CE)' : 'Start Year (CE)'}
                </label>
                <input
                  type="number"
                  value={startYear}
                  onChange={(e) => setStartYear(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-white border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                  {locale === 'zh-Hant' ? '成書止年 (CE)' : 'End Year (CE)'}
                </label>
                <input
                  type="number"
                  value={endYear}
                  onChange={(e) => setEndYear(parseInt(e.target.value, 10) || 0)}
                  className="w-full bg-white border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] font-mono"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                  {t.fields.certainty}
                </label>
                <select
                  value={certainty}
                  onChange={(e) => setCertainty(e.target.value as DateCertainty)}
                  className="w-full bg-white border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A]"
                >
                  {Object.entries(t.certainties).map(([k, v]) => (
                    <option key={k} value={k}>{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <input
                type="text"
                value={dateNote}
                onChange={(e) => setDateNote(e.target.value)}
                placeholder={locale === 'zh-Hant' ? '斷代依據備忘（如：第四次反佩拉鳩斯論戰期間）' : 'Dating rationale or historical context note'}
                className="w-full bg-white border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Series & Edition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.provider}
              </label>
              <select
                value={sourceProvider}
                onChange={(e) => setSourceProvider(e.target.value as SourceProvider)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A]"
              >
                <option value="PTA">PTA (Patristic Text Archive - Preferred Digital Adapter)</option>
                <option value="CSEL">CSEL (Corpus Scriptorum Eccles. Latinorum)</option>
                <option value="CCSL">CCSL (Corpus Christianorum Series Latina)</option>
                <option value="CCG">CCG (Corpus Christianorum Series Graeca)</option>
                <option value="SC">SC (Sources Chrétiennes)</option>
                <option value="GCS">GCS (Griechische Christliche Schriftsteller)</option>
                <option value="PG">PG (Patrologia Graeca - Migne)</option>
                <option value="PL">PL (Patrologia Latina - Migne)</option>
                <option value="Perseus">Perseus (Discovery/Import Only - Collation Required)</option>
                <option value="TLG_Ref">TLG Canon Reference</option>
                <option value="Clavis_Ref">Clavis Clavium / Brepols Reference</option>
                <option value="Other_Critical_Edition">Other Critical Edition</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.edition} *
              </label>
              <input
                type="text"
                required
                value={edition}
                onChange={(e) => setEdition(e.target.value)}
                placeholder="e.g. CCSL 47-48 (ed. B. Dombart & A. Kalb, 1955)"
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
              />
            </div>
          </div>

          {/* Locators: Clavis, TLG, CTS URN */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.clavisId} (Authority)
              </label>
              <input
                type="text"
                value={clavisId}
                onChange={(e) => setClavisId(e.target.value)}
                placeholder="e.g. CPL 0251 or CPG 2091"
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.tlgId}
              </label>
              <input
                type="text"
                value={tlgId}
                onChange={(e) => setTlgId(e.target.value)}
                placeholder="e.g. TLG 2035.002"
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] font-mono"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
                {t.fields.ctsUrn} (PTA/CTS)
              </label>
              <input
                type="text"
                value={ctsUrn}
                onChange={(e) => handleCtsChange(e.target.value)}
                placeholder="urn:cts:pta:pta0040.pta001"
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-2.5 py-1.5 text-xs text-[#1A1A1A] font-mono"
              />
            </div>
          </div>

          {/* Strategy Guidance Callout */}
          <div className={`p-3 rounded border text-xs space-y-1 ${strategyAudit.badgeColor}`}>
            <div className="flex items-center justify-between">
              <span className="font-bold flex items-center gap-1.5">
                <BookCheck className="w-4 h-4" />
                {strategyAudit.badgeLabel}
              </span>
              {strategyAudit.externalLink && (
                <a
                  href={strategyAudit.externalLink}
                  target="_blank"
                  rel="noreferrer"
                  className="text-[11px] underline flex items-center gap-1 font-mono"
                >
                  <span>Link Authority</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
            <p className="text-[11px] leading-relaxed">
              {strategyAudit.guidanceText}
            </p>
          </div>

          {ctsWarning && (
            <div className="p-2.5 rounded bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E] flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-[#92400E] shrink-0 mt-0.5" />
              <span>{ctsWarning}</span>
            </div>
          )}

          {/* Verification Status & Authenticity */}
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
                {t.fields.authenticity} (Clavis Standard)
              </label>
              <select
                value={authenticityStatus}
                onChange={(e) => setAuthenticityStatus(e.target.value as AuthenticityStatus)}
                className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A]"
              >
                {Object.entries(t.authenticities).map(([k, v]) => (
                  <option key={k} value={k}>{v}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
              {locale === 'zh-Hant' ? '學術書目引用條目 (Chicago / SBL 格式)' : 'Standard Bibliography Citation (SBL/Chicago)'}
            </label>
            <input
              type="text"
              value={bibliographyCitation}
              onChange={(e) => setBibliographyCitation(e.target.value)}
              placeholder="e.g. Augustine. De civitate Dei. Edited by B. Dombart and A. Kalb. CCSL 47-48. Turnhout: Brepols, 1955."
              className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
              {locale === 'zh-Hant' ? '學者考證註記（手稿譜系、校勘記與斷代論據）' : 'Researcher Notes (Manuscript Tradition & Apparatus)'}
            </label>
            <textarea
              rows={2}
              value={researcherNotes}
              onChange={(e) => setResearcherNotes(e.target.value)}
              placeholder={locale === 'zh-Hant' ? '記錄手稿傳承、異文、重要學術爭議等...' : 'Notes on manuscript tradition, variants, or scholarly consensus...'}
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

