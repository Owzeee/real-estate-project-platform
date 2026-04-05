import Link from "next/link";

import { ProjectSaveActions } from "@/features/projects/project-save-actions";
import type { ProjectSummary } from "@/features/projects/types";
import { formatProjectPricing } from "@/lib/utils/format-price";

type ProjectCardProps = {
  project: ProjectSummary;
};

export function ProjectCard({ project }: ProjectCardProps) {
  return (
    <article className="surface-panel group flex h-full flex-col overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:border-[rgba(141,104,71,0.3)] hover:shadow-[0_28px_80px_rgba(32,28,25,0.12)]">
      <div
        className="relative h-60 bg-cover bg-center"
        style={{
          backgroundImage: project.heroMediaUrl
            ? `linear-gradient(rgba(23,20,18,0.12),rgba(23,20,18,0.28)), url(${project.heroMediaUrl})`
            : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
        }}
      >
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[rgba(23,20,18,0.52)] to-transparent" />
        <div className="absolute right-4 top-4 rounded-full bg-[rgba(141,104,71,0.88)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-foreground)]">
          {project.completionStage.replace("_", " ")}
        </div>
        <div className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-900">
          {project.location}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
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

        <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-stone-950 transition-colors group-hover:text-[var(--primary)] sm:text-3xl">
          {project.title}
        </h3>
        <p className="mt-2 text-sm text-[var(--muted-foreground)]">{project.developerName}</p>
        <p className="font-copy mt-4 line-clamp-3 text-[15px] leading-7 text-stone-700">
          {project.description}
        </p>

        <div className="mt-6 grid grid-cols-2 gap-4 rounded-[1.2rem] bg-[rgba(141,104,71,0.05)] p-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              Location
            </p>
            <p className="mt-2 text-sm font-medium text-stone-900">{project.location}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
              {project.offerType === "rent" ? "Rent" : "Pricing"}
            </p>
            <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
              {formatProjectPricing({
                offerType: project.offerType,
                priceMode: project.priceMode,
                fixedPrice: project.minPrice,
                minPrice: project.minPrice,
                maxPrice: project.maxPrice,
                rentPrice: project.rentPrice,
                currencyCode: project.currencyCode,
              })}
            </p>
          </div>
        </div>

        <div className="mt-auto pt-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              Marketplace listing
            </p>
            <ProjectSaveActions project={project} />
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="primary-button mt-4 w-full text-sm"
          >
            View project
          </Link>
        </div>
      </div>
    </article>
  );
}
