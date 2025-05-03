"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { Flame } from "lucide-react"

interface DayActivity {
  date: string
  active: boolean
  intensity?: "low" | "medium" | "high"
}

export function StudyStreak() {
  // Generate last 30 days of activity
  const generateActivityData = (): DayActivity[] => {
    const data: DayActivity[] = []
    const today = new Date()

    for (let i = 29; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(today.getDate() - i)

      // Random activity pattern with higher probability for recent days
      const probability = Math.min(0.9, 0.4 + (30 - i) * 0.02)
      const active = Math.random() < probability

      let intensity: DayActivity["intensity"] = undefined
      if (active) {
        const intensityRandom = Math.random()
        if (intensityRandom > 0.7) intensity = "high"
        else if (intensityRandom > 0.3) intensity = "medium"
        else intensity = "low"
      }

      data.push({
        date: date.toISOString().split("T")[0],
        active,
        intensity,
      })
    }

    return data
  }

  const activityData = generateActivityData()
  const currentStreak = 12 // Mock current streak

  const getIntensityClass = (intensity?: DayActivity["intensity"]) => {
    if (!intensity) return "bg-neutral-800"

    switch (intensity) {
      case "low":
        return "bg-emerald-900"
      case "medium":
        return "bg-emerald-700"
      case "high":
        return "bg-emerald-500"
    }
  }

  // Group days by week for the calendar view
  const weeks: DayActivity[][] = []
  for (let i = 0; i < activityData.length; i += 7) {
    weeks.push(activityData.slice(i, i + 7))
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.6 }}
    >
      <Card className="bg-black/40 backdrop-blur-md border-neutral-800 text-white overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl font-bold">Study Streak</CardTitle>
              <CardDescription className="text-neutral-400">Your daily learning activity</CardDescription>
            </div>
            <div className="flex items-center gap-2 bg-gradient-to-r from-amber-900 to-amber-600 px-3 py-2 rounded-lg">
              <Flame className="h-5 w-5 text-amber-300" />
              <span className="font-bold text-amber-100">{currentStreak} days</span>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-1 text-xs text-center text-neutral-500 mb-2">
              <div>Mon</div>
              <div>Tue</div>
              <div>Wed</div>
              <div>Thu</div>
              <div>Fri</div>
              <div>Sat</div>
              <div>Sun</div>
            </div>

            {weeks.map((week, weekIndex) => (
              <div key={`week-${weekIndex}`} className="grid grid-cols-7 gap-1">
                {week.map((day, dayIndex) => (
                  <div
                    key={`day-${weekIndex}-${dayIndex}`}
                    className={`aspect-square rounded-sm ${getIntensityClass(day.intensity)} transition-all hover:scale-110 hover:opacity-80`}
                    title={`${day.date}${day.active ? " - Active" : " - Inactive"}`}
                  />
                ))}
              </div>
            ))}

            <div className="flex justify-between items-center mt-4 text-xs text-neutral-400">
              <div>Less</div>
              <div className="flex gap-1">
                <div className="w-3 h-3 rounded-sm bg-neutral-800" />
                <div className="w-3 h-3 rounded-sm bg-emerald-900" />
                <div className="w-3 h-3 rounded-sm bg-emerald-700" />
                <div className="w-3 h-3 rounded-sm bg-emerald-500" />
              </div>
              <div>More</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
