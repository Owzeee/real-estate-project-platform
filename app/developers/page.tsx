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
    <main className="min-h-screen bg-transparent">
      <section className="border-b border-[var(--border)] bg-[rgba(255,255,255,0.55)]">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <p className="inline-flex rounded-full bg-[rgba(198,154,91,0.12)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
            Developer Network
          </p>
          <h1 className="mt-5 font-display text-5xl font-bold tracking-tight text-stone-950 sm:text-6xl">
            Trusted development brands
          </h1>
          <p className="mt-5 max-w-3xl text-lg leading-8 text-[var(--muted-foreground)]">
            Explore the developers behind the projects, including verification status, public profile content, and current marketplace exposure.
          </p>

          <form className="mt-8 max-w-xl">
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Search developer, website, or description"
              className="w-full rounded-2xl border border-[var(--border)] bg-white px-5 py-4 text-sm outline-none focus:border-[var(--primary)]"
            />
          </form>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="mb-8 text-sm text-[var(--muted-foreground)]">
          Showing {filteredDevelopers.length} developer{filteredDevelopers.length === 1 ? "" : "s"}.
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
