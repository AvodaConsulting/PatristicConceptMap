import React, { createContext, useContext, useState, useEffect } from 'react';
import { Locale, TranslationDictionary, translations } from './translations';

interface I18nContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: TranslationDictionary;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [locale, setLocaleState] = useState<Locale>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('patristic_atlas_locale') as Locale;
      if (saved === 'en' || saved === 'zh-Hant') return saved;
      // Default to zh-Hant if browser language starts with zh, else en
      if (navigator.language && navigator.language.startsWith('zh')) {
        return 'zh-Hant';
      }
    }
    return 'en';
  });

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    if (typeof window !== 'undefined') {
      localStorage.setItem('patristic_atlas_locale', newLocale);
    }
  };

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: translations[locale] }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
