import { Metadata } from "next";
import Link from "next/link";
import config, { AppConfig } from "@/lib/config";
import { getLocale } from "@/lib/locales";
import { getDictionary, getLocalizedAppContent } from "@/lib/i18n";
import { languageAlternates } from "@/lib/alternates";
import { generateSoftwareApplicationStructuredData } from "@/lib/structuredData";
import AppStoreVersion from "./AppStoreVersion";
import ScreenshotCarousel from "./ScreenshotCarousel";

type Props = {
  params: {
    locale: string;
    appId: string;
  };
};

export async function generateStaticParams() {
  return config.apps.map((app) => ({
    appId: app.id,
  }));
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
  const app = config.apps.find((app) => app.id === params.appId) as AppConfig;

  if (!app) {
    return (
      <main className="flex min-h-[60vh] items-center justify-center">
        <div className="text-center">
          <h1 className="mb-4 text-2xl font-bold">{dict.app.notFound}</h1>
          <Link href={`/${locale.slug}/`} className="text-orange-500 hover:text-orange-600">
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

  return (
    <main className="container mx-auto px-4 pb-24 pt-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <div className="mx-auto max-w-4xl">
        <nav className="mb-10 text-sm">
          <Link
            href={`/${locale.slug}/`}
            className="inline-flex items-center gap-1.5 text-gray-500 transition-colors hover:text-orange-500 dark:text-gray-400"
          >
            <span aria-hidden className="rtl:rotate-180">←</span>
            {dict.app.backHome}
          </Link>
        </nav>

        <section className="mb-16 text-center">
          <img
            src={app.icon}
            alt=""
            className="mx-auto mb-8 h-28 w-28 rounded-3xl object-contain shadow-lg ring-1 ring-gray-900/10 dark:ring-white/10"
          />
          <h1 className="mb-4 text-4xl font-extrabold tracking-tight md:text-5xl">{app.name}</h1>
          <p className="mb-3 text-xl font-medium text-gray-700 dark:text-gray-200">
            {content.description}
          </p>
          <p className="mx-auto max-w-2xl leading-relaxed text-gray-500 dark:text-gray-400">
            {content.details}
          </p>

          {app.download.appStore && (
            <>
              <p className="version-info mt-6 text-sm text-gray-400 dark:text-gray-500">
                {dict.app.loadingVersion}
              </p>
              <AppStoreVersion
                appId={app.appstoreId}
                lang={locale.lang}
                versionLabel={dict.app.versionLabel}
                releaseDateLabel={dict.app.releaseDateLabel}
              />
            </>
          )}

          {hasDownloadLinks && (
            <div className="mt-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
              {app.download.appStore && (
                <a
                  href={app.download.appStore}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3 text-white shadow-md transition-all hover:scale-[1.02] hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  <span aria-hidden></span> App Store
                </a>
              )}
              {app.download.googlePlay && (
                <a
                  href={app.download.googlePlay}
                  className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-7 py-3 text-white shadow-md transition-all hover:scale-[1.02] hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
                >
                  <span aria-hidden>▶</span> Google Play
                </a>
              )}
              {app.download.apk && (
                <a
                  href={app.download.apk}
                  className="inline-flex items-center gap-2 rounded-full border border-gray-300 px-7 py-3 text-gray-700 shadow-sm transition-all hover:scale-[1.02] hover:border-orange-400 dark:border-gray-700 dark:text-gray-200"
                >
                  {dict.app.downloadApk}
                </a>
              )}
            </div>
          )}
        </section>

        <section className="mb-16">
          <h2 className="mb-8 text-center text-2xl font-semibold md:text-3xl">
            {dict.app.featuresHeading}
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {content.features.map((feature, index) => (
              <div
                key={index}
                className="rounded-3xl border border-gray-200/70 bg-white/80 p-6 shadow-sm backdrop-blur transition-shadow hover:shadow-md dark:border-gray-800 dark:bg-gray-900/70"
              >
                <div className="mb-4 text-4xl" aria-hidden>
                  {feature.icon}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <ScreenshotCarousel
          screenshots={app.screenshots}
          heading={dict.app.screenshotsHeading}
          screenshotLabel={dict.app.screenshotLabel}
        />

        <div className="mt-16 text-center">
          <Link
            href={`/${locale.slug}/${app.id}/privacy/`}
            className="text-sm text-gray-500 underline-offset-4 transition-colors hover:text-orange-500 hover:underline dark:text-gray-400"
          >
            {dict.privacy.title}
          </Link>
        </div>
      </div>
    </main>
  );
}
