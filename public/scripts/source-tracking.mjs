import { generateId, readStorageJSON, writeStorageJSON } from "./utils.mjs";

const SESSION_KEY = "portfolio.analyticsSession";

export const SOURCE_CATALOG = {
  linkedin: { label: "LinkedIn", hosts: ["linkedin.com"] },
  github: { label: "GitHub", hosts: ["github.com"] },
  instagram: { label: "Instagram", hosts: ["instagram.com"] },
  x: { label: "X", hosts: ["x.com", "twitter.com", "t.co"] },
  telegram: { label: "Telegram", hosts: ["t.me", "telegram.me"] },
  direct: { label: "Direct", hosts: [] },
  other: { label: "Other", hosts: [] }
};

export function detectTrafficSource() {
  const params = new URLSearchParams(window.location.search);
  const explicitSource = normalizeSource(params.get("src"));
  const utmSource = normalizeSource(params.get("utm_source"));
  const utmMedium = params.get("utm_medium")?.trim() || "";
  const utmCampaign = params.get("utm_campaign")?.trim() || "";
  const referrer = document.referrer || "";

  const source = explicitSource || utmSource || detectSourceFromReferrer(referrer) || "direct";

  return {
    source,
    medium: utmMedium,
    campaign: utmCampaign,
    referrer
  };
}

export function getOrCreateAnalyticsSession(ttlMinutes = 30) {
  const now = Date.now();
  const existingSession = readStorageJSON(SESSION_KEY, null);
  const ttlMs = ttlMinutes * 60 * 1000;

  if (existingSession && existingSession.expiresAt > now) {
    const nextSession = {
      ...existingSession,
      expiresAt: now + ttlMs,
      lastSeenAt: now
    };

    writeStorageJSON(SESSION_KEY, nextSession);
    return { session: nextSession, isNew: false };
  }

  const attribution = detectTrafficSource();
  const nextSession = {
    id: generateId("visit"),
    startedAt: now,
    lastSeenAt: now,
    expiresAt: now + ttlMs,
    landingPath: `${window.location.pathname}${window.location.search}`,
    ...attribution
  };

  writeStorageJSON(SESSION_KEY, nextSession);
  return { session: nextSession, isNew: true };
}

export function touchAnalyticsSession(ttlMinutes = 30) {
  const existingSession = readStorageJSON(SESSION_KEY, null);
  if (!existingSession) {
    return null;
  }

  const now = Date.now();
  const nextSession = {
    ...existingSession,
    lastSeenAt: now,
    expiresAt: now + ttlMinutes * 60 * 1000
  };

  writeStorageJSON(SESSION_KEY, nextSession);
  return nextSession;
}

export function sourceLabelFor(source) {
  return SOURCE_CATALOG[source]?.label ?? SOURCE_CATALOG.other.label;
}

function normalizeSource(value) {
  if (!value) {
    return "";
  }

  const normalized = value.trim().toLowerCase();
  return SOURCE_CATALOG[normalized] ? normalized : "other";
}

function detectSourceFromReferrer(referrer) {
  if (!referrer) {
    return "";
  }

  try {
    const host = new URL(referrer).hostname.toLowerCase();
    const matchedSource = Object.entries(SOURCE_CATALOG).find(([, metadata]) =>
      metadata.hosts.some((knownHost) => host.includes(knownHost))
    );

    return matchedSource?.[0] ?? "other";
  } catch (error) {
    console.warn("Could not parse referrer for source detection.", error);
    return "other";
  }
}
