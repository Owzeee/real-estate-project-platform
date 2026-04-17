"use client";

import { useEffect } from "react";

import { trackEvent } from "@/lib/analytics";

type ProjectsPageAnalyticsProps = {
  query: string;
  type: string;
  stage: string;
  location: string;
  selected: string;
  currentView: "list" | "map";
  resultCount: number;
  mapResultCount: number;
};

export function ProjectsPageAnalytics({
  query,
  type,
  stage,
  location,
  selected,
  currentView,
  resultCount,
  mapResultCount,
}: ProjectsPageAnalyticsProps) {
  useEffect(() => {
    trackEvent("projects_listing_viewed", {
      query,
      project_type: type || "all",
      completion_stage: stage || "all",
      location: location || "all",
      selected_project_slug: selected || "",
      view_mode: currentView,
      result_count: resultCount,
      map_result_count: mapResultCount,
      has_filters: Boolean(query || type || stage || location),
    });
  }, [currentView, location, mapResultCount, query, resultCount, selected, stage, type]);

  return null;
}
