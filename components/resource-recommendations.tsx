"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { motion } from "framer-motion"
import { BookOpen, FileText, Video, Lightbulb, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Resource {
  id: string
  title: string
  type: "article" | "video" | "document" | "interactive"
  source: string
  relevance: number // 0-100
}

export function ResourceRecommendations() {
  const resources: Resource[] = [
    {
      id: "res-1",
      title: "Understanding Wave-Particle Duality",
      type: "article",
      source: "Physics Today",
      relevance: 98,
    },
    {
      id: "res-2",
      title: "Visualizing Quantum Mechanics",
      type: "video",
      source: "ScienceExplained",
      relevance: 95,
    },
    {
      id: "res-3",
      title: "Thermodynamics: Advanced Concepts",
      type: "document",
      source: "MIT OpenCourseWare",
      relevance: 92,
    },
    {
      id: "res-4",
      title: "Interactive Particle Accelerator",
      type: "interactive",
      source: "CERN Education",
      relevance: 88,
    },
  ]

  const getTypeIcon = (type: Resource["type"]) => {
    switch (type) {
      case "article":
        return <FileText className="h-5 w-5 text-blue-400" />
      case "video":
        return <Video className="h-5 w-5 text-red-400" />
      case "document":
        return <BookOpen className="h-5 w-5 text-amber-400" />
      case "interactive":
        return <Lightbulb className="h-5 w-5 text-purple-400" />
    }
  }

  const getTypeClass = (type: Resource["type"]) => {
    switch (type) {
      case "article":
        return "border-blue-900/50 bg-blue-900/20"
      case "video":
        return "border-red-900/50 bg-red-900/20"
      case "document":
        return "border-amber-900/50 bg-amber-900/20"
      case "interactive":
        return "border-purple-900/50 bg-purple-900/20"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.7 }}
    >
      <Card className="bg-black/40 backdrop-blur-md border-neutral-800 text-white overflow-hidden">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Recommended Resources</CardTitle>
          <CardDescription className="text-neutral-400">
            Personalized learning materials based on your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {resources.map((resource) => (
              <div
                key={resource.id}
                className={`p-3 rounded-lg border flex items-center justify-between ${getTypeClass(resource.type)}`}
              >
                <div className="flex items-center gap-3">
                  {getTypeIcon(resource.type)}
                  <div>
                    <h3 className="font-medium">{resource.title}</h3>
                    <p className="text-sm text-neutral-400">{resource.source}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-xs px-2 py-1 rounded-full bg-emerald-900/50 text-emerald-400">
                    {resource.relevance}% match
                  </div>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                    <ExternalLink className="h-4 w-4" />
                    <span className="sr-only">Open resource</span>
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}
