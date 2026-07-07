import type { NextConfig } from "next";

/**
 * Next.js configuration for the AI Investment Research Agent.
 *
 * Kept intentionally minimal — most behavior is handled by the App Router,
 * API routes, and Vercel's default deployment settings.
 */
const nextConfig: NextConfig = {
  // Enable React Strict Mode to surface side-effect bugs during development.
  reactStrictMode: true,

  // TypeScript errors fail the production build (default, stated explicitly).
  typescript: {
    ignoreBuildErrors: false,
  },

  // ESLint errors fail the production build (default, stated explicitly).
  eslint: {
    ignoreDuringBuilds: false,
  },

  /**
   * Server-only packages used by API routes and LangChain services.
   * Prevents Next.js from bundling them into the client JS bundle,
   * which would cause build errors or expose server credentials.
   */
  serverExternalPackages: [
    "@langchain/tavily",
    "@langchain/core",
    "@langchain/google-genai",
    "langchain",
  ],
};

export default nextConfig;
