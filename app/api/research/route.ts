import { NextResponse } from "next/server";

import { researchCompany } from "@/services/research-agent";
import type { ResearchResponse } from "@/types/investment-report";
import { Errors, getStatusCode, logError, toErrorResponse } from "@/utils/errors";

/**
 * POST /api/research
 *
 * Thin HTTP wrapper around the research agent pipeline.
 * Accepts a company name, returns a structured investment report or error.
 */

/** Node.js runtime required for LangChain, Tavily, and Gemini SDKs. */
export const runtime = "nodejs";

/** Allow up to 60s for search + LLM on Vercel Pro; adjust per plan. */
export const maxDuration = 60;

/** Always run dynamically — never cache research results. */
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    // Parse request body.
    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        toErrorResponse(Errors.validation("Invalid JSON body")),
        { status: 400 }
      );
    }

    // Extract company name from body.
    const companyName =
      typeof body === "object" &&
      body !== null &&
      "companyName" in body &&
      typeof (body as { companyName: unknown }).companyName === "string"
        ? (body as { companyName: string }).companyName
        : undefined;

    if (!companyName) {
      return NextResponse.json(
        toErrorResponse(Errors.validation("Company name is required")),
        { status: 400 }
      );
    }

    // Run the research pipeline.
    const report = await researchCompany(companyName);

    const response: ResearchResponse = {
      success: true,
      data: report,
      generatedAt: new Date().toISOString(),
    };

    return NextResponse.json(response);
  } catch (error) {
    logError("POST /api/research", error);

    return NextResponse.json(toErrorResponse(error), {
      status: getStatusCode(error),
    });
  }
}
