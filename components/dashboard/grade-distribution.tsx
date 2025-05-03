"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface GradeDistributionProps {
  grades?: { grade: string; count: number }[]
  loading?: boolean
}

export function GradeDistribution({ grades = [], loading = false }: GradeDistributionProps) {
  if (loading || !grades || grades.length === 0) {
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

  // Default data if grades is empty
  const gradeData =
    grades.length > 0
      ? grades
      : [
          { grade: "A", count: 12 },
          { grade: "B", count: 8 },
          { grade: "C", count: 5 },
          { grade: "D", count: 2 },
          { grade: "F", count: 1 },
        ]

  // Calculate total for percentage
  const total = gradeData.reduce((sum, grade) => sum + (grade.count || 0), 0) || 1

  const centerX = 150
  const centerY = 150
  const radius = 100
  const colors = ["#4f46e5", "#06b6d4", "#10b981", "#f59e0b", "#ef4444"]

  // Calculate the pie chart segments
  let startAngle = 0
  const segments = gradeData.map((grade, index) => {
    const percentage = (grade.count / total) * 100
    const angle = (percentage / 100) * 2 * Math.PI

    // Calculate the SVG arc path
    const endAngle = startAngle + angle
    const largeArcFlag = angle > Math.PI ? 1 : 0

    const x1 = centerX + radius * Math.cos(startAngle)
    const y1 = centerY + radius * Math.sin(startAngle)
    const x2 = centerX + radius * Math.cos(endAngle)
    const y2 = centerY + radius * Math.sin(endAngle)

    // Calculate the label position (middle of the arc)
    const labelAngle = startAngle + angle / 2
    const labelRadius = radius * 0.7
    const labelX = centerX + labelRadius * Math.cos(labelAngle)
    const labelY = centerY + labelRadius * Math.sin(labelAngle)

    // Calculate the legend position
    const legendX = 300
    const legendY = 80 + index * 30

    const path = `M ${centerX} ${centerY} L ${x1} ${y1} A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2} Z`

    const segment = {
      path,
      color: colors[index % colors.length],
      grade: grade.grade,
      count: grade.count,
      percentage,
      labelX,
      labelY,
      legendX,
      legendY,
    }

    startAngle = endAngle
    return segment
  })

  return (
    <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Grade Distribution</CardTitle>
        <CardDescription className="text-white/70">Distribution of grades across all labs</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] w-full">
          <svg width="100%" height="100%" viewBox="0 0 400 300">
            {/* Pie chart segments */}
            {segments.map((segment, i) => (
              <path key={i} d={segment.path} fill={segment.color} stroke="rgba(0,0,0,0.3)" strokeWidth="1" />
            ))}

            {/* Grade labels inside pie */}
            {segments.map((segment, i) => (
              <text
                key={i}
                x={segment.labelX}
                y={segment.labelY}
                textAnchor="middle"
                fontSize="12"
                fontWeight="bold"
                fill="white"
              >
                {segment.percentage > 5 ? `${segment.grade}` : ""}
              </text>
            ))}

            {/* Legend */}
            {segments.map((segment, i) => (
              <g key={i}>
                <rect x={segment.legendX - 15} y={segment.legendY - 10} width="12" height="12" fill={segment.color} />
                <text x={segment.legendX} y={segment.legendY} fontSize="12" fill="white">
                  {`${segment.grade}: ${segment.count} (${Math.round(segment.percentage)}%)`}
                </text>
              </g>
            ))}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
