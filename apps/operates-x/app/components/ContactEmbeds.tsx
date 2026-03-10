"use client";

import { useEffect, useRef, useState } from "react";

import { trackEvent } from "../lib/analytics";

const TALLY_REQUEST_EMBED_URL =
  "https://tally.so/embed/gD0a21?alignLeft=1&hideTitle=1&transparentBackground=1&dynamicHeight=1";
const TALLY_REQUEST_FORM_URL = "https://tally.so/r/gD0a21";
const TALLY_FALLBACK_TIMEOUT_MS = 6000;

export function TallyRequestEmbed() {
  const hasTrackedSubmitRef = useRef(false);
  const fallbackTimerRef = useRef<number | null>(null);
  const [showFallback, setShowFallback] = useState(false);

  useEffect(() => {
    trackEvent("contact_page_view", { source: "contact_page" });

    fallbackTimerRef.current = window.setTimeout(() => {
      setShowFallback(true);
    }, TALLY_FALLBACK_TIMEOUT_MS);

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

    return () => {
      if (fallbackTimerRef.current !== null) {
        window.clearTimeout(fallbackTimerRef.current);
        fallbackTimerRef.current = null;
      }
      window.removeEventListener("message", onMessage);
    };
  }, []);

  function handleLoad() {
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    setShowFallback(false);
  }

  function handleError() {
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }

    setShowFallback(true);
  }

  return (
    <div className="fx-embed-shell">
      <iframe
        src={TALLY_REQUEST_EMBED_URL}
        loading="lazy"
        width="100%"
        height="784"
        frameBorder="0"
        marginHeight={0}
        marginWidth={0}
        title="まずは無料でお問い合わせ"
        className="fx-tally-embed"
        onLoad={handleLoad}
        onError={handleError}
      />
      {showFallback ? (
        <p className="fx-embed-fallback" role="status">
          埋め込みフォームの表示が不安定な場合があります。
          {" "}
          <a href={TALLY_REQUEST_FORM_URL} target="_blank" rel="noreferrer">
            フォームを別タブで開く
          </a>
        </p>
      ) : null}
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
