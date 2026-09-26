import { tycoons } from '@/data/edition'

export default function Tycoons() {
  return (
    <section id="tycoons" className="border-t border-[#c9bfa9] bg-[#241f17] text-[#f2ecdf]">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 className="font-display text-4xl">The Tycoons</h2>
          <span className="font-mono text-[11px] uppercase tracking-widest text-[#a89e87]">
            evergreen series · new chapter weekly
          </span>
        </div>
        <p className="mt-3 max-w-3xl font-body leading-relaxed text-[#c9bfa9]">
          Shipping’s fortunes were made by people who read the cycle better than anyone alive.
          The series opens with the two Greeks who turned flags of convenience into empires —
          and the rivals who followed.
        </p>

        <div className="mt-10 grid grid-cols-1 gap-px bg-[#4a4231] sm:grid-cols-2 lg:grid-cols-4">
          {tycoons.map((t, i) => (
            <a key={t.slug} href="#tycoons" className="group bg-[#241f17] p-6 transition-colors hover:bg-[#2c2619]">
              <div className="font-mono text-[10px] uppercase tracking-widest text-[#a89e87]">
                chapter {String(i + 1).padStart(2, '0')} · {t.years}
              </div>
              <h3 className="mt-3 font-display text-2xl leading-tight group-hover:text-[#e0b64f]">
                {t.name}
              </h3>
              <div className="mt-1 font-body text-sm italic text-[#e0b64f]">“{t.epithet}”</div>
              <p className="mt-4 border-t border-[#4a4231] pt-4 font-body text-[14px] leading-relaxed text-[#c9bfa9]">
                {t.teaser}
              </p>
              <div className="mt-4 font-mono text-[10px] uppercase tracking-widest text-[#a89e87] group-hover:text-[#e0b64f]">
                read the chapter →
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
