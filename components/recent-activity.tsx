"use client"

import { motion } from "framer-motion"
import { Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"
import type { Activity } from "@/lib/mock-student-data"

interface RecentActivityProps {
  activities: Activity[]
  loading: boolean
}

export function RecentActivity({ activities, loading }: RecentActivityProps) {
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "lab_completed":
        return (
          <div className="h-8 w-8 rounded-full bg-blue-500/20 flex items-center justify-center">
            <svg className="h-4 w-4 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )
      case "quiz_completed":
        return (
          <div className="h-8 w-8 rounded-full bg-purple-500/20 flex items-center justify-center">
            <svg className="h-4 w-4 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
              />
            </svg>
          </div>
        )
      case "achievement_earned":
        return (
          <div className="h-8 w-8 rounded-full bg-amber-500/20 flex items-center justify-center">
            <svg className="h-4 w-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"
              />
            </svg>
          </div>
        )
      case "note_added":
        return (
          <div className="h-8 w-8 rounded-full bg-green-500/20 flex items-center justify-center">
            <svg className="h-4 w-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
          </div>
        )
      default:
        return (
          <div className="h-8 w-8 rounded-full bg-gray-500/20 flex items-center justify-center">
            <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        )
    }
  }

  return (
    <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <CardDescription className="text-white/70">Your latest actions and achievements</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array(5)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex gap-4">
                  <Skeleton className="h-8 w-8 rounded-full bg-white/10" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 bg-white/10 mb-2" />
                    <Skeleton className="h-3 w-1/3 bg-white/10" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity, i) => (
              <motion.div
                key={activity.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex gap-4"
              >
                {getActivityIcon(activity.type)}
                <div>
                  <p className="text-white">{activity.description}</p>
                  <div className="flex items-center text-white/50 text-xs mt-1">
                    <Clock className="h-3 w-3 mr-1" />
                    {activity.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href="/activity" className="w-full">
          <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
            View All Activity
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
