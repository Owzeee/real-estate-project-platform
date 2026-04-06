"use client";

import { useProjectsStore, toStoredProject } from "@/features/projects/client-store";
import type { ProjectSummary } from "@/features/projects/types";

export function ProjectSaveActions({ project }: { project: ProjectSummary }) {
  const { isFavorite, isProjectCompared, toggleFavorite, toggleProjectCompare } =
    useProjectsStore();
  const favorite = isFavorite(project.id);
  const compared = isProjectCompared(project.id);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => toggleFavorite(toStoredProject(project))}
        className={`rounded-full px-4 py-2 text-sm font-semibold ${
          favorite
            ? "bg-[var(--secondary)] text-[var(--secondary-foreground)]"
            : "border border-[var(--border)] bg-white text-stone-900"
        }`}
      >
        {favorite ? "Saved" : "Save"}
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
        {compared ? "Added to compare" : "Compare"}
      </button>
    </div>
  );
}
