"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { defaultLocale, getLocale, locales, LocaleInfo } from "@/lib/locales";
import { getDictionary, Dictionary } from "@/lib/i18n";

const STORAGE_KEY = "selfstudio-locale";

// 浏览器语言代码 → 站点 locale slug 的别名映射
const ALIASES: Record<string, string> = {
  en: "en-us",
  fr: "fr-fr",
  es: "es-es",
  "es-419": "es-mx",
  pt: "pt-br",
  zh: "zh-hans",
  "zh-cn": "zh-hans",
  "zh-sg": "zh-hans",
  "zh-my": "zh-hans",
  "zh-tw": "zh-hant",
  "zh-hk": "zh-hant",
  "zh-mo": "zh-hant",
  no: "nb",
  nn: "nb",
  iw: "he",
  in: "id",
};

function resolveCandidate(code: string): LocaleInfo | undefined {
  if (getLocale(code)) return getLocale(code);
  if (ALIASES[code]) return getLocale(ALIASES[code]);
  const base = code.split("-")[0];
  if (getLocale(base)) return getLocale(base);
  if (ALIASES[base]) return getLocale(ALIASES[base]);
  return locales.find((l) => l.slug.split("-")[0] === base);
}

export function detectLocale(): LocaleInfo {
  const candidates: string[] = [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) candidates.push(stored.toLowerCase());
  } catch {
    // localStorage 不可用时仅按浏览器语言匹配
  }
  for (const lang of navigator.languages || [navigator.language || "en-US"]) {
    candidates.push(String(lang).toLowerCase());
  }
  for (const candidate of candidates) {
    const match = resolveCandidate(candidate);
    if (match) return match;
  }
  return defaultLocale;
}

type I18nValue = {
  locale: LocaleInfo;
  dict: Dictionary;
  setLocale: (slug: string) => void;
};

const I18nContext = createContext<I18nValue>({
  locale: defaultLocale,
  dict: getDictionary(defaultLocale),
  setLocale: () => {},
});

export function I18nProvider({ children }: { children: React.ReactNode }) {
  // 首屏静态 HTML 用默认语言渲染，挂载后切到检测结果
  const [locale, setLocaleState] = useState<LocaleInfo>(defaultLocale);

  useEffect(() => {
    setLocaleState(detectLocale());
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale.lang;
    document.documentElement.dir = locale.dir;
  }, [locale]);

  const setLocale = (slug: string) => {
    const next = getLocale(slug);
    if (!next) return;
    try {
      localStorage.setItem(STORAGE_KEY, slug);
    } catch {
      // 忽略
    }
    setLocaleState(next);
  };

  return (
    <I18nContext.Provider value={{ locale, dict: getDictionary(locale), setLocale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  return useContext(I18nContext);
}
