"use client"

import type * as React from "react"
import { cn } from "@/lib/utils"

interface ChartContainerProps {
  children: React.ReactNode
  config: Record<string, { label: string; color: string }>
  className?: string
}

export function ChartContainer({ children, config, className }: ChartContainerProps) {
  return (
    <div className={cn("relative", className)} style={{ "--chart-config": JSON.stringify(config) }}>
      {children}
    </div>
  )
}

interface ChartTooltipProps {
  children?: React.ReactNode
  active?: boolean
  payload?: any[]
}

export function ChartTooltip({ active, payload }: ChartTooltipProps) {
  if (active && payload && payload.length > 0) {
    return (
      <div className="bg-black/80 backdrop-blur-sm border border-white/10 rounded-md p-2">
        {payload.map((item, index) => (
          <ChartTooltipContent key={index} label={item.name} value={item.value} color={item.color} />
        ))}
      </div>
    )
  }

  return null
}

interface ChartTooltipContentProps {
  label: string
  value: any
  color: string
}

export function ChartTooltipContent({ label, value, color }: ChartTooltipContentProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm text-white">{label}:</span>
      <span className="text-sm font-medium text-white">{value}</span>
    </div>
  )
}

interface ChartLegendProps {
  children: React.ReactNode
  className?: string
}

export function ChartLegend({ children, className }: ChartLegendProps) {
  return <div className={cn("flex items-center gap-4", className)}>{children}</div>
}

interface ChartLegendItemProps {
  label: string
  color: string
}

export function ChartLegendItem({ label, color }: ChartLegendItemProps) {
  return (
    <div className="flex items-center gap-2">
      <span className="w-3 h-3 rounded-full" style={{ backgroundColor: color }} />
      <span className="text-sm text-white/80">{label}</span>
    </div>
  )
}
