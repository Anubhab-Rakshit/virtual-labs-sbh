"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"
import { Search, Filter, ArrowRight, Star, StarOff } from "lucide-react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Skeleton } from "@/components/ui/skeleton"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Update the interface to match the mock data structure
interface CompletedLab {
  id: string
  title: string
  category: string
  completedDate: string
  score: number
  image: string
  timeSpent: string
  slug?: string
  thumbnail?: string
}

interface CompletedLabsProps {
  completedLabs: CompletedLab[]
  loading: boolean
}

export function CompletedLabs({ completedLabs, loading }: CompletedLabsProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [filter, setFilter] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<string[]>([])

  // Use completedLabs instead of labs
  const filteredLabs = completedLabs.filter((lab) => {
    const matchesSearch =
      lab.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lab.category.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = !filter || lab.category.toLowerCase() === filter.toLowerCase()
    return matchesSearch && matchesFilter
  })

  const toggleFavorite = (labId: string) => {
    setFavorites((prev) => (prev.includes(labId) ? prev.filter((id) => id !== labId) : [...prev, labId]))
  }

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

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-light text-white mb-2">Completed Labs</h2>
        <p className="text-white/70">Review and revisit your completed laboratory experiments.</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-auto flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50 h-4 w-4" />
          <Input
            placeholder="Search labs..."
            className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-white/50"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="bg-white/5 border-white/10 text-white hover:bg-white/10">
              <Filter className="mr-2 h-4 w-4" />
              {filter ? `Filter: ${filter}` : "Filter"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="bg-black/90 backdrop-blur-lg border border-white/10 text-white">
            <DropdownMenuLabel>Categories</DropdownMenuLabel>
            <DropdownMenuSeparator className="bg-white/10" />
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => setFilter(null)}>
              All Categories
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => setFilter("physics")}>
              Physics
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => setFilter("chemistry")}>
              Chemistry
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => setFilter("mathematics")}>
              Mathematics
            </DropdownMenuItem>
            <DropdownMenuItem
              className="hover:bg-white/10 cursor-pointer"
              onClick={() => setFilter("computer science")}
            >
              Computer Science
            </DropdownMenuItem>
            <DropdownMenuItem className="hover:bg-white/10 cursor-pointer" onClick={() => setFilter("biology")}>
              Biology
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, i) => (
              <Card key={i} className="bg-black/30 backdrop-blur-sm border border-white/10">
                <CardHeader className="pb-2">
                  <Skeleton className="h-4 w-3/4 bg-white/10 mb-2" />
                  <Skeleton className="h-4 w-1/2 bg-white/10" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-32 w-full bg-white/10 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-4 w-20 bg-white/10" />
                    <Skeleton className="h-4 w-20 bg-white/10" />
                  </div>
                </CardContent>
              </Card>
            ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredLabs.map((lab, i) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <Card className="bg-black/30 backdrop-blur-sm border border-white/10 overflow-hidden group">
                <div className="relative h-48">
                  <Image
                    src={lab.image || "/placeholder.svg"}
                    alt={lab.title}
                    width={400}
                    height={300}
                    className="object-cover transition-transform duration-500 group-hover:scale-105 h-full w-full"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
                  <Badge className={`absolute top-3 right-3 ${getCategoryColor(lab.category)}`}>{lab.category}</Badge>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-3 left-3 text-white/70 hover:text-white hover:bg-white/10"
                    onClick={() => toggleFavorite(lab.id)}
                  >
                    {favorites.includes(lab.id) ? (
                      <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    ) : (
                      <StarOff className="h-5 w-5" />
                    )}
                  </Button>
                </div>
                <CardHeader className="pb-2">
                  <CardTitle className="text-white text-xl">{lab.title}</CardTitle>
                  <CardDescription className="text-white/70">Completed on {lab.completedDate}</CardDescription>
                </CardHeader>
                <CardContent className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm text-white/70">Score</span>
                    <span className="text-sm font-medium text-white">{lab.score}%</span>
                  </div>
                  <Progress value={lab.score} className="h-2" />
                </CardContent>
                <CardFooter className="pt-2">
                  <div className="flex justify-between items-center w-full">
                    <span className="text-sm text-white/70">{lab.timeSpent}</span>
                    <Link href={`/labs/${lab.id}`}>
                      <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10 p-0">
                        Review <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {!loading && filteredLabs.length === 0 && (
        <div className="text-center py-12">
          <p className="text-white/70">No labs found matching your search criteria.</p>
        </div>
      )}
    </div>
  )
}
