"use client";

import { useCallback, useState } from "react";

import { ErrorAlert } from "@/components/ErrorAlert";
import { LoadingState } from "@/components/LoadingState";
import { ResearchReport } from "@/components/ResearchReport";
import { SearchForm } from "@/components/SearchForm";
import type {
  InvestmentReport,
  ResearchApiResponse,
} from "@/types/investment-report";

/**
 * Main page — investment research UI.
 *
 * Client component that orchestrates:
 *   1. Company name input (SearchForm)
 *   2. API call to /api/research
 *   3. Loading, error, and report display states
 */

type PageState = "idle" | "loading" | "success" | "error";

export default function HomePage() {
  const [pageState, setPageState] = useState<PageState>("idle");
  const [report, setReport] = useState<InvestmentReport | null>(null);
  const [generatedAt, setGeneratedAt] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [lastCompany, setLastCompany] = useState<string>("");

  const handleResearch = useCallback(async (companyName: string) => {
    setPageState("loading");
    setErrorMessage(null);
    setReport(null);
    setGeneratedAt(null);
    setLastCompany(companyName);

    try {
      const response = await fetch("/api/research", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ companyName }),
      });

      const data: ResearchApiResponse = await response.json();

      if (!data.success) {
        setErrorMessage(data.error);
        setPageState("error");
        return;
      }

      setReport(data.data);
      setGeneratedAt(data.generatedAt);
      setPageState("success");
    } catch {
      setErrorMessage(
        "Unable to connect to the server. Please check your connection and try again."
      );
      setPageState("error");
    }
  }, []);

  const handleRetry = useCallback(() => {
    if (lastCompany) {
      handleResearch(lastCompany);
    }
  }, [lastCompany, handleResearch]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero header */}
      <header className="bg-hero-gradient px-4 py-12 text-white sm:py-16">
        <div className="container-app">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            AI Investment Research Agent
          </h1>
          <p className="mt-3 max-w-2xl text-base text-brand-100 sm:text-lg">
            Enter a company name to generate an AI-powered investment research
            report with web search, SWOT analysis, competitor insights, and a
            scored recommendation.
          </p>
        </div>
      </header>

      {/* Main content */}
      <main className="container-app py-8 sm:py-12">
        {/* Search form */}
        <section className="mb-8">
          <SearchForm
            onSubmit={handleResearch}
            isLoading={pageState === "loading"}
            defaultValue={lastCompany}
          />
        </section>

        {/* Loading state */}
        {pageState === "loading" && (
          <LoadingState companyName={lastCompany} />
        )}

        {/* Error state */}
        {pageState === "error" && errorMessage && (
          <ErrorAlert
            message={errorMessage}
            onRetry={lastCompany ? handleRetry : undefined}
          />
        )}

        {/* Success — research report */}
        {pageState === "success" && report && (
          <ResearchReport report={report} generatedAt={generatedAt} />
        )}

        {/* Idle helper text */}
        {pageState === "idle" && (
          <div className="card text-center text-gray-500">
            <p className="text-sm">
              Try researching companies like{" "}
              <span className="font-medium text-gray-700">Tesla</span>,{" "}
              <span className="font-medium text-gray-700">Apple</span>, or{" "}
              <span className="font-medium text-gray-700">Microsoft</span>.
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-6">
        <div className="container-app text-center text-xs text-gray-400">
          <p>
            For informational purposes only. Not financial advice. Powered by
            Gemini &amp; Tavily Search.
          </p>
        </div>
      </footer>
    </div>
  );
}
