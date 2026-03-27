import Link from "next/link";

import { DeveloperCard } from "@/features/developers/developer-card";
import { buildMapEmbedUrl } from "@/features/projects/presentation";
import { getDevelopers } from "@/features/developers/queries";
import { ProjectCard } from "@/features/projects/project-card";
import { getFeaturedProjects } from "@/features/projects/queries";

export default async function Home() {
  const [featuredProjects, developers] = await Promise.all([
    getFeaturedProjects(),
    getDevelopers(),
  ]);
  const luxuryHeroImage =
    "https://images.unsplash.com/photo-1511818966892-d7d671e672a2?auto=format&fit=crop&w=1800&q=80";
  const mapProject = featuredProjects[0] ?? null;
  const mapProjectUrl = mapProject ? buildMapEmbedUrl(mapProject) : null;

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
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: `linear-gradient(rgba(22,18,14,0.18),rgba(22,18,14,0.24)), url(${luxuryHeroImage})`,
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(250,248,243,0.58)_0%,rgba(250,248,243,0.38)_34%,rgba(250,248,243,0.14)_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.22),transparent_24%),radial-gradient(circle_at_bottom_right,rgba(198,154,91,0.16),transparent_28%)]" />
        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.82fr_1.18fr] lg:items-end lg:px-8 lg:py-20">
          <div className="max-w-xl rounded-[2rem] border border-white/55 bg-[rgba(255,251,245,0.72)] p-7 shadow-[0_24px_70px_rgba(32,28,25,0.14)] backdrop-blur-md sm:p-8">
            <p className="eyebrow">Curated Real Estate Marketplace</p>
            <h1 className="mt-5 font-display text-4xl font-bold leading-tight tracking-tight text-stone-950 sm:text-5xl">
              Admin-managed inventory with a cleaner discovery experience.
            </h1>
            <p className="font-copy mt-5 text-base leading-8 text-[var(--muted-foreground)] sm:text-lg">
              Browse serious development projects, compare credible brands, and move into inquiry without the noise of an open listings marketplace.
            </p>

            <div className="mt-7 flex flex-wrap gap-4">
              <Link href="/projects" className="primary-button px-7 py-3.5 text-sm">
                Explore projects
              </Link>
              <Link href="/developers" className="secondary-button px-7 py-3.5 text-sm">
                View developers
              </Link>
            </div>

            <div className="mt-7 grid gap-4 sm:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[1.4rem] border border-white/60 bg-[rgba(255,255,255,0.74)] p-4 shadow-[0_12px_30px_rgba(32,28,25,0.08)]"
                >
                  <p className="font-display text-3xl font-bold text-[var(--primary)]">{stat.value}</p>
                  <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.24em] text-[var(--muted-foreground)]">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative min-h-[34rem] lg:min-h-[38rem]">
            <div className="absolute inset-0 rounded-[2.25rem] bg-[linear-gradient(145deg,rgba(141,104,71,0.94),rgba(32,28,25,0.98))] shadow-[0_40px_100px_rgba(32,28,25,0.25)]" />
            <div className="absolute inset-0 rounded-[2.25rem] bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.12),transparent_28%)]" />
            <div className="relative flex h-full flex-col justify-between p-8 text-white sm:p-10">
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  "Admin created",
                  "Map browsing",
                  "Developer profiles",
                  "Inquiry capture",
                ].map((item) => (
                  <div key={item} className="rounded-full border border-white/10 bg-white/8 px-4 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-white/84">
                    {item}
                  </div>
                ))}
              </div>

              {mapProject && mapProjectUrl ? (
                <div className="mt-8 overflow-hidden rounded-[1.8rem] border border-white/10 bg-white/6">
                  <div className="flex items-center justify-between px-5 py-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-white/70">
                        Map Spotlight
                      </p>
                      <p className="mt-2 font-display text-3xl font-semibold">
                        {mapProject.title}
                      </p>
                    </div>
                    <Link
                      href="/projects?view=map"
                      className="rounded-full border border-white/12 px-4 py-2 text-sm font-semibold text-white/88 hover:bg-white/10"
                    >
                      Explore map
                    </Link>
                  </div>
                  <iframe
                    title={`${mapProject.title} map preview`}
                    src={mapProjectUrl}
                    className="h-72 w-full border-0 sm:h-80"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Featured Developments</p>
            <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
              Curated projects prepared for serious buyer attention
            </h2>
            <p className="font-copy mt-5 max-w-2xl text-lg leading-8 text-[var(--muted-foreground)]">
              Featured inventory is controlled through the platform, surfaced with location context, and paired with direct developer inquiry workflows.
            </p>
          </div>
          <Link href="/projects" className="secondary-button px-6 py-3 text-sm">
            Explore project map
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
