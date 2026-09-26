import { edition } from '@/data/edition'

const nav = [
  ['#wire', 'The Wire'],
  ['#numbers', 'Numbers'],
  ['#stocks', 'Stock Deck'],
  ['#shipyards', 'Shipyards'],
  ['#tycoons', 'Tycoons'],
  ['#report', 'Fridays: The Report'],
]

export default function Masthead() {
  return (
    <header className="border-b-2 border-[#241f17]">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-center justify-between py-3 font-mono text-[11px] tracking-widest uppercase text-[#7a7263]">
          <span>onassian.com · the overnight wire for world shipping</span>
          <span className="hidden md:block">published 06:00 singapore · daily</span>
        </div>
        <div className="flex flex-wrap items-end justify-between gap-4 border-t border-[#c9bfa9] py-5">
          <h1>
            <img
              src="img/tod-lockup.png"
              alt="The Onassian Digest"
              width={2124}
              height={281}
              className="h-12 w-auto md:h-16"
            />
          </h1>
          <div className="pb-2 text-right">
            <div className="font-display text-2xl text-[#b03a2e]">{edition.editionDate}</div>
            <div className="mt-1 font-mono text-[11px] uppercase tracking-widest text-[#7a7263]">
              {edition.kicker}
            </div>
          </div>
        </div>
        <div className="flex flex-wrap gap-x-6 gap-y-2 border-t border-[#c9bfa9] py-3 font-mono text-[11px] uppercase tracking-widest">
          {nav.map(([href, label]) => (
            <a key={href} href={href} className="text-[#241f17] underline-offset-4 hover:text-[#b03a2e] hover:underline">
              {label}
            </a>
          ))}
          <span className="ml-auto hidden text-[#b03a2e] md:inline">{edition.editionStamp}</span>
        </div>
      </div>
    </header>
  )
}
