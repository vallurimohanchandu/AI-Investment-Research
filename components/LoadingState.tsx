/**
 * Loading state displayed while investment research is in progress.
 *
 * Shown between form submission and API response. Research can take
 * 15–45 seconds (Tavily search + Gemini analysis), so clear feedback matters.
 */

interface LoadingStateProps {
  /** Company currently being researched — personalizes the loading message. */
  companyName?: string;
}

/** Steps shown during the research pipeline for user feedback. */
const RESEARCH_STEPS = [
  "Searching the web for company data",
  "Gathering recent news and financial context",
  "Analyzing with AI and generating report",
] as const;

export function LoadingState({ companyName }: LoadingStateProps) {
  const displayName = companyName?.trim() || "the company";

  return (
    <div
      className="card animate-fade-in text-center"
      role="status"
      aria-live="polite"
      aria-label={`Researching ${displayName}`}
    >
      {/* Animated spinner */}
      <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
        <div
          className="h-12 w-12 animate-spin rounded-full border-4 border-brand-200 border-t-brand-600"
          aria-hidden="true"
        />
      </div>

      {/* Primary message */}
      <h2 className="text-lg font-semibold text-gray-900">
        Researching {displayName}…
      </h2>
      <p className="mt-2 text-sm text-gray-500">
        This may take up to a minute. Please don&apos;t close this page.
      </p>

      {/* Pipeline steps */}
      <ul className="mx-auto mt-8 max-w-sm space-y-3 text-left">
        {RESEARCH_STEPS.map((step, index) => (
          <li
            key={step}
            className="flex items-center gap-3 text-sm text-gray-600"
          >
            <span
              className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-brand-100 text-xs font-semibold text-brand-700"
              aria-hidden="true"
            >
              {index + 1}
            </span>
            <span className={index === 2 ? "animate-pulse-slow" : undefined}>
              {step}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
