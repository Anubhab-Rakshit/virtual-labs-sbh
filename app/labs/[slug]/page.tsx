"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, notFound } from "next/navigation"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Clock, Users, BookOpen, Beaker, Play, ArrowLeft, ExternalLink, ChevronRight } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TextReveal } from "@/components/text-reveal"
import { getLabBySlug } from "@/lib/labs"
import { GlowingButton } from "@/components/glowing-button"
import { NeuralNetworkVisualization } from "@/components/neural-network-visualization"
import { CellExplorer } from "@/components/cell-explorer"
import { MoleculeViewer } from "@/components/molecule-viewer"
import { WaveSimulation } from "@/components/wave-simulation"
import { InteractiveGraph } from "@/components/interactive-graph"
import type { Lab } from "@/types/lab"

export default function LabPage() {
  const params = useParams()
  const slug = params?.slug as string
  const [lab, setLab] = useState<Lab | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [isRevealed, setIsRevealed] = useState(false)
  const headerRef = useRef<HTMLDivElement>(null)

  // Scroll-based animations
  const { scrollYProgress } = useScroll({
    target: headerRef,
    offset: ["start start", "end start"],
  })

  const headerScale = useTransform(scrollYProgress, [0, 1], [1, 1.1])
  const headerY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const headerOpacity = useTransform(scrollYProgress, [0, 0.6], [1, 0])
  const contentOpacity = useTransform(scrollYProgress, [0, 0.2, 0.3], [0, 0, 1])
  const contentY = useTransform(scrollYProgress, [0, 0.2, 0.3], [100, 100, 0])

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const labData = await getLabBySlug(slug)
        if (!labData) {
          notFound()
        }
        setLab(labData)
        setIsLoading(false)

        // Reveal content after a short delay
        setTimeout(() => {
          setIsRevealed(true)
        }, 300)
      } catch (error) {
        console.error("Error fetching lab:", error)
        notFound()
      }
    }

    fetchLab()
  }, [slug])

  if (isLoading) {
    return <LabSkeleton />
  }

  if (!lab) {
    return notFound()
  }

  // Get the appropriate visualization component based on lab category
  const getVisualizationComponent = () => {
    switch (lab.category) {
      case "physics":
        return <WaveSimulation className="w-full h-full" />
      case "chemistry":
        return <MoleculeViewer className="w-full h-full" />
      case "mathematics":
        return (
          <InteractiveGraph
            data={[
              { x: 0, y: 0, label: "Origin" },
              { x: 1, y: 1 },
              { x: 2, y: 4 },
              { x: 3, y: 9 },
              { x: 4, y: 16 },
              { x: 5, y: 25 },
              { x: 6, y: 36 },
              { x: 7, y: 49 },
              { x: 8, y: 64 },
              { x: 9, y: 81 },
              { x: 10, y: 100, label: "y = x²" },
            ]}
            width={600}
            height={400}
            lineColor="#10b981"
            pointColor="#10b981"
            showGrid={true}
            showAxes={true}
            title="Quadratic Function"
            xLabel="x"
            yLabel="y = x²"
            className="w-full h-full"
          />
        )
      case "computer":
        return <NeuralNetworkVisualization className="w-full h-full" />
      case "biology":
        return <CellExplorer className="w-full h-full" />
      default:
        return null
    }
  }

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "physics":
        return "bg-blue-600"
      case "chemistry":
        return "bg-purple-600"
      case "mathematics":
        return "bg-green-600"
      case "computer":
        return "bg-cyan-600"
      case "biology":
        return "bg-rose-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <main className="relative min-h-screen">
      {/* Hero section with parallax */}
      <div ref={headerRef} className="relative h-[80vh] overflow-hidden">
        <motion.div
          className="absolute inset-0 z-0"
          style={{
            scale: headerScale,
            y: headerY,
            opacity: headerOpacity,
          }}
        >
          <Image src={lab.thumbnail || "/placeholder.svg"} alt={lab.title} fill className="object-cover" priority />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black" />
        </motion.div>

        <div className="container relative z-10 h-full flex flex-col justify-end pb-20 px-4">
          <Link
            href="/labs"
            className="text-white/70 hover:text-white flex items-center gap-2 mb-6 group w-fit"
            data-cursor-text="Back"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            <span>Back to labs</span>
          </Link>

          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isRevealed ? 1 : 0, x: isRevealed ? 0 : -20 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Badge className={`capitalize mb-4 ${getCategoryColor(lab.category)}`}>{lab.category}</Badge>
            </motion.div>

            <TextReveal
              className="mb-4"
              startColor="rgba(255, 255, 255, 1)"
              endColor="rgba(255, 255, 255, 0.1)"
              threshold={[0, 0.3]}
            >
              {lab.title}
            </TextReveal>

            <motion.p
              className="text-xl text-white/70 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: isRevealed ? 1 : 0, y: isRevealed ? 0 : 20 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {lab.description}
            </motion.p>
          </div>
        </div>
      </div>

      {/* Content section */}
      <motion.section className="relative z-20 bg-black" style={{ opacity: contentOpacity, y: contentY }}>
        <div className="container px-4 py-20 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Main content */}
            <div className="lg:col-span-2">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-12">
                <TabsList className="bg-white/5 border border-white/10 p-1 rounded-md">
                  <TabsTrigger
                    value="overview"
                    className={`rounded-md ${activeTab === "overview" ? "bg-white text-black" : "text-white"}`}
                  >
                    Overview
                  </TabsTrigger>
                  <TabsTrigger
                    value="instructions"
                    className={`rounded-md ${activeTab === "instructions" ? "bg-white text-black" : "text-white"}`}
                  >
                    Instructions
                  </TabsTrigger>
                  <TabsTrigger
                    value="resources"
                    className={`rounded-md ${activeTab === "resources" ? "bg-white text-black" : "text-white"}`}
                  >
                    Resources
                  </TabsTrigger>
                </TabsList>

                <motion.div
                  className="py-8"
                  initial={false}
                  animate={{ opacity: [0, 1], y: [20, 0] }}
                  transition={{ duration: 0.5 }}
                  key={activeTab}
                >
                  <TabsContent value="overview" className="mt-0">
                    <div className="space-y-8">
                      <motion.div
                        className="grid grid-cols-1 md:grid-cols-2 gap-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5 }}
                      >
                        <Card className="border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
                          <CardContent className="p-6">
                            <h3 className="text-xl font-light text-white mb-4 flex items-center gap-2">
                              <Users className="h-5 w-5 text-white/60" />
                              Learning Objectives
                            </h3>
                            <ul className="space-y-2">
                              {lab.learningObjectives.map((objective, i) => (
                                <motion.li
                                  key={i}
                                  className="text-white/70 flex gap-2 items-start"
                                  initial={{ opacity: 0, x: -10 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ duration: 0.3, delay: 0.2 + i * 0.1 }}
                                >
                                  <span className="text-white mt-1">•</span>
                                  <span>{objective}</span>
                                </motion.li>
                              ))}
                            </ul>
                          </CardContent>
                        </Card>

                        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                          <CardContent className="p-6">
                            <h3 className="text-xl font-light text-white mb-4 flex items-center gap-2">
                              <BookOpen className="h-5 w-5 text-white/60" />
                              Prerequisites
                            </h3>
                            <p className="text-white/70">{lab.prerequisites || "No prerequisites required."}</p>
                          </CardContent>
                        </Card>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                      >
                        <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                          <CardContent className="p-6">
                            <h3 className="text-xl font-light text-white mb-6">Interactive Preview</h3>
                            <div className="aspect-video relative overflow-hidden rounded-md bg-black/50">
                              {getVisualizationComponent()}
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    </div>
                  </TabsContent>

                  <TabsContent value="instructions" className="mt-0">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-light text-white mb-6">Step-by-Step Instructions</h3>
                        <ol className="space-y-6">
                          {lab.instructions.map((instruction, i) => (
                            <motion.li
                              key={i}
                              className="relative pl-12"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                              <span className="absolute left-0 flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-white">
                                {i + 1}
                              </span>
                              <h4 className="text-lg font-medium text-white mb-2">{instruction.title}</h4>
                              <p className="text-white/70">{instruction.description}</p>
                            </motion.li>
                          ))}
                        </ol>
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="resources" className="mt-0">
                    <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-light text-white mb-6">Additional Resources</h3>
                        <ul className="space-y-4">
                          {lab.resources.map((resource, i) => (
                            <motion.li
                              key={i}
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ duration: 0.5, delay: i * 0.1 }}
                            >
                              <a
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-3 p-3 rounded-md bg-white/5 hover:bg-white/10 transition-colors group"
                                data-cursor-text="Visit"
                              >
                                <ExternalLink className="h-5 w-5 text-white/60 group-hover:text-white transition-colors" />
                                <span className="text-white/80 group-hover:text-white transition-colors">
                                  {resource.title}
                                </span>
                              </a>
                            </motion.li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </TabsContent>
                </motion.div>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-24 space-y-8">
                <Card className="border-white/10 bg-white/5 backdrop-blur-md overflow-hidden">
                  <CardContent className="p-6">
                    <Link href={`/labs/${slug}/launch`} className="block w-full mb-6" data-cursor-text="Launch">
                      <GlowingButton className="w-full py-6 text-base">
                        <span className="flex items-center justify-center">
                          <Play className="h-5 w-5 mr-2" />
                          Launch Lab
                        </span>
                      </GlowingButton>
                    </Link>

                    <div className="space-y-6">
                      <div className="flex items-center gap-3">
                        <Clock className="h-5 w-5 text-white/60" />
                        <div>
                          <p className="text-sm text-white/60">Duration</p>
                          <p className="text-white">{lab.duration}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-white/60" />
                        <div>
                          <p className="text-sm text-white/60">Difficulty</p>
                          <p className="text-white capitalize">{lab.difficulty}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Beaker className="h-5 w-5 text-white/60" />
                        <div>
                          <p className="text-sm text-white/60">Category</p>
                          <p className="text-white capitalize">{lab.category}</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {lab.relatedLabs.length > 0 && (
                  <Card className="border-white/10 bg-white/5 backdrop-blur-md">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-light text-white mb-4">Related Labs</h3>
                      <div className="space-y-3">
                        {lab.relatedLabs.map((relatedLab, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 + i * 0.1 }}
                          >
                            <Link
                              href={`/labs/${relatedLab.slug}`}
                              className="flex items-center gap-3 group"
                              data-cursor-text="View"
                            >
                              <div className="relative w-16 h-16 rounded overflow-hidden">
                                <Image
                                  src={relatedLab.thumbnail || "/placeholder.svg"}
                                  alt={relatedLab.title}
                                  fill
                                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                                />
                              </div>
                              <div>
                                <p className="text-white group-hover:text-primary transition-colors">
                                  {relatedLab.title}
                                </p>
                                <p className="text-xs text-white/60 capitalize">{relatedLab.category}</p>
                              </div>
                              <ChevronRight className="h-4 w-4 text-white/40 group-hover:text-white/70 ml-auto transition-colors" />
                            </Link>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.section>
    </main>
  )
}

function LabSkeleton() {
  return (
    <div className="min-h-screen bg-black">
      <div className="relative h-[80vh]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black animate-pulse" />

        <div className="container relative h-full flex flex-col justify-end pb-20 px-4">
          <div className="w-32 h-8 bg-white/10 animate-pulse rounded mb-6" />

          <div className="max-w-4xl">
            <div className="w-24 h-6 bg-white/10 animate-pulse rounded mb-4" />
            <div className="w-full max-w-2xl h-16 bg-white/10 animate-pulse rounded mb-4" />
            <div className="w-full max-w-xl h-6 bg-white/10 animate-pulse rounded" />
          </div>
        </div>
      </div>

      <div className="container px-4 py-20 mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          <div className="lg:col-span-2">
            <div className="flex gap-2 mb-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="w-32 h-10 bg-white/10 animate-pulse rounded" />
              ))}
            </div>

            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(2)].map((_, i) => (
                  <div key={i} className="w-full h-64 bg-white/10 animate-pulse rounded" />
                ))}
              </div>

              <div className="w-full h-96 bg-white/10 animate-pulse rounded" />
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="space-y-8">
              <div className="w-full h-64 bg-white/10 animate-pulse rounded" />
              <div className="w-full h-80 bg-white/10 animate-pulse rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
