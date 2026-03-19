import Link from "next/link";

import type { ProjectSummary } from "@/features/projects/types";
import { formatPriceRange } from "@/lib/utils/format-price";

type ProjectCardProps = {
  project: ProjectSummary;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="group h-full overflow-hidden rounded-[1.6rem] border border-[rgba(141,104,71,0.12)] bg-[var(--card)] shadow-[0_20px_60px_rgba(32,28,25,0.07)] transition duration-300 hover:-translate-y-1 hover:border-[rgba(141,104,71,0.3)] hover:shadow-[0_28px_80px_rgba(32,28,25,0.12)]">
      <div
        className="relative h-60 bg-cover bg-center"
        style={{
          backgroundImage: project.heroMediaUrl
            ? `linear-gradient(rgba(23,20,18,0.12),rgba(23,20,18,0.28)), url(${project.heroMediaUrl})`
            : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
        }}
      >
        <div className="absolute right-4 top-4 rounded-full bg-[rgba(141,104,71,0.88)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-foreground)]">
          {project.completionStage.replace("_", " ")}
        </div>
      </div>

      <div className="flex h-[calc(100%-15rem)] flex-col p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-[rgba(198,154,91,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {project.projectType.replace("_", " ")}
          </span>
          {project.isFeatured ? (
            <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--secondary-foreground)]">
              Featured
            </span>
          ) : null}
        </div>

        <h3 className="mt-5 font-display text-3xl font-bold tracking-tight text-stone-950 transition-colors group-hover:text-[var(--primary)]">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{project.developerName}</p>
        <p className="mt-4 line-clamp-3 text-sm leading-7 text-stone-700">
          {project.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 border-t border-[var(--border)] pt-5">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Location
            </p>
            <p className="mt-2 text-sm font-medium text-stone-900">{project.location}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Price Range
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
              {formatPriceRange(
                project.minPrice,
                project.maxPrice,
                project.currencyCode,
              )}
            </p>
          </div>
        </div>

        <div className="mt-6 pt-2">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center rounded-full bg-[var(--primary)] px-5 py-3 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]"
          >
            View project
          </Link>
        </div>
      </div>
    </article>
  );
}
