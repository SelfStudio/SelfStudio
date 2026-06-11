'use client';

import { useI18n } from "./I18nProvider";
import { locales } from "@/lib/locales";

export default function LanguageSwitcher() {
  const { locale, dict, setLocale } = useI18n();

  return (
    <label className="inline-flex items-center gap-2 text-sm text-ink-2">
      <span className="sr-only">{dict.common.language}</span>
      <svg
        aria-hidden="true"
        className="h-4 w-4 shrink-0"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 21a9 9 0 100-18 9 9 0 000 18zm0-18c2.5 2.3 3.75 5.3 3.75 9S14.5 18.7 12 21m0-18C9.5 5.3 8.25 8.3 8.25 12S9.5 18.7 12 21M3.6 9h16.8M3.6 15h16.8"
        />
      </svg>
      <select
        value={locale.slug}
        onChange={(e) => setLocale(e.target.value)}
        className="max-w-[11rem] cursor-pointer appearance-none rounded-md border border-hairline-2 bg-paper-2 px-3 py-1.5 text-sm text-ink shadow-sm backdrop-blur transition-colors hover:border-terracotta focus:border-terracotta focus:outline-none"
      >
        {locales.map((l) => (
          <option key={l.slug} value={l.slug}>
            {l.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
