import { ReactNode } from "react";

/**
 * Reusable wrapper for a single section of the investment research report.
 *
 * Provides consistent card styling, title, and optional icon across
 * all report sections (overview, SWOT, news, competitors, etc.).
 */

interface ReportSectionProps {
  /** Section heading displayed at the top of the card. */
  title: string;
  /** Optional icon element rendered beside the title. */
  icon?: ReactNode;
  /** Section body content. */
  children: ReactNode;
  /** Additional CSS classes for the outer card. */
  className?: string;
}

export function ReportSection({
  title,
  icon,
  children,
  className = "",
}: ReportSectionProps) {
  return (
    <section
      className={`card animate-slide-up ${className}`.trim()}
      aria-labelledby={`section-${slugify(title)}`}
    >
      <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
        {icon && (
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-50 text-brand-600">
            {icon}
          </span>
        )}
        <h2
          id={`section-${slugify(title)}`}
          className="text-lg font-semibold text-gray-900"
        >
          {title}
        </h2>
      </div>

      <div className="text-sm leading-relaxed text-gray-700">{children}</div>
    </section>
  );
}

/** Converts a title to a URL-safe slug for aria-labelledby IDs. */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}
