// Pixel-art vessel silhouettes, drawn as crisp SVG rects — the sample site's motif.
interface Props { kind: 'vlcc' | 'container' | 'bulk' | 'lng'; className?: string }

const palettes: Record<Props['kind'], { hull: string; deck: string; cargo: string[] }> = {
  vlcc: { hull: '#1f3a5f', deck: '#14263f', cargo: ['#c8bfa8', '#b8ae94'] },
  container: { hull: '#14263f', deck: '#0e1c30', cargo: ['#b03a2e', '#1f3a5f', '#2e6e5e', '#c8842e'] },
  bulk: { hull: '#3a2e22', deck: '#2a211a', cargo: ['#8a6d3b', '#6f5630', '#a5854f'] },
  lng: { hull: '#1f4f44', deck: '#153a33', cargo: ['#d8e4e0', '#c2d4cf', '#e6efec'] },
}

export default function PixelShip({ kind, className }: Props) {
  const p = palettes[kind]
  // 1 unit = 4px grid, ship is 26 wide x 11 tall
  const px = (x: number, y: number, w: number, h: number, fill: string, key: string) => (
    <rect key={key} x={x * 4} y={y * 4} width={w * 4} height={h * 4} fill={fill} shapeRendering="crispEdges" />
  )
  const blocks = []
  // hull
  blocks.push(px(2, 8, 20, 2, p.hull, 'hull'))
  blocks.push(px(3, 10, 17, 1, p.hull, 'hull2'))
  blocks.push(px(1, 8, 1, 1, p.hull, 'bow'))
  blocks.push(px(22, 8, 2, 1, p.hull, 'stern'))
  // deck line
  blocks.push(px(2, 7, 20, 1, p.deck, 'deck'))
  // superstructure (white bridge block, aft)
  blocks.push(px(19, 5, 3, 2, '#e8e2d4', 'bridge'))
  blocks.push(px(20, 4, 1, 1, '#d9d2c0', 'mast'))
  blocks.push(px(20, 3, 1, 1, '#b03a2e', 'beacon'))
  if (kind === 'container') {
    // stacked colorful boxes
    const cols = 15
    for (let i = 0; i < cols; i++) {
      const x = 3 + i
      const stack = (i * 7 + 3) % 3
      for (let s = 0; s <= stack; s++) {
        blocks.push(px(x, 6 - s, 1, 1, p.cargo[(i + s) % p.cargo.length], `c${i}-${s}`))
      }
    }
  } else if (kind === 'lng') {
    blocks.push(px(3, 3, 15, 4, p.cargo[0], 'tank'))
    blocks.push(px(4, 2, 13, 1, p.cargo[1], 'tanktop'))
    blocks.push(px(5, 4, 13, 1, p.cargo[2], 'tanksheen'))
  } else if (kind === 'vlcc') {
    blocks.push(px(3, 6, 15, 1, p.cargo[0], 'deckhouse1'))
    blocks.push(px(4, 5, 12, 1, p.cargo[1], 'piping'))
    blocks.push(px(6, 4, 3, 1, '#5c5546', 'funnel'))
    blocks.push(px(12, 4, 3, 1, '#5c5546', 'funnel2'))
  } else {
    // bulk: hatch coamings
    blocks.push(px(3, 5, 4, 2, p.cargo[0], 'h1'))
    blocks.push(px(8, 5, 4, 2, p.cargo[1], 'h2'))
    blocks.push(px(13, 5, 4, 2, p.cargo[2], 'h3'))
  }
  return (
    <svg viewBox="0 0 104 44" className={className} aria-hidden="true" style={{ imageRendering: 'pixelated' }}>
      {blocks}
    </svg>
  )
}
