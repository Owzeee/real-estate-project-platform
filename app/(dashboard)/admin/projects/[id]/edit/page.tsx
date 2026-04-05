import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/shared/section-heading";
import { getDevelopersWithAllProjects } from "@/features/developers/queries";
import { updateProject } from "@/features/projects/actions";
import { ProjectForm } from "@/features/projects/project-form";
import type { ProjectFormValues } from "@/features/projects/project-form-shared";
import { getProjectById } from "@/features/projects/queries";
import { requireAdmin } from "@/lib/auth";

type AdminEditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function AdminEditProjectPage({
  params,
}: AdminEditProjectPageProps) {
  await requireAdmin();
  const { id } = await params;
  const [project, developers] = await Promise.all([
    getProjectById(id),
    getDevelopersWithAllProjects(),
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
    offerType: project.offerType,
    category: project.category,
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
    units: project.units.map((unit) => ({
      title: unit.title,
      slug: unit.slug,
      summary: unit.summary ?? "",
      monthlyRent: unit.monthlyRent?.toString() ?? "",
      areaSqm: unit.areaSqm?.toString() ?? "",
      rooms: unit.rooms?.toString() ?? "",
      availableFrom: unit.availableFrom?.slice(0, 10) ?? "",
      minimumStayMonths: unit.minimumStayMonths?.toString() ?? "6",
      maximumStayMonths: unit.maximumStayMonths?.toString() ?? "12",
      imageUrl: unit.imageUrl ?? "",
      galleryUrls: unit.gallery.map((item) => item.src).join("\n"),
      essentials:
        unit.amenityGroups.find((group) => group.title === "Essentials")?.items.join("\n") ??
        "",
      kitchen:
        unit.amenityGroups.find((group) => group.title === "Kitchen")?.items.join("\n") ??
        "",
      bedroom:
        unit.amenityGroups.find((group) => group.title === "Bedroom")?.items.join("\n") ??
        "",
      bathroom:
        unit.amenityGroups.find((group) => group.title === "Bathroom")?.items.join("\n") ??
        "",
      other:
        unit.amenityGroups.find((group) => group.title === "Other")?.items.join("\n") ??
        "",
      beds: unit.beds.map((bed) => bed.label).join("\n"),
    })),
  };

  return (
    <main className="min-h-screen bg-transparent px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Admin"
            title={`Edit ${project.title}`}
            description="Update the project, change its developer assignment, and manage the unit-level properties inside it."
          />
          <Link
            href="/admin/projects"
            className="text-sm font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
          >
            Back to admin projects
          </Link>
        </div>

        <section className="mt-10 rounded-[2rem] border border-[rgba(141,104,71,0.12)] bg-[var(--card)] p-8 shadow-[0_24px_70px_rgba(32,28,25,0.08)] sm:p-10">
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
