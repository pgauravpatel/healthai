import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { SUPPORTED_LANGUAGES, LANGUAGE_NAMES, changeLanguage as i18nChangeLanguage, getCurrentLanguage } from '@/i18n';
import { authAPI } from '@/services/api';
import { useAuth } from './AuthContext';

/**
 * Language Context
 * Manages app-wide language state with persistence
 */
const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const { i18n } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [currentLanguage, setCurrentLanguage] = useState(getCurrentLanguage());
  const [isChanging, setIsChanging] = useState(false);

  /**
   * Initialize language from user profile or localStorage
   */
  useEffect(() => {
    const initLanguage = async () => {
      // If user is logged in and has a language preference, use it
      if (isAuthenticated && user?.language) {
        const userLang = user.language;
        if (SUPPORTED_LANGUAGES.some(lang => lang.code === userLang)) {
          i18nChangeLanguage(userLang);
          setCurrentLanguage(userLang);
        }
      }
    };

    initLanguage();
  }, [isAuthenticated, user]);

  /**
   * Change language and persist to localStorage + user profile
   */
  const changeLanguage = useCallback(async (languageCode) => {
    if (!SUPPORTED_LANGUAGES.some(lang => lang.code === languageCode)) {
      console.error(`Unsupported language: ${languageCode}`);
      return;
    }

    setIsChanging(true);

    try {
      // Update i18n and localStorage
      i18nChangeLanguage(languageCode);
      setCurrentLanguage(languageCode);

      // If user is authenticated, save to their profile
      if (isAuthenticated) {
        try {
          await authAPI.updateLanguage(languageCode);
        } catch (error) {
          console.error('Failed to save language preference to server:', error);
          // Continue anyway - localStorage will persist the choice
        }
      }
    } finally {
      setIsChanging(false);
    }
  }, [isAuthenticated]);

  /**
   * Get full language name for AI prompts
   */
  const getLanguageName = useCallback((code = currentLanguage) => {
    return LANGUAGE_NAMES[code] || 'English';
  }, [currentLanguage]);

  /**
   * Get language info object
   */
  const getLanguageInfo = useCallback((code = currentLanguage) => {
    return SUPPORTED_LANGUAGES.find(lang => lang.code === code);
  }, [currentLanguage]);

  const value = {
    currentLanguage,
    changeLanguage,
    isChanging,
    supportedLanguages: SUPPORTED_LANGUAGES,
    getLanguageName,
    getLanguageInfo,
    languageNames: LANGUAGE_NAMES
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

/**
 * Custom hook to use language context
 */
export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

export default LanguageContext;

