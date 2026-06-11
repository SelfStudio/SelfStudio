import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import "../globals.css";
import config from "@/lib/config";
import { getLocale, locales } from "@/lib/locales";
import { getDictionary } from "@/lib/i18n";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const inter = Inter({ subsets: ["latin"] });
const siteUrl = new URL(config.site.url || "https://selfstudio.fun");

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((locale) => ({ locale: locale.slug }));
}

type Props = {
  children: React.ReactNode;
  params: { locale: string };
};

export function generateMetadata({ params }: { params: { locale: string } }): Metadata {
  const locale = getLocale(params.locale)!;
  const dict = getDictionary(locale);

  return {
    metadataBase: siteUrl,
    title: {
      default: config.site.title,
      template: `%s - ${config.site.title}`,
    },
    description: dict.site.description,
    keywords: ["app", "mobile", "application", "software", "macOS", "iOS", "Android"],
    authors: [{ name: "CodeEagle" }],
    creator: "SelfStudio",
    publisher: "SelfStudio",
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
  };
}

export default function LocaleLayout({ children, params }: Props) {
  const locale = getLocale(params.locale)!;
  const dict = getDictionary(locale);

  return (
    <html lang={locale.lang} dir={locale.dir}>
      <body
        className={`${inter.className} flex min-h-screen flex-col bg-gray-50 text-gray-900 antialiased dark:bg-gray-950 dark:text-gray-100`}
      >
        {/* 装饰性背景光斑 */}
        <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-[28rem] w-[28rem] rounded-full bg-orange-200/50 blur-3xl dark:bg-orange-500/10" />
          <div className="absolute -right-32 top-1/3 h-[28rem] w-[28rem] rounded-full bg-sky-200/50 blur-3xl dark:bg-sky-500/10" />
          <div className="absolute bottom-0 left-1/3 h-[24rem] w-[24rem] rounded-full bg-violet-200/40 blur-3xl dark:bg-violet-500/10" />
        </div>

        <header className="sticky top-0 z-40 border-b border-gray-200/60 bg-white/70 backdrop-blur-xl dark:border-gray-800/60 dark:bg-gray-950/70">
          <div className="container mx-auto flex h-16 items-center justify-between gap-4 px-4">
            <Link
              href={`/${locale.slug}/`}
              className="text-lg font-bold tracking-tight"
            >
              <span className="bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">
                {config.site.title}
              </span>
            </Link>
            <LanguageSwitcher currentSlug={locale.slug} label={dict.common.language} />
          </div>
        </header>

        <div className="relative z-10 flex-1">{children}</div>

        <footer className="relative z-10 border-t border-gray-200/60 py-10 dark:border-gray-800/60">
          <div className="container mx-auto flex flex-col items-center gap-3 px-4 text-center text-sm text-gray-500 dark:text-gray-400">
            <p>
              {dict.footer.contact}:{" "}
              <a
                href={`mailto:${config.contact.email}`}
                className="font-medium transition-colors hover:text-orange-500"
              >
                {config.contact.email}
              </a>
            </p>
            <p>
              © {new Date().getFullYear()} {config.site.title}. {dict.footer.rights}
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
