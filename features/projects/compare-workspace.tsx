"use client";

import { Fragment, useMemo, useState, useSyncExternalStore } from "react";
import Link from "next/link";

import {
  getProjectCompareRows,
  getPropertyCompareRows,
  useProjectsStore,
} from "@/features/projects/client-store";
import { trackEvent } from "@/lib/analytics";

type CompareTab = "projects" | "properties";

type CompareWorkspaceProps = {
  onClose?: () => void;
  showCloseButton?: boolean;
};

export function CompareWorkspace({
  onClose,
  showCloseButton = false,
}: CompareWorkspaceProps) {
  const {
    projectCompare,
    propertyCompare,
    removeProjectCompare,
    removePropertyCompare,
    clearProjectCompare,
    clearPropertyCompare,
  } = useProjectsStore();
  const [activeTab, setActiveTab] = useState<CompareTab>("projects");
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  const effectiveTab = useMemo<CompareTab>(() => {
    if (activeTab === "projects" && projectCompare.length === 0 && propertyCompare.length > 0) {
      return "properties";
    }

    if (activeTab === "properties" && propertyCompare.length === 0 && projectCompare.length > 0) {
      return "projects";
    }

    return activeTab;
  }, [activeTab, projectCompare.length, propertyCompare.length]);

  if (!mounted) {
    return null;
  }

  return (
    <div className="surface-panel p-5 sm:p-6">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h2 className="font-display text-3xl font-semibold text-stone-950">
            Side-by-side compare
          </h2>
          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
            Switch between project comparison and property comparison without losing either list.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => {
              setActiveTab("projects");
              trackEvent("compare_tab_changed", { tab: "projects" });
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              effectiveTab === "projects"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "border border-[var(--border)] bg-white text-stone-900"
            }`}
          >
            Projects {projectCompare.length}
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("properties");
              trackEvent("compare_tab_changed", { tab: "properties" });
            }}
            className={`rounded-full px-4 py-2 text-sm font-semibold ${
              effectiveTab === "properties"
                ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                : "border border-[var(--border)] bg-white text-stone-900"
            }`}
          >
            Properties {propertyCompare.length}
          </button>
          {showCloseButton && onClose ? (
            <button
              type="button"
              onClick={onClose}
              className="secondary-button px-4 py-2 text-sm"
            >
              Close
            </button>
          ) : null}
        </div>
      </div>

      {effectiveTab === "projects" ? (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--muted-foreground)]">
              Compare pricing, location, type, and stage across saved projects.
            </p>
            <button
              type="button"
              onClick={clearProjectCompare}
              className="secondary-button px-4 py-2 text-sm"
            >
              Clear projects
            </button>
          </div>

          {projectCompare.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--muted-foreground)]">
              Add up to three projects to compare.
            </p>
          ) : (
            <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {projectCompare.map((project) => (
                <article
                  key={project.id}
                  className="overflow-hidden border border-[var(--border)] bg-white/82"
                >
                  <div
                    className="h-44 bg-cover bg-center"
                    style={{
                      backgroundImage: project.heroMediaUrl
                        ? `linear-gradient(rgba(23,20,18,0.12),rgba(23,20,18,0.26)), url(${project.heroMediaUrl})`
                        : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
                    }}
                  />
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-display text-2xl font-semibold text-stone-950">
                          {project.title}
                        </p>
                        <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                          {project.developerName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => removeProjectCompare(project.id)}
                        className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-stone-900"
                      >
                        Remove
                      </button>
                    </div>

                    <div className="mt-5 space-y-3">
                      {getProjectCompareRows(project).map((row) => (
                        <div
                          key={row.label}
                          className="rounded-[1rem] bg-[rgba(141,104,71,0.05)] px-4 py-3"
                        >
                          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[var(--muted-foreground)]">
                            {row.label}
                          </p>
                          <p className="mt-1 text-sm font-semibold text-stone-950">
                            {row.value}
                          </p>
                        </div>
                      ))}
                    </div>

                    <Link
                      href={`/projects/${project.slug}`}
                      onClick={() =>
                        trackEvent("compare_project_opened", {
                          project_id: project.id,
                          project_slug: project.slug,
                          project_title: project.title,
                        })
                      }
                      className="primary-button mt-5 w-full text-sm"
                    >
                      Open listing
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="mt-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-[var(--muted-foreground)]">
              Compare apartments and units side by side, including beds and grouped amenities.
            </p>
            <button
              type="button"
              onClick={clearPropertyCompare}
              className="secondary-button px-4 py-2 text-sm"
            >
              Clear properties
            </button>
          </div>

          {propertyCompare.length === 0 ? (
            <p className="mt-6 text-sm text-[var(--muted-foreground)]">
              Add up to three properties to compare.
            </p>
          ) : (
            <div className="mt-6 overflow-x-auto">
              <div
                className="grid min-w-[960px] gap-4"
                style={{
                  gridTemplateColumns: `220px repeat(${propertyCompare.length}, minmax(240px, 1fr))`,
                }}
              >
                <div className="rounded-[1.3rem] bg-[rgba(141,104,71,0.05)] p-4">
                  <p className="text-sm font-semibold text-stone-950">
                    Property comparison
                  </p>
                  <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                    Compare every major detail row by row.
                  </p>
                </div>
                {propertyCompare.map((property) => (
                  <div
                    key={property.id}
                    className="overflow-hidden border border-[var(--border)] bg-white"
                  >
                    <div
                      className="h-36 bg-cover bg-center"
                      style={{
                        backgroundImage: property.imageUrl
                          ? `linear-gradient(rgba(23,20,18,0.12),rgba(23,20,18,0.22)), url(${property.imageUrl})`
                          : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
                      }}
                    />
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-display text-xl font-semibold text-stone-950">
                            {property.title}
                          </p>
                          <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                            {property.projectTitle}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removePropertyCompare(property.id)}
                          className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-stone-900"
                        >
                          Remove
                        </button>
                      </div>
                      <Link
                        href={`/projects/${property.projectSlug}/units/${property.propertySlug}`}
                        onClick={() =>
                          trackEvent("compare_property_opened", {
                            property_id: property.id,
                            property_slug: property.propertySlug,
                            property_title: property.title,
                            project_slug: property.projectSlug,
                            project_title: property.projectTitle,
                          })
                        }
                        className="secondary-button mt-4 w-full px-4 py-2 text-sm"
                      >
                        Open property
                      </Link>
                    </div>
                  </div>
                ))}

                {Array.from(
                  new Set(propertyCompare.flatMap((property) => getPropertyCompareRows(property).map((row) => row.label))),
                ).map((label) => (
                  <Fragment key={`row-${label}`}>
                    <div
                      className="rounded-[1.1rem] bg-[rgba(141,104,71,0.06)] px-4 py-3"
                    >
                      <p className="text-sm font-semibold text-stone-950">{label}</p>
                    </div>
                    {propertyCompare.map((property) => {
                      const row = getPropertyCompareRows(property).find((item) => item.label === label);
                      const isStayRow =
                        label === "Minimum stay" || label === "Maximum stay";
                      return (
                        <div
                          key={`${property.id}-${label}`}
                          className="rounded-[1.1rem] border border-[var(--border)] bg-white px-4 py-3"
                        >
                          <p className="text-sm leading-7 text-stone-700">
                            {row?.value ||
                              (isStayRow && property.offerType !== "rent"
                                ? "Not applicable"
                                : "Not specified")}
                          </p>
                        </div>
                      );
                    })}
                  </Fragment>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
