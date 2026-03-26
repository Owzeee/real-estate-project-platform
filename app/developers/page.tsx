import { DeveloperCard } from "@/features/developers/developer-card";
import { getDevelopers } from "@/features/developers/queries";

type DevelopersPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function DevelopersPage({
  searchParams,
}: DevelopersPageProps) {
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
          <p className="eyebrow">Developer Network</p>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-tight text-stone-950 sm:text-6xl">
            Trusted development brands
          </h1>
          <p className="font-copy mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Explore the developers behind the projects, including verification status, public profile content, and current marketplace exposure.
          </p>

          <form className="surface-panel mt-8 max-w-2xl rounded-[1.75rem] p-4 sm:p-5">
            <label className="field-label">Search developers</label>
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search developer, website, or description"
              className="field-input"
            />
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-wrap gap-3 text-xs font-semibold uppercase tracking-[0.18em]">
          <span className="stat-chip rounded-full px-4 py-2 text-stone-700">
            {filteredDevelopers.length} visible developer{filteredDevelopers.length === 1 ? "" : "s"}
          </span>
          <span className="stat-chip rounded-full px-4 py-2 text-stone-700">
            {filteredDevelopers.filter((developer) => developer.isVerified).length} verified
          </span>
        </div>

        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {filteredDevelopers.map((developer) => (
            <DeveloperCard key={developer.id} developer={developer} />
          ))}
        </div>

        {filteredDevelopers.length === 0 ? (
          <article className="mt-10 rounded-[1.75rem] border border-dashed border-[var(--border)] bg-[rgba(255,255,255,0.55)] p-10 text-center text-sm text-[var(--muted-foreground)]">
            No developers matched the current search term.
          </article>
        ) : null}
      </div>
    </main>
  );
}
