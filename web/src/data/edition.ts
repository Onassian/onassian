// ---------------------------------------------------------------------------
// ONASSIAN — Edition data model
// SEED EDITION: values below are plausible placeholders for the design/pipeline
// until the 6:00 AM London fetcher (RSS + indices + Yahoo Finance) is wired in.
// Every chart and figure on the site reads from this single object.
// ---------------------------------------------------------------------------

export type Segment = 'vlcc' | 'lng' | 'containers' | 'drybulk' | 'shipyards' | 'general'

export interface Kpi {
  id: string
  segment: Segment
  label: string
  value: string
  delta: string
  deltaUp: boolean
  sub: string
  spark: number[]
}

export interface WireItem {
  segment: Segment
  time: string
  headline: string
  brief: string
  source: string
  url: string
  hot?: boolean
}

export interface StockRow {
  ticker: string
  name: string
  segment: Segment
  price: number
  changePct: number
  yieldPct: number
  note: string
}

export interface YardRow {
  rank: number
  yard: string
  country: string
  orderbookCgt: number
  sharePct: number
  focus: string
}

export interface TycoonTeaser {
  slug: string
  name: string
  years: string
  epithet: string
  teaser: string
}

export interface IndexSeries {
  id: string
  title: string
  unit: string
  color: string
  points: { d: string; v: number }[]
  note: string
}

export const edition = {
  brand: 'ONASSIAN',
  kicker: 'The Overnight Wire for World Shipping',
  contactEmail: 'desk@onassian.com',
  editionDate: 'Thursday, 24 September 2026',
  editionStamp: 'SEED EDITION · 06:00 SINGAPORE · sample data until the daily pipeline connects',
  generated: '2026-09-24T06:00:00+01:00',
}

// -- Hero KPIs --------------------------------------------------------------

const rnd = (seed: number) => {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}
const walk = (seed: number, start: number, vol: number, n: number, drift = 0) => {
  const r = rnd(seed)
  const out: number[] = []
  let v = start
  for (let i = 0; i < n; i++) {
    out.push(Math.round(v * 100) / 100)
    v += (r() - 0.5) * vol + drift
  }
  return out
}

export const kpis: Kpi[] = [
  {
    id: 'td3c', segment: 'vlcc', label: 'TD3C · VLCC MEG–China',
    value: 'WS 51.4', delta: '+3.2 w-o-w', deltaUp: true,
    sub: '≈ $42,800/day TCE · Baltic assessment',
    spark: walk(11, 44, 4, 30, 0.35),
  },
  {
    id: 'bdti', segment: 'vlcc', label: 'Baltic Dirty Tanker Index',
    value: '948', delta: '+2.1% d-o-d', deltaUp: true,
    sub: 'Dirty tanker basket · VLCC 42%, Suezmax 33%',
    spark: walk(23, 860, 26, 30, 3),
  },
  {
    id: 'blng', segment: 'lng', label: 'BLNG1g · LNG 174k cbm',
    value: '$52,500/d', delta: '−4.5% w-o-w', deltaUp: false,
    sub: 'Tri-fuel XDF tonnage · US–Japan round',
    spark: walk(31, 61000, 3200, 30, -260),
  },
  {
    id: 'bdi', segment: 'drybulk', label: 'Baltic Dry Index',
    value: '1,872', delta: '−1.3% d-o-d', deltaUp: false,
    sub: 'Capesize BCI 2,910 · Panamax BPI 1,584',
    spark: walk(41, 2050, 90, 30, -6),
  },
  {
    id: 'wci', segment: 'containers', label: 'Drewry WCI · $/40ft',
    value: '$3,214', delta: '+1.8% w-o-w', deltaUp: true,
    sub: '8-lane composite · Shanghai–Rotterdam $3,942',
    spark: walk(53, 2860, 120, 30, 12),
  },
  {
    id: 'orderbook', segment: 'shipyards', label: 'Orderbook / Fleet · all types',
    value: '24.6%', delta: 'highest since 2012', deltaUp: true,
    sub: 'Clarksons aggregate · 7,380 ships on order',
    spark: walk(67, 10, 0.7, 30, 0.4),
  },
]

// -- Index histories (12 months, weekly) ------------------------------------

const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep']
const weeklyLabels = months.flatMap((m) => [`${m} w1`, `${m} w2`, `${m} w3`, `${m} w4`])

export const indexSeries: IndexSeries[] = [
  {
    id: 'td3c-hist', title: 'TD3C Worldscale · VLCC Middle East Gulf → China',
    unit: 'WS', color: '#1f3a5f',
    note: 'Baltic Exchange TD3C route assessment, weekly closes. The single most-watched VLCC number in the world.',
    points: walk(7, 58, 7, 48, -0.1).map((v, i) => ({ d: weeklyLabels[i], v })),
  },
  {
    id: 'wci-hist', title: 'Drewry World Container Index · $ per 40ft box',
    unit: '$/FEU', color: '#b03a2e',
    note: 'Weekly composite of eight major East–West and transatlantic lanes.',
    points: walk(9, 2400, 260, 48, 18).map((v, i) => ({ d: weeklyLabels[i], v: Math.round(v) })),
  },
  {
    id: 'bdi-hist', title: 'Baltic Dry Index',
    unit: 'pts', color: '#8a6d3b',
    note: 'Capesize-weighted dry bulk basket. Reads the steel and coal/iron-ore trades.',
    points: walk(13, 1750, 260, 48, 4).map((v, i) => ({ d: weeklyLabels[i], v: Math.round(v) })),
  },
  {
    id: 'blng-hist', title: 'BLNG1g · LNG carrier 174k cbm spot equiv.',
    unit: '$/day', color: '#2e6e5e',
    note: 'Modern gas carrier earnings. Strongly seasonal — winter spikes visible.',
    points: walk(17, 42000, 5200, 48, 260).map((v, i) => ({ d: weeklyLabels[i], v: Math.round(v / 100) * 100 })),
  },
]

// -- Orderbook / fleet ratios (the sample's hero dials) ----------------------

export const orderbookDials = [
  { segment: 'containers' as Segment, label: 'Container ships', ratio: 38.7, color: '#1f3a5f', line: '2007-shaped orderbook — the overbuild everyone quotes.' },
  { segment: 'drybulk' as Segment, label: 'Dry bulk', ratio: 7.0, color: '#8a6d3b', line: 'Scrubber-era lows — the quietest book in decades.' },
  { segment: 'vlcc' as Segment, label: 'Tankers', ratio: 14.7, color: '#b03a2e', line: 'A 2022 new species: ageing VLCC fleet meets modest ordering.' },
  { segment: 'lng' as Segment, label: 'LNG carriers', ratio: 36.2, color: '#2e6e5e', line: 'Second LNG supercycle — 60% of the book is dual-fuel.' },
]

// -- The Wire ---------------------------------------------------------------

export const wireItems: WireItem[] = [
  { segment: 'vlcc', time: '05:42', hot: true,
    headline: 'VLCC rates extend gains as Middle East loadings bunch into early October',
    brief: 'Fixture lists show a dense MEG October program against fewer prompt ships; TD3C assessments rose for a fifth session.',
    source: 'Signal Group weekly monitor', url: 'https://www.thesignalgroup.com/weekly-market-monitor/' },
  { segment: 'vlcc', time: '04:15',
    headline: 'Suezmax earnings firm on West Africa–Europe; LR2s soften in the Gulf',
    brief: 'Clean/dirty spread narrows as product tanker supply returns from refinery maintenance season.',
    source: 'Hellenic Shipping News', url: 'https://www.hellenicshippingnews.com' },
  { segment: 'lng', time: '05:05', hot: true,
    headline: 'QatarEnergy threads another 12 QC-Max LNG carriers through Korean yards',
    brief: 'The expansion program keeps HD Hyundai, Samsung Heavy and Hanwha Ocean full into 2031; slot scarcity is pushing newbuild prices toward $270m per ship.',
    source: 'Seatrade Maritime', url: 'https://seatrade-maritime.com' },
  { segment: 'lng', time: '03:58',
    headline: 'Atlantic LNG freight softens as US Gulf loading windows slip',
    brief: 'BLNG1g assessments drift lower for a third week; brokers point to a wave of Q4 re-deliveries.',
    source: 'Splash247', url: 'https://splash247.com' },
  { segment: 'containers', time: '05:31',
    headline: 'WCI rises a second week; transatlantic lanes lead while Asia–Med flattens',
    brief: 'Drewry’s composite gained 1.8% — rate momentum is now breadth-driven rather than a single-lane spike.',
    source: 'Drewry WCI', url: 'https://www.drewry.co.uk/supply-chain-advisors/supply-chain-expertise/world-container-index-assessed-by-drewry' },
  { segment: 'containers', time: '02:47',
    headline: 'Idle boxship fleet stays below 1%; charter market split by size',
    brief: 'Small feeders soften as new Chinese-built tonnage delivers, while 8–12k TEU eco-ships remain bid.',
    source: 'Alphaliner via press', url: 'https://splash247.com' },
  { segment: 'drybulk', time: '05:12', hot: true,
    headline: 'Capesize push fizzles at $29k/day; Brazilian iron ore line-up thins',
    brief: 'BDI slips for a second day — the rally needs Vale volumes to return before Q4 contract restocking.',
    source: 'Baltic Exchange / Trading Economics', url: 'https://tradingeconomics.com/commodity/baltic' },
  { segment: 'drybulk', time: '01:20',
    headline: 'Panamax grains steady; Black Sea corn inspections drive prompt fixing',
    brief: 'BPI holds near $13.9k/day with owners selectively ballasting toward the Continent.',
    source: 'Hellenic Shipping News', url: 'https://www.hellenicshippingnews.com' },
  { segment: 'shipyards', time: '04:40',
    headline: 'Korean big three pass $30bn in combined 2026 order intake',
    brief: 'LNG and container orders dominate the book; CSSC yards answer with 30%-cheaper quotes on standard designs.',
    source: 'iMarineNews / KED Global', url: 'https://www.imarinenews.com' },
  { segment: 'shipyards', time: '00:35',
    headline: 'Tanker contracting lags: owners weigh $130m VLCC quotes against $95m five-year-old resales',
    brief: 'The newbuild-vs-secondhand spread is the widest since 2007 — S&P brokers report bidding wars for 2020-built tonnage.',
    source: 'VesselsValue S&P commentary', url: 'https://www.vesselsvalue.com' },
]

// -- Stock deck -------------------------------------------------------------

export const stocks: StockRow[] = [
  { ticker: 'FRO', name: 'Frontline', segment: 'vlcc', price: 24.86, changePct: 2.4, yieldPct: 11.9, note: 'VLCC pure-play, 42 ships' },
  { ticker: 'ECO', name: 'Okeanis Eco Tankers', segment: 'vlcc', price: 38.12, changePct: 1.8, yieldPct: 9.4, note: 'VLCC + Suezmax, scrubber fleet' },
  { ticker: 'INSW', name: 'International Seaways', segment: 'vlcc', price: 46.55, changePct: 0.9, yieldPct: 8.1, note: 'Crude + product mix' },
  { ticker: 'STNG', name: 'Scorpio Tankers', segment: 'vlcc', price: 67.20, changePct: -0.6, yieldPct: 6.2, note: 'Product tankers (LR/MR)' },
  { ticker: 'FLNG', name: 'FLEX LNG', segment: 'lng', price: 28.90, changePct: -1.2, yieldPct: 7.8, note: '13 LNG carriers, charter-backed' },
  { ticker: 'GLNG', name: 'Golar LNG', segment: 'lng', price: 31.44, changePct: 0.4, yieldPct: 0.0, note: 'FLNG pivot + carriers' },
  { ticker: 'ZIM', name: 'ZIM Integrated', segment: 'containers', price: 21.75, changePct: 3.1, yieldPct: 5.5, note: 'Pacific-lane leverage' },
  { ticker: 'DAC', name: 'Danaos Corp', segment: 'containers', price: 84.30, changePct: 1.1, yieldPct: 4.2, note: 'Charter-duration story' },
  { ticker: 'MAERSK-B', name: 'A.P. Moller–Maersk', segment: 'containers', price: 11240, changePct: 0.7, yieldPct: 7.6, note: 'DKK · integrator strategy' },
  { ticker: 'HLAG.DE', name: 'Hapag-Lloyd', segment: 'containers', price: 148.20, changePct: -0.3, yieldPct: 6.9, note: 'Atlantic + LatAm strength' },
  { ticker: 'SBLK', name: 'Star Bulk Carriers', segment: 'drybulk', price: 21.12, changePct: -1.8, yieldPct: 5.0, note: 'Capesize-heavy, 161 ships' },
  { ticker: 'GOGL', name: 'Golden Ocean', segment: 'drybulk', price: 12.88, changePct: -1.4, yieldPct: 6.6, note: 'Capesize focus post-split' },
  { ticker: 'KSOE', name: 'HD Hyundai Heavy', segment: 'shipyards', price: 198500, changePct: 2.9, yieldPct: 2.1, note: 'KRW · world #1 by CGT' },
  { ticker: '010140.KS', name: 'Samsung Heavy', segment: 'shipyards', price: 9830, changePct: 1.6, yieldPct: 0.4, note: 'KRW · LNG carrier leader' },
]

// -- Shipyard leaderboard ---------------------------------------------------

export const yards: YardRow[] = [
  { rank: 1, yard: 'HD Hyundai (HHI + HMD + HSHI)', country: 'South Korea', orderbookCgt: 24.1, sharePct: 18.4, focus: 'LNG carriers, VLCCs, container ships' },
  { rank: 2, yard: 'Samsung Heavy Industries', country: 'South Korea', orderbookCgt: 16.8, sharePct: 12.8, focus: 'LNG carriers, FPSO, cruise' },
  { rank: 3, yard: 'CSSC (incl. Jiangnan / Hudong)', country: 'China', orderbookCgt: 15.9, sharePct: 12.1, focus: 'Box ships, tankers, dual-fuel' },
  { rank: 4, yard: 'Hanwha Ocean (ex-DSME)', country: 'South Korea', orderbookCgt: 12.4, sharePct: 9.4, focus: 'LNG, naval, containership' },
  { rank: 5, yard: 'Imabari Shipbuilding', country: 'Japan', orderbookCgt: 8.2, sharePct: 6.3, focus: 'Bulkers, tankers, box ships' },
  { rank: 6, yard: 'COSCO Shipping Heavy Industry', country: 'China', orderbookCgt: 7.1, sharePct: 5.4, focus: 'Bulkers, tankers' },
  { rank: 7, yard: 'Yangzijiang Shipbuilding', country: 'China', orderbookCgt: 6.6, sharePct: 5.0, focus: 'Container ships, bulkers' },
  { rank: 8, yard: 'Fincantieri', country: 'Italy', orderbookCgt: 4.9, sharePct: 3.7, focus: 'Cruise, naval, offshore' },
]

// -- Tycoons ----------------------------------------------------------------

export const tycoons: TycoonTeaser[] = [
  { slug: 'onassis', name: 'Aristotle Onassis', years: '1906–1975',
    epithet: 'The Golden Greek',
    teaser: 'From tobacco smuggling in the Smyrna fire to the largest privately owned fleet on earth — and the deal with the King of Saudi Arabia that invented the supertanker era.' },
  { slug: 'niarchos', name: 'Stavros Niarchos', years: '1909–1996',
    epithet: 'The Golden Knight',
    teaser: 'Onassis’s brother-in-law, rival and mirror. Built the first 100,000-ton tanker before Onassis, then walked away from ships at the top — twice.' },
  { slug: 'fredriksen', name: 'John Fredriksen', years: 'b. 1944',
    epithet: 'The Big Dog',
    teaser: 'The most successful tanker owner alive. Bought Frontline at the bottom, shorted his own market in 2008, and built Seadrill out of a fax machine.' },
  { slug: 'moller', name: 'A.P. Møller', years: '1876–1965',
    epithet: 'The Constant',
    teaser: '“No loss is as certain as a foregone profit.” Two wars, one company town, and the discipline that made Maersk the flag every shipowner salutes.' },
]

// -- live edition overlay ---------------------------------------------------
// The nightly pipeline (scripts/fetch-edition.mjs) rewrites generated.json.
// When it marks itself live, its wire items, stocks and KPI values override
// the seed data above. Everything else (chart histories, dials, tycoons)
// stays curated until dedicated index feeds are licensed.

// The live edition is fetched at RUNTIME from edition.json (published daily by
// the 06:00 Singapore pipeline), so the deployed site always shows the current
// date and headlines without needing a rebuild. Seed data above is the fallback.

interface GeneratedWireItem {
  segment: Segment
  time: string
  headline: string
  brief: string
  source: string
  url: string
  hot?: boolean
}

interface GeneratedStock {
  ticker: string
  name: string
  segment: Segment
  price: number
  changePct: number
  yieldPct: number
  note: string
}

interface GeneratedKpi {
  id: string
  value?: string
  delta?: string
  deltaUp?: boolean
  sub?: string
  spark?: number[]
}

interface GeneratedEdition {
  live?: boolean
  contactEmail?: string
  generatedAt?: string
  editionDate?: string
  wire?: GeneratedWireItem[]
  stocks?: GeneratedStock[]
  kpis?: GeneratedKpi[]
}

function applyGenerated(gen: GeneratedEdition) {
  if (!gen.live) return
  edition.editionDate = gen.editionDate ?? edition.editionDate
  edition.contactEmail = gen.contactEmail ?? edition.contactEmail
  edition.editionStamp = 'LIVE EDITION · 06:00 SINGAPORE · compiled from linked sources'
  if (gen.generatedAt) edition.generated = gen.generatedAt
  if (gen.wire && gen.wire.length > 0) {
    wireItems.length = 0
    wireItems.push(...gen.wire)
  }
  if (gen.stocks && gen.stocks.length > 0) {
    stocks.length = 0
    stocks.push(...gen.stocks)
  }
  if (gen.kpis) {
    for (const g of gen.kpis) {
      const k = kpis.find((k) => k.id === g.id)
      if (!k) continue
      if (g.value !== undefined) k.value = g.value
      if (g.delta !== undefined) k.delta = g.delta
      if (g.deltaUp !== undefined) k.deltaUp = g.deltaUp
      if (g.sub !== undefined) k.sub = g.sub
      if (g.spark && g.spark.length > 1) k.spark = g.spark
    }
  }
}

// Called once before the app renders (see main.tsx). The cache-buster query
// guarantees readers always get today's edition, never a cached one.
export async function loadEdition(): Promise<void> {
  try {
    const res = await fetch(`edition.json?v=${Date.now()}`)
    if (!res.ok) return
    applyGenerated((await res.json()) as GeneratedEdition)
  } catch {
    // offline or first deploy — the seed edition above remains in place
  }
}

// -- helpers ----------------------------------------------------------------

export const segmentMeta: Record<Segment, { label: string; color: string }> = {
  vlcc: { label: 'VLCC & Tankers', color: '#b03a2e' },
  lng: { label: 'LNG Carriers', color: '#2e6e5e' },
  containers: { label: 'Container Ships', color: '#1f3a5f' },
  drybulk: { label: 'Dry Bulk', color: '#8a6d3b' },
  shipyards: { label: 'Shipyards & Orderbook', color: '#5b4a68' },
  general: { label: 'General & Regulation', color: '#6b6455' },
}
