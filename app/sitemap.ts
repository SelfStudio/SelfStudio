import { MetadataRoute } from 'next';
import config from '@/lib/config';
import { locales } from '@/lib/locales';
import { languageAlternates } from '@/lib/alternates';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = config.site.url || 'https://selfstudio.fun';

  // 每类页面的路径（不含 locale 前缀）及其权重
  const pages: { path: string; changeFrequency: 'weekly' | 'monthly'; priority: number }[] = [
    { path: '/', changeFrequency: 'weekly', priority: 1 },
  ];

  config.apps.forEach((app) => {
    pages.push({ path: `/${app.id}/`, changeFrequency: 'weekly', priority: 0.8 });
    pages.push({ path: `/${app.id}/privacy/`, changeFrequency: 'monthly', priority: 0.5 });
  });

  pages.push({ path: '/tryjoy/privacy/', changeFrequency: 'monthly', priority: 0.5 });

  const routes: MetadataRoute.Sitemap = [];
  const lastModified = new Date();

  for (const page of pages) {
    const alternates = Object.fromEntries(
      Object.entries(languageAlternates(page.path)).map(([lang, path]) => [
        lang,
        `${baseUrl}${path}`,
      ]),
    );

    for (const locale of locales) {
      routes.push({
        url: `${baseUrl}/${locale.slug}${page.path}`,
        lastModified,
        changeFrequency: page.changeFrequency,
        priority: page.priority,
        alternates: {
          languages: alternates,
        },
      });
    }
  }

  return routes;
}
