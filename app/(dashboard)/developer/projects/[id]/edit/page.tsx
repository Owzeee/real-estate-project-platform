import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/shared/section-heading";
import { getDevelopers } from "@/features/developers/queries";
import { updateProject } from "@/features/projects/actions";
import { ProjectForm } from "@/features/projects/project-form";
import type { ProjectFormValues } from "@/features/projects/project-form-shared";
import { getProjectById } from "@/features/projects/queries";

type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const { id } = await params;
  const [developers, project] = await Promise.all([
    getDevelopers(),
    getProjectById(id),
  ]);

  if (!project) {
    notFound();
  }

  const initialValues: ProjectFormValues = {
    developerProfileId: project.developerProfileId,
    title: project.title,
    slug: project.slug,
    description: project.description,
    location: project.location,
    city: project.city ?? "",
    country: project.country ?? "",
    currencyCode: project.currencyCode,
    minPrice: project.minPrice?.toString() ?? "",
    maxPrice: project.maxPrice?.toString() ?? "",
    latitude: project.latitude?.toString() ?? "",
    longitude: project.longitude?.toString() ?? "",
    projectType: project.projectType,
    completionStage: project.completionStage,
    status: project.status,
    imageUrls: project.media
      .filter((item) => item.mediaType === "image")
      .map((item) => item.fileUrl)
      .join("\n"),
    videoUrls: project.media
      .filter((item) => item.mediaType === "video")
      .map((item) => item.fileUrl)
      .join("\n"),
    brochureUrls: project.media
      .filter((item) => item.mediaType === "brochure")
      .map((item) => item.fileUrl)
      .join("\n"),
    tour3dUrls: project.media
      .filter((item) => item.mediaType === "tour_3d")
      .map((item) => item.fileUrl)
      .join("\n"),
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Developer Dashboard"
            title={`Edit ${project.title}`}
            description="Update project content, media links, pricing, and visibility. Approval state is managed separately by admins."
          />
          <Link
            href="/developer/projects"
            className="text-sm font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
          >
            Back to dashboard
          </Link>
        </div>

        <section className="mt-10 rounded-[2rem] border border-stone-900/10 bg-white p-8 shadow-[0_20px_60px_rgba(41,37,36,0.08)] sm:p-10">
          <ProjectForm
            action={async (state, formData) => {
              "use server";
              formData.set("projectId", project.id);
              return updateProject(state, formData);
            }}
            developers={developers.map((developer) => ({
              id: developer.id,
              companyName: developer.companyName,
            }))}
            initialValues={initialValues}
            submitLabel="Save changes"
            pendingLabel="Saving changes..."
          />
        </section>
      </div>
    </main>
  );
}
