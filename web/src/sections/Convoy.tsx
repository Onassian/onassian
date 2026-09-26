import PixelShip from '@/components/PixelShip'

type Kind = 'vlcc' | 'container' | 'bulk' | 'lng'
const convoy: { kind: Kind; name: string }[] = [
  { kind: 'vlcc', name: 'crude' },
  { kind: 'container', name: 'boxes' },
  { kind: 'lng', name: 'gas' },
  { kind: 'bulk', name: 'ore' },
  { kind: 'container', name: 'boxes' },
  { kind: 'vlcc', name: 'crude' },
  { kind: 'bulk', name: 'ore' },
  { kind: 'lng', name: 'gas' },
]

// One full strip; rendered twice inside the marquee so the loop is seamless.
function Strip() {
  return (
    <div className="flex shrink-0 items-end">
      {convoy.map((c, i) => (
        <div
          key={i}
          className="mx-7 flex flex-col items-center md:mx-10"
          style={{ animation: `bob ${2.4 + (i % 3) * 0.5}s ease-in-out ${i * 0.3}s infinite` }}
        >
          <PixelShip kind={c.kind} className="h-14 w-32 md:h-16 md:w-36" />
          <span className="mt-1 font-mono text-[9px] uppercase tracking-widest text-[#a89e87]">{c.name}</span>
        </div>
      ))}
    </div>
  )
}

export default function Convoy() {
  return (
    <div className="relative overflow-hidden border-b border-[#c9bfa9] bg-[#efe8d6] py-6" aria-hidden="true">
      {/* faint wake lines */}
      <div className="pointer-events-none absolute inset-x-0 bottom-3 h-px bg-[#d8cfba]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-5 h-px bg-[#e0d7c2]" />
      <div
        className="flex w-max"
        style={{
          animation: 'sail 46s linear infinite',
          // ships materialise out of the page mist at the edges, as in the reference graphic
          maskImage: 'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to right, transparent 0%, black 14%, black 86%, transparent 100%)',
        }}
      >
        <Strip />
        <Strip />
      </div>
      <style>{`
        @keyframes sail {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes bob {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
        }
        @media (prefers-reduced-motion: reduce) {
          [style*="sail"], [style*="bob"] { animation: none !important; }
        }
      `}</style>
    </div>
  )
}
