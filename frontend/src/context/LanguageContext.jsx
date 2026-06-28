import { createContext, useContext, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const [currentLang, setCurrentLang] = useState(i18n.language || 'en');
  const [dir, setDir] = useState('ltr');

  useEffect(() => {
    // Set direction based on language
    const newDir = currentLang === 'ar' ? 'rtl' : 'ltr';
    setDir(newDir);
    document.documentElement.dir = newDir;
    document.documentElement.lang = currentLang;
    
    // Update body styles for RTL
    if (newDir === 'rtl') {
      document.body.style.fontFamily = "'Noto Sans Arabic', 'DM Sans', sans-serif";
    } else {
      document.body.style.fontFamily = "'DM Sans', sans-serif";
    }
  }, [currentLang]);

  const changeLanguage = (lang) => {
    i18n.changeLanguage(lang);
    setCurrentLang(lang);
    localStorage.setItem('language', lang);
  };

  // Load saved language on mount
  useEffect(() => {
    const savedLang = localStorage.getItem('language');
    if (savedLang && savedLang !== currentLang) {
      changeLanguage(savedLang);
    }
  }, []);

  const value = {
    currentLang,
    changeLanguage,
    dir,
    isRTL: dir === 'rtl',
  };

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
