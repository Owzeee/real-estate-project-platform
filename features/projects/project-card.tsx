import Link from "next/link";

import { CompanyLogo } from "@/components/shared/company-logo";
import { ProjectSaveActions } from "@/features/projects/project-save-actions";
import { formatCompletionStageLabel, formatProjectTypeLabel } from "@/features/projects/presentation";
import type { ProjectSummary } from "@/features/projects/types";
import { getTranslations, type SiteLocale } from "@/lib/i18n";
import { formatProjectSummaryInventoryPricing } from "@/lib/utils/format-price";

type ProjectCardProps = {
  project: ProjectSummary;
  locale?: SiteLocale;
};

export function ProjectCard({ project, locale = "fr" }: ProjectCardProps) {
  const t = getTranslations(locale);

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
        <div className="absolute right-4 top-4 flex flex-col items-end gap-2">
          <div className="rounded-full bg-[rgba(141,104,71,0.88)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-[var(--primary-foreground)]">
            {formatCompletionStageLabel(project.completionStage, locale)}
          </div>
          {project.hasVirtualTour ? (
            <div className="rounded-full bg-[rgba(32,28,25,0.82)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
              {t.projectCard.virtualTour}
            </div>
          ) : null}
        </div>
        <div className="absolute bottom-4 left-4 rounded-full bg-white/85 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-900">
          {project.location}
        </div>
      </div>

      <div className="flex flex-1 flex-col p-6">
        <div className="flex items-center justify-between gap-4">
          <span className="rounded-full bg-[rgba(198,154,91,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
            {formatProjectTypeLabel(project.projectType, locale)}
          </span>
          {project.isFeatured ? (
            <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--secondary-foreground)]">
              {t.projectCard.featured}
            </span>
          ) : null}
        </div>

        <h3 className="mt-5 font-display text-2xl font-bold tracking-tight text-stone-950 transition-colors group-hover:text-[var(--primary)] sm:text-3xl">
          {project.title}
        </h3>
        <div className="mt-3 flex items-center gap-3">
          <CompanyLogo
            companyName={project.developerName}
            logoUrl={project.developerLogoUrl}
            className="h-10 w-10"
            imageClassName="rounded-xl border border-[var(--border)] object-cover"
            fallbackClassName="rounded-xl border border-[var(--border)] bg-[linear-gradient(145deg,var(--primary),color-mix(in_srgb,var(--primary)_72%,black))] text-xs font-bold text-[var(--primary-foreground)]"
          />
          <p className="text-sm text-[var(--muted-foreground)]">{project.developerName}</p>
        </div>
        <p className="font-copy mt-4 line-clamp-3 text-[15px] leading-7 text-stone-700">
          {project.description}
        </p>

        <div className="mt-6 grid gap-3 rounded-[1.35rem] bg-[rgba(141,104,71,0.05)] p-3 sm:grid-cols-2">
          <div className="rounded-[1rem] bg-white/72 px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {t.projectCard.location}
            </p>
            <p className="mt-2 text-sm font-medium leading-6 text-stone-900">
              {project.location}
            </p>
          </div>
          <div className="rounded-[1rem] bg-white/72 px-4 py-4">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
              {project.offerType === "rent" ? t.projectCard.rent : t.projectCard.pricing}
            </p>
            <p className="mt-2 text-base font-semibold leading-6 text-[var(--primary)]">
              {formatProjectSummaryInventoryPricing({
                offerType: project.offerType,
                priceMode: project.priceMode,
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
              {t.projectCard.marketplaceListing}
            </p>
            <ProjectSaveActions project={project} locale={locale} />
          </div>
          <Link
            href={`/projects/${project.slug}`}
            className="primary-button mt-4 w-full text-sm"
          >
            {t.projectCard.viewProject}
          </Link>
        </div>
      </div>
    </article>
  );
}
