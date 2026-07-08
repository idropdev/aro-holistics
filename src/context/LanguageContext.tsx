import React, { createContext, useContext, useState } from "react";
import {
  uiTranslations,
  WELLNESS_PRODUCTS_EN,
  WELLNESS_PRODUCTS_ES,
  MAKERS_EN,
  MAKERS_ES,
  TICKER_ITEMS_EN,
  TICKER_ITEMS_ES,
  PILLARS_EN,
  PILLARS_ES,
  JUICES_DATA_EN,
  JUICES_DATA_ES,
  REVIEWS_DATA_EN,
  REVIEWS_DATA_ES,
  type ShelfProduct,
  type Maker,
  type Juice,
  type Review
} from "../data/translations";

export type Language = "en" | "es";

interface LocalizedData {
  wellnessProducts: ShelfProduct[];
  makers: Maker[];
  tickerItems: string[];
  pillars: { number: string; title: string; body: string }[];
  juicesData: Juice[];
  reviewsData: Review[];
}

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  localizedData: LocalizedData;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Detect browser language or fallback to 'en'
  const getInitialLanguage = (): Language => {
    const saved = localStorage.getItem("aro-language") as Language;
    if (saved === "en" || saved === "es") return saved;

    const browserLang = navigator.language.split("-")[0];
    if (browserLang === "es") return "es";
    return "en";
  };

  const [language, setLanguageState] = useState<Language>(getInitialLanguage);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("aro-language", lang);
  };

  // Safe translation lookup helper
  const t = (key: string): string => {
    const keys = uiTranslations[language];
    if (key in keys) {
      return keys[key as keyof typeof keys];
    }
    // Fallback to English
    const fallbackKeys = uiTranslations["en"];
    if (key in fallbackKeys) {
      return fallbackKeys[key as keyof typeof fallbackKeys];
    }
    return key;
  };

  const localizedData: LocalizedData = {
    wellnessProducts: language === "en" ? WELLNESS_PRODUCTS_EN : WELLNESS_PRODUCTS_ES,
    makers: language === "en" ? MAKERS_EN : MAKERS_ES,
    tickerItems: language === "en" ? TICKER_ITEMS_EN : TICKER_ITEMS_ES,
    pillars: language === "en" ? PILLARS_EN : PILLARS_ES,
    juicesData: language === "en" ? JUICES_DATA_EN : JUICES_DATA_ES,
    reviewsData: language === "en" ? REVIEWS_DATA_EN : REVIEWS_DATA_ES
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, localizedData }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
};
