import Link from "next/link";

import { ProjectCard } from "@/features/projects/project-card";
import {
  buildMapEmbedUrl,
  formatCompletionStageLabel,
  formatProjectTypeLabel,
} from "@/features/projects/presentation";
import { getProjects } from "@/features/projects/queries";

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

  const selectedMapUrl = selectedProject
    ? buildMapEmbedUrl(selectedProject)
    : null;

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

  return (
    <main className="page-shell min-h-screen bg-transparent">
      <section className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.55)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow">Marketplace</p>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-tight text-stone-950 sm:text-6xl">
            Explore admin-curated development projects
          </h1>
          <p className="font-copy mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Browse managed project inventory with map context, staged availability, and developer-backed inquiry capture.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <form className="surface-panel space-y-5 rounded-[1.75rem] p-6">
              <input type="hidden" name="view" value={currentView} />
              {selectedProject ? (
                <input type="hidden" name="selected" value={selectedProject.slug} />
              ) : null}
              <div>
                <p className="text-sm font-semibold text-stone-950">Refine results</p>
                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                  Narrow by keyword, location, type, and stage.
                </p>
              </div>
              <div>
                <label className="field-label">Search</label>
                <input
                  name="q"
                  defaultValue={params.q}
                  placeholder="Project, developer, keyword"
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Location</label>
                <input
                  name="location"
                  defaultValue={params.location}
                  placeholder="City, district, country"
                  className="field-input"
                />
              </div>
              <div>
                <label className="field-label">Project type</label>
                <select
                  name="type"
                  defaultValue={params.type}
                  className="field-input"
                >
                  <option value="">All project types</option>
                  <option value="apartment">Apartment</option>
                  <option value="villa">Villa</option>
                  <option value="townhouse">Townhouse</option>
                  <option value="mixed_use">Mixed use</option>
                  <option value="commercial">Commercial</option>
                  <option value="land">Land</option>
                </select>
              </div>
              <div>
                <label className="field-label">Completion stage</label>
                <select
                  name="stage"
                  defaultValue={params.stage}
                  className="field-input"
                >
                  <option value="">All completion stages</option>
                  <option value="pre_launch">Pre-launch</option>
                  <option value="under_construction">Under construction</option>
                  <option value="ready">Ready</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <button type="submit" className="primary-button w-full text-sm">
                Apply filters
              </button>
            </form>
          </aside>

          <section>
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
                <span className="stat-chip rounded-full px-4 py-2 text-stone-700">
                  {filteredProjects.length} visible projects
                </span>
                <span className="stat-chip rounded-full px-4 py-2 text-stone-700">
                  {filteredProjects.filter((project) => project.isFeatured).length} featured
                </span>
                <span className="stat-chip rounded-full px-4 py-2 text-stone-700">
                  {new Set(filteredProjects.map((project) => project.developerProfileId)).size} developers
                </span>
              </div>

              <div className="surface-soft inline-flex rounded-full p-1.5">
                <Link
                  href={buildProjectsHref({ view: "list" })}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
                    currentView === "list"
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-stone-700 hover:bg-[rgba(141,104,71,0.08)]"
                  }`}
                >
                  Normal view
                </Link>
                <Link
                  href={buildProjectsHref({ view: "map" })}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold ${
                    currentView === "map"
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "text-stone-700 hover:bg-[rgba(141,104,71,0.08)]"
                  }`}
                >
                  Map view
                </Link>
              </div>
            </div>

            {filteredProjects.length === 0 ? (
              <article className="rounded-[1.75rem] border border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-10 text-center text-sm text-[var(--muted-foreground)]">
                No projects matched the current filters. Broaden the search terms or clear one of the filters.
              </article>
            ) : currentView === "map" ? (
              <div className="space-y-8">
                <div className="surface-panel overflow-hidden rounded-[2rem]">
                  <div className="flex flex-col gap-4 border-b border-[var(--border)] px-6 py-5 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-semibold text-stone-950">Map view</p>
                      <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                        {selectedProject
                          ? `Focused on ${selectedProject.title}`
                          : "Select a project to preview its location"}
                      </p>
                    </div>
                    {selectedProject ? (
                      <Link
                        href={`/projects/${selectedProject.slug}`}
                        className="secondary-button px-4 py-2.5 text-sm"
                      >
                        Open property page
                      </Link>
                    ) : null}
                  </div>

                  {selectedProject && selectedMapUrl ? (
                    <iframe
                      title={`${selectedProject.title} map`}
                      src={selectedMapUrl}
                      className="h-[34rem] w-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  ) : (
                    <div className="flex h-[34rem] items-center justify-center bg-[linear-gradient(180deg,rgba(141,104,71,0.1),rgba(141,104,71,0.04))] p-8 text-center">
                      <div className="max-w-sm">
                        <p className="font-display text-3xl font-semibold text-stone-950">
                          Map preview unavailable
                        </p>
                        <p className="font-copy mt-4 text-base leading-7 text-[var(--muted-foreground)]">
                          This project does not have map coordinates yet. Keep the listing visible while the location data is completed.
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
                          Type
                        </p>
                        <p className="mt-2 text-sm font-semibold text-stone-950">
                          {formatProjectTypeLabel(selectedProject.projectType)}
                        </p>
                      </div>
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                          Stage
                        </p>
                        <p className="mt-2 text-sm font-semibold text-stone-950">
                          {formatCompletionStageLabel(selectedProject.completionStage)}
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
                        className={`surface-panel rounded-[1.75rem] p-5 transition ${
                          isSelected
                            ? "ring-2 ring-[rgba(141,104,71,0.28)]"
                            : "hover:-translate-y-0.5"
                        }`}
                      >
                        <div className="flex flex-col gap-5 lg:flex-row">
                          <div
                            className="h-52 rounded-[1.4rem] bg-cover bg-center lg:w-60 lg:flex-none"
                            style={{
                              backgroundImage: project.heroMediaUrl
                                ? `linear-gradient(rgba(23,20,18,0.12),rgba(23,20,18,0.26)), url(${project.heroMediaUrl})`
                                : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
                            }}
                          />
                          <div className="flex min-w-0 flex-1 flex-col">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-full bg-[rgba(198,154,91,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                                {formatProjectTypeLabel(project.projectType)}
                              </span>
                              <span className="rounded-full bg-[rgba(141,104,71,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
                                {formatCompletionStageLabel(project.completionStage)}
                              </span>
                              {project.isFeatured ? (
                                <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--secondary-foreground)]">
                                  Featured
                                </span>
                              ) : null}
                            </div>

                            <h2 className="mt-4 font-display text-3xl font-bold tracking-tight text-stone-950">
                              {project.title}
                            </h2>
                            <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                              By {project.developerName}
                            </p>
                            <p className="font-copy mt-4 line-clamp-3 text-[15px] leading-7 text-stone-700">
                              {project.description}
                            </p>

                            <div className="mt-5 grid gap-4 rounded-[1.25rem] bg-[rgba(141,104,71,0.05)] p-4 sm:grid-cols-3">
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
                              <Link
                                href={buildProjectsHref({
                                  view: "map",
                                  selected: project.slug,
                                })}
                                className={isSelected ? "primary-button px-5 py-3 text-sm" : "secondary-button px-5 py-3 text-sm"}
                              >
                                {isSelected ? "Viewing on map" : "Show on map"}
                              </Link>
                              <Link
                                href={`/projects/${project.slug}`}
                                className="primary-button px-5 py-3 text-sm"
                              >
                                Open property page
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
              <div className="grid gap-8 md:grid-cols-2 2xl:grid-cols-3">
                {filteredProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} />
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}
