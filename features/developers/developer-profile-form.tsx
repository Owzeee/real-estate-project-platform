"use client";

import { useActionState } from "react";

import { saveDeveloperProfile } from "@/features/developers/actions";
import { developerProfileInitialState } from "@/features/developers/state";

type DeveloperProfileFormProps = {
  initialValues?: {
    companyName?: string;
    slug?: string;
    description?: string;
    websiteUrl?: string;
    logoUrl?: string;
  };
};

export function DeveloperProfileForm({
  initialValues,
}: DeveloperProfileFormProps) {
  const [state, formAction, isPending] = useActionState(
    saveDeveloperProfile,
    developerProfileInitialState,
  );

  return (
    <form action={formAction} className="space-y-5">
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">
          Company name
        </label>
        <input
          name="companyName"
          required
          defaultValue={initialValues?.companyName}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">
          Slug
        </label>
        <input
          name="slug"
          required
          defaultValue={initialValues?.slug}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">
          Description
        </label>
        <textarea
          name="description"
          rows={5}
          defaultValue={initialValues?.description}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">
          Website URL
        </label>
        <input
          name="websiteUrl"
          defaultValue={initialValues?.websiteUrl}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
        />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium text-stone-700">
          Logo URL
        </label>
        <input
          name="logoUrl"
          defaultValue={initialValues?.logoUrl}
          className="w-full rounded-2xl border border-stone-300 px-4 py-3 text-sm outline-none focus:border-stone-950"
        />
      </div>
      <button
        type="submit"
        disabled={isPending}
        className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white"
      >
        {isPending ? "Saving profile..." : "Save developer profile"}
      </button>
      {state.message ? (
        <p
          className={`text-sm ${
            state.status === "error" ? "text-amber-800" : "text-emerald-700"
          }`}
        >
          {state.message}
        </p>
      ) : null}
    </form>
  );
}
