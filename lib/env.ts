import { z } from "zod";

import { AppError } from "@/utils/errors";

/**
 * Environment variable validation.
 *
 * Validates required API keys at runtime on the server. Fails fast with a
 * clear error if keys are missing or malformed — instead of cryptic errors
 * deep inside LangChain or Tavily calls.
 *
 * Usage (server-only):
 *   import { env } from "@/lib/env";
 *   const model = new ChatGoogleGenerativeAI({ apiKey: env.GOOGLE_API_KEY });
 */

const envSchema = z.object({
  /** Google AI API key for Gemini 2.5 Flash. */
  GOOGLE_API_KEY: z
    .string()
    .min(1, "GOOGLE_API_KEY is required")
    .describe("Google Generative AI API key"),

  /** Tavily Search API key for web research. */
  TAVILY_API_KEY: z
    .string()
    .min(1, "TAVILY_API_KEY is required")
    .describe("Tavily Search API key"),
});

export type Env = z.infer<typeof envSchema>;

/**
 * Parse and validate environment variables.
 * Throws a descriptive ZodError if validation fails.
 */
function parseEnv(): Env {
  const result = envSchema.safeParse({
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    TAVILY_API_KEY: process.env.TAVILY_API_KEY,
  });

  if (!result.success) {
    throw new AppError(
      "API keys are missing. Add GOOGLE_API_KEY and TAVILY_API_KEY to your .env.local file, then restart the server.",
      "UNKNOWN",
      500
    );
  }

  return result.data;
}

/**
 * Validated environment variables — lazy singleton.
 * Only parsed when first accessed, and only on the server.
 */
let cachedEnv: Env | undefined;

export function getEnv(): Env {
  if (!cachedEnv) {
    cachedEnv = parseEnv();
  }
  return cachedEnv;
}

/** Convenience accessor for validated env vars. Prefer getEnv() in services. */
export const env = new Proxy({} as Env, {
  get(_target, prop: keyof Env) {
    return getEnv()[prop];
  },
});
