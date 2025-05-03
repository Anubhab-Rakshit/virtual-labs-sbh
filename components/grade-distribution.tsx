"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

export function GradeDistribution() {
  const chartRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    let chart: Chart | null = null

    if (chartRef.current) {
      const ctx = chartRef.current.getContext("2d")
      if (ctx) {
        chart = new Chart(ctx, {
          type: "line",
          data: {
            labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
            datasets: [
              {
                label: "Physics",
                data: [85, 88, 92, 90, 94, 96],
                borderColor: "rgba(129, 140, 248, 1)",
                backgroundColor: "rgba(129, 140, 248, 0.1)",
                tension: 0.4,
                fill: true,
              },
              {
                label: "Chemistry",
                data: [78, 82, 80, 85, 88, 90],
                borderColor: "rgba(249, 115, 22, 1)",
                backgroundColor: "rgba(249, 115, 22, 0.1)",
                tension: 0.4,
                fill: true,
              },
              {
                label: "Mathematics",
                data: [90, 88, 92, 95, 93, 97],
                borderColor: "rgba(236, 72, 153, 1)",
                backgroundColor: "rgba(236, 72, 153, 0.1)",
                tension: 0.4,
                fill: true,
              },
            ],
          },
          options: {
            responsive: true,
            scales: {
              y: {
                min: 70,
                max: 100,
                grid: {
                  color: "rgba(255, 255, 255, 0.1)",
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.8)",
                  font: {
                    family: "Inter, sans-serif",
                  },
                },
              },
              x: {
                grid: {
                  display: false,
                },
                ticks: {
                  color: "rgba(255, 255, 255, 0.8)",
                  font: {
                    family: "Inter, sans-serif",
                  },
                },
              },
            },
            plugins: {
              legend: {
                position: "top",
                labels: {
                  color: "rgba(255, 255, 255, 0.8)",
                  font: {
                    family: "Inter, sans-serif",
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
              },
            },
            interaction: {
              mode: "index",
              intersect: false,
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
      transition={{ duration: 0.5, delay: 0.3 }}
    >
      <Card className="bg-black/40 backdrop-blur-md border-neutral-800 text-white overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Grade Progression</CardTitle>
          <CardDescription className="text-neutral-400">Your performance trends across key subjects</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <canvas ref={chartRef} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
