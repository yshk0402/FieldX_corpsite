import { z } from "zod";

export const leadStatusSchema = z.enum(["new", "contacted", "qualified", "lost"]);

export const leadCreateInputSchema = z.object({
  company: z.string().trim().max(120).optional().default(""),
  name: z.string().trim().min(1).max(80),
  email: z.string().trim().email(),
  phone: z.string().trim().max(30).optional().default(""),
  inquiryType: z.enum(["project", "partnership", "media", "other"]),
  awarenessSources: z.array(z.enum(["x", "google", "event", "ai"])).optional(),
  message: z.string().trim().min(10).max(2000),
  pagePath: z.string().trim().max(300).optional().default(""),
  pageTitle: z.string().trim().max(200).optional().default(""),
  referrer: z.string().trim().max(500).optional().default(""),
  utmSource: z.string().trim().max(120).optional().default(""),
  utmMedium: z.string().trim().max(120).optional().default(""),
  utmCampaign: z.string().trim().max(120).optional().default(""),
  utmContent: z.string().trim().max(120).optional().default(""),
  utmTerm: z.string().trim().max(120).optional().default(""),
  gaClientId: z.string().trim().max(80).optional().default("")
});

export type LeadStatus = z.infer<typeof leadStatusSchema>;
export type LeadCreateInput = z.infer<typeof leadCreateInputSchema>;

export type LeadRecord = LeadCreateInput & {
  id: string;
  createdAt: string;
  status: LeadStatus;
  notes: string | null;
};
