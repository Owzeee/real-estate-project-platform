import {
  deleteProjectMedia,
  moveProjectMedia,
  setProjectCoverMedia,
} from "@/features/projects/actions";
import type { ProjectMedia } from "@/features/projects/types";

type ProjectMediaManagerProps = {
  projectId: string;
  media: ProjectMedia[];
};

function mediaLabel(mediaType: ProjectMedia["mediaType"]) {
  return mediaType === "tour_3d" ? "3D tour" : mediaType;
}

export function ProjectMediaManager({
  projectId,
  media,
}: ProjectMediaManagerProps) {
  if (media.length === 0) {
    return (
      <article className="rounded-[1.75rem] border border-dashed border-stone-300 bg-stone-50 p-6 text-sm text-stone-600">
        No media has been attached yet. Add image, video, brochure, or 3D tour URLs in the form above and save the project.
      </article>
    );
  }

  return (
    <div className="grid gap-4">
      {media.map((item, index) => (
        <article
          key={item.id}
          className="rounded-[1.75rem] border border-stone-200 bg-stone-50 p-5"
        >
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-stone-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-100">
                  {mediaLabel(item.mediaType)}
                </span>
                {index === 0 ? (
                  <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-900">
                    Cover
                  </span>
                ) : null}
              </div>
              <p className="mt-3 break-all text-sm text-stone-700">{item.fileUrl}</p>
            </div>
            <div className="flex flex-wrap gap-3">
              <form action={moveProjectMedia.bind(null, projectId, item.id, "up")}>
                <button
                  disabled={index === 0}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Move up
                </button>
              </form>
              <form
                action={moveProjectMedia.bind(
                  null,
                  projectId,
                  item.id,
                  "down",
                )}
              >
                <button
                  disabled={index === media.length - 1}
                  className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Move down
                </button>
              </form>
              <form action={setProjectCoverMedia.bind(null, projectId, item.id)}>
                <button className="rounded-full border border-stone-300 px-4 py-2 text-sm font-semibold text-stone-900">
                  Set cover
                </button>
              </form>
              <form action={deleteProjectMedia.bind(null, projectId, item.id)}>
                <button className="rounded-full bg-stone-950 px-4 py-2 text-sm font-semibold text-white">
                  Delete
                </button>
              </form>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
