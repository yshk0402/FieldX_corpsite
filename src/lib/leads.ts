import type { LeadCreateInput, LeadRecord } from "@/types/lead";

const LEADS_TABLE = "leads";

type SupabaseLeadInsert = {
  company: string;
  name: string;
  email: string;
  phone: string;
  inquiry_type: LeadCreateInput["inquiryType"];
  message: string;
  page_path: string;
  page_title: string;
  referrer: string;
  utm_source: string;
  utm_medium: string;
  utm_campaign: string;
  utm_content: string;
  utm_term: string;
  ga_client_id: string;
  status: "new";
  notes: null;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

function buildLeadInsert(input: LeadCreateInput): SupabaseLeadInsert {
  return {
    company: input.company,
    name: input.name,
    email: input.email,
    phone: input.phone,
    inquiry_type: input.inquiryType,
    message: input.message,
    page_path: input.pagePath,
    page_title: input.pageTitle,
    referrer: input.referrer,
    utm_source: input.utmSource,
    utm_medium: input.utmMedium,
    utm_campaign: input.utmCampaign,
    utm_content: input.utmContent,
    utm_term: input.utmTerm,
    ga_client_id: input.gaClientId,
    status: "new",
    notes: null
  };
}

export async function saveLead(input: LeadCreateInput): Promise<LeadRecord | null> {
  const config = getSupabaseConfig();

  if (!config) {
    console.warn("lead storage skipped: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing");
    return null;
  }

  const response = await fetch(`${config.url}/rest/v1/${LEADS_TABLE}`, {
    method: "POST",
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "return=representation"
    },
    body: JSON.stringify(buildLeadInsert(input)),
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`lead storage failed: ${response.status} ${await response.text()}`);
  }

  const payload = (await response.json()) as Array<{
    id: string;
    created_at: string;
    company: string;
    name: string;
    email: string;
    phone: string;
    inquiry_type: LeadCreateInput["inquiryType"];
    message: string;
    page_path: string;
    page_title: string;
    referrer: string;
    utm_source: string;
    utm_medium: string;
    utm_campaign: string;
    utm_content: string;
    utm_term: string;
    ga_client_id: string;
    status: LeadRecord["status"];
    notes: string | null;
  }>;

  const row = payload[0];

  if (!row) {
    return null;
  }

  return {
    id: row.id,
    createdAt: row.created_at,
    company: row.company,
    name: row.name,
    email: row.email,
    phone: row.phone,
    inquiryType: row.inquiry_type,
    message: row.message,
    pagePath: row.page_path,
    pageTitle: row.page_title,
    referrer: row.referrer,
    utmSource: row.utm_source,
    utmMedium: row.utm_medium,
    utmCampaign: row.utm_campaign,
    utmContent: row.utm_content,
    utmTerm: row.utm_term,
    gaClientId: row.ga_client_id,
    status: row.status,
    notes: row.notes
  };
}
