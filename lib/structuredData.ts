import config, { AppConfig } from '@/lib/config';
import type { LocaleInfo } from '@/lib/locales';

function absoluteUrl(path: string) {
  const baseUrl = config.site.url || 'https://selfstudio.fun';
  return new URL(path, baseUrl).toString();
}

export function generateWebSiteStructuredData(locale: LocaleInfo, description: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.site.title,
    description,
    url: absoluteUrl(`/${locale.slug}/`),
    inLanguage: locale.lang,
    publisher: {
      '@type': 'Organization',
      name: 'SelfStudio',
      url: config.site.url || 'https://selfstudio.fun',
    },
  };
}

export function generateSoftwareApplicationStructuredData(
  app: AppConfig,
  locale: LocaleInfo,
  description: string,
) {
  const appUrl = absoluteUrl(`/${locale.slug}/${app.id}/`);
  const image = absoluteUrl(app.screenshots[0] || app.icon);
  const downloadUrl = app.download.appStore || app.download.googlePlay || app.download.apk;

  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description,
    url: appUrl,
    image,
    inLanguage: locale.lang,
    ...(downloadUrl ? {
      offers: {
        '@type': 'Offer',
        url: downloadUrl,
      },
    } : {}),
  };
}
