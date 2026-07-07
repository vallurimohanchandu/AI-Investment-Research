import { analyzeCompany } from "@/services/llm";
import { searchCompany } from "@/services/search";
import {
  researchRequestSchema,
  type InvestmentReport,
} from "@/types/investment-report";
import { AppError, Errors, logError } from "@/utils/errors";

/**
 * Research agent — orchestrates the full investment research pipeline.
 *
 * This is the main business logic entry point called by the API route.
 * It coordinates web search (Tavily) and AI analysis (Gemini) without
 * knowing about HTTP, React, or deployment concerns.
 *
 * Pipeline:
 *   1. Validate company name
 *   2. Search the web via Tavily
 *   3. Analyze results via Gemini
 *   4. Return validated InvestmentReport
 */

/**
 * Runs the complete investment research pipeline for a company.
 *
 * @param companyName - Raw company name from the client (validated and trimmed)
 * @returns Validated investment research report
 * @throws AppError on validation, search, or LLM failures
 */
export async function researchCompany(
  companyName: string
): Promise<InvestmentReport> {
  // Step 1: Validate and normalize input.
  const parsed = researchRequestSchema.safeParse({ companyName });

  if (!parsed.success) {
    const message =
      parsed.error.issues[0]?.message ?? "Invalid company name";
    throw Errors.validation(message);
  }

  const { companyName: normalizedName } = parsed.data;

  try {
    // Step 2: Gather web search context.
    const searchContext = await searchCompany(normalizedName);

    // Step 3: Analyze with Gemini and return structured report.
    const report = await analyzeCompany(normalizedName, searchContext);

    // Ensure companyName in the report matches the normalized input.
    return {
      ...report,
      companyName: report.companyName || normalizedName,
    };
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    logError("researchCompany", error);
    throw Errors.unknown();
  }
}
