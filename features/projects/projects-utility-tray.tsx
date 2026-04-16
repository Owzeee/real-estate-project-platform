"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import {
  getProjectCompareRows,
  getPropertyCompareRows,
  useProjectsStore,
} from "@/features/projects/client-store";

type CompareTab = "projects" | "properties";

export function ProjectsUtilityTray() {
  const {
    favoriteProjects,
    favoriteProperties,
    projectCompare,
    propertyCompare,
    removeFavorite,
    removeFavoriteProperty,
    removeProjectCompare,
    removePropertyCompare,
    clearProjectCompare,
    clearPropertyCompare,
  } = useProjectsStore();
  const [compareOpen, setCompareOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<CompareTab>("projects");
  const [desktopTrayVisible, setDesktopTrayVisible] = useState(true);

  const effectiveTab = useMemo<CompareTab>(() => {
    if (activeTab === "projects" && projectCompare.length === 0 && propertyCompare.length > 0) {
      return "properties";
    }

    if (activeTab === "properties" && propertyCompare.length === 0 && projectCompare.length > 0) {
      return "projects";
    }

    return activeTab;
  }, [activeTab, projectCompare.length, propertyCompare.length]);

  return (
    <>
      <div className="fixed bottom-5 left-1/2 z-50 w-[min(96vw,860px)] -translate-x-1/2 lg:left-auto lg:right-5 lg:w-[min(50rem,calc(100vw-2.5rem))] lg:translate-x-0">
        <button
          type="button"
          onClick={() => {
            setDesktopTrayVisible((visible) => {
              const nextVisible = !visible;

              if (!nextVisible) {
                setCompareOpen(false);
                setFavoritesOpen(false);
              }

              return nextVisible;
            });
          }}
          aria-expanded={desktopTrayVisible}
          className="absolute -top-12 right-0 hidden rounded-full border border-[var(--border)] bg-white/95 px-4 py-2 text-sm font-semibold text-stone-900 shadow-[0_12px_30px_rgba(23,20,18,0.14)] backdrop-blur lg:inline-flex"
        >
          {desktopTrayVisible ? "Hide compare tray ↓" : "Show compare tray ↑"}
        </button>

        <div
          className={`surface-panel rounded-[1.5rem] px-4 py-3 sm:px-5 ${
            desktopTrayVisible
              ? "flex flex-wrap items-center justify-between gap-3"
              : "flex flex-wrap items-center justify-between gap-3 lg:hidden"
          } lg:flex`}
        >
          <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
            <button
              type="button"
              onClick={() => setFavoritesOpen((open) => !open)}
              className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-stone-900"
            >
              Saved {favoriteProjects.length + favoriteProperties.length}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("projects");
                setCompareOpen((open) => !open || effectiveTab !== "projects");
              }}
              className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
            >
              Compare projects {projectCompare.length}/3
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("properties");
                setCompareOpen((open) => !open || effectiveTab !== "properties");
              }}
              className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-stone-900"
            >
              Compare properties {propertyCompare.length}/3
            </button>
          </div>
          <p className="text-sm text-[var(--muted-foreground)] lg:max-w-[15rem] lg:text-right">
            Compare whole projects or specific apartments side by side.
          </p>
        </div>
      </div>

      {favoritesOpen ? (
        <div className="fixed inset-x-4 bottom-24 z-50 mx-auto w-[min(94vw,760px)] lg:inset-x-auto lg:right-5 lg:left-auto lg:mx-0 lg:w-[min(36rem,calc(100vw-2.5rem))]">
          <div className="surface-panel rounded-[1.75rem] p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-stone-950">
                Saved shortlist
              </h2>
              <button
                type="button"
                onClick={() => setFavoritesOpen(false)}
                className="secondary-button px-4 py-2 text-sm"
              >
                Close
              </button>
            </div>
            <div className="mt-5 grid gap-3">
              {favoriteProjects.length === 0 && favoriteProperties.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  No saved projects or properties yet.
                </p>
              ) : (
                <>
                  {favoriteProperties.map((property) => (
                    <div
                      key={property.id}
                      className="flex flex-col gap-3 rounded-[1.2rem] border border-[var(--border)] bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-stone-950">{property.title}</p>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                          {property.location} • {property.projectTitle}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/projects/${property.projectSlug}/units/${property.propertySlug}`}
                          className="secondary-button px-4 py-2 text-sm"
                        >
                          Open
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFavoriteProperty(property.id)}
                          className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-stone-900"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                  {favoriteProjects.map((project) => (
                    <div
                      key={project.id}
                      className="flex flex-col gap-3 rounded-[1.2rem] border border-[var(--border)] bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"
                    >
                      <div>
                        <p className="font-semibold text-stone-950">{project.title}</p>
                        <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                          {project.location} • {project.developerName}
                        </p>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Link
                          href={`/projects/${project.slug}`}
                          className="secondary-button px-4 py-2 text-sm"
                        >
                          Open
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeFavorite(project.id)}
                          className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-stone-900"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {compareOpen ? (
        <div className="fixed inset-4 bottom-24 z-50 mx-auto overflow-auto lg:inset-auto lg:right-5 lg:bottom-24 lg:left-auto lg:max-h-[calc(100vh-8.5rem)] lg:w-[min(88vw,1180px)]">
          <div className="surface-panel mx-auto w-[min(98vw,1380px)] rounded-[1.75rem] p-5 sm:p-6 lg:mx-0 lg:w-full">
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
                  onClick={() => setActiveTab("projects")}
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
                  onClick={() => setActiveTab("properties")}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    effectiveTab === "properties"
                      ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                      : "border border-[var(--border)] bg-white text-stone-900"
                  }`}
                >
                  Properties {propertyCompare.length}
                </button>
                <button
                  type="button"
                  onClick={() => setCompareOpen(false)}
                  className="secondary-button px-4 py-2 text-sm"
                >
                  Close
                </button>
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
                        className="overflow-hidden rounded-[1.5rem] border border-[var(--border)] bg-white/82"
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
                          className="overflow-hidden rounded-[1.3rem] border border-[var(--border)] bg-white"
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
                        <>
                          <div
                            key={`label-${label}`}
                            className="rounded-[1.1rem] bg-[rgba(141,104,71,0.06)] px-4 py-3"
                          >
                            <p className="text-sm font-semibold text-stone-950">{label}</p>
                          </div>
                          {propertyCompare.map((property) => {
                            const row = getPropertyCompareRows(property).find((item) => item.label === label);
                            return (
                              <div
                                key={`${property.id}-${label}`}
                                className="rounded-[1.1rem] border border-[var(--border)] bg-white px-4 py-3"
                              >
                                <p className="text-sm leading-7 text-stone-700">
                                  {row?.value || "Not specified"}
                                </p>
                              </div>
                            );
                          })}
                        </>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : null}
    </>
  );
}
