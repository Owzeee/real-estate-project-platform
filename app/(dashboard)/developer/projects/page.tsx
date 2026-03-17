import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { getProjectsForDeveloper } from "@/features/projects/queries";
import { requireDeveloper } from "@/lib/auth";

export default async function DeveloperProjectsDashboardPage() {
  const auth = await requireDeveloper();
  const projects = await getProjectsForDeveloper(auth.developerProfile.id);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Developer Dashboard"
            title="Manage project submissions"
            description="Create new projects, keep drafts private, and track which submissions are still pending admin approval."
          />
          <Link
            href="/developer/projects/new"
            className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
          >
            New project
          </Link>
        </div>

        <div className="mt-10 overflow-hidden rounded-[2rem] border border-stone-900/10 bg-white shadow-[0_20px_60px_rgba(41,37,36,0.08)]">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead className="border-b border-stone-200 bg-stone-50 text-xs uppercase tracking-[0.18em] text-stone-500">
                <tr>
                  <th className="px-6 py-4">Project</th>
                  <th className="px-6 py-4">Developer</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Approval</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4"></th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id} className="border-b border-stone-100 last:border-b-0">
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-semibold text-stone-950">{project.title}</p>
                        <p className="mt-1 text-sm text-stone-500">{project.location}</p>
                      </div>
                    </td>
                    <td className="px-6 py-5 text-sm text-stone-700">
                      {project.developerName}
                    </td>
                    <td className="px-6 py-5 text-sm capitalize text-stone-700">
                      {project.status.replace("_", " ")}
                    </td>
                    <td className="px-6 py-5">
                      <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-amber-950">
                        {project.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-5 text-sm capitalize text-stone-700">
                      {project.projectType.replace("_", " ")}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <Link
                        href={`/developer/projects/${project.id}/edit`}
                        className="text-sm font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
                      >
                        Edit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </main>
  );
}
