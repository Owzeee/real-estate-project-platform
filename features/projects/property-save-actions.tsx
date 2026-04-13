"use client";

import {
  type StoredProperty,
  useProjectsStore,
} from "@/features/projects/client-store";
import { getTranslations, type SiteLocale } from "@/lib/i18n";

export function PropertySaveActions({
  property,
  locale = "fr",
}: {
  property: StoredProperty;
  locale?: SiteLocale;
}) {
  const t = getTranslations(locale);
  const { isFavoriteProperty, toggleFavoriteProperty } = useProjectsStore();
  const favorite = isFavoriteProperty(property.id);

  return (
    <button
      type="button"
      onClick={() => toggleFavoriteProperty(property)}
      className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
        favorite
          ? "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
          : "border border-[var(--border)] bg-white text-stone-900"
      }`}
    >
      <span aria-hidden="true">{favorite ? "♥" : "♡"}</span>
      <span>{favorite ? t.actions.inWishlist : t.actions.addToWishlist}</span>
    </button>
  );
}
