import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import hi from './locales/hi.json';
import es from './locales/es.json';

// Supported languages configuration
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' }
];

// Language code to full name mapping for AI prompts
export const LANGUAGE_NAMES = {
  en: 'English',
  hi: 'Hindi',
  es: 'Spanish'
};

// Initialize i18next
i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      hi: { translation: hi },
      es: { translation: es }
    },
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'es'],
    
    // Language detection options
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      lookupLocalStorage: 'healthai_language',
      caches: ['localStorage']
    },

    interpolation: {
      escapeValue: false // React already escapes by default
    },

    // Debug mode in development
    debug: import.meta.env.DEV
  });

/**
 * Change app language and persist to localStorage
 * @param {string} languageCode - Language code (en, hi, es)
 */
export const changeLanguage = (languageCode) => {
  if (SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode)) {
    i18n.changeLanguage(languageCode);
    localStorage.setItem('healthai_language', languageCode);
    // Update document language attribute for accessibility
    document.documentElement.lang = languageCode;
  }
};

/**
 * Get current language code
 * @returns {string} Current language code
 */
export const getCurrentLanguage = () => {
  return i18n.language || 'en';
};

/**
 * Get language info by code
 * @param {string} code - Language code
 * @returns {Object|undefined} Language info object
 */
export const getLanguageInfo = (code) => {
  return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
};

export default i18n;

