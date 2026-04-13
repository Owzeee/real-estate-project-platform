import type { Metadata } from "next";
import Link from "next/link";

import { buildBreadcrumbJsonLd, buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Immobilier en Côte d'Ivoire",
  description:
    "Plateforme de projets immobiliers, promoteurs, terrains, bureaux et actifs résidentiels pour le marché de Côte d'Ivoire.",
  path: "/cote-divoire",
  keywords: [
    "immobilier cote d'ivoire",
    "programme immobilier cote d'ivoire",
    "terrain cote d'ivoire",
  ],
});

export default function CoteDivoirePage() {
  const contentBlocks = [
    "Programmes neufs résidentiels",
    "Terrains à vendre",
    "Bureaux et commerce",
    "Profils promoteurs",
  ];

  return (
    <main className="page-shell min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            buildBreadcrumbJsonLd([
              { name: "Accueil", path: "/" },
              { name: "Côte d'Ivoire", path: "/cote-divoire" },
            ]),
          ),
        }}
      />
      <div className="mx-auto max-w-7xl">
        <section className="surface-panel rounded-[2rem] p-8 sm:p-10">
          <p className="eyebrow">C&ocirc;te d&apos;Ivoire</p>
          <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
            Plateforme immobili&egrave;re pens&eacute;e pour la C&ocirc;te d&apos;Ivoire
          </h1>
          <p className="font-copy mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Immo Neuf est structur&eacute; pour capter la recherche locale autour d&apos;Abidjan
            et du march&eacute; ivoirien: visibilit&eacute; projet, comparaison, d&eacute;couverte par carte
            et exposition des promoteurs s&eacute;rieux.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {contentBlocks.map((item) => (
              <div
                key={item}
                className="rounded-[1.3rem] border border-[var(--border)] bg-white/80 p-5 text-sm font-semibold text-stone-900"
              >
                {item}
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/abidjan" className="primary-button text-sm">
              Explorer Abidjan
            </Link>
            <Link href="/projects" className="secondary-button text-sm">
              Tous les projets
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
