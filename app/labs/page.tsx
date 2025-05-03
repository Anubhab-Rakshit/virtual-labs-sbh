"use client"

import { useState, useEffect, useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { Search, Filter, Atom, Beaker, Calculator, Cpu, Dna } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TextReveal } from "@/components/text-reveal"
import { getAllLabs } from "@/lib/labs"
import { GlowingButton } from "@/components/glowing-button"
import { LabCard } from "@/components/lab-card"
import { ParticleWave } from "@/components/particle-wave"
import type { Lab } from "@/types/lab"

export default function LabsPage() {
  const [labs, setLabs] = useState<Lab[]>([])
  const [filteredLabs, setFilteredLabs] = useState<Lab[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [hovered, setHovered] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const headerRef = useRef<HTMLDivElement>(null)

  // Parallax scroll effect
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  })

  const headerY = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])

  useEffect(() => {
    const fetchLabs = async () => {
      try {
        const labsData = await getAllLabs()
        setLabs(labsData)
        setFilteredLabs(labsData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching labs:", error)
        setIsLoading(false)
      }
    }

    fetchLabs()
  }, [])

  useEffect(() => {
    let result = labs

    if (searchQuery) {
      result = result.filter(
        (lab) =>
          lab.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          lab.description.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory) {
      result = result.filter((lab) => lab.category === selectedCategory)
    }

    setFilteredLabs(result)
  }, [searchQuery, selectedCategory, labs])

  const categories = [
    { id: "physics", name: "Physics", icon: <Atom className="h-5 w-5" />, color: "bg-blue-600 hover:bg-blue-700" },
    {
      id: "chemistry",
      name: "Chemistry",
      icon: <Beaker className="h-5 w-5" />,
      color: "bg-purple-600 hover:bg-purple-700",
    },
    {
      id: "mathematics",
      name: "Mathematics",
      icon: <Calculator className="h-5 w-5" />,
      color: "bg-green-600 hover:bg-green-700",
    },
    {
      id: "computer",
      name: "Computer Science",
      icon: <Cpu className="h-5 w-5" />,
      color: "bg-cyan-600 hover:bg-cyan-700",
    },
    { id: "biology", name: "Biology", icon: <Dna className="h-5 w-5" />, color: "bg-rose-600 hover:bg-rose-700" },
  ]

  return (
    <main className="relative min-h-screen">
      {/* Header */}
      <div ref={headerRef} className="relative h-[70vh] flex flex-col items-center justify-center overflow-hidden">
        {/* Particle Wave Background */}
        <div className="absolute inset-0 z-0">
          <ParticleWave className="absolute inset-0" particleColor="rgba(255, 255, 255, 0.5)" />
          <div className="absolute inset-0 bg-black/50 z-10" />
        </div>

        <motion.div
          className="container relative z-10 px-4 mx-auto text-center"
          style={{ y: headerY, opacity: headerOpacity }}
        >
          <TextReveal
            className="text-center mb-6"
            startColor="rgba(255, 255, 255, 1)"
            endColor="rgba(255, 255, 255, 0.1)"
            threshold={[0, 0.3]}
          >
            EXPLORE LABS
          </TextReveal>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl text-white/70 max-w-xl mx-auto"
          >
            Discover interactive experiments and simulations in physics, chemistry, mathematics, computer science, and
            biology
          </motion.p>
        </motion.div>
      </div>

      {/* Search and filters */}
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md py-6 border-b border-white/10">
        <div className="container px-4 mx-auto">
          <motion.div
            className="flex flex-col md:flex-row gap-4 items-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search labs..."
                className="pl-10 bg-white/5 border-white/10 w-full"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            <div className="flex gap-2 flex-wrap justify-center">
              {categories.map((category) => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? "default" : "outline"}
                  onClick={() => setSelectedCategory(selectedCategory === category.id ? null : category.id)}
                  className={`capitalize flex items-center gap-2 ${
                    selectedCategory === category.id ? category.color : "border-white/20 text-white hover:bg-white/10"
                  }`}
                >
                  {category.icon}
                  <span className="hidden sm:inline">{category.name}</span>
                </Button>
              ))}

              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCategory(null)
                }}
                className="gap-2 text-white/70 hover:text-white"
              >
                <Filter className="h-4 w-4" />
                Clear
              </Button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Labs grid */}
      <section className="py-20">
        <div className="container px-4 mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="overflow-hidden border-white/10 bg-white/5 h-full">
                    <div className="h-48 bg-white/5 animate-pulse" />
                    <CardContent className="p-6">
                      <div className="h-6 bg-white/5 animate-pulse rounded mb-3 w-3/4" />
                      <div className="h-4 bg-white/5 animate-pulse rounded mb-2" />
                      <div className="h-4 bg-white/5 animate-pulse rounded mb-2 w-5/6" />
                      <div className="h-4 bg-white/5 animate-pulse rounded w-2/3" />
                      <div className="mt-6 flex justify-between">
                        <div className="h-5 bg-white/5 animate-pulse rounded w-1/3" />
                        <div className="h-8 bg-white/5 animate-pulse rounded w-1/4" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <>
              {filteredLabs.length === 0 ? (
                <motion.div
                  className="text-center py-20"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <h3 className="text-2xl font-light text-white mb-2">No labs found</h3>
                  <p className="text-white/60 mb-8">Try adjusting your search or filters</p>
                  <GlowingButton
                    onClick={() => {
                      setSearchQuery("")
                      setSelectedCategory(null)
                    }}
                  >
                    Clear Filters
                  </GlowingButton>
                </motion.div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {filteredLabs.map((lab, index) => (
                    <motion.div
                      key={lab.id}
                      initial={{ opacity: 0, y: 50 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, amount: 0.2 }}
                      transition={{ duration: 0.6, delay: index * 0.1 }}
                    >
                      <LabCard lab={lab} />
                    </motion.div>
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  )
}
