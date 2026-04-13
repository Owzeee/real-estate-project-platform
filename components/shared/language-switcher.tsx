"use client";

import { SITE_LANG_COOKIE, getLocaleLabel, type SiteLocale } from "@/lib/i18n";

type LanguageSwitcherProps = {
  locale: SiteLocale;
};

function persistLocale(nextLocale: SiteLocale) {
  window.document.cookie = `${SITE_LANG_COOKIE}=${nextLocale}; path=/; max-age=31536000; samesite=lax`;
  window.location.reload();
}

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  function setLocale(nextLocale: SiteLocale) {
    if (nextLocale === locale) {
      return;
    }

    persistLocale(nextLocale);
  }

  return (
    <div className="surface-soft inline-flex rounded-full p-1.5">
      {(["fr", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          className={`rounded-full px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] ${
            locale === item
              ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
              : "text-stone-700 hover:bg-[rgba(141,104,71,0.08)]"
          }`}
          aria-pressed={locale === item}
        >
          {getLocaleLabel(item)}
        </button>
      ))}
    </div>
  );
}
