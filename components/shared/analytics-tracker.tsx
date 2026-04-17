"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { trackEvent } from "@/lib/analytics";

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const search = searchParams.toString();
    const path = search ? `${pathname}?${search}` : pathname;

    trackEvent("page_view", {
      path,
      pathname,
      search,
      title: typeof document === "undefined" ? "" : document.title,
      referrer:
        typeof document === "undefined" ? "" : document.referrer || "direct",
    });
  }, [pathname, searchParams]);

  return null;
}
