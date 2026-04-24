import { useState } from 'react';
import { useLanguage } from '../context/LanguageContext';

export default function LanguageSwitcher() {
  const { currentLang, changeLanguage } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
  ];

  const current = languages.find((l) => l.code === currentLang);

  return (
    <div style={styles.container}>
      <button style={styles.button} onClick={() => setIsOpen(!isOpen)}>
        <span style={styles.flag}>{current?.flag}</span>
        <span style={styles.label}>{current?.label}</span>
        <span style={styles.arrow}>{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div style={styles.dropdown}>
          {languages.map((lang) => (
            <button
              key={lang.code}
              style={{
                ...styles.option,
                background: currentLang === lang.code ? 'rgba(11,206,170,0.2)' : 'transparent',
              }}
              onClick={() => {
                changeLanguage(lang.code);
                setIsOpen(false);
              }}
            >
              <span style={styles.flag}>{lang.flag}</span>
              <span style={styles.optionLabel}>{lang.label}</span>
              {currentLang === lang.code && <span style={styles.check}>✓</span>}
            </button>
          ))}
        </div>
      )}

      {isOpen && <div style={styles.overlay} onClick={() => setIsOpen(false)} />}
    </div>
  );
}

const styles = {
  container: {
    position: 'relative',
  },
  button: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid rgba(11,206,170,0.3)',
    background: 'rgba(11,206,170,0.1)',
    color: '#e8f4f0',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 500,
  },
  flag: {
    fontSize: '16px',
  },
  label: {
    fontSize: '13px',
  },
  arrow: {
    fontSize: '10px',
    marginLeft: '4px',
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    right: '0',
    marginTop: '8px',
    background: '#0a2540',
    border: '1px solid rgba(11,206,170,0.2)',
    borderRadius: '10px',
    padding: '8px',
    minWidth: '140px',
    zIndex: 1000,
    boxShadow: '0 10px 40px rgba(0,0,0,0.3)',
  },
  option: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    width: '100%',
    padding: '10px 12px',
    borderRadius: '6px',
    border: 'none',
    color: '#e8f4f0',
    cursor: 'pointer',
    fontSize: '14px',
    transition: 'background 0.2s',
  },
  optionLabel: {
    flex: 1,
    textAlign: 'left',
  },
  check: {
    color: '#0bceaa',
    fontWeight: 700,
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 999,
  },
};
