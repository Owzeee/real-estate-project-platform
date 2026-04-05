"use client";

import { useState } from "react";

import type { ProjectUnitFormValue } from "@/features/projects/project-form-shared";

type ProjectUnitsEditorProps = {
  initialUnits: ProjectUnitFormValue[];
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function createEmptyUnit(): ProjectUnitFormValue {
  return {
    title: "",
    slug: "",
    summary: "",
    monthlyRent: "",
    areaSqm: "",
    rooms: "",
    availableFrom: "",
    minimumStayMonths: "6",
    maximumStayMonths: "12",
    imageUrl: "",
    galleryUrls: "",
    essentials: "",
    kitchen: "",
    bedroom: "",
    bathroom: "",
    other: "",
    beds: "",
  };
}

export function ProjectUnitsEditor({ initialUnits }: ProjectUnitsEditorProps) {
  const [units, setUnits] = useState<ProjectUnitFormValue[]>(
    initialUnits.length > 0 ? initialUnits : [createEmptyUnit()],
  );

  const updateUnit = (
    index: number,
    key: keyof ProjectUnitFormValue,
    value: string,
  ) => {
    setUnits((current) =>
      current.map((unit, unitIndex) => {
        if (unitIndex !== index) {
          return unit;
        }

        const next = { ...unit, [key]: value };

        if (key === "title" && !unit.slug) {
          next.slug = slugify(value);
        }

        if (key === "slug") {
          next.slug = slugify(value);
        }

        return next;
      }),
    );
  };

  const addUnit = () => setUnits((current) => [...current, createEmptyUnit()]);
  const removeUnit = (index: number) =>
    setUnits((current) => current.filter((_, unitIndex) => unitIndex !== index));

  return (
    <section className="space-y-6">
      <input type="hidden" name="unitsJson" value={JSON.stringify(units)} />

      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-stone-950">Project properties</p>
          <p className="mt-1 text-sm text-stone-600">
            Add the apartments or units that belong to this project.
          </p>
        </div>
        <button
          type="button"
          onClick={addUnit}
          className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900"
        >
          Add property
        </button>
      </div>

      <div className="space-y-6">
        {units.map((unit, index) => (
          <article
            key={`${unit.slug || "unit"}-${index}`}
            className="rounded-[1.75rem] border border-stone-200 bg-white p-6"
          >
            <div className="flex items-center justify-between gap-4">
              <h3 className="font-display text-2xl font-semibold text-stone-950">
                Property {index + 1}
              </h3>
              {units.length > 1 ? (
                <button
                  type="button"
                  onClick={() => removeUnit(index)}
                  className="rounded-full border border-stone-300 bg-white px-4 py-2 text-sm font-semibold text-stone-900"
                >
                  Remove
                </button>
              ) : null}
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Property title
                </label>
                <input
                  value={unit.title}
                  onChange={(event) => updateUnit(index, "title", event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Property slug
                </label>
                <input
                  value={unit.slug}
                  onChange={(event) => updateUnit(index, "slug", event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Summary
                </label>
                <textarea
                  rows={3}
                  value={unit.summary}
                  onChange={(event) => updateUnit(index, "summary", event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm leading-7 text-stone-950 outline-none transition focus:border-stone-950"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Monthly rent
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={unit.monthlyRent}
                  onChange={(event) => updateUnit(index, "monthlyRent", event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Area (sqm)
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={unit.areaSqm}
                  onChange={(event) => updateUnit(index, "areaSqm", event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Rooms
                </label>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={unit.rooms}
                  onChange={(event) => updateUnit(index, "rooms", event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Available from
                </label>
                <input
                  type="date"
                  value={unit.availableFrom}
                  onChange={(event) => updateUnit(index, "availableFrom", event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Minimum stay (months)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={unit.minimumStayMonths}
                  onChange={(event) =>
                    updateUnit(index, "minimumStayMonths", event.target.value)
                  }
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Maximum stay (months)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={unit.maximumStayMonths}
                  onChange={(event) =>
                    updateUnit(index, "maximumStayMonths", event.target.value)
                  }
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Cover image URL
                </label>
                <input
                  value={unit.imageUrl}
                  onChange={(event) => updateUnit(index, "imageUrl", event.target.value)}
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                />
              </div>
              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-stone-700">
                  Gallery image URLs
                </label>
                <textarea
                  rows={4}
                  value={unit.galleryUrls}
                  onChange={(event) => updateUnit(index, "galleryUrls", event.target.value)}
                  placeholder="One URL per line"
                  className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                />
              </div>
            </div>

            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {[
                ["essentials", "Essentials"],
                ["kitchen", "Kitchen"],
                ["bedroom", "Bedroom"],
                ["bathroom", "Bathroom"],
                ["other", "Other"],
                ["beds", "Beds"],
              ].map(([key, label]) => (
                <div key={key}>
                  <label className="mb-2 block text-sm font-medium text-stone-700">
                    {label}
                  </label>
                  <textarea
                    rows={5}
                    value={unit[key as keyof ProjectUnitFormValue] as string}
                    onChange={(event) =>
                      updateUnit(
                        index,
                        key as keyof ProjectUnitFormValue,
                        event.target.value,
                      )
                    }
                    placeholder="One item per line"
                    className="w-full rounded-2xl border border-stone-300 bg-white px-4 py-3 text-sm text-stone-950 outline-none transition focus:border-stone-950"
                  />
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
