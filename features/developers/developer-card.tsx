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
    <article className="rounded-[1.75rem] border border-stone-900/10 bg-white p-6 shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-4">
          {developer.logoUrl ? (
            <img
              src={developer.logoUrl}
              alt={`${developer.companyName} logo`}
              className="h-14 w-14 rounded-2xl border border-stone-200 object-cover"
            />
          ) : (
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-stone-950 text-sm font-semibold text-stone-100">
              {initials || "DP"}
            </div>
          )}
          <div>
            <h3 className="text-xl font-semibold tracking-tight text-stone-950">
              {developer.companyName}
            </h3>
            {developer.websiteUrl ? (
              <a
                href={developer.websiteUrl}
                target="_blank"
                rel="noreferrer"
                className="mt-2 inline-flex text-sm font-medium text-stone-600 underline decoration-stone-300 underline-offset-4"
              >
                Visit website
              </a>
            ) : null}
          </div>
        </div>
        {developer.isVerified ? (
          <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-emerald-900">
            Verified
          </span>
        ) : null}
      </div>
      <p className="mt-4 text-sm leading-6 text-stone-700">
        {developer.description ?? "Developer profile pending description."}
      </p>
      <div className="mt-6 flex items-center justify-between text-sm text-stone-600">
        <span>{developer.projects.length} active projects</span>
        <Link
          href={`/developers/${developer.slug}`}
          className="font-semibold text-stone-950 underline decoration-stone-300 underline-offset-4"
        >
          View profile
        </Link>
      </div>
    </article>
  );
}
