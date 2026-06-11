import { Metadata } from "next";
import fs from "fs";
import path from "path";
import { getLocale } from "@/lib/locales";
import { languageAlternates } from "@/lib/alternates";

type Props = {
  params: {
    locale: string;
  };
};

export function generateMetadata({ params }: Props): Metadata {
  const locale = getLocale(params.locale)!;

  return {
    title: "TRYJOY 隐私政策",
    description: "TRYJOY 隐私政策",
    alternates: {
      canonical: `/${locale.slug}/tryjoy/privacy/`,
      languages: languageAlternates("/tryjoy/privacy/"),
    },
  };
}

export default function PrivacyPolicy() {
  const filePath = path.join(process.cwd(), "public", "TRYJOY隐私政策.html");
  const htmlContent = fs.readFileSync(filePath, "utf-8");

  return (
    <div
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}
