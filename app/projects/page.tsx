import { SectionHeading } from "@/components/shared/section-heading";
import { ProjectCard } from "@/features/projects/project-card";
import { getProjects } from "@/features/projects/queries";

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f5ee_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Marketplace"
          title="Live development projects"
          description="A billboard-style project marketplace with media-rich showcase pages, developer visibility, and direct inquiry capture."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </div>
    </main>
  );
}
