// All App Store locales supported by Apple platforms.
// `slug` is the URL segment, `lang` is the BCP 47 tag used for <html lang> and hreflang,
// `dictionary` points to the translation file in /locales.
export type LocaleInfo = {
  slug: string;
  lang: string;
  nativeName: string;
  dir: "ltr" | "rtl";
  dictionary: string;
};

export const locales: LocaleInfo[] = [
  { slug: "ar", lang: "ar", nativeName: "العربية", dir: "rtl", dictionary: "ar" },
  { slug: "ca", lang: "ca", nativeName: "Català", dir: "ltr", dictionary: "ca" },
  { slug: "cs", lang: "cs", nativeName: "Čeština", dir: "ltr", dictionary: "cs" },
  { slug: "da", lang: "da", nativeName: "Dansk", dir: "ltr", dictionary: "da" },
  { slug: "de", lang: "de", nativeName: "Deutsch", dir: "ltr", dictionary: "de" },
  { slug: "el", lang: "el", nativeName: "Ελληνικά", dir: "ltr", dictionary: "el" },
  { slug: "en-au", lang: "en-AU", nativeName: "English (Australia)", dir: "ltr", dictionary: "en" },
  { slug: "en-ca", lang: "en-CA", nativeName: "English (Canada)", dir: "ltr", dictionary: "en" },
  { slug: "en-gb", lang: "en-GB", nativeName: "English (UK)", dir: "ltr", dictionary: "en" },
  { slug: "en-us", lang: "en-US", nativeName: "English (US)", dir: "ltr", dictionary: "en" },
  { slug: "es-es", lang: "es-ES", nativeName: "Español (España)", dir: "ltr", dictionary: "es" },
  { slug: "es-mx", lang: "es-MX", nativeName: "Español (México)", dir: "ltr", dictionary: "es" },
  { slug: "fi", lang: "fi", nativeName: "Suomi", dir: "ltr", dictionary: "fi" },
  { slug: "fr-ca", lang: "fr-CA", nativeName: "Français (Canada)", dir: "ltr", dictionary: "fr" },
  { slug: "fr-fr", lang: "fr-FR", nativeName: "Français", dir: "ltr", dictionary: "fr" },
  { slug: "he", lang: "he", nativeName: "עברית", dir: "rtl", dictionary: "he" },
  { slug: "hi", lang: "hi", nativeName: "हिन्दी", dir: "ltr", dictionary: "hi" },
  { slug: "hr", lang: "hr", nativeName: "Hrvatski", dir: "ltr", dictionary: "hr" },
  { slug: "hu", lang: "hu", nativeName: "Magyar", dir: "ltr", dictionary: "hu" },
  { slug: "id", lang: "id", nativeName: "Bahasa Indonesia", dir: "ltr", dictionary: "id" },
  { slug: "it", lang: "it", nativeName: "Italiano", dir: "ltr", dictionary: "it" },
  { slug: "ja", lang: "ja", nativeName: "日本語", dir: "ltr", dictionary: "ja" },
  { slug: "ko", lang: "ko", nativeName: "한국어", dir: "ltr", dictionary: "ko" },
  { slug: "ms", lang: "ms", nativeName: "Bahasa Melayu", dir: "ltr", dictionary: "ms" },
  { slug: "nb", lang: "nb", nativeName: "Norsk (bokmål)", dir: "ltr", dictionary: "nb" },
  { slug: "nl", lang: "nl", nativeName: "Nederlands", dir: "ltr", dictionary: "nl" },
  { slug: "pl", lang: "pl", nativeName: "Polski", dir: "ltr", dictionary: "pl" },
  { slug: "pt-br", lang: "pt-BR", nativeName: "Português (Brasil)", dir: "ltr", dictionary: "pt-br" },
  { slug: "pt-pt", lang: "pt-PT", nativeName: "Português (Portugal)", dir: "ltr", dictionary: "pt-pt" },
  { slug: "ro", lang: "ro", nativeName: "Română", dir: "ltr", dictionary: "ro" },
  { slug: "ru", lang: "ru", nativeName: "Русский", dir: "ltr", dictionary: "ru" },
  { slug: "sk", lang: "sk", nativeName: "Slovenčina", dir: "ltr", dictionary: "sk" },
  { slug: "sv", lang: "sv", nativeName: "Svenska", dir: "ltr", dictionary: "sv" },
  { slug: "th", lang: "th", nativeName: "ไทย", dir: "ltr", dictionary: "th" },
  { slug: "tr", lang: "tr", nativeName: "Türkçe", dir: "ltr", dictionary: "tr" },
  { slug: "uk", lang: "uk", nativeName: "Українська", dir: "ltr", dictionary: "uk" },
  { slug: "vi", lang: "vi", nativeName: "Tiếng Việt", dir: "ltr", dictionary: "vi" },
  { slug: "zh-hans", lang: "zh-Hans", nativeName: "简体中文", dir: "ltr", dictionary: "zh-hans" },
  { slug: "zh-hant", lang: "zh-Hant", nativeName: "繁體中文", dir: "ltr", dictionary: "zh-hant" },
];

export const defaultLocale = locales.find((l) => l.slug === "en-us")!;

export function getLocale(slug: string): LocaleInfo | undefined {
  return locales.find((l) => l.slug === slug);
}
