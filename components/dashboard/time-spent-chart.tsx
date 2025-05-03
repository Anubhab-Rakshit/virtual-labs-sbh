"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface TimeSpentChartProps {
  timeSpentData?: { week: string; hours: number }[]
  loading?: boolean
}

export function TimeSpentChart({ timeSpentData = [], loading = false }: TimeSpentChartProps) {
  if (loading || !timeSpentData || timeSpentData.length === 0) {
    return (
      <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Time Spent</CardTitle>
          <CardDescription className="text-white/70">Hours spent on labs per week</CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full rounded-md bg-white/5" />
        </CardContent>
      </Card>
    )
  }

  // Use default data if timeSpentData is empty
  const chartData =
    timeSpentData.length > 0
      ? timeSpentData
      : [
          { week: "Week 1", hours: 5 },
          { week: "Week 2", hours: 7 },
          { week: "Week 3", hours: 3 },
          { week: "Week 4", hours: 8 },
        ]

  const maxValue = Math.max(...chartData.map((item) => item.hours || 0))
  const chartHeight = 200
  const chartWidth = 500
  const paddingX = 40
  const paddingY = 20

  // Calculate the width of each point
  const pointWidth = (chartWidth - paddingX * 2) / Math.max(1, chartData.length - 1)

  // Generate points for the line chart with safety checks
  const points = chartData.map((item, i) => {
    const x = paddingX + i * pointWidth
    // Ensure we don't divide by zero and handle NaN
    const normalizedValue = maxValue > 0 ? (item.hours || 0) / maxValue : 0
    const y = chartHeight - paddingY - normalizedValue * (chartHeight - paddingY * 2)

    // Ensure all values are valid numbers
    return {
      x: isNaN(x) ? paddingX : x,
      y: isNaN(y) ? chartHeight - paddingY : y,
      value: item.hours || 0,
      label: item.week || `Week ${i + 1}`,
    }
  })

  // Generate the SVG path for the line with safety checks
  const linePath =
    points.length > 0
      ? points
          .map((point, i) => {
            return i === 0 ? `M ${point.x} ${point.y}` : `L ${point.x} ${point.y}`
          })
          .join(" ")
      : ""

  // Generate the SVG path for the area under the line
  const areaPath =
    points.length > 0
      ? `${linePath} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`
      : ""

  return (
    <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Time Spent</CardTitle>
        <CardDescription className="text-white/70">Hours spent on labs per week</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] w-full">
          <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight}`}>
            {/* Y-axis grid lines */}
            {[0, 1, 2, 3, 4].map((i) => {
              const y = chartHeight - paddingY - (i * (chartHeight - paddingY * 2)) / 4
              return (
                <g key={i}>
                  <line
                    x1={paddingX}
                    y1={y}
                    x2={chartWidth - paddingX}
                    y2={y}
                    stroke="rgba(255, 255, 255, 0.1)"
                    strokeWidth="1"
                    strokeDasharray={i === 0 ? "none" : "4"}
                  />
                  <text x={paddingX - 10} y={y + 5} textAnchor="end" fontSize="10" fill="rgba(255, 255, 255, 0.6)">
                    {Math.round((i * maxValue) / 4)}
                  </text>
                </g>
              )
            })}

            {/* X-axis */}
            <line
              x1={paddingX}
              y1={chartHeight - paddingY}
              x2={chartWidth - paddingX}
              y2={chartHeight - paddingY}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="1"
            />

            {/* X-axis labels */}
            {points.map((point, i) => (
              <text
                key={i}
                x={point.x.toString()}
                y={(chartHeight - 5).toString()}
                textAnchor="middle"
                fontSize="10"
                fill="rgba(255, 255, 255, 0.6)"
              >
                {point.label}
              </text>
            ))}

            {/* Area under the line */}
            {areaPath && <path d={areaPath} fill="url(#areaGradient)" opacity="0.3" />}

            {/* Line */}
            {linePath && (
              <path
                d={linePath}
                fill="none"
                stroke="#4f46e5"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            )}

            {/* Data points */}
            {points.map((point, i) => (
              <g key={i}>
                <circle
                  cx={point.x.toString()}
                  cy={point.y.toString()}
                  r="5"
                  fill="#4f46e5"
                  stroke="white"
                  strokeWidth="2"
                />
                <text
                  x={point.x.toString()}
                  y={(point.y - 10).toString()}
                  textAnchor="middle"
                  fontSize="10"
                  fontWeight="bold"
                  fill="white"
                >
                  {`${point.value}h`}
                </text>
              </g>
            ))}

            {/* Gradient for area */}
            <defs>
              <linearGradient id="areaGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.8" />
                <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
