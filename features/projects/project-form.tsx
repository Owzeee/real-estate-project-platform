"use client";

import { useActionState, useMemo } from "react";

import {
  createProject,
  createProjectInitialState,
} from "@/features/projects/actions";

type DeveloperOption = {
  id: string;
  companyName: string;
};

type ProjectFormProps = {
  developers: DeveloperOption[];
};

const projectTypes = [
  "apartment",
  "villa",
  "townhouse",
  "mixed_use",
  "commercial",
  "land",
] as const;

const completionStages = [
  "pre_launch",
  "under_construction",
  "ready",
  "completed",
] as const;

const statuses = ["draft", "active", "sold_out", "archived"] as const;

export function ProjectForm({ developers }: ProjectFormProps) {
  const [state, formAction, isPending] = useActionState(
    createProject,
    createProjectInitialState,
  );

  const hasDevelopers = useMemo(() => developers.length > 0, [developers.length]);

  return (
    <form action={formAction} className="space-y-8">
      <section className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Developer profile
          </label>
          <select
            name="developerProfileId"
            required
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
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Project title
          </label>
          <input
            name="title"
            required
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
            placeholder="aurora-residences"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Description
          </label>
          <textarea
            name="description"
            required
            rows={5}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Location
          </label>
          <input
            name="location"
            required
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
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Country
          </label>
          <input
            name="country"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Currency code
          </label>
          <input
            name="currencyCode"
            defaultValue="USD"
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
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Project type
          </label>
          <select
            name="projectType"
            required
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
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          >
            {completionStages.map((completionStage) => (
              <option key={completionStage} value={completionStage}>
                {completionStage.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Visibility status
          </label>
          <select
            name="status"
            required
            defaultValue="draft"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          >
            {statuses.map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Image URLs
          </label>
          <textarea
            name="imageUrls"
            rows={5}
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
            placeholder="One URL per line"
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
      </section>

      <div className="flex flex-col gap-4 border-t border-stone-200 pt-6">
        <button
          type="submit"
          disabled={isPending || !hasDevelopers}
          className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Creating project..." : "Create project"}
        </button>
        {!hasDevelopers ? (
          <p className="text-sm text-amber-800">
            No developer profiles were found. Create a developer profile row in
            Supabase before adding projects.
          </p>
        ) : null}
        {state.message ? (
          <p
            className={`text-sm ${
              state.status === "success" ? "text-emerald-700" : "text-amber-800"
            }`}
          >
            {state.message}
          </p>
        ) : null}
      </div>
    </form>
  );
}
