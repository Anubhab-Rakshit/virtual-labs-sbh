"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { FileText, Video, BookOpen, Zap } from "lucide-react"

interface ResourceRecommendationsProps {
  resources: {
    id: string
    title: string
    type: string
    source: string
    relevance: string
    image: string
    url: string
    duration?: string
    pages?: number
  }[]
  loading?: boolean
}

export function ResourceRecommendations({ resources, loading = false }: ResourceRecommendationsProps) {
  if (loading) {
    return (
      <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
        <CardHeader>
          <Skeleton className="h-6 w-40 bg-white/5" />
          <Skeleton className="h-4 w-60 bg-white/5" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-48 w-full rounded-md bg-white/5" />
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case "article":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "ebook":
        return <BookOpen className="h-4 w-4" />
      case "interactive":
        return <Zap className="h-4 w-4" />
      default:
        return <FileText className="h-4 w-4" />
    }
  }

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case "article":
        return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "video":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "ebook":
        return "bg-green-500/10 text-green-500 border-green-500/20"
      case "interactive":
        return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      default:
        return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <Card className="border border-white/10 bg-black/50 backdrop-blur-md">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-white">Recommended Resources</CardTitle>
        <CardDescription className="text-white/70">
          Personalized learning materials based on your progress
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {resources.map((resource) => (
            <div
              key={resource.id}
              className="group relative overflow-hidden rounded-lg border border-white/10 bg-black/30 transition-all hover:border-white/20 hover:bg-black/40"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={resource.image || "/placeholder.svg"}
                  alt={resource.title}
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className={getTypeColor(resource.type)}>
                    <span className="flex items-center">
                      {getTypeIcon(resource.type)}
                      <span className="ml-1">{resource.type}</span>
                    </span>
                  </Badge>
                  {resource.duration && <span className="text-xs text-white/50">{resource.duration}</span>}
                  {resource.pages && <span className="text-xs text-white/50">{resource.pages} pages</span>}
                </div>
                <h3 className="text-sm font-medium text-white line-clamp-2">{resource.title}</h3>
                <p className="mt-1 text-xs text-white/50">{resource.source}</p>
                <p className="mt-2 text-xs text-white/70 italic">{resource.relevance}</p>
              </div>
              <a
                href={resource.url}
                className="absolute inset-0"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${resource.title}`}
              ></a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
