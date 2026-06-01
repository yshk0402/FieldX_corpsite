const DEFAULT_COLUMN_ENDPOINT = "column";
const MICROCMS_API_VERSION = "v1";

function getRequiredEnv(name: "MICROCMS_SERVICE_DOMAIN" | "MICROCMS_API_KEY"): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`[microCMS] Missing required environment variable: ${name}`);
  }

  return value;
}

function normalizeServiceDomain(rawValue: string): string {
  const normalized = rawValue
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/+$/, "")
    .replace(/\.microcms\.io$/i, "");

  if (!normalized) {
    throw new Error("[microCMS] MICROCMS_SERVICE_DOMAIN is empty after normalization");
  }

  return normalized;
}

export function getMicrocmsColumnEndpoint(): string {
  return (process.env.MICROCMS_COLUMN_ENDPOINT ?? DEFAULT_COLUMN_ENDPOINT).trim().replace(/^\/+|\/+$/g, "");
}

function buildMicrocmsApiBaseUrl(kind: "content" | "management"): string {
  const serviceDomain = normalizeServiceDomain(getRequiredEnv("MICROCMS_SERVICE_DOMAIN"));
  const configuredBaseUrl =
    kind === "content"
      ? process.env.MICROCMS_CONTENT_API_BASE_URL
      : process.env.MICROCMS_MANAGEMENT_API_BASE_URL;

  if (configuredBaseUrl) {
    return configuredBaseUrl.trim().replace(/\/+$/, "");
  }

  const host =
    kind === "content"
      ? `${serviceDomain}.microcms.io`
      : `${serviceDomain}.microcms-management.io`;
  return `https://${host}/api/${MICROCMS_API_VERSION}`;
}

export async function getMicrocmsListContents<T>({
  endpoint,
  queries
}: {
  endpoint: string;
  queries: Record<string, string | number | undefined>;
}): Promise<{ contents: T[]; totalCount: number }> {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(queries)) {
    if (value !== undefined) {
      params.set(key, String(value));
    }
  }

  const response = await fetch(
    `${buildMicrocmsApiBaseUrl("content")}/${endpoint}?${params.toString()}`,
    {
      cache: "no-store",
      headers: {
        "X-MICROCMS-API-KEY": getRequiredEnv("MICROCMS_API_KEY")
      }
    }
  );

  if (!response.ok) {
    throw new Error(`fetch API response status: ${response.status}`);
  }

  return response.json() as Promise<{ contents: T[]; totalCount: number }>;
}

export async function getMicrocmsManagementContents<T>({
  endpoint,
  limit,
  offset
}: {
  endpoint: string;
  limit: number;
  offset: number;
}): Promise<{ contents: T[]; totalCount: number }> {
  const apiKey = process.env.MICROCMS_MANAGEMENT_API_KEY ?? getRequiredEnv("MICROCMS_API_KEY");
  const params = new URLSearchParams({
    limit: String(limit),
    offset: String(offset)
  });
  const response = await fetch(
    `${buildMicrocmsApiBaseUrl("management")}/contents/${endpoint}?${params.toString()}`,
    {
      cache: "no-store",
      headers: {
        "X-MICROCMS-API-KEY": apiKey
      }
    }
  );

  if (!response.ok) {
    throw new Error(`fetch API response status: ${response.status}`);
  }

  return response.json() as Promise<{ contents: T[]; totalCount: number }>;
}
