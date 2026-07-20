import { Svg, Path, Circle, Rect } from '@react-pdf/renderer'
import { ServiceName } from '@/lib/recommendedServices'

// Raw icon node data copied from lucide-react (v0.575.0) for the 5 icons used on the
// marketing Services section, so the proposal PDF stays visually consistent with the
// website. lucide-react's icon components render to the DOM and can't be reused
// directly inside @react-pdf/renderer, which needs its own Svg/Path/Circle primitives.
type IconNode = readonly (readonly [string, Record<string, string>])[]

const ICON_NODES: Record<ServiceName, IconNode> = {
  'Process Redesign & Optimisation': [
    ['circle', { cx: '6', cy: '19', r: '3' }],
    ['path', { d: 'M9 19h8.5a3.5 3.5 0 0 0 0-7h-11a3.5 3.5 0 0 1 0-7H15' }],
    ['circle', { cx: '18', cy: '5', r: '3' }],
  ],
  '"Quick-Win" Automations': [
    [
      'path',
      {
        d: 'M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z',
      },
    ],
  ],
  'AI Knowledge Systems': [
    ['path', { d: 'M12 18V5' }],
    ['path', { d: 'M15 13a4.17 4.17 0 0 1-3-4 4.17 4.17 0 0 1-3 4' }],
    ['path', { d: 'M17.598 6.5A3 3 0 1 0 12 5a3 3 0 1 0-5.598 1.5' }],
    ['path', { d: 'M17.997 5.125a4 4 0 0 1 2.526 5.77' }],
    ['path', { d: 'M18 18a4 4 0 0 0 2-7.464' }],
    ['path', { d: 'M19.967 17.483A4 4 0 1 1 12 18a4 4 0 1 1-7.967-.517' }],
    ['path', { d: 'M6 18a4 4 0 0 1-2-7.464' }],
    ['path', { d: 'M6.003 5.125a4 4 0 0 0-2.526 5.77' }],
  ],
  'Custom Workflows & AI Skills': [
    ['rect', { width: '8', height: '8', x: '3', y: '3', rx: '2' }],
    ['path', { d: 'M7 11v4a2 2 0 0 0 2 2h4' }],
    ['rect', { width: '8', height: '8', x: '13', y: '13', rx: '2' }],
  ],
  'Full Ecosystem Sync': [
    ['path', { d: 'M6.3 20.3a2.4 2.4 0 0 0 3.4 0L12 18l-6-6-2.3 2.3a2.4 2.4 0 0 0 0 3.4Z' }],
    ['path', { d: 'm2 22 3-3' }],
    ['path', { d: 'M7.5 13.5 10 11' }],
    ['path', { d: 'M10.5 16.5 13 14' }],
    ['path', { d: 'm18 3-4 4h6l-4 4' }],
  ],
}

export function ServiceIcon({
  service,
  size = 18,
  color = '#00c8ff',
}: {
  service: ServiceName
  size?: number
  color?: string
}) {
  return (
    <Svg viewBox="0 0 24 24" width={size} height={size}>
      {ICON_NODES[service].map(([tag, attrs], i) => {
        const common = {
          fill: 'none',
          stroke: color,
          strokeWidth: 2,
          strokeLinecap: 'round' as const,
          strokeLinejoin: 'round' as const,
        }
        if (tag === 'circle') {
          return (
            <Circle
              key={i}
              cx={Number(attrs.cx)}
              cy={Number(attrs.cy)}
              r={Number(attrs.r)}
              {...common}
            />
          )
        }
        if (tag === 'rect') {
          return (
            <Rect
              key={i}
              x={Number(attrs.x)}
              y={Number(attrs.y)}
              width={Number(attrs.width)}
              height={Number(attrs.height)}
              rx={Number(attrs.rx)}
              {...common}
            />
          )
        }
        return <Path key={i} d={attrs.d} {...common} />
      })}
    </Svg>
  )
}
