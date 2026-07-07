"use client";

import { FormEvent, useEffect, useState } from "react";

/**
 * Search form for entering a company name and triggering research.
 *
 * Reusable component used on the main page. Handles client-side
 * validation and delegates the actual API call to the parent via onSubmit.
 */

interface SearchFormProps {
  /** Called with the trimmed company name when the form is submitted. */
  onSubmit: (companyName: string) => void;
  /** Disables input and button while a research request is in progress. */
  isLoading?: boolean;
  /** Pre-fills the input (e.g. after retry or previous search). */
  defaultValue?: string;
}

export function SearchForm({
  onSubmit,
  isLoading = false,
  defaultValue = "",
}: SearchFormProps) {
  const [companyName, setCompanyName] = useState(defaultValue);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync input when defaultValue changes (e.g. after a failed retry).
  useEffect(() => {
    setCompanyName(defaultValue);
  }, [defaultValue]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setValidationError(null);

    const trimmed = companyName.trim();

    if (!trimmed) {
      setValidationError("Please enter a company name.");
      return;
    }

    if (trimmed.length > 100) {
      setValidationError("Company name must be 100 characters or fewer.");
      return;
    }

    onSubmit(trimmed);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="card"
      aria-label="Company research form"
    >
      <label
        htmlFor="company-name"
        className="mb-2 block text-sm font-semibold text-gray-700"
      >
        Company Name
      </label>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start">
        <div className="flex-1">
          <input
            id="company-name"
            type="text"
            className="input-field"
            placeholder="e.g. Tesla, Apple, Microsoft"
            value={companyName}
            onChange={(e) => {
              setCompanyName(e.target.value);
              if (validationError) setValidationError(null);
            }}
            disabled={isLoading}
            autoComplete="organization"
            aria-describedby={
              validationError ? "company-name-error" : undefined
            }
            aria-invalid={validationError ? true : undefined}
          />

          {validationError && (
            <p
              id="company-name-error"
              className="mt-1.5 text-sm text-pass"
              role="alert"
            >
              {validationError}
            </p>
          )}
        </div>

        <button
          type="submit"
          className="btn-primary shrink-0 sm:mt-0"
          disabled={isLoading}
          aria-busy={isLoading}
        >
          {isLoading ? (
            <span className="flex items-center gap-2">
              <span
                className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"
                aria-hidden="true"
              />
              Researching…
            </span>
          ) : (
            "Research"
          )}
        </button>
      </div>
    </form>
  );
}
