"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Maximize2, Minimize2, Pause, Play, RotateCcw } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera, Text } from "@react-three/drei"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Pendulum component
function Pendulum({ length, gravity, initialAngle, isRunning }) {
  const pendulumRef = useRef()
  const bobRef = useRef()
  const timeRef = useRef(0)

  // Calculate the period of the pendulum
  const period = 2 * Math.PI * Math.sqrt(length / gravity)

  useFrame((state, delta) => {
    if (isRunning) {
      timeRef.current += delta

      // Simple harmonic motion equation for pendulum
      const angle = initialAngle * Math.cos(Math.sqrt(gravity / length) * timeRef.current)

      if (pendulumRef.current) {
        pendulumRef.current.rotation.z = angle
      }
    }
  })

  return (
    <group>
      {/* Stand */}
      <mesh position={[0, 2, 0]} castShadow>
        <boxGeometry args={[3, 0.2, 0.2]} />
        <meshStandardMaterial color="#555555" metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Pendulum arm */}
      <group ref={pendulumRef} position={[0, 2, 0]}>
        <mesh position={[0, -length / 2, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, length, 8]} />
          <meshStandardMaterial color="#888888" metalness={0.5} roughness={0.2} />
        </mesh>

        {/* Pendulum bob */}
        <mesh ref={bobRef} position={[0, -length, 0]} castShadow>
          <sphereGeometry args={[0.2, 32, 32]} />
          <meshStandardMaterial color="#CC3333" metalness={0.3} roughness={0.7} />
        </mesh>
      </group>

      {/* Base */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[4, 0.2, 1]} />
        <meshStandardMaterial color="#555555" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Measurement scale */}
      <group position={[0, 0.2, 0]}>
        {Array.from({ length: 9 }).map((_, i) => {
          const angle = ((i - 4) * Math.PI) / 16
          return (
            <group key={i} rotation={[0, 0, angle]}>
              <mesh position={[0, 0.05, 0]}>
                <boxGeometry args={[0.1, 0.02, 0.05]} />
                <meshStandardMaterial color="#FFFFFF" />
              </mesh>
              <Text position={[0, 0.15, 0]} rotation={[0, 0, -angle]} fontSize={0.1} color="#FFFFFF">
                {(i - 4) * 10}°
              </Text>
            </group>
          )
        })}
      </group>
    </group>
  )
}

// Graph component to show pendulum motion
function PendulumGraph({ length, gravity, initialAngle, isRunning }) {
  const canvasRef = useRef(null)
  const timeRef = useRef(0)
  const pointsRef = useRef([])

  // Calculate the period of the pendulum
  const period = 2 * Math.PI * Math.sqrt(length / gravity)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    const width = canvas.width
    const height = canvas.height

    // Animation function
    const animate = () => {
      if (!isRunning) {
        requestAnimationFrame(animate)
        return
      }

      // Clear canvas
      ctx.fillStyle = "#111111"
      ctx.fillRect(0, 0, width, height)

      // Draw grid
      ctx.strokeStyle = "#333333"
      ctx.lineWidth = 1

      // Vertical grid lines (time)
      for (let x = 0; x <= width; x += width / 10) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, height)
        ctx.stroke()
      }

      // Horizontal grid lines (angle)
      for (let y = 0; y <= height; y += height / 6) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      // Draw axes labels
      ctx.fillStyle = "#AAAAAA"
      ctx.font = "10px Arial"
      ctx.fillText("Time (s)", width - 40, height - 5)
      ctx.fillText("Angle (°)", 5, 10)

      // Update time
      timeRef.current += 0.016 // Approximately 60fps

      // Calculate current angle
      const angle = initialAngle * Math.cos(Math.sqrt(gravity / length) * timeRef.current)
      const angleInDegrees = angle * (180 / Math.PI)

      // Add point to graph
      pointsRef.current.push({
        time: timeRef.current,
        angle: angleInDegrees,
      })

      // Remove old points if too many
      if (pointsRef.current.length > 500) {
        pointsRef.current.shift()
      }

      // Draw graph
      ctx.strokeStyle = "#FF5555"
      ctx.lineWidth = 2
      ctx.beginPath()

      const maxTime = Math.max(period * 2, timeRef.current)

      pointsRef.current.forEach((point, i) => {
        const x = (point.time / maxTime) * width
        const y = height / 2 - (point.angle / 90) * (height / 2)

        if (i === 0) {
          ctx.moveTo(x, y)
        } else {
          ctx.lineTo(x, y)
        }
      })

      ctx.stroke()

      // Draw current angle indicator
      ctx.fillStyle = "#FFFFFF"
      ctx.font = "12px Arial"
      ctx.fillText(`Current Angle: ${angleInDegrees.toFixed(1)}°`, 10, height - 10)
      ctx.fillText(`Time: ${timeRef.current.toFixed(1)}s`, 10, height - 25)
      ctx.fillText(`Period: ${period.toFixed(2)}s`, 10, height - 40)

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      // Cleanup if needed
    }
  }, [isRunning, length, gravity, initialAngle, period])

  // Reset graph when parameters change
  useEffect(() => {
    timeRef.current = 0
    pointsRef.current = []
  }, [length, gravity, initialAngle])

  return <canvas ref={canvasRef} width={400} height={200} className="w-full rounded-lg border border-gray-800" />
}

export default function PendulumLab() {
  const [pendulumLength, setPendulumLength] = useState(1)
  const [gravity, setGravity] = useState(9.8)
  const [initialAngle, setInitialAngle] = useState(Math.PI / 6) // 30 degrees
  const [isRunning, setIsRunning] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => {
        setIsFullscreen(true)
      })
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false)
      })
    }
  }

  const resetSimulation = () => {
    setIsRunning(false)
    // Add a small delay to ensure the simulation stops before resetting
    setTimeout(() => {
      setInitialAngle(Math.PI / 6)
      setPendulumLength(1)
      setGravity(9.8)
    }, 100)
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gray-950">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <br/> <br/>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden bg-black">
              <div className={`relative ${isFullscreen ? "h-screen" : "h-[500px]"}`}>
                <Canvas shadows>
                  <PerspectiveCamera makeDefault position={[0, 1, 5]} />
                  <ambientLight intensity={0.5} />
                  <spotLight position={[5, 5, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
                  <Pendulum
                    length={pendulumLength}
                    gravity={gravity}
                    initialAngle={initialAngle}
                    isRunning={isRunning}
                  />
                  <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                  <Environment preset="studio" />
                  <gridHelper
                    args={[10, 10, "#444444", "#222222"]}
                    rotation={[Math.PI / 2, 0, 0]}
                    position={[0, 0, 0]}
                  />
                </Canvas>

                <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/70 p-2 backdrop-blur-sm">
                  <TooltipProvider>
                    <div className="flex items-center gap-2">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-700 bg-gray-900"
                            onClick={() => setIsRunning(!isRunning)}
                          >
                            {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isRunning ? "Pause" : "Start"} Simulation</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-700 bg-gray-900"
                            onClick={resetSimulation}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Reset Simulation</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-700 bg-gray-900"
                            onClick={toggleFullscreen}
                          >
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isFullscreen ? "Exit" : "Enter"} Fullscreen</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="text-xs text-white">
                      Period: {(2 * Math.PI * Math.sqrt(pendulumLength / gravity)).toFixed(2)} seconds
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="bg-gray-900">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-white">Pendulum Controls</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="length">Pendulum Length (m)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="length"
                        value={[pendulumLength]}
                        onValueChange={(value) => setPendulumLength(value[0])}
                        min={0.5}
                        max={2}
                        step={0.1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={pendulumLength}
                        onChange={(e) => setPendulumLength(Number(e.target.value))}
                        className="w-16 bg-gray-950"
                        min={0.5}
                        max={2}
                        step={0.1}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gravity">Gravity (m/s²)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="gravity"
                        value={[gravity]}
                        onValueChange={(value) => setGravity(value[0])}
                        min={1}
                        max={20}
                        step={0.1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={gravity}
                        onChange={(e) => setGravity(Number(e.target.value))}
                        className="w-16 bg-gray-950"
                        min={1}
                        max={20}
                        step={0.1}
                      />
                    </div>
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Moon: 1.6</span>
                      <span>Earth: 9.8</span>
                      <span>Jupiter: 24.8</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="angle">Initial Angle (degrees)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="angle"
                        value={[initialAngle * (180 / Math.PI)]}
                        onValueChange={(value) => setInitialAngle(value[0] * (Math.PI / 180))}
                        min={0}
                        max={90}
                        step={1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={(initialAngle * (180 / Math.PI)).toFixed(0)}
                        onChange={(e) => setInitialAngle(Number(e.target.value) * (Math.PI / 180))}
                        className="w-16 bg-gray-950"
                        min={0}
                        max={90}
                        step={1}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="mb-2 text-lg font-medium text-white">Motion Graph</h3>
                  <PendulumGraph
                    length={pendulumLength}
                    gravity={gravity}
                    initialAngle={initialAngle}
                    isRunning={isRunning}
                  />
                </div>

                <Tabs defaultValue="theory" className="mt-6">
                  <TabsList className="w-full bg-gray-800">
                    <TabsTrigger value="theory" className="flex-1">
                      Theory
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="flex-1">
                      Tasks
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="flex-1">
                      Notes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="theory" className="mt-4 text-sm text-gray-300">
                    <h3 className="mb-2 font-medium text-white">Simple Pendulum Motion</h3>
                    <p className="mb-3">
                      A simple pendulum consists of a mass (bob) attached to a weightless string. When displaced from
                      equilibrium and released, it oscillates about its equilibrium position.
                    </p>
                    <p className="mb-3">The period (T) of a simple pendulum is given by:</p>
                    <div className="mb-3 rounded bg-gray-950 p-2 text-center">T = 2π√(L/g)</div>
                    <p>
                      Where L is the length of the pendulum and g is the acceleration due to gravity. This formula is
                      valid for small angles of oscillation.
                    </p>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-4 text-sm text-gray-300">
                    <h3 className="mb-2 font-medium text-white">Lab Tasks</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>
                          Measure the period of the pendulum for different lengths and verify the relationship T ∝ √L
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>
                          Investigate how gravity affects the period by simulating the pendulum on different planets
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Observe how the amplitude of oscillation changes over time due to damping effects</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Calculate the maximum velocity of the pendulum bob at the lowest point of its swing</span>
                      </li>
                    </ul>
                  </TabsContent>

                  <TabsContent value="notes" className="mt-4">
                    <textarea
                      className="h-[150px] w-full rounded-md border border-gray-800 bg-gray-950 p-2 text-sm text-white"
                      placeholder="Take notes about your observations here..."
                    ></textarea>
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
