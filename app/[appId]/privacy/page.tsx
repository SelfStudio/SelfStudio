import { Metadata } from "next";
import config from "@/lib/config";
import PrivacyContent from "@/components/PrivacyContent";

type Props = {
  params: {
    appId: string;
  };
};

export const dynamicParams = false;

export async function generateStaticParams() {
  return config.apps.map((app) => ({
    appId: app.id,
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const app = config.apps.find((app) => app.id === params.appId);
  if (!app) {
    return {
      title: "Privacy Policy Not Found",
    };
  }

  return {
    title: `${app.name} Privacy Policy`,
    description: `${app.name} Privacy Policy details how we collect, use, and protect your personal information.`,
    keywords: ["privacy", "policy", app.name, "data protection", "personal information"],
    alternates: {
      canonical: `/${app.id}/privacy/`,
    },
    openGraph: {
      title: `${app.name} Privacy Policy - ${config.site.title}`,
      description: `${app.name} Privacy Policy details how we collect, use, and protect your personal information.`,
      type: "article",
      url: `${config.site.url || "https://selfstudio.fun"}/${app.id}/privacy/`,
    },
    twitter: {
      card: "summary",
      title: `${app.name} Privacy Policy - ${config.site.title}`,
      description: `${app.name} Privacy Policy details how we collect, use, and protect your personal information.`,
    },
  };
}

export default function PrivacyPolicy({ params }: Props) {
  return <PrivacyContent appId={params.appId} />;
}
