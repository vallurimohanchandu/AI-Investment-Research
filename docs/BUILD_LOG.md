# AI-Assisted Build Log

This document summarizes the LLM-assisted development process used to build the AI Investment Research Agent. It serves as the **chat transcript / thought process** documentation required for the InsideIIM × Altuni AI Labs take-home assignment bonus.

---

## Tool used

- **Cursor IDE** with Claude (Auto agent) — interactive pair-programming throughout the build.

---

## Build approach

The project was built **one file at a time**, with explanation and approval at each step, then completed in bulk when the full submission was needed.

### Phase 1: Project scaffolding (files 1–6)

| Step | File | Decision |
|---|---|---|
| 1 | `package.json` | Next.js 15, LangChain split packages, Zod |
| 2 | `tsconfig.json` | Strict mode, `@/*` path alias |
| 3 | `next.config.ts` | `serverExternalPackages` for LangChain |
| 4 | `postcss.config.mjs` | Tailwind + Autoprefixer pipeline |
| 5 | `tailwind.config.ts` | Finance-oriented palette, semantic Invest/Hold/Pass colors |
| 6 | `app/globals.css` | Reusable `.btn-primary`, `.card`, `.input-field` classes |

**LLM prompt pattern:** "Build a production-quality AI Investment Research Agent with this stack and structure… Generate one file at a time."

### Phase 2: Domain & infrastructure (files 7–11)

| Step | File | Decision |
|---|---|---|
| 7 | `types/investment-report.ts` | Zod schema as single source of truth for LLM + API + UI |
| 8 | `lib/env.ts` | Lazy-validated env vars with clear error messages |
| 9 | `.env.example` | Documented key sources |
| 10 | `prompts/research-prompt.ts` | Separated system prompt, user prompt builder, search query |
| 11 | `utils/errors.ts` | `AppError` + typed error codes for client UX |

### Phase 3: Services (files 12–14)

| Step | File | Decision |
|---|---|---|
| 12 | `services/search.ts` | Tavily via `@langchain/tavily` (migrated from deprecated `@langchain/community`) |
| 13 | `services/llm.ts` | Gemini 2.5 Flash + `.withStructuredOutput(zodSchema)` |
| 14 | `services/research-agent.ts` | Orchestrator: validate → search → analyze |

### Phase 4: API & UI (files 15–24)

| Step | File | Decision |
|---|---|---|
| 15 | `app/api/research/route.ts` | Thin HTTP wrapper, `maxDuration: 60` |
| 16 | `app/layout.tsx` | Inter + JetBrains Mono via `next/font` |
| 17 | `app/page.tsx` | Client state machine: idle → loading → success/error |
| 18–24 | `components/*` | SearchForm, LoadingState, ErrorAlert, ScoreGauge, RecommendationBadge, ReportSection, ResearchReport |

### Phase 5: Completion & debugging

- Added ESLint config, `.npmrc` (`legacy-peer-deps`), comprehensive README
- **Bug fix:** Empty API keys caused generic error → improved `lib/env.ts` to surface clear message
- **Migration:** `@langchain/community` → `@langchain/tavily` (deprecated package warning)
- Verified build: `npm run typecheck` and `npm run build` pass
- Live tested with Tesla, Apple — 200 OK responses

---

## Key LLM interactions

### Initial architecture request

> "Build a production-quality AI Investment Research Agent… Follow clean architecture. Separate UI, API, AI logic, prompts, and utilities. Return structured JSON from the LLM. Use Zod."

**Outcome:** Layered folder structure (`app/`, `components/`, `services/`, `prompts/`, `types/`, `utils/`).

### Structured output decision

**Question:** How to ensure Gemini returns valid JSON?

**Answer:** LangChain `.withStructuredOutput(investmentReportSchema)` + second `zod.parse()` pass.

### Tavily deprecation

**Issue:** `npm install` warned `@langchain/community` is deprecated.

**Fix:** Migrated to `@langchain/tavily` package — reduced bundle by 48 packages.

### Error handling UX

**Issue:** Missing env vars showed "An unexpected error occurred."

**Fix:** Throw `AppError` from `lib/env.ts` with actionable message.

---

## Ambiguities resolved (documented for reviewers)

| Ambiguity | Our call |
|---|---|
| Invest vs Pass only? | Added **Hold** as third option (more realistic for equity research) |
| LangGraph required? | Used LangChain.js only; assignment allows LangChain **or** LangGraph |
| How much research? | Single Tavily query with 8 results; LLM synthesizes full report |
| Score scale | 0–100 integer with rubric in system prompt |
| Financial advice disclaimer | Footer disclaimer; not in LLM output body |

---

## Files generated with AI assistance

All 25+ source files were generated iteratively with Cursor. The developer (candidate) directed architecture, approved each file, provided API keys, tested locally, and can explain every layer.

---

## Verification commands run

```bash
npm install --legacy-peer-deps
npm run typecheck   # ✓ pass
npm run build       # ✓ pass
npm run dev         # ✓ localhost:3000
POST /api/research  # ✓ Tesla, Apple — 200 OK
```

---

*This log was compiled from the Cursor AI pair-programming session used to build this assignment.*
