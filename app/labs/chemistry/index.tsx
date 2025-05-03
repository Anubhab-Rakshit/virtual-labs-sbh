import Link from "next/link"
import { ArrowLeft, Beaker, ExternalLink } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

export default function ChemistryLabsPage() {
  const chemistryLabs = [
    {
      id: "molecular-viewer",
      title: "Molecular Viewer Lab",
      description: "Explore 3D molecular structures and understand chemical bonding.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Beginner",
      duration: "30 min",
      concepts: ["Molecular Structure", "Chemical Bonds", "Geometry", "Polarity"],
    },
    {
      id: "periodic-table",
      title: "Interactive Periodic Table",
      description: "Explore elements and their properties in an interactive periodic table.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Beginner",
      duration: "45 min",
      concepts: ["Elements", "Atomic Structure", "Periodic Trends", "Properties"],
    },
    {
      id: "chemical-reactions",
      title: "Chemical Reactions Simulator",
      description: "Visualize and experiment with different chemical reactions and their mechanisms.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
      duration: "60 min",
      concepts: ["Reaction Mechanisms", "Stoichiometry", "Equilibrium", "Catalysis"],
    },
    {
      id: "titration-lab",
      title: "Virtual Titration Lab",
      description: "Perform acid-base titrations and analyze the resulting data.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Intermediate",
      duration: "50 min",
      concepts: ["Acid-Base Reactions", "pH", "Indicators", "Equivalence Point"],
    },
    {
      id: "gas-laws",
      title: "Gas Laws Simulator",
      description: "Investigate the relationships between pressure, volume, temperature, and amount of gas.",
      image: "/placeholder.svg?height=200&width=400",
      difficulty: "Advanced",
      duration: "45 min",
      concepts: ["Boyle's Law", "Charles's Law", "Ideal Gas Law", "Kinetic Theory"],
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
          <h1 className="text-3xl font-bold text-white">Chemistry Virtual Labs</h1>
          <p className="mt-2 text-gray-400">
            Explore chemical reactions, molecular structures, and chemical principles through interactive simulations
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {chemistryLabs.map((lab) => (
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
                  <span className="rounded-full bg-green-900/50 px-2 py-1 text-xs font-medium text-green-300">
                    {lab.difficulty}
                  </span>
                  <span className="flex items-center text-xs text-gray-400">
                    <Beaker className="mr-1 h-3 w-3" />
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
                <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                  <Link href={`/labs/chemistry/${lab.id}`}>
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
