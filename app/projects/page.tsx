import { ProjectCard } from "@/features/projects/project-card";
import { getProjects } from "@/features/projects/queries";

type ProjectsPageProps = {
  searchParams?: Promise<{
    q?: string;
    type?: string;
    stage?: string;
    location?: string;
  }>;
};

export default async function ProjectsPage({ searchParams }: ProjectsPageProps) {
  const projects = await getProjects();
  const params = (await searchParams) ?? {};
  const query = params.q?.toLowerCase().trim() ?? "";
  const type = params.type?.trim() ?? "";
  const stage = params.stage?.trim() ?? "";
  const location = params.location?.toLowerCase().trim() ?? "";

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

  return (
    <main className="page-shell min-h-screen bg-transparent">
      <section className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.55)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow">Marketplace</p>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-tight text-stone-950 sm:text-6xl">
            Live development projects
          </h1>
          <p className="font-copy mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Browse approved projects with pricing, location, stage, and developer visibility already connected to your Supabase data.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[300px_1fr]">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <form className="surface-panel space-y-5 rounded-[1.75rem] p-6">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-semibold text-stone-950">Refine results</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    Narrow by keyword, location, type, and stage.
                  </p>
                </div>
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
            <div className="mb-8 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
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

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredProjects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>

            {filteredProjects.length === 0 ? (
              <article className="mt-10 rounded-[1.75rem] border border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-10 text-center text-sm text-[var(--muted-foreground)]">
                No projects matched the current filters. Broaden the search terms or clear one of the filters.
              </article>
            ) : null}
          </section>
        </div>
      </div>
    </main>
  );
}
