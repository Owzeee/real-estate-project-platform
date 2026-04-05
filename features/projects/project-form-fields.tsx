"use client";

import { useMemo, useState } from "react";

import { ProjectUnitsEditor } from "@/features/projects/project-units-editor";
import type {
  DeveloperOption,
  ProjectFormValues,
} from "@/features/projects/project-form-shared";
import {
  completionStages,
  projectCategories,
  projectOfferTypes,
  projectStatuses,
  projectTypes,
} from "@/features/projects/project-form-shared";

type ProjectFormFieldsProps = {
  developers: DeveloperOption[];
  hasDevelopers: boolean;
  initialValues: ProjectFormValues;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

export function ProjectFormFields({
  developers,
  hasDevelopers,
  initialValues,
}: ProjectFormFieldsProps) {
  const singleDeveloper = developers.length === 1 ? developers[0] : null;
  const [title, setTitle] = useState(initialValues.title);
  const [slug, setSlug] = useState(initialValues.slug);
  const [slugTouched, setSlugTouched] = useState(Boolean(initialValues.slug));

  const generatedSlug = useMemo(() => slugify(title), [title]);

  return (
    <>
      <section className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5 text-sm text-stone-600">
        <p className="font-semibold text-stone-950">Publishing checklist</p>
        <p className="mt-2">
          Use a clean title and slug, keep status as draft until the content is ready, and add at least one image so the marketplace card has a strong cover.
        </p>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Developer profile
          </label>
          {singleDeveloper ? (
            <>
              <input type="hidden" name="developerProfileId" value={singleDeveloper.id} />
              <div className="rounded-2xl border border-stone-300 bg-stone-50 px-4 py-3 text-sm font-medium text-stone-950">
                {singleDeveloper.companyName}
              </div>
            </>
          ) : (
            <select
              name="developerProfileId"
              required
              defaultValue={initialValues.developerProfileId}
              disabled={!hasDevelopers}
              className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950 disabled:bg-stone-100"
            >
              <option value="">Select developer</option>
              {developers.map((developer) => (
                <option key={developer.id} value={developer.id}>
                  {developer.companyName}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Project title
          </label>
          <input
            name="title"
            required
            value={title}
            onChange={(event) => {
              const nextTitle = event.target.value;
              setTitle(nextTitle);

              if (!slugTouched) {
                setSlug(slugify(nextTitle));
              }
            }}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Slug
          </label>
          <input
            name="slug"
            required
            value={slug}
            onChange={(event) => {
              setSlugTouched(true);
              setSlug(slugify(event.target.value));
            }}
            placeholder="aurora-residences"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
          <p className="mt-2 text-xs text-stone-500">
            URL preview: <span className="font-medium text-stone-700">/projects/{slug || generatedSlug || "your-project-slug"}</span>
          </p>
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Description
          </label>
          <textarea
            name="description"
            required
            rows={5}
            defaultValue={initialValues.description}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm leading-7 text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Location
          </label>
          <input
            name="location"
            required
            defaultValue={initialValues.location}
            placeholder="Dubai Marina, Dubai"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            City
          </label>
          <input
            name="city"
            defaultValue={initialValues.city}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Country
          </label>
          <input
            name="country"
            defaultValue={initialValues.country}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Currency code
          </label>
          <input
            name="currencyCode"
            defaultValue={initialValues.currencyCode}
            maxLength={3}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm uppercase text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Minimum price
          </label>
          <input
            name="minPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialValues.minPrice}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Maximum price
          </label>
          <input
            name="maxPrice"
            type="number"
            step="0.01"
            min="0"
            defaultValue={initialValues.maxPrice}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Latitude
          </label>
          <input
            name="latitude"
            type="number"
            step="0.000001"
            defaultValue={initialValues.latitude}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Longitude
          </label>
          <input
            name="longitude"
            type="number"
            step="0.000001"
            defaultValue={initialValues.longitude}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Listing intent
          </label>
          <select
            name="offerType"
            required
            defaultValue={initialValues.offerType}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          >
            {projectOfferTypes.map((offerType) => (
              <option key={offerType} value={offerType}>
                {offerType === "sale" ? "For sale" : "For rent"}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Asset category
          </label>
          <select
            name="category"
            required
            defaultValue={initialValues.category}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          >
            {projectCategories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Project type
          </label>
          <select
            name="projectType"
            required
            defaultValue={initialValues.projectType}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          >
            {projectTypes.map((projectType) => (
              <option key={projectType} value={projectType}>
                {projectType.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Completion stage
          </label>
          <select
            name="completionStage"
            required
            defaultValue={initialValues.completionStage}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          >
            {completionStages.map((completionStage) => (
              <option key={completionStage} value={completionStage}>
                {completionStage.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Visibility status
          </label>
          <select
            name="status"
            required
            defaultValue={initialValues.status}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          >
            {projectStatuses.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
          <p className="mt-2 text-xs text-stone-500">
            Draft keeps the project private until approved. Approved projects are automatically switched to active by admin moderation.
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Upload images
          </label>
          <input
            name="imageFiles"
            type="file"
            accept="image/*"
            multiple
            className="w-full rounded-2xl border border-dashed border-stone-300 px-4 py-3 text-sm text-stone-700"
          />
          <p className="mt-2 text-xs text-stone-500">Best for cover images and gallery presentation.</p>
        </div>
        <div className="rounded-[1.5rem] border border-stone-200 bg-white p-5">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Upload brochures or videos
          </label>
          <input
            name="attachmentFiles"
            type="file"
            accept="image/*,video/*,.pdf"
            multiple
            className="w-full rounded-2xl border border-dashed border-stone-300 px-4 py-3 text-sm text-stone-700"
          />
          <p className="mt-2 text-xs text-stone-500">Use this for PDFs, videos, and any other supporting campaign assets.</p>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Image URLs
          </label>
          <textarea
            name="imageUrls"
            rows={5}
            defaultValue={initialValues.imageUrls}
            placeholder="One URL per line"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Video URLs
          </label>
          <textarea
            name="videoUrls"
            rows={5}
            defaultValue={initialValues.videoUrls}
            placeholder="One URL per line"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Brochure URLs
          </label>
          <textarea
            name="brochureUrls"
            rows={4}
            defaultValue={initialValues.brochureUrls}
            placeholder="One URL per line"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            3D tour URLs
          </label>
          <textarea
            name="tour3dUrls"
            rows={4}
            defaultValue={initialValues.tour3dUrls}
            placeholder="One URL per line"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
      </section>

      <ProjectUnitsEditor initialUnits={initialValues.units} />
    </>
  );
}
