"use client";

import { useActionState, useMemo } from "react";

import { createProjectInitialState, type ProjectActionState } from "@/features/projects/action-state";
import { ProjectFormFields } from "@/features/projects/project-form-fields";
import type {
  DeveloperOption,
  ProjectFormValues,
} from "@/features/projects/project-form-shared";
import { emptyProjectFormValues } from "@/features/projects/project-form-shared";

type ProjectFormProps = {
  action: (
    state: ProjectActionState,
    payload: FormData,
  ) => Promise<ProjectActionState>;
  developers: DeveloperOption[];
  initialValues?: ProjectFormValues;
  submitLabel: string;
  pendingLabel: string;
};

export function ProjectForm({
  action,
  developers,
  initialValues = emptyProjectFormValues,
  submitLabel,
  pendingLabel,
}: ProjectFormProps) {
  const [state, formAction, isPending] = useActionState(
    action,
    createProjectInitialState,
  );

  const hasDevelopers = useMemo(() => developers.length > 0, [developers.length]);

  return (
    <form action={formAction} className="space-y-8">
      <ProjectFormFields
        developers={developers}
        hasDevelopers={hasDevelopers}
        initialValues={initialValues}
      />

      <div className="flex flex-col gap-4 border-t border-stone-200 pt-6">
        <button
          type="submit"
          disabled={isPending || !hasDevelopers}
          className="rounded-full bg-stone-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-stone-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isPending ? pendingLabel : submitLabel}
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
