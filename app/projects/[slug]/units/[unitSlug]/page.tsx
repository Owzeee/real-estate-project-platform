import Link from "next/link";
import { notFound } from "next/navigation";

import { InquiryForm } from "@/features/inquiries/inquiry-form";
import { ProjectGallery } from "@/features/projects/project-gallery";
import {
  buildMapEmbedUrl,
  getProjectUnitBySlug,
} from "@/features/projects/presentation";
import { getProjectBySlug } from "@/features/projects/queries";

type ProjectUnitPageProps = {
  params: Promise<{
    slug: string;
    unitSlug: string;
  }>;
};

export default async function ProjectUnitPage({ params }: ProjectUnitPageProps) {
  const { slug, unitSlug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const unit = getProjectUnitBySlug(project, unitSlug);

  if (!unit) {
    notFound();
  }

  const mapUrl = buildMapEmbedUrl(project);

  return (
    <main className="page-shell min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <Link
            href={`/projects/${project.slug}`}
            className="secondary-button px-4 py-2.5 text-sm"
          >
            Back to project
          </Link>
          <span>/</span>
          <span>{unit.title}</span>
        </div>

        <div className="grid gap-10 xl:grid-cols-[1.18fr_0.82fr]">
          <section className="space-y-8">
            <article className="surface-panel rounded-[2rem] p-6 sm:p-8">
              <p className="eyebrow">Unit Details</p>
              <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
                {unit.title}
              </h1>
              {unit.summary ? (
                <p className="font-copy mt-4 text-base leading-8 text-[var(--muted-foreground)]">
                  {unit.summary}
                </p>
              ) : null}

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {unit.monthlyRentLabel ? (
                  <div className="stat-chip rounded-[1.4rem] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      Rent
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold text-[var(--primary)]">
                      {unit.monthlyRentLabel}
                    </p>
                  </div>
                ) : null}
                {unit.areaLabel ? (
                  <div className="stat-chip rounded-[1.4rem] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      Area
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold text-stone-950">
                      {unit.areaLabel}
                    </p>
                  </div>
                ) : null}
                {unit.roomsLabel ? (
                  <div className="stat-chip rounded-[1.4rem] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      Rooms
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold text-stone-950">
                      {unit.roomsLabel}
                    </p>
                  </div>
                ) : null}
              </div>
            </article>

            <article className="surface-panel rounded-[2rem] p-6 sm:p-8">
              <ProjectGallery images={unit.gallery} />
            </article>

            <article className="surface-panel rounded-[2rem] p-6 sm:p-8">
              <p className="eyebrow">Amenities</p>
              <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_260px]">
                <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-4">
                  {unit.amenityGroups.slice(0, 4).map((group) => (
                    <div key={group.title}>
                      <h2 className="text-base font-semibold text-stone-950">
                        {group.title}
                      </h2>
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

                <div className="space-y-6">
                  <div>
                    <h2 className="text-base font-semibold text-stone-950">Beds</h2>
                    <div className="mt-4 grid gap-3">
                      {unit.beds.map((bed) => (
                        <div
                          key={bed.label}
                          className="rounded-[1.2rem] bg-[rgba(141,104,71,0.05)] p-4"
                        >
                          <p className="text-sm font-semibold text-stone-950">
                            {bed.label}
                          </p>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            {bed.roomLabel}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </article>

            {mapUrl ? (
              <article className="surface-panel rounded-[2rem] p-6 sm:p-8">
                <p className="eyebrow">Location</p>
                <div className="mt-6 overflow-hidden rounded-[1.5rem] border border-[var(--border)]">
                  <iframe
                    title={`${unit.title} location`}
                    src={mapUrl}
                    className="h-[24rem] w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </article>
            ) : null}
          </section>

          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="surface-panel rounded-[1.75rem] p-5 sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Rent
              </p>
              {unit.monthlyRentLabel ? (
                <p className="mt-2 text-3xl font-semibold text-stone-950">
                  {unit.monthlyRentLabel}
                </p>
              ) : null}

              {unit.availableFromLabel ? (
                <div className="mt-5 rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                    Available from
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-950">
                    {unit.availableFromLabel}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 rounded-[1.2rem] bg-[rgba(141,104,71,0.05)] p-4">
                <p className="text-sm font-semibold text-stone-950">
                  {project.developerName}
                </p>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Ask for this apartment specifically if the admin has attached extra unit-level notes or availability details.
                </p>
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
