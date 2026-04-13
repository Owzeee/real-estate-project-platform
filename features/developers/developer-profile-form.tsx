"use client";

import { useState } from "react";
import { useActionState } from "react";

import { CompanyLogo } from "@/components/shared/company-logo";
import {
  type DeveloperProfileActionState,
} from "@/features/developers/actions";
import { initialDeveloperProfileActionState } from "@/features/developers/action-state";
import type { DeveloperProfile } from "@/features/developers/types";

type DeveloperProfileFormProps = {
  action: (
    state: DeveloperProfileActionState,
    payload: FormData,
  ) => Promise<DeveloperProfileActionState>;
  developer: DeveloperProfile;
};

export function DeveloperProfileForm({
  action,
  developer,
}: DeveloperProfileFormProps) {
  const [logoUrl, setLogoUrl] = useState(developer.logoUrl ?? "");
  const [state, formAction, isPending] = useActionState(
    action,
    initialDeveloperProfileActionState,
  );

  return (
    <form action={formAction} className="space-y-6">
      <input type="hidden" name="developerId" value={developer.id} />

      <div className="grid gap-5 md:grid-cols-2">
        <div className="md:col-span-2">
          <div className="rounded-[1.5rem] border border-stone-200 bg-stone-50 p-5">
            <p className="text-sm font-medium text-stone-700">Logo preview</p>
            <div className="mt-4 flex items-center gap-4">
              <CompanyLogo
                companyName={developer.companyName}
                logoUrl={logoUrl}
                className="h-20 w-20"
                imageClassName="rounded-[1.35rem] border border-stone-200 object-cover"
                fallbackClassName="rounded-[1.35rem] bg-stone-950 text-lg font-semibold text-stone-100"
              />
              <p className="text-sm leading-7 text-stone-600">
                Paste a square logo URL for the cleanest result across cards, profile pages, and dashboard surfaces.
              </p>
            </div>
          </div>
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Company name
          </label>
          <input
            name="companyName"
            required
            defaultValue={developer.companyName}
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
            defaultValue={developer.slug}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Description
          </label>
          <textarea
            name="description"
            rows={5}
            defaultValue={developer.description ?? ""}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm leading-7 text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Website URL
          </label>
          <input
            name="websiteUrl"
            type="url"
            defaultValue={developer.websiteUrl ?? ""}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium text-stone-700">
            Logo URL
          </label>
          <input
            name="logoUrl"
            type="url"
            value={logoUrl}
            onChange={(event) => setLogoUrl(event.target.value)}
            className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
          />
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-stone-200 pt-6">
        <button
          type="submit"
          disabled={isPending}
          className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? "Saving profile..." : "Save profile"}
        </button>
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
