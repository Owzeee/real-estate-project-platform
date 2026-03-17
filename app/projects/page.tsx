import { SectionHeading } from "@/components/shared/section-heading";
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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f5ee_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Marketplace"
          title="Live development projects"
          description="A billboard-style project marketplace with media-rich showcase pages, developer visibility, and direct inquiry capture."
        />
        <form className="mt-8 grid gap-4 rounded-[2rem] border border-stone-900/10 bg-white p-6 shadow-[0_20px_60px_rgba(41,37,36,0.08)] md:grid-cols-4">
          <input
            name="q"
            defaultValue={params.q}
            placeholder="Search title or developer"
            className="rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
          />
          <input
            name="location"
            defaultValue={params.location}
            placeholder="Location"
            className="rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
          />
          <select
            name="type"
            defaultValue={params.type}
            className="rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
          >
            <option value="">All project types</option>
            <option value="apartment">Apartment</option>
            <option value="villa">Villa</option>
            <option value="townhouse">Townhouse</option>
            <option value="mixed_use">Mixed use</option>
            <option value="commercial">Commercial</option>
            <option value="land">Land</option>
          </select>
          <select
            name="stage"
            defaultValue={params.stage}
            className="rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
          >
            <option value="">All completion stages</option>
            <option value="pre_launch">Pre-launch</option>
            <option value="under_construction">Under construction</option>
            <option value="ready">Ready</option>
            <option value="completed">Completed</option>
          </select>
          <button
            type="submit"
            className="rounded-full bg-stone-950 px-5 py-3 text-sm font-semibold text-white md:col-span-4 md:justify-self-start"
          >
            Apply filters
          </button>
        </form>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
