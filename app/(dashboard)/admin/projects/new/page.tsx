import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { getDevelopersWithAllProjects } from "@/features/developers/queries";
import { createProject } from "@/features/projects/actions";
import { ProjectForm } from "@/features/projects/project-form";
import { emptyProjectFormValues } from "@/features/projects/project-form-shared";
import { requireAdmin } from "@/lib/auth";

export default async function AdminNewProjectPage() {
  await requireAdmin();
  const developers = await getDevelopersWithAllProjects();

  return (
    <main className="min-h-screen bg-transparent px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr]">
          <section className="rounded-[1.9rem] bg-[linear-gradient(145deg,rgba(32,28,25,0.98),rgba(141,104,71,0.94))] p-8 text-white shadow-[0_32px_90px_rgba(32,28,25,0.22)]">
            <SectionHeading
              eyebrow="Admin"
              title="Create a project"
              description="Admins can create projects directly and attach unit-level properties in the same workflow."
            />
            <div className="mt-8 space-y-4 text-sm leading-7 text-white/78">
              <p>Select the developer, define the public project details, then add the apartments or units that live inside it.</p>
              <Link
                href="/admin/projects"
                className="inline-flex border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/8"
              >
                Back to admin projects
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[rgba(141,104,71,0.12)] bg-[var(--card)] p-8 shadow-[0_24px_70px_rgba(32,28,25,0.08)] sm:p-10">
            <ProjectForm
              action={createProject}
              developers={developers.map((developer) => ({
                id: developer.id,
                companyName: developer.companyName,
              }))}
              initialValues={emptyProjectFormValues}
              submitLabel="Create project"
              pendingLabel="Creating project..."
            />
          </section>
        </div>
      </div>
    </main>
  );
}
