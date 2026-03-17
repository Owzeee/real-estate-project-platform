import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { getDevelopers } from "@/features/developers/queries";
import { createProject } from "@/features/projects/actions";
import { ProjectForm } from "@/features/projects/project-form";

export default async function NewProjectPage() {
  const developers = await getDevelopers();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Developer Dashboard"
            title="Create a new project"
            description="This writes to Supabase immediately, saves the project as pending approval, and can attach image, video, brochure, and 3D tour links."
          />
          <Link
            href="/developer/projects"
            className="text-sm font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
          >
            Back to dashboard
          </Link>
        </div>

        <section className="mt-10 rounded-[2rem] border border-stone-900/10 bg-white p-8 shadow-[0_20px_60px_rgba(41,37,36,0.08)] sm:p-10">
          <ProjectForm
            action={createProject}
            developers={developers.map((developer) => ({
              id: developer.id,
              companyName: developer.companyName,
            }))}
            submitLabel="Create project"
            pendingLabel="Creating project..."
          />
        </section>
      </div>
    </main>
  );
}
