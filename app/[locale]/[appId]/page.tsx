import { Metadata } from "next";
import { Link } from "next-view-transitions";
import config, { AppConfig } from "@/lib/config";
import { getLocale, locales } from "@/lib/locales";
import { getDictionary, getLocalizedAppContent } from "@/lib/i18n";
import { languageAlternates } from "@/lib/alternates";
import { generateSoftwareApplicationStructuredData } from "@/lib/structuredData";
import AppStoreVersion from "./AppStoreVersion";
import ScreenshotCarousel from "./ScreenshotCarousel";
import GearMovement from "@/components/GearMovement";
import SiteHeader from "@/components/SiteHeader";

type Props = {
  params: {
    locale: string;
    appId: string;
  };
};

const platformOf = (app: AppConfig) =>
  app.download.googlePlay || app.download.apk ? "Android" : app.id === "menubro" ? "macOS" : "iPhone";

export async function generateStaticParams() {
  return locales.flatMap((locale) =>
    config.apps.map((app) => ({
      locale: locale.slug,
      appId: app.id,
    })),
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const locale = getLocale(params.locale)!;
  const app = config.apps.find((app) => app.id === params.appId);
  if (!app) {
    return {
      title: "App Not Found",
    };
  }

  const content = getLocalizedAppContent(app, locale);
  const description = content.details || content.description;
  const image = app.screenshots[0] || app.icon;

  return {
    title: app.name,
    description,
    keywords: ["app", "mobile", "application", app.name, "download", "software"],
    alternates: {
      canonical: `/${locale.slug}/${app.id}/`,
      languages: languageAlternates(`/${app.id}/`),
    },
    openGraph: {
      title: `${app.name} - ${config.site.title}`,
      description,
      type: "website",
      url: `${config.site.url || "https://selfstudio.fun"}/${locale.slug}/${app.id}/`,
      images: [
        {
          url: image,
          alt: app.name,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${app.name} - ${config.site.title}`,
      description,
      images: [image],
    },
  };
}

export default function AppPage({ params }: Props) {
  const locale = getLocale(params.locale)!;
  const dict = getDictionary(locale);
  const app = config.apps.find((app) => app.id === params.appId);

  if (!app) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 font-serif text-2xl font-medium">{dict.app.notFound}</h1>
          <Link href={`/${locale.slug}/`} className="text-terracotta hover:underline">
            {dict.app.backHome}
          </Link>
        </div>
      </main>
    );
  }

  const content = getLocalizedAppContent(app, locale);
  const hasDownloadLinks = app.download.appStore || app.download.googlePlay || app.download.apk;
  const structuredData = generateSoftwareApplicationStructuredData(
    app,
    locale,
    content.details || content.description,
  );
  const others = config.apps.filter((other) => other.id !== app.id);

  return (
    <div className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <GearMovement />

      <div className="relative z-10">
        <SiteHeader
          back
          backLabel={dict.app.backHome}
          localeSlug={locale.slug}
          languageLabel={dict.common.language}
        />

        <header className="mx-auto max-w-[1160px] px-10 pb-16 pt-9">
          <div className="mb-6 flex items-center gap-[18px]">
            <img
              src={app.icon}
              alt={app.name}
              className="h-[74px] w-[74px] rounded-[17px] border border-hairline bg-white object-contain [view-transition-name:app-hero]"
            />
            <div className="flex flex-col gap-2">
              <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">
                {platformOf(app)}
              </span>
              <span className="font-mono text-[13px] text-terracotta">
                {content.description}
              </span>
            </div>
          </div>

          <h1 className="font-serif text-[clamp(44px,6vw,76px)] font-medium leading-none">
            {app.name}
          </h1>
          <p className="mt-6 max-w-[52ch] text-[17px] leading-[1.64] text-ink-2">
            {content.details}
          </p>

          {app.download.appStore && (
            <p className="version-info mt-4 font-mono text-xs text-ink-3">
              {dict.app.loadingVersion}
              <AppStoreVersion
                appId={app.appstoreId}
                lang={locale.lang}
                versionLabel={dict.app.versionLabel}
                releaseDateLabel={dict.app.releaseDateLabel}
              />
            </p>
          )}

          {hasDownloadLinks && (
            <div className="mt-8 flex flex-wrap items-center gap-3">
              {app.download.appStore && (
                <a
                  href={app.download.appStore}
                  className="inline-flex items-center gap-2.5 rounded-[10px] bg-terracotta px-6 py-3.5 font-mono text-[13px] font-medium uppercase tracking-[0.05em] text-terracotta-fg no-underline transition-transform hover:-translate-y-0.5"
                >
                  App Store
                </a>
              )}
              {app.download.googlePlay && (
                <a
                  href={app.download.googlePlay}
                  className="inline-flex items-center gap-2.5 rounded-[10px] border border-hairline-2 px-6 py-3.5 font-mono text-[13px] font-medium uppercase tracking-[0.05em] text-ink no-underline hover:border-terracotta"
                >
                  Google Play
                </a>
              )}
              {app.download.apk && (
                <a
                  href={app.download.apk}
                  className="inline-flex items-center gap-2.5 rounded-[10px] border border-hairline-2 px-6 py-3.5 font-mono text-[13px] font-medium uppercase tracking-[0.05em] text-ink no-underline hover:border-terracotta"
                >
                  {dict.app.downloadApk}
                </a>
              )}
            </div>
          )}
        </header>

        <section className="border-t border-hairline">
          <div className="mx-auto max-w-[1160px] px-10 py-16">
            <div className="mb-8 font-mono text-xs uppercase tracking-[0.12em] text-ink-3">
              {dict.app.featuresHeading}
            </div>
            <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
              {content.features.map((feature, index) => (
                <div key={index} className="flex items-start gap-4">
                  <div className="mt-0.5 select-none text-3xl leading-none" aria-hidden>
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="mb-1.5 text-lg font-semibold">{feature.title}</h3>
                    <p className="leading-relaxed text-ink-2">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {app.screenshots.length > 0 && (
          <section className="border-t border-hairline">
            <div className="mx-auto max-w-[1160px] px-10 py-16">
              <ScreenshotCarousel
                screenshots={app.screenshots}
                heading={dict.app.screenshotsHeading}
                screenshotLabel={dict.app.screenshotLabel}
              />
            </div>
          </section>
        )}

        <section className="border-t border-hairline">
          <div className="mx-auto max-w-[1160px] px-10 py-16">
            <div className="mb-[30px] font-mono text-xs uppercase tracking-[0.12em] text-ink-3">
              Other works
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
              {others.map((other) => {
                const otherContent = getLocalizedAppContent(other, locale);
                return (
                  <Link
                    key={other.id}
                    href={`/${locale.slug}/${other.id}/`}
                    className="flex flex-col items-start gap-3 rounded-4 border border-hairline p-6 text-ink no-underline transition-all duration-200 hover:-translate-y-1 hover:border-terracotta"
                    style={{ background: "color-mix(in srgb, var(--paper-2) 84%, transparent)", backdropFilter: "blur(6px)" }}
                  >
                    <img
                      src={other.icon}
                      alt={other.name}
                      className="h-[52px] w-[52px] rounded-[13px] border border-hairline bg-white object-contain"
                    />
                    <div className="flex flex-col gap-1">
                      <span className="text-[18px] font-semibold">{other.name}</span>
                      <span className="text-[13px] text-ink-2">{otherContent.description}</span>
                    </div>
                    <span className="mt-1.5 inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.06em] text-terracotta">
                      {dict.home.learnMore}
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                        <path d="M5 12h14M13 6l6 6-6 6" />
                      </svg>
                    </span>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        <footer className="border-t border-hairline">
          <div className="mx-auto flex max-w-[1160px] flex-wrap items-center justify-between gap-5 px-10 py-10 font-mono text-xs text-ink-3">
            <Link href={`/${locale.slug}/${app.id}/privacy/`} className="text-ink-3 no-underline hover:text-terracotta">
              {dict.privacy.title}
            </Link>
            <span>© 2026 SELFSTUDIO · SELFSTUDIO.FUN</span>
          </div>
        </footer>
      </div>
    </div>
  );
}
