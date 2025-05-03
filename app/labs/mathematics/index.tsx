import Link from "next/link"
import { ArrowLeft, Calculator, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function MathematicsLabsPage() {
  const mathLabs = [
    {
      id: "graph-explorer",
      title: "3D Graph Explorer",
      description: "Visualize and interact with 3D mathematical functions and surfaces.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
      duration: "40 min",
      concepts: ["3D Functions", "Surfaces", "Coordinates", "Visualization"],
    },
    {
      id: "geometry-visualizer",
      title: "Geometry Visualizer",
      description: "Explore geometric shapes, transformations, and theorems in 2D and 3D space.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Beginner",
      duration: "35 min",
      concepts: ["Shapes", "Transformations", "Theorems", "Measurements"],
    },
    {
      id: "probability-simulator",
      title: "Probability Simulator",
      description: "Experiment with probability distributions and statistical concepts.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
      duration: "45 min",
      concepts: ["Distributions", "Random Variables", "Expected Value", "Variance"],
    },
    {
      id: "calculus-visualizer",
      title: "Calculus Visualizer",
      description: "Visualize derivatives, integrals, and other calculus concepts.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Advanced",
      duration: "50 min",
      concepts: ["Derivatives", "Integrals", "Limits", "Series"],
    },
    {
      id: "linear-algebra",
      title: "Linear Algebra Explorer",
      description: "Explore vectors, matrices, and transformations in interactive 3D space.",
      image: "/placeholder.svg?height  matrices, and transformations in interactive 3D space.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Advanced",
      duration: "55 min",
      concepts: ["Vectors", "Matrices", "Transformations", "Eigenvalues"],
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
          <h1 className="text-3xl font-bold text-white">Mathematics Virtual Labs</h1>
          <p className="mt-2 text-gray-400">
            Explore mathematical concepts through interactive visualizations and simulations
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {mathLabs.map((lab) => (
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
                  <span className="rounded-full bg-purple-900/50 px-2 py-1 text-xs font-medium text-purple-300">
                    {lab.difficulty}
                  </span>
                  <span className="flex items-center text-xs text-gray-400">
                    <Calculator className="mr-1 h-3 w-3" />
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
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href={`/labs/mathematics/${lab.id}`}>
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
