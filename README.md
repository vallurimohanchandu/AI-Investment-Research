# AI Investment Research Agent

**InsideIIM × Altuni AI Labs — Take-Home Assignment**

An AI-powered investment research agent that accepts a company name, researches it via real-time web search, analyzes the findings with Google Gemini through LangChain, and produces a structured investment report with a scored recommendation.

> **Live Demo:** [https://ai-investment-research-delta.vercel.app/](https://ai-investment-research-delta.vercel.app/)

---

## Project Overview

This application automates equity research for any public company. A user enters a company name (e.g. Tesla, Apple, Microsoft), and the agent:

1. Searches the web for recent news, financial context, and competitor data (**Tavily Search**)
2. Analyzes the gathered information with **Google Gemini 2.5 Flash** via **LangChain.js** structured output
3. Returns a comprehensive investment report with SWOT analysis, competitor insights, an investment score (0–100), and a recommendation (**Invest / Hold / Pass**) with detailed reasoning

The app is built for production-quality standards: TypeScript throughout, Zod validation, clean architecture, responsive UI, loading states, and graceful error handling.

---

## Features

- **Real-time web research** via Tavily Search API
- **AI analysis** with Google Gemini 2.5 Flash
- **Structured JSON output** validated with Zod schemas
- **Full investment report** including:
  - Company Overview, Industry, Business Model
  - Recent News (3–5 items with sources)
  - SWOT Analysis (Strengths, Weaknesses, Opportunities, Risks)
  - Competitor Analysis (3–5 competitors)
  - Investment Score (0–100) with visual gauge
  - Recommendation: Invest / Hold / Pass
  - Detailed reasoning
- **Responsive UI** with hero header, card-based layout, semantic colors
- **Loading states** with pipeline step indicators (30–60s research time)
- **Error handling** with typed error codes and retry support
- **Vercel-ready** deployment configuration

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | Next.js 15, React 19, TypeScript, Tailwind CSS |
| **Backend** | Next.js API Routes (App Router) |
| **AI Orchestration** | LangChain.js |
| **LLM** | Google Gemini 2.5 Flash (`@langchain/google-genai`) |
| **Web Search** | Tavily Search API (`@langchain/tavily`) |
| **Validation** | Zod (structured output + runtime validation) |
| **Deployment** | Vercel |
| **Linting** | ESLint 9 + `eslint-config-next` |

---

## Architecture

```
┌─────────────────────────────────────────────────────────────┐
│  CLIENT (Browser)                                            │
│  app/page.tsx                                                │
│    SearchForm → LoadingState → ResearchReport / ErrorAlert   │
└──────────────────────────┬──────────────────────────────────┘
                           │ POST /api/research
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  API LAYER                                                   │
│  app/api/research/route.ts                                   │
│    Parse body → call researchCompany() → JSON response       │
└──────────────────────────┬──────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────┐
│  ORCHESTRATION                                               │
│  services/research-agent.ts                                  │
│    1. Validate input (Zod)                                   │
│    2. searchCompany()                                        │
│    3. analyzeCompany()                                       │
└──────────────┬──────────────────────────┬───────────────────┘
               │                          │
               ▼                          ▼
┌──────────────────────────┐  ┌──────────────────────────────┐
│  services/search.ts      │  │  services/llm.ts              │
│  Tavily Search API       │  │  Gemini 2.5 Flash             │
│  Web context gathering   │  │  Structured JSON generation   │
└──────────────────────────┘  └──────────────────────────────┘
               │                          │
               └──────────┬───────────────┘
                          ▼
              prompts/research-prompt.ts
              types/investment-report.ts (Zod schema)
```

### Data Flow

1. User submits company name → client-side validation
2. `POST /api/research` with `{ companyName }`
3. `researchRequestSchema` validates and trims input
4. `searchCompany()` → Tavily returns 8 web results → formatted as plain text
5. `analyzeCompany()` → System + user prompts sent to Gemini with `.withStructuredOutput(schema)`
6. `investmentReportSchema.parse()` validates LLM output
7. API returns `{ success: true, data: report, generatedAt }`
8. `ResearchReport` component renders all sections

---

## Folder Structure

```
ai-investment-research-agent/
├── app/                        # Next.js App Router
│   ├── api/research/route.ts   # POST endpoint
│   ├── globals.css             # Tailwind + global styles
│   ├── layout.tsx              # Root layout, fonts, metadata
│   └── page.tsx                # Main page (client component)
├── components/                 # Reusable React components
│   ├── SearchForm.tsx
│   ├── LoadingState.tsx
│   ├── ErrorAlert.tsx
│   ├── ResearchReport.tsx
│   ├── ReportSection.tsx
│   ├── ScoreGauge.tsx
│   └── RecommendationBadge.tsx
├── services/                   # Business logic (server-only)
│   ├── research-agent.ts       # Pipeline orchestrator
│   ├── search.ts               # Tavily integration
│   └── llm.ts                  # Gemini + structured output
├── prompts/                    # LLM prompt templates
│   └── research-prompt.ts
├── types/                      # Domain types + Zod schemas
│   └── investment-report.ts
├── lib/                        # Shared utilities
│   └── env.ts                  # Environment validation
├── utils/                      # Error handling
│   └── errors.ts
├── docs/                       # Documentation + example runs
│   ├── BUILD_LOG.md
│   ├── DEPLOY.md
│   └── example-runs.json
├── public/                     # Static assets
├── package.json
├── tsconfig.json
├── next.config.ts
├── tailwind.config.ts
├── postcss.config.mjs
├── eslint.config.mjs
├── vercel.json
└── .env.example
```

---

## Setup Instructions

### Prerequisites

- **Node.js** 18.17 or higher
- **npm**
- API keys for Google Gemini and Tavily Search

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment variables

```bash
cp .env.example .env.local
```

Edit `.env.local` and add your API keys (see [Environment Variables](#environment-variables) below).

### 3. Run development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 4. Production build (optional)

```bash
npm run build
npm run start
```

### Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Create production build |
| `npm run start` | Run production server |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | TypeScript type checking (no emit) |

---

## Environment Variables

| Variable | Required | Description |
|---|---|---|
| `GOOGLE_API_KEY` | Yes | Google Gemini API key — [Get key](https://aistudio.google.com/apikey) |
| `TAVILY_API_KEY` | Yes | Tavily Search API key — [Get key](https://tavily.com/) |

Copy `.env.example` to `.env.local` and fill in values. **Never commit `.env.local`.**

---

## How the AI Agent Works

### Step 1: Input Validation

The company name is validated client-side (`SearchForm`) and server-side (`researchRequestSchema` via Zod): required, max 100 characters, trimmed.

### Step 2: Web Research (Tavily)

`searchCompany()` builds a targeted query:

```
{company} company stock investment analysis news financial performance competitors
```

Tavily returns up to 8 results. Each result is formatted as numbered plain text with title, URL, and content snippet for the LLM.

### Step 3: AI Analysis (Gemini + LangChain)

`analyzeCompany()` sends two messages to Gemini 2.5 Flash:

- **System message** — Senior equity analyst persona, report structure, scoring rubric, constraints
- **User message** — Company name + Tavily search context

LangChain's `.withStructuredOutput(investmentReportSchema)` forces Gemini to return JSON matching the Zod schema. A second `schema.parse()` pass validates at runtime.

### Step 4: Response

The validated `InvestmentReport` is wrapped in `{ success: true, data, generatedAt }` and rendered by the UI.

---

## Prompt Engineering

Prompts live in `prompts/research-prompt.ts`, separated from service logic.

### System Prompt Design

| Technique | Purpose |
|---|---|
| **Persona** | "Senior equity research analyst" — professional, balanced tone |
| **Grounding rule** | "Use ONLY search context provided. Do not invent facts." |
| **Field mapping** | Each Zod schema field documented with expected content |
| **Scoring rubric** | 0–100 bands with typical recommendation mapping |
| **Recommendation rules** | Clear criteria for Invest / Hold / Pass |
| **Anti-hallucination** | "Do not fabricate news articles, dates, or sources" |

### User Prompt Design

- Injects company name and full Tavily context block
- Instructs model to acknowledge data gaps rather than guess
- Ends with explicit generation command

### Search Query Design

Single broad query capturing news, financials, competitors, and investment analysis — balances coverage vs. API cost/latency.

### Structured Output

Zod schema field `.describe()` annotations are passed to LangChain, giving Gemini per-field guidance. This aligns prompt engineering with validation in a single source of truth (`types/investment-report.ts`).

---

## Key Design Decisions

| Decision | Rationale |
|---|---|
| **Next.js App Router** | Matches assignment stack; unified frontend + API in one deployable unit |
| **Clean architecture layers** | UI → API → services → prompts/types — each layer has one responsibility |
| **Zod as single source of truth** | Same schema for LLM binding, API validation, and TypeScript types |
| **Prompts in separate files** | Iteration without touching orchestration code |
| **Gemini 2.5 Flash** | Fast, cost-effective, strong structured output |
| **Tavily over raw Google Search** | Built for LLM/RAG; cleaner result formatting |
| **Invest / Hold / Pass** | Industry-standard equity research (assignment said invest/pass; Hold added for realism) |
| **Server-only API keys** | No `NEXT_PUBLIC_` prefix; keys never reach browser |
| **`serverExternalPackages`** | Prevents LangChain from bundling into client JS |
| **Low temperature (0.3)** | Consistent, factual financial analysis |
| **`@langchain/tavily`** | Migrated from deprecated `@langchain/community` Tavily tool |

---

## Trade-offs

| Choice | Benefit | Cost |
|---|---|---|
| Single Tavily query | Simple, fast, low cost | Less depth than multi-query research |
| No LangGraph | Faster to build, easier to debug | No multi-agent or conditional routing |
| No database | Stateless, simple deployment | No report history |
| No streaming | Simpler implementation | User waits 30–60s with spinner only |
| Synchronous pipeline | Predictable flow | Search must complete before LLM starts |
| 60s `maxDuration` | Enough for search + LLM on Vercel Pro | Free Vercel tier limited to 10s |
| Hold recommendation | More realistic | Slightly beyond binary invest/pass spec |

---

## Example Runs

Tested on **July 6, 2026**. Full JSON outputs in [`docs/example-runs.json`](docs/example-runs.json).

### Tesla

| Field | Result |
|---|---|
| **Score** | 65 / 100 |
| **Recommendation** | Hold |
| **Summary** | EV market leader with strong brand and technology moat; facing slumping profits, government credit reliance, and intensifying BYD competition |
| **Key Risk** | Strengthened competition and Full Self-Driving regulatory scrutiny |

### Apple

| Field | Result |
|---|---|
| **Score** | 82 / 100 |
| **Recommendation** | Invest |
| **Summary** | Dominant ecosystem with strong services revenue and cash position; continued innovation in AI and wearables |
| **Key Risk** | China market exposure and regulatory pressures |

### Microsoft

| Field | Result |
|---|---|
| **Score** | 78 / 100 |
| **Recommendation** | Hold |
| **Summary** | AI/Copilot leadership with cloud revenue growth (FY25 +14.9%); strong commercial backlog |
| **Key Risk** | AI infrastructure capex pressure; hedge fund TCI reduced stake over AI concerns |

---

## Future Improvements

1. **LangGraph multi-agent pipeline** — Separate agents for news, financials, and risk analysis
2. **Streaming UI** — Stream report sections as Gemini generates them
3. **Report persistence** — PostgreSQL to save and compare historical reports
4. **Additional data sources** — SEC EDGAR filings, real-time stock metrics
5. **PDF export** — Downloadable research reports
6. **Evaluation suite** — Automated LLM output quality benchmarks
7. **Rate limiting & auth** — Protect production API from abuse
8. **Response caching** — Redis cache for repeated lookups

---

> **Status:** Live and working!  
> **Link:** [https://ai-investment-research-delta.vercel.app/](https://ai-investment-research-delta.vercel.app/)

---

## AI Build Documentation

See [`docs/BUILD_LOG.md`](docs/BUILD_LOG.md) for the full AI-assisted development log (Cursor + Claude), including file-by-file build order and debugging steps.

---

## API Reference

### `POST /api/research`

**Request:**
```json
{ "companyName": "Tesla" }
```

**Success (200):**
```json
{
  "success": true,
  "data": { "companyName": "Tesla", "investmentScore": 65, "recommendation": "Hold", "..." : "..." },
  "generatedAt": "2026-07-06T08:22:28.000Z"
}
```

**Error:**
```json
{
  "success": false,
  "error": "Web search failed. Please try again.",
  "code": "SEARCH_ERROR"
}
```

---

## Disclaimer

This application is for **informational and educational purposes only**. It does not constitute financial advice. Always conduct your own due diligence before making investment decisions.

---

## Author

Take-home assignment submission for **InsideIIM × Altuni AI Labs** — AI Product Development Engineer (Intern).
