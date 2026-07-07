import { TavilySearch } from "@langchain/tavily";

import { env } from "@/lib/env";
import { buildSearchQuery } from "@/prompts/research-prompt";
import { Errors, AppError, logError } from "@/utils/errors";

/**
 * Web search service using the Tavily Search API via LangChain.
 *
 * Gathers real-time company information from the web before passing
 * context to the LLM for analysis. Server-only — never import from client components.
 */

/** Shape of a single result returned by Tavily. */
interface TavilyResult {
  title?: string;
  url?: string;
  content?: string;
  score?: number;
}

/** Maximum number of search results to fetch per research request. */
const MAX_RESULTS = 8;

/**
 * Creates a configured Tavily search tool instance.
 * Instantiated per call to avoid stale API key issues in serverless.
 */
function createSearchTool(): TavilySearch {
  return new TavilySearch({
    maxResults: MAX_RESULTS,
    tavilyApiKey: env.TAVILY_API_KEY,
  });
}

/**
 * Formats raw Tavily results into a plain-text block for the LLM user prompt.
 */
function formatSearchResults(results: TavilyResult[]): string {
  if (results.length === 0) {
    return "No search results found for this company.";
  }

  return results
    .map((result, index) => {
      const parts = [
        `[${index + 1}] ${result.title ?? "Untitled"}`,
        result.url ? `URL: ${result.url}` : null,
        result.content ? `Content: ${result.content}` : null,
      ].filter(Boolean);

      return parts.join("\n");
    })
    .join("\n\n");
}

/**
 * Parses Tavily response into structured results.
 * Handles object, array, JSON string, and wrapped { results } shapes.
 */
function parseTavilyResponse(raw: unknown): TavilyResult[] {
  if (Array.isArray(raw)) {
    return raw as TavilyResult[];
  }

  if (typeof raw === "object" && raw !== null) {
    if (
      "results" in raw &&
      Array.isArray((raw as { results: unknown }).results)
    ) {
      return (raw as { results: TavilyResult[] }).results;
    }
  }

  if (typeof raw === "string") {
    try {
      return parseTavilyResponse(JSON.parse(raw));
    } catch {
      return [{ content: raw }];
    }
  }

  return [];
}

/**
 * Searches the web for information about a company.
 *
 * @param companyName - Company to research (e.g. "Tesla", "Apple")
 * @returns Formatted plain-text search context for the LLM prompt
 * @throws AppError with code SEARCH_ERROR if Tavily fails
 */
export async function searchCompany(companyName: string): Promise<string> {
  const query = buildSearchQuery(companyName);
  const tool = createSearchTool();

  try {
    const raw = await tool.invoke({ query });
    const results = parseTavilyResponse(raw);

    if (results.length === 0) {
      throw Errors.search(
        `No web results found for "${companyName}". Try a different company name.`
      );
    }

    return formatSearchResults(results);
  } catch (error) {
    if (error instanceof AppError) {
      throw error;
    }

    logError("searchCompany", error);
    throw Errors.search();
  }
}
