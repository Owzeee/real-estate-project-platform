"use server";

import { revalidatePath } from "next/cache";

import { type ProjectActionState } from "@/features/projects/action-state";
import { requireAdmin, requireDeveloperOrAdminAccess } from "@/lib/auth";
import {
  createAdminSupabaseClient,
  createServerSupabaseClient,
  hasPublicSupabaseEnv,
} from "@/lib/supabase/server";

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

function getFiles(formData: FormData, key: string) {
  return formData
    .getAll(key)
    .filter((value): value is File => value instanceof File && value.size > 0);
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9.\-_]/g, "-");
}

async function uploadFilesToStorage(
  projectId: string,
  files: File[],
  mediaType: "image" | "video" | "brochure",
) {
  const supabase = createAdminSupabaseClient();
  if (!supabase || files.length === 0) {
    return [] as {
      media_type: "image" | "video" | "brochure";
      file_url: string;
    }[];
  }

  const uploaded: {
    media_type: "image" | "video" | "brochure";
    file_url: string;
  }[] = [];

  for (const file of files) {
    const path = `${projectId}/${Date.now()}-${sanitizeFilename(file.name)}`;
    const { error } = await supabase.storage
      .from("project-media")
      .upload(path, file, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      throw error;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from("project-media").getPublicUrl(path);

    uploaded.push({
      media_type: mediaType,
      file_url: publicUrl,
    });
  }

  return uploaded;
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
    parseMediaList(formData, key).map((fileUrl) => ({
      project_id: projectId,
      media_type: mediaType,
      file_url: fileUrl,
      title: null,
      thumbnail_url: null,
      sort_order: sortOrder++,
    })),
  );
}

async function buildAllMediaRows(projectId: string, formData: FormData) {
  const urlRows = buildMediaRows(projectId, formData);

  const uploadedImages = await uploadFilesToStorage(
    projectId,
    getFiles(formData, "imageFiles"),
    "image",
  );

  const attachmentFiles = getFiles(formData, "attachmentFiles");
  const uploadedAttachments = await Promise.all(
    attachmentFiles.map(async (file) => {
      const mediaType = file.type.startsWith("video/")
        ? "video"
        : file.type === "application/pdf"
          ? "brochure"
          : file.type.startsWith("image/")
            ? "image"
            : "brochure";

      const [uploaded] = await uploadFilesToStorage(projectId, [file], mediaType);
      return uploaded;
    }),
  );

  const mediaRows = [
    ...urlRows,
    ...uploadedImages,
    ...uploadedAttachments.filter(Boolean),
  ];

  return mediaRows.map((item, index) => ({
    project_id: projectId,
    media_type: item.media_type,
    file_url: item.file_url,
    title: null,
    thumbnail_url: null,
    sort_order: index,
  }));
}

function revalidateProjectPaths(slug?: string) {
  revalidatePath("/");
  revalidatePath("/projects");
  revalidatePath("/developer/projects");
  revalidatePath("/admin/projects");
  revalidatePath("/admin/inquiries");

  if (slug) {
    revalidatePath(`/projects/${slug}`);
  }
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
    !projectType ||
    !completionStage ||
    !status
  ) {
    return {
      status: "error",
      message: "Developer, title, slug, description, location, type, stage, and status are required.",
    };
  }

  if (!hasPublicSupabaseEnv()) {
    return {
      status: "error",
      message: "Supabase environment variables are missing.",
    };
  }

  await requireDeveloperOrAdminAccess(developerProfileId);

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Supabase server client is unavailable.",
    };
  }

  const minPrice = optionalNumber(formData, "minPrice");
  const maxPrice = optionalNumber(formData, "maxPrice");
  const latitude = optionalNumber(formData, "latitude");
  const longitude = optionalNumber(formData, "longitude");

  if (minPrice && maxPrice && minPrice > maxPrice) {
    return {
      status: "error",
      message: "Minimum price cannot be greater than maximum price.",
    };
  }

  if ((latitude === null) !== (longitude === null)) {
    return {
      status: "error",
      message: "Latitude and longitude must be provided together.",
    };
  }

  const { data: project, error: projectError } = await supabase
    .from("projects")
    .insert({
      developer_profile_id: developerProfileId,
      title,
      slug,
      description,
      location,
      city: optionalText(formData, "city"),
      country: optionalText(formData, "country"),
      latitude,
      longitude,
      min_price: minPrice,
      max_price: maxPrice,
      currency_code: currencyCode,
      status,
      project_type: projectType,
      completion_stage: completionStage,
      approval_status: "pending",
      is_featured: false,
    })
    .select("id")
    .single();

  if (projectError || !project) {
    return {
      status: "error",
      message: projectError?.message ?? "Failed to create project.",
    };
  }

  const mediaRows = await buildAllMediaRows(project.id, formData);

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
    !projectType ||
    !completionStage ||
    !status
  ) {
    return {
      status: "error",
      message: "All required project fields must be filled.",
    };
  }

  await requireDeveloperOrAdminAccess(developerProfileId);

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return {
      status: "error",
      message: "Supabase server client is unavailable.",
    };
  }

  const minPrice = optionalNumber(formData, "minPrice");
  const maxPrice = optionalNumber(formData, "maxPrice");
  const latitude = optionalNumber(formData, "latitude");
  const longitude = optionalNumber(formData, "longitude");

  const { error: updateError } = await supabase
    .from("projects")
    .update({
      developer_profile_id: developerProfileId,
      title,
      slug,
      description,
      location,
      city: optionalText(formData, "city"),
      country: optionalText(formData, "country"),
      latitude,
      longitude,
      min_price: minPrice,
      max_price: maxPrice,
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

  const mediaRows = await buildAllMediaRows(projectId, formData);
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

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  await supabase
    .from("projects")
    .update({
      approval_status: nextApprovalStatus,
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

  const supabase = await createServerSupabaseClient();
  if (!supabase) {
    return;
  }

  await supabase
    .from("projects")
    .update({ is_featured: isFeatured })
    .eq("id", projectId);

  revalidateProjectPaths();
}
