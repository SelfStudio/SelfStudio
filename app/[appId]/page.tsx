import { Metadata } from "next";
import config from "@/lib/config";
import { generateSoftwareApplicationStructuredData } from "@/lib/structuredData";
import AppContent from "@/components/AppContent";

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
      title: "App Not Found",
    };
  }

  const description = app.details || app.description;
  const image = app.screenshots[0] || app.icon;

  return {
    title: app.name,
    description,
    keywords: ["app", "mobile", "application", app.name, "download", "software"],
    alternates: {
      canonical: `/${app.id}/`,
    },
    openGraph: {
      title: `${app.name} - ${config.site.title}`,
      description,
      type: "website",
      url: `${config.site.url || "https://selfstudio.fun"}/${app.id}/`,
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
  const app = config.apps.find((app) => app.id === params.appId)!;
  const structuredData = generateSoftwareApplicationStructuredData(app);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <AppContent appId={app.id} />
    </>
  );
}
