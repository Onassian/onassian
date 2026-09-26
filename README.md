# ONASSIAN — The Overnight Wire for World Shipping

Daily 06:00 Singapore edition: VLCC · LNG carriers · container ships · dry bulk · shipyards · shipping equities.

This repository is the whole publication: the website (`web/`) plus the nightly pipeline that
compiles each edition (`scripts/`). Everything runs free — GitHub Actions builds, Cloudflare Pages hosts.

---

## How an edition is made (every day, 06:00 Asia/Singapore)

```
GitHub schedule cron 22:00 UTC (= 06:00 SGT next day)
        │
        ▼
scripts/dst-check.mjs            ← sanity check: fires only in the Singapore-06:00 window
        │
        ▼
scripts/fetch-edition.mjs        ← RSS headlines → segment classification → 2-line briefs
        │                          ← Yahoo Finance quote refresh (best-effort)
        │                          ← writes web/src/data/generated.json
        ▼
npm ci && npm run build (web/)   ← static React build
        │
        ▼
commit edition back to repo      ← the git history IS your wire archive
        │
        ▼
wrangler pages deploy web/dist   ← live on onassian.com
```

Singapore has no daylight saving, so a single UTC cron entry is exact all year.
Why Singapore: #1 in the 2026 Xinhua–Baltic International Shipping Centre Development Index
(99.32/100, 13th consecutive year at the top), a record 44.66 million TEU of container
throughput, and the world's largest bunkering port at 56.77 million tonnes.

---

## One-time setup (≈ 20 minutes)

### 1. Create the GitHub repo
- At https://github.com/Onassian create a **public** repository named `onassian` (public = free scheduled Actions).
- Push this folder:

```bash
cd onassian-pipeline
git init -b main
git add -A
git commit -m "onassian: seed edition"
git remote add origin git@github.com:Onassian/onassian.git
git push -u origin main
```

### 2. Create the Cloudflare Pages project
```bash
npx wrangler login
npx wrangler pages project create onassian --production-branch main
```

### 3. Wire the GitHub secrets (repo → Settings → Secrets and variables → Actions)

| Kind | Name | Value |
|---|---|---|
| Secret | `CLOUDFLARE_API_TOKEN` | Cloudflare → My Profile → API Tokens → "Create Token" → template **Edit Cloudflare Workers** (covers Pages) |
| Secret | `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard, right-hand column of the overview page |
| Variable | `CF_PROJECT` | `onassian` (must match the project name from step 2) |
| Secret | `AI_API_KEY` | optional — enables LLM-written briefs; without it, briefs come from feed excerpts |
| Variable | `AI_BASE_URL` | optional — OpenAI-compatible endpoint; defaults to `https://api.moonshot.ai/v1` |
| Variable | `AI_MODEL` | optional — defaults to `moonshot-v1-8k` |

### 4. Test it by hand
- Repo → **Actions** → *Daily Edition* → **Run workflow**. In ~2 minutes the site deploys.
- Every subsequent day it runs itself at 06:00 Singapore. Your laptop plays no part.

### 5. Point the domain (finish what you started at IONOS)
- Once Cloudflare shows your zone **Active** (nameservers swapped at IONOS after the DNSSEC wait):
  Cloudflare → Pages → `onassian` → **Custom domains** → add `onassian.com` and `www.onassian.com`.
  SSL is automatic; keep the DNS records Cloudflare pre-creates (the orange-cloud proxied A/CNAME records).

### 6. (Optional) Cloudflare Worker backstop trigger
GitHub's scheduler can lag minutes on a bad day. `workers/cron-worker.js` fires on Cloudflare's own
clock and pokes the workflow via `repository_dispatch`. Deploy it per the comments in that file.

---

## Where each piece of the edition comes from

| Section | Source | Terms posture |
|---|---|---|
| The Wire | Splash247, Seatrade Maritime, Marine Insight, gCaptain, Hellenic Shipping News — RSS | Headline + link + **our own** 2-line summary. Full text is never stored. |
| Stock Deck | Yahoo Finance chart API, previous-close deltas | Delayed quotes; "not for trading" disclaimer ships in the footer. |
| KPI cards & charts | seed data until an index feed is licensed | Baltic/Drewry/SCFI sit behind licences — **do not** put them behind a paywall without one. |
| Shipyards, dials, Tycoons | curated (edited by hand / AI-assisted) | Your original content. |

## Adding a source
Edit `FEEDS` or `SEGMENT_RULES` in `scripts/fetch-edition.mjs`. Classification is regex-keyword
based — add route names, company names, or tickers to steer stories to the right segment.

## If a night fails
The workflow keeps running; a failed fetch degrades gracefully (feeds/quotes fail independently,
previous values carry forward). Watch the Actions tab; `build-status.json` in `web/public/` records
the last successful compile inside the deployed site itself.

---

*Independent publication. Not affiliated with Lloyd's. Figures are delayed and rounded — for information, not trading.*
