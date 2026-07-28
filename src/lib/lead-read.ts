import type { LeadCreateInput, LeadRecord, LeadStatus } from "@/types/lead";

const LEADS_TABLE = "leads";
const DEFAULT_LIST_LIMIT = 20;
const DEFAULT_SUMMARY_LIMIT = 20;
const DEFAULT_DAILY_LIMIT = 90;

type SupabaseLeadRow = {
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
  status: LeadStatus;
  notes: string | null;
};

type SupabaseLeadDailySummaryRow = {
  day: string;
  lead_count: number;
  qualified_count: number;
};

type SupabaseLeadPageSummaryRow = {
  page_path: string;
  inquiry_type: LeadCreateInput["inquiryType"];
  lead_count: number;
  first_lead_at: string;
  last_lead_at: string;
};

type SupabaseLeadCampaignSummaryRow = {
  utm_campaign: string | null;
  lead_count: number;
  qualified_count: number;
};

export type LeadListFilters = {
  status?: LeadStatus;
  inquiryType?: LeadCreateInput["inquiryType"];
  utmCampaign?: string;
  pagePath?: string;
  limit?: number;
};

export type LeadDailySummaryFilters = {
  from?: string;
  to?: string;
  limit?: number;
};

export type LeadDailySummaryRecord = {
  day: string;
  leadCount: number;
  qualifiedCount: number;
};

export type LeadPageSummaryRecord = {
  pagePath: string;
  inquiryType: LeadCreateInput["inquiryType"];
  leadCount: number;
  firstLeadAt: string;
  lastLeadAt: string;
};

export type LeadCampaignSummaryRecord = {
  utmCampaign: string | null;
  leadCount: number;
  qualifiedCount: number;
};

function getSupabaseConfig() {
  const url = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

async function supabaseGet<T>(table: string, params: Record<string, string | number | undefined>) {
  const config = getSupabaseConfig();

  if (!config) {
    throw new Error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing");
  }

  const url = new URL(`/rest/v1/${table}`, config.url);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: {
      apikey: config.serviceRoleKey,
      Authorization: `Bearer ${config.serviceRoleKey}`,
      Accept: "application/json"
    },
    cache: "no-store"
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status} ${await response.text()}`);
  }

  return (await response.json()) as T;
}

function mapLeadRow(row: SupabaseLeadRow): LeadRecord {
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

export async function getLeadById(id: string): Promise<LeadRecord | null> {
  const rows = await supabaseGet<SupabaseLeadRow[]>(LEADS_TABLE, {
    select:
      "id,created_at,company,name,email,phone,inquiry_type,message,page_path,page_title,referrer,utm_source,utm_medium,utm_campaign,utm_content,utm_term,ga_client_id,status,notes",
    id: `eq.${id}`,
    limit: 1
  });

  return rows[0] ? mapLeadRow(rows[0]) : null;
}

export async function getLeads(filters: LeadListFilters = {}): Promise<LeadRecord[]> {
  const params: Record<string, string | number | undefined> = {
    select:
      "id,created_at,company,name,email,phone,inquiry_type,message,page_path,page_title,referrer,utm_source,utm_medium,utm_campaign,utm_content,utm_term,ga_client_id,status,notes",
    order: "created_at.desc",
    limit: filters.limit ?? DEFAULT_LIST_LIMIT
  };

  if (filters.status) {
    params.status = `eq.${filters.status}`;
  }

  if (filters.inquiryType) {
    params.inquiry_type = `eq.${filters.inquiryType}`;
  }

  if (filters.utmCampaign) {
    params.utm_campaign = `eq.${filters.utmCampaign}`;
  }

  if (filters.pagePath) {
    params.page_path = `eq.${filters.pagePath}`;
  }

  const rows = await supabaseGet<SupabaseLeadRow[]>(LEADS_TABLE, params);
  return rows.map(mapLeadRow);
}

export async function getLeadDailySummary(
  filters: LeadDailySummaryFilters = {}
): Promise<LeadDailySummaryRecord[]> {
  const params: Record<string, string | number | undefined> = {
    select: "*",
    order: "day.desc",
    limit: filters.limit ?? DEFAULT_DAILY_LIMIT
  };

  if (filters.from && filters.to) {
    params.and = `(day.gte.${filters.from},day.lte.${filters.to})`;
  } else if (filters.from) {
    params.day = `gte.${filters.from}`;
  } else if (filters.to) {
    params.day = `lte.${filters.to}`;
  }

  const rows = await supabaseGet<SupabaseLeadDailySummaryRow[]>("lead_daily_summary", params);
  return rows.map((row) => ({
    day: row.day,
    leadCount: row.lead_count,
    qualifiedCount: row.qualified_count
  }));
}

export async function getLeadPageSummary(
  limit = DEFAULT_SUMMARY_LIMIT
): Promise<LeadPageSummaryRecord[]> {
  const rows = await supabaseGet<SupabaseLeadPageSummaryRow[]>("lead_page_summary", {
    select: "*",
    order: "lead_count.desc",
    limit
  });

  return rows.map((row) => ({
    pagePath: row.page_path,
    inquiryType: row.inquiry_type,
    leadCount: row.lead_count,
    firstLeadAt: row.first_lead_at,
    lastLeadAt: row.last_lead_at
  }));
}

export async function getLeadCampaignSummary(
  limit = DEFAULT_SUMMARY_LIMIT
): Promise<LeadCampaignSummaryRecord[]> {
  const rows = await supabaseGet<SupabaseLeadCampaignSummaryRow[]>("lead_campaign_summary", {
    select: "*",
    order: "lead_count.desc",
    limit
  });

  return rows.map((row) => ({
    utmCampaign: row.utm_campaign,
    leadCount: row.lead_count,
    qualifiedCount: row.qualified_count
  }));
}
