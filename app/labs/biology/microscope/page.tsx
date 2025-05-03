"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, ChevronDown, ChevronUp, Maximize2, Minimize2, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera } from "@react-three/drei"
import * as THREE from "three"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Microscope model component
function Microscope(props) {
  const group = useRef()
  const baseColor = new THREE.Color("#444444")
  const metalColor = new THREE.Color("#888888")

  useFrame(() => {
    if (group.current && props.rotate) {
      group.current.rotation.y += 0.005
    }
  })

  return (
    <group ref={group} {...props} position={[0, -1, 0]} scale={[0.5, 0.5, 0.5]}>
      {/* Base */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[2, 2.5, 0.5, 32]} />
        <meshStandardMaterial color={baseColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Arm */}
      <mesh position={[0, 2, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.8, 4, 0.8]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Head */}
      <mesh position={[0, 4, 1]} rotation={[Math.PI / 4, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.6, 0.6, 2, 32]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
      </mesh>

      {/* Eyepiece */}
      <mesh position={[0, 4.5, 1.8]} rotation={[Math.PI / 4, 0, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.4, 0.3, 0.5, 32]} />
        <meshStandardMaterial color={baseColor} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Objective lenses */}
      <group position={[0, 2.5, 1.2]} rotation={[Math.PI / 4, 0, 0]}>
        <mesh position={[0.5, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.4, 32]} />
          <meshStandardMaterial color={baseColor} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.6, 32]} />
          <meshStandardMaterial color={baseColor} metalness={0.5} roughness={0.3} />
        </mesh>
        <mesh position={[-0.5, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.2, 0.25, 0.8, 32]} />
          <meshStandardMaterial color={baseColor} metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Stage */}
      <mesh position={[0, 1.5, 0.5]} castShadow receiveShadow>
        <boxGeometry args={[2, 0.2, 2]} />
        <meshStandardMaterial color={baseColor} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Sample slide */}
      <mesh position={[0, 1.65, 0.5]} castShadow receiveShadow scale={[1, 1, 1].map((v) => v * props.slideScale)}>
        <boxGeometry args={[1, 0.05, 1]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.8} />
      </mesh>

      {/* Sample */}
      <mesh position={[0, 1.68, 0.5]} castShadow receiveShadow scale={[1, 1, 1].map((v) => v * props.slideScale)}>
        <circleGeometry args={[0.4, 32]} />
        <meshStandardMaterial color="#88CCFF" transparent opacity={0.7} />
      </mesh>

      {/* Focus knobs */}
      <mesh position={[0.8, 1.5, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
      </mesh>
      <mesh position={[0.8, 1.2, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.25, 0.25, 0.1, 32]} rotation={[0, 0, Math.PI / 2]} />
        <meshStandardMaterial color={metalColor} metalness={0.8} roughness={0.2} />
      </mesh>
    </group>
  )
}

// Sample viewer component
function SampleViewer({ zoomLevel }) {
  const samples = [
    { color: "#FF8888", size: 0.5, count: 3 }, // Low magnification
    { color: "#88FF88", size: 0.3, count: 8 }, // Medium magnification
    { color: "#8888FF", size: 0.15, count: 20 }, // High magnification
  ]

  const zoomIndex = Math.min(Math.floor(zoomLevel / 33.33), 2)
  const currentSample = samples[zoomIndex]

  return (
    <group>
      {Array.from({ length: currentSample.count }).map((_, i) => {
        const angle = (i / currentSample.count) * Math.PI * 2
        const radius = 0.6 - zoomIndex * 0.2
        const x = Math.cos(angle) * radius * (1 + Math.random() * 0.3)
        const y = Math.sin(angle) * radius * (1 + Math.random() * 0.3)

        return (
          <mesh key={i} position={[x, y, 0]}>
            <circleGeometry args={[currentSample.size * (0.8 + Math.random() * 0.4), 32]} />
            <meshBasicMaterial color={currentSample.color} transparent opacity={0.8} />
          </mesh>
        )
      })}
    </group>
  )
}

// Camera controller
function CameraController({ zoomLevel }) {
  const { camera } = useThree()

  useEffect(() => {
    const zoom = 5 + (zoomLevel / 100) * 15
    camera.zoom = zoom
    camera.updateProjectionMatrix()
  }, [zoomLevel, camera])

  return null
}

// Client-side only component for fullscreen functionality
function FullscreenButton({ isFullscreen, setIsFullscreen }) {
  // Reference to track if component is mounted
  const isMounted = useRef(true)

  // State to track if we're in a browser environment
  const [isBrowser, setIsBrowser] = useState(false)

  // Effect to set browser state - runs once after mount
  useEffect(() => {
    setIsBrowser(true)

    // Cleanup function
    return () => {
      isMounted.current = false
    }
  }, [])

  // Only set up fullscreen detection after confirming we're in browser
  useEffect(() => {
    if (!isBrowser) return

    // Instead of using event listeners, poll for fullscreen state changes
    const checkFullscreenInterval = setInterval(() => {
      try {
        // Only update state if component is still mounted
        if (isMounted.current && typeof document !== "undefined" && document) {
          const isCurrentlyFullscreen = !!document.fullscreenElement
          if (isFullscreen !== isCurrentlyFullscreen) {
            setIsFullscreen(isCurrentlyFullscreen)
          }
        }
      } catch (err) {
        console.error("Error checking fullscreen state:", err)
      }
    }, 500) // Check every 500ms

    // Cleanup interval
    return () => {
      clearInterval(checkFullscreenInterval)
    }
  }, [isBrowser, isFullscreen, setIsFullscreen])

  // Function to toggle fullscreen with multiple safety checks
  const toggleFullscreen = () => {
    try {
      // Multiple layers of checks
      if (!isBrowser || typeof document === "undefined" || !document) return

      if (!document.fullscreenElement) {
        // Check if the API exists before calling
        if (document.documentElement && document.documentElement.requestFullscreen) {
          document.documentElement.requestFullscreen().catch((err) => {
            console.error("Error attempting to enable fullscreen:", err)
          })
        }
      } else if (document.exitFullscreen) {
        document.exitFullscreen().catch((err) => {
          console.error("Error attempting to exit fullscreen:", err)
        })
      }
    } catch (error) {
      console.error("Fullscreen API error:", error)
    }
  }

  // Only render the button if we're in a browser
  if (!isBrowser) return null

  return (
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
  )
}

export default function MicroscopeLab() {
  const [zoomLevel, setZoomLevel] = useState(30)
  const [isRotating, setIsRotating] = useState(false)
  const [slideScale, setSlideScale] = useState(1)
  const [isFullscreen, setIsFullscreen] = useState(false)

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
                  <PerspectiveCamera makeDefault position={[0, 0, 5]} />
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                  <Microscope rotate={isRotating} slideScale={slideScale} />
                  <OrbitControls enablePan={true} enableZoom={true} enableRotate={!isRotating} />
                  <Environment preset="studio" />
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
                            onClick={() => setIsRotating(!isRotating)}
                          >
                            <RotateCcw className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isRotating ? "Stop" : "Start"} Rotation</p>
                        </TooltipContent>
                      </Tooltip>

                      {/* Fullscreen button is now a client-only component */}
                      <FullscreenButton isFullscreen={isFullscreen} setIsFullscreen={setIsFullscreen} />
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white">Slide Position:</span>
                      <div className="flex items-center gap-1">
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 border-gray-700 bg-gray-900 p-1"
                          onClick={() => setSlideScale(Math.max(slideScale - 0.1, 0.5))}
                        >
                          <ChevronDown className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-6 w-6 border-gray-700 bg-gray-900 p-1"
                          onClick={() => setSlideScale(Math.min(slideScale + 0.1, 1.5))}
                        >
                          <ChevronUp className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="bg-gray-900">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-white">Sample Viewer</h2>

                <div className="mb-6 rounded-lg bg-black p-4">
                  <div className="relative h-[200px] w-full rounded-lg border border-gray-800">
                    <Canvas orthographic>
                      <CameraController zoomLevel={zoomLevel} />
                      <SampleViewer zoomLevel={zoomLevel} />
                    </Canvas>

                    <div className="absolute bottom-2 right-2 rounded bg-black/70 px-2 py-1 text-xs text-white backdrop-blur-sm">
                      {zoomLevel < 33 ? "Low" : zoomLevel < 66 ? "Medium" : "High"} Magnification
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2">
                    <ZoomOut className="h-4 w-4 text-gray-400" />
                    <Slider
                      value={[zoomLevel]}
                      onValueChange={(value) => setZoomLevel(value[0])}
                      min={0}
                      max={100}
                      step={1}
                      className="flex-1"
                    />
                    <ZoomIn className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <Tabs defaultValue="info">
                  <TabsList className="w-full bg-gray-800">
                    <TabsTrigger value="info" className="flex-1">
                      Info
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="flex-1">
                      Tasks
                    </TabsTrigger>
                    <TabsTrigger value="notes" className="flex-1">
                      Notes
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="mt-4 text-sm text-gray-300">
                    <h3 className="mb-2 font-medium text-white">Cell Structure Observation</h3>
                    <p className="mb-3">
                      This virtual microscope allows you to observe cell structures at different magnifications. The
                      sample contains human epithelial cells.
                    </p>
                    <ul className="ml-5 list-disc space-y-1">
                      <li>Use the zoom slider to adjust magnification</li>
                      <li>Rotate the microscope to view from different angles</li>
                      <li>Adjust the slide position to focus on different areas</li>
                    </ul>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-4 text-sm text-gray-300">
                    <h3 className="mb-2 font-medium text-white">Lab Tasks</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Identify the cell membrane at high magnification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Count the number of visible cells at low magnification</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Identify the nucleus in at least 3 different cells</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Draw and label the observed cell structures in your notes</span>
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
