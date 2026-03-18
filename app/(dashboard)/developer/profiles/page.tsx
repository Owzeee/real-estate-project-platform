import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { getDevelopersWithAllProjects } from "@/features/developers/queries";

export default async function DeveloperProfilesPage() {
  const developers = await getDevelopersWithAllProjects();

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <SectionHeading
          eyebrow="Developer Dashboard"
          title="Manage developer profiles"
          description="Update company names, public profile copy, website links, and branding before projects go live."
        />

        <div className="mt-10 grid gap-6">
          {developers.map((developer) => (
            <article
              key={developer.id}
              className="rounded-[2rem] border border-stone-900/10 bg-white p-6 shadow-[0_20px_60px_rgba(41,37,36,0.08)]"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                <div>
                  <h2 className="text-2xl font-semibold tracking-tight text-stone-950">
                    {developer.companyName}
                  </h2>
                  <p className="mt-2 text-sm text-stone-600">{developer.slug}</p>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-stone-700">
                    {developer.description ?? "No company description added yet."}
                  </p>
                </div>
                <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
                  <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
                    {developer.projects.length} projects
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 ${
                      developer.isVerified
                        ? "bg-emerald-100 text-emerald-900"
                        : "bg-amber-100 text-amber-950"
                    }`}
                  >
                    {developer.isVerified ? "Verified" : "Pending verification"}
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href={`/developer/profiles/${developer.id}/edit`}
                  className="text-sm font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
                >
                  Edit profile
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
