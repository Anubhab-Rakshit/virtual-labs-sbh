"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BarChart3, Calculator, ActivityIcon as Function, LineChart, PieChart } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

const labs = [
  {
    id: "graph-explorer",
    title: "Graph Explorer",
    description: "Visualize and manipulate mathematical functions in 2D and 3D",
    icon: Function,
    color: "bg-violet-500",
    difficulty: "Intermediate",
  },
]

export default function MathematicsLabsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-violet-900 pb-20 pt-16">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="mb-4 text-4xl font-bold text-white md:text-5xl">Mathematics Virtual Labs</h1>
          <p className="mx-auto max-w-2xl text-lg text-violet-100">
            Explore mathematical concepts through interactive visualizations and problem-solving tools
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
                  <CardDescription className="text-violet-100">Difficulty: {lab.difficulty}</CardDescription>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-gray-100">{lab.description}</p>
                </CardContent>
                <CardFooter>
                  <Link href={`/labs/mathematics/${lab.id}`} className="w-full">
                    <Button variant="outline" className="w-full border-violet-400 text-violet-100 hover:bg-violet-800">
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
