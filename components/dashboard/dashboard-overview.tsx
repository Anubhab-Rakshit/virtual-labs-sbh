"use client"

import { motion } from "framer-motion"
import { Dna, Atom, Calculator, Cpu, Beaker, Clock, Award, BookOpen } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { DashboardChart } from "@/components/dashboard/dashboard-chart"
import type { Student } from "@/lib/mock-student-data"

interface DashboardOverviewProps {

    student: {
        name: string
        stats: {
          labsCompleted: number
          averageQuizScore: number
          hoursSpent: number
          achievements: number
        }
        activityData: Array<{
          date: string
          "Minutes Spent": number
          "Labs Completed": number
        }>
        subjectProgress: Array<{
          subject: string
          progress: number
        }>
      }
      loading: boolean
    }

export function DashboardOverview({ student, loading }: DashboardOverviewProps) {
  const getCategoryIcon = (category: string) => {
    switch (category.toLowerCase()) {
      case "physics":
        return <Atom className="h-5 w-5 text-blue-500" />
      case "chemistry":
        return <Beaker className="h-5 w-5 text-purple-500" />
      case "mathematics":
        return <Calculator className="h-5 w-5 text-green-500" />
      case "computer science":
        return <Cpu className="h-5 w-5 text-cyan-500" />
      case "biology":
        return <Dna className="h-5 w-5 text-rose-500" />
      default:
        return <BookOpen className="h-5 w-5 text-gray-500" />
    }
  }

  const statCards = [
    {
      title: "Labs Completed",
      value: student.stats.labsCompleted,
      description: "Total labs completed",
      icon: <BookOpen className="h-5 w-5 text-indigo-500" />,
      change: "+3 this week",
      trend: "up",
    },
    {
      title: "Hours Spent",
      value: student.stats.hoursSpent,
      description: "Total learning time",
      icon: <Clock className="h-5 w-5 text-cyan-500" />,
      change: "+2.5 this week",
      trend: "up",
    },
    {
      title: "Achievements",
      value: student.stats.achievements,
      description: "Badges earned",
      icon: <Award className="h-5 w-5 text-amber-500" />,
      change: "+1 this week",
      trend: "up",
    },
    {
      title: "Quiz Score",
      value: `${student.stats.averageQuizScore}%`,
      description: "Average score",
      icon: <Calculator className="h-5 w-5 text-emerald-500" />,
      change: "+2% this week",
      trend: "up",
    },
  ]

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-light text-white mb-2">Welcome back, {student.name.split(" ")[0]}</h2>
        <p className="text-white/70">Here's an overview of your learning progress and activities.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading
          ? Array(4)
              .fill(0)
              .map((_, i) => (
                <Card key={i} className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardHeader className="pb-2">
                    <Skeleton className="h-4 w-24 bg-white/10" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-8 w-16 bg-white/10 mb-2" />
                    <Skeleton className="h-4 w-32 bg-white/10" />
                  </CardContent>
                </Card>
              ))
          : statCards.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
              >
                <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
                  <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                    <CardTitle className="text-sm font-medium text-white/70">{stat.title}</CardTitle>
                    <div className="p-2 rounded-full bg-white/5">{stat.icon}</div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold text-white">{stat.value}</div>
                    <p className="text-xs text-white/50 mt-1 flex items-center">
                      {stat.change}
                      {stat.trend === "up" ? (
                        <span className="text-emerald-500 ml-1">↑</span>
                      ) : (
                        <span className="text-red-500 ml-1">↓</span>
                      )}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
        >
          <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Learning Progress</CardTitle>
              <CardDescription className="text-white/70">Your activity over the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-[300px] w-full bg-white/10" />
              ) : (
                <DashboardChart data={student.activityData} />
              )}
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Subject Progress</CardTitle>
              <CardDescription className="text-white/70">Completion by category</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  {Array(5)
                    .fill(0)
                    .map((_, i) => (
                      <div key={i} className="space-y-2">
                        <Skeleton className="h-4 w-24 bg-white/10" />
                        <Skeleton className="h-2 w-full bg-white/10" />
                      </div>
                    ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {student.subjectProgress.map((subject, i) => (
                    <div key={i} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          {getCategoryIcon(subject.subject)}
                          <span className="ml-2 text-sm text-white">{subject.subject}</span>
                        </div>
                        <span className="text-sm text-white/70">{subject.progress}%</span>
                      </div>
                      <Progress
                        value={subject.progress}
                        className="h-2"
                        indicatorClassName={
                          subject.subject.toLowerCase() === "physics"
                            ? "bg-blue-500"
                            : subject.subject.toLowerCase() === "chemistry"
                              ? "bg-purple-500"
                              : subject.subject.toLowerCase() === "mathematics"
                                ? "bg-green-500"
                                : subject.subject.toLowerCase() === "computer science"
                                  ? "bg-cyan-500"
                                  : "bg-rose-500"
                        }
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
