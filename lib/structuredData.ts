import config from '@/lib/config';

export function generateWebSiteStructuredData() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.site.title,
    description: config.site.description,
    url: config.site.url || 'https://selfstudio.fun',
  };
}

export function generateSoftwareApplicationStructuredData(app: any) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: app.name,
    description: app.description,
    applicationCategory: 'UtilitiesApplication',
    operatingSystem: 'macOS',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.5', // 可以根据实际评分调整
      ratingCount: '100', // 可以根据实际评分数量调整
    },
  };
}