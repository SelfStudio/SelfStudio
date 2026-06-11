import { Metadata } from "next";
import config from "@/lib/config";
import { getLocale, locales } from "@/lib/locales";
import { getDictionary, getLocalizedAppContent } from "@/lib/i18n";
import { languageAlternates } from "@/lib/alternates";
import { generateWebSiteStructuredData } from "@/lib/structuredData";
import GearMovement from "@/components/GearMovement";
import SiteHeader from "@/components/SiteHeader";
import WorkCard from "@/components/WorkCard";

type Props = {
  params: {
    locale: string;
  };
};

export function generateStaticParams() {
  return locales.map((locale) => ({ locale: locale.slug }));
}

const homeOgImage =
  config.apps[0]?.screenshots[0] || config.apps[0]?.icon || "/images/menubro/hero-image.png";

export function generateMetadata({ params }: Props): Metadata {
  const locale = getLocale(params.locale)!;
  const dict = getDictionary(locale);

  return {
    title: {
      absolute: config.site.title,
    },
    description: dict.site.description,
    keywords: ["app", "mobile", "application", "software", "macOS", "iOS", "Android", "SelfStudio"],
    alternates: {
      canonical: `/${locale.slug}/`,
      languages: languageAlternates("/"),
    },
    openGraph: {
      title: config.site.title,
      description: dict.site.description,
      type: "website",
      url: `${config.site.url || "https://selfstudio.fun"}/${locale.slug}/`,
      images: [
        {
          url: homeOgImage,
          alt: config.site.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: config.site.title,
      description: dict.site.description,
      images: [homeOgImage],
    },
  };
}

// 字典里的 *词* 标记渲染为赤陶色斜体强调（各语言可自行决定强调哪个词）
function renderAccent(text: string) {
  return text.split("*").map((part, i) =>
    i % 2 === 1 ? (
      <span key={i} className="italic text-terracotta">
        {part}
      </span>
    ) : (
      part
    ),
  );
}

export default function Home({ params }: Props) {
  const locale = getLocale(params.locale)!;
  const dict = getDictionary(locale);
  const structuredData = generateWebSiteStructuredData(locale, dict.site.description);

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GearMovement />

      <div className="relative z-10">
        <SiteHeader
          localeSlug={locale.slug}
          languageLabel={dict.common.language}
          themeLabel={dict.common.toggleTheme}
        />

        <header className="mx-auto max-w-[1160px] px-10 pb-2 pt-[72px]">
          <div className="mb-6 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.14em] text-ink-3">
            <span className="h-[7px] w-[7px] rounded-full bg-terracotta" />
            <span>{dict.home.eyebrow}</span>
          </div>
          <h1 className="max-w-[18ch] font-serif text-[clamp(42px,6vw,84px)] font-medium leading-[1.06]">
            {renderAccent(dict.home.heroTitle)}
          </h1>
          <p className="mt-5 max-w-[54ch] text-[17px] leading-[1.64] text-ink-2">
            {dict.site.description}
          </p>
          <p className="mt-4 font-mono text-[12.5px] text-ink-3">
            {dict.home.stats
              .replace("{count}", String(config.apps.length))
              .replace("{year}", "2025")}
          </p>
        </header>

        <section className="mx-auto max-w-[1160px] px-10 pb-14 pt-11" aria-label={dict.home.appsHeading}>
          <h2 className="sr-only">{dict.home.appsHeading}</h2>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {config.apps.map((app, i) => {
              const content = getLocalizedAppContent(app, locale);
              return (
                <WorkCard
                  key={app.id}
                  app={app}
                  index={i}
                  href={`/${locale.slug}/${app.id}/`}
                  description={content.description}
                />
              );
            })}
          </div>

          <div
            className="mt-8 flex flex-wrap items-center gap-[18px] rounded-4 border border-hairline px-6 py-[18px]"
            style={{ background: "color-mix(in srgb, var(--paper-2) 80%, transparent)", backdropFilter: "blur(6px)" }}
          >
            <span className="font-mono text-xs uppercase tracking-[0.14em] text-ink-3">{dict.home.storeLabel}</span>
            <span className="text-[15px] text-ink-2">{dict.home.storeSoon}</span>
            <div className="ms-auto flex flex-wrap items-center gap-2.5">
              <span className="whitespace-nowrap rounded-md border border-hairline-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2">macOS license</span>
              <span className="whitespace-nowrap rounded-md border border-hairline-2 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-ink-2">Studio goods</span>
              <span className="whitespace-nowrap rounded-md border border-terracotta px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.08em] text-terracotta">Soon · Creem</span>
            </div>
          </div>
        </section>

        <footer className="mx-auto mt-[26vh] flex max-w-[1160px] flex-wrap items-center justify-between gap-5 px-10 py-6 font-mono text-xs text-ink-3">
          <span>© {new Date().getFullYear()} SELFSTUDIO · {dict.footer.rights}</span>
          <a href={`mailto:${config.contact.email}`} className="text-ink-3 no-underline hover:text-terracotta">
            {config.contact.email.toUpperCase()}
          </a>
        </footer>
      </div>
    </div>
  );
}
