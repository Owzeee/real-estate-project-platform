import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { CompanyLogo } from "@/components/shared/company-logo";
import { InquiryForm } from "@/features/inquiries/inquiry-form";
import { InteractiveListingsMap } from "@/features/projects/interactive-listings-map";
import { ProjectGallery } from "@/features/projects/project-gallery";
import { PropertyCompareActions } from "@/features/projects/property-compare-actions";
import { PropertySaveActions } from "@/features/projects/property-save-actions";
import { ProjectSaveActions } from "@/features/projects/project-save-actions";
import {
  buildBreadcrumbJsonLd,
  buildMetadata,
  absoluteUrl,
} from "@/lib/seo";
import {
  buildVirtualTourEmbedUrl,
  formatCategoryLabel,
  formatCompletionStageLabel,
  formatOfferTypeLabel,
  formatProjectTypeLabel,
  formatStatusLabel,
  getProjectAmenityGroups,
  getProjectHighlights,
  getProjectNarrative,
  getProjectUnits,
  getProjectVideoMedia,
  getProjectVirtualTourMedia,
} from "@/features/projects/presentation";
import { getProjectBySlug, getProjects } from "@/features/projects/queries";
import { getTranslations } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";
import { formatProjectPricing } from "@/lib/utils/format-price";

type ProjectPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

type SummaryStat = {
  label: string;
  value: string;
  accent: boolean;
};

export async function generateMetadata({ params }: ProjectPageProps): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);

  if (!project) {
    return buildMetadata({
      title: "Projet Immobilier",
      description: "Fiche projet immobilier en Côte d'Ivoire.",
      path: `/projects/${slug}`,
    });
  }

  return buildMetadata({
    title: `${project.title} | ${project.location}`,
    description: `${project.title} par ${project.developerName} à ${project.location}. Consultez les prix, la carte, les médias et les détails du projet.`,
    path: `/projects/${project.slug}`,
    image: project.heroMediaUrl ?? undefined,
    keywords: [
      project.title,
      project.location,
      `${project.projectType} ${project.location}`,
      `${project.offerType === "rent" ? "location" : "vente"} ${project.location}`,
    ],
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const locale = await getCurrentLocale();
  const t = getTranslations(locale);
  const { slug } = await params;
  const [project, allProjects] = await Promise.all([
    getProjectBySlug(slug),
    getProjects(),
  ]);

  if (!project) {
    notFound();
  }

  const mapItems =
    project.latitude != null && project.longitude != null
      ? [
          {
            id: project.id,
            title: project.title,
            subtitle: `${project.location} • ${project.developerName}`,
            href: `/projects/${project.slug}`,
            latitude: project.latitude,
            longitude: project.longitude,
            accentLabel: t.projectDetail.projectLocation,
          },
        ]
      : [];
  const virtualTour = getProjectVirtualTourMedia(project);
  const virtualTourEmbedUrl = virtualTour
    ? buildVirtualTourEmbedUrl(virtualTour.fileUrl)
    : null;
  const launchVideo = getProjectVideoMedia(project);
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
  const summaryStats = [
    project.offerType === "rent" ||
    project.priceMode === "contact" ||
    project.minPrice != null ||
    project.maxPrice != null ||
    project.rentPrice != null
      ? {
          label: project.offerType === "rent" ? t.projectDetail.rent : t.projectDetail.pricing,
          value: formatProjectPricing({
            offerType: project.offerType,
            priceMode: project.priceMode,
            fixedPrice: project.minPrice,
            minPrice: project.minPrice,
            maxPrice: project.maxPrice,
            rentPrice: project.rentPrice,
            currencyCode: project.currencyCode,
          }),
          accent: true,
        }
      : null,
    {
      label: t.projectDetail.marketplaceStatus,
      value: formatStatusLabel(project.status, locale),
      accent: false,
    },
    {
      label: t.projectDetail.inventoryModel,
      value: t.projectDetail.adminCurated,
      accent: false,
    },
  ].filter(Boolean) as SummaryStat[];

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
            ]),
            {
              "@context": "https://schema.org",
              "@type": "RealEstateListing",
              name: project.title,
              description: project.description,
              url: absoluteUrl(`/projects/${project.slug}`),
              image: project.heroMediaUrl ? [project.heroMediaUrl] : undefined,
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
          <Link href="/projects" className="secondary-button px-4 py-2.5 text-sm">
            {t.projectDetail.backToProjects}
          </Link>
          <span>/</span>
          <span>{project.title}</span>
        </div>

        <section className="surface-panel overflow-hidden rounded-[2rem]">
          <div className="grid gap-0 xl:grid-cols-[1.08fr_0.92fr]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-[rgba(198,154,91,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {formatOfferTypeLabel(project.offerType, locale)}
                </span>
                <span className="rounded-full bg-[rgba(141,104,71,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
                  {formatCategoryLabel(project.category, locale)}
                </span>
                <span className="rounded-full bg-[rgba(198,154,91,0.12)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
                  {formatProjectTypeLabel(project.projectType, locale)}
                </span>
                <span className="rounded-full bg-[rgba(141,104,71,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-stone-700">
                  {formatCompletionStageLabel(project.completionStage, locale)}
                </span>
                {project.isFeatured ? (
                  <span className="rounded-full bg-[var(--secondary)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--secondary-foreground)]">
                    {t.projectDetail.featured}
                  </span>
                ) : null}
              </div>

              <h1 className="mt-5 max-w-4xl font-display text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl lg:text-6xl">
                {project.title}
              </h1>
              <p className="mt-4 text-base text-[var(--muted-foreground)]">
                {t.projectDetail.byIn}{" "}
                <Link
                  href={`/developers/${project.developerSlug}`}
                  className="font-semibold text-stone-950 underline decoration-[var(--border)] underline-offset-4"
                >
                  {project.developerName}
                </Link>
                {" "}{t.projectDetail.in} {project.location}
              </p>

              <div className={`mt-8 grid gap-4 ${summaryStats.length > 1 ? "sm:grid-cols-2 lg:grid-cols-3" : ""}`}>
                {summaryStats.map((stat) => (
                  <div key={stat.label} className="stat-chip rounded-[1.4rem] p-5">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      {stat.label}
                    </p>
                    <p className={`mt-2 font-display text-2xl font-semibold ${stat.accent ? "text-[var(--primary)]" : "text-stone-950"}`}>
                      {stat.value}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <ProjectSaveActions project={project} locale={locale} />
                {virtualTour ? (
                  <a
                    href={virtualTourEmbedUrl ? "#virtual-tour" : virtualTour.fileUrl}
                    target={virtualTourEmbedUrl ? undefined : "_blank"}
                    rel={virtualTourEmbedUrl ? undefined : "noreferrer"}
                    className="secondary-button px-4 py-2.5 text-sm"
                  >
                    {t.projectDetail.start3dTour}
                  </a>
                ) : null}
              </div>
            </div>

            <div className="border-t border-[var(--border)] p-4 sm:p-6 xl:border-l xl:border-t-0">
              <ProjectGallery images={galleryImages} />
            </div>
          </div>
        </section>

        <div className="mt-10 grid gap-10 xl:grid-cols-[minmax(0,1.38fr)_minmax(320px,0.62fr)]">
          <section className="space-y-8">
            {virtualTour ? (
              <article
                id="virtual-tour"
                className="surface-panel rounded-[1.9rem] p-7 sm:p-8"
              >
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="eyebrow">{t.projectDetail.virtualTour}</p>
                    <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950">
                      {t.projectDetail.walkThroughTitle}
                    </h2>
                    <p className="font-copy mt-4 max-w-3xl text-base leading-8 text-[var(--muted-foreground)]">
                      {t.projectDetail.walkThroughDescription}
                    </p>
                  </div>
                  <a
                    href={virtualTour.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="secondary-button px-4 py-2.5 text-sm"
                  >
                    {t.projectDetail.openFullViewer}
                  </a>
                </div>

                <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-white">
                  {virtualTourEmbedUrl ? (
                    <iframe
                      title={virtualTour.title ?? `${project.title} virtual tour`}
                      src={virtualTourEmbedUrl}
                      className="h-[34rem] w-full border-0"
                      allow="fullscreen; xr-spatial-tracking; gyroscope; accelerometer"
                      loading="lazy"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                    />
                  ) : (
                    <div className="flex min-h-[26rem] items-center justify-center px-8 py-12 text-center">
                      <div className="max-w-xl">
                        <p className="font-display text-3xl font-semibold text-stone-950">
                          {locale === "fr"
                            ? "Cette visite s'ouvre dans un lecteur externe"
                            : "This tour opens in an external viewer"}
                        </p>
                        <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                          {locale === "fr"
                            ? "Le fournisseur actuel ne propose pas d'URL d'integration directe. Utilisez le bouton ci-dessous pour tester la visite dans son lecteur natif."
                            : "The current tour provider does not expose a direct embed URL. Use the button below to test the tour in its native viewer."}
                        </p>
                        <a
                          href={virtualTour.fileUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="primary-button mt-6 text-sm"
                        >
                          {t.projectDetail.start3dTour}
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            ) : null}

            {launchVideo ? (
              <article className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
                <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
                  <div>
                    <p className="eyebrow">{locale === "fr" ? "Film de presentation" : "Launch film"}</p>
                    <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950">
                      {locale === "fr"
                        ? "Decouvrez le projet en video"
                        : "Preview the project through video"}
                    </h2>
                  </div>
                  <a
                    href={launchVideo.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="secondary-button px-4 py-2.5 text-sm"
                  >
                    {locale === "fr" ? "Ouvrir la video" : "Open video"}
                  </a>
                </div>

                <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-[var(--border)] bg-black">
                  <video
                    controls
                    preload="metadata"
                    className="h-[28rem] w-full bg-black object-cover"
                  >
                    <source src={launchVideo.fileUrl} />
                  </video>
                </div>
              </article>
            ) : null}

            <article className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
              <p className="eyebrow">{locale === "fr" ? "A propos du projet" : "About this project"}</p>
              {project.description ? (
                <p className="font-copy mt-6 text-lg leading-8 text-stone-700">
                  {project.description}
                </p>
              ) : null}
              <p className="font-copy mt-5 text-base leading-8 text-[var(--muted-foreground)]">
                {narrative}
              </p>
            </article>

            <article className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="eyebrow">{locale === "fr" ? "Points forts" : "Key highlights"}</p>
                  <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950">
                    {locale === "fr"
                      ? "Pourquoi ce projet merite l'attention"
                      : "What makes this listing worth attention"}
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
                      {locale === "fr" ? "Atout" : "Highlight"}
                    </p>
                    <p className="mt-3 font-copy text-base leading-7 text-stone-700">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
              <p className="eyebrow">{locale === "fr" ? "Exemples de biens" : "Examples of housing"}</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950">
                {locale === "fr"
                  ? "Explorez des appartements et typologies a l'interieur de ce projet"
                  : "Explore specific apartments and layouts inside this project"}
              </h2>
              <p className="font-copy mt-4 max-w-3xl text-base leading-8 text-[var(--muted-foreground)]">
                {locale === "fr"
                  ? "Chaque option ouvre une fiche dediee avec galerie, equipements, configuration des lits et informations de disponibilite."
                  : "Each option opens a dedicated unit page with image gallery, amenity details, bed setup, and availability information."}
              </p>

              <div className="mt-8 space-y-4">
                {units.map((unit) => (
                  <div
                    key={unit.id}
                    className="rounded-[1.5rem] border border-[var(--border)] bg-white/82 p-4 transition hover:border-[rgba(141,104,71,0.28)] sm:p-5"
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

                      <Link
                        href={`/projects/${project.slug}/units/${unit.slug}`}
                        className="min-w-0 flex-1"
                      >
                        <p className="font-copy text-base leading-7 text-stone-700">
                          {unit.title}
                        </p>
                        <div className="mt-3 flex flex-wrap items-center gap-x-6 gap-y-2">
                          {unit.priceLabel ? (
                            <span className="text-lg font-semibold text-stone-950">
                              {unit.priceLabel}
                            </span>
                          ) : null}
                          {unit.areaLabel ? (
                            <span className="text-sm font-semibold text-stone-700">
                              {unit.areaLabel}
                            </span>
                          ) : null}
                          {unit.roomsLabel ? (
                            <span className="text-sm font-semibold text-stone-700">
                              {unit.roomsLabel}
                            </span>
                          ) : null}
                        </div>
                      </Link>

                      <div className="flex flex-wrap items-center gap-2 sm:max-w-[15rem] sm:justify-end">
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
                        <span className="text-sm font-semibold text-[var(--primary)]">
                          <Link href={`/projects/${project.slug}/units/${unit.slug}`}>
                            {locale === "fr" ? "Voir le bien" : "View apartment"}
                          </Link>
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </article>

            <article className="surface-panel rounded-[1.9rem] p-7 sm:p-8">
              <p className="eyebrow">{locale === "fr" ? "Equipements" : "Amenities"}</p>
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
                  {units[0]?.priceLabel ? (
                    <p className="mt-3 text-lg font-semibold text-stone-950">
                      {units[0].priceLabel}
                    </p>
                  ) : null}
                  <div className="mt-5 space-y-4">
                    {units[0]?.offerType === "rent" && units[0]?.availableFromLabel ? (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                          Available from
                        </p>
                        <p className="mt-1 text-sm font-semibold text-stone-950">
                          {units[0].availableFromLabel}
                        </p>
                      </div>
                    ) : null}
                    {units[0]?.offerType === "rent" && units[0]?.minimumStayLabel ? (
                      <div>
                        <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                          Minimum stay
                        </p>
                        <p className="mt-1 text-sm font-semibold text-stone-950">
                          {units[0].minimumStayLabel}
                        </p>
                      </div>
                    ) : null}
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

              {mapItems.length > 0 ? (
                <div className="mt-8 overflow-hidden rounded-[1.75rem] border border-[var(--border)]">
                  <InteractiveListingsMap
                    items={mapItems}
                    selectedId={project.id}
                    className="h-[26rem] w-full"
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
            <div className="surface-panel ml-auto rounded-[1.75rem] p-5 sm:max-w-[22rem] sm:p-6">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                Contact card
              </p>
              {units[0]?.priceLabel ? (
                <p className="mt-3 text-2xl font-semibold text-stone-950">
                  {units[0].priceLabel}
                </p>
              ) : null}

              {units[0]?.offerType === "rent" && units[0]?.availableFromLabel ? (
                <div className="mt-5 rounded-[1.2rem] border border-[var(--border)] bg-white px-4 py-3">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                    Available from
                  </p>
                  <p className="mt-1 text-sm font-semibold text-stone-950">
                    {units[0].availableFromLabel}
                  </p>
                </div>
              ) : null}

              <div className="mt-5 rounded-[1.2rem] bg-[rgba(141,104,71,0.05)] p-4">
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-1">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-[var(--muted-foreground)]">
                      Developer
                    </p>
                    <div className="mt-2 flex items-center gap-3">
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
