"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { CheckCircle2, Circle, Clock } from "lucide-react"

interface PathNode {
  id: string
  title: string
  status: "completed" | "in-progress" | "upcoming"
  date?: string
}

export function LearningPath() {
  const pathNodes: PathNode[] = [
    {
      id: "node-1",
      title: "Introduction to Physics",
      status: "completed",
      date: "Completed on Mar 15, 2023",
    },
    {
      id: "node-2",
      title: "Mechanics and Motion",
      status: "completed",
      date: "Completed on Apr 2, 2023",
    },
    {
      id: "node-3",
      title: "Waves and Optics",
      status: "completed",
      date: "Completed on Apr 28, 2023",
    },
    {
      id: "node-4",
      title: "Thermodynamics",
      status: "in-progress",
      date: "Started on May 10, 2023",
    },
    {
      id: "node-5",
      title: "Electromagnetism",
      status: "upcoming",
    },
    {
      id: "node-6",
      title: "Quantum Physics",
      status: "upcoming",
    },
  ]

  const getStatusIcon = (status: PathNode["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-6 w-6 text-emerald-500" />
      case "in-progress":
        return <Clock className="h-6 w-6 text-amber-500" />
      case "upcoming":
        return <Circle className="h-6 w-6 text-neutral-500" />
    }
  }

  const getNodeClass = (status: PathNode["status"]) => {
    switch (status) {
      case "completed":
        return "border-emerald-500/50 bg-emerald-500/10"
      case "in-progress":
        return "border-amber-500/50 bg-amber-500/10"
      case "upcoming":
        return "border-neutral-800 bg-neutral-900/50"
    }
  }

  const getLineClass = (status: PathNode["status"]) => {
    switch (status) {
      case "completed":
        return "bg-emerald-500/50"
      case "in-progress":
        return "bg-gradient-to-b from-emerald-500/50 to-neutral-800"
      case "upcoming":
        return "bg-neutral-800"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
    >
      <Card className="bg-black/40 backdrop-blur-md border-neutral-800 text-white overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Physics Learning Path</CardTitle>
          <CardDescription className="text-neutral-400">Your personalized learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative pl-8">
            {pathNodes.map((node, index) => (
              <div key={node.id} className="relative mb-8 last:mb-0">
                {/* Connecting line */}
                {index < pathNodes.length - 1 && (
                  <div
                    className={`absolute left-[-16px] top-6 w-[2px] h-[calc(100%+32px)] ${getLineClass(node.status)}`}
                  />
                )}

                {/* Node icon */}
                <div className="absolute left-[-20px] top-0">{getStatusIcon(node.status)}</div>

                {/* Node content */}
                <div className={`p-4 rounded-lg border ${getNodeClass(node.status)}`}>
                  <h3 className="font-semibold text-lg">{node.title}</h3>
                  {node.date && <p className="text-sm text-neutral-400 mt-1">{node.date}</p>}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
