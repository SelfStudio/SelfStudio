'use client';

import { usePathname, useRouter } from "next/navigation";
import { locales } from "@/lib/locales";

type LanguageSwitcherProps = {
  currentSlug: string;
  label: string;
};

export const LOCALE_STORAGE_KEY = "selfstudio-locale";

export default function LanguageSwitcher({ currentSlug, label }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const switchLocale = (slug: string) => {
    try {
      localStorage.setItem(LOCALE_STORAGE_KEY, slug);
    } catch {
      // localStorage 不可用时仅做跳转
    }
    const rest = pathname.replace(/^\/[^/]+/, "") || "/";
    router.push(`/${slug}${rest}`);
  };

  return (
    <label className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
      <span className="sr-only">{label}</span>
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
        value={currentSlug}
        onChange={(e) => switchLocale(e.target.value)}
        className="max-w-[11rem] cursor-pointer appearance-none rounded-full border border-gray-200 bg-white/70 px-3 py-1.5 text-sm text-gray-700 shadow-sm backdrop-blur transition-colors hover:border-orange-400 focus:border-orange-500 focus:outline-none dark:border-gray-700 dark:bg-gray-900/70 dark:text-gray-200"
      >
        {locales.map((locale) => (
          <option key={locale.slug} value={locale.slug}>
            {locale.nativeName}
          </option>
        ))}
      </select>
    </label>
  );
}
