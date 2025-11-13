import { Metadata } from "next";
import Link from "next/link";
import config, { AppConfig } from "@/lib/config";

type Props = {
  params: {
    appId: string;
  };
};

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
    title: `${app.name} Privacy Policy - ${config.site.title}`,
    description: `${app.name} Privacy Policy details how we collect, use, and protect your personal information.`,
    keywords: ["privacy", "policy", app.name, "data protection", "personal information"],
    openGraph: {
      title: `${app.name} Privacy Policy - ${config.site.title}`,
      description: `${app.name} Privacy Policy details how we collect, use, and protect your personal information.`,
      type: "article",
      url: `${config.site.url || 'https://selfstudio.fun'}/${app.id}/privacy`,
    },
    twitter: {
      card: "summary",
      title: `${app.name} Privacy Policy - ${config.site.title}`,
      description: `${app.name} Privacy Policy details how we collect, use, and protect your personal information.`,
    },
  };
}

export default function PrivacyPolicy({ params }: Props) {
  const app = config.apps.find((app) => app.id === params.appId) as AppConfig;
  
  if (!app) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Privacy Policy Not Found</h1>
          <Link href="/" className="text-orange-500 hover:text-orange-600">
            🏠
          </Link>
        </div>
      </div>
    );
  }

  const privacyPolicy = app.privacyPolicy;

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-bold mb-8">{app.name} Privacy Policy</h1>
          
          <div className="prose prose-lg">
            <p className="mb-6">Last updated: {privacyPolicy.lastUpdated}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{privacyPolicy.informationWeCollect.title}</h2>
            <p className="mb-6">{privacyPolicy.informationWeCollect.content}</p>
            <ul className="list-disc pl-6 mb-6">
              {privacyPolicy.informationWeCollect.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{privacyPolicy.howWeUseInformation.title}</h2>
            <p className="mb-6">{privacyPolicy.howWeUseInformation.content}</p>
            <ul className="list-disc pl-6 mb-6">
              {privacyPolicy.howWeUseInformation.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{privacyPolicy.informationSharing.title}</h2>
            <p className="mb-6">{privacyPolicy.informationSharing.content}</p>
            <ul className="list-disc pl-6 mb-6">
              {privacyPolicy.informationSharing.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{privacyPolicy.thirdPartyServices.title}</h2>
            <p className="mb-6">{privacyPolicy.thirdPartyServices.content}</p>
            <ul className="list-disc pl-6 mb-6">
              {privacyPolicy.thirdPartyServices.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{privacyPolicy.dataSecurity.title}</h2>
            <p className="mb-6">{privacyPolicy.dataSecurity.content}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{privacyPolicy.yourRights.title}</h2>
            <p className="mb-6">{privacyPolicy.yourRights.content}</p>
            <ul className="list-disc pl-6 mb-6">
              {privacyPolicy.yourRights.items.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
            <p className="mb-6">To exercise the above rights, please contact us through the contact information below.</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{privacyPolicy.contactUs.title}</h2>
            <p className="mb-6">{privacyPolicy.contactUs.content}</p>
            <p className="mb-6">Email: {privacyPolicy.contactUs.email}</p>
            <p className="mb-6">Address: {privacyPolicy.contactUs.address}</p>
            
            <h2 className="text-2xl font-semibold mt-8 mb-4">{privacyPolicy.changesToPrivacyPolicy.title}</h2>
            <p className="mb-6">{privacyPolicy.changesToPrivacyPolicy.content}</p>
          </div>
        </div>
      </main>
      
      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <Link href={`/${app.id}`} className="text-gray-600 hover:text-orange-500">
            <center><img src={app.icon} width={32} height={32} alt={app.name} className="inline-block" /></center>
          </Link>
        </div>
      </footer>
    </div>
  );
}