"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

interface SkillRadarProps {
  skills: { name: string; value: number }[]
  loading?: boolean
}

export function SkillRadar({ skills, loading = false }: SkillRadarProps) {
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

  const maxValue = Math.max(...skills.map((skill) => skill.value))
  const centerX = 150
  const centerY = 150
  const radius = 120
  const angleStep = (2 * Math.PI) / skills.length

  // Calculate points for the radar chart
  const skillPoints = skills.map((skill, i) => {
    const angle = i * angleStep - Math.PI / 2 // Start from the top
    const distance = (skill.value / maxValue) * radius
    const x = centerX + distance * Math.cos(angle)
    const y = centerY + distance * Math.sin(angle)
    return { x, y, skill }
  })

  // Create the polygon points string
  const polygonPoints = skillPoints.map(({ x, y }) => `${x},${y}`).join(" ")

  // Create the axis lines
  const axisLines = skills.map((_, i) => {
    const angle = i * angleStep - Math.PI / 2
    const x = centerX + radius * Math.cos(angle)
    const y = centerY + radius * Math.sin(angle)
    return { x1: centerX, y1: centerY, x2: x, y2: y }
  })

  return (
    <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Skill Radar</CardTitle>
        <CardDescription className="text-white/70">Your proficiency across different skills</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative h-[300px] w-full">
          <svg width="100%" height="100%" viewBox="0 0 300 300">
            {/* Background circles */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.75}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.5}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r={radius * 0.25}
              fill="none"
              stroke="rgba(255, 255, 255, 0.1)"
              strokeWidth="1"
            />

            {/* Axis lines */}
            {axisLines.map((line, i) => (
              <line
                key={i}
                x1={line.x1}
                y1={line.y1}
                x2={line.x2}
                y2={line.y2}
                stroke="rgba(255, 255, 255, 0.2)"
                strokeWidth="1"
              />
            ))}

            {/* Skill polygon */}
            <polygon
              points={polygonPoints}
              fill="rgba(79, 70, 229, 0.2)"
              stroke="rgba(79, 70, 229, 0.8)"
              strokeWidth="2"
            />

            {/* Skill points */}
            {skillPoints.map(({ x, y, skill }, i) => (
              <circle key={i} cx={x} cy={y} r="4" fill="#4f46e5" stroke="white" strokeWidth="1" />
            ))}

            {/* Skill labels */}
            {skillPoints.map(({ x, y, skill }, i) => {
              const angle = i * angleStep - Math.PI / 2
              const labelDistance = radius + 20
              const labelX = centerX + labelDistance * Math.cos(angle)
              const labelY = centerY + labelDistance * Math.sin(angle)
              const textAnchor =
                angle > Math.PI / 4 && angle < (7 * Math.PI) / 4
                  ? "start"
                  : angle < -Math.PI / 4 && angle > (-7 * Math.PI) / 4
                    ? "end"
                    : "middle"
              const dy = angle > 0 && angle < Math.PI ? "0.8em" : angle < 0 && angle > -Math.PI ? "-0.5em" : "0.35em"

              return (
                <text key={i} x={labelX} y={labelY} textAnchor={textAnchor} dy={dy} fontSize="10" fill="white">
                  {skill.name} ({skill.value}%)
                </text>
              )
            })}
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
