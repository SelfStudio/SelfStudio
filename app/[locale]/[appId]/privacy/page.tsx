import { Metadata } from "next";
import Link from "next/link";
import config, { AppConfig } from "@/lib/config";
import { getLocale } from "@/lib/locales";
import { getDictionary } from "@/lib/i18n";
import { languageAlternates } from "@/lib/alternates";

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
  const dict = getDictionary(locale);
  const app = config.apps.find((app) => app.id === params.appId);
  if (!app) {
    return {
      title: "Privacy Policy Not Found",
    };
  }

  return {
    title: `${app.name} ${dict.privacy.title}`,
    description: `${app.name} Privacy Policy details how we collect, use, and protect your personal information.`,
    keywords: ["privacy", "policy", app.name, "data protection", "personal information"],
    alternates: {
      canonical: `/${locale.slug}/${app.id}/privacy/`,
      languages: languageAlternates(`/${app.id}/privacy/`),
    },
    openGraph: {
      title: `${app.name} ${dict.privacy.title} - ${config.site.title}`,
      description: `${app.name} Privacy Policy details how we collect, use, and protect your personal information.`,
      type: "article",
      url: `${config.site.url || "https://selfstudio.fun"}/${locale.slug}/${app.id}/privacy/`,
    },
    twitter: {
      card: "summary",
      title: `${app.name} ${dict.privacy.title} - ${config.site.title}`,
      description: `${app.name} Privacy Policy details how we collect, use, and protect your personal information.`,
    },
  };
}

export default function PrivacyPolicy({ params }: Props) {
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

  const privacyPolicy = app.privacyPolicy;

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-10 text-sm">
          <Link
            href={`/${locale.slug}/${app.id}/`}
            className="inline-flex items-center gap-1.5 text-gray-500 transition-colors hover:text-orange-500 dark:text-gray-400"
          >
            <span aria-hidden className="rtl:rotate-180">←</span>
            {dict.privacy.back}
          </Link>
        </nav>

        <div className="mb-10 flex items-center gap-4">
          <img
            src={app.icon}
            alt=""
            className="h-14 w-14 rounded-2xl object-contain shadow-md"
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {app.name} {dict.privacy.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {dict.privacy.lastUpdated}: {privacyPolicy.lastUpdated}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-hairline bg-paper-2 p-8 leading-relaxed shadow-sm md:p-10">
          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.informationWeCollect.title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{privacyPolicy.informationWeCollect.content}</p>
          <ul className="mb-8 list-disc ps-6 text-gray-600 dark:text-gray-300">
            {privacyPolicy.informationWeCollect.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.howWeUseInformation.title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{privacyPolicy.howWeUseInformation.content}</p>
          <ul className="mb-8 list-disc ps-6 text-gray-600 dark:text-gray-300">
            {privacyPolicy.howWeUseInformation.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.informationSharing.title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{privacyPolicy.informationSharing.content}</p>
          <ul className="mb-8 list-disc ps-6 text-gray-600 dark:text-gray-300">
            {privacyPolicy.informationSharing.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.thirdPartyServices.title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{privacyPolicy.thirdPartyServices.content}</p>
          <ul className="mb-8 list-disc ps-6 text-gray-600 dark:text-gray-300">
            {privacyPolicy.thirdPartyServices.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.dataSecurity.title}</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300">{privacyPolicy.dataSecurity.content}</p>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.yourRights.title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{privacyPolicy.yourRights.content}</p>
          <ul className="mb-4 list-disc ps-6 text-gray-600 dark:text-gray-300">
            {privacyPolicy.yourRights.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="mb-8 text-gray-600 dark:text-gray-300">{dict.privacy.exerciseRights}</p>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.contactUs.title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{privacyPolicy.contactUs.content}</p>
          <p className="mb-1 text-gray-600 dark:text-gray-300">
            {dict.privacy.emailLabel}:{" "}
            <a
              href={`mailto:${privacyPolicy.contactUs.email}`}
              className="text-orange-500 hover:text-orange-600"
            >
              {privacyPolicy.contactUs.email}
            </a>
          </p>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            {dict.privacy.addressLabel}: {privacyPolicy.contactUs.address}
          </p>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.changesToPrivacyPolicy.title}</h2>
          <p className="text-gray-600 dark:text-gray-300">{privacyPolicy.changesToPrivacyPolicy.content}</p>
        </div>
      </div>
    </main>
  );
}
