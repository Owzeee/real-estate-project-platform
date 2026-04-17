import type { Metadata } from "next";
import Link from "next/link";

import { ProjectCard } from "@/features/projects/project-card";
import { getProjects } from "@/features/projects/queries";
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Immobilier à Abidjan",
  description:
    "Programmes immobiliers, terrains, bureaux et opportunités d'investissement à Abidjan avec fiches projets, cartes et marques promoteurs.",
  path: "/abidjan",
  keywords: [
    "immobilier abidjan",
    "programme immobilier abidjan",
    "terrain abidjan",
    "bureaux abidjan",
  ],
});

export default async function AbidjanPage() {
  const projects = await getProjects();
  const abidjanProjects = projects.filter(
    (project) =>
      project.location.toLowerCase().includes("abidjan") ||
      (project.city ?? "").toLowerCase().includes("abidjan") ||
      (project.country ?? "").toLowerCase().includes("côte d'ivoire") ||
      (project.country ?? "").toLowerCase().includes("cote d'ivoire"),
  );

  const visibleProjects = abidjanProjects.length > 0 ? abidjanProjects : projects.slice(0, 6);

  return (
    <main className="page-shell min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildBreadcrumbJsonLd([
              { name: "Accueil", path: "/" },
              { name: "Abidjan", path: "/abidjan" },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Immobilier à Abidjan",
              url: absoluteUrl("/abidjan"),
              description:
                "Programmes immobiliers, terrains, bureaux et opportunités d'investissement à Abidjan.",
              mainEntity: {
                "@type": "ItemList",
                itemListElement: visibleProjects.slice(0, 12).map((project, index) => ({
                  "@type": "ListItem",
                  position: index + 1,
                  url: absoluteUrl(`/projects/${project.slug}`),
                  name: project.title,
                })),
              },
            },
          ]),
        }}
      />
      <div className="mx-auto max-w-7xl">
        <section className="surface-panel p-8 sm:p-10">
          <p className="eyebrow">Abidjan</p>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Immobilier neuf, terrains et bureaux à Abidjan
          </h1>
          <p className="font-copy mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Cette page cible la demande immobilière locale à Abidjan: programmes neufs,
            terrains à vendre, bureaux, commerces et projets portés par des marques
            promoteurs visibles et cr&eacute;dibles.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="primary-button text-sm">
              Voir tous les projets
            </Link>
            <Link href="/developers" className="secondary-button text-sm">
              Voir les promoteurs
            </Link>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            <Link href="/abidjan/terrains" className="border border-[var(--border)] bg-white/80 px-5 py-4 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]">
              Terrains à Abidjan
            </Link>
            <Link href="/abidjan/bureaux" className="border border-[var(--border)] bg-white/80 px-5 py-4 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]">
              Bureaux et commerces
            </Link>
            <Link href="/cote-divoire" className="border border-[var(--border)] bg-white/80 px-5 py-4 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]">
              Marché Côte d&apos;Ivoire
            </Link>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="eyebrow">Sélection Locale</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950">
                Projets à suivre pour le march&eacute; d&apos;Abidjan
              </h2>
            </div>
          </div>
          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
            {visibleProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
