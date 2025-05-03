"use client"

import { motion } from "framer-motion"
import { Search, Award, Lock, CheckCircle } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { Achievement } from "@/lib/mock-student-data"

interface AchievementsProps {
  achievements: Achievement[]
  loading: boolean
}

export function Achievements({ achievements, loading }: AchievementsProps) {
  const earnedAchievements = achievements.filter((a) => a.earned)
  const inProgressAchievements = achievements.filter((a) => !a.earned && a.progress > 0)
  const lockedAchievements = achievements.filter((a) => !a.earned && a.progress === 0)

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-white mb-2">Achievements</h2>
        <p className="text-white/70">Track your progress and unlock rewards as you complete labs and quizzes.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder="Search achievements..."
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <Badge className="bg-emerald-500">{earnedAchievements.length} Earned</Badge>
          <Badge className="bg-amber-500">{inProgressAchievements.length} In Progress</Badge>
          <Badge className="bg-white/20">{lockedAchievements.length} Locked</Badge>
        </div>
      </div>

      <Tabs defaultValue="all" className="space-y-6">
        <TabsList className="bg-white/5 backdrop-blur-sm border border-white/10">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="earned">Earned</TabsTrigger>
          <TabsTrigger value="in-progress">In Progress</TabsTrigger>
          <TabsTrigger value="locked">Locked</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          <AchievementGrid achievements={achievements} loading={loading} />
        </TabsContent>

        <TabsContent value="earned">
          <AchievementGrid achievements={earnedAchievements} loading={loading} />
        </TabsContent>

        <TabsContent value="in-progress">
          <AchievementGrid achievements={inProgressAchievements} loading={loading} />
        </TabsContent>

        <TabsContent value="locked">
          <AchievementGrid achievements={lockedAchievements} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

interface AchievementGridProps {
  achievements: Achievement[]
  loading: boolean
}

function AchievementGrid({ achievements, loading }: AchievementGridProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6)
          .fill(0)
          .map((_, i) => (
            <Card key={i} className="bg-black/30 backdrop-blur-sm border border-white/10">
              <CardHeader className="pb-2">
                <div className="flex items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 bg-white/10 mb-2" />
                    <Skeleton className="h-4 w-1/2 bg-white/10" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-4 w-full bg-white/10 mb-2" />
                <Skeleton className="h-2 w-full bg-white/10" />
              </CardContent>
            </Card>
          ))}
      </div>
    )
  }

  if (achievements.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-white/70">No achievements found in this category.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {achievements.map((achievement, i) => (
        <motion.div
          key={achievement.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: i * 0.1 }}
        >
          <Card
            className={`bg-black/30 backdrop-blur-sm border ${
              achievement.earned
                ? "border-emerald-500/30"
                : achievement.progress > 0
                  ? "border-amber-500/30"
                  : "border-white/10"
            }`}
          >
            <CardHeader className="pb-2">
              <div className="flex items-start gap-4">
                <div
                  className={`h-12 w-12 rounded-full flex items-center justify-center ${
                    achievement.earned
                      ? "bg-emerald-500/20"
                      : achievement.progress > 0
                        ? "bg-amber-500/20"
                        : "bg-white/10"
                  }`}
                >
                  {achievement.earned ? (
                    <Award className="h-6 w-6 text-emerald-400" />
                  ) : achievement.progress > 0 ? (
                    <Award className="h-6 w-6 text-amber-400" />
                  ) : (
                    <Lock className="h-5 w-5 text-white/50" />
                  )}
                </div>
                <div>
                  <CardTitle className="text-white text-lg">{achievement.title}</CardTitle>
                  <CardDescription className="text-white/70">{achievement.category}</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-white/80 mb-4">{achievement.description}</p>

              {achievement.earned ? (
                <div className="flex items-center text-emerald-400 text-sm">
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Earned on {achievement.dateEarned}
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-white/70 text-sm">Progress</span>
                    <span className="text-white/70 text-sm">{achievement.progress}%</span>
                  </div>
                  <Progress
                    value={achievement.progress}
                    className="h-2"
                    indicatorClassName={achievement.progress > 0 ? "bg-amber-500" : "bg-white/20"}
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
