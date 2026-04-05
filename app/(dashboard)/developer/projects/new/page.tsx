import Link from "next/link";

import { SectionHeading } from "@/components/shared/section-heading";
import { createProject } from "@/features/projects/actions";
import { ProjectForm } from "@/features/projects/project-form";
import { emptyAmenitySelectionMap } from "@/features/projects/project-form-shared";
import { requireDeveloper } from "@/lib/auth";

export default async function NewProjectPage() {
  const auth = await requireDeveloper();

  return (
    <main className="min-h-screen bg-transparent px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 lg:grid-cols-[0.42fr_1fr]">
          <section className="rounded-[1.9rem] bg-[linear-gradient(145deg,rgba(141,104,71,0.94),rgba(32,28,25,0.98))] p-8 text-white shadow-[0_32px_90px_rgba(32,28,25,0.22)]">
            <SectionHeading
              eyebrow="Developer Dashboard"
              title="Create a new project"
              description="Publish a premium development record with pricing, media, and location details ready for admin review."
            />
            <div className="mt-8 space-y-4 text-sm leading-7 text-white/78">
              <p>Your project will be saved immediately with pending approval.</p>
              <p>Use strong cover imagery, a clean slug, and clear pricing to make moderation and buyer conversion easier.</p>
              <Link
                href="/developer/projects"
                className="inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-semibold text-white hover:bg-white/8"
              >
                Back to dashboard
              </Link>
            </div>
          </section>

          <section className="rounded-[2rem] border border-[rgba(141,104,71,0.12)] bg-[var(--card)] p-8 shadow-[0_24px_70px_rgba(32,28,25,0.08)] sm:p-10">
            <ProjectForm
              action={createProject}
              developers={[
                {
                  id: auth.developerProfile.id,
                  companyName: auth.developerProfile.companyName,
                },
              ]}
              initialValues={{
                developerProfileId: auth.developerProfile.id,
                title: "",
                slug: "",
                description: "",
                location: "",
                city: "",
                country: "",
                currencyCode: "USD",
                minPrice: "",
                maxPrice: "",
                latitude: "",
                longitude: "",
                offerType: "sale",
                category: "residential",
                projectType: "apartment",
                completionStage: "pre_launch",
                status: "draft",
                imageUrls: "",
                videoUrls: "",
                brochureUrls: "",
                tour3dUrls: "",
                amenities: emptyAmenitySelectionMap,
                units: [],
              }}
              submitLabel="Create project"
              pendingLabel="Creating project..."
            />
          </section>
        </div>
      </div>
    </main>
  );
}
