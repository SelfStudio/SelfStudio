import type { Metadata } from "next";
import { Newsreader, Hanken_Grotesk, Roboto_Mono } from "next/font/google";
import { ViewTransitions } from "next-view-transitions";
import "./globals.css";
import config from "@/lib/config";
import { defaultLocale } from "@/lib/locales";
import { getDictionary } from "@/lib/i18n";
import GearMovement from "@/components/GearMovement";
import { I18nProvider } from "@/components/I18nProvider";

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
const dict = getDictionary(defaultLocale);

export const metadata: Metadata = {
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

// Set the theme before first paint to avoid a flash of the wrong palette.
const themeScript = `(function(){try{var t=localStorage.getItem('ss_theme');if(t!=='light'&&t!=='dark'){t='dark';}document.documentElement.dataset.theme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransitions>
      <html
        lang={defaultLocale.lang}
        dir={defaultLocale.dir}
        suppressHydrationWarning
        className={`${newsreader.variable} ${hanken.variable} ${geistMono.variable}`}
      >
        <body className="font-sans antialiased">
          <script dangerouslySetInnerHTML={{ __html: themeScript }} />
          <I18nProvider>
            {/* 三维齿轮背景放在布局层：子页面切换时不会重新挂载 WebGL 场景 */}
            <GearMovement />
            {/* 内容层独立命名：其过渡组绘制在齿轮层之上，滑动动画作用于此 */}
            <div className="relative z-10 [view-transition-name:ss-content]">{children}</div>
          </I18nProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
