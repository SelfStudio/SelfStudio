import { Link } from "next-view-transitions";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

/**
 * SiteHeader — sticky nav shared by home and detail pages.
 * The wordmark carries `view-transition-name: ss-wordmark` so it stays
 * anchored while the rest of the page crossfades between routes.
 */
export default function SiteHeader({
  back = false,
  backLabel = "Works",
  languageLabel = "Language",
  localeSlug,
}: {
  back?: boolean;
  backLabel?: string;
  languageLabel?: string;
  localeSlug: string;
}) {
  const homeHref = `/${localeSlug}/`;

  return (
    <nav className="sticky top-0 z-50 border-b border-hairline backdrop-blur-md"
      style={{ background: "color-mix(in srgb, var(--paper) 64%, transparent)" }}
    >
      <div className="max-w-[1160px] mx-auto px-10 py-3.5 flex items-center gap-7">
        <Link
          href={homeHref}
          className="font-serif text-[20px] text-ink no-underline [view-transition-name:ss-wordmark]"
        >
          <span className="italic font-medium">Self</span>
          <span className="font-medium">Studio</span>
          <span className="text-terracotta font-bold">.</span>
        </Link>

        {back && (
          <Link
            href={homeHref}
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.06em] text-ink-3 no-underline hover:text-terracotta"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
              <path d="M19 12H5M11 6l-6 6 6 6" />
            </svg>
            {backLabel}
          </Link>
        )}

        <div className="ml-auto flex items-center gap-3">
          <LanguageSwitcher currentSlug={localeSlug} label={languageLabel} />
          <ThemeToggle />
        </div>
      </div>
    </nav>
  );
}
