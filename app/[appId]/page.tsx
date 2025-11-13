import { Metadata } from "next";
import Link from "next/link";
import config, { AppConfig } from "@/lib/config";
import AppStoreVersion from "./AppStoreVersion";
import ScreenshotCarousel from "./ScreenshotCarousel";

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
      title: "App Not Found",
    };
  }
  
  return {
    title: `${app.name} - ${config.site.title}`,
    description: app.description,
    keywords: ["app", "mobile", "application", app.name],
  };
}

export default function AppPage({ params }: Props) {
  const app = config.apps.find((app) => app.id === params.appId) as AppConfig;

  if (!app) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">App Not Found</h1>
          <Link href="/" className="text-orange-500 hover:text-orange-600">
            🏠
          </Link>
        </div>
      </div>
    );
  }

  // 检查是否有任何下载链接
  const hasDownloadLinks = app.download.appStore || app.download.googlePlay || app.download.apk;

  return (
    <div className="min-h-screen bg-white">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <nav className="mb-8 text-sm text-gray-600">
            <Link href="/" className="hover:text-orange-500">🏠</Link> 
          </nav>
          <div className="text-center mb-12">
            <div className="bg-gray-200 border-2 border-dashed rounded-xl w-24 h-24 mx-auto mb-6 flex items-center justify-center">
              <img src={app.icon} alt={app.name} className="w-12 h-12 object-contain" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{app.name}</h1>
            <p className="text-xl text-gray-600">{app.description}</p>
            <p className="text-xl text-gray-600">{app.details}</p>
            {/* 版本信息显示区域 */}
            {app.download.appStore && (
              <>
                <p className="version-info mt-4 text-gray-500">Loading version info...</p>
                <AppStoreVersion appId={app.appstoreId} />
              </>
            )}
          </div>

          {hasDownloadLinks && (
            <div className="mb-16 text-center">
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                {app.download.appStore && (
                  <a 
                    href={app.download.appStore} 
                    className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
                  >
                    App Store
                  </a>
                )}
                {app.download.googlePlay && (
                  <a 
                    href={app.download.googlePlay} 
                    className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
                  >
                    Google Play
                  </a>
                )}
                {app.download.apk && (
                  <a 
                    href={app.download.apk} 
                    className="px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors duration-300"
                  >
                    APK 
                  </a>
                )}
              </div>
            </div>
          )}

          <div className="mb-16">
            <h2 className="text-2xl font-semibold mb-8 text-center">Main Features</h2>
            <div className="space-y-6">
              {app.features.map((feature, index) => (
                <div key={index} className="flex items-start">
                  <div className="w-12 h-12 flex-shrink-0 mr-4" ><div className="feature-icon">{feature.icon}</div></div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{typeof feature === 'string' ? feature : feature.title}</h3>
                    {typeof feature !== 'string' && <p className="text-gray-600">{feature.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 使用轮播图组件替换原有的截图部分 */}
          <ScreenshotCarousel screenshots={app.screenshots} />

        </div>
      </main>

      <footer className="border-t border-gray-200 py-8">
        <div className="container mx-auto px-4 text-center">
          <Link href={`/${app.id}/privacy`} className="text-gray-600 hover:text-orange-500">
            Privacy Policy
          </Link>
        </div>
      </footer>
    </div>
  );
}