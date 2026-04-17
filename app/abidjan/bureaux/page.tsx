import type { Metadata } from "next";
import Link from "next/link";

import { ProjectCard } from "@/features/projects/project-card";
import { getProjects } from "@/features/projects/queries";
import { absoluteUrl, buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Bureaux et Commerces à Abidjan",
  description:
    "Découvrez des bureaux, commerces et actifs professionnels à Abidjan avec visibilité cartographique, prix et promoteurs.",
  path: "/abidjan/bureaux",
  keywords: [
    "bureau abidjan",
    "bureau a louer abidjan",
    "commerce abidjan",
    "immobilier professionnel abidjan",
  ],
});

export default async function AbidjanOfficePage() {
  const projects = await getProjects();
  const officeProjects = projects.filter(
    (project) =>
      project.category === "office" ||
      project.category === "commercial" ||
      project.projectType === "commercial" ||
      project.projectType === "mixed_use",
  );

  return (
    <main className="page-shell min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildBreadcrumbJsonLd([
              { name: "Accueil", path: "/" },
              { name: "Abidjan", path: "/abidjan" },
              { name: "Bureaux", path: "/abidjan/bureaux" },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "CollectionPage",
              name: "Bureaux et Commerces à Abidjan",
              url: absoluteUrl("/abidjan/bureaux"),
              description:
                "Découvrez des bureaux, commerces et actifs professionnels à Abidjan avec visibilité cartographique, prix et promoteurs.",
              mainEntity: {
                "@type": "ItemList",
                itemListElement: officeProjects.slice(0, 12).map((project, index) => ({
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
          <p className="eyebrow">Bureaux Abidjan</p>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Bureaux, commerces et actifs professionnels &agrave; Abidjan
          </h1>
          <p className="font-copy mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Une entr&eacute;e SEO d&eacute;di&eacute;e aux recherches de bureaux, commerces
            et immobilier professionnel pour Abidjan et son march&eacute; d&apos;investissement.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/projects" className="primary-button text-sm">
              Voir tous les projets
            </Link>
            <Link href="/abidjan" className="secondary-button text-sm">
              Retour &agrave; Abidjan
            </Link>
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/abidjan/terrains" className="border border-[var(--border)] bg-white/80 px-5 py-4 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]">
              Voir aussi les terrains à Abidjan
            </Link>
            <Link href="/developers" className="border border-[var(--border)] bg-white/80 px-5 py-4 text-sm font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]">
              Voir les promoteurs
            </Link>
          </div>
        </section>

        <section className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {officeProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </section>
      </div>
    </main>
  );
}
