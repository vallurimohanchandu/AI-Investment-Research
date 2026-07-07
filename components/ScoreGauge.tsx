/**
 * Visual gauge for the investment score (0–100).
 *
 * Displays a circular progress ring and numeric score with a color
 * band that reflects overall attractiveness (red → amber → green).
 */

interface ScoreGaugeProps {
  /** Investment score from 0 to 100. */
  score: number;
  /** Diameter of the gauge in pixels. */
  size?: number;
}

/**
 * Returns Tailwind text/ring color classes based on score band.
 * Aligns with scoring guidelines in research-prompt.ts.
 */
function getScoreColor(score: number): {
  ring: string;
  text: string;
  label: string;
} {
  if (score >= 80) {
    return {
      ring: "text-invest",
      text: "text-invest-dark",
      label: "Strong",
    };
  }
  if (score >= 60) {
    return {
      ring: "text-brand-600",
      text: "text-brand-800",
      label: "Moderate",
    };
  }
  if (score >= 40) {
    return {
      ring: "text-hold",
      text: "text-hold-dark",
      label: "Weak",
    };
  }
  return {
    ring: "text-pass",
    text: "text-pass-dark",
    label: "Poor",
  };
}

export function ScoreGauge({ score, size = 120 }: ScoreGaugeProps) {
  // Clamp score to valid range for display safety.
  const clampedScore = Math.min(100, Math.max(0, Math.round(score)));
  const colors = getScoreColor(clampedScore);

  // SVG circle math: circumference = 2 * π * r
  const strokeWidth = 8;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (clampedScore / 100) * circumference;
  const offset = circumference - progress;

  return (
    <div
      className="flex flex-col items-center"
      role="img"
      aria-label={`Investment score: ${clampedScore} out of 100, ${colors.label}`}
    >
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          className="-rotate-90 transform"
          aria-hidden="true"
        >
          {/* Background track */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            className="text-gray-200"
          />
          {/* Progress arc */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            className={`${colors.ring} transition-all duration-700 ease-out`}
          />
        </svg>

        {/* Center score */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span
            className={`font-mono text-3xl font-bold leading-none ${colors.text}`}
          >
            {clampedScore}
          </span>
          <span className="mt-0.5 text-xs text-gray-400">/ 100</span>
        </div>
      </div>

      <span className={`mt-2 text-sm font-medium ${colors.text}`}>
        {colors.label}
      </span>
    </div>
  );
}
