"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { InteractiveListingsMap } from "@/features/projects/interactive-listings-map";
import { useProjectsStore } from "@/features/projects/client-store";

type WishlistTab = "properties" | "projects";

const emptyStateImages = [
  "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80",
];

export function WishlistPageClient() {
  const {
    favoriteProjects,
    favoriteProperties,
    removeFavorite,
    removeFavoriteProperty,
  } = useProjectsStore();
  const [activeTab, setActiveTab] = useState<WishlistTab>("properties");
  const [selectedPropertyId, setSelectedPropertyId] = useState<string | null>(null);
  const [shareState, setShareState] = useState<"idle" | "copied">("idle");

  const selectedProperty =
    favoriteProperties.find((property) => property.id === selectedPropertyId) ??
    favoriteProperties[0] ??
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

  const shareWishlist = async () => {
    const url = `${window.location.origin}/wishlist`;
    if (navigator.share) {
      try {
        await navigator.share({ title: "Wishlist", url });
        return;
      } catch {
        return;
      }
    }

    await navigator.clipboard.writeText(url);
    setShareState("copied");
    window.setTimeout(() => setShareState("idle"), 1800);
  };

  const propertyStatLine = useMemo(() => {
    return favoriteProperties.length > 0
      ? `${favoriteProperties.length} saved properties`
      : "No saved properties yet";
  }, [favoriteProperties.length]);

  return (
    <main className="page-shell min-h-screen bg-transparent px-4 py-10 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <section className="surface-panel overflow-hidden rounded-[2rem]">
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
                    onClick={() => setActiveTab("properties")}
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
                    onClick={() => setActiveTab("projects")}
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
                      : `${favoriteProjects.length} saved projects`}
                  </span>
                </div>
              </div>

              {activeTab === "properties" ? (
                favoriteProperties.length === 0 ? (
                  <div className="rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.92),rgba(255,251,244,0.84))] p-8 sm:p-10">
                    <div className="grid items-center gap-10 lg:grid-cols-[minmax(0,1fr)_320px]">
                      <div className="text-center lg:text-left">
                        <h2 className="font-display text-4xl font-semibold text-stone-950">
                          Your wishlist is empty
                        </h2>
                      <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted-foreground)] lg:max-w-2xl">
                        Save the apartments and layouts you like, then review them here with a map, quick specs, and direct access back into each property page.
                      </p>
                      <p className="mt-3 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--primary)]">
                        Look for the heart-shaped Add to wishlist button on property cards and pages.
                      </p>
                      <Link href="/projects" className="primary-button mt-6 text-sm">
                        Discover homes
                      </Link>
                      </div>

                      <div className="mx-auto grid w-full max-w-[20rem] grid-cols-3 gap-3">
                        {emptyStateImages.map((imageUrl, index) => (
                          <div
                            key={imageUrl}
                            className={`aspect-[0.8] rounded-[1.2rem] bg-cover bg-center shadow-[0_18px_38px_rgba(32,28,25,0.16)] ${
                              index % 2 === 0 ? "translate-y-4" : ""
                            }`}
                            style={{ backgroundImage: `url(${imageUrl})` }}
                          />
                        ))}
                      </div>
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
                            className="h-32 rounded-[1.2rem] bg-cover bg-center text-left sm:w-44 sm:flex-none"
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
                                onClick={() => setSelectedPropertyId(property.id)}
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
              ) : favoriteProjects.length === 0 ? (
                <div className="mt-6 rounded-[1.75rem] border border-dashed border-[var(--border)] bg-white/65 p-10 text-center">
                  <p className="font-display text-3xl font-semibold text-stone-950">
                    No saved projects yet
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
                    Save whole projects if you want a broader shortlist before drilling into specific properties.
                  </p>
                </div>
              ) : (
                <div className="mt-6 grid gap-4">
                  {favoriteProjects.map((project) => (
                    <article
                      key={project.id}
                      className="rounded-[1.5rem] border border-[var(--border)] bg-white/82 p-5"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                        <div className="min-w-0 flex-1">
                          <p className="font-display text-3xl font-semibold text-stone-950">
                            {project.title}
                          </p>
                          <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                            {project.location} • {project.developerName}
                          </p>
                        </div>
                        <div className="flex shrink-0 flex-wrap items-center gap-2 sm:justify-end">
                          <Link
                            href={`/projects/${project.slug}`}
                            className="primary-button min-w-[8.5rem] px-4 py-2 text-sm"
                          >
                            Open project
                          </Link>
                          <button
                            type="button"
                            onClick={() => removeFavorite(project.id)}
                            className="secondary-button min-w-[8.5rem] px-4 py-2 text-sm"
                          >
                            Remove
                          </button>
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
                          ? "The wishlist page is property-led, so map focus follows saved apartments and unit layouts."
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
