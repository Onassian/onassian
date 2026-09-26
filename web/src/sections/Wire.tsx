import { useState } from 'react'
import { wireItems, segmentMeta, type Segment } from '@/data/edition'

const order: Segment[] = ['vlcc', 'lng', 'containers', 'drybulk', 'shipyards', 'general']

export default function Wire() {
  const [filter, setFilter] = useState<Segment | 'all'>('all')
  const items = filter === 'all' ? wireItems : wireItems.filter((w) => w.segment === filter)

  return (
    <section id="wire" className="border-t border-[#c9bfa9]">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-4xl text-[#241f17]">The Wire</h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#7a7263]">
            overnight headlines · compiled 06:00 Singapore
          </span>
        </div>
        <p className="mt-3 max-w-3xl font-body text-[#3c362a]">
          Headlines are linked to their sources; the two-line briefs are our own summary of the linked
          story. We never republish full articles.
        </p>

        <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-widest">
          <button
            onClick={() => setFilter('all')}
            className={`border px-3 py-1.5 ${filter === 'all' ? 'border-[#241f17] bg-[#241f17] text-[#f6f1e4]' : 'border-[#c9bfa9] text-[#5c5546] hover:border-[#241f17]'}`}
          >
            All ({wireItems.length})
          </button>
          {order.map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`border px-3 py-1.5 ${filter === s ? 'border-[#241f17] bg-[#241f17] text-[#f6f1e4]' : 'border-[#c9bfa9] text-[#5c5546] hover:border-[#241f17]'}`}
            >
              {segmentMeta[s].label} ({wireItems.filter((w) => w.segment === s).length})
            </button>
          ))}
        </div>

        <div className="mt-8 divide-y divide-[#e0d7c2] border-y border-[#c9bfa9]">
          {items.map((w, i) => (
            <article key={i} className="grid grid-cols-[64px_1fr] gap-4 py-5 md:grid-cols-[80px_200px_1fr]">
              <div className="font-mono text-xs text-[#a89e87]">{w.time}</div>
              <div className="hidden font-mono text-[10px] uppercase tracking-widest md:block" style={{ color: segmentMeta[w.segment].color }}>
                {segmentMeta[w.segment].label}
              </div>
              <div>
                <h3 className="font-display text-xl leading-snug text-[#241f17]">
                  {w.hot && <span className="mr-2 inline-block bg-[#b03a2e] px-1.5 py-0.5 align-middle font-mono text-[9px] uppercase tracking-widest text-[#f6f1e4]">lead</span>}
                  <a href={w.url} target="_blank" rel="noopener noreferrer" className="hover:text-[#b03a2e] hover:underline underline-offset-4">
                    {w.headline}
                  </a>
                </h3>
                <p className="mt-1.5 max-w-2xl font-body text-[15px] leading-relaxed text-[#5c5546]">{w.brief}</p>
                <div className="mt-1.5 font-mono text-[11px] text-[#a89e87]">
                  source: <a href={w.url} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-[#241f17]">{w.source}</a>
                  <span className="md:hidden"> · {segmentMeta[w.segment].label}</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
