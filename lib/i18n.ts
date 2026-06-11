import type { AppConfig } from "./config";
import type { LocaleInfo } from "./locales";

import ar from "@/locales/ar.json";
import ca from "@/locales/ca.json";
import cs from "@/locales/cs.json";
import da from "@/locales/da.json";
import de from "@/locales/de.json";
import el from "@/locales/el.json";
import en from "@/locales/en.json";
import es from "@/locales/es.json";
import fi from "@/locales/fi.json";
import fr from "@/locales/fr.json";
import he from "@/locales/he.json";
import hi from "@/locales/hi.json";
import hr from "@/locales/hr.json";
import hu from "@/locales/hu.json";
import id from "@/locales/id.json";
import it from "@/locales/it.json";
import ja from "@/locales/ja.json";
import ko from "@/locales/ko.json";
import ms from "@/locales/ms.json";
import nb from "@/locales/nb.json";
import nl from "@/locales/nl.json";
import pl from "@/locales/pl.json";
import ptBr from "@/locales/pt-br.json";
import ptPt from "@/locales/pt-pt.json";
import ro from "@/locales/ro.json";
import ru from "@/locales/ru.json";
import sk from "@/locales/sk.json";
import sv from "@/locales/sv.json";
import th from "@/locales/th.json";
import tr from "@/locales/tr.json";
import uk from "@/locales/uk.json";
import vi from "@/locales/vi.json";
import zhHans from "@/locales/zh-hans.json";
import zhHant from "@/locales/zh-hant.json";

export type Dictionary = typeof en;

const dictionaries: Record<string, Dictionary> = {
  ar,
  ca,
  cs,
  da,
  de,
  el,
  en,
  es,
  fi,
  fr,
  he,
  hi,
  hr,
  hu,
  id,
  it,
  ja,
  ko,
  ms,
  nb,
  nl,
  pl,
  "pt-br": ptBr,
  "pt-pt": ptPt,
  ro,
  ru,
  sk,
  sv,
  th,
  tr,
  uk,
  vi,
  "zh-hans": zhHans,
  "zh-hant": zhHant,
};

export function getDictionary(locale: LocaleInfo): Dictionary {
  return dictionaries[locale.dictionary] ?? en;
}

export type LocalizedAppContent = {
  description: string;
  details: string;
  features: AppConfig["features"];
};

// Per-app marketing copy can be overridden per dictionary key via the optional
// `localizations` map in config.json; anything missing falls back to the
// default (English) fields.
export function getLocalizedAppContent(app: AppConfig, locale: LocaleInfo): LocalizedAppContent {
  const localized = app.localizations?.[locale.dictionary];
  return {
    description: localized?.description ?? app.description,
    details: localized?.details ?? app.details,
    features:
      localized?.features && localized.features.length === app.features.length
        ? app.features.map((feature, i) => ({ ...feature, ...localized.features![i] }))
        : app.features,
  };
}
