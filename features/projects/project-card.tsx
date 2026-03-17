import Link from "next/link";

import type { ProjectSummary } from "@/features/projects/types";
import { formatPriceRange } from "@/lib/utils/format-price";

type ProjectCardProps = {
  project: ProjectSummary;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="overflow-hidden rounded-[1.75rem] border border-stone-900/10 bg-white shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
      <div
        className="h-56 bg-cover bg-center"
        style={{
          backgroundImage: project.heroMediaUrl
            ? `linear-gradient(rgba(28,25,23,0.12),rgba(28,25,23,0.28)), url(${project.heroMediaUrl})`
            : "linear-gradient(135deg, #d6c7ad, #8f7156)",
        }}
      />
      <div className="p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-950">
            {project.projectType.replace("_", " ")}
          </span>
          <span className="text-xs font-medium uppercase tracking-[0.16em] text-stone-500">
            {project.completionStage.replace("_", " ")}
          </span>
        </div>
        <h3 className="mt-4 text-2xl font-semibold tracking-tight text-stone-950">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-stone-500">{project.developerName}</p>
        <p className="mt-4 line-clamp-3 text-sm leading-6 text-stone-700">
          {project.description}
        </p>
        <div className="mt-6 flex items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
              Location
            </p>
            <p className="mt-1 text-sm font-medium text-stone-800">
              {project.location}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs uppercase tracking-[0.16em] text-stone-500">
              Price
            </p>
            <p className="mt-1 text-sm font-semibold text-stone-950">
              {formatPriceRange(
                project.minPrice,
                project.maxPrice,
                project.currencyCode,
              )}
            </p>
          </div>
        </div>
        <div className="mt-6 flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="text-sm font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
          >
            View project
          </Link>
          {project.isFeatured ? (
            <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-100">
              Featured
            </span>
          ) : null}
        </div>
      </div>
    </article>
  );
}
