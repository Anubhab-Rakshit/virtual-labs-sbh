"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { ArrowLeft, Pause, Play, RefreshCw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"

// Reaction data
const reactions = {
  "first-order": {
    name: "First Order Reaction",
    description: "Rate = k[A], where k is the rate constant and [A] is the concentration of reactant A.",
    examples: ["Radioactive decay", "Hydrolysis of esters", "Decomposition of hydrogen peroxide"],
    equation: "A → products",
    rateEquation: "Rate = k[A]",
    integratedRateEquation: "[A] = [A]₀e^(-kt)",
    halfLife: "t₁/₂ = ln(2)/k",
    color: "#ef4444",
  },
  "second-order": {
    name: "Second Order Reaction",
    description: "Rate = k[A]², where k is the rate constant and [A] is the concentration of reactant A.",
    examples: ["Saponification of esters", "Dimerization reactions", "Some substitution reactions"],
    equation: "A + A → products",
    rateEquation: "Rate = k[A]²",
    integratedRateEquation: "1/[A] = 1/[A]₀ + kt",
    halfLife: "t₁/₂ = 1/(k[A]₀)",
    color: "#3b82f6",
  },
  "zero-order": {
    name: "Zero Order Reaction",
    description: "Rate = k, where k is the rate constant. The rate is independent of reactant concentration.",
    examples: ["Enzyme-catalyzed reactions at high substrate concentrations", "Photochemical reactions"],
    equation: "A → products",
    rateEquation: "Rate = k",
    integratedRateEquation: "[A] = [A]₀ - kt",
    halfLife: "t₁/₂ = [A]₀/(2k)",
    color: "#10b981",
  },
}

// Calculate concentration based on reaction order and time
const calculateConcentration = (initialConcentration, rateConstant, time, reactionOrder) => {
  switch (reactionOrder) {
    case "first-order":
      return initialConcentration * Math.exp(-rateConstant * time)
    case "second-order":
      return 1 / (1 / initialConcentration + rateConstant * time)
    case "zero-order":
      return Math.max(0, initialConcentration - rateConstant * time)
    default:
      return initialConcentration
  }
}

// Calculate half-life
const calculateHalfLife = (initialConcentration, rateConstant, reactionOrder) => {
  switch (reactionOrder) {
    case "first-order":
      return Math.log(2) / rateConstant
    case "second-order":
      return 1 / (rateConstant * initialConcentration)
    case "zero-order":
      return initialConcentration / (2 * rateConstant)
    default:
      return 0
  }
}

export default function ReactionKineticsLab() {
  const [reactionOrder, setReactionOrder] = useState("first-order")
  const [initialConcentration, setInitialConcentration] = useState(1.0)
  const [rateConstant, setRateConstant] = useState(0.05)
  const [time, setTime] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [concentration, setConcentration] = useState(1.0)
  const [dataPoints, setDataPoints] = useState([])
  const [temperature, setTemperature] = useState(25)
  const [activationEnergy, setActivationEnergy] = useState(50)
  const [isMounted, setIsMounted] = useState(false)

  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const lastTimeRef = useRef(0)

  // Safe client-side rendering
  useEffect(() => {
    setIsMounted(true)
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  // Initialize simulation
  useEffect(() => {
    if (!isMounted) return

    resetSimulation()

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [reactionOrder, initialConcentration, rateConstant, isMounted])

  // Animation loop
  useEffect(() => {
    if (!isMounted) return

    if (isRunning) {
      const animate = (timestamp) => {
        if (!lastTimeRef.current) {
          lastTimeRef.current = timestamp
        }

        const deltaTime = timestamp - lastTimeRef.current

        if (deltaTime > 50) {
          // Update every 50ms
          lastTimeRef.current = timestamp

          setTime((prevTime) => {
            const newTime = prevTime + 0.05

            // Calculate new concentration
            const newConcentration = calculateConcentration(initialConcentration, rateConstant, newTime, reactionOrder)

            setConcentration(newConcentration)

            // Add data point every 0.5 time units
            if (Math.floor(newTime * 2) > Math.floor(prevTime * 2)) {
              setDataPoints((prev) => [...prev, { time: newTime, concentration: newConcentration }])
            }

            // Stop if concentration is very low or time is too high
            if (newConcentration < 0.01 || newTime > 50) {
              setIsRunning(false)
              return newTime
            }

            return newTime
          })
        }

        animationRef.current = requestAnimationFrame(animate)
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isRunning, initialConcentration, rateConstant, reactionOrder, isMounted])

  // Draw the reaction visualization
  useEffect(() => {
    if (!canvasRef.current || !isMounted) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    // Clear canvas
    ctx.clearRect(0, 0, width, height)

    // Draw beaker
    ctx.beginPath()
    ctx.moveTo(width * 0.2, height * 0.2)
    ctx.lineTo(width * 0.2, height * 0.8)
    ctx.lineTo(width * 0.8, height * 0.8)
    ctx.lineTo(width * 0.8, height * 0.2)
    ctx.strokeStyle = "#666"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw solution
    const solutionHeight = height * 0.6
    const particleCount = Math.floor(concentration * 100)

    // Fill solution
    ctx.fillStyle = reactions[reactionOrder].color
    ctx.globalAlpha = 0.2
    ctx.fillRect(width * 0.2, height * 0.8 - solutionHeight, width * 0.6, solutionHeight)
    ctx.globalAlpha = 1.0

    // Draw particles
    for (let i = 0; i < particleCount; i++) {
      const x = width * 0.2 + Math.random() * width * 0.6
      const y = height * 0.8 - Math.random() * solutionHeight

      ctx.beginPath()
      ctx.arc(x, y, 3, 0, Math.PI * 2)
      ctx.fillStyle = reactions[reactionOrder].color
      ctx.fill()
    }

    // Draw concentration indicator
    ctx.fillStyle = "#fff"
    ctx.font = "14px Arial"
    ctx.textAlign = "center"
    ctx.fillText(`[A] = ${concentration.toFixed(3)} M`, width / 2, height * 0.15)

    // Draw time
    ctx.fillText(`Time: ${time.toFixed(1)} s`, width / 2, height * 0.9)
  }, [concentration, reactionOrder, time, isMounted])

  // Reset the simulation
  const resetSimulation = () => {
    setTime(0)
    setIsRunning(false)
    setConcentration(initialConcentration)
    setDataPoints([{ time: 0, concentration: initialConcentration }])
    lastTimeRef.current = 0
  }

  // Calculate adjusted rate constant based on temperature (Arrhenius equation)
  const getAdjustedRateConstant = () => {
    const R = 8.314 / 1000 // Gas constant in kJ/(mol·K)
    const T1 = 273.15 + 25 // Reference temperature (25°C) in K
    const T2 = 273.15 + temperature // Current temperature in K

    // Arrhenius equation: k2 = k1 * exp[(Ea/R) * (1/T1 - 1/T2)]
    return rateConstant * Math.exp((activationEnergy / R) * (1 / T1 - 1 / T2))
  }

  // Calculate half-life
  const halfLife = calculateHalfLife(initialConcentration, rateConstant, reactionOrder)

  if (!isMounted) {
    return null // Return null on server-side to prevent hydration issues
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gray-950">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <br/>
          <br/>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-gray-800 bg-gray-900">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="mb-4 h-[400px] w-full max-w-md">
                    <canvas ref={canvasRef} width={400} height={400} className="h-full w-full" />
                  </div>

                  <div className="mt-4 flex w-full max-w-md flex-col gap-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-sm text-gray-400">Concentration: </span>
                        <span className="font-medium text-white">{concentration.toFixed(3)} M</span>
                      </div>
                      <div>
                        <span className="text-sm text-gray-400">Time: </span>
                        <span className="font-medium text-white">{time.toFixed(1)} s</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant={isRunning ? "destructive" : "default"}
                        onClick={() => setIsRunning(!isRunning)}
                        className="flex-1"
                      >
                        {isRunning ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                        {isRunning ? "Pause" : "Start"} Reaction
                      </Button>
                      <Button variant="outline" onClick={resetSimulation}>
                        <RefreshCw className="mr-2 h-4 w-4" />
                        Reset
                      </Button>
                    </div>

                    {/* Concentration vs Time Graph */}
                    <div className="mt-4 h-64 w-full rounded-lg border border-gray-800 bg-gray-950 p-4">
                      <div className="relative h-full w-full">
                        {/* Y-axis (Concentration) */}
                        <div className="absolute bottom-0 left-0 top-0 w-10 border-r border-gray-800">
                          {[0, 0.25, 0.5, 0.75, 1].map((value) => (
                            <div
                              key={value}
                              className="absolute left-0 flex w-full items-center justify-center"
                              style={{ bottom: `${value * 100}%` }}
                            >
                              <span className="text-xs text-gray-500">{value}</span>
                            </div>
                          ))}
                        </div>

                        {/* X-axis (Time) */}
                        <div className="absolute bottom-0 left-10 right-0 h-6 border-t border-gray-800">
                          {[0, 10, 20, 30, 40, 50].map((value) => (
                            <div
                              key={value}
                              className="absolute bottom-0 flex flex-col items-center"
                              style={{ left: `${(value / 50) * 100}%` }}
                            >
                              <span className="text-xs text-gray-500">{value}</span>
                            </div>
                          ))}
                        </div>

                        {/* Plot area */}
                        <div className="absolute bottom-6 left-10 right-0 top-0">
                          {/* Theoretical curve */}
                          <svg className="h-full w-full">
                            <path
                              d={Array.from({ length: 100 }, (_, i) => {
                                const t = (i / 100) * 50
                                const c = calculateConcentration(initialConcentration, rateConstant, t, reactionOrder)
                                const x = (t / 50) * 100 + "%"
                                const y = 100 - c * 100 + "%"
                                return `${i === 0 ? "M" : "L"} ${x} ${y}`
                              }).join(" ")}
                              fill="none"
                              stroke={reactions[reactionOrder].color}
                              strokeWidth="2"
                              strokeDasharray="4 2"
                              opacity="0.7"
                            />

                            {/* Data points */}
                            {dataPoints.map((point, i) => (
                              <circle
                                key={i}
                                cx={`${(point.time / 50) * 100}%`}
                                cy={`${100 - point.concentration * 100}%`}
                                r="3"
                                fill="#fff"
                              />
                            ))}

                            {/* Half-life marker */}
                            {reactionOrder === "first-order" && (
                              <line
                                x1={`${(halfLife / 50) * 100}%`}
                                y1="0%"
                                x2={`${(halfLife / 50) * 100}%`}
                                y2="100%"
                                stroke="#f59e0b"
                                strokeWidth="1"
                                strokeDasharray="4 2"
                              />
                            )}
                          </svg>
                        </div>

                        {/* Labels */}
                        <div className="absolute bottom-0 left-0 right-0 flex justify-center">
                          <span className="text-xs text-gray-400">Time (s)</span>
                        </div>
                        <div className="absolute left-0 top-1/2 -rotate-90 transform text-xs text-gray-400">
                          Concentration (M)
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-gray-800 bg-gray-900">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-white">Reaction Parameters</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reaction-order">Reaction Order</Label>
                    <Select value={reactionOrder} onValueChange={setReactionOrder}>
                      <SelectTrigger id="reaction-order" className="border-gray-800 bg-gray-950">
                        <SelectValue placeholder="Select reaction order" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="zero-order">Zero Order</SelectItem>
                        <SelectItem value="first-order">First Order</SelectItem>
                        <SelectItem value="second-order">Second Order</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="initial-concentration">Initial Concentration (M)</Label>
                      <span className="text-sm text-gray-400">{initialConcentration.toFixed(2)} M</span>
                    </div>
                    <Slider
                      id="initial-concentration"
                      min={0.1}
                      max={2}
                      step={0.1}
                      value={[initialConcentration]}
                      onValueChange={(value) => setInitialConcentration(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="rate-constant">Rate Constant (k)</Label>
                      <span className="text-sm text-gray-400">{rateConstant.toFixed(3)}</span>
                    </div>
                    <Slider
                      id="rate-constant"
                      min={0.01}
                      max={0.2}
                      step={0.01}
                      value={[rateConstant]}
                      onValueChange={(value) => setRateConstant(value[0])}
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="temperature">Temperature (°C)</Label>
                      <span className="text-sm text-gray-400">{temperature} °C</span>
                    </div>
                    <Slider
                      id="temperature"
                      min={0}
                      max={100}
                      step={1}
                      value={[temperature]}
                      onValueChange={(value) => setTemperature(value[0])}
                    />
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                    <h3 className="mb-2 text-lg font-medium text-white">{reactions[reactionOrder].name}</h3>
                    <p className="mb-4 text-sm text-gray-300">{reactions[reactionOrder].description}</p>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-gray-200">Reaction Equation:</p>
                      <p className="text-sm text-gray-300">{reactions[reactionOrder].equation}</p>

                      <p className="text-sm font-medium text-gray-200">Rate Equation:</p>
                      <p className="text-sm text-gray-300">{reactions[reactionOrder].rateEquation}</p>

                      <p className="text-sm font-medium text-gray-200">Integrated Rate Equation:</p>
                      <p className="text-sm text-gray-300">{reactions[reactionOrder].integratedRateEquation}</p>

                      <p className="text-sm font-medium text-gray-200">Half-Life:</p>
                      <p className="text-sm text-gray-300">{reactions[reactionOrder].halfLife}</p>

                      <p className="text-sm font-medium text-gray-200">Calculated Half-Life:</p>
                      <p className="text-sm text-gray-300">{halfLife.toFixed(2)} s</p>
                    </div>
                  </div>

                  <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                    <h3 className="mb-2 text-lg font-medium text-white">Examples</h3>
                    <ul className="space-y-1 text-sm text-gray-300">
                      {reactions[reactionOrder].examples.map((example, index) => (
                        <li key={index}>• {example}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
