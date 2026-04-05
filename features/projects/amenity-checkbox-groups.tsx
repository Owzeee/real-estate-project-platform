"use client";

import { amenityOptionGroups, type AmenityGroupKey } from "@/features/projects/amenity-options";
import type { AmenitySelectionMap } from "@/features/projects/project-form-shared";

type AmenityCheckboxGroupsProps = {
  value: AmenitySelectionMap;
  onChange: (next: AmenitySelectionMap) => void;
};

export function AmenityCheckboxGroups({
  value,
  onChange,
}: AmenityCheckboxGroupsProps) {
  const toggle = (groupKey: AmenityGroupKey, option: string) => {
    const current = value[groupKey];
    const nextGroup = current.includes(option)
      ? current.filter((item) => item !== option)
      : [...current, option];

    onChange({
      ...value,
      [groupKey]: nextGroup,
    });
  };

  return (
    <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {amenityOptionGroups.map((group) => (
        <div key={group.key} className="rounded-[1.25rem] border border-stone-200 bg-stone-50 p-4">
          <p className="text-sm font-semibold text-stone-950">{group.title}</p>
          <div className="mt-4 space-y-3">
            {group.options.map((option) => {
              const checked = value[group.key].includes(option);

              return (
                <label key={option} className="flex items-center gap-3 text-sm text-stone-700">
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(group.key, option)}
                    className="h-4 w-4 rounded border-stone-300 text-stone-950"
                  />
                  <span>{option}</span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
