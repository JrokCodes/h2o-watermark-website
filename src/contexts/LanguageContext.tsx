import { createContext, useContext, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { en } from "../lib/translations/en";
import { ja } from "../lib/translations/ja";
import { ko } from "../lib/translations/ko";

export type Language = "en" | "ja" | "ko";

const translations = { en, ja, ko };

// Map our language codes to Google Translate codes
const GOOGLE_LANG: Record<Language, string> = { en: "en", ja: "ja", ko: "ko" };

function applyGoogleTranslate(lang: Language) {
  if (typeof document === "undefined") return;
  const target = GOOGLE_LANG[lang];
  // Setting the googtrans cookie on the bare host AND with a leading dot
  // covers Vercel preview/prod and localhost
  const value = target === "en" ? "/en/en" : `/en/${target}`;
  const host = window.location.hostname;
  const expires = "; max-age=31536000; path=/";
  document.cookie = `googtrans=${value}${expires}`;
  if (host && host !== "localhost") {
    document.cookie = `googtrans=${value}; domain=${host}${expires}`;
    const parts = host.split(".");
    if (parts.length > 1) {
      document.cookie = `googtrans=${value}; domain=.${parts.slice(-2).join(".")}${expires}`;
    }
  }
}

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

  // On mount, sync Google Translate to the stored language so the page loads
  // already translated (otherwise it'd flash English first).
  useEffect(() => {
    if (typeof window === "undefined") return;
    applyGoogleTranslate(lang);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLang = (newLang: Language) => {
    if (newLang === lang) return;
    setLangState(newLang);
    // Reload so Google Translate picks up the new googtrans cookie cleanly.
    // Manual translations (UI strings) update instantly via React; Google
    // Translate handles all the data content (descriptions, names, etc.)
    applyGoogleTranslate(newLang);
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

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
