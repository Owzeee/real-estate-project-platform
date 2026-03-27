import Link from "next/link";
import { notFound } from "next/navigation";

import { InquiryForm } from "@/features/inquiries/inquiry-form";
import { ProjectGallery } from "@/features/projects/project-gallery";
import { ProjectSaveActions } from "@/features/projects/project-save-actions";
import {
  buildMapEmbedUrl,
  formatCompletionStageLabel,
  formatProjectTypeLabel,
  formatStatusLabel,
  getProjectAmenityGroups,
  getProjectHighlights,
  getProjectNarrative,
  getProjectUnits,
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
  const units = getProjectUnits(project);
  const amenityGroups = getProjectAmenityGroups(project);
  const narrative = getProjectNarrative(project);
  const galleryImages = project.media
    .filter((item) => item.mediaType === "image")
    .map((item, index) => ({
      src: item.fileUrl,
      alt: item.title ?? `${project.title} image ${index + 1}`,
    }));
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
          <div className="grid gap-0 xl:grid-cols-[1.08fr_0.92fr]">
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

            <div className="border-t border-[var(--border)] p-4 sm:p-6 xl:border-l xl:border-t-0">
              <ProjectGallery images={galleryImages} />
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-10 xl:grid-cols-[1.2fr_0.8fr]">
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
                Explore specific apartments and layouts inside this project
              </h2>
              <p className="font-copy mt-4 max-w-3xl text-base leading-8 text-[var(--muted-foreground)]">
                Each option opens a dedicated unit page with image gallery, amenity details, bed setup, and availability information.
              </p>

              <div className="mt-8 space-y-4">
                {units.map((unit) => (
                  <Link
                    key={unit.id}
                    href={`/projects/${project.slug}/units/${unit.slug}`}
                    className="block rounded-[1.5rem] border border-[var(--border)] bg-white/82 p-4 transition hover:border-[rgba(141,104,71,0.28)] sm:p-5"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                      <div
                        className="h-28 rounded-[1.2rem] bg-cover bg-center sm:w-36 sm:flex-none"
                        style={{
                          backgroundImage: unit.imageUrl
                            ? `linear-gradient(rgba(23,20,18,0.08),rgba(23,20,18,0.18)), url(${unit.imageUrl})`
                            : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
                        }}
                      />

                      <div className="min-w-0 flex-1">
                        <p className="font-copy text-base leading-7 text-stone-700">
                          {unit.title}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                          <span className="text-lg font-semibold text-stone-950">
                            {unit.priceLabel}
                          </span>
                          <span className="text-sm font-semibold text-stone-700">
                            {unit.areaLabel}
                          </span>
                          <span className="text-sm font-semibold text-stone-700">
                            {unit.roomsLabel}
                          </span>
                        </div>
                      </div>

                      <span className="text-sm font-semibold text-[var(--primary)]">
                        View apartment
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </article>

            <article className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
              <p className="eyebrow">Amenities</p>
              <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_280px]">
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                  {amenityGroups.slice(0, 4).map((group) => (
                    <div key={group.title}>
                      <h3 className="text-base font-semibold text-stone-950">
                        {group.title}
                      </h3>
                      <div className="mt-4 space-y-3">
                        {group.items.map((item) => (
                          <div key={item} className="flex items-start gap-3">
                            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center rounded-full border border-emerald-300 text-xs text-emerald-600">
                              ✓
                            </span>
                            <span className="text-sm text-stone-700">{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="rounded-[1.5rem] bg-[rgba(141,104,71,0.05)] p-5">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                    Project snapshot
                  </p>
                  <p className="mt-3 text-lg font-semibold text-stone-950">
                    {units[0]?.monthlyRentLabel ?? "Contact for pricing"}
                  </p>
                  <div className="mt-5 space-y-4">
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                        Available from
                      </p>
                      <p className="mt-1 text-sm font-semibold text-stone-950">
                        {units[0]?.availableFromLabel ?? "Ask for availability"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                        Minimum stay
                      </p>
                      <p className="mt-1 text-sm font-semibold text-stone-950">
                        {units[0]?.minimumStayLabel ?? "Flexible"}
                      </p>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                        Best next step
                      </p>
                      <p className="mt-1 text-sm text-stone-700">
                        Open a unit to see apartment-specific details and availability.
                      </p>
                    </div>
                  </div>
                </div>
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

          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="surface-panel rounded-[1.75rem] p-5 sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Contact card
              </p>
              <p className="mt-3 text-2xl font-semibold text-stone-950">
                {units[0]?.monthlyRentLabel ?? "Request pricing"}
              </p>

              <div className="mt-5 rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                  Stay duration
                </p>
                <p className="mt-1 text-sm font-semibold text-stone-950">
                  {units[0]?.availableFromLabel ?? "Ask for timing"} - Move out
                </p>
              </div>

              <div className="mt-5 rounded-[1.2rem] bg-[rgba(141,104,71,0.05)] p-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      Developer
                    </p>
                    <p className="mt-1 text-sm font-semibold text-stone-950">
                      {project.developerName}
                    </p>
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      Approval
                    </p>
                    <p className="mt-1 text-sm font-semibold text-stone-950">
                      {project.approvalStatus.charAt(0).toUpperCase() + project.approvalStatus.slice(1)}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5">
                <InquiryForm projectId={project.id} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
