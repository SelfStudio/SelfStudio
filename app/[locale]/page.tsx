import Link from "next/link";
import { Metadata } from "next";
import config from "@/lib/config";
import { getLocale } from "@/lib/locales";
import { getDictionary, getLocalizedAppContent } from "@/lib/i18n";
import { languageAlternates } from "@/lib/alternates";
import { generateWebSiteStructuredData } from "@/lib/structuredData";

type Props = {
  params: {
    locale: string;
  };
};

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

export default function Home({ params }: Props) {
  const locale = getLocale(params.locale)!;
  const dict = getDictionary(locale);
  const structuredData = generateWebSiteStructuredData(locale, dict.site.description);

  return (
    <main className="container mx-auto px-4 pb-24 pt-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />

      <section className="mx-auto mb-20 max-w-3xl text-center">
        <h1 className="mb-6 text-5xl font-extrabold tracking-tight md:text-7xl">
          <span className="bg-gradient-to-r from-orange-500 via-amber-500 to-rose-500 bg-clip-text text-transparent">
            {config.site.title}
          </span>
        </h1>
        <p className="text-xl leading-relaxed text-gray-600 dark:text-gray-300 md:text-2xl">
          {dict.site.description}
        </p>
      </section>

      <section aria-label={dict.home.appsHeading}>
        <h2 className="sr-only">{dict.home.appsHeading}</h2>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {config.apps.map((app) => {
            const content = getLocalizedAppContent(app, locale);
            return (
              <Link key={app.id} href={`/${locale.slug}/${app.id}/`} className="group block h-full">
                <article className="flex h-full flex-col items-center rounded-3xl border border-gray-200/70 bg-white/80 p-8 text-center shadow-sm backdrop-blur transition-all duration-300 group-hover:-translate-y-1 group-hover:border-orange-400/70 group-hover:shadow-xl dark:border-gray-800 dark:bg-gray-900/70">
                  <img
                    src={app.icon}
                    alt=""
                    className="mb-6 h-20 w-20 rounded-2xl object-contain shadow-md"
                  />
                  <h3 className="mb-3 text-2xl font-semibold">{app.name}</h3>
                  <p className="mb-6 flex-1 text-gray-600 dark:text-gray-300">
                    {content.description}
                  </p>
                  <span className="inline-flex items-center gap-1.5 font-medium text-orange-500">
                    {dict.home.learnMore}
                    <span
                      aria-hidden
                      className="transition-transform group-hover:translate-x-0.5 rtl:rotate-180 rtl:group-hover:-translate-x-0.5"
                    >
                      →
                    </span>
                  </span>
                </article>
              </Link>
            );
          })}
        </div>
      </section>
    </main>
  );
}
