import type { Metadata } from "next";
import Link from "next/link";

import { InteractiveListingsMap } from "@/features/projects/interactive-listings-map";
import { ProjectCard } from "@/features/projects/project-card";
import { ProjectsPageAnalytics } from "@/features/projects/projects-page-analytics";
import { ProjectSaveActions } from "@/features/projects/project-save-actions";
import {
  formatCompletionStageLabel,
  formatProjectTypeLabel,
} from "@/features/projects/presentation";
import { getProjects } from "@/features/projects/queries";
import { getTranslations } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Projets Immobiliers à Abidjan et en Côte d'Ivoire",
  description:
    "Parcourez des programmes neufs, terrains, bureaux et projets immobiliers avec cartes, filtres et fiches détaillées pour Abidjan et la Côte d'Ivoire.",
  path: "/projects",
  keywords: [
    "projets immobiliers abidjan",
    "programme neuf abidjan",
    "terrain a vendre cote d'ivoire",
    "bureaux cote d'ivoire",
  ],
});

type ProjectsPageProps = {
  searchParams?: Promise<{
    q?: string;
    type?: string;
    stage?: string;
    location?: string;
    selected?: string;
    view?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const locale = await getCurrentLocale();
  const t = getTranslations(locale);
  const projects = await getProjects();
  const params = (await searchParams) ?? {};
  const query = params.q?.toLowerCase().trim() ?? "";
  const type = params.type?.trim() ?? "";
  const stage = params.stage?.trim() ?? "";
  const location = params.location?.toLowerCase().trim() ?? "";
  const selected = params.selected?.trim() ?? "";
  const currentView = params.view === "map" ? "map" : "list";

  const filteredProjects = projects.filter((project) => {
    const matchesQuery =
      !query ||
      project.title.toLowerCase().includes(query) ||
      project.description.toLowerCase().includes(query) ||
      project.developerName.toLowerCase().includes(query);

    const matchesType = !type || project.projectType === type;
    const matchesStage = !stage || project.completionStage === stage;
    const matchesLocation =
      !location || project.location.toLowerCase().includes(location);

    return matchesQuery && matchesType && matchesStage && matchesLocation;
  });

  const selectedProject =
    filteredProjects.find((project) => project.slug === selected) ??
    filteredProjects[0] ??
    null;

  const buildProjectsHref = (overrides: Record<string, string | null>) => {
    const search = new URLSearchParams();

    if (params.q) search.set("q", params.q);
    if (params.location) search.set("location", params.location);
    if (params.type) search.set("type", params.type);
    if (params.stage) search.set("stage", params.stage);
    if (selected) search.set("selected", selected);
    if (currentView) search.set("view", currentView);

    for (const [key, value] of Object.entries(overrides)) {
      if (!value) {
        search.delete(key);
      } else {
        search.set(key, value);
      }
    }

    const queryString = search.toString();
    return queryString ? `/projects?${queryString}` : "/projects";
  };

  const mapProjects = filteredProjects
    .filter((project) => project.latitude != null && project.longitude != null)
    .map((project) => ({
      id: project.id,
      title: project.title,
      subtitle: `${project.location} • ${project.developerName}`,
      href: buildProjectsHref({
        view: "map",
        selected: project.slug,
      }),
      latitude: project.latitude as number,
      longitude: project.longitude as number,
      accentLabel: project.isFeatured
        ? t.projectCard.featured
        : formatProjectTypeLabel(project.projectType, locale),
    }));

  return (
    <main className="page-shell min-h-screen bg-transparent">
      <ProjectsPageAnalytics
        query={query}
        type={type}
        stage={stage}
        location={location}
        selected={selected}
        currentView={currentView}
        resultCount={filteredProjects.length}
        mapResultCount={mapProjects.length}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                {
                  "@type": "ListItem",
                  position: 1,
                  name: "Accueil",
                  item: "https://immoneuf.ci/",
                },
                {
                  "@type": "ListItem",
                  position: 2,
                  name: "Projets",
                  item: "https://immoneuf.ci/projects",
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: t.projects.title,
              url: "https://immoneuf.ci/projects",
              description: t.projects.description,
              mainEntity: {
                "@type": "ItemList",
                itemListElement: filteredProjects.slice(0, 12).map((project, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  url: `https://immoneuf.ci/projects/${project.slug}`,
                  name: project.title,
                })),
              },
            },
          ]),
        }}
      />
      <section className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.55)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow">{t.projects.eyebrow}</p>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-tight text-stone-950 sm:text-6xl">
            {t.projects.title}
          </h1>
          <p className="font-copy mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            {t.projects.description}
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <form className="surface-panel space-y-5 p-6">
              <input type="hidden" name="view" value={currentView} />
              {selectedProject ? (
                <input type="hidden" name="selected" value={selectedProject.slug} />
              ) : null}
              <div>
                <p className="text-sm font-semibold text-stone-950">{t.projects.refineResults}</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  {t.projects.refineDescription}
                </p>
              </div>
              <div>
                <label className="field-label">{t.projects.search}</label>
                <input
                  name="q"
                  defaultValue={params.q}
                  placeholder={t.projects.searchPlaceholder}
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">{t.projects.location}</label>
                <input
                  name="location"
                  defaultValue={params.location}
                  placeholder={t.projects.locationPlaceholder}
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">{t.projects.projectType}</label>
                <select
                  name="type"
                  defaultValue={params.type}
                  className="field-input"
                >
                  <option value="">{t.projects.allProjectTypes}</option>
                  <option value="apartment">{t.projects.apartment}</option>
                  <option value="villa">{t.projects.villa}</option>
                  <option value="townhouse">{t.projects.townhouse}</option>
                  <option value="mixed_use">{t.projects.mixedUse}</option>
                  <option value="commercial">{t.projects.commercial}</option>
                  <option value="land">{t.projects.land}</option>
                </select>
              </div>
              <div>
                <label className="field-label">{t.projects.completionStage}</label>
                <select
                  name="stage"
                  defaultValue={params.stage}
                  className="field-input"
                >
                  <option value="">{t.projects.allCompletionStages}</option>
                  <option value="pre_launch">{t.projects.preLaunch}</option>
                  <option value="under_construction">{t.projects.underConstruction}</option>
                  <option value="ready">{t.projects.ready}</option>
                  <option value="completed">{t.projects.completed}</option>
                </select>
              </div>
              <button type="submit" className="primary-button w-full text-sm">
                {t.projects.applyFilters}
              </button>
            </form>
          </aside>

          <section>
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
                <span className="stat-chip px-4 py-2 text-stone-700">
                  {filteredProjects.length} {t.projects.visibleProjects}
                </span>
                <span className="stat-chip px-4 py-2 text-stone-700">
                  {filteredProjects.filter((project) => project.isFeatured).length} {t.projects.featured}
                </span>
                <span className="stat-chip px-4 py-2 text-stone-700">
                  {new Set(filteredProjects.map((project) => project.developerProfileId)).size} {t.projects.developers}
                </span>
              </div>

              <div className="surface-soft inline-flex p-1.5">
                <Link
                  href={buildProjectsHref({ view: "list" })}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
                    currentView === "list"
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-stone-700 hover:bg-[rgba(141,104,71,0.08)]"
                  }`}
                >
                  {t.projects.listView}
                </Link>
                <Link
                  href={buildProjectsHref({ view: "map" })}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
                    currentView === "map"
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-stone-700 hover:bg-[rgba(141,104,71,0.08)]"
                  }`}
                >
                  {t.projects.mapView}
                </Link>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <article className="rounded-[1.75rem] border border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-10 text-center text-sm text-[var(--muted-foreground)]">
                {t.projects.noResults}
              </article>
            ) : currentView === "map" ? (
              <div className="space-y-8">
                <div className="surface-panel overflow-hidden">
                  <div className="flex flex-col gap-4 border-b border-[var(--border)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-950">{t.projects.mapViewTitle}</p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        {selectedProject
                          ? `${t.projects.mapViewFocusedOn} ${selectedProject.title}`
                          : t.projects.mapViewSelectPrompt}
                      </p>
                    </div>
                    {selectedProject ? (
                      <Link
                        href={`/projects/${selectedProject.slug}`}
                        className="secondary-button px-4 py-2.5 text-sm"
                      >
                        {t.projects.openProjectPage}
                      </Link>
                    ) : null}
                  </div>

                  {mapProjects.length > 0 ? (
                    <InteractiveListingsMap
                      items={mapProjects}
                      selectedId={selectedProject?.id ?? null}
                      className="h-[34rem] w-full"
                      trackingContext="projects_listing_map"
                    />
                  ) : (
                    <div className="flex h-[34rem] items-center justify-center bg-[linear-gradient(180deg,rgba(141,104,71,0.1),rgba(141,104,71,0.04))] p-8 text-center">
                      <div className="max-w-sm">
                        <p className="font-display text-3xl font-semibold text-stone-950">
                          {t.projects.mapViewTitle}
                        </p>
                        <p className="font-copy mt-4 text-base leading-7 text-[var(--muted-foreground)]">
                          {t.projects.mapUnavailable}
                        </p>
                      </div>
                    </div>
                  )}

                  {selectedProject ? (
                    <div className="grid gap-4 border-t border-[var(--border)] px-6 py-5 sm:grid-cols-3">
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                          Project
                        </p>
                        <p className="mt-2 text-sm font-semibold text-stone-950">
                          {selectedProject.title}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                          {t.projects.projectType}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-stone-950">
                          {formatProjectTypeLabel(selectedProject.projectType, locale)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                          {t.projects.completionStage}
                        </p>
                        <p className="mt-2 text-sm font-semibold text-stone-950">
                          {formatCompletionStageLabel(selectedProject.completionStage, locale)}
                        </p>
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="grid gap-5">
                  {filteredProjects.map((project) => {
                    const isSelected = selectedProject?.slug === project.slug;

                    return (
                      <article
                        key={project.id}
                        className={`surface-panel p-5 transition ${
                          isSelected
                            ? "ring-2 ring-[rgba(141,104,71,0.28)]"
                            : "hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex flex-col gap-5 lg:flex-row">
                          <div
                            className="h-52 bg-cover bg-center lg:w-60 lg:flex-none"
                            style={{
                              backgroundImage: project.heroMediaUrl
                                ? `linear-gradient(rgba(23,20,18,0.12),rgba(23,20,18,0.26)), url(${project.heroMediaUrl})`
                                : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
                            }}
                          />
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[rgba(198,154,91,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                                {formatProjectTypeLabel(project.projectType, locale)}
                              </span>
                              <span className="rounded-full bg-[rgba(141,104,71,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
                                {formatCompletionStageLabel(project.completionStage, locale)}
                              </span>
                              {project.isFeatured ? (
                                <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--secondary-foreground)]">
                                  {t.projectCard.featured}
                                </span>
                              ) : null}
                            </div>

                            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-stone-950">
                              {project.title}
                            </h2>
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                              {locale === "fr" ? "Par" : "By"} {project.developerName}
                            </p>
                            <p className="font-copy mt-4 line-clamp-3 text-[15px] leading-7 text-stone-700">
                              {project.description}
                            </p>

                            <div className="mt-5 grid gap-4 bg-[rgba(141,104,71,0.05)] p-4 sm:grid-cols-3">
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                                  Location
                                </p>
                                <p className="mt-2 text-sm font-medium text-stone-950">
                                  {project.location}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                                  Map status
                                </p>
                                <p className="mt-2 text-sm font-medium text-stone-950">
                                  {project.latitude != null && project.longitude != null
                                    ? "Coordinates available"
                                    : "Pending coordinates"}
                                </p>
                              </div>
                              <div>
                                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                                  Visibility
                                </p>
                                <p className="mt-2 text-sm font-medium text-stone-950">
                                  Admin-managed live listing
                                </p>
                              </div>
                            </div>

                            <div className="mt-6 flex flex-wrap items-center gap-3">
                              <ProjectSaveActions project={project} />
                              <Link
                                href={buildProjectsHref({
                                  view: "map",
                                  selected: project.slug,
                                })}
                                className={isSelected ? "primary-button px-5 py-3 text-sm" : "secondary-button px-5 py-3 text-sm"}
                              >
                                {isSelected
                                  ? locale === "fr"
                                    ? "Affiche sur la carte"
                                    : "Viewing on map"
                                  : locale === "fr"
                                    ? "Voir sur la carte"
                                    : "Show on map"}
                              </Link>
                              <Link
                                href={`/projects/${project.slug}`}
                                className="primary-button px-5 py-3 text-sm"
                              >
                                {t.projects.openProjectPage}
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-2">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} locale={locale} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
