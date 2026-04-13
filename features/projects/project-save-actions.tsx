"use client";

import { useProjectsStore, toStoredProject } from "@/features/projects/client-store";
import type { ProjectSummary } from "@/features/projects/types";
import { getTranslations, type SiteLocale } from "@/lib/i18n";

export function ProjectSaveActions({
  project,
  locale = "fr",
}: {
  project: ProjectSummary;
  locale?: SiteLocale;
}) {
  const t = getTranslations(locale);
  const { isFavorite, isProjectCompared, toggleFavorite, toggleProjectCompare } =
    useProjectsStore();
  const favorite = isFavorite(project.id);
  const compared = isProjectCompared(project.id);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => toggleFavorite(toStoredProject(project))}
        className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
          favorite
            ? "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
            : "border border-[var(--border)] bg-white text-stone-900"
        }`}
      >
        <span aria-hidden="true">{favorite ? "♥" : "♡"}</span>
        <span>{favorite ? t.actions.inWishlist : t.actions.addToWishlist}</span>
      </button>
      <button
        type="button"
        onClick={() => toggleProjectCompare(toStoredProject(project))}
        className={`rounded-full px-4 py-2 text-sm font-semibold ${
          compared
            ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
            : "border border-[var(--border)] bg-white text-stone-900"
        }`}
      >
        {compared ? t.actions.addedToCompare : t.actions.compare}
      </button>
    </div>
  );
}
