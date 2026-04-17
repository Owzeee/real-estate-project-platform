import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { CompanyLogo } from "@/components/shared/company-logo";
import { SectionHeading } from "@/components/shared/section-heading";
import { getDeveloperBySlug, getDevelopers } from "@/features/developers/queries";
import { ProjectCard } from "@/features/projects/project-card";
import {
  absoluteUrl,
  buildBreadcrumbJsonLd,
  buildMetadata,
} from "@/lib/seo";

type DeveloperPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export async function generateStaticParams() {
  const developers = await getDevelopers();

  return developers.map((developer) => ({
    slug: developer.slug,
  }));
}

export async function generateMetadata({
  params,
}: DeveloperPageProps): Promise<Metadata> {
  const { slug } = await params;
  const developer = await getDeveloperBySlug(slug);

  if (!developer) {
    return buildMetadata({
      title: "Promoteur Immobilier",
      description: "Profil promoteur immobilier en Côte d'Ivoire.",
      path: `/developers/${slug}`,
    });
  }

  return buildMetadata({
    title: `${developer.companyName} | Promoteur immobilier`,
    description: `${developer.companyName} présente ses projets, sa visibilité marché et son profil public sur Immo Neuf.`,
    path: `/developers/${developer.slug}`,
    image: developer.logoUrl ?? undefined,
    keywords: [
      developer.companyName,
      `promoteur immobilier ${developer.companyName}`,
      "promoteur immobilier abidjan",
    ],
  });
}

export default async function DeveloperPage({ params }: DeveloperPageProps) {
  const { slug } = await params;
  const developer = await getDeveloperBySlug(slug);

  if (!developer) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f8f5ee_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            buildBreadcrumbJsonLd([
              { name: "Accueil", path: "/" },
              { name: "Promoteurs", path: "/developers" },
              { name: developer.companyName, path: `/developers/${developer.slug}` },
            ]),
            {
              "@context": "https://schema.org",
              "@type": "Organization",
              name: developer.companyName,
              url: absoluteUrl(`/developers/${developer.slug}`),
              logo: developer.logoUrl ?? undefined,
              sameAs: developer.websiteUrl ? [developer.websiteUrl] : undefined,
            },
          ]),
        }}
      />
      <div className="mx-auto max-w-6xl">
        <section className="rounded-[2rem] border border-stone-900/10 bg-white p-8 shadow-[0_20px_60px_rgba(41,37,36,0.08)]">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex items-start gap-5">
              <CompanyLogo
                companyName={developer.companyName}
                logoUrl={developer.logoUrl}
                imageClassName="rounded-[1.5rem] border border-stone-200 object-cover"
                fallbackClassName="rounded-[1.5rem] bg-stone-950 text-xl font-semibold text-stone-100"
              />
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
            <article className="mt-8 border border-dashed border-stone-300 bg-stone-50 p-8 text-sm text-stone-600">
              No approved projects are visible for this developer yet.
            </article>
          ) : null}
        </section>
      </div>
    </main>
  );
}
