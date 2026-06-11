# Deploy Next.js to GitHub Pages

This is a Next.js template which can be deployed to GitHub Pages as a static site.

## Internationalization (i18n)

URLs are clean (no locale prefix: `/`, `/menubro/`, …). Language is resolved client-side — saved preference (`localStorage["selfstudio-locale"]`) first, then the browser language, falling back to English — and can be switched manually via the header language picker without changing the URL. All 39 App Store locales are supported.

- `lib/locales.ts` — the locale registry (slug, BCP 47 tag, native name, text direction).
- `locales/*.json` — UI string dictionaries, one per language. Regional variants (e.g. `en-au`/`en-gb`) share one dictionary via the `dictionary` field in the registry.
- `lib/i18n.ts` — dictionary lookup plus per-app content overrides.
- `components/I18nProvider.tsx` — client-side locale detection/switching; updates `<html lang dir>`.
- `config.json` → `apps[].localizations` — optional translated marketing copy per app, keyed by dictionary id (e.g. `"zh-hans"`). Anything missing falls back to the English fields. Chinese (Simplified/Traditional) is provided as an example; add more languages the same way.
- `app/not-found.tsx` — also handles legacy `/{locale}/…` links by stripping the prefix and redirecting to the clean path.

The static HTML is rendered in English (good for crawlers and link previews); the client swaps strings to the visitor's language after hydration.

To add a UI string: add it to every file in `locales/` (the `Dictionary` type is inferred from `locales/en.json`, so TypeScript will flag missing keys at the use site).

## Deploying to GitHub Pages

1.  Create a new public GitHub repository
2.  Push the starter code to the `main` branch
3.  On GitHub, go to **Settings** > **Pages** > **Source**, and choose **GitHub Actions** as the source
4.  Make a commit and push it to see the changes on GitHub Pages

Congratulations! You should have a URL like:

```bash
https://<github-user-name>.github.io/<github-project-name>/
```

For more information, see our [deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying/static-exports).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!
