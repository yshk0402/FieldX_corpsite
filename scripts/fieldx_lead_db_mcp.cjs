#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const { McpServer } = require("@modelcontextprotocol/sdk/server/mcp.js");
const { StdioServerTransport } = require("@modelcontextprotocol/sdk/server/stdio.js");
const z = require("zod");

const ROOT = path.resolve(__dirname, "..");

function parseEnv(filePath) {
  if (!fs.existsSync(filePath)) {
    return {};
  }

  const raw = fs.readFileSync(filePath, "utf8");
  const env = {};

  for (const line of raw.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const idx = trimmed.indexOf("=");
    if (idx === -1) continue;

    const key = trimmed.slice(0, idx).trim();
    let value = trimmed.slice(idx + 1).trim();

    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    env[key] = value;
  }

  return env;
}

const localEnv = parseEnv(path.join(ROOT, ".env.local"));
const supabaseUrl = process.env.SUPABASE_URL ?? localEnv.SUPABASE_URL;
const supabaseServiceRoleKey =
  process.env.SUPABASE_SERVICE_ROLE_KEY ?? localEnv.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
  console.error("SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY is missing.");
  process.exit(1);
}

async function supabaseGet(table, params = {}) {
  const url = new URL(`/rest/v1/${table}`, supabaseUrl);

  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      url.searchParams.set(key, String(value));
    }
  });

  const response = await fetch(url, {
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      Accept: "application/json"
    }
  });

  if (!response.ok) {
    throw new Error(`Supabase request failed: ${response.status} ${await response.text()}`);
  }

  return response.json();
}

function textResult(label, payload) {
  return {
    content: [
      {
        type: "text",
        text: `${label}\n\n${JSON.stringify(payload, null, 2)}`
      }
    ],
    structuredContent: { rows: payload }
  };
}

const server = new McpServer({
  name: "fieldx-lead-db",
  version: "1.0.0"
});

server.registerTool(
  "recent_leads",
  {
    description: "Read recent leads from public.leads with optional filters.",
    inputSchema: {
      limit: z.number().int().min(1).max(100).default(20),
      status: z.string().optional(),
      inquiry_type: z.string().optional(),
      utm_campaign: z.string().optional(),
      page_path: z.string().optional()
    }
  },
  async ({ limit = 20, status, inquiry_type, utm_campaign, page_path }) => {
    const params = {
      select:
        "id,created_at,company,name,email,phone,inquiry_type,page_path,referrer,utm_source,utm_medium,utm_campaign,ga_client_id,status",
      order: "created_at.desc",
      limit
    };

    if (status) params.status = `eq.${status}`;
    if (inquiry_type) params.inquiry_type = `eq.${inquiry_type}`;
    if (utm_campaign) params.utm_campaign = `eq.${utm_campaign}`;
    if (page_path) params.page_path = `eq.${page_path}`;

    const rows = await supabaseGet("leads", params);
    return textResult("Recent leads", rows);
  }
);

server.registerTool(
  "lead_page_summary",
  {
    description: "Read page-level lead summary from public.lead_page_summary.",
    inputSchema: {
      limit: z.number().int().min(1).max(100).default(20)
    }
  },
  async ({ limit = 20 }) => {
    const rows = await supabaseGet("lead_page_summary", {
      select: "*",
      order: "lead_count.desc",
      limit
    });

    return textResult("Lead page summary", rows);
  }
);

server.registerTool(
  "lead_campaign_summary",
  {
    description: "Read campaign-level lead summary from public.lead_campaign_summary.",
    inputSchema: {
      limit: z.number().int().min(1).max(100).default(20)
    }
  },
  async ({ limit = 20 }) => {
    const rows = await supabaseGet("lead_campaign_summary", {
      select: "*",
      order: "lead_count.desc",
      limit
    });

    return textResult("Lead campaign summary", rows);
  }
);

server.registerTool(
  "lead_daily_summary",
  {
    description: "Read daily lead summary from public.lead_daily_summary.",
    inputSchema: {
      from_date: z.string().optional(),
      to_date: z.string().optional(),
      limit: z.number().int().min(1).max(365).default(90)
    }
  },
  async ({ from_date, to_date, limit = 90 }) => {
    const params = {
      select: "*",
      order: "lead_date.desc",
      limit
    };

    if (from_date && to_date) {
      params.and = `(lead_date.gte.${from_date},lead_date.lte.${to_date})`;
    } else if (from_date) {
      params.lead_date = `gte.${from_date}`;
    } else if (to_date) {
      params.lead_date = `lte.${to_date}`;
    }

    const rows = await supabaseGet("lead_daily_summary", params);
    return textResult("Lead daily summary", rows);
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("fieldx-lead-db mcp failed", error);
  process.exit(1);
});
