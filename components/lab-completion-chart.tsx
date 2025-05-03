"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Chart, registerables } from "chart.js"

Chart.register(...registerables)

interface LabCompletionData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor: string[]
    borderColor: string[]
    borderWidth: number
  }[]
}

export function LabCompletionChart() {
  const doughnutChartRef = useRef<HTMLCanvasElement>(null)
  const barChartRef = useRef<HTMLCanvasElement>(null)

  const doughnutData: LabCompletionData = {
    labels: ["Physics", "Chemistry", "Biology", "Mathematics", "Computer Science"],
    datasets: [
      {
        label: "Labs Completed",
        data: [8, 6, 4, 7, 5],
        backgroundColor: [
          "rgba(129, 140, 248, 0.8)",
          "rgba(249, 115, 22, 0.8)",
          "rgba(16, 185, 129, 0.8)",
          "rgba(236, 72, 153, 0.8)",
          "rgba(124, 58, 237, 0.8)",
        ],
        borderColor: [
          "rgba(129, 140, 248, 1)",
          "rgba(249, 115, 22, 1)",
          "rgba(16, 185, 129, 1)",
          "rgba(236, 72, 153, 1)",
          "rgba(124, 58, 237, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  const barData: LabCompletionData = {
    labels: ["Week 1", "Week 2", "Week 3", "Week 4", "Week 5", "Week 6"],
    datasets: [
      {
        label: "Labs Completed",
        data: [2, 3, 5, 4, 6, 7],
        backgroundColor: [
          "rgba(129, 140, 248, 0.8)",
          "rgba(129, 140, 248, 0.8)",
          "rgba(129, 140, 248, 0.8)",
          "rgba(129, 140, 248, 0.8)",
          "rgba(129, 140, 248, 0.8)",
          "rgba(129, 140, 248, 0.8)",
        ],
        borderColor: [
          "rgba(129, 140, 248, 1)",
          "rgba(129, 140, 248, 1)",
          "rgba(129, 140, 248, 1)",
          "rgba(129, 140, 248, 1)",
          "rgba(129, 140, 248, 1)",
          "rgba(129, 140, 248, 1)",
        ],
        borderWidth: 1,
      },
    ],
  }

  useEffect(() => {
    let doughnutChart: Chart | null = null
    let barChart: Chart | null = null

    if (doughnutChartRef.current) {
      const ctx = doughnutChartRef.current.getContext("2d")
      if (ctx) {
        doughnutChart = new Chart(ctx, {
          type: "doughnut",
          data: doughnutData,
          options: {
            responsive: true,
            plugins: {
              legend: {
                position: "right",
                labels: {
                  color: "rgba(255, 255, 255, 0.8)",
                  font: {
                    family: "Inter, sans-serif",
                    size: 12,
                  },
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
            cutout: "70%",
          },
        })
      }
    }

    if (barChartRef.current) {
      const ctx = barChartRef.current.getContext("2d")
      if (ctx) {
        barChart = new Chart(ctx, {
          type: "bar",
          data: barData,
          options: {
            responsive: true,
            scales: {
              y: {
                beginAtZero: true,
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
                display: false,
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
          },
        })
      }
    }

    return () => {
      doughnutChart?.destroy()
      barChart?.destroy()
    }
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      <Card className="bg-black/40 backdrop-blur-md border-neutral-800 text-white overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Lab Completion Analysis</CardTitle>
          <CardDescription className="text-neutral-400">
            Track your progress across different subjects and time periods
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="by-subject" className="w-full">
            <TabsList className="grid grid-cols-2 mb-4 bg-black/30">
              <TabsTrigger value="by-subject">By Subject</TabsTrigger>
              <TabsTrigger value="by-time">By Time</TabsTrigger>
            </TabsList>
            <TabsContent value="by-subject" className="h-[300px] flex items-center justify-center">
              <canvas ref={doughnutChartRef} />
            </TabsContent>
            <TabsContent value="by-time" className="h-[300px] flex items-center justify-center">
              <canvas ref={barChartRef} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </motion.div>
  )
}
