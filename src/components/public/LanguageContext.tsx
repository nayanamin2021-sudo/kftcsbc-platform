"use client";

import React, { createContext, useContext, useState } from "react";

export type Locale = "EN" | "BN";

interface LanguageContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (en: string, bn?: string) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  locale: "EN",
  setLocale: () => {},
  t: (en) => en,
});

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocale] = useState<Locale>("EN");

  const t = (en: string, bn?: string) => {
    if (locale === "BN" && bn) return bn;
    return en;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}
