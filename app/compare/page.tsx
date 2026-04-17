import type { Metadata } from "next";

import { CompareWorkspace } from "@/features/projects/compare-workspace";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Comparatif de Projets et Biens",
  description:
    "Comparez les projets et les biens cote a cote, avec les principaux details, prix et caracteristiques.",
  path: "/compare",
  noIndex: true,
});

export default function ComparePage() {
  return (
    <main className="page-shell min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <CompareWorkspace />
      </div>
    </main>
  );
}
