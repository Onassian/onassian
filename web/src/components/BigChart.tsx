import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'
import type { IndexSeries } from '@/data/edition'

export default function BigChart({ series, accent }: { series: IndexSeries; accent: string }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ref.current) return
    const chart = echarts.init(ref.current, null, { renderer: 'canvas' })
    chart.setOption({
      animation: false,
      grid: { left: 52, right: 16, top: 28, bottom: 26 },
      tooltip: {
        trigger: 'axis',
        backgroundColor: '#241f17',
        borderWidth: 0,
        textStyle: { color: '#f2ecdf', fontFamily: 'ui-monospace, monospace', fontSize: 12 },
        formatter: (ps: { dataIndex: number }[]) => {
          const p = ps[0]
          const d = series.points[p.dataIndex]
          return `${d.d}<br/><b>${d.v.toLocaleString()} ${series.unit}</b>`
        },
      },
      xAxis: {
        type: 'category',
        data: series.points.map((p) => p.d),
        axisLine: { lineStyle: { color: '#c9bfa9' } },
        axisTick: { show: false },
        axisLabel: {
          color: '#7a7263',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 10,
          interval: 11,
        },
      },
      yAxis: {
        type: 'value',
        scale: true,
        splitLine: { lineStyle: { color: '#e5ddca', type: 'dashed' } },
        axisLabel: {
          color: '#7a7263',
          fontFamily: 'ui-monospace, monospace',
          fontSize: 10,
          formatter: (v: number) => v.toLocaleString(),
        },
      },
      series: [
        {
          type: 'line',
          data: series.points.map((p) => p.v),
          showSymbol: false,
          smooth: 0.15,
          lineStyle: { color: accent, width: 2.2 },
          areaStyle: {
            color: {
              type: 'linear', x: 0, y: 0, x2: 0, y2: 1,
              colorStops: [
                { offset: 0, color: accent + '2e' },
                { offset: 1, color: accent + '05' },
              ],
            },
          },
          markLine: {
            silent: true,
            symbol: 'none',
            data: [{ type: 'average', name: 'avg' }],
            lineStyle: { color: '#a89e87', type: 'dotted' },
            label: {
              color: '#7a7263',
              fontFamily: 'ui-monospace, monospace',
              fontSize: 10,
              position: 'insideEndTop',
              formatter: '12-mo avg',
            },
          },
        },
      ],
    })
    const onResize = () => chart.resize()
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      chart.dispose()
    }
  }, [series, accent])

  return <div ref={ref} className="w-full" style={{ height: 280 }} />
}
