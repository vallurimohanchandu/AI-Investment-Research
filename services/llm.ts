import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { HumanMessage, SystemMessage } from "@langchain/core/messages";

import { env } from "@/lib/env";
import {
  RESEARCH_SYSTEM_PROMPT,
  buildResearchUserPrompt,
} from "@/prompts/research-prompt";
import {
  investmentReportSchema,
  type InvestmentReport,
} from "@/types/investment-report";
import { AppError, Errors, logError } from "@/utils/errors";

/**
 * LLM service for investment analysis using Google Gemini 2.5 Flash.
 *
 * Invokes Gemini through LangChain with structured JSON output validated
 * against the investmentReportSchema (Zod). Server-only.
 */

/** Gemini model identifier — fast and cost-effective for structured analysis. */
const MODEL_NAME = "gemini-2.5-flash";

/** Lower temperature for more consistent, factual financial analysis. */
const TEMPERATURE = 0.3;

/**
 * Creates a base Gemini chat model instance.
 */
function createChatModel(): ChatGoogleGenerativeAI {
  return new ChatGoogleGenerativeAI({
    model: MODEL_NAME,
    apiKey: env.GOOGLE_API_KEY,
    temperature: TEMPERATURE,
  });
}

/**
 * Creates a Gemini model bound to structured output via the Zod schema.
 * LangChain instructs the model to return JSON matching investmentReportSchema.
 */
function createStructuredModel() {
  const model = createChatModel();
  return model.withStructuredOutput(investmentReportSchema, {
    name: "investment_report",
  });
}

/**
 * Detects rate-limit / quota errors from Gemini API responses.
 */
function isRateLimitError(error: unknown): boolean {
  if (!(error instanceof Error)) return false;
  const msg = error.message.toLowerCase();
  return (
    msg.includes("429") ||
    msg.includes("rate limit") ||
    msg.includes("quota") ||
    msg.includes("resource exhausted")
  );
}

/**
 * Analyzes a company using Gemini and returns a validated investment report.
 *
 * @param companyName - Company to analyze
 * @param searchContext - Formatted Tavily search results
 * @returns Validated InvestmentReport
 * @throws AppError with code LLM_ERROR or RATE_LIMIT
 */
export async function analyzeCompany(
  companyName: string,
  searchContext: string
): Promise<InvestmentReport> {
  const structuredModel = createStructuredModel();

  const messages = [
    new SystemMessage(RESEARCH_SYSTEM_PROMPT),
    new HumanMessage(buildResearchUserPrompt(companyName, searchContext)),
  ];

  try {
    const raw = await structuredModel.invoke(messages);

    // Second validation pass — belt-and-suspenders against schema drift.
    const report = investmentReportSchema.parse(raw);

    return report;
  } catch (error) {
    logError("analyzeCompany", error);

    if (error instanceof AppError) {
      throw error;
    }

    if (isRateLimitError(error)) {
      throw Errors.rateLimit();
    }

    throw Errors.llm();
  }
}
