"use server";

import { revalidatePath } from "next/cache";

import { type ProjectActionState } from "@/features/projects/action-state";
import { normalizeVirtualTourUrl } from "@/features/projects/presentation";
import type { ProjectUnit } from "@/features/projects/types";
import { requireAdmin, requireDeveloperOrAdminAccess } from "@/lib/auth";
import { createAdminSupabaseClient, hasServiceRoleEnv } from "@/lib/supabase/server";

const allowedOfferTypes = new Set(["sale", "rent"]);
const allowedPriceModes = new Set(["fixed", "range", "contact"]);
const allowedCategories = new Set(["residential", "commercial", "office"]);
const allowedProjectTypes = new Set([
  "apartment",
  "villa",
  "townhouse",
  "mixed_use",
  "commercial",
  "land",
]);
const allowedCompletionStages = new Set([
  "pre_launch",
  "under_construction",
  "ready",
  "completed",
]);
const allowedStatuses = new Set(["draft", "active", "sold_out", "archived"]);

function optionalText(formData: FormData, key: string) {
  const value = formData.get(key)?.toString().trim();
  return value ? value : null;
}

function optionalNumber(formData: FormData, key: string) {
  const value = formData.get(key)?.toString().trim();
  if (!value) {
    return null;
  }

  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function parseMediaList(formData: FormData, key: string) {
  return (formData.get(key)?.toString() ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildMediaRows(projectId: string, formData: FormData) {
  const mediaGroups = [
    { key: "imageUrls", mediaType: "image" },
    { key: "videoUrls", mediaType: "video" },
    { key: "brochureUrls", mediaType: "brochure" },
    { key: "tour3dUrls", mediaType: "tour_3d" },
  ] as const;

  let sortOrder = 0;

  return mediaGroups.flatMap(({ key, mediaType }) =>
    parseMediaList(formData, key)
      .map((fileUrl) =>
        mediaType === "tour_3d" ? normalizeVirtualTourUrl(fileUrl) : fileUrl,
      )
      .filter((fileUrl): fileUrl is string => Boolean(fileUrl))
      .map((fileUrl) => ({
        project_id: projectId,
        media_type: mediaType,
        file_url: fileUrl,
        title: null,
        thumbnail_url: null,
        sort_order: sortOrder++,
      })),
  );
}

function parseUnitItems(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseUnitsJson(formData: FormData) {
  const raw = formData.get("unitsJson")?.toString().trim();

  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function parseAmenitySelectionJson(formData: FormData, key: string) {
  const raw = formData.get(key)?.toString().trim();
  if (!raw) {
    return [];
  }

  try {
    const parsed = JSON.parse(raw) as Record<string, string[]>;

    return Object.entries(parsed)
      .map(([title, items]) => ({
        title: title.charAt(0).toUpperCase() + title.slice(1),
        items: Array.isArray(items)
          ? items.map((item) => item.trim()).filter(Boolean)
          : [],
      }))
      .filter((group) => group.items.length > 0);
  } catch {
    return [];
  }
}

function normalizeProjectPricing(formData: FormData) {
  const offerType = formData.get("offerType")?.toString().trim();
  const priceMode = formData.get("priceMode")?.toString().trim();
  const fixedPrice = optionalNumber(formData, "fixedPrice");
  const minPrice = optionalNumber(formData, "minPrice");
  const maxPrice = optionalNumber(formData, "maxPrice");
  const rentPrice = optionalNumber(formData, "rentPrice");

  if (!offerType || !allowedOfferTypes.has(offerType)) {
    return { error: "Listing intent is invalid." } as const;
  }

  if (offerType === "rent") {
    if (rentPrice == null) {
      return { error: "Rent listings need a rent price." } as const;
    }

    return {
      offerType,
      priceMode: "fixed",
      fixedPrice: null,
      minPrice: rentPrice,
      maxPrice: null,
      rentPrice,
    } as const;
  }

  if (!priceMode || !allowedPriceModes.has(priceMode)) {
    return { error: "Sale listings need a valid pricing mode." } as const;
  }

  if (priceMode === "fixed") {
    if (fixedPrice == null) {
      return { error: "Fixed sale pricing needs a price." } as const;
    }

    return {
      offerType,
      priceMode,
      fixedPrice,
      minPrice: fixedPrice,
      maxPrice: null,
      rentPrice: null,
    } as const;
  }

  if (priceMode === "range") {
    if (minPrice == null || maxPrice == null) {
      return { error: "Range pricing needs both minimum and maximum price." } as const;
    }

    if (minPrice > maxPrice) {
      return { error: "Minimum price cannot be greater than maximum price." } as const;
    }

    return {
      offerType,
      priceMode,
      fixedPrice: null,
      minPrice,
      maxPrice,
      rentPrice: null,
    } as const;
  }

  return {
    offerType,
    priceMode: "contact",
    fixedPrice: null,
    minPrice: null,
    maxPrice: null,
    rentPrice: null,
  } as const;
}

function buildUnitRows(
  projectId: string,
  currencyCode: string,
  formData: FormData,
) {
  const units = parseUnitsJson(formData);

  return units
    .map((unit, index) => {
      const title = unit.title?.toString().trim();
      const slug = unit.slug?.toString().trim();

      if (!title || !slug) {
        return null;
      }

      const offerType = unit.offerType?.toString().trim();
      const priceMode = unit.priceMode?.toString().trim();
      const fixedPrice = Number(unit.fixedPrice);
      const minPrice = Number(unit.minPrice);
      const maxPrice = Number(unit.maxPrice);
      const monthlyRent = Number(unit.monthlyRent);
      const areaSqm = Number(unit.areaSqm);
      const rooms = Number(unit.rooms);
      const minimumStayMonths = Number(unit.minimumStayMonths);
      const maximumStayMonths = Number(unit.maximumStayMonths);

      if (!offerType || !allowedOfferTypes.has(offerType)) {
        return null;
      }

      let normalizedPriceMode: "fixed" | "range" | "contact" = "fixed";
      let normalizedFixedPrice: number | null = null;
      let normalizedMinPrice: number | null = null;
      let normalizedMaxPrice: number | null = null;
      let normalizedMonthlyRent: number | null = null;

      if (offerType === "rent") {
        normalizedMonthlyRent = Number.isFinite(monthlyRent) ? monthlyRent : null;

        if (normalizedMonthlyRent == null) {
          return null;
        }
      } else {
        if (!priceMode || !allowedPriceModes.has(priceMode)) {
          return null;
        }

        normalizedPriceMode = priceMode as "fixed" | "range" | "contact";

        if (normalizedPriceMode === "fixed") {
          normalizedFixedPrice = Number.isFinite(fixedPrice) ? fixedPrice : null;
          normalizedMinPrice = normalizedFixedPrice;
          if (normalizedFixedPrice == null) {
            return null;
          }
        }

        if (normalizedPriceMode === "range") {
          normalizedMinPrice = Number.isFinite(minPrice) ? minPrice : null;
          normalizedMaxPrice = Number.isFinite(maxPrice) ? maxPrice : null;
          if (
            normalizedMinPrice == null ||
            normalizedMaxPrice == null ||
            normalizedMinPrice > normalizedMaxPrice
          ) {
            return null;
          }
        }
      }

      const amenityGroups = [
        ...(Object.entries(unit.amenities ?? {}) as [string, string[]][])
          .map(([title, items]) => ({
            title: title.charAt(0).toUpperCase() + title.slice(1),
            items: Array.isArray(items)
              ? items.map((item) => item.trim()).filter(Boolean)
              : [],
          }))
          .filter((group) => group.items.length > 0),
      ];

      const beds = parseUnitItems(unit.beds ?? "").map((item) => ({
        label: item,
        roomLabel: "Bedroom",
      }));

      return {
        project_id: projectId,
        title,
        slug,
        summary: unit.summary?.toString().trim() || null,
        offer_type: offerType,
        price_mode: normalizedPriceMode,
        fixed_price: normalizedFixedPrice,
        min_price: normalizedMinPrice,
        max_price: normalizedMaxPrice,
        monthly_rent: normalizedMonthlyRent,
        currency_code: currencyCode,
        area_sqm: Number.isFinite(areaSqm) ? areaSqm : null,
        rooms: Number.isFinite(rooms) ? rooms : null,
        image_url: unit.imageUrl?.toString().trim() || null,
        gallery: parseUnitItems(unit.galleryUrls ?? "").map((src, galleryIndex) => ({
          src,
          alt: `${title} image ${galleryIndex + 1}`,
        })),
        amenity_groups: amenityGroups,
        beds,
        minimum_stay_months: Number.isFinite(minimumStayMonths)
          ? minimumStayMonths
          : null,
        maximum_stay_months: Number.isFinite(maximumStayMonths)
          ? maximumStayMonths
          : null,
        available_from: unit.availableFrom?.toString().trim() || null,
        availability_months: [
          { label: "Mar 2026", status: "limited" },
          { label: "Apr 2026", status: "available" },
          { label: "May 2026", status: "available" },
          { label: "Jun 2026", status: "available" },
          { label: "Jul 2026", status: "available" },
          { label: "Aug 2026", status: "available" },
        ] satisfies ProjectUnit["availabilityMonths"],
        sort_order: index,
      };
    })
    .filter(Boolean);
}

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/developer/projects");
  revalidatePath("/developer/inquiries");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/inquiries");

  if (slug) {
    revalidatePath(`/projects/${slug}`);
  }
}

async function getProjectSlug(projectId: string) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("projects")
    .select("slug")
    .eq("id", projectId)
    .maybeSingle();

  return data?.slug ?? null;
}

async function getProjectOwner(projectId: string) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { data } = await supabase
    .from("projects")
    .select("developer_profile_id, slug")
    .eq("id", projectId)
    .maybeSingle();

  return data
    ? {
        developerProfileId: data.developer_profile_id,
        slug: data.slug,
      }
    : null;
}

async function getSortedProjectMedia(projectId: string) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return [];
  }

  const { data } = await supabase
    .from("project_media")
    .select("id, sort_order")
    .eq("project_id", projectId)
    .order("sort_order", { ascending: true });

  return data ?? [];
}

async function normalizeProjectMediaSortOrder(projectId: string) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return;
  }

  const media = await getSortedProjectMedia(projectId);

  await Promise.all(
    media.map((item, index) =>
      supabase
        .from("project_media")
        .update({ sort_order: index })
        .eq("id", item.id),
    ),
  );
}

async function replaceProjectUnits(
  projectId: string,
  currencyCode: string,
  formData: FormData,
) {
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return null;
  }

  const { error: deleteError } = await supabase
    .from("project_units")
    .delete()
    .eq("project_id", projectId);

  if (deleteError) {
    return deleteError.message;
  }

  const unitRows = buildUnitRows(projectId, currencyCode, formData);
  if (unitRows.length > 0) {
    const { error: insertError } = await supabase
      .from("project_units")
      .insert(unitRows);

    if (insertError) {
      return insertError.message;
    }
  }

  return null;
}

export async function createProject(
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const developerProfileId = formData.get("developerProfileId")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const location = formData.get("location")?.toString().trim();
  const offerType = formData.get("offerType")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const projectType = formData.get("projectType")?.toString().trim();
  const completionStage = formData.get("completionStage")?.toString().trim();
  const status = formData.get("status")?.toString().trim();
  const currencyCode =
    formData.get("currencyCode")?.toString().trim().toUpperCase() || "USD";

  if (
    !developerProfileId ||
    !title ||
    !slug ||
    !description ||
    !location ||
    !offerType ||
    !category ||
    !projectType ||
    !completionStage ||
    !status
  ) {
    return {
      status: "error",
      message: "Developer, title, slug, description, location, type, stage, and status are required.",
    };
  }

  if (!hasServiceRoleEnv()) {
    return {
      status: "error",
      message: "Supabase environment variables are missing.",
    };
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Supabase server client is unavailable.",
    };
  }

  const pricing = normalizeProjectPricing(formData);
  if ("error" in pricing) {
    return {
      status: "error",
      message: pricing.error ?? "Invalid pricing configuration.",
    };
  }

  const latitude = optionalNumber(formData, "latitude");
  const longitude = optionalNumber(formData, "longitude");

  if ((latitude === null) !== (longitude === null)) {
    return {
      status: "error",
      message: "Latitude and longitude must be provided together.",
    };
  }

  if (
    !allowedOfferTypes.has(offerType) ||
    (offerType === "sale" && !allowedPriceModes.has(pricing.priceMode)) ||
    !allowedCategories.has(category) ||
    !allowedProjectTypes.has(projectType) ||
    !allowedCompletionStages.has(completionStage) ||
    !allowedStatuses.has(status)
  ) {
    return {
      status: "error",
      message: "One or more typed classification fields are invalid. Pick a value from the suggested options.",
    };
  }

  const auth = await requireDeveloperOrAdminAccess(developerProfileId);
  const finalDeveloperProfileId =
    auth.profile.role === "developer" && auth.developerProfile
      ? auth.developerProfile.id
      : developerProfileId;
  const isAdmin = auth.profile.role === "admin";

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      developer_profile_id: finalDeveloperProfileId,
      title,
      slug,
      description,
      location,
      amenity_groups: parseAmenitySelectionJson(formData, "projectAmenitiesJson"),
      offer_type: offerType,
      price_mode: pricing.priceMode,
      fixed_price: pricing.fixedPrice,
      category,
      city: optionalText(formData, "city"),
      country: optionalText(formData, "country"),
      latitude,
      longitude,
      min_price: pricing.minPrice,
      max_price: pricing.maxPrice,
      rent_price: pricing.rentPrice,
      currency_code: currencyCode,
      status,
      project_type: projectType,
      completion_stage: completionStage,
      approval_status: isAdmin ? "approved" : "pending",
      is_featured: false,
      approved_at: isAdmin ? new Date().toISOString() : null,
    })
    .select("id")
    .single();

  if (projectError || !project) {
    return {
      status: "error",
      message: projectError?.message ?? "Failed to create project.",
    };
  }

  const mediaRows = buildMediaRows(project.id, formData);

  if (mediaRows.length > 0) {
    const { error: mediaError } = await supabase
      .from("project_media")
      .insert(mediaRows);

    if (mediaError) {
      return {
        status: "error",
        message: mediaError.message,
      };
    }
  }

  const unitError = await replaceProjectUnits(project.id, currencyCode, formData);
  if (unitError) {
    return {
      status: "error",
      message: unitError,
    };
  }

  revalidateProjectPaths(slug);

  return {
    status: "success",
    message: "Project created. It is now saved and waiting for admin approval.",
  };
}

export async function updateProject(
  _previousState: ProjectActionState,
  formData: FormData,
): Promise<ProjectActionState> {
  const projectId = formData.get("projectId")?.toString().trim();
  const developerProfileId = formData.get("developerProfileId")?.toString().trim();
  const title = formData.get("title")?.toString().trim();
  const slug = formData.get("slug")?.toString().trim();
  const description = formData.get("description")?.toString().trim();
  const location = formData.get("location")?.toString().trim();
  const offerType = formData.get("offerType")?.toString().trim();
  const category = formData.get("category")?.toString().trim();
  const projectType = formData.get("projectType")?.toString().trim();
  const completionStage = formData.get("completionStage")?.toString().trim();
  const status = formData.get("status")?.toString().trim();
  const currencyCode =
    formData.get("currencyCode")?.toString().trim().toUpperCase() || "USD";

  if (
    !projectId ||
    !developerProfileId ||
    !title ||
    !slug ||
    !description ||
    !location ||
    !offerType ||
    !category ||
    !projectType ||
    !completionStage ||
    !status
  ) {
    return {
      status: "error",
      message: "All required project fields must be filled.",
    };
  }

  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Supabase server client is unavailable.",
    };
  }

  const pricing = normalizeProjectPricing(formData);
  if ("error" in pricing) {
    return {
      status: "error",
      message: pricing.error ?? "Invalid pricing configuration.",
    };
  }

  const latitude = optionalNumber(formData, "latitude");
  const longitude = optionalNumber(formData, "longitude");
  const currentProject = await getProjectOwner(projectId);

  if (!currentProject) {
    return {
      status: "error",
      message: "Project not found.",
    };
  }

  if (
    !allowedOfferTypes.has(offerType) ||
    (offerType === "sale" && !allowedPriceModes.has(pricing.priceMode)) ||
    !allowedCategories.has(category) ||
    !allowedProjectTypes.has(projectType) ||
    !allowedCompletionStages.has(completionStage) ||
    !allowedStatuses.has(status)
  ) {
    return {
      status: "error",
      message: "One or more typed classification fields are invalid. Pick a value from the suggested options.",
    };
  }

  const auth = await requireDeveloperOrAdminAccess(
    currentProject.developerProfileId,
  );
  const finalDeveloperProfileId =
    auth.profile.role === "developer" && auth.developerProfile
      ? auth.developerProfile.id
      : developerProfileId;

  const { error: updateError } = await supabase
    .from("projects")
    .update({
      developer_profile_id: finalDeveloperProfileId,
      title,
      slug,
      description,
      location,
      amenity_groups: parseAmenitySelectionJson(formData, "projectAmenitiesJson"),
      offer_type: offerType,
      price_mode: pricing.priceMode,
      fixed_price: pricing.fixedPrice,
      category,
      city: optionalText(formData, "city"),
      country: optionalText(formData, "country"),
      latitude,
      longitude,
      min_price: pricing.minPrice,
      max_price: pricing.maxPrice,
      rent_price: pricing.rentPrice,
      currency_code: currencyCode,
      status,
      project_type: projectType,
      completion_stage: completionStage,
    })
    .eq("id", projectId);

  if (updateError) {
    return {
      status: "error",
      message: updateError.message,
    };
  }

  await supabase.from("project_media").delete().eq("project_id", projectId);

  const mediaRows = buildMediaRows(projectId, formData);
  if (mediaRows.length > 0) {
    const { error: mediaError } = await supabase
      .from("project_media")
      .insert(mediaRows);

    if (mediaError) {
      return {
        status: "error",
        message: mediaError.message,
      };
    }
  }

  const unitError = await replaceProjectUnits(projectId, currencyCode, formData);
  if (unitError) {
    return {
      status: "error",
      message: unitError,
    };
  }

  revalidateProjectPaths(slug);

  return {
    status: "success",
    message: "Project updated successfully.",
  };
}

export async function moderateProject(
  projectId: string,
  nextApprovalStatus: "approved" | "rejected" | "pending",
) {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return;
  }

  await supabase
    .from("projects")
    .update({
      approval_status: nextApprovalStatus,
      status:
        nextApprovalStatus === "approved"
          ? "active"
          : nextApprovalStatus === "rejected"
            ? "archived"
            : "draft",
      approved_at:
        nextApprovalStatus === "approved"
          ? new Date().toISOString()
          : null,
    })
    .eq("id", projectId);

  revalidateProjectPaths();
}

export async function toggleFeaturedProject(
  projectId: string,
  isFeatured: boolean,
) {
  await requireAdmin();
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return;
  }

  await supabase
    .from("projects")
    .update({ is_featured: isFeatured })
    .eq("id", projectId);

  revalidateProjectPaths();
}

export async function deleteProjectMedia(projectId: string, mediaId: string) {
  const owner = await getProjectOwner(projectId);
  if (!owner) {
    return;
  }

  await requireDeveloperOrAdminAccess(owner.developerProfileId);
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return;
  }

  await supabase
    .from("project_media")
    .delete()
    .eq("id", mediaId)
    .eq("project_id", projectId);

  await normalizeProjectMediaSortOrder(projectId);

  const slug = await getProjectSlug(projectId);
  revalidateProjectPaths(slug ?? undefined);
  revalidatePath(`/developer/projects/${projectId}/edit`);
}

export async function moveProjectMedia(
  projectId: string,
  mediaId: string,
  direction: "up" | "down",
) {
  const owner = await getProjectOwner(projectId);
  if (!owner) {
    return;
  }

  await requireDeveloperOrAdminAccess(owner.developerProfileId);
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return;
  }

  const media = await getSortedProjectMedia(projectId);
  const currentIndex = media.findIndex((item) => item.id === mediaId);
  if (currentIndex === -1) {
    return;
  }

  const swapIndex = direction === "up" ? currentIndex - 1 : currentIndex + 1;
  if (swapIndex < 0 || swapIndex >= media.length) {
    return;
  }

  const current = media[currentIndex];
  const adjacent = media[swapIndex];

  await Promise.all([
    supabase
      .from("project_media")
      .update({ sort_order: adjacent.sort_order })
      .eq("id", current.id),
    supabase
      .from("project_media")
      .update({ sort_order: current.sort_order })
      .eq("id", adjacent.id),
  ]);

  const slug = await getProjectSlug(projectId);
  revalidateProjectPaths(slug ?? undefined);
  revalidatePath(`/developer/projects/${projectId}/edit`);
}

export async function setProjectCoverMedia(projectId: string, mediaId: string) {
  const owner = await getProjectOwner(projectId);
  if (!owner) {
    return;
  }

  await requireDeveloperOrAdminAccess(owner.developerProfileId);
  const supabase = createAdminSupabaseClient();
  if (!supabase) {
    return;
  }

  await supabase
    .from("project_media")
    .update({ sort_order: -1 })
    .eq("id", mediaId)
    .eq("project_id", projectId);

  await normalizeProjectMediaSortOrder(projectId);

  const slug = await getProjectSlug(projectId);
  revalidateProjectPaths(slug ?? undefined);
  revalidatePath(`/developer/projects/${projectId}/edit`);
}
