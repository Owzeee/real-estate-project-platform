"use client";

type AnalyticsPrimitive = string | number | boolean | null;
export type AnalyticsPayload = Record<
  string,
  AnalyticsPrimitive | AnalyticsPrimitive[] | undefined
>;

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    gtag?: (...args: unknown[]) => void;
    __immoNeufAnalyticsLog?: Array<Record<string, unknown>>;
  }
}

export function trackEvent(event: string, payload: AnalyticsPayload = {}) {
  if (typeof window === "undefined") {
    return;
  }

  const eventPayload = {
    event,
    ...payload,
  };

  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push(eventPayload);

  if (typeof window.gtag === "function") {
    window.gtag("event", event, payload);
  }

  window.__immoNeufAnalyticsLog = window.__immoNeufAnalyticsLog ?? [];
  window.__immoNeufAnalyticsLog.push({
    ...eventPayload,
    tracked_at: new Date().toISOString(),
  });
}
