"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Brain, Dna, Heart, Microscope, Sprout } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const labs = [
  {
    id: "microscope",
    title: "Virtual Microscope",
    description: "Examine cell structures and microorganisms with a digital microscope",
    icon: Microscope,
    color: "bg-amber-500",
    difficulty: "Beginner",
  },
  {
    id: "dna-explorer",
    title: "DNA Explorer",
    description: "Visualize DNA structure and learn about genetic processes",
    icon: Dna,
    color: "bg-orange-500",
    difficulty: "Intermediate",
  },
  {
    id: "human-anatomy",
    title: "Human Anatomy",
    description: "Interactive 3D model of human body systems and organs",
    icon: Heart,
    color: "bg-red-500",
    difficulty: "Intermediate",
  },
  {
    id: "ecosystem-simulator",
    title: "Ecosystem Simulator",
    description: "Model environmental changes and their effects on ecosystems",
    icon: Sprout,
    color: "bg-lime-500",
    difficulty: "Advanced",
  },

]

export default function BiologyLabsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-amber-900 pb-20 pt-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Biology Virtual Labs</h1>
          <p className="mx-auto max-w-2xl text-lg text-amber-100">
            Discover the wonders of life sciences through interactive simulations and virtual experiments
          </p>
        </motion.div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {labs.map((lab, index) => (
            <motion.div
              key={lab.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="overflow-hidden border-0 bg-white/10 shadow-lg backdrop-blur-sm transition-all hover:bg-white/20">
                <CardHeader className={`${lab.color} text-white`}>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-xl font-bold">{lab.title}</CardTitle>
                    <lab.icon className="h-6 w-6" />
                  </div>
                  <CardDescription className="text-amber-100">Difficulty: {lab.difficulty}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-100">{lab.description}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/labs/biology/${lab.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-amber-400 text-amber-100 hover:bg-amber-800">
                      Launch Lab
                    </Button>
                  </Link>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  )
}
