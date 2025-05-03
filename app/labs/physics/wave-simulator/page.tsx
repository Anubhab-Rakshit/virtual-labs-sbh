"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Maximize2, Minimize2, Pause, Play, RotateCcw } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Wave component
function WaveSurface({ waveType, amplitude, frequency, damping, isRunning, resolution = 50, color = "#3B82F6" }) {
  const meshRef = useRef()
  const timeRef = useRef(0)

  // Create geometry for the wave
  useFrame((state, delta) => {
    if (!meshRef.current || !isRunning) return

    timeRef.current += delta

    const geometry = meshRef.current.geometry
    const positions = geometry.attributes.position
    const size = resolution + 1

    // Update vertices based on the wave type
    for (let i = 0; i <= resolution; i++) {
      const x = (i / resolution - 0.5) * 10

      for (let j = 0; j <= resolution; j++) {
        const z = (j / resolution - 0.5) * 10
        let y = 0

        const distance = Math.sqrt(x * x + z * z)

        switch (waveType) {
          case "sine":
            y = amplitude * Math.sin(frequency * x + timeRef.current * 2)
            break
          case "circular":
            y = amplitude * Math.sin(frequency * distance - timeRef.current * 3)
            break
          case "ripple":
            const decay = Math.exp(-damping * distance)
            y = amplitude * decay * Math.sin(frequency * distance - timeRef.current * 3)
            break
          case "interference":
            const wave1 = amplitude * 0.5 * Math.sin(frequency * x + timeRef.current * 2)
            const wave2 = amplitude * 0.5 * Math.sin(frequency * z + timeRef.current * 2)
            y = wave1 + wave2
            break
          default:
            y = 0
        }

        // Set vertex position
        const index = i * size + j
        positions.setY(index, y)
      }
    }

    positions.needsUpdate = true
    geometry.computeVertexNormals()
  })

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
      <planeGeometry args={[10, 10, resolution, resolution]} />
      <meshStandardMaterial color={color} side={THREE.DoubleSide} wireframe={false} transparent={true} opacity={0.8} />
    </mesh>
  )
}

// Water surface for the wave
function WaterSurface() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.1, 0]} receiveShadow>
      <planeGeometry args={[20, 20]} />
      <meshStandardMaterial color="#1E3A8A" transparent={true} opacity={0.3} metalness={0.2} roughness={0.1} />
    </mesh>
  )
}

export default function WaveSimulatorLab() {
  const [waveType, setWaveType] = useState("sine")
  const [amplitude, setAmplitude] = useState(0.5)
  const [frequency, setFrequency] = useState(1)
  const [damping, setDamping] = useState(0.5)
  const [isRunning, setIsRunning] = useState(true)
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
      setWaveType("sine")
      setAmplitude(0.5)
      setFrequency(1)
      setDamping(0.5)
      setIsRunning(true)
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
                  <PerspectiveCamera makeDefault position={[0, 5, 10]} />
                  <ambientLight intensity={0.5} />
                  <spotLight position={[5, 10, 5]} angle={0.15} penumbra={1} intensity={1} castShadow />
                  <WaveSurface
                    waveType={waveType}
                    amplitude={amplitude}
                    frequency={frequency}
                    damping={damping}
                    isRunning={isRunning}
                  />
                  <WaterSurface />
                  <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
                  <Environment preset="sunset" />
                  <gridHelper args={[20, 20, "#444444", "#222222"]} position={[0, -0.05, 0]} />
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
                      Wave Type: {waveType.charAt(0).toUpperCase() + waveType.slice(1)}
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="bg-gray-900">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-white">Wave Controls</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="waveType">Wave Type</Label>
                    <Select value={waveType} onValueChange={setWaveType}>
                      <SelectTrigger id="waveType" className="border-gray-800 bg-gray-950">
                        <SelectValue placeholder="Select wave type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sine">Sine Wave</SelectItem>
                        <SelectItem value="circular">Circular Wave</SelectItem>
                        <SelectItem value="ripple">Ripple Wave</SelectItem>
                        <SelectItem value="interference">Interference Pattern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="amplitude">Amplitude</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="amplitude"
                        value={[amplitude]}
                        onValueChange={(value) => setAmplitude(value[0])}
                        min={0.1}
                        max={2}
                        step={0.1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={amplitude}
                        onChange={(e) => setAmplitude(Number(e.target.value))}
                        className="w-16 bg-gray-950"
                        min={0.1}
                        max={2}
                        step={0.1}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="frequency">Frequency</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="frequency"
                        value={[frequency]}
                        onValueChange={(value) => setFrequency(value[0])}
                        min={0.1}
                        max={3}
                        step={0.1}
                        className="flex-1"
                      />
                      <Input
                        type="number"
                        value={frequency}
                        onChange={(e) => setFrequency(Number(e.target.value))}
                        className="w-16 bg-gray-950"
                        min={0.1}
                        max={3}
                        step={0.1}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="damping">Damping (for Ripple)</Label>
                    <div className="flex items-center gap-2">
                      <Slider
                        id="damping"
                        value={[damping]}
                        onValueChange={(value) => setDamping(value[0])}
                        min={0}
                        max={1}
                        step={0.1}
                        className="flex-1"
                        disabled={waveType !== "ripple"}
                      />
                      <Input
                        type="number"
                        value={damping}
                        onChange={(e) => setDamping(Number(e.target.value))}
                        className="w-16 bg-gray-950"
                        min={0}
                        max={1}
                        step={0.1}
                        disabled={waveType !== "ripple"}
                      />
                    </div>
                  </div>
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
                    <h3 className="mb-2 font-medium text-white">Wave Mechanics</h3>
                    <p className="mb-3">
                      Waves are disturbances that transfer energy through matter or space. They are characterized by
                      several properties:
                    </p>
                    <ul className="ml-5 list-disc space-y-1">
                      <li>
                        <span className="font-medium text-white">Amplitude:</span> The maximum displacement from
                        equilibrium.
                      </li>
                      <li>
                        <span className="font-medium text-white">Frequency:</span> The number of complete waves that
                        pass a point in a given time.
                      </li>
                      <li>
                        <span className="font-medium text-white">Wavelength:</span> The distance between consecutive
                        corresponding points on a wave.
                      </li>
                      <li>
                        <span className="font-medium text-white">Speed:</span> The rate at which the wave propagates
                        through the medium.
                      </li>
                    </ul>
                    <p className="mt-3">
                      The relationship between these properties is given by the wave equation: v = fλ, where v is the
                      wave speed, f is the frequency, and λ is the wavelength.
                    </p>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-4 text-sm text-gray-300">
                    <h3 className="mb-2 font-medium text-white">Lab Tasks</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>
                          Observe how changing the amplitude affects the height of the wave without changing its
                          frequency
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Investigate how frequency affects the number of wave cycles in a given distance</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Compare the different wave types and their propagation patterns</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>
                          For the ripple wave, observe how the damping factor affects the decay of the wave amplitude
                          with distance
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>
                          Identify constructive and destructive interference patterns in the interference wave type
                        </span>
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
