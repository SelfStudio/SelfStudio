import type { Metadata } from "next";
import { Newsreader, Hanken_Grotesk, Roboto_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "../globals.css";
import config from "@/lib/config";
import { getLocale, locales } from "@/lib/locales";
import { getDictionary } from "@/lib/i18n";

const newsreader = Newsreader({
  subsets: ["latin"],
  variable: "--font-newsreader",
  display: "swap",
  adjustFontFallback: false,
});
const hanken = Hanken_Grotesk({
  subsets: ["latin"],
  variable: "--font-hanken",
  display: "swap",
});
const geistMono = Roboto_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  display: "swap",
});

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

// Set the theme before first paint to avoid a flash of the wrong palette.
const themeScript = `(function(){try{var t=localStorage.getItem('ss_theme');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function LocaleLayout({ children, params }: Props) {
  const locale = getLocale(params.locale)!;

  return (
    <ViewTransitions>
      <html
        lang={locale.lang}
        dir={locale.dir}
        suppressHydrationWarning
        className={`${newsreader.variable} ${hanken.variable} ${geistMono.variable}`}
      >
        <body className="font-sans antialiased">
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
          {children}
        </body>
      </html>
    </ViewTransitions>
  );
}
