import { z } from "zod";

/**
 * Domain types and Zod schemas for the investment research report.
 *
 * This file is the single source of truth for the shape of data flowing
 * through the entire application:
 *   LLM output → API response → React UI
 *
 * Zod schemas validate LLM-generated JSON before it reaches the client.
 */

// ---------------------------------------------------------------------------
// Recommendation enum
// ---------------------------------------------------------------------------

/** Valid investment recommendation values returned by the LLM. */
export const recommendationSchema = z.enum(["Invest", "Hold", "Pass"]);

export type Recommendation = z.infer<typeof recommendationSchema>;

// ---------------------------------------------------------------------------
// Sub-schemas for nested report sections
// ---------------------------------------------------------------------------

/** A single recent news item about the company. */
export const newsItemSchema = z.object({
  title: z.string().min(1).describe("Headline of the news article"),
  summary: z.string().min(1).describe("Brief summary of the news item"),
  date: z.string().optional().describe("Publication date if known (e.g. 2025-06-15)"),
  source: z.string().optional().describe("News source name (e.g. Reuters, Bloomberg)"),
});

export type NewsItem = z.infer<typeof newsItemSchema>;

/** A competitor with a brief competitive comparison. */
export const competitorSchema = z.object({
  name: z.string().min(1).describe("Competitor company name"),
  comparison: z
    .string()
    .min(1)
    .describe("How this competitor compares to the target company"),
});

export type Competitor = z.infer<typeof competitorSchema>;

// ---------------------------------------------------------------------------
// Main investment report schema
// ---------------------------------------------------------------------------

/**
 * Full structured investment research report.
 * Every field maps to a section in the final UI report.
 */
export const investmentReportSchema = z.object({
  companyName: z.string().min(1).describe("Official company name"),

  companyOverview: z
    .string()
    .min(1)
    .describe("High-level overview of the company, its history, and market position"),

  industry: z
    .string()
    .min(1)
    .describe("Industry sector and relevant market dynamics"),

  businessModel: z
    .string()
    .min(1)
    .describe("How the company generates revenue and creates value"),

  recentNews: z
    .array(newsItemSchema)
    .min(1)
    .max(5)
    .describe("Up to 5 recent and relevant news items"),

  strengths: z
    .array(z.string().min(1))
    .min(1)
    .max(7)
    .describe("Key competitive strengths"),

  weaknesses: z
    .array(z.string().min(1))
    .min(1)
    .max(7)
    .describe("Notable weaknesses or vulnerabilities"),

  opportunities: z
    .array(z.string().min(1))
    .min(1)
    .max(7)
    .describe("Growth opportunities and positive catalysts"),

  risks: z
    .array(z.string().min(1))
    .min(1)
    .max(7)
    .describe("Material risks and threats to the investment thesis"),

  competitorAnalysis: z
    .array(competitorSchema)
    .min(1)
    .max(5)
    .describe("Analysis of key competitors"),

  investmentScore: z
    .number()
    .int()
    .min(0)
    .max(100)
    .describe("Overall investment score from 0 (avoid) to 100 (strong buy)"),

  recommendation: recommendationSchema.describe(
    "Final recommendation: Invest, Hold, or Pass"
  ),

  reasoning: z
    .string()
    .min(1)
    .describe("Detailed reasoning supporting the recommendation and score"),
});

export type InvestmentReport = z.infer<typeof investmentReportSchema>;

// ---------------------------------------------------------------------------
// API request / response types
// ---------------------------------------------------------------------------

/** Payload sent from the client to POST /api/research. */
export const researchRequestSchema = z.object({
  companyName: z
    .string()
    .min(1, "Company name is required")
    .max(100, "Company name must be 100 characters or fewer")
    .trim(),
});

export type ResearchRequest = z.infer<typeof researchRequestSchema>;

/** Successful API response wrapping the validated report. */
export interface ResearchResponse {
  success: true;
  data: InvestmentReport;
  /** ISO timestamp of when the research was completed. */
  generatedAt: string;
}

/** Error API response with a user-friendly message. */
export interface ResearchErrorResponse {
  success: false;
  error: string;
  /** Optional machine-readable error code for client-side handling. */
  code?: "VALIDATION_ERROR" | "SEARCH_ERROR" | "LLM_ERROR" | "RATE_LIMIT" | "UNKNOWN";
}

/** Discriminated union for all API response shapes. */
export type ResearchApiResponse = ResearchResponse | ResearchErrorResponse;
