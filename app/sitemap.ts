import type { MetadataRoute } from "next";

import { getDevelopers } from "@/features/developers/queries";
import { getProjectBySlug } from "@/features/projects/queries";
import { getProjects } from "@/features/projects/queries";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, developers] = await Promise.all([getProjects(), getDevelopers()]);
  const projectDetails = await Promise.all(
    projects.map((project) => getProjectBySlug(project.slug)),
  );
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
      lastModified,
    },
    {
      url: absoluteUrl("/projects"),
      changeFrequency: "daily",
      priority: 0.95,
      lastModified,
    },
    {
      url: absoluteUrl("/developers"),
      changeFrequency: "weekly",
      priority: 0.8,
      lastModified,
    },
    {
      url: absoluteUrl("/abidjan"),
      changeFrequency: "weekly",
      priority: 0.9,
      lastModified,
    },
    {
      url: absoluteUrl("/cote-divoire"),
      changeFrequency: "weekly",
      priority: 0.85,
      lastModified,
    },
    {
      url: absoluteUrl("/abidjan/terrains"),
      changeFrequency: "weekly",
      priority: 0.82,
      lastModified,
    },
    {
      url: absoluteUrl("/abidjan/bureaux"),
      changeFrequency: "weekly",
      priority: 0.82,
      lastModified,
    },
  ];

  const projectRoutes = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    changeFrequency: "weekly" as const,
    priority: project.isFeatured ? 0.9 : 0.8,
    lastModified,
  }));

  const developerRoutes = developers.map((developer) => ({
    url: absoluteUrl(`/developers/${developer.slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.7,
    lastModified,
  }));

  const unitRoutes = projectDetails.flatMap((project) =>
    project
      ? project.units.map((unit) => ({
          url: absoluteUrl(`/projects/${project.slug}/units/${unit.slug}`),
          changeFrequency: "weekly" as const,
          priority: 0.72,
          lastModified,
        }))
      : [],
  );

  return [...staticRoutes, ...projectRoutes, ...unitRoutes, ...developerRoutes];
}
