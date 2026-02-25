const DEFAULT_DEV_SITE_URL = "http://localhost:3000";

function normalizeSiteUrl(value: string): string {
  return value.replace(/\/+$/, "");
}

export function getSiteUrl(): string {
  const raw = process.env.NEXT_PUBLIC_SITE_URL;

  if (raw && raw.trim()) {
    return normalizeSiteUrl(raw.trim());
  }

  const shouldRequireEnv = process.env.VERCEL === "1" || process.env.CI === "true";
  if (!shouldRequireEnv) {
    return DEFAULT_DEV_SITE_URL;
  }

  throw new Error("NEXT_PUBLIC_SITE_URL is required for CI/production deployment.");
}
