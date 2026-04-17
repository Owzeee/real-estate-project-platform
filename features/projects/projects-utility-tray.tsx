"use client";

import Link from "next/link";
import { useMemo, useState, useSyncExternalStore } from "react";

import { useProjectsStore } from "@/features/projects/client-store";
import { CompareWorkspace } from "@/features/projects/compare-workspace";
import { trackEvent } from "@/lib/analytics";

type CompareTab = "projects" | "properties";

export function ProjectsUtilityTray() {
  const {
    favoriteProjects,
    favoriteProperties,
    projectCompare,
    propertyCompare,
    desktopTrayVisible,
    setDesktopTrayVisible,
    removeFavorite,
    removeFavoriteProperty,
  } = useProjectsStore();
  const [compareOpen, setCompareOpen] = useState(false);
  const [favoritesOpen, setFavoritesOpen] = useState(false);
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
  }, [activeTab, projectCompare, propertyCompare]);

  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-5 left-1/2 z-50 w-[min(96vw,860px)] -translate-x-1/2 lg:left-auto lg:right-5 lg:w-[min(50rem,calc(100vw-2.5rem))] lg:translate-x-0">
        <button
          type="button"
          onClick={() => {
            setDesktopTrayVisible(!desktopTrayVisible);
            if (desktopTrayVisible) {
              setCompareOpen(false);
              setFavoritesOpen(false);
            }
          }}
          aria-expanded={desktopTrayVisible}
          className="absolute -top-12 right-0 hidden border border-[var(--border)] bg-white/95 px-4 py-2 text-sm font-semibold text-stone-900 shadow-[0_12px_30px_rgba(23,20,18,0.14)] backdrop-blur lg:inline-flex"
        >
          {desktopTrayVisible ? "Hide compare tray ↓" : "Show compare tray ↑"}
        </button>

        <div
          className={`surface-panel px-4 py-3 sm:px-5 ${
            desktopTrayVisible
              ? "flex flex-wrap items-center justify-between gap-3"
              : "flex flex-wrap items-center justify-between gap-3 lg:hidden"
          } lg:flex`}
        >
          <div className="flex flex-wrap items-center gap-3 lg:flex-nowrap">
            <button
              type="button"
              onClick={() => {
                setFavoritesOpen((open) => {
                  const next = !open;
                  trackEvent(next ? "wishlist_panel_opened" : "wishlist_panel_closed", {
                    saved_count: favoriteProjects.length + favoriteProperties.length,
                  });
                  return next;
                });
              }}
              className="rounded-full border border-[var(--border)] bg-white px-4 py-2 text-sm font-semibold text-stone-900"
            >
              Saved {favoriteProjects.length + favoriteProperties.length}
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("projects");
                setCompareOpen((open) => {
                  const next = !open || effectiveTab !== "projects";
                  if (next) {
                    trackEvent("compare_modal_opened", {
                      tab: "projects",
                      project_compare_count: projectCompare.length,
                      property_compare_count: propertyCompare.length,
                    });
                  }
                  return next;
                });
              }}
              className="rounded-full bg-[var(--primary)] px-4 py-2 text-sm font-semibold text-[var(--primary-foreground)]"
            >
              Compare projects {projectCompare.length}/3
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab("properties");
                setCompareOpen((open) => {
                  const next = !open || effectiveTab !== "properties";
                  if (next) {
                    trackEvent("compare_modal_opened", {
                      tab: "properties",
                      project_compare_count: projectCompare.length,
                      property_compare_count: propertyCompare.length,
                    });
                  }
                  return next;
                });
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
          <div className="surface-panel p-5">
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
                      className="flex flex-col gap-3 border border-[var(--border)] bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"
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
                      className="flex flex-col gap-3 border border-[var(--border)] bg-white/80 p-4 sm:flex-row sm:items-center sm:justify-between"
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
        <div className="fixed left-1/2 top-24 bottom-24 z-50 w-[min(94vw,1180px)] -translate-x-1/2 overflow-auto">
          <CompareWorkspace showCloseButton onClose={() => setCompareOpen(false)} />
        </div>
      ) : null}
    </>
  );
}
