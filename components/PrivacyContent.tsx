"use client";

import { Link } from "next-view-transitions";
import config from "@/lib/config";
import { useI18n } from "./I18nProvider";

export default function PrivacyContent({ appId }: { appId: string }) {
  const { dict } = useI18n();
  const app = config.apps.find((a) => a.id === appId)!;
  const privacyPolicy = app.privacyPolicy;

  return (
    <main className="container mx-auto px-4 py-16">
      <div className="mx-auto max-w-3xl">
        <nav className="mb-10 text-sm">
          <Link
            href={`/${app.id}/`}
            className="inline-flex items-center gap-1.5 text-gray-500 transition-colors hover:text-terracotta dark:text-gray-400"
          >
            <span aria-hidden className="rtl:rotate-180">←</span>
            {dict.privacy.back}
          </Link>
        </nav>

        <div className="mb-10 flex items-center gap-4">
          <img
            src={app.icon}
            alt=""
            className="h-14 w-14 rounded-2xl object-contain shadow-md"
            style={{
              viewTransitionName: `app-icon-${app.id}`,
              viewTransitionClass: "ss-app-icon",
            } as React.CSSProperties}
          />
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight md:text-4xl">
              {app.name} {dict.privacy.title}
            </h1>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {dict.privacy.lastUpdated}: {privacyPolicy.lastUpdated}
            </p>
          </div>
        </div>

        <div className="rounded-3xl border border-hairline bg-paper-2 p-8 leading-relaxed shadow-sm md:p-10">
          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.informationWeCollect.title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{privacyPolicy.informationWeCollect.content}</p>
          <ul className="mb-8 list-disc ps-6 text-gray-600 dark:text-gray-300">
            {privacyPolicy.informationWeCollect.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.howWeUseInformation.title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{privacyPolicy.howWeUseInformation.content}</p>
          <ul className="mb-8 list-disc ps-6 text-gray-600 dark:text-gray-300">
            {privacyPolicy.howWeUseInformation.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.informationSharing.title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{privacyPolicy.informationSharing.content}</p>
          <ul className="mb-8 list-disc ps-6 text-gray-600 dark:text-gray-300">
            {privacyPolicy.informationSharing.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.thirdPartyServices.title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{privacyPolicy.thirdPartyServices.content}</p>
          <ul className="mb-8 list-disc ps-6 text-gray-600 dark:text-gray-300">
            {privacyPolicy.thirdPartyServices.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.dataSecurity.title}</h2>
          <p className="mb-8 text-gray-600 dark:text-gray-300">{privacyPolicy.dataSecurity.content}</p>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.yourRights.title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{privacyPolicy.yourRights.content}</p>
          <ul className="mb-4 list-disc ps-6 text-gray-600 dark:text-gray-300">
            {privacyPolicy.yourRights.items.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
          <p className="mb-8 text-gray-600 dark:text-gray-300">{dict.privacy.exerciseRights}</p>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.contactUs.title}</h2>
          <p className="mb-4 text-gray-600 dark:text-gray-300">{privacyPolicy.contactUs.content}</p>
          <p className="mb-1 text-gray-600 dark:text-gray-300">
            {dict.privacy.emailLabel}:{" "}
            <a
              href={`mailto:${privacyPolicy.contactUs.email}`}
              className="text-terracotta hover:underline"
            >
              {privacyPolicy.contactUs.email}
            </a>
          </p>
          <p className="mb-8 text-gray-600 dark:text-gray-300">
            {dict.privacy.addressLabel}: {privacyPolicy.contactUs.address}
          </p>

          <h2 className="mb-4 text-xl font-semibold">{privacyPolicy.changesToPrivacyPolicy.title}</h2>
          <p className="text-gray-600 dark:text-gray-300">{privacyPolicy.changesToPrivacyPolicy.content}</p>
        </div>
      </div>
    </main>
  );
}
