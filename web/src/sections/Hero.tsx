import { kpis, segmentMeta } from '@/data/edition'
import Sparkline from '@/components/Sparkline'
import PixelShip from '@/components/PixelShip'

const shipFor: Record<string, 'vlcc' | 'container' | 'bulk' | 'lng'> = {
  vlcc: 'vlcc', lng: 'lng', containers: 'container', drybulk: 'bulk', shipyards: 'container',
}

export default function Hero() {
  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <p className="max-w-3xl font-body text-lg leading-relaxed text-[#3c362a]">
        One geopolitical shock lifted every freight curve, but the four fleets beneath them run on{' '}
        <em className="font-display">completely different clocks</em>. Each number below opens up —
        tap a card to read its history.
      </p>

      <div className="mt-10 grid grid-cols-1 gap-px border border-[#c9bfa9] bg-[#c9bfa9] sm:grid-cols-2 lg:grid-cols-3">
        {kpis.map((k) => (
          <a key={k.id} href="#numbers" className="group relative bg-[#f6f1e4] p-5 transition-colors hover:bg-[#fbf8ef]">
            <div className="flex items-start justify-between gap-3">
              <span
                className="font-mono text-[10px] uppercase tracking-widest"
                style={{ color: segmentMeta[k.segment].color }}
              >
                {segmentMeta[k.segment].label}
              </span>
              <PixelShip kind={shipFor[k.segment]} className="h-8 w-20 opacity-80 transition-opacity group-hover:opacity-100" />
            </div>
            <div className="mt-3 font-display text-4xl text-[#241f17]">{k.value}</div>
            <div className="mt-1 font-body text-sm text-[#5c5546]">{k.label}</div>
            <div className="mt-4">
              <Sparkline data={k.spark} color={segmentMeta[k.segment].color} up={k.deltaUp} />
            </div>
            <div className="mt-3 flex items-baseline justify-between font-mono text-[11px]">
              <span className={k.deltaUp ? 'text-[#2e6e5e]' : 'text-[#b03a2e]'}>{k.delta}</span>
              <span className="text-[#a89e87]">{k.sub}</span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
