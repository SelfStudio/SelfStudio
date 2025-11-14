import Link from "next/link";
import { Metadata } from "next";
import config from "@/lib/config";
import { generateWebSiteStructuredData } from '@/lib/structuredData';

export const metadata: Metadata = {
  title: config.site.title,
  description: config.site.description,
  keywords: ["app", "mobile", "application", "software", "macOS", "iOS", "Android", "SelfStudio"],
  openGraph: {
    title: config.site.title,
    description: config.site.description,
    type: "website",
    url: config.site.url || 'https://selfstudio.fun',
    images: [
      {
        url: '/images/og-image.jpg', // 请替换为有效的JPG或PNG图片
        width: 1200,
        height: 630,
        alt: config.site.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: config.site.title,
    description: config.site.description,
  },
};

// 直接在服务端组件中获取Bing壁纸数据
async function fetchBingWallpaper() {
  try {
    // 添加超时设置
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5秒超时
    
    const response = await fetch(
      'https://www.bing.com/HPImageArchive.aspx?format=js&idx=0&n=1&mkt=en-US',
      { 
        next: { 
          revalidate: 60 * 60 // 1小时缓存
        },
        signal: controller.signal
      }
    );
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      console.error('Failed to fetch Bing wallpaper:', response.status, response.statusText);
      return null;
    }
    
    const data = await response.json();
    // 检查数据结构
    if (!data?.images?.length) {
      console.error('Invalid data structure from Bing API:', data);
      return null;
    }
    
    // 确保URL是完整的
    let imageUrl = data.images[0].url;
    if (imageUrl.startsWith('/')) {
      imageUrl = 'https://www.bing.com' + imageUrl;
    }
    
    // 调试输出
    console.log('Bing wallpaper data:', data);
    console.log('Bing wallpaper URL:', imageUrl);
    
    return {
      imageUrl,
      title: data.images[0].title,
      copyright: data.images[0].copyright
    };
  } catch (error: any) {
    console.error('Error fetching Bing wallpaper:', error.message);
    return {
      imageUrl: null,
      title: 'Default Background',
      copyright: ''
    };
  }
}

export default async function Home() {
  const wallpaperData = await fetchBingWallpaper();
  const structuredData = generateWebSiteStructuredData();
  
  // 调试输出
  console.log('Wallpaper data received:', wallpaperData);
  
  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      {/* 背景图片容器 */}
      {wallpaperData?.imageUrl ? (
        <div 
          className="fixed inset-0 bg-cover bg-center z-0" 
          style={{ 
            backgroundImage: `url("${wallpaperData.imageUrl}")`,
          }} 
        />
      ) : (
        // 默认背景色
        <div className="fixed inset-0 bg-gradient-to-br from-blue-400 to-purple-500 z-0" />
      )}
      
      {/* 增加虚化程度的遮罩层 */}
      <div className="fixed inset-0 backdrop-blur-xl bg-white/60 z-10"></div>
      <main className="container mx-auto px-4 py-16 relative z-20">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white drop-shadow-[0_0_10px_rgba(0,0,0,0.8)]">{config.site.title}</h1>
          <p className="text-xl text-white max-w-2xl mx-auto drop-shadow-[0_0_5px_rgba(0,0,0,0.8)]">
            {config.site.description}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {config.apps.map((app) => (
            <Link key={app.id} href={`/${app.id}`} className="block">
              <div className="bg-white/90 rounded-2xl p-8 border-2 border-transparent hover:border-orange-500 transition-all duration-300 shadow-lg hover:shadow-xl">
                <div className="bg-gray-200 border-2 border-dashed rounded-xl w-16 h-16 mx-auto mb-6 flex items-center justify-center">
                  <img src={app.icon} alt={app.name} className="rounded-xl object-contain" />
                </div>
                <h2 className="text-2xl font-semibold mb-3 text-center">{app.name}</h2>
                <p className="text-gray-600 text-center">{app.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
