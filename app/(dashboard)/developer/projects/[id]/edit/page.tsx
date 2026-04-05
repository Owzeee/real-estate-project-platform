import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionHeading } from "@/components/shared/section-heading";
import { updateProject } from "@/features/projects/actions";
import { ProjectForm } from "@/features/projects/project-form";
import { ProjectMediaManager } from "@/features/projects/project-media-manager";
import type { ProjectFormValues } from "@/features/projects/project-form-shared";
import { emptyAmenitySelectionMap } from "@/features/projects/project-form-shared";
import { getProjectById } from "@/features/projects/queries";
import { requireDeveloper } from "@/lib/auth";

type EditProjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  const auth = await requireDeveloper();
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project || project.developerProfileId !== auth.developerProfile.id) {
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
    priceMode: project.priceMode,
    fixedPrice:
      project.priceMode === "fixed" && project.minPrice != null
        ? project.minPrice.toString()
        : "",
    minPrice: project.minPrice?.toString() ?? "",
    maxPrice: project.maxPrice?.toString() ?? "",
    rentPrice: project.rentPrice?.toString() ?? "",
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
    amenities: {
      ...emptyAmenitySelectionMap,
      ...Object.fromEntries(
        project.amenityGroups.map((group: { title: string; items: string[] }) => [
          group.title.toLowerCase(),
          group.items,
        ]),
      ),
    },
    units: project.units.map((unit) => ({
      title: unit.title,
      slug: unit.slug,
      summary: unit.summary ?? "",
      offerType: unit.offerType,
      priceMode: unit.priceMode,
      fixedPrice: unit.fixedPrice?.toString() ?? "",
      minPrice: unit.minPrice?.toString() ?? "",
      maxPrice: unit.maxPrice?.toString() ?? "",
      monthlyRent: unit.monthlyRent?.toString() ?? "",
      areaSqm: unit.areaSqm?.toString() ?? "",
      rooms: unit.rooms?.toString() ?? "",
      availableFrom: unit.availableFrom?.slice(0, 10) ?? "",
      minimumStayMonths: unit.minimumStayMonths?.toString() ?? "6",
      maximumStayMonths: unit.maximumStayMonths?.toString() ?? "12",
      imageUrl: unit.imageUrl ?? "",
      galleryUrls: unit.gallery.map((item) => item.src).join("\n"),
      amenities: {
        ...emptyAmenitySelectionMap,
        ...Object.fromEntries(
          unit.amenityGroups.map((group: { title: string; items: string[] }) => [
            group.title.toLowerCase(),
            group.items,
          ]),
        ),
      },
      beds: unit.beds.map((bed) => bed.label).join("\n"),
    })),
  };

  return (
    <main className="min-h-screen bg-[linear-gradient(180deg,#f7f2e8_0%,#ffffff_100%)] px-6 py-12 sm:px-10">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <SectionHeading
            eyebrow="Developer Dashboard"
            title={`Edit ${project.title}`}
            description="Update project content, pricing, media, and visibility while keeping ownership tied to your developer profile."
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
            developers={[
              {
                id: auth.developerProfile.id,
                companyName: auth.developerProfile.companyName,
              },
            ]}
            initialValues={initialValues}
            submitLabel="Save changes"
            pendingLabel="Saving changes..."
          />
        </section>

        <section className="mt-10 rounded-[2rem] border border-stone-900/10 bg-white p-8 shadow-[0_20px_60px_rgba(41,37,36,0.08)] sm:p-10">
          <SectionHeading
            eyebrow="Project Media"
            title="Manage gallery order"
            description="Reorder assets, choose the cover media used on project cards, or remove outdated media without re-entering every field."
          />
          <div className="mt-8">
            <ProjectMediaManager projectId={project.id} media={project.media} />
          </div>
        </section>
      </div>
    </main>
  );
}
