import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Check, ChevronDown } from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { cn } from '@/lib/utils';

/**
 * Language Selector Dropdown Component
 * Allows users to switch between supported languages
 */
export default function LanguageSelector({ 
  variant = 'default', // 'default' | 'compact' | 'full'
  className = ''
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const { 
    currentLanguage, 
    changeLanguage, 
    isChanging, 
    supportedLanguages,
    getLanguageInfo
  } = useLanguage();

  const currentLangInfo = getLanguageInfo(currentLanguage);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = async (langCode) => {
    if (langCode !== currentLanguage) {
      await changeLanguage(langCode);
    }
    setIsOpen(false);
  };

  // Compact variant - just flag and code
  if (variant === 'compact') {
    return (
      <div ref={dropdownRef} className={cn('relative', className)}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          disabled={isChanging}
          className={cn(
            'flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-sm',
            'hover:bg-accent transition-colors',
            isChanging && 'opacity-50 cursor-wait'
          )}
        >
          <span className="text-base">{currentLangInfo?.flag}</span>
          <span className="uppercase text-xs font-medium">{currentLanguage}</span>
        </button>

        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-40 rounded-xl bg-card border shadow-lg z-50 overflow-hidden"
            >
              {supportedLanguages.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => handleSelect(lang.code)}
                  className={cn(
                    'w-full flex items-center gap-3 px-3 py-2.5 text-sm transition-colors',
                    currentLanguage === lang.code
                      ? 'bg-primary/10 text-primary'
                      : 'hover:bg-accent'
                  )}
                >
                  <span className="text-lg">{lang.flag}</span>
                  <span className="flex-1 text-left">{lang.nativeName}</span>
                  {currentLanguage === lang.code && (
                    <Check className="w-4 h-4" />
                  )}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Full variant - with label and description
  if (variant === 'full') {
    return (
      <div className={cn('space-y-2', className)}>
        <label className="block text-sm font-medium">
          <Globe className="w-4 h-4 inline mr-2" />
          Language
        </label>
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setIsOpen(!isOpen)}
            disabled={isChanging}
            className={cn(
              'w-full flex items-center justify-between gap-3 px-4 py-3 rounded-xl border bg-background',
              'hover:border-primary/50 transition-colors',
              isChanging && 'opacity-50 cursor-wait'
            )}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{currentLangInfo?.flag}</span>
              <div className="text-left">
                <p className="font-medium">{currentLangInfo?.nativeName}</p>
                <p className="text-xs text-muted-foreground">{currentLangInfo?.name}</p>
              </div>
            </div>
            <ChevronDown className={cn(
              'w-5 h-5 text-muted-foreground transition-transform',
              isOpen && 'rotate-180'
            )} />
          </button>

          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute left-0 right-0 mt-2 rounded-xl bg-card border shadow-lg z-50 overflow-hidden"
              >
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 transition-colors',
                      currentLanguage === lang.code
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-accent'
                    )}
                  >
                    <span className="text-xl">{lang.flag}</span>
                    <div className="flex-1 text-left">
                      <p className="font-medium">{lang.nativeName}</p>
                      <p className="text-xs text-muted-foreground">{lang.name}</p>
                    </div>
                    {currentLanguage === lang.code && (
                      <Check className="w-5 h-5" />
                    )}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  // Default variant
  return (
    <div ref={dropdownRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        disabled={isChanging}
        className={cn(
          'flex items-center gap-2 px-3 py-2 rounded-xl',
          'hover:bg-accent transition-colors',
          isChanging && 'opacity-50 cursor-wait'
        )}
      >
        <Globe className="w-4 h-4" />
        <span className="text-lg">{currentLangInfo?.flag}</span>
        <span className="text-sm hidden sm:inline">{currentLangInfo?.nativeName}</span>
        <ChevronDown className={cn(
          'w-4 h-4 transition-transform',
          isOpen && 'rotate-180'
        )} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 z-40" 
              onClick={() => setIsOpen(false)} 
            />
            
            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 mt-2 w-48 rounded-xl bg-card border shadow-lg z-50 overflow-hidden"
            >
              <div className="p-2 border-b">
                <p className="text-xs font-medium text-muted-foreground px-2">
                  Select Language
                </p>
              </div>
              <div className="p-1">
                {supportedLanguages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelect(lang.code)}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors',
                      currentLanguage === lang.code
                        ? 'bg-primary/10 text-primary'
                        : 'hover:bg-accent'
                    )}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <span className="flex-1 text-left font-medium">{lang.nativeName}</span>
                    {currentLanguage === lang.code && (
                      <Check className="w-4 h-4" />
                    )}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}

