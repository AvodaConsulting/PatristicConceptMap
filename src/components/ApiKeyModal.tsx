import React, { useState, useEffect } from 'react';
import { useI18n } from '../i18n/i18nContext';
import { getSessionApiKey, setSessionApiKey, clearSessionApiKey, validateApiKey } from '../services/geminiService';
import { Key, ShieldCheck, AlertCircle, Trash2, CheckCircle2, Lock, ExternalLink } from 'lucide-react';

interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ApiKeyModal: React.FC<ApiKeyModalProps> = ({ isOpen, onClose }) => {
  const { t, locale } = useI18n();
  const [apiKeyInput, setApiKeyInput] = useState('');
  const [currentKey, setCurrentKey] = useState<string | null>(null);
  const [status, setStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (isOpen) {
      const existing = getSessionApiKey();
      setCurrentKey(existing);
      setApiKeyInput(existing || '');
      setStatus('idle');
      setErrorMessage('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleValidateAndSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiKeyInput.trim()) {
      setStatus('error');
      setErrorMessage('Please provide a non-empty API key.');
      return;
    }

    setStatus('validating');
    setErrorMessage('');

    const res = await validateApiKey(apiKeyInput.trim());
    if (res.valid) {
      setSessionApiKey(apiKeyInput.trim());
      setCurrentKey(apiKeyInput.trim());
      setStatus('success');
      setTimeout(() => {
        onClose();
      }, 1200);
    } else {
      setStatus('error');
      setErrorMessage(res.message || 'Key validation failed. Please check permissions or network connection.');
    }
  };

  const handleForgetKey = () => {
    clearSessionApiKey();
    setCurrentKey(null);
    setApiKeyInput('');
    setStatus('idle');
    setErrorMessage('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-xs p-4">
      <div className="bg-white border border-[#D1CEBD] text-[#1A1A1A] rounded-lg max-w-lg w-full p-6 shadow-xl space-y-5 animate-in fade-in zoom-in-95">
        <div className="flex items-start justify-between border-b border-[#F1EDE4] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded bg-[#FAF8F5] border border-[#D1CEBD] text-[#8B7E66]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-serif font-bold text-[#1A1A1A]">{t.apiKeyModal.title}</h2>
              <p className="text-xs text-[#666155] font-mono">Google Gemini Developer API</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-[#8B7E66] hover:text-[#1A1A1A] text-sm font-semibold p-1"
          >
            ✕
          </button>
        </div>

        <p className="text-xs leading-relaxed text-[#4A453A]">
          {t.apiKeyModal.description}
        </p>

        <div className="bg-[#FAF8F5] border border-[#D1CEBD] rounded p-3 text-xs text-[#595347] flex items-start gap-2.5">
          <Lock className="w-4 h-4 text-[#065F46] shrink-0 mt-0.5" />
          <div>
            <p className="font-bold text-[#1A1A1A]">{locale === 'zh-Hant' ? '隱私與安全保證' : 'Zero-Relay Privacy Guarantee'}</p>
            <p className="mt-0.5 text-[11px] leading-relaxed">{t.apiKeyModal.privacyNote}</p>
          </div>
        </div>

        {currentKey && (
          <div className="flex items-center justify-between bg-[#ECFDF5] border border-[#A7F3D0] rounded px-3.5 py-2.5 text-xs text-[#065F46]">
            <div className="flex items-center gap-2 truncate font-mono">
              <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
              <span className="truncate font-semibold">
                {locale === 'zh-Hant' ? '當前會話金鑰：' : 'Session Active Key: '}
                {currentKey.slice(0, 6)}••••••••{currentKey.slice(-4)}
              </span>
            </div>
            <button
              onClick={handleForgetKey}
              className="flex items-center gap-1 text-[#DC2626] hover:text-[#B91C1C] font-medium ml-2 px-2 py-1 bg-white border border-[#FECACA] rounded shrink-0 shadow-xs"
            >
              <Trash2 className="w-3 h-3" />
              <span>{t.actions.forgetKey}</span>
            </button>
          </div>
        )}

        <form onSubmit={handleValidateAndSave} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-[#1A1A1A] mb-1.5 uppercase tracking-wider">
              {locale === 'zh-Hant' ? 'Gemini API 金鑰 (AI Studio)' : 'Gemini API Key'}
            </label>
            <input
              type="password"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              placeholder={t.apiKeyModal.placeholder}
              className="w-full bg-[#FAF8F5] border border-[#D1CEBD] rounded px-3 py-2 text-xs text-[#1A1A1A] placeholder-[#8B7E66] focus:outline-none focus:border-[#1A1A1A] font-mono"
            />
            <div className="mt-1.5 flex items-center justify-between text-[11px] text-[#666155]">
              <span>{locale === 'zh-Hant' ? '需要金鑰？' : 'Need an API key?'}</span>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-[#1A56DB] hover:underline flex items-center gap-1 font-semibold"
              >
                Google AI Studio <ExternalLink className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>

          {status === 'validating' && (
            <div className="text-xs text-[#92400E] flex items-center gap-2 bg-[#FEF3C7] border border-[#FDE68A] p-2.5 rounded">
              <span className="w-3 h-3 border-2 border-[#92400E] border-t-transparent rounded-full animate-spin"></span>
              <span>{t.apiKeyModal.validating}</span>
            </div>
          )}

          {status === 'success' && (
            <div className="text-xs text-[#065F46] flex items-center gap-2 bg-[#ECFDF5] border border-[#A7F3D0] p-2.5 rounded font-semibold">
              <CheckCircle2 className="w-4 h-4 text-[#059669]" />
              <span>{t.apiKeyModal.success}</span>
            </div>
          )}

          {status === 'error' && (
            <div className="text-xs text-[#DC2626] flex items-start gap-2 bg-[#FEF2F2] border border-[#FECACA] p-2.5 rounded">
              <AlertCircle className="w-4 h-4 text-[#DC2626] shrink-0 mt-0.5" />
              <span>{errorMessage || t.apiKeyModal.error}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-[#F1EDE4]">
            <button
              type="button"
              onClick={onClose}
              className="px-3.5 py-1.5 text-xs text-[#595347] hover:text-[#1A1A1A] border border-[#D1CEBD] rounded hover:bg-[#FAF8F5] transition-colors"
            >
              {t.actions.cancel}
            </button>
            <button
              type="submit"
              disabled={status === 'validating' || !apiKeyInput.trim()}
              className="px-4 py-1.5 text-xs font-medium text-white bg-[#1A1A1A] hover:bg-[#333333] disabled:opacity-50 disabled:cursor-not-allowed rounded shadow-xs transition-colors"
            >
              {t.actions.validateKey}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
