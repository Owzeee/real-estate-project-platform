/* eslint-disable @next/next/no-img-element */
import Link from "next/link";

import type { DeveloperDetail } from "@/features/developers/types";

type DeveloperCardProps = {
  developer: DeveloperDetail;
};

export function DeveloperCard({ developer }: DeveloperCardProps) {
  const initials = developer.companyName
    .split(" ")
    .slice(0, 2)
    .map((part: string) => part[0]?.toUpperCase() ?? "")
    .join("");

  return (
    <article className="surface-panel group h-full overflow-hidden rounded-[1.75rem] transition duration-300 hover:-translate-y-1 hover:border-[rgba(141,104,71,0.3)] hover:shadow-[0_28px_80px_rgba(32,28,25,0.12)]">
      <div className="relative h-28 bg-gradient-to-r from-[rgba(141,104,71,0.2)] via-[rgba(176,132,90,0.22)] to-[rgba(198,154,91,0.18)]">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.26),transparent_28%)]" />
      </div>
      <div className="p-6">
        <div className="-mt-14 flex items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            {developer.logoUrl ? (
              <img
                src={developer.logoUrl}
                alt={`${developer.companyName} logo`}
                className="h-20 w-20 rounded-[1.35rem] border-4 border-[var(--card)] object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-[1.35rem] border-4 border-[var(--card)] bg-[linear-gradient(145deg,var(--primary),color-mix(in_srgb,var(--primary)_72%,black))] text-lg font-bold text-[var(--primary-foreground)] shadow-lg">
                {initials || "DP"}
              </div>
            )}
            <div className="pt-10">
              <h3 className="font-display text-2xl font-bold tracking-tight text-stone-950 transition-colors group-hover:text-[var(--primary)] sm:text-[2rem]">
                {developer.companyName}
              </h3>
              <p className="mt-2 text-sm text-[var(--muted-foreground)]">
                {developer.projects.length} published projects
              </p>
            </div>
          </div>
          {developer.isVerified ? (
            <span className="rounded-full bg-[rgba(198,154,91,0.14)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent)]">
              Verified
            </span>
          ) : null}
        </div>

        <p className="font-copy mt-6 text-[15px] leading-7 text-stone-700">
          {developer.description ?? "Developer profile pending description."}
        </p>

        <div className="mt-6 flex flex-wrap gap-2">
          <span className="rounded-full bg-[rgba(141,104,71,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">
            Public profile
          </span>
          <span className="rounded-full bg-[rgba(141,104,71,0.08)] px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-stone-700">
            Inquiry ready
          </span>
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border)] pt-5">
          {developer.websiteUrl ? (
            <a
              href={developer.websiteUrl}
              target="_blank"
              rel="noreferrer"
              className="text-sm font-medium text-[var(--muted-foreground)] underline decoration-[var(--border)] underline-offset-4 hover:text-[var(--primary)]"
            >
              Visit website
            </a>
          ) : (
            <span className="text-sm text-[var(--muted-foreground)]">Public profile available</span>
          )}

          <Link
            href={`/developers/${developer.slug}`}
            className="primary-button px-5 py-3 text-sm"
          >
            View profile
          </Link>
        </div>
      </div>
    </article>
  );
}
