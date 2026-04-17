"use client";

import dynamic from "next/dynamic";

import type { InteractiveMapItem } from "@/features/projects/interactive-listings-map-inner";

const InteractiveListingsMapInner = dynamic(
  () =>
    import("@/features/projects/interactive-listings-map-inner").then(
      (mod) => mod.InteractiveListingsMapInner,
    ),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full min-h-[24rem] items-center justify-center bg-[linear-gradient(180deg,rgba(141,104,71,0.1),rgba(141,104,71,0.04))] p-8 text-center">
        <div className="max-w-sm">
          <p className="font-display text-3xl font-semibold text-stone-950">
            Loading map
          </p>
          <p className="mt-4 text-sm leading-7 text-[var(--muted-foreground)]">
            Preparing the live project map and marker positions.
          </p>
        </div>
      </div>
    ),
  },
);

type InteractiveListingsMapProps = {
  items: InteractiveMapItem[];
  selectedId?: string | null;
  className?: string;
  onSelectHref?: boolean;
  trackingContext?: string;
};

export function InteractiveListingsMap(props: InteractiveListingsMapProps) {
  return <InteractiveListingsMapInner {...props} />;
}
