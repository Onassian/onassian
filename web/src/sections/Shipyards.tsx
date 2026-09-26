import { yards } from '@/data/edition'

export default function Shipyards() {
  const max = Math.max(...yards.map((y) => y.orderbookCgt))
  return (
    <section id="shipyards" className="border-t border-[#c9bfa9]">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-4xl text-[#241f17]">The Yards</h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#7a7263]">
            orderbook leaderboard · compensated gross tonnage
          </span>
        </div>
        <p className="mt-3 max-w-3xl font-body text-[#3c362a]">
          Who is building the next fleet — and what they are building. CGT weights a ship by the labour
          it absorbs, making it the honest yardstick for comparing a VLCC with a cruise liner.
        </p>

        <div className="mt-8 divide-y divide-[#e0d7c2] border-y border-[#c9bfa9]">
          {yards.map((y) => (
            <div key={y.rank} className="grid grid-cols-[40px_1fr] items-center gap-4 py-4 md:grid-cols-[40px_300px_1fr_90px]">
              <div className="font-display text-2xl text-[#a89e87]">{y.rank}</div>
              <div>
                <div className="font-body font-semibold text-[#241f17]">{y.yard}</div>
                <div className="font-mono text-[11px] text-[#7a7263]">{y.country} · {y.focus}</div>
              </div>
              <div className="col-span-2 md:col-span-1">
                <div className="h-2 w-full bg-[#e0d7c2]">
                  <div className="h-full bg-[#5b4a68]" style={{ width: `${(y.orderbookCgt / max) * 100}%` }} />
                </div>
              </div>
              <div className="col-span-2 text-left font-mono text-sm text-[#241f17] md:col-span-1 md:text-right">
                {y.orderbookCgt}m CGT <span className="text-[#a89e87]">· {y.sharePct}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
