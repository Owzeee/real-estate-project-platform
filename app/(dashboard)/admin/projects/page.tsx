import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import {
  moderateProject,
  toggleFeaturedProject,
} from "@/features/projects/actions";
import { getDashboardProjects } from "@/features/projects/queries";

export default async function AdminProjectsPage() {
  const projects = await getDashboardProjects();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Admin"
          title="Project moderation"
          description="Approve or reject submitted projects and control homepage featuring without touching the database directly."
        />
        <div className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/admin/developers"
            className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-950"
          >
            Review developers
          </Link>
          <Link
            href="/admin/inquiries"
            className="rounded-full border border-stone-300 px-5 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-950"
          >
            Review inquiries
          </Link>
        </div>

        <div className="mt-10 grid gap-6">
          {projects.map((project) => (
            <article
              key={project.id}
              className="rounded-[2rem] border border-stone-900/10 bg-white p-6 shadow-[0_20px_60px_rgba(41,37,36,0.08)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                    {project.title}
                  </h2>
                  <p className="mt-2 text-sm text-stone-500">
                    {project.developerName} • {project.location}
                  </p>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-700">
                    {project.description}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
                    {project.status.replace("_", " ")}
                  </span>
                  <span className="rounded-full bg-amber-100 px-3 py-1 text-amber-950">
                    {project.approvalStatus}
                  </span>
                  {project.isFeatured ? (
                    <span className="rounded-full bg-stone-950 px-3 py-1 text-stone-100">
                      Featured
                    </span>
                  ) : null}
                </div>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <form action={moderateProject.bind(null, project.id, "approved")}>
                  <button className="rounded-full bg-emerald-700 px-4 py-2 text-sm font-semibold text-white">
                    Approve
                  </button>
                </form>
                <form action={moderateProject.bind(null, project.id, "rejected")}>
                  <button className="rounded-full bg-amber-700 px-4 py-2 text-sm font-semibold text-white">
                    Reject
                  </button>
                </form>
                <form action={moderateProject.bind(null, project.id, "pending")}>
                  <button className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900">
                    Set pending
                  </button>
                </form>
                <form
                  action={toggleFeaturedProject.bind(
                    null,
                    project.id,
                    !project.isFeatured,
                  )}
                >
                  <button className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900">
                    {project.isFeatured ? "Remove feature" : "Feature project"}
                  </button>
                </form>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
