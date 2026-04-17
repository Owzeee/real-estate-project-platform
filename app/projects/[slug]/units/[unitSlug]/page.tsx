import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CompanyLogo } from "@/components/shared/company-logo";
import { InquiryForm } from "@/features/inquiries/inquiry-form";
import { InteractiveListingsMap } from "@/features/projects/interactive-listings-map";
import { ProjectGallery } from "@/features/projects/project-gallery";
import { PropertyCompareActions } from "@/features/projects/property-compare-actions";
import { PropertySaveActions } from "@/features/projects/property-save-actions";
import { getProjectUnitBySlug } from "@/features/projects/presentation";
import { getProjectBySlug, getProjects } from "@/features/projects/queries";
import { getTranslations } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

type ProjectUnitPageProps = {
  params: Promise<{
    slug: string;
    unitSlug: string;
  }>;
};

export async function generateStaticParams() {
  const projects = await getProjects();
  const detailedProjects = await Promise.all(
    projects.map((project) => getProjectBySlug(project.slug)),
  );

  return detailedProjects.flatMap((project) =>
    project
      ? project.units.map((unit) => ({
          slug: project.slug,
          unitSlug: unit.slug,
        }))
      : [],
  );
}

export async function generateMetadata({
  params,
}: ProjectUnitPageProps): Promise<Metadata> {
  const { slug, unitSlug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return buildMetadata({
      title: "Bien Immobilier",
      description: "Fiche detail d'un bien immobilier en Côte d'Ivoire.",
      path: `/projects/${slug}/units/${unitSlug}`,
    });
  }

  const unit = getProjectUnitBySlug(project, unitSlug);

  if (!unit) {
    return buildMetadata({
      title: `${project.title} | Bien`,
      description: `Details d'un bien dans le projet ${project.title}.`,
      path: `/projects/${slug}/units/${unitSlug}`,
      image: project.heroMediaUrl ?? undefined,
    });
  }

  return buildMetadata({
    title: `${unit.title} | ${project.title}`,
    description: `${unit.title} dans ${project.title} a ${project.location}. Consultez le prix, la surface, les equipements et la localisation.`,
    path: `/projects/${project.slug}/units/${unit.slug}`,
    image: unit.imageUrl ?? project.heroMediaUrl ?? undefined,
    keywords: [
      unit.title,
      project.title,
      project.location,
      `${project.offerType === "rent" ? "location" : "vente"} ${project.location}`,
    ],
  });
}

export default async function ProjectUnitPage({ params }: ProjectUnitPageProps) {
  const locale = await getCurrentLocale();
  const t = getTranslations(locale);
  const { slug, unitSlug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    notFound();
  }

  const unit = getProjectUnitBySlug(project, unitSlug);

  if (!unit) {
    notFound();
  }

  const mapItems =
    project.latitude != null && project.longitude != null
      ? [
          {
            id: unit.id,
            title: unit.title,
            subtitle: `${project.location} • ${project.developerName}`,
            href: `/projects/${project.slug}/units/${unit.slug}`,
            latitude: project.latitude,
            longitude: project.longitude,
            accentLabel: t.unitDetail.unitLocation,
          },
        ]
      : [];

  return (
    <main className="page-shell min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildBreadcrumbJsonLd([
              { name: "Accueil", path: "/" },
              { name: "Projets", path: "/projects" },
              { name: project.title, path: `/projects/${project.slug}` },
              { name: unit.title, path: `/projects/${project.slug}/units/${unit.slug}` },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              name: unit.title,
              description: unit.summary,
              url: absoluteUrl(`/projects/${project.slug}/units/${unit.slug}`),
              image: unit.imageUrl ? [unit.imageUrl] : project.heroMediaUrl ? [project.heroMediaUrl] : undefined,
              address: {
                "@type": "PostalAddress",
                addressLocality: project.city ?? undefined,
                addressCountry: project.country ?? "CI",
                streetAddress: project.location,
              },
              seller: {
                "@type": "Organization",
                name: project.developerName,
              },
            },
          ]),
        }}
      />
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <Link
            href={`/projects/${project.slug}`}
            className="secondary-button px-4 py-2.5 text-sm"
          >
            {t.unitDetail.backToProject}
          </Link>
          <span>/</span>
          <span>{unit.title}</span>
        </div>

        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.42fr)_minmax(300px,0.58fr)]">
          <section className="space-y-8">
            <article className="surface-panel p-6 sm:p-8">
              <p className="eyebrow">{t.unitDetail.unitDetails}</p>
              <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
                {unit.title}
              </h1>
              {unit.summary ? (
                <p className="font-copy mt-4 text-base leading-8 text-[var(--muted-foreground)]">
                  {unit.summary}
                </p>
              ) : null}

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {unit.priceLabel ? (
                  <div className="stat-chip p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      {unit.priceHeading}
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold text-[var(--primary)]">
                      {unit.priceLabel}
                    </p>
                  </div>
                ) : null}
                {unit.areaLabel ? (
                  <div className="stat-chip p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      {t.unitDetail.area}
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold text-stone-950">
                      {unit.areaLabel}
                    </p>
                  </div>
                ) : null}
                {unit.roomsLabel ? (
                  <div className="stat-chip p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      {t.unitDetail.rooms}
                    </p>
                    <p className="mt-2 font-display text-2xl font-semibold text-stone-950">
                      {unit.roomsLabel}
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <PropertySaveActions
                  locale={locale}
                  property={{
                    id: unit.id,
                    projectSlug: project.slug,
                    projectTitle: project.title,
                    propertySlug: unit.slug,
                    title: unit.title,
                    developerName: project.developerName,
                    location: project.location,
                    latitude: project.latitude,
                    longitude: project.longitude,
                    offerType: unit.offerType,
                    priceLabel: unit.priceLabel,
                    areaLabel: unit.areaLabel,
                    roomsLabel: unit.roomsLabel,
                    availableFromLabel: unit.availableFromLabel,
                    minimumStayLabel: unit.minimumStayLabel,
                    maximumStayLabel: unit.maximumStayLabel,
                    imageUrl: unit.imageUrl,
                    beds: unit.beds,
                    amenityGroups: unit.amenityGroups,
                  }}
                />
                <PropertyCompareActions
                  locale={locale}
                  property={{
                    id: unit.id,
                    projectSlug: project.slug,
                    projectTitle: project.title,
                    propertySlug: unit.slug,
                    title: unit.title,
                    developerName: project.developerName,
                    location: project.location,
                    latitude: project.latitude,
                    longitude: project.longitude,
                    offerType: unit.offerType,
                    priceLabel: unit.priceLabel,
                    areaLabel: unit.areaLabel,
                    roomsLabel: unit.roomsLabel,
                    availableFromLabel: unit.availableFromLabel,
                    minimumStayLabel: unit.minimumStayLabel,
                    maximumStayLabel: unit.maximumStayLabel,
                    imageUrl: unit.imageUrl,
                    beds: unit.beds,
                    amenityGroups: unit.amenityGroups,
                  }}
                />
              </div>
            </article>

            <article className="surface-panel p-6 sm:p-8">
              <ProjectGallery images={unit.gallery} />
            </article>

            <article className="surface-panel p-6 sm:p-8">
              <p className="eyebrow">{t.unitDetail.amenities}</p>
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
                            <span className="mt-1 inline-flex h-5 w-5 items-center justify-center border border-emerald-300 text-xs text-emerald-600">
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
                    <h2 className="text-base font-semibold text-stone-950">{t.unitDetail.beds}</h2>
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

            {mapItems.length > 0 ? (
              <article className="surface-panel p-6 sm:p-8">
                <p className="eyebrow">{t.unitDetail.location}</p>
                <div className="mt-6 overflow-hidden border border-[var(--border)]">
                  <InteractiveListingsMap
                    items={mapItems}
                    selectedId={unit.id}
                    className="h-[24rem] w-full"
                  />
                </div>
              </article>
            ) : null}
          </section>

          <aside className="xl:sticky xl:top-28 xl:self-start">
            <div className="surface-panel ml-auto p-5 sm:max-w-[21rem] sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                {unit.priceHeading}
              </p>
              {unit.priceLabel ? (
                <p className="mt-2 text-3xl font-semibold text-stone-950">
                  {unit.priceLabel}
                </p>
              ) : null}

              {unit.offerType === "rent" && unit.availableFromLabel ? (
                <div className="mt-5 border border-[var(--border)] bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                    {t.unitDetail.availableFrom}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-950">
                    {unit.availableFromLabel}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 bg-[rgba(141,104,71,0.05)] p-4">
                <div className="flex items-center gap-3">
                  <CompanyLogo
                    companyName={project.developerName}
                    logoUrl={project.developerLogoUrl}
                    className="h-10 w-10"
                    imageClassName="rounded-xl border border-[var(--border)] object-cover"
                    fallbackClassName="rounded-xl border border-[var(--border)] bg-[linear-gradient(145deg,var(--primary),color-mix(in_srgb,var(--primary)_72%,black))] text-xs font-bold text-[var(--primary-foreground)]"
                  />
                  <p className="text-sm font-semibold text-stone-950">
                    {project.developerName}
                  </p>
                </div>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  {t.unitDetail.developerNote}
                </p>
              </div>

              <div className="mt-5">
                <InquiryForm projectId={project.id} locale={locale} />
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
