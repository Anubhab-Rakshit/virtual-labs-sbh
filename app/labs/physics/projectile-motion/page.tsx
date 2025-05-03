"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Maximize2, Minimize2, RefreshCw } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { OrbitControls, Text } from "@react-three/drei"
import * as THREE from "three"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

function ProjectileMotion({ initialVelocity, angle, gravity }) {
  const meshRef = useRef()
  const pathRef = useRef()
  const textRef = useRef()

  const [positions, setPositions] = useState([])
  const [time, setTime] = useState(0)
  const [maxHeight, setMaxHeight] = useState(0)
  const [range, setRange] = useState(0)
  const [flightTime, setFlightTime] = useState(0)
  const [isSimulating, setIsSimulating] = useState(true)

  // Convert angle to radians
  const angleRad = (angle * Math.PI) / 180

  // Calculate initial velocity components
  const v0x = initialVelocity * Math.cos(angleRad)
  const v0y = initialVelocity * Math.sin(angleRad)

  // Calculate theoretical values
  useEffect(() => {
    // Maximum height: h = (v0y)^2 / (2g)
    const maxH = (v0y * v0y) / (2 * gravity)

    // Time of flight: t = 2 * v0y / g
    const timeOfFlight = (2 * v0y) / gravity

    // Range: R = v0x * timeOfFlight
    const maxRange = v0x * timeOfFlight

    setMaxHeight(maxH)
    setFlightTime(timeOfFlight)
    setRange(maxRange)

    // Generate path points
    const points = []
    const steps = 100
    const dt = timeOfFlight / steps

    for (let i = 0; i <= steps; i++) {
      const t = i * dt
      const x = v0x * t
      const y = v0y * t - 0.5 * gravity * t * t

      if (y >= 0) {
        points.push(new THREE.Vector3(x, y, 0))
      }
    }

    setPositions(points)
    setTime(0)
    setIsSimulating(true)
  }, [initialVelocity, angle, gravity, v0x, v0y])

  useFrame(({ clock }) => {
    if (!isSimulating || !meshRef.current) return

    // Update time
    const t = (clock.getElapsedTime() % flightTime) * 0.5
    setTime(t)

    // Calculate position at time t
    const x = v0x * t
    const y = v0y * t - 0.5 * gravity * t * t

    // Update projectile position
    if (y >= 0) {
      meshRef.current.position.x = x
      meshRef.current.position.y = y

      // Update text position
      if (textRef.current) {
        textRef.current.position.x = x
        textRef.current.position.y = y + 0.5
      }
    } else {
      meshRef.current.position.y = 0
      if (textRef.current) {
        textRef.current.position.y = 0.5
      }
    }
  })

  // Create a line for the trajectory
  useEffect(() => {
    if (pathRef.current && positions.length > 0) {
      pathRef.current.geometry.setFromPoints(positions)
    }
  }, [positions])

  return (
    <>
      {/* Ground */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[range / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[range * 1.5, 10]} />
        <meshStandardMaterial color="#3a5a40" />
      </mesh>

      {/* Origin marker */}
      <mesh position={[0, 0.1, 0]}>
        <cylinderGeometry args={[0.2, 0.2, 0.1, 32]} />
        <meshStandardMaterial color="#e63946" />
      </mesh>

      {/* Projectile */}
      <mesh ref={meshRef} position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.3, 32, 32]} />
        <meshStandardMaterial color="#ffb703" />
      </mesh>

      {/* Trajectory path */}
      <line ref={pathRef}>
        <bufferGeometry />
        <lineBasicMaterial color="#a8dadc" dashSize={1} gapSize={0.5} />
      </line>

      {/* Position text */}
      <Text ref={textRef} position={[0, 0.5, 0]} color="#ffffff" fontSize={0.3} anchorX="center" anchorY="middle">
        {`(${meshRef.current ? meshRef.current.position.x.toFixed(1) : 0}, ${
          meshRef.current ? meshRef.current.position.y.toFixed(1) : 0
        })`}
      </Text>

      {/* Grid helper */}
      <gridHelper args={[range * 1.5, 20, "#888888", "#444444"]} position={[range / 2, 0, 0]} />

      {/* Axes */}
      <axesHelper args={[Math.max(range, maxHeight) * 1.2]} />

      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1} castShadow />
    </>
  )
}

export default function ProjectileMotionPage() {
  const [initialVelocity, setInitialVelocity] = useState(10)
  const [angle, setAngle] = useState(45)
  const [gravity, setGravity] = useState(9.8)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const containerRef = useRef(null)

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`)
      })
    } else {
      document.exitFullscreen()
    }
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  const resetSimulation = () => {
    setInitialVelocity(10)
    setAngle(45)
    setGravity(9.8)
  }

  // Calculate theoretical values
  const angleRad = (angle * Math.PI) / 180
  const v0x = initialVelocity * Math.cos(angleRad)
  const v0y = initialVelocity * Math.sin(angleRad)
  const maxHeight = (v0y * v0y) / (2 * gravity)
  const flightTime = (2 * v0y) / gravity
  const range = v0x * flightTime

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-blue-900 pb-20 pt-16">
      <div className="container mx-auto px-4">
        <div className="mb-6 flex items-center justify-between">
          <br/><br/>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-2">
            <div
              ref={containerRef}
              className={`relative h-[500px] overflow-hidden rounded-lg bg-black/30 shadow-xl ${
                isFullscreen ? "h-screen w-screen" : ""
              }`}
            >
              <Canvas shadows camera={{ position: [0, 5, 15], fov: 50 }}>
                <ProjectileMotion initialVelocity={initialVelocity} angle={angle} gravity={gravity} />
                <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
              </Canvas>

              <Button
                variant="outline"
                size="icon"
                className="absolute right-4 top-4 bg-black/50 text-white hover:bg-black/70"
                onClick={toggleFullscreen}
              >
                {isFullscreen ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
              </Button>
            </div>
          </div>

          <div>
            <Card className="border-0 bg-black/30 shadow-xl backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-white">Controls</h2>
                  <Button variant="outline" size="sm" onClick={resetSimulation}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Reset
                  </Button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="velocity" className="text-sm text-gray-300">
                        Initial Velocity (m/s)
                      </Label>
                      <span className="text-sm font-medium text-white">{initialVelocity.toFixed(1)}</span>
                    </div>
                    <Slider
                      id="velocity"
                      min={1}
                      max={30}
                      step={0.1}
                      value={[initialVelocity]}
                      onValueChange={(value) => setInitialVelocity(value[0])}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="angle" className="text-sm text-gray-300">
                        Launch Angle (degrees)
                      </Label>
                      <span className="text-sm font-medium text-white">{angle.toFixed(1)}°</span>
                    </div>
                    <Slider
                      id="angle"
                      min={0}
                      max={90}
                      step={0.5}
                      value={[angle]}
                      onValueChange={(value) => setAngle(value[0])}
                      className="py-2"
                    />
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="gravity" className="text-sm text-gray-300">
                        Gravity (m/s²)
                      </Label>
                      <span className="text-sm font-medium text-white">{gravity.toFixed(1)}</span>
                    </div>
                    <Slider
                      id="gravity"
                      min={1}
                      max={20}
                      step={0.1}
                      value={[gravity]}
                      onValueChange={(value) => setGravity(value[0])}
                      className="py-2"
                    />
                    <div className="mt-1 flex justify-between text-xs text-gray-400">
                      <span>Moon (1.6)</span>
                      <span>Earth (9.8)</span>
                      <span>Jupiter (24.8)</span>
                    </div>
                  </div>

                  <Separator className="my-4 bg-gray-700" />

                  <div className="space-y-3 rounded-lg bg-blue-900/30 p-4">
                    <h3 className="font-medium text-blue-200">Calculated Values</h3>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>
                        <p className="text-gray-400">Maximum Height:</p>
                        <p className="font-medium text-white">{maxHeight.toFixed(2)} m</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Range:</p>
                        <p className="font-medium text-white">{range.toFixed(2)} m</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Flight Time:</p>
                        <p className="font-medium text-white">{flightTime.toFixed(2)} s</p>
                      </div>
                      <div>
                        <p className="text-gray-400">Initial Speed:</p>
                        <p className="font-medium text-white">{initialVelocity.toFixed(2)} m/s</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mt-6 border-0 bg-black/30 shadow-xl backdrop-blur-sm">
              <CardContent className="p-6">
                <Tabs defaultValue="theory">
                  <TabsList className="grid w-full grid-cols-2 bg-black/20">
                    <TabsTrigger value="theory">Theory</TabsTrigger>
                    <TabsTrigger value="equations">Equations</TabsTrigger>
                  </TabsList>
                  <TabsContent value="theory" className="mt-4 text-sm text-gray-300">
                    <p>
                      Projectile motion is a form of motion where an object is thrown near Earth's surface and moves
                      along a curved path under the action of gravity only. The path followed by a projectile is called
                      its trajectory.
                    </p>
                    <p className="mt-2">
                      The horizontal motion is constant (no acceleration), while the vertical motion is subject to
                      gravity's acceleration. This creates the characteristic parabolic trajectory.
                    </p>
                  </TabsContent>
                  <TabsContent value="equations" className="mt-4 space-y-3 text-sm">
                    <div>
                      <p className="text-blue-300">Horizontal position:</p>
                      <p className="mt-1 font-mono text-white">x = v₀ cos(θ) × t</p>
                    </div>
                    <div>
                      <p className="text-blue-300">Vertical position:</p>
                      <p className="mt-1 font-mono text-white">y = v₀ sin(θ) × t - ½gt²</p>
                    </div>
                    <div>
                      <p className="text-blue-300">Maximum height:</p>
                      <p className="mt-1 font-mono text-white">h = (v₀ sin(θ))² / (2g)</p>
                    </div>
                    <div>
                      <p className="text-blue-300">Range:</p>
                      <p className="mt-1 font-mono text-white">R = (v₀² sin(2θ)) / g</p>
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
