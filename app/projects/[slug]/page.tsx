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
    <main className="min-h-screen bg-[linear-gradient(180deg,#f3ead7_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[1.25fr_0.75fr]">
          <section className="overflow-hidden rounded-[2rem] border border-stone-900/10 bg-white shadow-[0_20px_60px_rgba(41,37,36,0.08)]">
            <div
              className="h-96 bg-cover bg-center"
              style={{
                backgroundImage: project.heroMediaUrl
                  ? `linear-gradient(rgba(28,25,23,0.18),rgba(28,25,23,0.36)), url(${project.heroMediaUrl})`
                  : "linear-gradient(135deg, #d6c7ad, #8f7156)",
              }}
            />
            <div className="p-8">
              <div className="flex flex-wrap gap-3">
                <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-amber-950">
                  {project.projectType.replace("_", " ")}
                </span>
                <span className="rounded-full bg-stone-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
                  {project.completionStage.replace("_", " ")}
                </span>
              </div>
              <h1 className="mt-5 text-4xl font-semibold tracking-tight text-stone-950">
                {project.title}
              </h1>
              <p className="mt-3 text-base text-stone-600">
                By{" "}
                <Link
                  href={`/developers/${project.developerSlug}`}
                  className="font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
                >
                  {project.developerName}
                </Link>
              </p>
              <p className="mt-6 text-base leading-8 text-stone-700">
                {project.description}
              </p>

              <div className="mt-8 grid gap-4 rounded-[1.5rem] bg-stone-50 p-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Location
                  </p>
                  <p className="mt-2 text-sm font-medium text-stone-900">
                    {project.location}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Price range
                  </p>
                  <p className="mt-2 text-sm font-medium text-stone-900">
                    {formatPriceRange(
                      project.minPrice,
                      project.maxPrice,
                      project.currencyCode,
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Approval
                  </p>
                  <p className="mt-2 text-sm font-medium capitalize text-stone-900">
                    {project.approvalStatus}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-stone-500">
                    Project status
                  </p>
                  <p className="mt-2 text-sm font-medium capitalize text-stone-900">
                    {project.status.replace("_", " ")}
                  </p>
                </div>
              </div>

              <div className="mt-8">
                <h2 className="text-xl font-semibold tracking-tight text-stone-950">
                  Media highlights
                </h2>
                <div className="mt-4 grid gap-4 sm:grid-cols-2">
                  {project.media.map((item) => (
                    <article
                      key={item.id}
                      className="rounded-[1.5rem] border border-stone-900/10 bg-stone-50 p-5"
                    >
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                        {item.mediaType.replace("_", " ")}
                      </p>
                      <h3 className="mt-2 text-base font-semibold text-stone-950">
                        {item.title ?? "Media asset"}
                      </h3>
                      <a
                        href={item.fileUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-block text-sm font-medium text-stone-800 underline decoration-stone-300 underline-offset-4"
                      >
                        Open asset
                      </a>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <aside className="rounded-[2rem] border border-stone-900/10 bg-white p-8 shadow-[0_20px_60px_rgba(41,37,36,0.08)]">
            <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
              Contact developer
            </h2>
            <p className="mt-3 text-sm leading-6 text-stone-700">
              Send a direct inquiry for pricing, availability, brochures, or a
              private walkthrough.
            </p>
            <div className="mt-6">
              <InquiryForm projectId={project.id} />
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
