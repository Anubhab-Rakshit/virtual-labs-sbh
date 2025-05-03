"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface LabCompletionChartProps {
  labCompletionData: { month: string; completed: number }[]
  loading?: boolean
}

export function LabCompletionChart({ labCompletionData, loading = false }: LabCompletionChartProps) {
  if (loading) {
    return (
      <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-white/5" />
          <Skeleton className="h-4 w-60 bg-white/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-md bg-white/5" />
        </CardContent>
      </Card>
    )
  }

  const maxValue = Math.max(...labCompletionData.map((item) => item.completed))
  const chartHeight = 200
  const barWidth = 40
  const barGap = 20
  const chartWidth = labCompletionData.length * (barWidth + barGap) - barGap

  return (
    <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Lab Completion</CardTitle>
        <CardDescription className="text-white/70">Number of labs completed per month</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] w-full">
          <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight + 50}`}>
            {/* X-axis */}
            <line
              x1="0"
              y1={chartHeight}
              x2={chartWidth}
              y2={chartHeight}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
            />

            {/* Y-axis grid lines */}
            {[0, 1, 2, 3, 4].map((i) => {
              const y = chartHeight - (i * chartHeight) / 4
              return (
                <g key={i}>
                  <line
                    x1="0"
                    y1={y}
                    x2={chartWidth}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                    strokeDasharray={i === 0 ? "none" : "4"}
                  />
                  <text x="-10" y={y + 5} textAnchor="end" fontSize="10" fill="rgba(255, 255, 255, 0.6)">
                    {Math.round((i * maxValue) / 4)}
                  </text>
                </g>
              )
            })}

            {/* Bars */}
            {labCompletionData.map((item, i) => {
              const barHeight = (item.completed / maxValue) * chartHeight
              const x = i * (barWidth + barGap)
              const y = chartHeight - barHeight

              return (
                <g key={i}>
                  <rect x={x} y={y} width={barWidth} height={barHeight} rx="4" fill="url(#barGradient)" opacity="0.8" />
                  <text x={x + barWidth / 2} y={chartHeight + 20} textAnchor="middle" fontSize="12" fill="white">
                    {item.month}
                  </text>
                  <text
                    x={x + barWidth / 2}
                    y={y - 10}
                    textAnchor="middle"
                    fontSize="12"
                    fill="white"
                    opacity={item.completed > 0 ? 1 : 0}
                  >
                    {item.completed}
                  </text>
                </g>
              )
            })}

            {/* Gradient for bars */}
            <defs>
              <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" />
                <stop offset="100%" stopColor="#7c3aed" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
