'use client';

import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { dictionary, Locale } from '@/lib/dictionary';

interface LanguageContextType {
    language: Locale;
    setLanguage: (lang: Locale) => void;
    t: typeof dictionary['ar'];
    dir: 'rtl' | 'ltr';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
    const [language, setLanguageState] = useState<Locale>('en'); // Defaulting to EN for new user base, legacy was AR

    useEffect(() => {
        const saved = localStorage.getItem('language') as Locale;
        if (saved && (saved === 'ar' || saved === 'en')) {
            setLanguageState(saved);
            document.documentElement.dir = saved === 'ar' ? 'rtl' : 'ltr';
            document.documentElement.lang = saved;
        } else {
            // Basic detection or default to English
            document.documentElement.dir = 'ltr';
            document.documentElement.lang = 'en';
        }
    }, []);

    const setLanguage = (lang: Locale) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
    };

    const t = dictionary[language];
    const dir = language === 'ar' ? 'rtl' : 'ltr';

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
