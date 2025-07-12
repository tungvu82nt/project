import React, { useState } from 'react';
import { Globe, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLanguage, Language } from '../../contexts/LanguageContext';

const languages = [
  { code: 'en' as Language, name: 'English', flag: '🇺🇸', nativeName: 'English' },
  { code: 'vi' as Language, name: 'Vietnamese', flag: '🇻🇳', nativeName: 'Tiếng Việt' },
  { code: 'zh' as Language, name: 'Chinese', flag: '🇨🇳', nativeName: '中文' }
];

const LanguageSelector: React.FC = () => {
  const { language, setLanguage, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg transition-colors"
        aria-label={t('common.selectLanguage')}
      >
        <Globe className="h-4 w-4" />
        <span className="text-lg">{currentLanguage?.flag}</span>
        <span className="hidden sm:block text-sm font-medium">
          {currentLanguage?.nativeName}
        </span>
        <ChevronDown className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="py-2">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                      language === lang.code 
                        ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                        : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    <span className="text-lg">{lang.flag}</span>
                    <div>
                      <div className="font-medium">{lang.nativeName}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {lang.name}
                      </div>
                    </div>
                    {language === lang.code && (
                      <div className="ml-auto w-2 h-2 bg-blue-600 rounded-full"></div>
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
};

export default LanguageSelector;