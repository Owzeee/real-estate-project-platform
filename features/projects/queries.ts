import { cache } from "react";

import { mockProjectSummaries, mockProjects } from "@/features/projects/mock-data";
import type { ProjectDetail, ProjectSummary } from "@/features/projects/types";
import {
  createServerSupabaseClient,
  hasPublicSupabaseEnv,
} from "@/lib/supabase/server";

function mapProjectSummary(row: {
  id: string;
  developer_profile_id: string;
  title: string;
  slug: string;
  description: string;
  location: string;
  city: string | null;
  country: string | null;
  min_price: number | null;
  max_price: number | null;
  currency_code: string;
  status: ProjectSummary["status"];
  approval_status: ProjectSummary["approvalStatus"];
  project_type: ProjectSummary["projectType"];
  completion_stage: ProjectSummary["completionStage"];
  is_featured: boolean;
  latitude: number | null;
  longitude: number | null;
  developer_profiles:
    | {
        company_name: string;
        slug: string;
      }
    | {
        company_name: string;
        slug: string;
      }[]
    | null;
  project_media:
    | {
        file_url: string;
      }[]
    | null;
}): ProjectSummary {
  const developer = Array.isArray(row.developer_profiles)
    ? row.developer_profiles[0]
    : row.developer_profiles;

  const media = row.project_media?.[0];

  return {
    id: row.id,
    developerProfileId: row.developer_profile_id,
    developerName: developer?.company_name ?? "Developer",
    developerSlug: developer?.slug ?? "",
    title: row.title,
    slug: row.slug,
    description: row.description,
    location: row.location,
    city: row.city,
    country: row.country,
    minPrice: row.min_price,
    maxPrice: row.max_price,
    currencyCode: row.currency_code,
    status: row.status,
    approvalStatus: row.approval_status,
    projectType: row.project_type,
    completionStage: row.completion_stage,
    isFeatured: row.is_featured,
    latitude: row.latitude,
    longitude: row.longitude,
    heroMediaUrl: media?.file_url ?? null,
  };
}

export const getProjects = cache(async () => {
  if (!hasPublicSupabaseEnv()) {
    return mockProjectSummaries;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return mockProjectSummaries;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        id,
        developer_profile_id,
        title,
        slug,
        description,
        location,
        city,
        country,
        min_price,
        max_price,
        currency_code,
        status,
        approval_status,
        project_type,
        completion_stage,
        is_featured,
        latitude,
        longitude,
        developer_profiles (
          company_name,
          slug
        ),
        project_media (
          file_url
        )
      `,
    )
    .eq("status", "active")
    .eq("approval_status", "approved")
    .order("is_featured", { ascending: false })
    .order("created_at", { ascending: false });

  if (error || !data) {
    return mockProjectSummaries;
  }

  return data.map(mapProjectSummary);
});

export const getDashboardProjects = cache(async () => {
  if (!hasPublicSupabaseEnv()) {
    return mockProjectSummaries;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return mockProjectSummaries;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        id,
        developer_profile_id,
        title,
        slug,
        description,
        location,
        city,
        country,
        min_price,
        max_price,
        currency_code,
        status,
        approval_status,
        project_type,
        completion_stage,
        is_featured,
        latitude,
        longitude,
        developer_profiles (
          company_name,
          slug
        ),
        project_media (
          file_url
        )
      `,
    )
    .order("created_at", { ascending: false });

  if (error || !data) {
    return mockProjectSummaries;
  }

  return data.map(mapProjectSummary);
});

export const getFeaturedProjects = cache(async () => {
  const projects = await getProjects();
  return projects.filter((project) => project.isFeatured).slice(0, 3);
});

export const getProjectBySlug = cache(async (slug: string) => {
  if (!hasPublicSupabaseEnv()) {
    return mockProjects.find((project) => project.slug === slug) ?? null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return mockProjects.find((project) => project.slug === slug) ?? null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        id,
        developer_profile_id,
        title,
        slug,
        description,
        location,
        city,
        country,
        min_price,
        max_price,
        currency_code,
        status,
        approval_status,
        project_type,
        completion_stage,
        is_featured,
        latitude,
        longitude,
        developer_profiles (
          company_name,
          slug
        ),
        project_media (
          id,
          project_id,
          media_type,
          file_url,
          thumbnail_url,
          title,
          sort_order
        )
      `,
    )
    .eq("slug", slug)
    .maybeSingle();

  if (error || !data) {
    return mockProjects.find((project) => project.slug === slug) ?? null;
  }

  const summary = mapProjectSummary({
    ...data,
    project_media: data.project_media?.slice().sort((a, b) => a.sort_order - b.sort_order),
  });

  const media = (data.project_media ?? []).map((item) => ({
    id: item.id,
    projectId: item.project_id,
    mediaType: item.media_type,
    fileUrl: item.file_url,
    thumbnailUrl: item.thumbnail_url,
    title: item.title,
    sortOrder: item.sort_order,
  })) as ProjectDetail["media"];

  return {
    ...summary,
    media,
  };
});

export const getProjectById = cache(async (id: string) => {
  if (!hasPublicSupabaseEnv()) {
    return mockProjects.find((project) => project.id === id) ?? null;
  }

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return mockProjects.find((project) => project.id === id) ?? null;
  }

  const { data, error } = await supabase
    .from("projects")
    .select(
      `
        id,
        developer_profile_id,
        title,
        slug,
        description,
        location,
        city,
        country,
        min_price,
        max_price,
        currency_code,
        status,
        approval_status,
        project_type,
        completion_stage,
        is_featured,
        latitude,
        longitude,
        developer_profiles (
          company_name,
          slug
        ),
        project_media (
          id,
          project_id,
          media_type,
          file_url,
          thumbnail_url,
          title,
          sort_order
        )
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !data) {
    return mockProjects.find((project) => project.id === id) ?? null;
  }

  const summary = mapProjectSummary({
    ...data,
    project_media: data.project_media?.slice().sort((a, b) => a.sort_order - b.sort_order),
  });

  return {
    ...summary,
    media: (data.project_media ?? []).map((item) => ({
      id: item.id,
      projectId: item.project_id,
      mediaType: item.media_type,
      fileUrl: item.file_url,
      thumbnailUrl: item.thumbnail_url,
      title: item.title,
      sortOrder: item.sort_order,
    })) as ProjectDetail["media"],
  };
});

export const getProjectsForDeveloper = cache(async (developerProfileId: string) => {
  const projects = await getDashboardProjects();
  return projects.filter(
    (project) => project.developerProfileId === developerProfileId,
  );
});
