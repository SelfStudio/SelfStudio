import { Metadata } from "next";
import config from "@/lib/config";
import { defaultLocale } from "@/lib/locales";
import { getDictionary } from "@/lib/i18n";
import { generateWebSiteStructuredData } from "@/lib/structuredData";
import HomeContent from "@/components/HomeContent";

const dict = getDictionary(defaultLocale);
const homeOgImage =
  config.apps[0]?.screenshots[0] || config.apps[0]?.icon || "/images/menubro/hero-image.png";

export const metadata: Metadata = {
  title: {
    absolute: config.site.title,
  },
  description: dict.site.description,
  keywords: ["app", "mobile", "application", "software", "macOS", "iOS", "Android", "SelfStudio"],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: config.site.title,
    description: dict.site.description,
    type: "website",
    url: config.site.url || "https://selfstudio.fun",
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

export default function Home() {
  const structuredData = generateWebSiteStructuredData(dict.site.description);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <HomeContent />
    </>
  );
}
