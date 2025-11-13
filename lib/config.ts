import configData from '../config.json';

export type PrivacyPolicyConfig = {
  lastUpdated: string;
  informationWeCollect: {
    title: string;
    content: string;
    items: string[];
  };
  howWeUseInformation: {
    title: string;
    content: string;
    items: string[];
  };
  informationSharing: {
    title: string;
    content: string;
    items: string[];
  };
  thirdPartyServices: {
    title: string;
    content: string;
    items: string[];
  };
  dataSecurity: {
    title: string;
    content: string;
  };
  yourRights: {
    title: string;
    content: string;
    items: string[];
  };
  contactUs: {
    title: string;
    content: string;
    email: string;
    address: string;
  };
  changesToPrivacyPolicy: {
    title: string;
    content: string;
  };
};

export type AppConfig = {
  id: string;
  appstoreId: string;
  name: string;
  description: string;
  details: string;
  icon: string;
  screenshots: string[];
  download: {
    appStore?: string;
    googlePlay?: string;
    apk?: string;
  };
  features: {
    title: string;
    description: string;
    icon: string;
  }[];
  privacyPolicy: PrivacyPolicyConfig;
};

export type SiteConfig = {
  site: {
    title: string;
    description: string;
  };
  apps: AppConfig[];
  contact: {
    email: string;
    address: string;
  };
};

const config: SiteConfig = configData as SiteConfig;

export default config;