"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Circle } from "lucide-react"
import { Progress } from "@/components/ui/progress"

interface LearningPathProps {
  pathData?: {
    id: string
    title: string
    progress: number
    modules: {
      name: string
      completed: boolean
    }[]
    nextLab: {
      id: string
      title: string
      image: string
    }
  }[]
  loading?: boolean
}

export function LearningPath({ pathData = [], loading = false }: LearningPathProps) {
  if (loading || !pathData || pathData.length === 0) {
    return (
      <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">Learning Paths</CardTitle>
          <CardDescription className="text-white/70">Your progress through structured learning paths</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-40 bg-white/5" />
                <Skeleton className="h-4 w-full bg-white/5" />
                <div className="grid grid-cols-2 gap-4 mt-2">
                  <Skeleton className="h-20 w-full bg-white/5" />
                  <Skeleton className="h-20 w-full bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  // Default data if pathData is empty
  const displayData =
    pathData.length > 0
      ? pathData
      : [
          {
            id: "physics-101",
            title: "Physics 101",
            progress: 65,
            modules: [
              { name: "Introduction to Physics", completed: true },
              { name: "Mechanics", completed: true },
              { name: "Thermodynamics", completed: false },
              { name: "Electromagnetism", completed: false },
            ],
            nextLab: {
              id: "thermodynamics-lab",
              title: "Thermodynamics Lab",
              image: "/physics-lab.jpg",
            },
          },
          {
            id: "chemistry-basics",
            title: "Chemistry Basics",
            progress: 30,
            modules: [
              { name: "Atomic Structure", completed: true },
              { name: "Chemical Bonding", completed: false },
              { name: "Reactions", completed: false },
            ],
            nextLab: {
              id: "chemical-bonding-lab",
              title: "Chemical Bonding Lab",
              image: "/chemistry-lab.jpg",
            },
          },
        ]

  return (
    <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Learning Paths</CardTitle>
        <CardDescription className="text-white/70">Your progress through structured learning paths</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {displayData.map((path) => (
            <div key={path.id} className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-white">{path.title}</h3>
                  <div className="flex items-center mt-1">
                    <Progress value={path.progress} className="h-2 w-40 bg-white/10" />
                    <span className="ml-2 text-sm text-white/70">{path.progress}% complete</span>
                  </div>
                </div>
                <Badge variant="outline" className="bg-white/5 text-white border-white/10 hover:bg-white/10">
                  {path.modules?.filter((m) => m.completed).length || 0}/{path.modules?.length || 0} modules
                </Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white/80">Modules</h4>
                  <ul className="space-y-1">
                    {(path.modules || []).map((module, i) => (
                      <li key={i} className="flex items-center text-sm">
                        {module.completed ? (
                          <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                        ) : (
                          <Circle className="h-4 w-4 mr-2 text-white/30" />
                        )}
                        <span className={module.completed ? "text-white" : "text-white/50"}>{module.name}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium text-white/80">Next Lab</h4>
                  <div className="relative overflow-hidden rounded-md border border-white/10 bg-black/30 p-2">
                    <div className="flex items-center space-x-3">
                      <div className="h-16 w-16 flex-shrink-0 overflow-hidden rounded-md">
                        <img
                          src={path.nextLab?.image || "/placeholder.svg"}
                          alt={path.nextLab?.title || "Lab"}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div>
                        <h5 className="text-sm font-medium text-white">{path.nextLab?.title || "Next Lab"}</h5>
                        <p className="text-xs text-white/50">Continue your learning path</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
