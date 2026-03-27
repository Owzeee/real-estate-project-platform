import Link from "next/link";
import { notFound } from "next/navigation";

import { InquiryForm } from "@/features/inquiries/inquiry-form";
import { ProjectSaveActions } from "@/features/projects/project-save-actions";
import {
  buildMapEmbedUrl,
  formatCompletionStageLabel,
  formatProjectTypeLabel,
  formatStatusLabel,
  getHousingExamples,
  getProjectAmenities,
  getProjectHighlights,
  getProjectNarrative,
} from "@/features/projects/presentation";
import { getProjectBySlug, getProjects } from "@/features/projects/queries";
import { formatPriceRange } from "@/lib/utils/format-price";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ]);

  if (!project) {
    notFound();
  }

  const mapUrl = buildMapEmbedUrl(project);
  const highlights = getProjectHighlights(project);
  const housingExamples = getHousingExamples(project);
  const amenities = getProjectAmenities(project);
  const narrative = getProjectNarrative(project);
  const mediaGallery = project.media.length > 0 ? project.media : [];
  const primaryMedia =
    mediaGallery.find((item) => item.mediaType === "image") ?? mediaGallery[0];
  const supportingMedia = mediaGallery
    .filter((item) => item.id !== primaryMedia?.id)
    .slice(0, 3);
  const relatedProjects = allProjects
    .filter((item) => item.slug !== project.slug)
    .filter(
      (item) =>
        item.developerProfileId === project.developerProfileId ||
        item.city === project.city,
    )
    .slice(0, 3);

  return (
    <main className="page-shell min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <Link href="/projects" className="secondary-button px-4 py-2.5 text-sm">
            Back to projects
          </Link>
          <span>/</span>
          <span>{project.title}</span>
        </div>

        <section className="surface-panel overflow-hidden rounded-[2rem]">
          <div className="grid gap-0 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[rgba(198,154,91,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {formatProjectTypeLabel(project.projectType)}
                </span>
                <span className="rounded-full bg-[rgba(141,104,71,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
                  {formatCompletionStageLabel(project.completionStage)}
                </span>
                {project.isFeatured ? (
                  <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--secondary-foreground)]">
                    Featured
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              <p className="mt-4 text-base text-[var(--muted-foreground)]">
                By{" "}
                <Link
                  href={`/developers/${project.developerSlug}`}
                  className="font-semibold text-stone-950 underline decoration-[var(--border)] underline-offset-4"
                >
                  {project.developerName}
                </Link>
                {" "}in {project.location}
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                <div className="stat-chip rounded-[1.4rem] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                    Price range
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-[var(--primary)]">
                    {formatPriceRange(project.minPrice, project.maxPrice, project.currencyCode)}
                  </p>
                </div>
                <div className="stat-chip rounded-[1.4rem] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                    Marketplace status
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-stone-950">
                    {formatStatusLabel(project.status)}
                  </p>
                </div>
                <div className="stat-chip rounded-[1.4rem] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                    Inventory model
                  </p>
                  <p className="mt-2 font-display text-2xl font-semibold text-stone-950">
                    Admin-curated
                  </p>
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ProjectSaveActions project={project} />
              </div>
            </div>

            <div className="border-t border-[var(--border)] p-4 sm:p-6 lg:border-l lg:border-t-0">
              <div
                className="h-full min-h-[24rem] rounded-[1.6rem] bg-cover bg-center"
                style={{
                  backgroundImage: primaryMedia?.fileUrl
                    ? `linear-gradient(rgba(23,20,18,0.16),rgba(23,20,18,0.28)), url(${primaryMedia.fileUrl})`
                    : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
                }}
              />
            </div>
          </div>

          {supportingMedia.length > 0 ? (
            <div className="grid gap-4 border-t border-[var(--border)] p-4 sm:grid-cols-3 sm:p-6">
              {supportingMedia.map((item) => (
                <a
                  key={item.id}
                  href={item.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group overflow-hidden rounded-[1.4rem] border border-[var(--border)] bg-white"
                >
                  <div
                    className="h-40 bg-cover bg-center transition duration-300 group-hover:scale-[1.02]"
                    style={{
                      backgroundImage:
                        item.thumbnailUrl || item.mediaType === "image"
                          ? `linear-gradient(rgba(23,20,18,0.08),rgba(23,20,18,0.18)), url(${item.thumbnailUrl ?? item.fileUrl})`
                          : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
                    }}
                  />
                  <div className="p-4">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      {item.mediaType.replace("_", " ")}
                    </p>
                    <p className="mt-2 text-sm font-semibold text-stone-950">
                      {item.title ?? "Open media asset"}
                    </p>
                  </div>
                </a>
              ))}
            </div>
          ) : null}
        </section>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.08fr_0.92fr]">
          <section className="space-y-8">
            <article className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
              <p className="eyebrow">About This Project</p>
              <p className="font-copy mt-6 text-lg leading-8 text-stone-700">
                {project.description}
              </p>
              <p className="font-copy mt-5 text-base leading-8 text-[var(--muted-foreground)]">
                {narrative}
              </p>
            </article>

            <article className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow">Key Highlights</p>
                  <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950">
                    What makes this listing worth attention
                  </h2>
                </div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {highlights.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.4rem] bg-[rgba(141,104,71,0.05)] p-5"
                  >
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">
                      Highlight
                    </p>
                    <p className="mt-3 font-copy text-base leading-7 text-stone-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
              <p className="eyebrow">Examples of Housing</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950">
                Inventory-style layouts buyers can compare quickly
              </h2>
              <p className="font-copy mt-4 max-w-3xl text-base leading-8 text-[var(--muted-foreground)]">
                This section mirrors the marketplace pattern from your screenshot: visual unit examples, fast pricing context, and compact specs that are easy to scan.
              </p>

              <div className="mt-8 space-y-4">
                {housingExamples.map((example) => (
                  <article
                    key={example.id}
                    className="rounded-[1.5rem] border border-[var(--border)] bg-white/82 p-4 sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div
                        className="h-28 rounded-[1.2rem] bg-cover bg-center sm:w-36 sm:flex-none"
                        style={{
                          backgroundImage: example.imageUrl
                            ? `linear-gradient(rgba(23,20,18,0.08),rgba(23,20,18,0.18)), url(${example.imageUrl})`
                            : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="font-copy text-base leading-7 text-stone-700">
                          {example.title}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                          <span className="text-lg font-semibold text-stone-950">
                            {example.priceLabel}
                          </span>
                          <span className="text-sm font-semibold text-stone-700">
                            {example.areaLabel}
                          </span>
                          <span className="text-sm font-semibold text-stone-700">
                            {example.roomsLabel}
                          </span>
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </article>

            <article className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
              <p className="eyebrow">Amenities & Assets</p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {amenities.map((item) => (
                  <div
                    key={item}
                    className="rounded-[1.4rem] border border-[var(--border)] bg-white/75 p-5"
                  >
                    <p className="text-sm font-semibold text-stone-950">{item}</p>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
              <p className="eyebrow">Location</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950">
                Positioned in {project.location}
              </h2>
              <p className="font-copy mt-5 max-w-3xl text-base leading-8 text-[var(--muted-foreground)]">
                The listing experience should make location part of the decision-making process. This section keeps map visibility close to the property information instead of hiding it behind another screen.
              </p>

              {mapUrl ? (
                <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-[var(--border)]">
                  <iframe
                    title={`${project.title} location`}
                    src={mapUrl}
                    className="h-[26rem] w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : (
                <div className="mt-8 rounded-[1.75rem] bg-[rgba(141,104,71,0.06)] p-8 text-sm text-[var(--muted-foreground)]">
                  Map coordinates have not been added yet for this project.
                </div>
              )}
            </article>

            {relatedProjects.length > 0 ? (
              <article className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
                <p className="eyebrow">Related Listings</p>
                <div className="mt-8 grid gap-4">
                  {relatedProjects.map((item) => (
                    <Link
                      key={item.id}
                      href={`/projects/${item.slug}`}
                      className="rounded-[1.4rem] border border-[var(--border)] bg-white/80 p-5 hover:border-[rgba(141,104,71,0.26)]"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        <div>
                          <p className="font-display text-2xl font-semibold text-stone-950">
                            {item.title}
                          </p>
                          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                            {item.location} • {item.developerName}
                          </p>
                        </div>
                        <span className="text-sm font-semibold text-[var(--primary)]">
                          View listing
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </article>
            ) : null}
          </section>

          <aside className="lg:sticky lg:top-28 lg:self-start">
            <div className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
              <p className="eyebrow">Request Details</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950">
                Contact the developer team
              </h2>
              <p className="font-copy mt-4 text-base leading-8 text-[var(--muted-foreground)]">
                Ask for brochure access, availability, pricing confirmation, or a private walkthrough. This form routes directly against the selected project.
              </p>

              <div className="mt-8 rounded-[1.5rem] bg-[rgba(141,104,71,0.05)] p-5">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      Developer
                    </p>
                    <p className="mt-2 text-sm font-semibold text-stone-950">
                      {project.developerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      Approval
                    </p>
                    <p className="mt-2 text-sm font-semibold text-stone-950">
                      {project.approvalStatus.charAt(0).toUpperCase() + project.approvalStatus.slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <InquiryForm projectId={project.id} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
