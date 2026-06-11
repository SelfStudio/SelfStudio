import config, { AppConfig } from '@/lib/config';

function absoluteUrl(path: string) {
  const baseUrl = config.site.url || 'https://selfstudio.fun';
  return new URL(path, baseUrl).toString();
}

export function generateWebSiteStructuredData(description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.site.title,
    description,
    url: config.site.url || 'https://selfstudio.fun',
    publisher: {
      '@type': 'Organization',
      name: 'SelfStudio',
      url: config.site.url || 'https://selfstudio.fun',
    },
  };
}

export function generateSoftwareApplicationStructuredData(app: AppConfig) {
  const appUrl = absoluteUrl(`/${app.id}/`);
  const image = absoluteUrl(app.screenshots[0] || app.icon);
  const downloadUrl = app.download.appStore || app.download.googlePlay || app.download.apk;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.details || app.description,
    url: appUrl,
    image,
    ...(downloadUrl ? {
      offers: {
        '@type': 'Offer',
        url: downloadUrl,
      },
    } : {}),
  };
}
