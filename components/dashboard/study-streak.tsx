"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Flame } from "lucide-react"

interface StudyStreakProps {
  streakData?: {
    currentStreak: number
    longestStreak: number
    thisWeek: boolean[]
    lastMonth: {
      date: string
      completed: boolean
    }[]
  }
  loading?: boolean
}

export function StudyStreak({ streakData, loading = false }: StudyStreakProps) {
  if (loading) {
    return (
      <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-white/5" />
          <Skeleton className="h-4 w-60 bg-white/5" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[200px] w-full rounded-md bg-white/5" />
        </CardContent>
      </Card>
    )
  }

  // Add a check for undefined streakData
  if (!streakData) {
    return (
      <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Study Streak</CardTitle>
          <CardDescription className="text-white/70">No streak data available</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-[200px] text-white/50">No streak data available</div>
        </CardContent>
      </Card>
    )
  }

  const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]

  return (
    <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-white">Study Streak</CardTitle>
          <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
            <Flame className="h-3.5 w-3.5 mr-1" />
            {streakData.currentStreak} days
          </Badge>
        </div>
        <CardDescription className="text-white/70">Your daily learning consistency</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white/70">Current Streak</p>
              <p className="text-2xl font-bold text-white">{streakData.currentStreak} days</p>
            </div>
            <div>
              <p className="text-sm text-white/70">Longest Streak</p>
              <p className="text-2xl font-bold text-white">{streakData.longestStreak} days</p>
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-white/80">This Week</h4>
            <div className="grid grid-cols-7 gap-1">
              {weekdays.map((day, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xs text-white/50">{day}</span>
                  <div
                    className={`mt-1 h-8 w-8 rounded-full flex items-center justify-center ${
                      streakData.thisWeek[i]
                        ? "bg-gradient-to-br from-amber-500 to-orange-500 text-white"
                        : "bg-white/5 text-white/30"
                    }`}
                  >
                    {streakData.thisWeek[i] && <Flame className="h-4 w-4" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h4 className="mb-2 text-sm font-medium text-white/80">Last 30 Days</h4>
            <div className="grid grid-cols-15 gap-1">
              {streakData.lastMonth.map((day, i) => {
                const date = new Date(day.date)
                const isWeekend = date.getDay() === 0 || date.getDay() === 6
                return (
                  <div
                    key={i}
                    className={`h-4 w-4 rounded-sm ${
                      day.completed
                        ? isWeekend
                          ? "bg-amber-500/80"
                          : "bg-amber-500"
                        : isWeekend
                          ? "bg-white/5"
                          : "bg-white/10"
                    }`}
                    title={`${date.toLocaleDateString()}: ${day.completed ? "Studied" : "No activity"}`}
                  />
                )
              })}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
