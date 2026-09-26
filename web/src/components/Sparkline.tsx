interface Props { data: number[]; color: string; up: boolean; w?: number; h?: number }

export default function Sparkline({ data, up, w = 180, h = 44 }: Props) {
  const min = Math.min(...data)
  const max = Math.max(...data)
  const span = max - min || 1
  const step = w / (data.length - 1)
  const pts = data.map((v, i) => `${(i * step).toFixed(1)},${(h - 4 - ((v - min) / span) * (h - 8)).toFixed(1)}`)
  const stroke = up ? '#2e6e5e' : '#b03a2e'
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ height: h }} aria-hidden="true">
      <polyline points={pts.join(' ')} fill="none" stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      <circle cx={w} cy={pts[pts.length - 1].split(',')[1]} r="2.6" fill={stroke} />
    </svg>
  )
}
