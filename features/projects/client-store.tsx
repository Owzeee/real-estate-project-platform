"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  formatCompletionStageLabel,
  formatProjectTypeLabel,
  type ProjectAmenityGroup,
  type ProjectBed,
} from "@/features/projects/presentation";
import type { ProjectSummary } from "@/features/projects/types";
import { trackEvent } from "@/lib/analytics";
import { formatProjectSummaryInventoryPricing } from "@/lib/utils/format-price";

export type StoredProject = Pick<
  ProjectSummary,
  | "id"
  | "slug"
  | "title"
  | "developerName"
  | "location"
  | "projectType"
  | "completionStage"
  | "minPrice"
  | "maxPrice"
  | "rentPrice"
  | "currencyCode"
  | "offerType"
  | "priceMode"
  | "latitude"
  | "longitude"
  | "heroMediaUrl"
>;

export type StoredProperty = {
  id: string;
  projectSlug: string;
  projectTitle: string;
  propertySlug: string;
  title: string;
  developerName: string;
  location: string;
  latitude: number | null;
  longitude: number | null;
  offerType: "sale" | "rent";
  priceLabel: string;
  areaLabel: string;
  roomsLabel: string;
  availableFromLabel: string;
  minimumStayLabel: string;
  maximumStayLabel: string;
  imageUrl: string | null;
  beds: ProjectBed[];
  amenityGroups: ProjectAmenityGroup[];
};

type ProjectsStoreValue = {
  favoriteProjects: StoredProject[];
  favoriteProperties: StoredProperty[];
  projectCompare: StoredProject[];
  propertyCompare: StoredProperty[];
  desktopTrayVisible: boolean;
  isFavorite: (id: string) => boolean;
  isFavoriteProperty: (id: string) => boolean;
  isProjectCompared: (id: string) => boolean;
  isPropertyCompared: (id: string) => boolean;
  setDesktopTrayVisible: (visible: boolean) => void;
  toggleFavorite: (project: StoredProject) => void;
  toggleFavoriteProperty: (property: StoredProperty) => void;
  toggleProjectCompare: (project: StoredProject) => void;
  togglePropertyCompare: (property: StoredProperty) => void;
  removeFavorite: (id: string) => void;
  removeFavoriteProperty: (id: string) => void;
  removeProjectCompare: (id: string) => void;
  removePropertyCompare: (id: string) => void;
  clearProjectCompare: () => void;
  clearPropertyCompare: () => void;
};

const FAVORITE_PROJECTS_KEY = "real-estate-favorite-projects";
const FAVORITE_PROPERTIES_KEY = "real-estate-favorite-properties";
const PROJECT_COMPARE_KEY = "real-estate-project-compare";
const PROPERTY_COMPARE_KEY = "real-estate-property-compare";
const DESKTOP_TRAY_VISIBLE_KEY = "real-estate-desktop-tray-visible";
const MAX_COMPARE = 3;

const ProjectsStoreContext = createContext<ProjectsStoreValue | null>(null);

function readStorage<T>(key: string): T[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T[]) : [];
  } catch {
    return [];
  }
}

function writeStorage<T>(key: string, value: T[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

function readStorageValue<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function writeStorageValue<T>(key: string, value: T) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function ProjectsStoreProvider({ children }: { children: ReactNode }) {
  const [favoriteProjects, setFavoriteProjects] = useState<StoredProject[]>(() =>
    readStorage<StoredProject>(FAVORITE_PROJECTS_KEY),
  );
  const [favoriteProperties, setFavoriteProperties] = useState<StoredProperty[]>(() =>
    readStorage<StoredProperty>(FAVORITE_PROPERTIES_KEY),
  );
  const [projectCompare, setProjectCompare] = useState<StoredProject[]>(() =>
    readStorage<StoredProject>(PROJECT_COMPARE_KEY),
  );
  const [propertyCompare, setPropertyCompare] = useState<StoredProperty[]>(() =>
    readStorage<StoredProperty>(PROPERTY_COMPARE_KEY),
  );
  const [desktopTrayVisible, setDesktopTrayVisibleState] = useState<boolean>(() =>
    readStorageValue<boolean>(DESKTOP_TRAY_VISIBLE_KEY, true),
  );

  const value = useMemo<ProjectsStoreValue>(
    () => ({
      favoriteProjects,
      favoriteProperties,
      projectCompare,
      propertyCompare,
      desktopTrayVisible,
      isFavorite: (id) => favoriteProjects.some((project) => project.id === id),
      isFavoriteProperty: (id) => favoriteProperties.some((property) => property.id === id),
      isProjectCompared: (id) => projectCompare.some((project) => project.id === id),
      isPropertyCompared: (id) => propertyCompare.some((property) => property.id === id),
      setDesktopTrayVisible: (visible) => {
        writeStorageValue(DESKTOP_TRAY_VISIBLE_KEY, visible);
        setDesktopTrayVisibleState(visible);
        trackEvent("compare_tray_visibility_changed", { visible });
      },
      toggleFavorite: (project) => {
        setFavoriteProjects((current) => {
          const exists = current.some((item) => item.id === project.id);
          const next = exists
            ? current.filter((item) => item.id !== project.id)
            : [project, ...current];

          writeStorage(FAVORITE_PROJECTS_KEY, next);
          trackEvent(exists ? "wishlist_project_removed" : "wishlist_project_added", {
            project_id: project.id,
            project_slug: project.slug,
            project_title: project.title,
            developer_name: project.developerName,
            location: project.location,
            offer_type: project.offerType,
            wishlist_count: next.length,
          });
          return next;
        });
      },
      toggleFavoriteProperty: (property) => {
        setFavoriteProperties((current) => {
          const exists = current.some((item) => item.id === property.id);
          const next = exists
            ? current.filter((item) => item.id !== property.id)
            : [property, ...current];

          writeStorage(FAVORITE_PROPERTIES_KEY, next);
          trackEvent(exists ? "wishlist_property_removed" : "wishlist_property_added", {
            property_id: property.id,
            property_slug: property.propertySlug,
            property_title: property.title,
            project_slug: property.projectSlug,
            project_title: property.projectTitle,
            developer_name: property.developerName,
            location: property.location,
            offer_type: property.offerType,
            price_label: property.priceLabel,
            wishlist_count: next.length,
          });
          return next;
        });
      },
      toggleProjectCompare: (project) => {
        setProjectCompare((current) => {
          const exists = current.some((item) => item.id === project.id);
          const next = exists
            ? current.filter((item) => item.id !== project.id)
            : [...current.slice(-(MAX_COMPARE - 1)), project];

          writeStorage(PROJECT_COMPARE_KEY, next);
          trackEvent(exists ? "compare_project_removed" : "compare_project_added", {
            project_id: project.id,
            project_slug: project.slug,
            project_title: project.title,
            developer_name: project.developerName,
            location: project.location,
            offer_type: project.offerType,
            compare_count: next.length,
          });
          return next;
        });
      },
      togglePropertyCompare: (property) => {
        setPropertyCompare((current) => {
          const exists = current.some((item) => item.id === property.id);
          const next = exists
            ? current.filter((item) => item.id !== property.id)
            : [...current.slice(-(MAX_COMPARE - 1)), property];

          writeStorage(PROPERTY_COMPARE_KEY, next);
          trackEvent(exists ? "compare_property_removed" : "compare_property_added", {
            property_id: property.id,
            property_slug: property.propertySlug,
            property_title: property.title,
            project_slug: property.projectSlug,
            project_title: property.projectTitle,
            developer_name: property.developerName,
            location: property.location,
            offer_type: property.offerType,
            compare_count: next.length,
          });
          return next;
        });
      },
      removeFavorite: (id) => {
        setFavoriteProjects((current) => {
          const next = current.filter((item) => item.id !== id);
          const removed = current.find((item) => item.id === id);
          writeStorage(FAVORITE_PROJECTS_KEY, next);
          if (removed) {
            trackEvent("wishlist_project_removed", {
              project_id: removed.id,
              project_slug: removed.slug,
              project_title: removed.title,
              developer_name: removed.developerName,
              location: removed.location,
              offer_type: removed.offerType,
              wishlist_count: next.length,
            });
          }
          return next;
        });
      },
      removeFavoriteProperty: (id) => {
        setFavoriteProperties((current) => {
          const next = current.filter((item) => item.id !== id);
          const removed = current.find((item) => item.id === id);
          writeStorage(FAVORITE_PROPERTIES_KEY, next);
          if (removed) {
            trackEvent("wishlist_property_removed", {
              property_id: removed.id,
              property_slug: removed.propertySlug,
              property_title: removed.title,
              project_slug: removed.projectSlug,
              project_title: removed.projectTitle,
              developer_name: removed.developerName,
              location: removed.location,
              offer_type: removed.offerType,
              price_label: removed.priceLabel,
              wishlist_count: next.length,
            });
          }
          return next;
        });
      },
      removeProjectCompare: (id) => {
        setProjectCompare((current) => {
          const next = current.filter((item) => item.id !== id);
          const removed = current.find((item) => item.id === id);
          writeStorage(PROJECT_COMPARE_KEY, next);
          if (removed) {
            trackEvent("compare_project_removed", {
              project_id: removed.id,
              project_slug: removed.slug,
              project_title: removed.title,
              developer_name: removed.developerName,
              location: removed.location,
              offer_type: removed.offerType,
              compare_count: next.length,
            });
          }
          return next;
        });
      },
      removePropertyCompare: (id) => {
        setPropertyCompare((current) => {
          const next = current.filter((item) => item.id !== id);
          const removed = current.find((item) => item.id === id);
          writeStorage(PROPERTY_COMPARE_KEY, next);
          if (removed) {
            trackEvent("compare_property_removed", {
              property_id: removed.id,
              property_slug: removed.propertySlug,
              property_title: removed.title,
              project_slug: removed.projectSlug,
              project_title: removed.projectTitle,
              developer_name: removed.developerName,
              location: removed.location,
              offer_type: removed.offerType,
              compare_count: next.length,
            });
          }
          return next;
        });
      },
      clearProjectCompare: () => {
        writeStorage(PROJECT_COMPARE_KEY, []);
        setProjectCompare([]);
        trackEvent("compare_projects_cleared", {});
      },
      clearPropertyCompare: () => {
        writeStorage(PROPERTY_COMPARE_KEY, []);
        setPropertyCompare([]);
        trackEvent("compare_properties_cleared", {});
      },
    }),
    [
      desktopTrayVisible,
      favoriteProjects,
      favoriteProperties,
      projectCompare,
      propertyCompare,
    ],
  );

  return (
    <ProjectsStoreContext.Provider value={value}>
      {children}
    </ProjectsStoreContext.Provider>
  );
}

export function useProjectsStore() {
  const context = useContext(ProjectsStoreContext);

  if (!context) {
    throw new Error("useProjectsStore must be used within ProjectsStoreProvider");
  }

  return context;
}

export function toStoredProject(project: ProjectSummary): StoredProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    developerName: project.developerName,
    location: project.location,
    projectType: project.projectType,
    completionStage: project.completionStage,
    minPrice: project.minPrice,
    maxPrice: project.maxPrice,
    rentPrice: project.rentPrice,
    currencyCode: project.currencyCode,
    offerType: project.offerType,
    priceMode: project.priceMode,
    latitude: project.latitude,
    longitude: project.longitude,
    heroMediaUrl: project.heroMediaUrl,
  };
}

export function getProjectCompareRows(project: StoredProject) {
  return [
    { label: "Developer", value: project.developerName },
    { label: "Location", value: project.location },
    { label: "Type", value: formatProjectTypeLabel(project.projectType) },
    { label: "Stage", value: formatCompletionStageLabel(project.completionStage) },
    {
      label: "Price range",
      value: formatProjectSummaryInventoryPricing({
        offerType: project.offerType,
        priceMode: project.priceMode,
        minPrice: project.minPrice,
        maxPrice: project.maxPrice,
        rentPrice: project.rentPrice,
        currencyCode: project.currencyCode,
      }),
    },
  ];
}

function joinValues(values: string[]) {
  return values.length > 0 ? values.join(", ") : "Not specified";
}

export function getPropertyCompareRows(property: StoredProperty) {
  const rows = [
    { label: "Project", value: property.projectTitle },
    { label: "Developer", value: property.developerName },
    { label: "Location", value: property.location },
    { label: "Listing", value: property.offerType === "rent" ? "For Rent" : "For Sale" },
    { label: "Price", value: property.priceLabel || "Contact for price" },
    { label: "Area", value: property.areaLabel || "Not specified" },
    { label: "Rooms", value: property.roomsLabel || "Not specified" },
    { label: "Available from", value: property.availableFromLabel || "Not specified" },
    {
      label: "Beds",
      value:
        property.beds.length > 0
          ? property.beds.map((bed) => `${bed.label} (${bed.roomLabel})`).join(", ")
          : "Not specified",
    },
    ...property.amenityGroups.map((group) => ({
      label: group.title,
      value: joinValues(group.items),
    })),
  ];

  if (property.offerType === "rent") {
    rows.splice(8, 0,
      { label: "Minimum stay", value: property.minimumStayLabel || "Not specified" },
      { label: "Maximum stay", value: property.maximumStayLabel || "Not specified" },
    );
  }

  return rows;
}
