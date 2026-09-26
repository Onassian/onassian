import { edition } from '@/data/edition'

export default function Footer() {
  return (
    <footer className="border-t-2 border-[#241f17]">
      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
          <div>
            {/* same lockup as the masthead */}
            <img
              src="img/tod-lockup.png"
              alt="The Onassian Digest"
              width={2124}
              height={281}
              className="h-10 w-auto"
            />
            <p className="mt-3 font-body text-sm leading-relaxed text-[#5c5546]">
              An independent morning wire for world shipping. Free at 06:00 Singapore, every day.
            </p>
            <p className="mt-1 font-body text-[13px] italic leading-relaxed text-[#7a7263]">
              Compiled in Singapore — the world&rsquo;s #1 international shipping centre
              for the 13th consecutive year (Xinhua–Baltic Index 2026, score 99.32).
            </p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-widest text-[#b03a2e]">
              {edition.editionStamp}
            </p>
          </div>
          <div className="font-body text-sm leading-relaxed text-[#5c5546]">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#7a7263]">method</div>
            <p className="mt-2">
              Headlines link to their original publishers; briefs are our own summaries; charts are
              built from delayed index assessments with attribution. Figures are rounded and delayed —
              not for trading.
            </p>
          </div>
          <div className="font-body text-sm leading-relaxed text-[#5c5546]">
            <div className="font-mono text-[10px] uppercase tracking-widest text-[#7a7263]">corrections</div>
            <p className="mt-2">
              Found an error in a rate, a date, or a fixture? Use the{' '}
              <a href="#contact" className="text-[#241f17] underline underline-offset-2 hover:text-[#b03a2e]">
                contact form
              </a>{' '}
              or write to
              <span className="font-mono text-[#241f17]"> desk@onassian.com</span> — corrections are
              published at the top of the next edition.
            </p>
          </div>
        </div>
        <div className="mt-8 flex flex-wrap items-baseline justify-between gap-2 border-t border-[#c9bfa9] pt-4 font-mono text-[11px] uppercase tracking-widest text-[#a89e87]">
          <span>© 2026 onassian.com · an independent publication, not affiliated with Lloyd’s</span>
          <span>the digest daily · the report fridays · monitor coming</span>
        </div>
      </div>
    </footer>
  )
}
