import type { MetadataRoute } from "next";

import { getDevelopers } from "@/features/developers/queries";
import { getProjects } from "@/features/projects/queries";
import { absoluteUrl } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projects, developers] = await Promise.all([getProjects(), getDevelopers()]);

  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/projects"),
      changeFrequency: "daily",
      priority: 0.95,
    },
    {
      url: absoluteUrl("/developers"),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/abidjan"),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: absoluteUrl("/cote-divoire"),
      changeFrequency: "weekly",
      priority: 0.85,
    },
    {
      url: absoluteUrl("/abidjan/terrains"),
      changeFrequency: "weekly",
      priority: 0.82,
    },
    {
      url: absoluteUrl("/abidjan/bureaux"),
      changeFrequency: "weekly",
      priority: 0.82,
    },
  ];

  const projectRoutes = projects.map((project) => ({
    url: absoluteUrl(`/projects/${project.slug}`),
    changeFrequency: "weekly" as const,
    priority: project.isFeatured ? 0.9 : 0.8,
  }));

  const developerRoutes = developers.map((developer) => ({
    url: absoluteUrl(`/developers/${developer.slug}`),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...projectRoutes, ...developerRoutes];
}
