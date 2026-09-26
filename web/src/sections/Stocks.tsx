import { stocks, segmentMeta } from '@/data/edition'

const fmt = (v: number) =>
  v >= 1000 ? v.toLocaleString('en-US', { maximumFractionDigits: 0 }) : v.toFixed(2)

export default function Stocks() {
  const sorted = [...stocks].sort((a, b) => b.changePct - a.changePct)
  return (
    <section id="stocks" className="border-t border-[#c9bfa9] bg-[#efe8d6]">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-4xl text-[#241f17]">The Stock Deck</h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#7a7263]">
            shipping equities · previous close · via Yahoo Finance
          </span>
        </div>
        <p className="mt-3 max-w-3xl font-body text-[#3c362a]">
          Fourteen tickers across the four fleets and the yards that build them. The deck is rebuilt
          with every edition, sorted by the overnight move.
        </p>

        <div className="mt-8 overflow-x-auto border border-[#c9bfa9]">
          <table className="w-full min-w-[760px] border-collapse bg-[#f6f1e4]">
            <thead>
              <tr className="border-b border-[#c9bfa9] text-left font-mono text-[10px] uppercase tracking-widest text-[#7a7263]">
                <th className="px-4 py-3 font-normal">Ticker</th>
                <th className="px-4 py-3 font-normal">Company</th>
                <th className="px-4 py-3 font-normal">Segment</th>
                <th className="px-4 py-3 text-right font-normal">Last</th>
                <th className="px-4 py-3 text-right font-normal">Δ day</th>
                <th className="px-4 py-3 text-right font-normal">Div yield</th>
                <th className="px-4 py-3 font-normal">Note</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0d7c2]">
              {sorted.map((s) => (
                <tr key={s.ticker} className="font-body text-[15px] text-[#241f17] transition-colors hover:bg-[#fbf8ef]">
                  <td className="px-4 py-3 font-mono text-sm font-semibold">{s.ticker}</td>
                  <td className="px-4 py-3">{s.name}</td>
                  <td className="px-4 py-3">
                    <span className="font-mono text-[10px] uppercase tracking-widest" style={{ color: segmentMeta[s.segment].color }}>
                      {segmentMeta[s.segment].label}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-right font-mono">{fmt(s.price)}</td>
                  <td className={`px-4 py-3 text-right font-mono ${s.changePct >= 0 ? 'text-[#2e6e5e]' : 'text-[#b03a2e]'}`}>
                    {s.changePct >= 0 ? '+' : ''}{s.changePct.toFixed(1)}%
                  </td>
                  <td className="px-4 py-3 text-right font-mono text-[#5c5546]">{s.yieldPct.toFixed(1)}%</td>
                  <td className="px-4 py-3 text-[#5c5546]">{s.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 font-mono text-[11px] text-[#a89e87]">
          KRW/DKK-denominated prices shown in native currency. Seed values — replaced by live quotes when the pipeline connects.
        </p>
      </div>
    </section>
  )
}
