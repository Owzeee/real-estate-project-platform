import type { Metadata } from "next";

import { DeveloperCard } from "@/features/developers/developer-card";
import { getDevelopers } from "@/features/developers/queries";
import { getTranslations } from "@/lib/i18n";
import { getCurrentLocale } from "@/lib/i18n-server";
import { buildMetadata } from "@/lib/seo";

export const metadata: Metadata = buildMetadata({
  title: "Promoteurs Immobiliers à Abidjan et en Côte d'Ivoire",
  description:
    "Explorez les promoteurs et marques immobilières présents sur la plateforme, avec leurs projets actifs et leur visibilité marché en Côte d'Ivoire.",
  path: "/developers",
  keywords: [
    "promoteurs immobiliers abidjan",
    "promoteur cote d'ivoire",
    "developer immobilier abidjan",
  ],
});

type DevelopersPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function DevelopersPage({
  searchParams,
}: DevelopersPageProps) {
  const locale = await getCurrentLocale();
  const t = getTranslations(locale);
  const developers = await getDevelopers();
  const params = (await searchParams) ?? {};
  const query = params.q?.toLowerCase().trim() ?? "";

  const filteredDevelopers = developers.filter((developer) => {
    if (!query) {
      return true;
    }

    return (
      developer.companyName.toLowerCase().includes(query) ||
      (developer.description ?? "").toLowerCase().includes(query) ||
      (developer.websiteUrl ?? "").toLowerCase().includes(query)
    );
  });

  return (
    <main className="page-shell min-h-screen bg-transparent">
      <section className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.55)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="eyebrow">{t.developersPage.eyebrow}</p>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-tight text-stone-950 sm:text-6xl">
            {t.developersPage.title}
          </h1>
          <p className="font-copy mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            {t.developersPage.description}
          </p>

          <form className="surface-panel mt-8 max-w-2xl rounded-[1.75rem] p-4 sm:p-5">
            <label className="field-label">{t.developersPage.search}</label>
            <input
              name="q"
              defaultValue={params.q}
              placeholder={t.developersPage.searchPlaceholder}
              className="field-input"
            />
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
          <span className="stat-chip rounded-full px-4 py-2 text-stone-700">
            {filteredDevelopers.length} {t.developersPage.visibleDevelopers}
          </span>
          <span className="stat-chip rounded-full px-4 py-2 text-stone-700">
            {filteredDevelopers.filter((developer) => developer.isVerified).length} {t.developersPage.verified}
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {filteredDevelopers.map((developer) => (
            <DeveloperCard key={developer.id} developer={developer} locale={locale} />
          ))}
        </div>

        {filteredDevelopers.length === 0 ? (
          <article className="mt-10 rounded-[1.75rem] border border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-10 text-center text-sm text-[var(--muted-foreground)]">
            {t.developersPage.noResults}
          </article>
        ) : null}
      </div>
    </main>
  );
}
