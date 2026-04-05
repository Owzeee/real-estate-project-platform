import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import {
  moderateProject,
  toggleFeaturedProject,
} from "@/features/projects/actions";
import { getDashboardProjects } from "@/features/projects/queries";
import { requireAdmin } from "@/lib/auth";

export default async function AdminProjectsPage() {
  await requireAdmin();
  const projects = await getDashboardProjects();

  return (
    <main className="min-h-screen bg-transparent px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[0.4fr_1fr]">
          <section className="rounded-[1.9rem] bg-[linear-gradient(145deg,rgba(141,104,71,0.94),rgba(32,28,25,0.98))] p-8 text-white shadow-[0_32px_90px_rgba(32,28,25,0.22)]">
            <SectionHeading
              eyebrow="Admin"
              title="Project moderation"
              description="Create projects, assign them to developers, add unit-level properties, and moderate visibility without touching the database directly."
            />
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admin/projects/new"
                className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-stone-950 hover:bg-white/90"
              >
                Create project
              </Link>
              <Link
                href="/admin/developers"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/8"
              >
                Review developers
              </Link>
              <Link
                href="/admin/inquiries"
                className="rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/8"
              >
                Review inquiries
              </Link>
            </div>
          </section>

          <section className="grid gap-6">
            {projects.map((project) => (
              <article
                key={project.id}
                className="rounded-[1.75rem] border border-[rgba(141,104,71,0.12)] bg-[var(--card)] p-6 shadow-[0_20px_60px_rgba(32,28,25,0.07)]"
              >
                <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                  <div>
                    <h2 className="font-display text-3xl font-bold tracking-tight text-stone-950">
                      {project.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                      {project.developerName} • {project.location}
                    </p>
                    <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-700">
                      {project.description}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.18em]">
                    <span className="rounded-full border border-[var(--border)] bg-white px-3 py-1 text-stone-700">
                      {project.status.replace("_", " ")}
                    </span>
                    <span className="rounded-full bg-[rgba(198,154,91,0.14)] px-3 py-1 text-[var(--accent)]">
                      {project.approvalStatus}
                    </span>
                    {project.isFeatured ? (
                      <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-[var(--secondary-foreground)]">
                        Featured
                      </span>
                    ) : null}
                  </div>
                </div>

                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={`/admin/projects/${project.id}/edit`}
                    className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]"
                  >
                    Edit project
                  </Link>
                  <form action={moderateProject.bind(null, project.id, "approved")}>
                    <button className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)] hover:bg-[color-mix(in_srgb,var(--primary)_88%,black)]">
                      Approve
                    </button>
                  </form>
                  <form action={moderateProject.bind(null, project.id, "rejected")}>
                    <button className="rounded-full bg-[var(--secondary)] px-4 py-2 text-sm font-semibold text-[var(--secondary-foreground)] hover:bg-[color-mix(in_srgb,var(--secondary)_88%,black)]">
                      Reject
                    </button>
                  </form>
                  <form action={moderateProject.bind(null, project.id, "pending")}>
                    <button className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]">
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
                    <button className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]">
                      {project.isFeatured ? "Remove feature" : "Feature project"}
                    </button>
                  </form>
                </div>
              </article>
            ))}
          </section>
        </div>
      </div>
    </main>
  );
}
