"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Atom, Beaker, FlaskRoundIcon as Flask, MicroscopeIcon as Molecule, Pipette } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const labs = [
  {
    id: "molecular-viewer",
    title: "Molecular Viewer",
    description: "Visualize and interact with 3D molecular structures",
    icon: Molecule,
    color: "bg-green-500",
    difficulty: "Intermediate",
  },
  {
    id: "reaction-kinetics",
    title: "Reaction Kinetics",
    description: "Study the rates of chemical reactions and influencing factors",
    icon: Beaker,
    color: "bg-cyan-500",
    difficulty: "Advanced",
  },

]

export default function ChemistryLabsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-green-900 pb-20 pt-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Chemistry Virtual Labs</h1>
          <p className="mx-auto max-w-2xl text-lg text-green-100">
            Explore chemical reactions, molecular structures, and laboratory techniques in a safe virtual environment
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
                  <CardDescription className="text-green-100">Difficulty: {lab.difficulty}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-100">{lab.description}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/labs/chemistry/${lab.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-green-400 text-green-100 hover:bg-green-800">
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
