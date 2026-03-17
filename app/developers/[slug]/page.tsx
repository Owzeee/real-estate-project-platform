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
          <SectionHeading
            eyebrow="Developer Profile"
            title={developer.companyName}
            description={
              developer.description ??
              "Company profile details will be added by the developer team."
            }
          />
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-stone-700">
            <span>{developer.projects.length} published projects</span>
            <span>
              {developer.isVerified ? "Verified developer" : "Verification pending"}
            </span>
            {developer.websiteUrl ? <a href={developer.websiteUrl}>{developer.websiteUrl}</a> : null}
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
        </section>
      </div>
    </main>
  );
}
