import type { ResearchErrorResponse } from "@/types/investment-report";

/**
 * Error utilities for consistent API error handling.
 *
 * Maps thrown errors (Zod, LangChain, Tavily, network) into user-friendly
 * ResearchErrorResponse objects with machine-readable codes for the client.
 */

/** Machine-readable error codes returned to the client. */
export type ErrorCode = NonNullable<ResearchErrorResponse["code"]>;

/**
 * Custom application error with a typed code and optional HTTP status.
 * Services throw this; API routes catch and format it for the client.
 */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly statusCode: number;

  constructor(
    message: string,
    code: ErrorCode = "UNKNOWN",
    statusCode: number = 500
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.statusCode = statusCode;
  }
}

/** Pre-built error factories for common failure scenarios. */
export const Errors = {
  validation: (message: string) =>
    new AppError(message, "VALIDATION_ERROR", 400),

  search: (message = "Web search failed. Please try again.") =>
    new AppError(message, "SEARCH_ERROR", 502),

  llm: (message = "AI analysis failed. Please try again.") =>
    new AppError(message, "LLM_ERROR", 502),

  rateLimit: (message = "Too many requests. Please wait and try again.") =>
    new AppError(message, "RATE_LIMIT", 429),

  unknown: (message = "An unexpected error occurred. Please try again.") =>
    new AppError(message, "UNKNOWN", 500),
} as const;

/**
 * Converts any thrown value into a ResearchErrorResponse for the API client.
 * Inspects error type/name/message to assign the most accurate code.
 */
export function toErrorResponse(error: unknown): ResearchErrorResponse {
  if (error instanceof AppError) {
    return {
      success: false,
      error: error.message,
      code: error.code,
    };
  }

  if (error instanceof Error) {
    const code = inferErrorCode(error);
    return {
      success: false,
      error: toUserMessage(error, code),
      code,
    };
  }

  return {
    success: false,
    error: "An unexpected error occurred. Please try again.",
    code: "UNKNOWN",
  };
}

/**
 * Returns the HTTP status code for an error.
 * AppError carries its own status; unknown errors default to 500.
 */
export function getStatusCode(error: unknown): number {
  if (error instanceof AppError) {
    return error.statusCode;
  }
  return 500;
}

/**
 * Infers an error code from a generic Error by inspecting name and message.
 */
function inferErrorCode(error: Error): ErrorCode {
  const msg = error.message.toLowerCase();
  const name = error.name.toLowerCase();

  if (name.includes("zod") || msg.includes("validation")) {
    return "VALIDATION_ERROR";
  }
  if (msg.includes("rate limit") || msg.includes("429") || msg.includes("quota")) {
    return "RATE_LIMIT";
  }
  if (msg.includes("tavily") || msg.includes("search")) {
    return "SEARCH_ERROR";
  }
  if (
    msg.includes("gemini") ||
    msg.includes("google") ||
    msg.includes("langchain") ||
    msg.includes("model")
  ) {
    return "LLM_ERROR";
  }

  return "UNKNOWN";
}

/**
 * Maps internal error details to a safe, user-facing message.
 * Avoids leaking API keys, stack traces, or internal paths.
 */
function toUserMessage(error: Error, code: ErrorCode): string {
  switch (code) {
    case "VALIDATION_ERROR":
      return error.message || "Invalid request. Please check your input.";
    case "RATE_LIMIT":
      return "Too many requests. Please wait a moment and try again.";
    case "SEARCH_ERROR":
      return "Web search failed. Please try again.";
    case "LLM_ERROR":
      return "AI analysis failed. Please try again.";
    default:
      return "An unexpected error occurred. Please try again.";
  }
}

/**
 * Logs the full error on the server for debugging.
 * Only logs in development or when explicitly needed — never sent to client.
 */
export function logError(context: string, error: unknown): void {
  console.error(`[${context}]`, error);
}
