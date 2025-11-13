import { MetadataRoute } from 'next';
import config from '@/lib/config';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = config.site.url || 'https://selfstudio.fun';

  const routes: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
  ];

  // 为每个应用添加页面到站点地图
  config.apps.forEach(app => {
    routes.push({
      url: `${baseUrl}/${app.id}`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    });

    routes.push({
      url: `${baseUrl}/${app.id}/privacy`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    });
  });

  return routes;
}