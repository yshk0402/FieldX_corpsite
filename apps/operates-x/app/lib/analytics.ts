type EventParams = Record<string, string | number | boolean | null | undefined>;

type Gtag = (
  command: "event" | "config" | "js",
  eventNameOrId: string | Date,
  params?: EventParams
) => void;

declare global {
  interface Window {
    gtag?: Gtag;
  }
}

export function trackEvent(name: string, params?: EventParams) {
  if (typeof window === "undefined") {
    return;
  }

  if (typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", name, params);
}

