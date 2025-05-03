"use client"

import { motion } from "framer-motion"
import { Calendar, Clock, ArrowRight } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import Link from "next/link"

interface UpcomingLab {
  id: string
  title: string
  category: string
  dueDate: string
  difficulty: string
  estimatedTime: string
  image: string
}

interface UpcomingLabsProps {
  labs: UpcomingLab[]
  loading: boolean
}

export function UpcomingLabs({ labs, loading }: UpcomingLabsProps) {
  const getCategoryColor = (category: string) => {
    switch (category.toLowerCase()) {
      case "physics":
        return "bg-blue-500"
      case "chemistry":
        return "bg-purple-500"
      case "mathematics":
        return "bg-green-500"
      case "computer science":
        return "bg-cyan-500"
      case "biology":
        return "bg-rose-500"
      default:
        return "bg-gray-500"
    }
  }

  // Add null check for labs
  if (!labs && !loading) {
    return (
      <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
        <CardHeader>
          <CardTitle className="text-white">Upcoming Labs</CardTitle>
          <CardDescription className="text-white/70">No upcoming labs found</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-8 text-center text-white/60">No upcoming labs scheduled at this time.</div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-black/30 backdrop-blur-sm border border-white/10">
      <CardHeader>
        <CardTitle className="text-white">Upcoming Labs</CardTitle>
        <CardDescription className="text-white/70">Scheduled and recommended labs for you</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {Array(3)
              .fill(0)
              .map((_, i) => (
                <div key={i} className="flex gap-4 p-3 rounded-lg bg-white/5">
                  <Skeleton className="h-12 w-12 rounded-md bg-white/10" />
                  <div className="flex-1">
                    <Skeleton className="h-4 w-3/4 bg-white/10 mb-2" />
                    <Skeleton className="h-4 w-1/2 bg-white/10" />
                  </div>
                </div>
              ))}
          </div>
        ) : (
          <div className="space-y-4">
            {labs.map((lab, i) => (
              <motion.div
                key={lab.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.1 }}
                className="flex gap-4 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
              >
                <div className="h-12 w-12 rounded-md bg-gradient-to-br from-indigo-500/20 to-purple-500/20 flex items-center justify-center">
                  <span className="text-lg font-medium text-white">{lab.dueDate.split("-")[2]}</span>
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-white font-medium">{lab.title}</h4>
                      <div className="flex items-center gap-3 text-white/60 text-sm mt-1">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 mr-1" />
                          {lab.dueDate}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {lab.estimatedTime}
                        </div>
                      </div>
                    </div>
                    <Badge className={`${getCategoryColor(lab.category)}`}>{lab.category}</Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <Link href="/labs" className="w-full">
          <Button variant="outline" className="w-full bg-white/5 border-white/10 text-white hover:bg-white/10">
            View All Labs
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}
