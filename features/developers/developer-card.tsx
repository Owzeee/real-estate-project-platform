import Link from "next/link";

import type { DeveloperDetail } from "@/features/developers/types";

type DeveloperCardProps = {
  developer: DeveloperDetail;
};

export function DeveloperCard({ developer }: DeveloperCardProps) {
  return (
    <article className="rounded-[1.75rem] border border-stone-900/10 bg-white p-6 shadow-[0_18px_50px_rgba(41,37,36,0.08)]">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-xl font-semibold tracking-tight text-stone-950">
          {developer.companyName}
        </h3>
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
