import { indexSeries, orderbookDials } from '@/data/edition'
import BigChart from '@/components/BigChart'

export default function Numbers() {
  return (
    <section id="numbers" className="border-t border-[#c9bfa9] bg-[#efe8d6]">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex items-baseline justify-between">
          <h2 className="font-display text-4xl text-[#241f17]">The Numbers</h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#7a7263]">
            every figure opens up · hover to inspect
          </span>
        </div>
        <p className="mt-3 max-w-3xl font-body text-[#3c362a]">
          Twelve months of weekly closes, rebuilt every morning. The dial row below is the supply
          side of every argument in shipping — orderbook as a share of the existing fleet.
        </p>

        {/* Orderbook dials — the sample's signature metric */}
        <div className="mt-10 grid grid-cols-1 gap-px border border-[#c9bfa9] bg-[#c9bfa9] sm:grid-cols-2 lg:grid-cols-4">
          {orderbookDials.map((d) => (
            <div key={d.segment} className="bg-[#f6f1e4] p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#7a7263]">
                orderbook / fleet
              </div>
              <div className="mt-2 font-display text-5xl" style={{ color: d.color }}>
                {d.ratio}%
              </div>
              <div className="mt-1 font-body text-sm text-[#241f17]">{d.label}</div>
              <div className="mt-3 h-1.5 w-full bg-[#e0d7c2]">
                <div className="h-full" style={{ width: `${d.ratio}%`, background: d.color }} />
              </div>
              <p className="mt-3 font-body text-[13px] leading-snug text-[#5c5546]">{d.line}</p>
            </div>
          ))}
        </div>

        {/* Index histories */}
        <div className="mt-12 grid grid-cols-1 gap-10 lg:grid-cols-2">
          {indexSeries.map((s) => (
            <figure key={s.id} className="border border-[#c9bfa9] bg-[#f6f1e4] p-5">
              <figcaption className="flex items-baseline justify-between gap-4">
                <span className="font-display text-lg leading-tight text-[#241f17]">{s.title}</span>
                <span className="font-mono text-[10px] uppercase tracking-widest text-[#7a7263]">weekly · 48 pts</span>
              </figcaption>
              <div className="mt-3">
                <BigChart series={s} accent={s.color} />
              </div>
              <p className="mt-2 border-t border-[#e0d7c2] pt-3 font-body text-[13px] text-[#5c5546]">
                {s.note}
              </p>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
