import { RecommendationBadge } from "@/components/RecommendationBadge";
import { ReportSection } from "@/components/ReportSection";
import { ScoreGauge } from "@/components/ScoreGauge";
import type { InvestmentReport } from "@/types/investment-report";

/**
 * Full investment research report display.
 *
 * Composes all report sections from a validated InvestmentReport object.
 * This is the primary output view shown after a successful API response.
 */

interface ResearchReportProps {
  report: InvestmentReport;
  /** ISO timestamp from the API response. */
  generatedAt?: string | null;
}

export function ResearchReport({ report, generatedAt }: ResearchReportProps) {
  const formattedDate = generatedAt
    ? new Date(generatedAt).toLocaleString(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      })
    : null;

  return (
    <article className="space-y-6" aria-label={`Research report for ${report.companyName}`}>
      {/* Summary header — score, recommendation, metadata */}
      <header className="card animate-slide-up">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium text-brand-600">Research Report</p>
            <h1 className="mt-1 truncate text-2xl font-bold text-gray-900 sm:text-3xl">
              {report.companyName}
            </h1>
            <div className="mt-3 flex flex-wrap items-center gap-3">
              <RecommendationBadge
                recommendation={report.recommendation}
                size="lg"
              />
              {formattedDate && (
                <time
                  dateTime={generatedAt ?? undefined}
                  className="text-xs text-gray-400"
                >
                  Generated {formattedDate}
                </time>
              )}
            </div>
          </div>

          <ScoreGauge score={report.investmentScore} size={130} />
        </div>
      </header>

      {/* Core company information */}
      <div className="grid gap-6 lg:grid-cols-2">
        <ReportSection title="Company Overview">
          <p>{report.companyOverview}</p>
        </ReportSection>

        <ReportSection title="Industry">
          <p>{report.industry}</p>
        </ReportSection>
      </div>

      <ReportSection title="Business Model">
        <p>{report.businessModel}</p>
      </ReportSection>

      {/* SWOT analysis — 2×2 grid on medium+ screens */}
      <div className="grid gap-6 md:grid-cols-2">
        <ReportSection title="Strengths">
          <BulletList items={report.strengths} variant="invest" />
        </ReportSection>

        <ReportSection title="Weaknesses">
          <BulletList items={report.weaknesses} variant="pass" />
        </ReportSection>

        <ReportSection title="Opportunities">
          <BulletList items={report.opportunities} variant="brand" />
        </ReportSection>

        <ReportSection title="Risks">
          <BulletList items={report.risks} variant="hold" />
        </ReportSection>
      </div>

      {/* Recent news */}
      <ReportSection title="Recent News">
        <ul className="space-y-4">
          {report.recentNews.map((item, index) => (
            <li
              key={`${item.title}-${index}`}
              className="rounded-lg border border-gray-100 bg-gray-50 p-4"
            >
              <h3 className="font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-1 line-clamp-3 text-gray-600">{item.summary}</p>
              {(item.date || item.source) && (
                <p className="mt-2 text-xs text-gray-400">
                  {[item.source, item.date].filter(Boolean).join(" · ")}
                </p>
              )}
            </li>
          ))}
        </ul>
      </ReportSection>

      {/* Competitor analysis */}
      <ReportSection title="Competitor Analysis">
        <ul className="space-y-4">
          {report.competitorAnalysis.map((competitor) => (
            <li
              key={competitor.name}
              className="border-l-4 border-brand-300 pl-4"
            >
              <h3 className="font-semibold text-gray-900">{competitor.name}</h3>
              <p className="mt-1 text-gray-600">{competitor.comparison}</p>
            </li>
          ))}
        </ul>
      </ReportSection>

      {/* Detailed reasoning */}
      <ReportSection title="Investment Reasoning">
        <div className="space-y-3">
          {report.reasoning.split("\n").map((paragraph, index) =>
            paragraph.trim() ? (
              <p key={index}>{paragraph.trim()}</p>
            ) : null
          )}
        </div>
      </ReportSection>
    </article>
  );
}

// ---------------------------------------------------------------------------
// Internal sub-components
// ---------------------------------------------------------------------------

type BulletVariant = "invest" | "hold" | "pass" | "brand";

const BULLET_COLORS: Record<BulletVariant, string> = {
  invest: "bg-invest",
  hold: "bg-hold",
  pass: "bg-pass",
  brand: "bg-brand-500",
};

/** Renders a styled bullet list for SWOT items. */
function BulletList({
  items,
  variant,
}: {
  items: string[];
  variant: BulletVariant;
}) {
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2.5">
          <span
            className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${BULLET_COLORS[variant]}`}
            aria-hidden="true"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
