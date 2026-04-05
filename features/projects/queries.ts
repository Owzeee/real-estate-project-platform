import { cache } from "react";

import { mockProjectSummaries, mockProjects } from "@/features/projects/mock-data";
import type { ProjectDetail, ProjectSummary, ProjectUnit } from "@/features/projects/types";
import {
  createAdminSupabaseClient,
  hasServiceRoleEnv,
  useMockData,
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
        sort_order: number;
      }[]
    | null;
}): ProjectSummary {
  const developer = Array.isArray(row.developer_profiles)
    ? row.developer_profiles[0]
    : row.developer_profiles;

  const media = row.project_media?.slice().sort((a, b) => a.sort_order - b.sort_order)[0];

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

function mapProjectUnits(
  units:
    | {
        id: string;
        project_id: string;
        title: string;
        slug: string;
        summary: string | null;
        monthly_rent: number | null;
        currency_code: string;
        area_sqm: number | null;
        rooms: number | null;
        image_url: string | null;
        gallery: ProjectUnit["gallery"] | null;
        amenity_groups: ProjectUnit["amenityGroups"] | null;
        beds: ProjectUnit["beds"] | null;
        minimum_stay_months: number | null;
        maximum_stay_months: number | null;
        available_from: string | null;
        availability_months: ProjectUnit["availabilityMonths"] | null;
        sort_order: number;
      }[]
    | null,
): ProjectUnit[] {
  return (units ?? []).map((unit) => ({
    id: unit.id,
    projectId: unit.project_id,
    title: unit.title,
    slug: unit.slug,
    summary: unit.summary,
    monthlyRent: unit.monthly_rent,
    currencyCode: unit.currency_code,
    areaSqm: unit.area_sqm,
    rooms: unit.rooms,
    imageUrl: unit.image_url,
    gallery: unit.gallery ?? [],
    amenityGroups: unit.amenity_groups ?? [],
    beds: unit.beds ?? [],
    minimumStayMonths: unit.minimum_stay_months,
    maximumStayMonths: unit.maximum_stay_months,
    availableFrom: unit.available_from,
    availabilityMonths: unit.availability_months ?? [],
    sortOrder: unit.sort_order,
  }));
}

export const getProjects = cache(async () => {
  if (useMockData() || !hasServiceRoleEnv()) {
    return mockProjectSummaries;
  }

  const supabase = createAdminSupabaseClient();
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
          file_url,
          sort_order
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
  return getDashboardProjectsForDeveloper();
});

export const getDashboardProjectsForDeveloper = cache(async (developerProfileId?: string) => {
  if (useMockData() || !hasServiceRoleEnv()) {
    return mockProjectSummaries;
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return mockProjectSummaries;
  }

  let query = supabase
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
          file_url,
          sort_order
        )
      `,
    )
    .order("created_at", { ascending: false });

  if (developerProfileId) {
    query = query.eq("developer_profile_id", developerProfileId);
  }

  const { data, error } = await query;

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
  if (useMockData() || !hasServiceRoleEnv()) {
    return mockProjects.find((project) => project.slug === slug) ?? null;
  }

  const supabase = createAdminSupabaseClient();
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
        ),
        project_units (
          id,
          project_id,
          title,
          slug,
          summary,
          monthly_rent,
          currency_code,
          area_sqm,
          rooms,
          image_url,
          gallery,
          amenity_groups,
          beds,
          minimum_stay_months,
          maximum_stay_months,
          available_from,
          availability_months,
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
    units: mapProjectUnits(data.project_units),
  };
});

export const getProjectById = cache(async (id: string) => {
  if (useMockData() || !hasServiceRoleEnv()) {
    return mockProjects.find((project) => project.id === id) ?? null;
  }

  const supabase = createAdminSupabaseClient();
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
        ),
        project_units (
          id,
          project_id,
          title,
          slug,
          summary,
          monthly_rent,
          currency_code,
          area_sqm,
          rooms,
          image_url,
          gallery,
          amenity_groups,
          beds,
          minimum_stay_months,
          maximum_stay_months,
          available_from,
          availability_months,
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
    units: mapProjectUnits(data.project_units),
  };
});
