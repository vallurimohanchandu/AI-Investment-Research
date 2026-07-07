# Deployment Guide — Vercel

Follow these steps to deploy the AI Investment Research Agent and get a live URL for your submission.

## Option A: Vercel Dashboard (Recommended)

### 1. Push to GitHub

```bash
# Create a new repo on github.com, then:
cd c:\Users\mohan\Downloads\Aiproject
git remote add origin https://github.com/YOUR_USERNAME/ai-investment-research-agent.git
git branch -M main
git push -u origin main
```

### 2. Import on Vercel

1. Go to [vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository
3. Framework preset: **Next.js** (auto-detected)
4. Add **Environment Variables**:
   - `GOOGLE_API_KEY` = your Gemini key
   - `TAVILY_API_KEY` = your Tavily key
5. Click **Deploy**

### 3. Update README

After deployment, copy your Vercel URL (e.g. `https://ai-investment-research-agent.vercel.app`) and add it to the top of `README.md` under **Live demo**.

---

## Option B: Vercel CLI

```bash
npm i -g vercel
cd c:\Users\mohan\Downloads\Aiproject
vercel login
vercel --prod
```

When prompted, add environment variables or set them in the Vercel dashboard after first deploy.

---

## Important notes

| Topic | Detail |
|---|---|
| **Request timeout** | Research takes 30–60s. Free Vercel = 10s limit. **Pro plan** needed for `maxDuration: 60` |
| **Secrets** | Never commit `.env.local`. Set keys only in Vercel dashboard |
| **Install command** | `vercel.json` uses `npm install --legacy-peer-deps` |
| **Rotate keys** | Regenerate API keys if they were shared in chat |

---

## Verify deployment

1. Open your Vercel URL
2. Enter **Tesla** and click Research
3. Wait up to 60 seconds
4. Confirm full report renders with score and recommendation

---

## Submission zip

The submission zip is at:

```
c:\Users\mohan\Downloads\ai-investment-research-agent.zip
```

Includes all source code, README, BUILD_LOG, and example runs. Excludes `node_modules`, `.env.local`, and `.git`.
