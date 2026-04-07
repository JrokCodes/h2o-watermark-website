import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { en } from "../lib/translations/en";
import { ja } from "../lib/translations/ja";
import { ko } from "../lib/translations/ko";

export type Language = "en" | "ja" | "ko";

const translations = { en, ja, ko };

interface LanguageContextType {
  lang: Language;
  setLang: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Language>(() => {
    if (typeof window === "undefined") return "en";
    const stored = localStorage.getItem("h2o_lang") as Language;
    return stored && ["en", "ja", "ko"].includes(stored) ? stored : "en";
  });

  useEffect(() => {
    document.documentElement.lang = lang;
    localStorage.setItem("h2o_lang", lang);
  }, [lang]);

  const setLang = (newLang: Language) => setLangState(newLang);

  const t = (key: string): string => {
    const keys = key.split(".");
    let value: any = translations[lang];
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English
        value = translations.en;
        for (const k2 of keys) {
          value = value?.[k2];
          if (value === undefined) return key;
        }
        return typeof value === "string" ? value : key;
      }
    }
    return typeof value === "string" ? value : key;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage must be used within LanguageProvider");
  return ctx;
}
