/* eslint-disable @next/next/no-img-element */
import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/shared/section-heading";
import { getDeveloperBySlug } from "@/features/developers/queries";
import { ProjectCard } from "@/features/projects/project-card";

type DeveloperPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function DeveloperPage({ params }: DeveloperPageProps) {
  const { slug } = await params;
  const developer = await getDeveloperBySlug(slug);

  if (!developer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f5ee_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] border border-stone-900/10 bg-white p-8 shadow-[0_20px_60px_rgba(41,37,36,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-5">
              {developer.logoUrl ? (
                <img
                  src={developer.logoUrl}
                  alt={`${developer.companyName} logo`}
                  className="h-20 w-20 rounded-[1.5rem] border border-stone-200 object-cover"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-stone-950 text-xl font-semibold text-stone-100">
                  {developer.companyName
                    .split(" ")
                    .slice(0, 2)
                    .map((part: string) => part[0]?.toUpperCase() ?? "")
                    .join("") || "DP"}
                </div>
              )}
              <div>
                <SectionHeading
                  eyebrow="Developer Profile"
                  title={developer.companyName}
                  description={
                    developer.description ??
                    "Company profile details will be added by the developer team."
                  }
                />
              </div>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.16em]">
              <span className="rounded-full bg-stone-100 px-3 py-1 text-stone-700">
                {developer.projects.length} published projects
              </span>
              <span
                className={`rounded-full px-3 py-1 ${
                  developer.isVerified
                    ? "bg-emerald-100 text-emerald-900"
                    : "bg-amber-100 text-amber-950"
                }`}
              >
                {developer.isVerified ? "Verified developer" : "Verification pending"}
              </span>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-stone-700">
            {developer.websiteUrl ? (
              <a
                href={developer.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="font-medium underline decoration-stone-300 underline-offset-4"
              >
                Visit developer website
              </a>
            ) : null}
          </div>
        </section>

        <section className="mt-10">
          <SectionHeading
            title="Published projects"
            description="Projects currently approved for marketplace visibility."
          />
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {developer.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
          {developer.projects.length === 0 ? (
            <article className="mt-8 rounded-[2rem] border border-dashed border-stone-300 bg-stone-50 p-8 text-sm text-stone-600">
              No approved projects are visible for this developer yet.
            </article>
          ) : null}
        </section>
      </div>
    </main>
  );
}
