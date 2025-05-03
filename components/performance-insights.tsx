"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { XAxis, YAxis, CartesianGrid, ResponsiveContainer, Bar, BarChart, PieChart, Pie, Cell } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

interface PerformanceInsightsProps {
  performanceData: {
    subject: string
    score: number
    color: string
  }[]
  subjectPerformance: {
    subject: string
    data: {
      quiz: string
      score: number
    }[]
  }[]
  timeSpent: {
    subject: string
    minutes: number
    color: string
  }[]
  loading: boolean
}

export function PerformanceInsights({ 
  performanceData, 
  subjectPerformance,
  timeSpent,
  loading 
}: PerformanceInsightsProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-white mb-2">Performance Insights</h2>
        <p className="text-white/70">Analyze your learning patterns and identify areas for improvement.</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Subject Performance</CardTitle>
              <CardDescription className="text-white/70">Average scores by subject</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {loading ? (
                <Skeleton className="h-[300px] w-full bg-white/10" />
              ) : (
                <ChartContainer
                  config={
                    Object.fromEntries(
                      performanceData.map(item => [
                        item.subject,
                        {
                          label: item.subject,
                          color: item.color,
                        }
                      ])
                    )
                  }
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={performanceData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                      <XAxis 
                        dataKey="subject" 
                        stroke="rgba(255,255,255,0.5)" 
                        tick={{ fill: "rgba(255,255,255,0.5)" }}
                        tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
                      />
                      <YAxis 
                        stroke="rgba(255,255,255,0.5)" 
                        tick={{ fill: "rgba(255,255,255,0.5)" }}
                        tickLine={{ stroke: "rgba(255,255,255,0.2)" }}
                        domain={[0, 100]}
                      />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Bar dataKey="score" fill="#8884d8">
                        {performanceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
        >
          <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Time Distribution</CardTitle>
              <CardDescription className="text-white/70">Minutes spent by subject</CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              {loading ? (
                <Skeleton className="h-[300px] w-full bg-white/10" />
              ) : (
                <ChartContainer
                  config={
                    Object.fromEntries(
                      timeSpent.map(item => [
                        item.subject,
                        {
                          label: item.subject,
                          color: item.color,
                        }
                      ])
                    )
                  }
                  className="h-[300px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={timeSpent}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="minutes"
                        label={({ subject, minutes, percent }) => `${subject}: ${minutes}m (${(percent * 100).toFixed(0)}%)`}
                      >
                        {timeSpent.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
      
      <motion.div
        initial={{
