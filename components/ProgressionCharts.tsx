'use client'

import { useState, useEffect } from 'react'
import { Track } from "@/types/spotify"

interface Point {
  x: number
  y: number
}

function createSmoothPath(points: Point[]): string {
  if (points.length < 2) return ''

  const path = []
  path.push(`M ${points[0].x} ${points[0].y}`)

  for (let i = 1; i < points.length; i++) {
    const prevPoint = points[i - 1]
    const currentPoint = points[i]
    
    const cp1x = prevPoint.x + (currentPoint.x - prevPoint.x) / 3
    const cp1y = prevPoint.y
    const cp2x = prevPoint.x + 2 * (currentPoint.x - prevPoint.x) / 3
    const cp2y = currentPoint.y
    
    path.push(`C ${cp1x} ${cp1y}, ${cp2x} ${cp2y}, ${currentPoint.x} ${currentPoint.y}`)
  }

  return path.join(' ')
}

interface ChartProps {
  data: number[]
  min: number
  max: number
  label: string
  color?: string
  gradientId?: string
}

function Chart({ data, min, max, label, color = "hsl(var(--primary))", gradientId }: ChartProps) {
  const width = 400
  const height = 200
  const padding = 40
  const chartWidth = width - padding * 2
  const chartHeight = height - padding * 2

  const points: Point[] = data.map((value, index) => ({
    x: padding + (index / (data.length - 1)) * chartWidth,
    y: padding + chartHeight - ((value - min) / (max - min)) * chartHeight
  }))

  const path = createSmoothPath(points)

  return (
    <div className="relative">
      <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <defs>
          {gradientId && (
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.15" />
              <stop offset="100%" stopColor={color} stopOpacity="0.02" />
            </linearGradient>
          )}
        </defs>

        {[0, 0.25, 0.5, 0.75, 1].map((tick) => {
          const y = padding + chartHeight * (1 - tick)
          return (
            <g key={tick}>
              <line
                x1={padding}
                y1={y}
                x2={width - padding}
                y2={y}
                stroke="hsl(var(--muted-foreground) / 0.1)"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
              <text
                x={padding - 8}
                y={y}
                textAnchor="end"
                dominantBaseline="middle"
                className="text-[10px] fill-muted-foreground/50"
              >
                {Math.round(min + (max - min) * tick)}
              </text>
            </g>
          )
        })}

        {data.map((_, index) => (
          <text
            key={index}
            x={padding + (index / (data.length - 1)) * chartWidth}
            y={height - padding + 16}
            textAnchor="middle"
            className="text-[10px] fill-muted-foreground/50"
          >
            {index + 1}
          </text>
        ))}

        <path
          d={path}
          fill={gradientId ? `url(#${gradientId})` : 'none'}
          stroke={color}
          strokeWidth="2"
          className="transition-all duration-500"
        />

        {points.map((point, index) => (
          <circle
            key={index}
            cx={point.x}
            cy={point.y}
            r="2.5"
            fill="hsl(var(--background))"
            stroke={color}
            strokeWidth="1.5"
            className="transition-all duration-500"
          />
        ))}
      </svg>
      <div className="absolute top-2 left-4 text-sm font-medium text-foreground/80">{label}</div>
    </div>
  )
}

interface ProgressionChartsProps {
  tracks: Track[]
  visible: boolean
}

export function ProgressionCharts({ tracks, visible }: ProgressionChartsProps) {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 640)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const bpmData = tracks.map(track => track.audioFeatures?.tempo || 0)
  const energyData = tracks.map(track => 
    track.audioFeatures?.energy ? Math.round(track.audioFeatures.energy * 100) : 0
  )

  const minBpm = Math.floor(Math.min(...bpmData) - 5)
  const maxBpm = Math.ceil(Math.max(...bpmData) + 5)

  if (!tracks.length || !visible) return null

  return (
    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-6 transition-all duration-300`}>
      <div className="bg-muted/10 rounded-lg p-3 sm:p-4">
        <Chart
          data={energyData}
          min={0}
          max={100}
          label="Energy Progression"
          color="hsl(var(--primary))"
          gradientId="energy-gradient"
        />
      </div>

      <div className="bg-muted/10 rounded-lg p-3 sm:p-4">
        <Chart
          data={bpmData}
          min={minBpm}
          max={maxBpm}
          label="BPM Progression"
          color="hsl(var(--primary))"
          gradientId="bpm-gradient"
        />
      </div>
    </div>
  )
}