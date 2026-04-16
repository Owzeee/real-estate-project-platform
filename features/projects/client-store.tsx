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
  isFavorite: (id: string) => boolean;
  isFavoriteProperty: (id: string) => boolean;
  isProjectCompared: (id: string) => boolean;
  isPropertyCompared: (id: string) => boolean;
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

  const value = useMemo<ProjectsStoreValue>(
    () => ({
      favoriteProjects,
      favoriteProperties,
      projectCompare,
      propertyCompare,
      isFavorite: (id) => favoriteProjects.some((project) => project.id === id),
      isFavoriteProperty: (id) => favoriteProperties.some((property) => property.id === id),
      isProjectCompared: (id) => projectCompare.some((project) => project.id === id),
      isPropertyCompared: (id) => propertyCompare.some((property) => property.id === id),
      toggleFavorite: (project) => {
        setFavoriteProjects((current) => {
          const next = current.some((item) => item.id === project.id)
            ? current.filter((item) => item.id !== project.id)
            : [project, ...current];

          writeStorage(FAVORITE_PROJECTS_KEY, next);
          return next;
        });
      },
      toggleFavoriteProperty: (property) => {
        setFavoriteProperties((current) => {
          const next = current.some((item) => item.id === property.id)
            ? current.filter((item) => item.id !== property.id)
            : [property, ...current];

          writeStorage(FAVORITE_PROPERTIES_KEY, next);
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
          return next;
        });
      },
      removeFavorite: (id) => {
        setFavoriteProjects((current) => {
          const next = current.filter((item) => item.id !== id);
          writeStorage(FAVORITE_PROJECTS_KEY, next);
          return next;
        });
      },
      removeFavoriteProperty: (id) => {
        setFavoriteProperties((current) => {
          const next = current.filter((item) => item.id !== id);
          writeStorage(FAVORITE_PROPERTIES_KEY, next);
          return next;
        });
      },
      removeProjectCompare: (id) => {
        setProjectCompare((current) => {
          const next = current.filter((item) => item.id !== id);
          writeStorage(PROJECT_COMPARE_KEY, next);
          return next;
        });
      },
      removePropertyCompare: (id) => {
        setPropertyCompare((current) => {
          const next = current.filter((item) => item.id !== id);
          writeStorage(PROPERTY_COMPARE_KEY, next);
          return next;
        });
      },
      clearProjectCompare: () => {
        writeStorage(PROJECT_COMPARE_KEY, []);
        setProjectCompare([]);
      },
      clearPropertyCompare: () => {
        writeStorage(PROPERTY_COMPARE_KEY, []);
        setPropertyCompare([]);
      },
    }),
    [favoriteProjects, favoriteProperties, projectCompare, propertyCompare],
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
  return [
    { label: "Project", value: property.projectTitle },
    { label: "Developer", value: property.developerName },
    { label: "Location", value: property.location },
    { label: "Listing", value: property.offerType === "rent" ? "For Rent" : "For Sale" },
    { label: "Price", value: property.priceLabel || "Contact for price" },
    { label: "Area", value: property.areaLabel || "Not specified" },
    { label: "Rooms", value: property.roomsLabel || "Not specified" },
    { label: "Available from", value: property.availableFromLabel || "Not specified" },
    { label: "Minimum stay", value: property.minimumStayLabel || "Not specified" },
    { label: "Maximum stay", value: property.maximumStayLabel || "Not specified" },
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
}
