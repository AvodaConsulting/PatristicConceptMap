import React, { useState } from 'react';
import { useI18n } from '../../i18n/i18nContext';
import { useProject } from '../../context/ProjectContext';
import { parseCsvSources } from '../../storage/packetImporter';
import { CSV_SOURCE_TEMPLATE, CSV_PASSAGE_TEMPLATE, JSON_PACKET_TEMPLATE } from '../../data/templates';
import { Upload, Download, FileText, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface SourceImportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SourceImportModal: React.FC<SourceImportModalProps> = ({ isOpen, onClose }) => {
  const { t, locale } = useI18n();
  const { currentProject, saveSource } = useProject();

  const [importText, setImportText] = useState('');
  const [format, setFormat] = useState<'csv' | 'tei_xml' | 'cts_urn'>('csv');
  const [warnings, setWarnings] = useState<string[]>([]);
  const [successCount, setSuccessCount] = useState<number | null>(null);

  if (!isOpen || !currentProject) return null;

  const handleDownloadCsvTemplate = () => {
    const blob = new Blob([CSV_SOURCE_TEMPLATE], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patristic_sources_template.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadJsonSchema = () => {
    const blob = new Blob([JSON.stringify(JSON_PACKET_TEMPLATE, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'patristic_packet_schema.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    if (!importText.trim()) return;

    if (format === 'csv') {
      const { sources, warnings: parsedWarnings } = await parseCsvSources(importText, currentProject.id);
      for (const s of sources) {
        await saveSource(s);
      }
      setWarnings(parsedWarnings);
      setSuccessCount(sources.length);
      if (sources.length > 0) {
        setTimeout(() => {
          onClose();
        }, 1500);
      }
    } else if (format === 'tei_xml') {
      // Basic TEI XML Header Extractor
      const parser = new DOMParser();
      const doc = parser.parseFromString(importText, 'application/xml');
      const title = doc.querySelector('title')?.textContent || 'TEI Imported Work';
      const author = doc.querySelector('author')?.textContent || 'Unknown Patristic Author';
      
      const newSource = {
        id: `src-tei-${Date.now()}`,
        projectId: currentProject.id,
        author,
        authorTradition: 'Other' as const,
        workTitle: title,
        originalLanguage: 'grc' as const,
        compositionDate: {
          startYear: 300,
          endYear: 400,
          certainty: 'approximate' as const
        },
        authenticityStatus: 'authentic' as const,
        sourceProvider: 'PTA' as const,
        edition: 'TEI XML Digital Critical Edition',
        bibliographyCitation: `${author}. ${title}. TEI Critical XML.`,
        verificationStatus: 'provisional' as const,
        researcherNotes: 'Imported from TEI XML document header; requires secondary collation.',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      await saveSource(newSource);
      setSuccessCount(1);
      setWarnings(['TEI XML document ingested as Provisional source. Please verify passage locators against critical apparatus.']);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#D1CEBD] text-[#1A1A1A] rounded-lg max-w-xl w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
        <div className="flex items-start justify-between border-b border-[#F1EDE4] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-[#8B7E66]">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">
                {locale === 'zh-Hant' ? '批次匯入文獻出處檔案' : 'Batch Import Source Records'}
              </h2>
              <p className="text-xs text-[#666155] font-mono">
                CSV, TEI XML Header, or CTS URN text blocks
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-[#8B7E66] hover:text-[#1A1A1A]">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Template Downloads */}
        <div className="flex flex-wrap items-center gap-2.5 p-3 rounded bg-[#FAF8F5] border border-[#D1CEBD]">
          <span className="text-xs text-[#666155] font-bold">
            {locale === 'zh-Hant' ? '標準格式範本：' : 'Templates:'}
          </span>
          <button
            onClick={handleDownloadCsvTemplate}
            className="px-2.5 py-1 text-xs bg-white hover:bg-[#F1EDE4] text-[#1A1A1A] border border-[#D1CEBD] rounded flex items-center gap-1 shadow-xs transition-colors"
          >
            <Download className="w-3 h-3 text-[#8B7E66]" />
            <span>{t.actions.downloadCsvTemplate}</span>
          </button>
          <button
            onClick={handleDownloadJsonSchema}
            className="px-2.5 py-1 text-xs bg-white hover:bg-[#F1EDE4] text-[#1A1A1A] border border-[#D1CEBD] rounded flex items-center gap-1 shadow-xs transition-colors"
          >
            <FileText className="w-3 h-3 text-[#8B7E66]" />
            <span>{t.actions.downloadJsonTemplate}</span>
          </button>
        </div>

        {/* Format Selector */}
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setFormat('csv')}
            className={`px-3 py-1.5 text-xs rounded border font-semibold transition-colors ${
              format === 'csv'
                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                : 'bg-[#FAF8F5] border-[#D1CEBD] text-[#666155] hover:text-[#1A1A1A]'
            }`}
          >
            CSV Format
          </button>
          <button
            type="button"
            onClick={() => setFormat('tei_xml')}
            className={`px-3 py-1.5 text-xs rounded border font-semibold transition-colors ${
              format === 'tei_xml'
                ? 'bg-[#1A1A1A] border-[#1A1A1A] text-white'
                : 'bg-[#FAF8F5] border-[#D1CEBD] text-[#666155] hover:text-[#1A1A1A]'
            }`}
          >
            TEI XML Header
          </button>
        </div>

        <div>
          <label className="block text-xs font-bold text-[#1A1A1A] mb-1 uppercase tracking-wider">
            {locale === 'zh-Hant' ? '貼上 CSV 文本或 XML 內容：' : 'Paste CSV or TEI XML raw content:'}
          </label>
          <textarea
            rows={7}
            value={importText}
            onChange={(e) => setImportText(e.target.value)}
            placeholder={format === 'csv' ? CSV_SOURCE_TEMPLATE : '<TEI xmlns="http://www.tei-c.org/ns/1.0">...'}
            className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded p-3 text-xs text-[#1A1A1A] font-mono focus:outline-none focus:border-[#1A1A1A]"
          />
        </div>

        {successCount !== null && (
          <div className="p-2.5 rounded bg-[#ECFDF5] border border-[#A7F3D0] text-xs text-[#065F46] flex items-center gap-2 font-semibold">
            <CheckCircle2 className="w-4 h-4 text-[#059669]" />
            <span>
              {locale === 'zh-Hant' 
                ? `成功匯入 ${successCount} 部文獻！` 
                : `Successfully imported ${successCount} source records!`}
            </span>
          </div>
        )}

        {warnings.length > 0 && (
          <div className="p-3 rounded bg-[#FEF3C7] border border-[#FDE68A] text-xs text-[#92400E] space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <AlertTriangle className="w-4 h-4 text-[#92400E] shrink-0" />
              <span>{locale === 'zh-Hant' ? '文獻匯入審查提醒：' : 'Provenance Notices:'}</span>
            </div>
            <ul className="list-disc pl-5 space-y-0.5 text-[11px] text-[#92400E]">
              {warnings.map((w, i) => (
                <li key={i}>{w}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="flex justify-end gap-2.5 pt-2 border-t border-[#F1EDE4]">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs text-[#595347] hover:text-[#1A1A1A] border border-[#D1CEBD] rounded hover:bg-[#FAF8F5] transition-colors"
          >
            {t.actions.cancel}
          </button>
          <button
            type="button"
            onClick={handleImport}
            disabled={!importText.trim()}
            className="px-4 py-1.5 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] disabled:opacity-50 rounded flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Upload className="w-3.5 h-3.5" />
            <span>{locale === 'zh-Hant' ? '執行匯入' : 'Execute Import'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
