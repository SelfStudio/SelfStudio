import { locales } from "./locales";

// hreflang map for a path ("/" or "/menubro/" …). The x-default entry points at
// the locale-detecting redirect stub kept at the legacy URL.
export function languageAlternates(path: string): Record<string, string> {
  const languages: Record<string, string> = {};
  for (const locale of locales) {
    languages[locale.lang] = `/${locale.slug}${path}`;
  }
  languages["x-default"] = path;
  return languages;
}
