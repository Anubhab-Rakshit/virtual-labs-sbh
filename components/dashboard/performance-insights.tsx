"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { ChartContainer, ChartLegend, ChartLegendItem } from "@/components/ui/chart"

interface PerformanceInsightsProps {
  performanceData?: { subject: string; score: number }[]
  loading?: boolean
}

export function PerformanceInsights({ performanceData = [], loading = false }: PerformanceInsightsProps) {
  if (loading || !performanceData || performanceData.length === 0) {
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

  // Default data if performanceData is empty
  const chartData =
    performanceData.length > 0
      ? performanceData
      : [
          { subject: "Physics", score: 85 },
          { subject: "Chemistry", score: 72 },
          { subject: "Biology", score: 90 },
          { subject: "Mathematics", score: 78 },
        ]

  // Colors for different subjects
  const getColorForSubject = (subject: string) => {
    const colors: Record<string, string> = {
      Physics: "#4f46e5",
      Chemistry: "#06b6d4",
      Biology: "#10b981",
      Mathematics: "#f59e0b",
      "Computer Science": "#ef4444",
    }
    return colors[subject] || "#4f46e5"
  }

  // Create config for the radar chart
  const config = Object.fromEntries(
    chartData.map((item) => [
      item.subject,
      {
        label: item.subject,
        value: item.score,
        color: getColorForSubject(item.subject),
      },
    ]),
  )

  return (
    <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Performance Insights</CardTitle>
        <CardDescription className="text-white/70">Your performance across different subjects</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px] w-full">
          <ChartContainer
            config={{
              ...config,
            }}
          >
            <svg width="100%" height="100%" viewBox="0 0 400 300">
              {/* Background grid */}
              <circle cx="200" cy="150" r="100" fill="none" stroke="rgba(255,255,255,0.1)" />
              <circle cx="200" cy="150" r="75" fill="none" stroke="rgba(255,255,255,0.1)" />
              <circle cx="200" cy="150" r="50" fill="none" stroke="rgba(255,255,255,0.1)" />
              <circle cx="200" cy="150" r="25" fill="none" stroke="rgba(255,255,255,0.1)" />

              {/* Radar chart */}
              <polygon
                points={chartData
                  .map((item, i) => {
                    const angle = (i / chartData.length) * 2 * Math.PI - Math.PI / 2
                    const distance = (item.score / 100) * 100
                    const x = 200 + distance * Math.cos(angle)
                    const y = 150 + distance * Math.sin(angle)
                    return `${x},${y}`
                  })
                  .join(" ")}
                fill="rgba(79, 70, 229, 0.2)"
                stroke="#4f46e5"
                strokeWidth="2"
              />

              {/* Data points */}
              {chartData.map((item, i) => {
                const angle = (i / chartData.length) * 2 * Math.PI - Math.PI / 2
                const distance = (item.score / 100) * 100
                const x = 200 + distance * Math.cos(angle)
                const y = 150 + distance * Math.sin(angle)
                return (
                  <g key={i}>
                    <circle
                      cx={x}
                      cy={y}
                      r="4"
                      fill="white"
                      stroke={getColorForSubject(item.subject)}
                      strokeWidth="2"
                    />
                    <text
                      x={200 + 120 * Math.cos(angle)}
                      y={150 + 120 * Math.sin(angle)}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fontSize="12"
                      fontWeight="bold"
                      fill="white"
                    >
                      {item.subject}
                    </text>
                    <text x={x} y={y - 10} textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                      {item.score}%
                    </text>
                  </g>
                )
              })}

              {/* Axis lines */}
              {chartData.map((item, i) => {
                const angle = (i / chartData.length) * 2 * Math.PI - Math.PI / 2
                return (
                  <line
                    key={i}
                    x1="200"
                    y1="150"
                    x2={200 + 100 * Math.cos(angle)}
                    y2={150 + 100 * Math.sin(angle)}
                    stroke="rgba(255,255,255,0.2)"
                    strokeDasharray="4"
                  />
                )
              })}
            </svg>
          </ChartContainer>

          <ChartLegend className="mt-4 justify-center">
            {chartData.map((item) => (
              <ChartLegendItem
                key={item.subject}
                color={getColorForSubject(item.subject)}
                label={`${item.subject}: ${item.score}%`}
              />
            ))}
          </ChartLegend>
        </div>
      </CardContent>
    </Card>
  )
}
