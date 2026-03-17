import { cache } from "react";

import { mockDevelopers } from "@/features/projects/mock-data";
import type { DeveloperDetail } from "@/features/developers/types";
import { getDashboardProjects, getProjects } from "@/features/projects/queries";
import { createServerSupabaseClient, hasSupabaseEnv } from "@/lib/supabase/server";

export const getDevelopers = cache(async () => {
  if (!hasSupabaseEnv()) {
    return mockDevelopers;
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return mockDevelopers;
  }

  const { data, error } = await supabase
    .from("developer_profiles")
    .select(
      `
        id,
        user_id,
        company_name,
        slug,
        description,
        website_url,
        logo_url,
        is_verified
      `,
    )
    .order("company_name");

  if (error || !data) {
    return mockDevelopers;
  }

  const projects = await getProjects();

  return data.map((developer) => ({
    id: developer.id,
    userId: developer.user_id,
    companyName: developer.company_name,
    slug: developer.slug,
    description: developer.description,
    websiteUrl: developer.website_url,
    logoUrl: developer.logo_url,
    isVerified: developer.is_verified,
    projects: projects.filter(
      (project) => project.developerProfileId === developer.id,
    ),
  })) satisfies DeveloperDetail[];
});

export const getDeveloperBySlug = cache(async (slug: string) => {
  const developers = await getDevelopers();
  return developers.find((developer) => developer.slug === slug) ?? null;
});

export const getDevelopersWithAllProjects = cache(async () => {
  if (!hasSupabaseEnv()) {
    return mockDevelopers;
  }

  const supabase = createServerSupabaseClient();
  if (!supabase) {
    return mockDevelopers;
  }

  const { data, error } = await supabase
    .from("developer_profiles")
    .select(
      `
        id,
        user_id,
        company_name,
        slug,
        description,
        website_url,
        logo_url,
        is_verified
      `,
    )
    .order("company_name");

  if (error || !data) {
    return mockDevelopers;
  }

  const projects = await getDashboardProjects();

  return data.map((developer) => ({
    id: developer.id,
    userId: developer.user_id,
    companyName: developer.company_name,
    slug: developer.slug,
    description: developer.description,
    websiteUrl: developer.website_url,
    logoUrl: developer.logo_url,
    isVerified: developer.is_verified,
    projects: projects.filter(
      (project) => project.developerProfileId === developer.id,
    ),
  })) satisfies DeveloperDetail[];
});
