/**
 * Error alert displayed when research fails.
 *
 * Shows a user-friendly error message and an optional retry action.
 * Used for API errors, search failures, LLM failures, and network issues.
 */

interface ErrorAlertProps {
  /** User-facing error message from the API or client. */
  message: string;
  /** Called when the user clicks "Try Again". Omitted if retry is not available. */
  onRetry?: () => void;
}

export function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div
      className="card animate-fade-in border-pass/30 bg-pass-light"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex items-start gap-4">
        {/* Error icon */}
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-pass/10"
          aria-hidden="true"
        >
          <svg
            className="h-5 w-5 text-pass"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={2}
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>

        {/* Message and actions */}
        <div className="min-w-0 flex-1">
          <h2 className="text-base font-semibold text-pass-dark">
            Research Failed
          </h2>
          <p className="mt-1 text-sm text-gray-700">{message}</p>

          {onRetry && (
            <button
              type="button"
              onClick={onRetry}
              className="btn-secondary mt-4"
            >
              Try Again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
