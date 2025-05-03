import Link from "next/link"
import { ArrowLeft, ExternalLink, Microscope } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function BiologyLabsPage() {
  const biologyLabs = [
    {
      id: "microscope",
      title: "Virtual Microscope Lab",
      description: "Examine cell structures and tissues with an interactive virtual microscope.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Beginner",
      duration: "30 min",
      concepts: ["Cell Structure", "Microscopy", "Histology", "Magnification"],
    },
    {
      id: "dna-explorer",
      title: "DNA Structure Explorer",
      description: "Visualize and interact with DNA structure and understand genetic information.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
      duration: "45 min",
      concepts: ["DNA Structure", "Nucleotides", "Double Helix", "Genetic Code"],
    },
    {
      id: "cell-division",
      title: "Cell Division Simulator",
      description: "Observe and control the processes of mitosis and meiosis in cell division.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
      duration: "50 min",
      concepts: ["Mitosis", "Meiosis", "Chromosomes", "Cell Cycle"],
    },
    {
      id: "ecosystem-simulator",
      title: "Ecosystem Simulator",
      description: "Model and experiment with different ecosystems and ecological relationships.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Advanced",
      duration: "60 min",
      concepts: ["Food Webs", "Population Dynamics", "Biodiversity", "Succession"],
    },
    {
      id: "human-anatomy",
      title: "Human Anatomy Explorer",
      description: "Explore the human body systems with interactive 3D models.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
      duration: "45 min",
      concepts: ["Organ Systems", "Physiology", "Anatomy", "Histology"],
    },
  ]

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gray-950">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6 flex items-center">
          <Button asChild variant="ghost" size="sm" className="mr-2">
            <Link href="/labs">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to All Labs
            </Link>
          </Button>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Biology Virtual Labs</h1>
          <p className="mt-2 text-gray-400">
            Explore cells, organisms, and biological systems through interactive 3D simulations
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {biologyLabs.map((lab) => (
            <Card
              key={lab.id}
              className="overflow-hidden border-gray-800 bg-gray-900 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img
                  src={lab.image || "/placeholder.svg"}
                  alt={lab.title}
                  className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                />
              </div>
              <CardHeader className="p-4">
                <div className="flex items-center justify-between">
                  <span className="rounded-full bg-red-900/50 px-2 py-1 text-xs font-medium text-red-300">
                    {lab.difficulty}
                  </span>
                  <span className="flex items-center text-xs text-gray-400">
                    <Microscope className="mr-1 h-3 w-3" />
                    {lab.duration}
                  </span>
                </div>
                <CardTitle className="mt-2 text-xl">{lab.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-gray-400">{lab.description}</CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0">
                <div className="flex flex-wrap gap-2">
                  {lab.concepts.map((concept, idx) => (
                    <span key={idx} className="rounded-full bg-gray-800 px-2 py-1 text-xs font-medium text-gray-300">
                      {concept}
                    </span>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="border-t border-gray-800 p-4">
                <Button asChild className="w-full bg-red-600 hover:bg-red-700">
                  <Link href={`/labs/biology/${lab.id}`}>
                    Launch Lab
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
