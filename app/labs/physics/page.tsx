"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Beaker, Compass, FlaskRoundIcon as Flask, Orbit, Waves } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const labs = [
  {
    id: "pendulum",
    title: "Pendulum Simulator",
    description: "Study the motion of pendulums and understand the principles of periodic motion",
    icon: Compass,
    color: "bg-blue-500",
    difficulty: "Beginner",
  },
  {
    id: "wave-simulator",
    title: "Wave Simulator",
    description: "Visualize and interact with different types of waves and their properties",
    icon: Waves,
    color: "bg-indigo-500",
    difficulty: "Intermediate",
  },
  {
    id: "projectile-motion",
    title: "Projectile Motion",
    description: "Explore the physics of objects in flight under the influence of gravity",
    icon: Orbit,
    color: "bg-purple-500",
    difficulty: "Intermediate",
  },
  {
    id: "circuit-builder",
    title: "Circuit Builder",
    description: "Design and test electrical circuits with various components",
    icon: Flask,
    color: "bg-pink-500",
    difficulty: "Advanced",
  },

]

export default function PhysicsLabsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pb-20 pt-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Physics Virtual Labs</h1>
          <p className="mx-auto max-w-2xl text-lg text-blue-100">
            Explore the fundamental laws of physics through interactive simulations and experiments
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
                  <CardDescription className="text-blue-100">Difficulty: {lab.difficulty}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-100">{lab.description}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/labs/physics/${lab.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-blue-400 text-blue-100 hover:bg-blue-800">
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
