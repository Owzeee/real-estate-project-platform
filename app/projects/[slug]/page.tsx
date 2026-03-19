import Link from "next/link";
import { notFound } from "next/navigation";

import { InquiryForm } from "@/features/inquiries/inquiry-form";
import { getProjectBySlug } from "@/features/projects/queries";
import { formatPriceRange } from "@/lib/utils/format-price";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-transparent px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="overflow-hidden rounded-[2rem] border border-[rgba(141,104,71,0.12)] bg-[var(--card)] shadow-[0_30px_80px_rgba(32,28,25,0.08)]">
          <div
            className="relative h-[30rem] bg-cover bg-center"
            style={{
              backgroundImage: project.heroMediaUrl
                ? `linear-gradient(rgba(23,20,18,0.18),rgba(23,20,18,0.42)), url(${project.heroMediaUrl})`
                : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
            }}
          >
            <div className="absolute inset-0 flex items-end">
              <div className="w-full p-8 text-white sm:p-10">
                <div className="flex flex-wrap gap-3">
                  <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    {project.projectType.replace("_", " ")}
                  </span>
                  <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white">
                    {project.completionStage.replace("_", " ")}
                  </span>
                </div>
                <h1 className="mt-5 max-w-4xl font-display text-5xl font-bold tracking-tight sm:text-6xl">
                  {project.title}
                </h1>
                <p className="mt-4 text-base text-white/80">
                  By{" "}
                  <Link
                    href={`/developers/${project.developerSlug}`}
                    className="font-semibold underline decoration-white/30 underline-offset-4"
                  >
                    {project.developerName}
                  </Link>
                </p>
              </div>
            </div>
          </div>

          <div className="grid gap-8 p-8 lg:grid-cols-[1.15fr_0.85fr] sm:p-10">
            <section>
              <p className="text-base leading-8 text-stone-700">{project.description}</p>

              <div className="mt-8 grid gap-4 rounded-[1.75rem] bg-[rgba(141,104,71,0.05)] p-5 sm:grid-cols-2">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                    Location
                  </p>
                  <p className="mt-2 text-sm font-medium text-stone-900">{project.location}</p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                    Price range
                  </p>
                  <p className="mt-2 text-sm font-semibold text-[var(--primary)]">
                    {formatPriceRange(
                      project.minPrice,
                      project.maxPrice,
                      project.currencyCode,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                    Approval
                  </p>
                  <p className="mt-2 text-sm font-medium capitalize text-stone-900">
                    {project.approvalStatus}
                  </p>
                </div>
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                    Marketplace status
                  </p>
                  <p className="mt-2 text-sm font-medium capitalize text-stone-900">
                    {project.status.replace("_", " ")}
                  </p>
                </div>
              </div>

              <div className="mt-10">
                <h2 className="font-display text-3xl font-bold tracking-tight text-stone-950">
                  Media highlights
                </h2>
                <div className="mt-5 grid gap-4 sm:grid-cols-2">
                  {project.media.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[1.5rem] border border-[var(--border)] bg-white p-5"
                    >
                      <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                        {item.mediaType.replace("_", " ")}
                      </p>
                      <h3 className="mt-3 font-display text-2xl font-semibold text-stone-950">
                        {item.title ?? "Media asset"}
                      </h3>
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-4 inline-flex rounded-full border border-[var(--border)] px-4 py-2 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]"
                      >
                        Open asset
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            </section>

            <aside className="rounded-[1.75rem] border border-[var(--border)] bg-[rgba(255,255,255,0.7)] p-6 shadow-[0_20px_60px_rgba(32,28,25,0.06)]">
              <h2 className="font-display text-3xl font-bold tracking-tight text-stone-950">
                Contact developer
              </h2>
              <p className="mt-3 text-sm leading-7 text-[var(--muted-foreground)]">
                Request pricing, availability, brochures, or a private walkthrough for this project.
              </p>
              <div className="mt-6">
                <InquiryForm projectId={project.id} />
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
