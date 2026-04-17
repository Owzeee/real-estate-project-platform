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
    <div className="inline-flex border border-[var(--border)] bg-white">
      {(["fr", "en"] as const).map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => setLocale(item)}
          className={`px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] underline decoration-2 underline-offset-[0.55rem] ${
            locale === item
              ? "bg-[rgba(141,104,71,0.06)] text-stone-950 decoration-[var(--primary)]"
              : "text-stone-700 decoration-[rgba(141,104,71,0.35)] hover:bg-[rgba(141,104,71,0.04)]"
          }`}
          aria-pressed={locale === item}
        >
          {getLocaleLabel(item)}
        </button>
      ))}
    </div>
  );
}
