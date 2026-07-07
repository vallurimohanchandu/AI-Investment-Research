import type { Recommendation } from "@/types/investment-report";

/**
 * Badge displaying the investment recommendation: Invest, Hold, or Pass.
 *
 * Uses semantic colors from tailwind.config.ts (invest, hold, pass).
 * Reused in the report header and summary sections.
 */

interface RecommendationBadgeProps {
  recommendation: Recommendation;
  /** Visual size variant. */
  size?: "sm" | "md" | "lg";
}

/** Tailwind classes per recommendation value. */
const BADGE_STYLES: Record<
  Recommendation,
  { bg: string; text: string; border: string }
> = {
  Invest: {
    bg: "bg-invest-light",
    text: "text-invest-dark",
    border: "border-invest/30",
  },
  Hold: {
    bg: "bg-hold-light",
    text: "text-hold-dark",
    border: "border-hold/30",
  },
  Pass: {
    bg: "bg-pass-light",
    text: "text-pass-dark",
    border: "border-pass/30",
  },
};

const SIZE_STYLES = {
  sm: "px-2.5 py-0.5 text-xs",
  md: "px-3 py-1 text-sm",
  lg: "px-4 py-1.5 text-base",
} as const;

export function RecommendationBadge({
  recommendation,
  size = "md",
}: RecommendationBadgeProps) {
  const styles = BADGE_STYLES[recommendation];

  return (
    <span
      className={[
        "inline-flex items-center rounded-full border font-semibold",
        styles.bg,
        styles.text,
        styles.border,
        SIZE_STYLES[size],
      ].join(" ")}
      aria-label={`Recommendation: ${recommendation}`}
    >
      {recommendation}
    </span>
  );
}
