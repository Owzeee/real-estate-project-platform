"use client";

import {
  type StoredProperty,
  useProjectsStore,
} from "@/features/projects/client-store";

export function PropertySaveActions({ property }: { property: StoredProperty }) {
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
      <span>{favorite ? "In wishlist" : "Add to wishlist"}</span>
    </button>
  );
}
