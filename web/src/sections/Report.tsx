// Fridays: The Onassian Report — the flagship weekly. Today a promise; the
// paid-tier anchor tomorrow. Onassian Monitor (vessel tracking, alerts,
// valuations) is named here so the architecture is public.
export default function Report() {
  return (
    <section id="report" className="border-t border-[#c9bfa9] bg-[#efe8d6]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-baseline justify-between gap-x-8 gap-y-4 px-5 py-10">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-widest text-[#7a7263]">
            every friday · weekly
          </div>
          <h2
            className="mt-1 whitespace-nowrap font-display text-[10.5vw] italic leading-[0.9] tracking-tight md:text-[40px]"
            style={{ textShadow: '3px 4px 6px rgba(36,31,23,0.35), 1px 1px 1px rgba(36,31,23,0.2)' }}
          >
            <span className="text-[#502e15]">The</span>{' '}
            <span className="text-[#4d4830]">Onassian</span>{' '}
            <span className="text-[#a03b28]">Report</span>
          </h2>
        </div>
        <p className="max-w-xl font-body text-[15px] leading-relaxed text-[#5c5546]">
          One cycle read in depth. One tycoon chapter. The week in rates and the orderbook,
          argued rather than listed. The flagship weekly — and the anchor of the professional
          tier, <span className="italic">Onassian Monitor</span> (vessel tracking, route alerts,
          fleet valuations), coming when the data licences are.
        </p>
      </div>
    </section>
  )
}
