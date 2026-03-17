import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { DeveloperCard } from "@/features/developers/developer-card";
import { getDevelopers } from "@/features/developers/queries";
import { ProjectCard } from "@/features/projects/project-card";
import { getFeaturedProjects } from "@/features/projects/queries";

export default async function Home() {
  const [featuredProjects, developers] = await Promise.all([
    getFeaturedProjects(),
    getDevelopers(),
  ]);

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f5ee_0%,#f3ead7_42%,#ffffff_100%)] px-6 py-12 text-stone-900 sm:px-10">
      <div className="mx-auto flex w-full max-w-6xl flex-col gap-14">
        <section className="overflow-hidden rounded-[2.25rem] border border-stone-900/10 bg-white shadow-[0_30px_80px_rgba(41,37,36,0.08)]">
          <div className="grid gap-0 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="p-8 sm:p-10">
              <span className="inline-flex rounded-full border border-amber-900/20 bg-amber-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-amber-950">
                Project Marketplace
              </span>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
                Showcase development projects with premium presentation and
                direct buyer inquiry.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-stone-700 sm:text-lg">
                A billboard-style real estate marketplace for developers,
                investors, and buyers. Built for high-visibility project
                discovery, not individual classifieds.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/projects"
                  className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800"
                >
                  Explore projects
                </Link>
                <Link
                  href="/developers/novastone-developments"
                  className="rounded-full border border-stone-300 px-6 py-3 text-sm font-semibold text-stone-900 transition hover:border-stone-950"
                >
                  View developer profiles
                </Link>
              </div>
            </div>
            <div className="bg-[radial-gradient(circle_at_top,#d6c7ad_0%,#8f7156_45%,#1c1917_100%)] p-8 text-white sm:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-amber-100/90">
                Why This MVP
              </p>
              <div className="mt-6 grid gap-5">
                <article className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <h2 className="text-lg font-semibold">Built for developers</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-100/90">
                    Company-facing profiles, project showcase pages, and
                    approval-ready publishing flow.
                  </p>
                </article>
                <article className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <h2 className="text-lg font-semibold">Built for media</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-100/90">
                    Images, brochures, videos, and 3D tours fit naturally into
                    the project model.
                  </p>
                </article>
                <article className="rounded-[1.5rem] border border-white/10 bg-white/10 p-5 backdrop-blur">
                  <h2 className="text-lg font-semibold">Built for scale</h2>
                  <p className="mt-2 text-sm leading-6 text-stone-100/90">
                    Searchable location fields, featured placement, and map
                    coordinates are already modeled in the database.
                  </p>
                </article>
              </div>
            </div>
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Featured"
            title="High-visibility projects"
            description="These cards are already wired to live Supabase queries when your environment variables are present, with mock fallback data during setup."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {featuredProjects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        <section>
          <SectionHeading
            eyebrow="Developers"
            title="Company profiles ready for marketplace exposure"
            description="Each developer can have a public profile and multiple approved projects without introducing unnecessary company or team tables yet."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-2">
            {developers.map((developer) => (
              <DeveloperCard key={developer.id} developer={developer} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
