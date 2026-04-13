"use client";

import {
  type StoredProperty,
  useProjectsStore,
} from "@/features/projects/client-store";
import { getTranslations, type SiteLocale } from "@/lib/i18n";

export function PropertyCompareActions({
  property,
  locale = "fr",
}: {
  property: StoredProperty;
  locale?: SiteLocale;
}) {
  const t = getTranslations(locale);
  const { isPropertyCompared, togglePropertyCompare } = useProjectsStore();
  const compared = isPropertyCompared(property.id);

  return (
    <button
      type="button"
      onClick={() => togglePropertyCompare(property)}
      className={`rounded-full px-4 py-2 text-sm font-semibold ${
        compared
          ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
          : "border border-[var(--border)] bg-white text-stone-900"
      }`}
    >
      {compared ? t.actions.addedToCompare : t.actions.compareProperty}
    </button>
  );
}
