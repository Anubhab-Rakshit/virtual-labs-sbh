"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, useAnimation, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface DataPoint {
  x: number
  y: number
  label?: string
}

interface InteractiveGraphProps {
  data: DataPoint[]
  width?: number
  height?: number
  lineColor?: string
  pointColor?: string
  gridColor?: string
  backgroundColor?: string
  showGrid?: boolean
  showPoints?: boolean
  showLabels?: boolean
  showAxes?: boolean
  animated?: boolean
  className?: string
  title?: string
  xLabel?: string
  yLabel?: string
  interactive?: boolean
}

export function InteractiveGraph({
  data,
  width = 800,
  height = 400,
  lineColor = "#ffffff",
  pointColor = "#ffffff",
  gridColor = "rgba(255, 255, 255, 0.1)",
  backgroundColor = "rgba(0, 0, 0, 0.2)",
  showGrid = true,
  showPoints = true,
  showLabels = true,
  showAxes = true,
  animated = true,
  className,
  title,
  xLabel,
  yLabel,
  interactive = true,
}: InteractiveGraphProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })
  const controls = useAnimation()
  const [activePoint, setActivePoint] = useState<number | null>(null)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })

  // Find min and max values for scaling
  const minX = Math.min(...data.map((d) => d.x))
  const maxX = Math.max(...data.map((d) => d.x))
  const minY = Math.min(...data.map((d) => d.y))
  const maxY = Math.max(...data.map((d) => d.y))

  // Scale data points to fit the graph
  const scaleX = (x: number) => ((x - minX) / (maxX - minX)) * (width - 60) + 30
  const scaleY = (y: number) => height - ((y - minY) / (maxY - minY)) * (height - 60) - 30

  // Generate path data
  const pathData = data.map((point, i) => `${i === 0 ? "M" : "L"} ${scaleX(point.x)} ${scaleY(point.y)}`).join(" ")

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !svgRef.current) return

    const rect = svgRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })

    // Find closest point
    let closestPoint = null
    let closestDistance = Number.POSITIVE_INFINITY

    data.forEach((point, index) => {
      const pointX = scaleX(point.x)
      const pointY = scaleY(point.y)
      const distance = Math.sqrt(Math.pow(pointX - mousePosition.x, 2) + Math.pow(pointY - mousePosition.y, 2))

      if (distance < closestDistance && distance < 50) {
        closestDistance = distance
        closestPoint = index
      }
    })

    setActivePoint(closestPoint)
  }

  // Animate when in view
  useEffect(() => {
    if (isInView && animated) {
      controls.start("visible")
    } else if (!isInView && animated) {
      controls.start("hidden")
    }
  }, [isInView, controls, animated])

  return (
    <div
      ref={containerRef}
      className={cn("relative overflow-hidden rounded-lg", className)}
      style={{ width, height, backgroundColor }}
    >
      {title && <div className="absolute top-4 left-4 text-white text-lg font-light z-10">{title}</div>}

      <svg
        ref={svgRef}
        width={width}
        height={height}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActivePoint(null)}
        className="overflow-visible"
      >
        {/* Grid */}
        {showGrid && (
          <g>
            {/* Horizontal grid lines */}
            {Array.from({ length: 10 }).map((_, i) => (
              <line
                key={`h-${i}`}
                x1={0}
                y1={i * (height / 10)}
                x2={width}
                y2={i * (height / 10)}
                stroke={gridColor}
                strokeWidth={1}
              />
            ))}

            {/* Vertical grid lines */}
            {Array.from({ length: 20 }).map((_, i) => (
              <line
                key={`v-${i}`}
                x1={i * (width / 20)}
                y1={0}
                x2={i * (width / 20)}
                y2={height}
                stroke={gridColor}
                strokeWidth={1}
              />
            ))}
          </g>
        )}

        {/* Axes */}
        {showAxes && (
          <g>
            {/* X-axis */}
            <line x1={30} y1={height - 30} x2={width - 30} y2={height - 30} stroke="#ffffff" strokeWidth={2} />

            {/* Y-axis */}
            <line x1={30} y1={30} x2={30} y2={height - 30} stroke="#ffffff" strokeWidth={2} />

            {/* X-axis label */}
            {xLabel && (
              <text x={width / 2} y={height - 5} textAnchor="middle" fill="#ffffff" fontSize={12}>
                {xLabel}
              </text>
            )}

            {/* Y-axis label */}
            {yLabel && (
              <text
                x={10}
                y={height / 2}
                textAnchor="middle"
                fill="#ffffff"
                fontSize={12}
                transform={`rotate(-90, 10, ${height / 2})`}
              >
                {yLabel}
              </text>
            )}
          </g>
        )}

        {/* Line */}
        <motion.path
          d={pathData}
          fill="none"
          stroke={lineColor}
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={animated ? { pathLength: 0 } : { pathLength: 1 }}
          animate={controls}
          variants={{
            hidden: { pathLength: 0 },
            visible: {
              pathLength: 1,
              transition: { duration: 2, ease: "easeInOut" },
            },
          }}
        />

        {/* Points */}
        {showPoints &&
          data.map((point, i) => (
            <motion.g
              key={i}
              initial={animated ? { opacity: 0, scale: 0 } : { opacity: 1, scale: 1 }}
              animate={controls}
              variants={{
                hidden: { opacity: 0, scale: 0 },
                visible: {
                  opacity: 1,
                  scale: 1,
                  transition: {
                    delay: animated ? 1 + i * 0.1 : 0,
                    duration: 0.5,
                  },
                },
              }}
            >
              <circle
                cx={scaleX(point.x)}
                cy={scaleY(point.y)}
                r={activePoint === i ? 8 : 4}
                fill={pointColor}
                className="transition-all duration-300"
              />

              {showLabels && (point.label || activePoint === i) && (
                <g
                  className={activePoint === i ? "opacity-100" : "opacity-0 group-hover:opacity-100 transition-opacity"}
                >
                  <rect
                    x={scaleX(point.x) - 40}
                    y={scaleY(point.y) - 40}
                    width={80}
                    height={30}
                    rx={4}
                    fill="rgba(0, 0, 0, 0.8)"
                    className="transition-all duration-300"
                  />
                  <text
                    x={scaleX(point.x)}
                    y={scaleY(point.y) - 20}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize={12}
                    className="transition-all duration-300"
                  >
                    {point.label || `(${point.x}, ${point.y})`}
                  </text>
                </g>
              )}
            </motion.g>
          ))}
      </svg>
    </div>
  )
}
