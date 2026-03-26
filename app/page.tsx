import Link from "next/link";

import { DeveloperCard } from "@/features/developers/developer-card";
import { getDevelopers } from "@/features/developers/queries";
import { ProjectCard } from "@/features/projects/project-card";
import { getFeaturedProjects } from "@/features/projects/queries";

export default async function Home() {
  const [featuredProjects, developers] = await Promise.all([
    getFeaturedProjects(),
    getDevelopers(),
  ]);

  const stats = [
    { label: "Featured Projects", value: String(featuredProjects.length) },
    { label: "Marketplace Developers", value: String(developers.length) },
    {
      label: "Verified Brands",
      value: String(developers.filter((developer) => developer.isVerified).length),
    },
  ];

  return (
    <main className="page-shell min-h-screen bg-transparent">
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(198,154,91,0.16),transparent_28%),radial-gradient(circle_at_bottom_left,rgba(141,104,71,0.12),transparent_32%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-14 px-4 py-16 sm:px-6 md:grid-cols-[1.08fr_0.92fr] md:items-center md:py-24 lg:px-8">
          <div className="space-y-8">
            <div className="space-y-6">
              <p className="eyebrow">Curated Real Estate Marketplace</p>
              <h1 className="max-w-4xl font-display text-5xl font-bold leading-[0.95] tracking-tight text-stone-950 sm:text-6xl lg:text-7xl">
                Discover development projects through a marketplace that is finally easy to browse.
              </h1>
              <p className="font-copy max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
                Browse media-rich real estate developments, compare credible developers, and move from discovery to inquiry without fighting the interface.
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <Link href="/projects" className="primary-button px-7 py-3.5 text-sm">
                Explore projects
              </Link>
              <Link href="/developers" className="secondary-button px-7 py-3.5 text-sm">
                View developers
              </Link>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div key={stat.label} className="stat-chip rounded-[1.5rem] p-5">
                  <p className="font-display text-4xl font-bold text-[var(--primary)]">{stat.value}</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[28rem]">
            <div className="absolute inset-0 rounded-[2rem] bg-[linear-gradient(145deg,rgba(141,104,71,0.94),rgba(32,28,25,0.98))] shadow-[0_40px_100px_rgba(32,28,25,0.25)]" />
            <div className="absolute inset-0 rounded-[2rem] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]" />
            <div className="absolute right-6 top-6 rounded-full bg-[rgba(255,255,255,0.12)] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/80">
              Built For Project Discovery
            </div>
            <div className="relative flex h-full flex-col justify-between p-8 text-white sm:p-10">
              <div>
                <div className="grid gap-3 sm:grid-cols-2">
                  {[
                    "Live projects",
                    "Developer profiles",
                    "Feature filters",
                    "Inquiry capture",
                  ].map((item) => (
                    <div key={item} className="rounded-full border border-white/10 bg-white/8 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/84">
                      {item}
                    </div>
                  ))}
                </div>

                <div className="mt-8 grid gap-4">
                  {[
                    {
                      title: "Fast to scan",
                      body: "Clear sections, stronger spacing, and direct calls to action make the marketplace immediately usable.",
                    },
                    {
                      title: "Built for media",
                      body: "Images, brochures, videos, and 3D tours fit naturally into the project model.",
                    },
                    {
                      title: "Built for growth",
                      body: "Featured placement, map-ready coordinates, and structured filtering are already modeled.",
                    },
                  ].map((item) => (
                    <article
                      key={item.title}
                      className="rounded-[1.5rem] border border-white/10 bg-white/7 p-5 backdrop-blur-sm"
                    >
                      <h2 className="font-display text-2xl font-semibold">{item.title}</h2>
                      <p className="mt-3 text-sm leading-7 text-white/78">{item.body}</p>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Featured Developments</p>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
              Exceptional projects ready for buyer attention
            </h2>
            <p className="font-copy mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
              These projects are already connected to live Supabase data, approval flow, featured placement, and inquiry capture.
            </p>
          </div>
          <Link href="/projects" className="secondary-button px-6 py-3 text-sm">
            Explore all projects
          </Link>
        </div>

        <div className="mt-12 grid gap-8 lg:grid-cols-3">
          {featuredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      </section>

      <section className="border-y border-[var(--border)] bg-[rgba(255,255,255,0.55)]">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="eyebrow">Marketplace Developers</p>
              <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
                Distinct company profiles with real project exposure
              </h2>
              <p className="font-copy mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
                Each developer gets a public-facing profile, project ownership, inquiry routing, and an admin-managed verification status.
              </p>
            </div>
            <Link
              href="/developers"
              className="inline-flex items-center rounded-full bg-[var(--secondary)] px-6 py-3 text-sm font-semibold text-[var(--secondary-foreground)] hover:bg-[color-mix(in_srgb,var(--secondary)_88%,black)]"
            >
              Meet developers
            </Link>
          </div>

          <div className="mt-12 grid gap-8 lg:grid-cols-2">
            {developers.map((developer) => (
              <DeveloperCard key={developer.id} developer={developer} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
