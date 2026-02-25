"use client";

import { useEffect, useRef } from "react";

import { trackEvent } from "../lib/analytics";

declare global {
  interface Window {
    Tally?: {
      loadEmbeds: () => void;
    };
  }
}

const TALLY_WIDGET_SCRIPT_SRC = "https://tally.so/widgets/embed.js";

function loadTallyEmbeds() {
  if (typeof window === "undefined") {
    return;
  }

  if (window.Tally) {
    window.Tally.loadEmbeds();
    return;
  }

  document
    .querySelectorAll<HTMLIFrameElement>('iframe[data-tally-src]:not([src])')
    .forEach((iframe) => {
      iframe.src = iframe.dataset.tallySrc ?? "";
    });
}

export function TallyRequestEmbed() {
  const hasTrackedSubmitRef = useRef(false);

  useEffect(() => {
    trackEvent("contact_page_view", { source: "contact_page" });
    loadTallyEmbeds();

    const onMessage = (event: MessageEvent) => {
      const payload = event.data;
      let submitDetected = false;
      let formId: string | undefined;

      if (typeof payload === "string") {
        submitDetected = payload.includes("Tally.FormSubmitted");
      } else if (payload && typeof payload === "object") {
        const eventName =
          "event" in payload && typeof payload.event === "string"
            ? payload.event
            : "type" in payload && typeof payload.type === "string"
              ? payload.type
              : "";

        if (eventName === "Tally.FormSubmitted") {
          submitDetected = true;
        }

        if ("data" in payload && payload.data && typeof payload.data === "object" && "formId" in payload.data) {
          formId = String(payload.data.formId);
        }
      }

      if (!submitDetected || hasTrackedSubmitRef.current) {
        return;
      }

      hasTrackedSubmitRef.current = true;
      trackEvent("contact_submit", { form_id: formId ?? "unknown", channel: "tally" });
    };

    window.addEventListener("message", onMessage);

    const existingScript = document.querySelector<HTMLScriptElement>(
      `script[src="${TALLY_WIDGET_SCRIPT_SRC}"]`
    );

    if (existingScript) {
      existingScript.addEventListener("load", loadTallyEmbeds);
      existingScript.addEventListener("error", loadTallyEmbeds);

      return () => {
        existingScript.removeEventListener("load", loadTallyEmbeds);
        existingScript.removeEventListener("error", loadTallyEmbeds);
        window.removeEventListener("message", onMessage);
      };
    }

    const script = document.createElement("script");
    script.src = TALLY_WIDGET_SCRIPT_SRC;
    script.async = true;
    script.onload = loadTallyEmbeds;
    script.onerror = loadTallyEmbeds;
    document.body.appendChild(script);

    return () => {
      script.onload = null;
      script.onerror = null;
      window.removeEventListener("message", onMessage);
    };
  }, []);

  return (
    <div className="fx-embed-shell">
      <iframe
        data-tally-src="https://tally.so/embed/gD0a21?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1"
        loading="lazy"
        width="100%"
        height="784"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="まずは無料でお問い合わせ"
        className="fx-tally-embed"
      />
    </div>
  );
}

export function CalConsultEmbed() {
  return (
    <div className="fx-embed-shell">
      <iframe
        src="https://cal.com/yoshihiko-sato/30min?layout=month_view"
        loading="lazy"
        width="100%"
        height="760"
        frameBorder="0"
        title="30分無料相談予約"
        className="fx-cal-embed"
      />
    </div>
  );
}
