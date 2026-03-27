"use client";

import Link from "next/link";
import { useState } from "react";

import {
  getCompareRows,
  useProjectsStore,
} from "@/features/projects/client-store";

export function ProjectsUtilityTray() {
  const { favorites, compare, removeFavorite, removeCompare, clearCompare } =
    useProjectsStore();
  const [compareOpen, setCompareOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-5 left-1/2 z-50 w-[min(94vw,720px)] -translate-x-1/2">
        <div className="surface-panel flex flex-wrap items-center justify-between gap-3 rounded-[1.5rem] px-4 py-3 sm:px-5">
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => setFavoritesOpen((open) => !open)}
              className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-stone-900"
            >
              Saved {favorites.length}
            </button>
            <button
              type="button"
              onClick={() => setCompareOpen((open) => !open)}
              className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
            >
              Compare {compare.length}/3
            </button>
          </div>
          <p className="text-sm text-[var(--muted-foreground)]">
            Save projects and compare them side by side.
          </p>
        </div>
      </div>

      {favoritesOpen ? (
        <div className="fixed inset-x-4 bottom-24 z-50 mx-auto w-[min(94vw,760px)]">
          <div className="surface-panel rounded-[1.75rem] p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 className="font-display text-2xl font-semibold text-stone-950">
                Saved projects
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
              {favorites.length === 0 ? (
                <p className="text-sm text-[var(--muted-foreground)]">
                  No saved projects yet.
                </p>
              ) : (
                favorites.map((project) => (
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
                ))
              )}
            </div>
          </div>
        </div>
      ) : null}

      {compareOpen ? (
        <div className="fixed inset-4 bottom-24 z-50 mx-auto overflow-auto">
          <div className="surface-panel mx-auto w-[min(96vw,1180px)] rounded-[1.75rem] p-5 sm:p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="font-display text-3xl font-semibold text-stone-950">
                  Side-by-side compare
                </h2>
                <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                  Compare pricing, location, type, and stage across saved picks.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={clearCompare}
                  className="secondary-button px-4 py-2 text-sm"
                >
                  Clear
                </button>
                <button
                  type="button"
                  onClick={() => setCompareOpen(false)}
                  className="primary-button px-4 py-2 text-sm"
                >
                  Close
                </button>
              </div>
            </div>

            {compare.length === 0 ? (
              <p className="mt-6 text-sm text-[var(--muted-foreground)]">
                Add up to three projects to compare.
              </p>
            ) : (
              <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {compare.map((project) => (
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
                          onClick={() => removeCompare(project.id)}
                          className="rounded-full border border-[var(--border)] bg-white px-3 py-1.5 text-xs font-semibold text-stone-900"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="mt-5 space-y-3">
                        {getCompareRows(project).map((row) => (
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
        </div>
      ) : null}
    </>
  );
}
