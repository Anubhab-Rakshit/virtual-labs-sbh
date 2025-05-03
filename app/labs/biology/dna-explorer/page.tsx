"use client"

import { useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Maximize2, Minimize2, RotateCcw, RotateCw, ZoomIn, ZoomOut } from "lucide-react"
import { Canvas, useFrame } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera, Text } from "@react-three/drei"
import * as THREE from "three"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// DNA Base Pair component
function BasePair({ position, type, rotation = 0 }) {
  // Colors for different nucleotides
  const colors = {
    AT: { base1: "#FF5555", base2: "#55FF55" }, // Adenine-Thymine
    GC: { base1: "#5555FF", base2: "#FFFF55" }, // Guanine-Cytosine
  }

  const { base1, base2 } = colors[type]

  return (
    <group position={position} rotation={[0, rotation, 0]}>
      {/* Base pair connection (hydrogen bonds) */}
      <mesh position={[0, 0, 0]} castShadow>
        <boxGeometry args={[1.2, 0.1, 0.1]} />
        <meshStandardMaterial color="#FFFFFF" transparent opacity={0.6} />
      </mesh>

      {/* Base 1 */}
      <mesh position={[-0.7, 0, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={base1} />
      </mesh>

      {/* Base 2 */}
      <mesh position={[0.7, 0, 0]} castShadow>
        <sphereGeometry args={[0.2, 16, 16]} />
        <meshStandardMaterial color={base2} />
      </mesh>

      {/* Base labels */}
      <Text position={[-0.7, 0.3, 0]} fontSize={0.2} color="#FFFFFF">
        {type[0]}
      </Text>
      <Text position={[0.7, 0.3, 0]} fontSize={0.2} color="#FFFFFF">
        {type[1]}
      </Text>
    </group>
  )
}

// DNA Backbone component
function Backbone({ points, color }) {
  const curve = new THREE.CatmullRomCurve3(points.map((point) => new THREE.Vector3(...point)))
  const tubeGeometry = new THREE.TubeGeometry(curve, points.length * 4, 0.1, 8, false)

  return (
    <mesh castShadow>
      <primitive object={tubeGeometry} />
      <meshStandardMaterial color={color} />
    </mesh>
  )
}

// Complete DNA Model
function DNAModel({ basePairs = 10, rotationSpeed = 0, isRotating = false, zoom = 1 }) {
  const groupRef = useRef()

  useFrame((state, delta) => {
    if (isRotating && groupRef.current) {
      groupRef.current.rotation.y += delta * rotationSpeed
    }
  })

  // Generate DNA structure
  const dnaHeight = basePairs * 0.6
  const basePairTypes = ["AT", "GC"]
  const twistsPerBasePair = 0.6 // Controls how many twists per base pair

  // Generate backbone points
  const backbonePoints1 = []
  const backbonePoints2 = []

  for (let i = 0; i <= basePairs; i++) {
    const y = i * 0.6 - dnaHeight / 2
    const angle = i * Math.PI * twistsPerBasePair
    backbonePoints1.push([Math.cos(angle) * 0.8, y, Math.sin(angle) * 0.8])
    backbonePoints2.push([Math.cos(angle + Math.PI) * 0.8, y, Math.sin(angle + Math.PI) * 0.8])
  }

  return (
    <group ref={groupRef} scale={[zoom, zoom, zoom]}>
      {/* DNA Backbones */}
      <Backbone points={backbonePoints1} color="#FF8888" />
      <Backbone points={backbonePoints2} color="#8888FF" />

      {/* Base Pairs */}
      {Array.from({ length: basePairs }).map((_, i) => {
        const y = i * 0.6 - dnaHeight / 2 + 0.3
        const angle = i * Math.PI * twistsPerBasePair
        const type = basePairTypes[i % basePairTypes.length]
        return <BasePair key={i} position={[0, y, 0]} type={type} rotation={angle} />
      })}
    </group>
  )
}

export default function DNAExplorerLab() {
  const [basePairs, setBasePairs] = useState(10)
  const [rotationSpeed, setRotationSpeed] = useState(0.5)
  const [isRotating, setIsRotating] = useState(false)
  const [zoom, setZoom] = useState(1)
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

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gray-950">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <br/>
          <br/>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden bg-black">
              <div className={`relative ${isFullscreen ? "h-screen" : "h-[500px]"}`}>
                <Canvas shadows>
                  <PerspectiveCamera makeDefault position={[0, 0, 10]} />
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                  <DNAModel basePairs={basePairs} rotationSpeed={rotationSpeed} isRotating={isRotating} zoom={zoom} />
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
                            {isRotating ? <RotateCcw className="h-4 w-4" /> : <RotateCw className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isRotating ? "Stop" : "Start"} Rotation</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-700 bg-gray-900"
                            onClick={() => setZoom(Math.max(zoom - 0.2, 0.4))}
                          >
                            <ZoomOut className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Zoom Out</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-700 bg-gray-900"
                            onClick={() => setZoom(Math.min(zoom + 0.2, 2))}
                          >
                            <ZoomIn className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Zoom In</p>
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
                      Base Pairs: {basePairs} | Zoom: {(zoom * 100).toFixed(0)}%
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="bg-gray-900">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-white">DNA Controls</h2>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Number of Base Pairs</label>
                    <Slider
                      value={[basePairs]}
                      onValueChange={(value) => setBasePairs(value[0])}
                      min={5}
                      max={20}
                      step={1}
                      className="flex-1"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>5</span>
                      <span>10</span>
                      <span>15</span>
                      <span>20</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-200">Rotation Speed</label>
                    <Slider
                      value={[rotationSpeed * 10]}
                      onValueChange={(value) => setRotationSpeed(value[0] / 10)}
                      min={0}
                      max={10}
                      step={1}
                      className="flex-1"
                    />
                    <div className="flex justify-between text-xs text-gray-400">
                      <span>Slow</span>
                      <span>Medium</span>
                      <span>Fast</span>
                    </div>
                  </div>

                  <div className="mt-4 flex justify-end">
                    <Button variant="outline" size="sm" className="border-gray-700 bg-gray-900">
                      <Download className="mr-2 h-4 w-4" />
                      Export Model
                    </Button>
                  </div>
                </div>

                <Tabs defaultValue="info" className="mt-6">
                  <TabsList className="w-full bg-gray-800">
                    <TabsTrigger value="info" className="flex-1">
                      Info
                    </TabsTrigger>
                    <TabsTrigger value="structure" className="flex-1">
                      Structure
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="flex-1">
                      Tasks
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="info" className="mt-4 text-sm text-gray-300">
                    <h3 className="mb-2 font-medium text-white">DNA Structure</h3>
                    <p className="mb-3">
                      DNA (deoxyribonucleic acid) is a molecule composed of two strands that coil around each other to
                      form a double helix carrying genetic instructions for the development, functioning, growth and
                      reproduction of all known organisms.
                    </p>
                    <p>
                      The DNA double helix is stabilized by hydrogen bonds between the bases attached to the two
                      strands. The four bases found in DNA are adenine (A), cytosine (C), guanine (G) and thymine (T).
                      These bases pair up with each other, A with T and C with G, to form units called base pairs.
                    </p>
                  </TabsContent>

                  <TabsContent value="structure" className="mt-4 text-sm text-gray-300">
                    <h3 className="mb-2 font-medium text-white">DNA Components</h3>
                    <ul className="ml-5 list-disc space-y-1">
                      <li>
                        <span className="font-medium text-white">Sugar-Phosphate Backbone:</span> The backbone of the
                        DNA strand is made of alternating sugar and phosphate groups.
                      </li>
                      <li>
                        <span className="font-medium text-white">Nucleotides:</span> The building blocks of DNA,
                        consisting of a sugar, a phosphate group, and a nitrogenous base.
                      </li>
                      <li>
                        <span className="font-medium text-white">Base Pairs:</span> Adenine (A) pairs with Thymine (T),
                        and Cytosine (C) pairs with Guanine (G).
                      </li>
                      <li>
                        <span className="font-medium text-white">Hydrogen Bonds:</span> A-T pairs form two hydrogen
                        bonds, while C-G pairs form three hydrogen bonds.
                      </li>
                    </ul>
                    <h3 className="mb-2 mt-4 font-medium text-white">DNA Dimensions</h3>
                    <ul className="ml-5 list-disc space-y-1">
                      <li>Diameter: 2 nanometers</li>
                      <li>Length of one complete turn: 3.4 nanometers</li>
                      <li>Base pairs per turn: 10.5</li>
                      <li>Distance between base pairs: 0.34 nanometers</li>
                    </ul>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-4 text-sm text-gray-300">
                    <h3 className="mb-2 font-medium text-white">Lab Tasks</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Identify the components of the DNA double helix structure</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Count the number of base pairs in one complete turn of the helix</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Identify the different types of base pairs (A-T and G-C)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Explain how the complementary base pairing contributes to DNA replication</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Draw and label the structure of a nucleotide</span>
                      </li>
                    </ul>
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
