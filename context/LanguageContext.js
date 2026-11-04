'use client';
import { createContext, useContext, useState, useEffect } from 'react';
import { translations } from '../lib/translations';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState('bn');

  useEffect(() => {
    const savedLang = localStorage.getItem('hubcart_lang');
    if (savedLang === 'en' || savedLang === 'bn') {
      setLang(savedLang);
    }
  }, []);

  const toggleLanguage = (selectedLang) => {
    const newLang = selectedLang || (lang === 'bn' ? 'en' : 'bn');
    setLang(newLang);
    localStorage.setItem('hubcart_lang', newLang);
  };

  const t = translations[lang] || translations.bn;

  return (
    <LanguageContext.Provider value={{ lang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
