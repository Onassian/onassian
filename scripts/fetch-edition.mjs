#!/usr/bin/env node
// ---------------------------------------------------------------------------
// ONASSIAN — nightly edition fetcher
// Runs at 06:00 Asia/Singapore (triggered by .github/workflows/daily-edition.yml).
//
// What it does:
//   1. Pulls RSS feeds from free maritime publishers (headlines only).
//   2. Classifies each item into a segment (vlcc / lng / containers / drybulk / shipyards).
//   3. Writes a two-line neutral brief per item — via an OpenAI-compatible LLM
//      endpoint if AI_API_KEY is set, otherwise from the RSS description.
//   4. Refreshes shipping equity quotes from Yahoo Finance (best-effort).
//   5. Writes web/src/data/generated.json, consumed by the site at build time.
//
// Legal note: we store headline + link + our own short summary. Never full text.
// ---------------------------------------------------------------------------

import { readFileSync, writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const OUT = join(root, 'web', 'src', 'data', 'generated.json')
const PREV = (() => { try { return JSON.parse(readFileSync(OUT, 'utf8')) } catch { return {} } })()

// -- config ------------------------------------------------------------------

const FEEDS = [
  { url: 'https://splash247.com/feed/', source: 'Splash247' },
  { url: 'https://seatrade-maritime.com/rss.xml', source: 'Seatrade Maritime' },
  { url: 'https://www.marineinsight.com/feed/', source: 'Marine Insight' },
  { url: 'https://gcaptain.com/feed/', source: 'gCaptain' },
  { url: 'https://www.hellenicshippingnews.com/feed/', source: 'Hellenic Shipping News' },
]

const MAX_PER_FEED = 4
const MAX_WIRE = 14

const SEGMENT_RULES = [
  ['vlcc', /\b(vlcc|suezmax|aframax|tanker|crude oil|dirty tanker|td3|meg.?china|opec|bdti|frontline|okeanis|eia stocks)\b/i],
  ['lng', /\b(lng|liquefied natural gas|gas carrier|qc-?max|methane|blng|fsru|golar|flex lng)\b/i],
  ['containers', /\b(container|boxship|box ship|teu|feu|world container index|drewry|hapag|maersk|zim|port congestion|red sea|panama canal|freight rate|liner)\b/i],
  ['drybulk', /\b(capesize|panamax|supramax|ultramax|kamsarmax|handysize|bulk carrier|dry bulk|bdi|baltic dry|iron ore|coal|grain|corn|wheat|bauxite)\b/i],
  ['shipyards', /\b(shipyard|newbuild|new building|orderbook|order intake|keel laying|delivery|drydock|ksoe|samsung heavy|hanwha ocean|cssc|imabari|fincantieri|newbuilding price)\b/i],
  ['general', /\b(port|seafarer|crew|piracy|imo|regulation|sanction|cruise|ferry|naval|offshore|wind|safety|accident|collision|salvage|insurance|bunker|fuel|decarbon|emission|methanol|ammonia)\b/i],
]
const DEFAULT_SEGMENT = 'general'

const STOCK_TICKERS = [
  'FRO', 'ECO', 'INSW', 'STNG', 'HAFN',
  'FLNG', 'GLNG',
  'ZIM', 'DAC', 'MATX', 'GSL',
  'SBLK', 'GOGL', 'EGLE',
]

const AI = {
  key: process.env.AI_API_KEY || '',
  base: process.env.AI_BASE_URL || 'https://api.moonshot.ai/v1',
  model: process.env.AI_MODEL || 'moonshot-v1-8k',
}

// -- helpers -----------------------------------------------------------------

const stripHtml = (s) =>
  (s || '').replace(/<!\[CDATA\[|\]\]>/g, '').replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"').replace(/&#0?39;|&apos;/g, "'").replace(/&#\d+;/g, ' ')
    .replace(/\s+/g, ' ').trim()

const unescapeXml = stripHtml

function parseRss(xml) {
  const items = []
  const blocks = xml.match(/<item[\s>][\s\S]*?<\/item>/gi) || []
  for (const b of blocks) {
    const pick = (tag) => {
      const m = b.match(new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i'))
      return m ? unescapeXml(m[1]) : ''
    }
    const link = pick('link') || (b.match(/<guid[^>]*isPermaLink=["']true["'][^>]*>([\s\S]*?)<\/guid>/i)?.[1] ?? '')
    items.push({
      title: pick('title'),
      link: link.trim(),
      desc: pick('description'),
      pubDate: pick('pubDate') || pick('pubDate'.toLowerCase()),
    })
  }
  return items.filter((i) => i.title && i.link)
}

function classify(text) {
  for (const [seg, re] of SEGMENT_RULES) if (re.test(text)) return seg
  return DEFAULT_SEGMENT
}

const twoSentences = (text) => {
  const clean = stripHtml(text).replace(/\s+/g, ' ')
  const parts = clean.match(/[^.!?]+[.!?]+/g) || [clean]
  const out = parts.slice(0, 2).join(' ').trim()
  return out.length > 40 ? out.slice(0, 280).replace(/\s+\S*$/, '') + '…' : out || clean.slice(0, 200)
}

async function llmBrief(title, desc) {
  if (!AI.key) return null
  try {
    const res = await fetch(`${AI.base}/chat/completions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${AI.key}` },
      body: JSON.stringify({
        model: AI.model,
        temperature: 0.2,
        max_tokens: 90,
        messages: [
          {
            role: 'system',
            content:
              'You are a maritime markets desk editor. Write one or two short, neutral, factual sentences summarizing a shipping news story from its headline and excerpt. No hype, no advice, no numbers you were not given. Plain prose, max 45 words.',
          },
          { role: 'user', content: `Headline: ${title}\nExcerpt: ${stripHtml(desc).slice(0, 600)}` },
        ],
      }),
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) return null
    const data = await res.json()
    const txt = data?.choices?.[0]?.message?.content?.trim()
    return txt && txt.length > 30 ? txt : null
  } catch {
    return null
  }
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': 'OnassianBot/1.0 (+https://onassian.com; editorial aggregator)' },
      signal: AbortSignal.timeout(20000),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return parseRss(await res.text()).slice(0, MAX_PER_FEED).map((i) => ({ ...i, source: feed.source }))
  } catch (e) {
    console.warn(`feed failed: ${feed.source} — ${e.message}`)
    return []
  }
}

async function fetchQuotes() {
  const quotes = {}
  await Promise.all(STOCK_TICKERS.map(async (t) => {
    try {
      const res = await fetch(`https://query1.finance.yahoo.com/v8/finance/chart/${encodeURIComponent(t)}?interval=1d&range=5d`, {
        signal: AbortSignal.timeout(15000),
      })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const j = await res.json()
      const r = j?.chart?.result?.[0]
      const closes = (r?.indicators?.quote?.[0]?.close || []).filter((c) => typeof c === 'number')
      if (closes.length >= 2) {
        const last = closes[closes.length - 1]
        const prev = closes[closes.length - 2]
        quotes[t] = { price: +last.toFixed(2), changePct: +(((last - prev) / prev) * 100).toFixed(2) }
      }
    } catch { /* keep previous value */ }
  }))
  return quotes
}

const singaporeTime = () =>
  new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Singapore', hour: '2-digit', minute: '2-digit',
    hourCycle: 'h23', day: '2-digit', month: 'short',
  }).formatToParts(new Date())

// -- main --------------------------------------------------------------------

const parts = Object.fromEntries(singaporeTime().map((p) => [p.type, p.value]))
const editionDate = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Singapore', weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
}).format(new Date())

console.log(`[onassian] building edition — ${editionDate}, compiled ${parts.hour}:${parts.minute} Singapore`)

const feedItems = (await Promise.all(FEEDS.map(fetchFeed))).flat()

// de-duplicate by normalized title, then spread across segments
const seen = new Set()
const wire = []
for (const item of feedItems) {
  const key = item.title.toLowerCase().replace(/[^a-z0-9 ]/g, '').slice(0, 60)
  if (seen.has(key)) continue
  seen.add(key)
  const segment = classify(`${item.title} ${item.desc}`)
  const brief = (await llmBrief(item.title, item.desc)) ?? twoSentences(item.desc || item.title)
  wire.push({
    segment,
    time: '06:00',
    headline: item.title,
    brief,
    source: item.source,
    url: item.link,
  })
}
wire.sort((a, b) => SEGMENT_RULES.findIndex(([s]) => s === a.segment) - SEGMENT_RULES.findIndex(([s]) => s === b.segment))
const finalWire = wire.slice(0, MAX_WIRE)
console.log(`[onassian] wire items: ${finalWire.length} (${feedItems.length} fetched)`)

// stocks: merge fresh quotes over the previous edition's rows.
// First-ever run (no previous edition) starts from this seed deck; Yahoo refreshes prices from then on.
const SEED_STOCKS = [
  { ticker: 'FRO', name: 'Frontline', segment: 'vlcc', price: 24.86, changePct: 0, yieldPct: 11.9, note: 'VLCC pure-play, 42 ships' },
  { ticker: 'ECO', name: 'Okeanis Eco Tankers', segment: 'vlcc', price: 38.12, changePct: 0, yieldPct: 9.4, note: 'VLCC + Suezmax, scrubber fleet' },
  { ticker: 'INSW', name: 'International Seaways', segment: 'vlcc', price: 46.55, changePct: 0, yieldPct: 8.1, note: 'Crude + product mix' },
  { ticker: 'STNG', name: 'Scorpio Tankers', segment: 'vlcc', price: 67.20, changePct: 0, yieldPct: 6.2, note: 'Product tankers (LR/MR)' },
  { ticker: 'HAFN', name: 'Hafnia', segment: 'vlcc', price: 7.42, changePct: 0, yieldPct: 8.8, note: 'Product tanker scale player' },
  { ticker: 'FLNG', name: 'FLEX LNG', segment: 'lng', price: 28.90, changePct: 0, yieldPct: 7.8, note: '13 LNG carriers, charter-backed' },
  { ticker: 'GLNG', name: 'Golar LNG', segment: 'lng', price: 31.44, changePct: 0, yieldPct: 0.0, note: 'FLNG pivot + carriers' },
  { ticker: 'ZIM', name: 'ZIM Integrated', segment: 'containers', price: 21.75, changePct: 0, yieldPct: 5.5, note: 'Pacific-lane leverage' },
  { ticker: 'DAC', name: 'Danaos Corp', segment: 'containers', price: 84.30, changePct: 0, yieldPct: 4.2, note: 'Charter-duration story' },
  { ticker: 'MATX', name: 'Matson', segment: 'containers', price: 118.40, changePct: 0, yieldPct: 1.4, note: 'US Pacific niche' },
  { ticker: 'GSL', name: 'Global Ship Lease', segment: 'containers', price: 26.15, changePct: 0, yieldPct: 7.1, note: 'Mid-size containerships' },
  { ticker: 'SBLK', name: 'Star Bulk Carriers', segment: 'drybulk', price: 21.12, changePct: 0, yieldPct: 5.0, note: 'Capesize-heavy, 161 ships' },
  { ticker: 'GOGL', name: 'Golden Ocean', segment: 'drybulk', price: 12.88, changePct: 0, yieldPct: 6.6, note: 'Capesize focus post-split' },
  { ticker: 'EGLE', name: 'Eagle Bulk', segment: 'drybulk', price: 52.30, changePct: 0, yieldPct: 5.8, note: 'Supramax/Ultramax fleet' },
]
const prevStocks = Array.isArray(PREV.stocks) && PREV.stocks.length ? PREV.stocks : SEED_STOCKS
const quotes = await fetchQuotes()
const noteFor = (t, fallback) =>
  (prevStocks?.find((s) => s.ticker === t)?.note) || fallback || ''
const stockNames = {
  FRO: 'Frontline', ECO: 'Okeanis Eco Tankers', INSW: 'International Seaways', STNG: 'Scorpio Tankers', HAFN: 'Hafnia',
  FLNG: 'FLEX LNG', GLNG: 'Golar LNG',
  ZIM: 'ZIM Integrated', DAC: 'Danaos Corp', MATX: 'Matson', GSL: 'Global Ship Lease',
  SBLK: 'Star Bulk Carriers', GOGL: 'Golden Ocean', EGLE: 'Eagle Bulk',
}
const segmentFor = { FRO: 'vlcc', ECO: 'vlcc', INSW: 'vlcc', STNG: 'vlcc', HAFN: 'vlcc', FLNG: 'lng', GLNG: 'lng', ZIM: 'containers', DAC: 'containers', MATX: 'containers', GSL: 'containers', SBLK: 'drybulk', GOGL: 'drybulk', EGLE: 'drybulk' }
const stocks = STOCK_TICKERS.map((t) => {
  const prev = prevStocks?.find((s) => s.ticker === t)
  const q = quotes[t]
  return {
    ticker: t,
    name: stockNames[t] || prev?.name || t,
    segment: segmentFor[t] || prev?.segment || 'vlcc',
    price: q?.price ?? prev?.price ?? 0,
    changePct: q?.changePct ?? prev?.changePct ?? 0,
    yieldPct: prev?.yieldPct ?? 0,
    note: noteFor(t, prev?.note),
  }
}).filter((s) => s.price > 0)
console.log(`[onassian] quotes refreshed: ${Object.keys(quotes).length}/${STOCK_TICKERS.length}`)

const edition = {
  live: true,
  contactEmail: 'desk@onassian.com',
  generatedAt: new Date().toISOString(),
  editionDate,
  wire: finalWire,
  stocks,
  // kpis: carried forward from previous run until an index data feed is wired in.
  kpis: Array.isArray(PREV.kpis) && PREV.kpis.length ? PREV.kpis : undefined,
}

writeFileSync(OUT, JSON.stringify(edition, null, 2))
mkdirSync(join(root, 'web', 'public'), { recursive: true })
writeFileSync(join(root, 'web', 'public', 'build-status.json'), JSON.stringify({
  lastBuild: edition.generatedAt, ok: true, wireCount: finalWire.length, quotesRefreshed: Object.keys(quotes).length,
}, null, 2))
console.log('[onassian] wrote web/src/data/generated.json — edition ready to build')
