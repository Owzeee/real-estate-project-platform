"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { formatCompletionStageLabel, formatProjectTypeLabel } from "@/features/projects/presentation";
import type { ProjectSummary } from "@/features/projects/types";
import { formatProjectPricing } from "@/lib/utils/format-price";

type StoredProject = Pick<
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

type ProjectsStoreValue = {
  favorites: StoredProject[];
  compare: StoredProject[];
  isFavorite: (id: string) => boolean;
  isCompared: (id: string) => boolean;
  toggleFavorite: (project: StoredProject) => void;
  toggleCompare: (project: StoredProject) => void;
  removeFavorite: (id: string) => void;
  removeCompare: (id: string) => void;
  clearCompare: () => void;
};

const FAVORITES_KEY = "real-estate-favorites";
const COMPARE_KEY = "real-estate-compare";
const MAX_COMPARE = 3;

const ProjectsStoreContext = createContext<ProjectsStoreValue | null>(null);

function readStorage(key: string): StoredProject[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as StoredProject[]) : [];
  } catch {
    return [];
  }
}

function writeStorage(key: string, value: StoredProject[]) {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function ProjectsStoreProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<StoredProject[]>(() =>
    readStorage(FAVORITES_KEY),
  );
  const [compare, setCompare] = useState<StoredProject[]>(() =>
    readStorage(COMPARE_KEY),
  );

  const value = useMemo<ProjectsStoreValue>(
    () => ({
      favorites,
      compare,
      isFavorite: (id) => favorites.some((project) => project.id === id),
      isCompared: (id) => compare.some((project) => project.id === id),
      toggleFavorite: (project) => {
        setFavorites((current) => {
          const next = current.some((item) => item.id === project.id)
            ? current.filter((item) => item.id !== project.id)
            : [project, ...current];

          writeStorage(FAVORITES_KEY, next);
          return next;
        });
      },
      toggleCompare: (project) => {
        setCompare((current) => {
          const exists = current.some((item) => item.id === project.id);
          const next = exists
            ? current.filter((item) => item.id !== project.id)
            : [...current.slice(-(MAX_COMPARE - 1)), project];

          writeStorage(COMPARE_KEY, next);
          return next;
        });
      },
      removeFavorite: (id) => {
        setFavorites((current) => {
          const next = current.filter((item) => item.id !== id);
          writeStorage(FAVORITES_KEY, next);
          return next;
        });
      },
      removeCompare: (id) => {
        setCompare((current) => {
          const next = current.filter((item) => item.id !== id);
          writeStorage(COMPARE_KEY, next);
          return next;
        });
      },
      clearCompare: () => {
        writeStorage(COMPARE_KEY, []);
        setCompare([]);
      },
    }),
    [compare, favorites],
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

export function getCompareRows(project: StoredProject) {
  return [
    { label: "Developer", value: project.developerName },
    { label: "Location", value: project.location },
    { label: "Type", value: formatProjectTypeLabel(project.projectType) },
    {
      label: "Stage",
      value: formatCompletionStageLabel(project.completionStage),
    },
    {
      label: "Price",
      value: formatProjectPricing({
        offerType: project.offerType,
        priceMode: project.priceMode,
        fixedPrice: project.minPrice,
        minPrice: project.minPrice,
        maxPrice: project.maxPrice,
        rentPrice: project.rentPrice,
        currencyCode: project.currencyCode,
      }),
    },
  ];
}
