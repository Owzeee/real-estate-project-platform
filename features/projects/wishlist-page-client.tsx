"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, useSyncExternalStore } from "react";

import { InteractiveListingsMap } from "@/features/projects/interactive-listings-map";
import { useProjectsStore } from "@/features/projects/client-store";
import { trackEvent } from "@/lib/analytics";
import { createBrowserSupabaseClient, hasPublicSupabaseEnv } from "@/lib/supabase/client";
import { formatProjectSummaryInventoryPricing } from "@/lib/utils/format-price";

type WishlistTab = "properties" | "projects";

export function WishlistPageClient() {
  const {
    favoriteProjects,
    favoriteProperties,
    removeFavorite,
    removeFavoriteProperty,
  } = useProjectsStore();
  const [activeTab, setActiveTab] = useState<WishlistTab>("properties");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [selectedProjectId, setSelectedProjectId] = useState<string | null>(null);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");
  const [projectLocationOverrides, setProjectLocationOverrides] = useState<
    Record<string, { latitude: number | null; longitude: number | null }>
  >({});
  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  useEffect(() => {
    const missingCoordinates = favoriteProjects.filter(
      (project) =>
        projectLocationOverrides[project.id] == null &&
        (project.latitude == null || project.longitude == null),
    );

    if (missingCoordinates.length === 0 || !hasPublicSupabaseEnv()) {
      return;
    }

    let cancelled = false;

    async function loadProjectLocations() {
      const supabase = createBrowserSupabaseClient();
      const { data, error } = await supabase
        .from("projects")
        .select("id, latitude, longitude")
        .in(
          "id",
          missingCoordinates.map((project) => project.id),
        );

      if (cancelled || error || !data) {
        return;
      }

      setProjectLocationOverrides((current) => {
        const next = { ...current };

        for (const row of data) {
          next[row.id] = {
            latitude: row.latitude,
            longitude: row.longitude,
          };
        }

        return next;
      });
    }

    void loadProjectLocations();

    return () => {
      cancelled = true;
    };
  }, [favoriteProjects, projectLocationOverrides]);

  const resolvedFavoriteProjects = useMemo(
    () =>
      favoriteProjects.map((project) => ({
        ...project,
        latitude: project.latitude ?? projectLocationOverrides[project.id]?.latitude ?? null,
        longitude: project.longitude ?? projectLocationOverrides[project.id]?.longitude ?? null,
      })),
    [favoriteProjects, projectLocationOverrides],
  );

  const selectedProperty =
    favoriteProperties.find((property) => property.id === selectedPropertyId) ??
    favoriteProperties[0] ??
    null;
  const selectedProject =
    resolvedFavoriteProjects.find((project) => project.id === selectedProjectId) ??
    resolvedFavoriteProjects[0] ??
    null;

  const propertyMapItems = favoriteProperties
    .filter((property) => property.latitude != null && property.longitude != null)
    .map((property) => ({
      id: property.id,
      title: property.title,
      subtitle: `${property.location} • ${property.priceLabel}`,
      href: `/projects/${property.projectSlug}/units/${property.propertySlug}`,
      latitude: property.latitude as number,
      longitude: property.longitude as number,
      accentLabel: property.offerType === "rent" ? "For Rent" : "For Sale",
    }));
  const projectMapItems = resolvedFavoriteProjects
    .filter((project) => project.latitude != null && project.longitude != null)
    .map((project) => ({
      id: project.id,
      title: project.title,
      subtitle: `${project.location} • ${project.developerName}`,
      href: `/projects/${project.slug}`,
      latitude: project.latitude as number,
      longitude: project.longitude as number,
      accentLabel: project.offerType === "rent" ? "For Rent" : "For Sale",
    }));

  const shareWishlist = async () => {
    const url = `${window.location.origin}/wishlist`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Wishlist", url });
        trackEvent("wishlist_shared", {
          method: "navigator_share",
          tab: activeTab,
          saved_properties_count: favoriteProperties.length,
          saved_projects_count: resolvedFavoriteProjects.length,
        });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(url);
    trackEvent("wishlist_shared", {
      method: "clipboard",
      tab: activeTab,
      saved_properties_count: favoriteProperties.length,
      saved_projects_count: resolvedFavoriteProjects.length,
    });
    setShareState("copied");
    window.setTimeout(() => setShareState("idle"), 1800);
  };

  const propertyStatLine = useMemo(() => {
    return favoriteProperties.length > 0
      ? `${favoriteProperties.length} saved properties`
      : "No saved properties yet";
  }, [favoriteProperties.length]);

  if (!mounted) {
    return null;
  }

  return (
    <main className="page-shell min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="surface-panel overflow-hidden">
          <div className="grid gap-0 xl:grid-cols-[minmax(0,1.02fr)_minmax(360px,0.98fr)]">
            <div className="p-6 sm:p-8 lg:p-10">
              <div className="flex flex-col gap-5 border-b border-[var(--border)] pb-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="eyebrow">Saved Shortlist</p>
                    <h1 className="mt-5 font-display text-4xl font-bold tracking-tight text-stone-950 sm:text-5xl">
                      My Wishlist
                    </h1>
                  </div>
                  <button
                    type="button"
                    onClick={shareWishlist}
                    className="secondary-button px-4 py-2.5 text-sm"
                  >
                    {shareState === "copied" ? "Link copied" : "Share"}
                  </button>
                </div>

                <div className="flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("properties");
                      trackEvent("wishlist_tab_changed", { tab: "properties" });
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      activeTab === "properties"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "border border-[var(--border)] bg-white text-stone-900"
                    }`}
                  >
                    Properties
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("projects");
                      trackEvent("wishlist_tab_changed", { tab: "projects" });
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-semibold ${
                      activeTab === "projects"
                        ? "bg-[var(--primary)] text-[var(--primary-foreground)]"
                        : "border border-[var(--border)] bg-white text-stone-900"
                    }`}
                  >
                    Projects
                  </button>
                </div>

                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <p className="text-base font-semibold text-stone-950">
                      View the availability
                    </p>
                    <p className="mt-2 max-w-2xl text-sm leading-7 text-[var(--muted-foreground)]">
                      Add move-out date context to review your shortlisted properties more clearly. For now, this screen keeps the saved items, pricing, and map context together in one place.
                    </p>
                  </div>
                  <span className="rounded-full bg-[rgba(141,104,71,0.08)] px-4 py-2 text-sm font-semibold text-stone-700">
                    {activeTab === "properties"
                      ? propertyStatLine
                      : `${resolvedFavoriteProjects.length} saved projects`}
                  </span>
                </div>
              </div>

              {activeTab === "properties" ? (
                favoriteProperties.length === 0 ? (
                  <div className="mt-6 border border-dashed border-[var(--border)] bg-white/65 p-10 text-center">
                    <div className="mx-auto max-w-xl">
                      <h2 className="font-display text-3xl font-semibold text-stone-950">
                        Your wishlist is empty
                      </h2>
                      <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                        Save properties you want to revisit here, then compare them with map context and quick specs.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="mt-6 space-y-5">
                    {favoriteProperties.map((property) => (
                      <article
                        key={property.id}
                        className={`rounded-[1.5rem] border p-4 transition sm:p-5 ${
                          selectedProperty?.id === property.id
                            ? "border-[rgba(141,104,71,0.34)] bg-[rgba(255,255,255,0.96)] shadow-[0_20px_45px_rgba(32,28,25,0.08)]"
                            : "border-[var(--border)] bg-white/78"
                        }`}
                      >
                        <div className="flex flex-col gap-4 sm:flex-row">
                          <button
                            type="button"
                            onClick={() => setSelectedPropertyId(property.id)}
                            className="h-32 bg-cover bg-center text-left sm:w-44 sm:flex-none"
                            style={{
                              backgroundImage: property.imageUrl
                                ? `linear-gradient(rgba(23,20,18,0.1),rgba(23,20,18,0.18)), url(${property.imageUrl})`
                                : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
                            }}
                          />

                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-start justify-between gap-3">
                              <div>
                                <p className="text-2xl font-semibold text-stone-950">
                                  {property.priceLabel}
                                </p>
                                <Link
                                  href={`/projects/${property.projectSlug}/units/${property.propertySlug}`}
                                  className="mt-2 block font-semibold text-stone-950 hover:text-[var(--primary)]"
                                >
                                  {property.title}
                                </Link>
                                <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                  {property.location}
                                </p>
                              </div>

                              <button
                                type="button"
                                onClick={() => removeFavoriteProperty(property.id)}
                                className="rounded-full border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-stone-900"
                              >
                                Remove
                              </button>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-700">
                              {property.roomsLabel ? <span>{property.roomsLabel}</span> : null}
                              {property.areaLabel ? <span>{property.areaLabel}</span> : null}
                              {property.beds.length > 0 ? <span>{property.beds.length} bed setups</span> : null}
                              {property.availableFromLabel ? <span>From {property.availableFromLabel}</span> : null}
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedPropertyId(property.id);
                                  trackEvent("wishlist_property_map_focus", {
                                    property_id: property.id,
                                    property_slug: property.propertySlug,
                                    property_title: property.title,
                                    project_slug: property.projectSlug,
                                    project_title: property.projectTitle,
                                  });
                                }}
                                className="secondary-button px-4 py-2 text-sm"
                              >
                                Show on map
                              </button>
                              <Link
                                href={`/projects/${property.projectSlug}/units/${property.propertySlug}`}
                                className="primary-button px-4 py-2 text-sm"
                              >
                                Open property
                              </Link>
                            </div>
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                )
              ) : resolvedFavoriteProjects.length === 0 ? (
                <div className="mt-6 border border-dashed border-[var(--border)] bg-white/65 p-10 text-center">
                  <p className="font-display text-3xl font-semibold text-stone-950">
                    No saved projects yet
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                    Save whole projects if you want a broader shortlist before drilling into specific properties.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-4">
                  {resolvedFavoriteProjects.map((project) => (
                    <article
                      key={project.id}
                      className={`border p-5 transition ${
                        selectedProject?.id === project.id
                          ? "border-[rgba(141,104,71,0.34)] bg-[rgba(255,255,255,0.96)] shadow-[0_20px_45px_rgba(32,28,25,0.08)]"
                          : "border-[var(--border)] bg-white/82"
                      }`}
                    >
                      <div className="flex flex-col gap-4 sm:flex-row">
                        <button
                          type="button"
                          onClick={() => setSelectedProjectId(project.id)}
                          className="h-32 bg-cover bg-center text-left sm:w-44 sm:flex-none"
                          style={{
                            backgroundImage: project.heroMediaUrl
                              ? `linear-gradient(rgba(23,20,18,0.1),rgba(23,20,18,0.18)), url(${project.heroMediaUrl})`
                              : "linear-gradient(135deg, rgba(141,104,71,0.24), rgba(198,154,91,0.18))",
                          }}
                        />

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-3">
                            <div>
                              <p className="text-lg font-semibold text-stone-950">
                                {formatProjectSummaryInventoryPricing({
                                  offerType: project.offerType,
                                  priceMode: project.priceMode,
                                  minPrice: project.minPrice,
                                  maxPrice: project.maxPrice,
                                  rentPrice: project.rentPrice,
                                  currencyCode: project.currencyCode,
                                })}
                              </p>
                              <p className="mt-2 text-2xl font-semibold text-stone-950">
                                {project.title}
                              </p>
                              <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                                {project.location} • {project.developerName}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => removeFavorite(project.id)}
                              className="border border-[var(--border)] bg-white px-3 py-2 text-xs font-semibold text-stone-900 hover:border-[var(--primary)] hover:bg-[rgba(141,104,71,0.05)]"
                            >
                              Remove
                            </button>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-2 text-sm text-stone-700">
                            <span>{project.projectType.replaceAll("_", " ")}</span>
                            <span>{project.completionStage.replaceAll("_", " ")}</span>
                            <span>{project.offerType === "rent" ? "For Rent" : "For Sale"}</span>
                          </div>

                          <div className="mt-4 flex flex-wrap gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedProjectId(project.id);
                                trackEvent("wishlist_project_map_focus", {
                                  project_id: project.id,
                                  project_slug: project.slug,
                                  project_title: project.title,
                                });
                              }}
                              className="secondary-button px-4 py-2 text-sm"
                            >
                              Show on map
                            </button>
                            <Link
                              href={`/projects/${project.slug}`}
                              className="primary-button px-4 py-2 text-sm"
                            >
                              Open project
                            </Link>
                          </div>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </div>

            <aside className="border-t border-[var(--border)] bg-[rgba(255,255,255,0.82)] xl:border-l xl:border-t-0">
              <div className="flex h-full flex-col">
                <div className="border-b border-[var(--border)] px-6 py-5 sm:px-8">
                  <p className="text-sm font-semibold text-stone-950">Map preview</p>
                  <p className="mt-1 text-sm text-[var(--muted-foreground)]">
                    {selectedProperty
                      ? `Focused on ${selectedProperty.title}`
                      : "Select a saved property to focus the map"}
                  </p>
                </div>

                {activeTab === "properties" && selectedProperty && propertyMapItems.length > 0 ? (
                  <>
                    <InteractiveListingsMap
                      items={propertyMapItems}
                      selectedId={selectedProperty.id}
                      className="min-h-[28rem] w-full flex-1"
                      trackingContext="wishlist_properties_map"
                    />
                    <div className="border-t border-[var(--border)] px-6 py-5 sm:px-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-stone-950">
                            {selectedProperty.priceLabel}
                          </p>
                          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                            {selectedProperty.title}
                          </p>
                        </div>
                        <Link
                          href={`/projects/${selectedProperty.projectSlug}/units/${selectedProperty.propertySlug}`}
                          className="secondary-button px-4 py-2 text-sm"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  </>
                ) : activeTab === "projects" && selectedProject && projectMapItems.length > 0 ? (
                  <>
                    <InteractiveListingsMap
                      items={projectMapItems}
                      selectedId={selectedProject.id}
                      className="min-h-[28rem] w-full flex-1"
                      trackingContext="wishlist_projects_map"
                    />
                    <div className="border-t border-[var(--border)] px-6 py-5 sm:px-8">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-lg font-semibold text-stone-950">
                            {selectedProject.title}
                          </p>
                          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                            {selectedProject.location} • {selectedProject.developerName}
                          </p>
                        </div>
                        <Link
                          href={`/projects/${selectedProject.slug}`}
                          className="secondary-button px-4 py-2 text-sm"
                        >
                          Open
                        </Link>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="flex min-h-[34rem] flex-1 items-center justify-center bg-[linear-gradient(180deg,rgba(141,104,71,0.08),rgba(255,255,255,0.7))] p-8 text-center">
                    <div className="max-w-sm">
                      <p className="font-display text-3xl font-semibold text-stone-950">
                        {activeTab === "projects"
                          ? "Project shortlist"
                          : "Map preview unavailable"}
                      </p>
                      <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                        {activeTab === "projects"
                          ? "Save a project with map coordinates to preview it here."
                          : "Save a property with map coordinates to preview it here."}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </section>
      </div>
    </main>
  );
}
