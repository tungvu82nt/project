import { Language } from '../contexts/LanguageContext';

// Utility functions for internationalization
export const getLanguageDirection = (language: Language): 'ltr' | 'rtl' => {
  // Add RTL languages here when needed
  const rtlLanguages: Language[] = [];
  return rtlLanguages.includes(language) ? 'rtl' : 'ltr';
};

export const getLanguageCode = (language: Language): string => {
  const languageCodes = {
    en: 'en-US',
    vi: 'vi-VN',
    zh: 'zh-CN'
  };
  return languageCodes[language];
};

export const formatRelativeTime = (date: Date, language: Language): string => {
  const rtf = new Intl.RelativeTimeFormat(getLanguageCode(language), { numeric: 'auto' });
  const now = new Date();
  const diffInSeconds = Math.floor((date.getTime() - now.getTime()) / 1000);
  
  if (Math.abs(diffInSeconds) < 60) {
    return rtf.format(diffInSeconds, 'second');
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (Math.abs(diffInMinutes) < 60) {
    return rtf.format(diffInMinutes, 'minute');
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (Math.abs(diffInHours) < 24) {
    return rtf.format(diffInHours, 'hour');
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  return rtf.format(diffInDays, 'day');
};

export const formatFileSize = (bytes: number, language: Language): string => {
  const units = {
    en: ['B', 'KB', 'MB', 'GB', 'TB'],
    vi: ['B', 'KB', 'MB', 'GB', 'TB'],
    zh: ['B', 'KB', 'MB', 'GB', 'TB']
  };
  
  if (bytes === 0) return `0 ${units[language][0]}`;
  
  const k = 1024;
  const dm = 2;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + units[language][i];
};

export const pluralize = (count: number, singular: string, plural: string, language: Language): string => {
  // English pluralization rules
  if (language === 'en') {
    return count === 1 ? singular : plural;
  }
  
  // Vietnamese doesn't have plural forms
  if (language === 'vi') {
    return singular;
  }
  
  // Chinese doesn't have plural forms
  if (language === 'zh') {
    return singular;
  }
  
  return count === 1 ? singular : plural;
};

export const getCountryName = (countryCode: string, language: Language): string => {
  const displayNames = new Intl.DisplayNames([getLanguageCode(language)], { type: 'region' });
  return displayNames.of(countryCode) || countryCode;
};

export const getCurrencySymbol = (language: Language): string => {
  const symbols = {
    en: '$',
    vi: '₫',
    zh: '¥'
  };
  return symbols[language];
};

export const getDateFormat = (language: Language): Intl.DateTimeFormatOptions => {
  const formats = {
    en: { year: 'numeric', month: 'long', day: 'numeric' },
    vi: { year: 'numeric', month: 'long', day: 'numeric' },
    zh: { year: 'numeric', month: 'long', day: 'numeric' }
  };
  return formats[language] as Intl.DateTimeFormatOptions;
};

export const getTimeFormat = (language: Language): Intl.DateTimeFormatOptions => {
  const formats = {
    en: { hour: '2-digit', minute: '2-digit', hour12: true },
    vi: { hour: '2-digit', minute: '2-digit', hour12: false },
    zh: { hour: '2-digit', minute: '2-digit', hour12: false }
  };
  return formats[language] as Intl.DateTimeFormatOptions;
};

export const validateTranslationKey = (key: string): boolean => {
  // Check if translation key follows the pattern: category.key
  const keyPattern = /^[a-z]+\.[a-zA-Z]+$/;
  return keyPattern.test(key);
};

export const getAvailableLanguages = (): Array<{ code: Language; name: string; nativeName: string; flag: string }> => {
  return [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇺🇸' },
    { code: 'vi', name: 'Vietnamese', nativeName: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳' }
  ];
};

export const detectBrowserLanguage = (): Language => {
  const browserLang = navigator.language.toLowerCase();
  
  if (browserLang.startsWith('vi')) return 'vi';
  if (browserLang.startsWith('zh')) return 'zh';
  
  return 'en'; // Default to English
};

export const loadLanguageAsync = async (language: Language): Promise<Record<string, string>> => {
  // This would be used for dynamic language loading
  // For now, we return empty object since translations are bundled
  return {};
};

export const interpolateString = (template: string, params: Record<string, string | number>): string => {
  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
};