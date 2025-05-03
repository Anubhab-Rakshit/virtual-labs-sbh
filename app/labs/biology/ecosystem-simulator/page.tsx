"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Play, Pause, Plus, Minus, BarChart2, Thermometer, Droplets } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Ecosystem types
const ecosystemTypes = {
  forest: {
    name: "Temperate Forest",
    description: "A forest with distinct seasons, moderate rainfall, and diverse plant and animal life.",
    temperature: 15,
    rainfall: 60,
    sunlight: 70,
    organisms: [
      {
        id: "tree",
        name: "Oak Tree",
        type: "producer",
        population: 50,
        growthRate: 0.1,
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "shrub",
        name: "Berry Shrub",
        type: "producer",
        population: 100,
        growthRate: 0.2,
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "deer",
        name: "Deer",
        type: "consumer",
        population: 20,
        growthRate: 0.15,
        preys: ["shrub"],
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "wolf",
        name: "Wolf",
        type: "consumer",
        population: 5,
        growthRate: 0.05,
        preys: ["deer"],
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "rabbit",
        name: "Rabbit",
        type: "consumer",
        population: 80,
        growthRate: 0.3,
        preys: ["shrub"],
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "fox",
        name: "Fox",
        type: "consumer",
        population: 10,
        growthRate: 0.1,
        preys: ["rabbit"],
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "fungi",
        name: "Fungi",
        type: "decomposer",
        population: 200,
        growthRate: 0.25,
        image: "/placeholder.svg?height=50&width=50",
      },
    ],
    background: "/placeholder.svg?height=600&width=800",
  },
  desert: {
    name: "Desert",
    description: "A hot, dry ecosystem with sparse vegetation and specialized animal adaptations.",
    temperature: 30,
    rainfall: 10,
    sunlight: 90,
    organisms: [
      {
        id: "cactus",
        name: "Cactus",
        type: "producer",
        population: 30,
        growthRate: 0.05,
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "shrub",
        name: "Desert Shrub",
        type: "producer",
        population: 40,
        growthRate: 0.08,
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "scorpion",
        name: "Scorpion",
        type: "consumer",
        population: 60,
        growthRate: 0.15,
        preys: ["insect"],
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "snake",
        name: "Rattlesnake",
        type: "consumer",
        population: 15,
        growthRate: 0.07,
        preys: ["rodent", "scorpion"],
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "rodent",
        name: "Desert Rodent",
        type: "consumer",
        population: 100,
        growthRate: 0.25,
        preys: ["shrub"],
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "insect",
        name: "Desert Insect",
        type: "consumer",
        population: 200,
        growthRate: 0.3,
        preys: ["shrub"],
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "bacteria",
        name: "Bacteria",
        type: "decomposer",
        population: 300,
        growthRate: 0.2,
        image: "/placeholder.svg?height=50&width=50",
      },
    ],
    background: "/placeholder.svg?height=600&width=800",
  },
  ocean: {
    name: "Coral Reef",
    description: "A diverse underwater ecosystem with coral structures and abundant marine life.",
    temperature: 25,
    rainfall: 0,
    sunlight: 60,
    organisms: [
      {
        id: "coral",
        name: "Coral",
        type: "producer",
        population: 200,
        growthRate: 0.05,
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "algae",
        name: "Algae",
        type: "producer",
        population: 300,
        growthRate: 0.3,
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "fish-small",
        name: "Small Fish",
        type: "consumer",
        population: 150,
        growthRate: 0.2,
        preys: ["algae"],
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "fish-medium",
        name: "Medium Fish",
        type: "consumer",
        population: 80,
        growthRate: 0.15,
        preys: ["fish-small"],
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "fish-large",
        name: "Large Fish",
        type: "consumer",
        population: 20,
        growthRate: 0.08,
        preys: ["fish-medium"],
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "shark",
        name: "Shark",
        type: "consumer",
        population: 5,
        growthRate: 0.03,
        preys: ["fish-large", "fish-medium"],
        image: "/placeholder.svg?height=50&width=50",
      },
      {
        id: "bacteria",
        name: "Marine Bacteria",
        type: "decomposer",
        population: 400,
        growthRate: 0.35,
        image: "/placeholder.svg?height=50&width=50",
      },
    ],
    background: "/placeholder.svg?height=600&width=800",
  },
}

// Organism types
type OrganismType = "producer" | "consumer" | "decomposer"

interface Organism {
  id: string
  name: string
  type: OrganismType
  population: number
  growthRate: number
  preys?: string[]
  image: string
}

interface EcosystemData {
  name: string
  description: string
  temperature: number
  rainfall: number
  sunlight: number
  organisms: Organism[]
  background: string
}

export default function EcosystemSimulator() {
  const [ecosystemType, setEcosystemType] = useState<keyof typeof ecosystemTypes>("forest")
  const [ecosystem, setEcosystem] = useState<EcosystemData>(ecosystemTypes.forest)
  const [isSimulating, setIsSimulating] = useState(false)
  const [simulationSpeed, setSimulationSpeed] = useState(1)
  const [time, setTime] = useState(0)
  const [year, setYear] = useState(1)
  const [season, setSeason] = useState("Spring")
  const [temperature, setTemperature] = useState(ecosystem.temperature)
  const [rainfall, setRainfall] = useState(ecosystem.rainfall)
  const [sunlight, setSunlight] = useState(ecosystem.sunlight)
  const [showPopulationGraph, setShowPopulationGraph] = useState(false)
  const [populationHistory, setPopulationHistory] = useState<Record<string, number[]>>({})
  const [selectedOrganism, setSelectedOrganism] = useState<string | null>(null)
  const [disasterType, setDisasterType] = useState<string | null>(null)
  const [isMounted, setIsMounted] = useState(false)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const simulationInterval = useRef<NodeJS.Timeout | null>(null)

  // Safe client-side rendering
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Initialize ecosystem
  useEffect(() => {
    if (!isMounted) return

    const newEcosystem = ecosystemTypes[ecosystemType]
    setEcosystem(newEcosystem)
    setTemperature(newEcosystem.temperature)
    setRainfall(newEcosystem.rainfall)
    setSunlight(newEcosystem.sunlight)
    setTime(0)
    setYear(1)
    setSeason("Spring")
    setPopulationHistory({})
    setSelectedOrganism(null)
    setDisasterType(null)

    // Initialize population history
    const initialHistory: Record<string, number[]> = {}
    newEcosystem.organisms.forEach((org) => {
      initialHistory[org.id] = [org.population]
    })
    setPopulationHistory(initialHistory)
  }, [ecosystemType, isMounted])

  // Simulation loop
  useEffect(() => {
    if (!isMounted) return

    if (isSimulating) {
      simulationInterval.current = setInterval(() => {
        // Update time and season
        setTime((prevTime) => {
          const newTime = prevTime + 1

          // Season change every 25 time units
          if (newTime % 25 === 0) {
            const seasons = ["Spring", "Summer", "Fall", "Winter"]
            const currentSeasonIndex = seasons.indexOf(season)
            const nextSeasonIndex = (currentSeasonIndex + 1) % 4
            setSeason(seasons[nextSeasonIndex])

            // Year change after Winter
            if (nextSeasonIndex === 0) {
              setYear((prevYear) => prevYear + 1)
            }

            // Seasonal effects
            switch (seasons[nextSeasonIndex]) {
              case "Summer":
                setTemperature((prev) => prev + 5)
                setRainfall((prev) => Math.max(prev - 10, 0))
                setSunlight((prev) => Math.min(prev + 10, 100))
                break
              case "Fall":
                setTemperature((prev) => prev - 3)
                setRainfall((prev) => prev + 5)
                setSunlight((prev) => Math.max(prev - 15, 0))
                break
              case "Winter":
                setTemperature((prev) => Math.max(prev - 7, -10))
                setRainfall((prev) => Math.min(prev + 15, 100))
                setSunlight((prev) => Math.max(prev - 10, 0))
                break
              case "Spring":
                setTemperature((prev) => prev + 5)
                setRainfall((prev) => Math.min(prev + 5, 100))
                setSunlight((prev) => Math.min(prev + 15, 100))
                break
            }
          }

          return newTime
        })

        // Update populations
        setEcosystem((prevEcosystem) => {
          const updatedOrganisms = [...prevEcosystem.organisms]

          // Calculate new populations
          updatedOrganisms.forEach((org, index) => {
            let growthModifier = 1.0

            // Environmental factors affect growth
            if (org.type === "producer") {
              // Producers need sunlight and water
              growthModifier *= sunlight / 100
              growthModifier *= Math.min(rainfall / 50, 1)

              // Temperature effects
              if (temperature < 5 || temperature > 35) {
                growthModifier *= 0.5
              }
            } else if (org.type === "consumer") {
              // Consumers need prey
              if (org.preys && org.preys.length > 0) {
                let totalPreyPopulation = 0
                org.preys.forEach((preyId) => {
                  const prey = updatedOrganisms.find((o) => o.id === preyId)
                  if (prey) {
                    totalPreyPopulation += prey.population
                  }
                })

                // Growth depends on prey availability
                growthModifier *= Math.min(totalPreyPopulation / (50 * org.preys.length), 2)

                // Reduce prey populations
                org.preys.forEach((preyId) => {
                  const preyIndex = updatedOrganisms.findIndex((o) => o.id === preyId)
                  if (preyIndex >= 0) {
                    const consumptionRate = 0.01 * org.population
                    updatedOrganisms[preyIndex].population = Math.max(
                      0,
                      updatedOrganisms[preyIndex].population - consumptionRate,
                    )
                  }
                })
              }

              // Temperature effects
              if (temperature < -5 || temperature > 40) {
                growthModifier *= 0.7
              }
            } else if (org.type === "decomposer") {
              // Decomposers thrive in warm, wet conditions
              growthModifier *= Math.min(temperature / 20, 1.5)
              growthModifier *= Math.min(rainfall / 40, 1.5)
            }

            // Apply disaster effects if active
            if (disasterType) {
              switch (disasterType) {
                case "drought":
                  if (org.type === "producer") growthModifier *= 0.3
                  break
                case "disease":
                  if (org.type === "consumer") growthModifier *= 0.5
                  break
                case "fire":
                  growthModifier *= 0.4
                  break
              }
            }

            // Calculate population change
            const growthRate = org.growthRate * growthModifier
            const populationChange = org.population * growthRate * (1 - org.population / 1000)

            // Update population
            updatedOrganisms[index].population = Math.max(0, Math.round(org.population + populationChange))
          })

          // Update population history every 5 time units
          if (time % 5 === 0) {
            const newHistory = { ...populationHistory }
            updatedOrganisms.forEach((org) => {
              if (!newHistory[org.id]) {
                newHistory[org.id] = []
              }
              newHistory[org.id].push(org.population)

              // Keep history at a reasonable size
              if (newHistory[org.id].length > 50) {
                newHistory[org.id].shift()
              }
            })
            setPopulationHistory(newHistory)
          }

          return {
            ...prevEcosystem,
            organisms: updatedOrganisms,
            temperature,
            rainfall,
            sunlight,
          }
        })
      }, 1000 / simulationSpeed)
    } else if (simulationInterval.current) {
      clearInterval(simulationInterval.current)
    }

    return () => {
      if (simulationInterval.current) {
        clearInterval(simulationInterval.current)
      }
    }
  }, [
    isSimulating,
    simulationSpeed,
    season,
    temperature,
    rainfall,
    sunlight,
    disasterType,
    time,
    isMounted,
    populationHistory,
  ])

  // Draw ecosystem on canvas
  useEffect(() => {
    if (!canvasRef.current || !isMounted) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw background
    const background = new Image()
    background.src = ecosystem.background
    background.onload = () => {
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height)

      // Draw organisms
      ecosystem.organisms.forEach((org) => {
        // Skip if population is 0
        if (org.population <= 0) return

        // Calculate number of individuals to draw based on population
        const count = Math.min(Math.ceil(org.population / 10), 20)

        for (let i = 0; i < count; i++) {
          const img = new Image()
          img.src = org.image

          // Random position
          const x = Math.random() * (canvas.width - 50)
          const y = Math.random() * (canvas.height - 50)

          img.onload = () => {
            ctx.drawImage(img, x, y, 50, 50)

            // Highlight selected organism
            if (selectedOrganism === org.id) {
              ctx.strokeStyle = "#f97316"
              ctx.lineWidth = 2
              ctx.strokeRect(x - 2, y - 2, 54, 54)
            }
          }
        }
      })

      // Draw season and year
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(10, 10, 150, 30)
      ctx.fillStyle = "#ffffff"
      ctx.font = "16px Arial"
      ctx.fillText(`Year ${year} - ${season}`, 20, 30)

      // Draw environmental indicators
      ctx.fillStyle = "rgba(0, 0, 0, 0.7)"
      ctx.fillRect(canvas.width - 160, 10, 150, 90)

      // Temperature
      ctx.fillStyle = temperature > 30 ? "#ef4444" : temperature < 5 ? "#3b82f6" : "#ffffff"
      ctx.fillText(`${temperature}°C`, canvas.width - 40, 30)
      ctx.drawImage(new Image(), canvas.width - 150, 15, 20, 20) // Thermometer icon

      // Rainfall
      ctx.fillStyle = rainfall > 70 ? "#3b82f6" : rainfall < 20 ? "#ef4444" : "#ffffff"
      ctx.fillText(`${rainfall}%`, canvas.width - 40, 60)
      ctx.drawImage(new Image(), canvas.width - 150, 45, 20, 20) // Droplet icon

      // Sunlight
      ctx.fillStyle = sunlight > 70 ? "#facc15" : sunlight < 30 ? "#6b7280" : "#ffffff"
      ctx.fillText(`${sunlight}%`, canvas.width - 40, 90)
      ctx.drawImage(new Image(), canvas.width - 150, 75, 20, 20) // Sun icon

      // Draw disaster warning if active
      if (disasterType) {
        ctx.fillStyle = "rgba(239, 68, 68, 0.7)"
        ctx.fillRect(canvas.width / 2 - 100, 10, 200, 30)
        ctx.fillStyle = "#ffffff"
        ctx.textAlign = "center"
        ctx.fillText(`${disasterType.toUpperCase()} IN PROGRESS`, canvas.width / 2, 30)
        ctx.textAlign = "left"
      }
    }
  }, [ecosystem, selectedOrganism, year, season, temperature, rainfall, sunlight, disasterType, isMounted])

  // Draw population graph
  const renderPopulationGraph = () => {
    if (!showPopulationGraph) return null

    const graphHeight = 200
    const graphWidth = 400
    const maxPopulation = 500

    return (
      <div className="mt-4 rounded-lg border border-gray-800 bg-gray-950 p-4">
        <h3 className="mb-2 text-lg font-medium text-white">Population Trends</h3>
        <div className="relative h-[200px] w-full">
          {/* Y-axis */}
          <div className="absolute bottom-0 left-0 top-0 w-10 border-r border-gray-800">
            {[0, 100, 200, 300, 400, 500].map((value) => (
              <div
                key={value}
                className="absolute left-0 flex w-full items-center justify-center"
                style={{ bottom: `${(value / maxPopulation) * 100}%` }}
              >
                <span className="text-xs text-gray-500">{value}</span>
              </div>
            ))}
          </div>

          {/* Graph area */}
          <div className="absolute bottom-0 left-10 right-0 top-0">
            <svg className="h-full w-full">
              {/* Grid lines */}
              {[0, 25, 50, 75, 100].map((percent) => (
                <line
                  key={`grid-${percent}`}
                  x1="0%"
                  y1={`${100 - percent}%`}
                  x2="100%"
                  y2={`${100 - percent}%`}
                  stroke="#333"
                  strokeWidth="1"
                  strokeDasharray="4 4"
                />
              ))}

              {/* Population lines */}
              {Object.entries(populationHistory).map(([orgId, history]) => {
                const org = ecosystem.organisms.find((o) => o.id === orgId)
                if (!org || history.length < 2) return null

                const points = history
                  .map((pop, i) => {
                    const x = (i / (history.length - 1)) * 100
                    const y = 100 - (Math.min(pop, maxPopulation) / maxPopulation) * 100
                    return `${x}%,${y}%`
                  })
                  .join(" ")

                let color = "#ffffff"
                if (org.type === "producer") color = "#10b981"
                if (org.type === "consumer") color = "#3b82f6"
                if (org.type === "decomposer") color = "#8b5cf6"

                return (
                  <polyline
                    key={orgId}
                    points={points}
                    fill="none"
                    stroke={color}
                    strokeWidth={selectedOrganism === orgId ? "3" : "1.5"}
                    opacity={selectedOrganism && selectedOrganism !== orgId ? "0.3" : "1"}
                  />
                )
              })}
            </svg>
          </div>

          {/* Legend */}
          <div className="absolute bottom-[-30px] left-10 right-0 flex flex-wrap gap-4">
            {ecosystem.organisms.map((org) => (
              <div
                key={org.id}
                className={`flex cursor-pointer items-center gap-1 text-xs ${
                  selectedOrganism === org.id ? "font-bold" : ""
                }`}
                onClick={() => setSelectedOrganism(org.id === selectedOrganism ? null : org.id)}
              >
                <div
                  className="h-3 w-3 rounded-full"
                  style={{
                    backgroundColor:
                      org.type === "producer" ? "#10b981" : org.type === "consumer" ? "#3b82f6" : "#8b5cf6",
                  }}
                ></div>
                <span>{org.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Trigger a disaster
  const triggerDisaster = (type: string) => {
    setDisasterType(type)

    // Disasters last for a limited time
    setTimeout(() => {
      setDisasterType(null)
    }, 10000) // 10 seconds
  }

  if (!isMounted) {
    return null // Return null on server-side to prevent hydration issues
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gray-950">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <Button asChild variant="ghost" size="sm" className="mr-2">
            <Link href="/labs/biology">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Biology Labs
            </Link>
          </Button>
          <h1 className="text-2xl font-bold text-white">Ecosystem Simulator</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-gray-800 bg-gray-900">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <canvas ref={canvasRef} width={800} height={600} className="rounded-lg border border-gray-700" />

                  <div className="mt-4 flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={isSimulating ? "destructive" : "default"}
                        onClick={() => setIsSimulating(!isSimulating)}
                      >
                        {isSimulating ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                        {isSimulating ? "Pause" : "Start"} Simulation
                      </Button>
                      <Button variant="outline" onClick={() => setShowPopulationGraph(!showPopulationGraph)}>
                        <BarChart2 className="mr-2 h-4 w-4" />
                        {showPopulationGraph ? "Hide" : "Show"} Graph
                      </Button>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">Speed:</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSimulationSpeed(Math.max(simulationSpeed - 1, 1))}
                        disabled={simulationSpeed <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-8 text-center text-sm">{simulationSpeed}x</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setSimulationSpeed(Math.min(simulationSpeed + 1, 5))}
                        disabled={simulationSpeed >= 5}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {renderPopulationGraph()}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-gray-800 bg-gray-900">
              <CardContent className="p-6">
                <Tabs defaultValue="ecosystem">
                  <TabsList className="w-full bg-gray-800">
                    <TabsTrigger value="ecosystem" className="flex-1">
                      Ecosystem
                    </TabsTrigger>
                    <TabsTrigger value="organisms" className="flex-1">
                      Organisms
                    </TabsTrigger>
                    <TabsTrigger value="events" className="flex-1">
                      Events
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="ecosystem" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">Ecosystem Type</label>
                      <Select
                        value={ecosystemType}
                        onValueChange={(value) => setEcosystemType(value as keyof typeof ecosystemTypes)}
                      >
                        <SelectTrigger className="border-gray-800 bg-gray-950">
                          <SelectValue placeholder="Select ecosystem" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="forest">Temperate Forest</SelectItem>
                          <SelectItem value="desert">Desert</SelectItem>
                          <SelectItem value="ocean">Coral Reef</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                      <h3 className="mb-2 text-lg font-medium text-white">{ecosystem.name}</h3>
                      <p className="mb-4 text-sm text-gray-300">{ecosystem.description}</p>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <Thermometer className="h-5 w-5 text-red-500" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">Temperature</span>
                              <span className="text-sm font-medium text-white">{temperature}°C</span>
                            </div>
                            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-800">
                              <div
                                className="h-full rounded-full bg-red-500"
                                style={{ width: `${Math.min((Math.max(temperature + 10, 0) / 50) * 100, 100)}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Droplets className="h-5 w-5 text-blue-500" />
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">Rainfall</span>
                              <span className="text-sm font-medium text-white">{rainfall}%</span>
                            </div>
                            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-800">
                              <div className="h-full rounded-full bg-blue-500" style={{ width: `${rainfall}%` }}></div>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <svg
                            className="h-5 w-5 text-yellow-500"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <circle cx="12" cy="12" r="5" fill="currentColor" />
                            <path
                              d="M12 2V4M12 20V22M4 12H2M6.31 6.31L4.9 4.9M17.69 6.31L19.1 4.9M6.31 17.69L4.9 19.1M17.69 17.69L19.1 19.1M22 12H20"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="flex-1">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-300">Sunlight</span>
                              <span className="text-sm font-medium text-white">{sunlight}%</span>
                            </div>
                            <div className="mt-1 h-2 w-full overflow-hidden rounded-full bg-gray-800">
                              <div
                                className="h-full rounded-full bg-yellow-500"
                                style={{ width: `${sunlight}%` }}
                              ></div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="organisms" className="mt-4">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-medium text-white">Organisms</h3>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-green-500"></div>
                            <span className="text-xs text-gray-300">Producers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-blue-500"></div>
                            <span className="text-xs text-gray-300">Consumers</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <div className="h-3 w-3 rounded-full bg-purple-500"></div>
                            <span className="text-xs text-gray-300">Decomposers</span>
                          </div>
                        </div>
                      </div>

                      <div className="max-h-[400px] overflow-y-auto pr-2">
                        {ecosystem.organisms.map((org) => (
                          <div
                            key={org.id}
                            className={`mb-2 cursor-pointer rounded-lg border p-3 transition-colors ${
                              selectedOrganism === org.id
                                ? "border-orange-500 bg-orange-500/10"
                                : "border-gray-800 bg-gray-950 hover:border-gray-700"
                            }`}
                            onClick={() => setSelectedOrganism(org.id === selectedOrganism ? null : org.id)}
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div
                                  className="h-3 w-3 rounded-full"
                                  style={{
                                    backgroundColor:
                                      org.type === "producer"
                                        ? "#10b981"
                                        : org.type === "consumer"
                                          ? "#3b82f6"
                                          : "#8b5cf6",
                                  }}
                                ></div>
                                <h4 className="font-medium text-white">{org.name}</h4>
                              </div>
                              <span className="text-sm font-medium text-white">{org.population}</span>
                            </div>

                            <div className="mt-2 flex items-center justify-between text-xs text-gray-400">
                              <span className="capitalize">{org.type}</span>
                              <span>Growth Rate: {(org.growthRate * 100).toFixed(1)}%</span>
                            </div>

                            {org.type === "consumer" && org.preys && org.preys.length > 0 && (
                              <div className="mt-1 text-xs text-gray-400">
                                Eats:{" "}
                                {org.preys
                                  .map((prey) => {
                                    const preyOrg = ecosystem.organisms.find((o) => o.id === prey)
                                    return preyOrg ? preyOrg.name : prey
                                  })
                                  .join(", ")}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="events" className="mt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Environmental Events</h3>
                      <p className="text-sm text-gray-300">
                        Trigger environmental events to see how they affect the ecosystem.
                      </p>

                      <div className="grid grid-cols-1 gap-2">
                        <Button
                          variant="outline"
                          className="justify-start border-gray-800 bg-gray-950 text-left"
                          onClick={() => triggerDisaster("drought")}
                          disabled={!!disasterType}
                        >
                          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-amber-500/20">
                            <Droplets className="h-4 w-4 text-amber-500" />
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Drought</div>
                            <div className="text-xs text-gray-400">Reduces water availability, affecting plants</div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="justify-start border-gray-800 bg-gray-950 text-left"
                          onClick={() => triggerDisaster("disease")}
                          disabled={!!disasterType}
                        >
                          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20">
                            <svg
                              className="h-4 w-4 text-red-500"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                              <path d="M8 9L16 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                              <path d="M16 9L8 15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Disease</div>
                            <div className="text-xs text-gray-400">Reduces animal populations</div>
                          </div>
                        </Button>

                        <Button
                          variant="outline"
                          className="justify-start border-gray-800 bg-gray-950 text-left"
                          onClick={() => triggerDisaster("fire")}
                          disabled={!!disasterType}
                        >
                          <div className="mr-2 flex h-8 w-8 items-center justify-center rounded-full bg-orange-500/20">
                            <svg
                              className="h-4 w-4 text-orange-500"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 2C9.5 7 4 9 4 14C4 18.4183 7.58172 22 12 22C16.4183 22 20 18.4183 20 14C20 9 14.5 7 12 2Z"
                                stroke="currentColor"
                                strokeWidth="2"
                              />
                            </svg>
                          </div>
                          <div className="text-left">
                            <div className="font-medium">Wildfire</div>
                            <div className="text-xs text-gray-400">Damages all organisms in the ecosystem</div>
                          </div>
                        </Button>
                      </div>

                      {disasterType && (
                        <div className="mt-4 rounded-lg border border-red-500 bg-red-500/10 p-3 text-center">
                          <p className="text-sm font-medium text-white">
                            {disasterType.charAt(0).toUpperCase() + disasterType.slice(1)} in progress!
                          </p>
                          <p className="text-xs text-gray-300">The ecosystem is being affected</p>
                        </div>
                      )}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
