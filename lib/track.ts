"use client";

const SESSION_KEY = "az_sid";
const UTM_KEY = "az_utm";

function getSessionId(): string {
  let id = localStorage.getItem(SESSION_KEY);
  if (!id) {
    id = crypto.randomUUID();
    localStorage.setItem(SESSION_KEY, id);
  }
  return id;
}

function getUtm(): { utmSource?: string; utmMedium?: string; utmCampaign?: string } {
  const params = new URLSearchParams(window.location.search);
  const fromUrl = {
    utmSource: params.get("utm_source") ?? undefined,
    utmMedium: params.get("utm_medium") ?? undefined,
    utmCampaign: params.get("utm_campaign") ?? undefined,
  };

  if (fromUrl.utmSource || fromUrl.utmMedium || fromUrl.utmCampaign) {
    sessionStorage.setItem(UTM_KEY, JSON.stringify(fromUrl));
    return fromUrl;
  }

  const stored = sessionStorage.getItem(UTM_KEY);
  return stored ? JSON.parse(stored) : {};
}

export type EventName =
  | "page_view"
  | "whatsapp_click"
  | "mailto_click"
  | "newsletter_signup";

export function track(name: EventName, meta?: Record<string, unknown>): void {
  if (typeof window === "undefined") return;

  const payload = {
    name,
    path: window.location.pathname,
    referrer: document.referrer || null,
    sessionId: getSessionId(),
    ...getUtm(),
    meta,
  };

  try {
    fetch("/api/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // Le tracking ne doit jamais casser l'expérience visiteur.
  }
}
