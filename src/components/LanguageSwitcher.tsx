import { useLanguage } from "../contexts/LanguageContext";
import type { Language } from "../contexts/LanguageContext";
import { Globe } from "lucide-react";
import { useState } from "react";

const languages: { code: Language; label: string; native: string }[] = [
  { code: "en", label: "English", native: "EN" },
  { code: "ja", label: "日本語", native: "日本語" },
  { code: "ko", label: "한국어", native: "한국어" },
];

export default function LanguageSwitcher() {
  const { lang, setLang } = useLanguage();
  const [open, setOpen] = useState(false);
  const current = languages.find((l) => l.code === lang) ?? languages[0];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium text-foreground hover:text-sunset transition-colors rounded-md"
        aria-label="Change language"
      >
        <Globe className="h-4 w-4" />
        <span>{current.native}</span>
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-border z-50 overflow-hidden">
            {languages.map((l) => (
              <button
                key={l.code}
                onClick={() => {
                  setLang(l.code);
                  setOpen(false);
                }}
                className={`block w-full text-left px-4 py-2.5 text-sm hover:bg-ocean/5 hover:text-ocean transition-colors ${
                  l.code === lang ? "bg-ocean/10 text-ocean font-semibold" : ""
                }`}
              >
                {l.label}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
