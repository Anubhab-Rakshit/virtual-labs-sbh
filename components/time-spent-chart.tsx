"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function TimeSpentChart() {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let chart: Chart | null = null

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        chart = new Chart(ctx, {
          type: "polarArea",
          data: {
            labels: ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Science"],
            datasets: [
              {
                label: "Hours Spent",
                data: [12, 8, 6, 10, 14],
                backgroundColor: [
                  "rgba(129, 140, 248, 0.7)",
                  "rgba(249, 115, 22, 0.7)",
                  "rgba(16, 185, 129, 0.7)",
                  "rgba(236, 72, 153, 0.7)",
                  "rgba(124, 58, 237, 0.7)",
                ],
                borderWidth: 1,
                borderColor: [
                  "rgba(129, 140, 248, 1)",
                  "rgba(249, 115, 22, 1)",
                  "rgba(16, 185, 129, 1)",
                  "rgba(236, 72, 153, 1)",
                  "rgba(124, 58, 237, 1)",
                ],
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              r: {
                ticks: {
                  color: "rgba(255, 255, 255, 0.7)",
                  backdropColor: "transparent",
                  font: {
                    family: "Inter, sans-serif",
                    size: 10,
                  },
                },
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                },
                angleLines: {
                  color: "rgba(255, 255, 255, 0.2)",
                },
                pointLabels: {
                  color: "rgba(255, 255, 255, 0.8)",
                  font: {
                    family: "Inter, sans-serif",
                    size: 12,
                  },
                },
              },
            },
            plugins: {
              legend: {
                position: "right",
                labels: {
                  color: "rgba(255, 255, 255, 0.8)",
                  font: {
                    family: "Inter, sans-serif",
                    size: 12,
                  },
                  usePointStyle: true,
                  pointStyle: "circle",
                },
              },
              tooltip: {
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                titleFont: {
                  family: "Inter, sans-serif",
                  size: 14,
                },
                bodyFont: {
                  family: "Inter, sans-serif",
                  size: 13,
                },
                callbacks: {
                  label: (context) => `${context.label}: ${context.raw} hours`,
                },
              },
            },
          },
        })
      }
    }

    return () => {
      chart?.destroy()
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.4 }}
    >
      <Card className="bg-black/40 backdrop-blur-md border-neutral-800 text-white overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Time Distribution</CardTitle>
          <CardDescription className="text-neutral-400">Hours spent on each subject area</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <canvas ref={chartRef} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
