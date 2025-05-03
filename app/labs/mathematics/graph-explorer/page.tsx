"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { ArrowLeft, Download, Maximize2, Minimize2, Plus, Trash } from "lucide-react"
import * as THREE from "three"
import { Canvas } from "@react-three/fiber"
import { Environment, OrbitControls, PerspectiveCamera, Text } from "@react-three/drei"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Function to evaluate mathematical expressions
function evaluateExpression(expression, x, y, z) {
  try {
    // Replace mathematical functions with their JavaScript equivalents
    const sanitizedExpression = expression
      .replace(/sin/g, "Math.sin")
      .replace(/cos/g, "Math.cos")
      .replace(/tan/g, "Math.tan")
      .replace(/sqrt/g, "Math.sqrt")
      .replace(/abs/g, "Math.abs")
      .replace(/pow/g, "Math.pow")
      .replace(/exp/g, "Math.exp")
      .replace(/log/g, "Math.log")
      .replace(/pi/g, "Math.PI")
      .replace(/e/g, "Math.E")

    // Create a function from the expression
    // eslint-disable-next-line no-new-func
    const func = new Function("x", "y", "z", `return ${sanitizedExpression}`)
    return func(x, y, z)
  } catch (error) {
    console.error("Error evaluating expression:", error)
    return 0
  }
}

// 3D Function Graph component
function FunctionGraph({
  expression,
  resolution = 20,
  color = "#FF5555",
  opacity = 0.7,
  wireframe = false,
  bounds = [-5, 5],
}) {
  const meshRef = useRef()

  // Create geometry for the function
  useEffect(() => {
    if (!meshRef.current) return

    const geometry = meshRef.current.geometry
    const positions = geometry.attributes.position

    // Update vertices based on the function
    for (let i = 0; i <= resolution; i++) {
      const x = bounds[0] + (i / resolution) * (bounds[1] - bounds[0])

      for (let j = 0; j <= resolution; j++) {
        const y = bounds[0] + (j / resolution) * (bounds[1] - bounds[0])

        // Calculate z value from the function
        const z = evaluateExpression(expression, x, y, 0)

        // Set vertex position
        const index = i * (resolution + 1) + j
        positions.setXYZ(index, x, z, y) // Note: y and z are swapped for better visualization
      }
    }

    positions.needsUpdate = true
    geometry.computeVertexNormals()
  }, [expression, resolution, bounds])

  return (
    <mesh ref={meshRef} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <planeGeometry args={[1, 1, resolution, resolution]} />
      <meshStandardMaterial
        color={color}
        side={THREE.DoubleSide}
        wireframe={wireframe}
        transparent={true}
        opacity={opacity}
      />
    </mesh>
  )
}

// Axes component
function Axes({ size = 10, divisions = 10 }) {
  return (
    <group>
      {/* X-axis */}
      <mesh position={[size / 2, 0, 0]}>
        <boxGeometry args={[size, 0.05, 0.05]} />
        <meshStandardMaterial color="red" />
      </mesh>
      <Text position={[size / 2 + 0.5, 0, 0]} fontSize={0.3} color="red">
        X
      </Text>

      {/* Y-axis */}
      <mesh position={[0, size / 2, 0]}>
        <boxGeometry args={[0.05, size, 0.05]} />
        <meshStandardMaterial color="green" />
      </mesh>
      <Text position={[0, size / 2 + 0.5, 0]} fontSize={0.3} color="green">
        Y
      </Text>

      {/* Z-axis */}
      <mesh position={[0, 0, size / 2]}>
        <boxGeometry args={[0.05, 0.05, size]} />
        <meshStandardMaterial color="blue" />
      </mesh>
      <Text position={[0, 0, size / 2 + 0.5]} fontSize={0.3} color="blue">
        Z
      </Text>

      {/* Grid lines */}
      {Array.from({ length: divisions + 1 }).map((_, i) => {
        const pos = -size / 2 + i * (size / divisions)
        return (
          <group key={`grid-${i}`}>
            {/* X grid */}
            <mesh position={[pos, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
              <cylinderGeometry args={[0.01, 0.01, size, 8]} />
              <meshStandardMaterial color="#444444" transparent opacity={0.3} />
            </mesh>

            {/* Z grid */}
            <mesh position={[0, 0, pos]}>
              <cylinderGeometry args={[0.01, 0.01, size, 8]} />
              <meshStandardMaterial color="#444444" transparent opacity={0.3} />
            </mesh>

            {/* Labels */}
            {i !== divisions / 2 && (
              <>
                <Text position={[pos, -0.3, 0]} fontSize={0.2} color="#AAAAAA">
                  {pos.toFixed(1)}
                </Text>
                <Text position={[0, -0.3, pos]} fontSize={0.2} color="#AAAAAA">
                  {pos.toFixed(1)}
                </Text>
              </>
            )}
          </group>
        )
      })}
    </group>
  )
}

export default function GraphExplorerLab() {
  const [functions, setFunctions] = useState([
    { id: 1, expression: "sin(x) * cos(y)", color: "#FF5555", opacity: 0.7, wireframe: false },
  ])
  const [resolution, setResolution] = useState(30)
  const [bounds, setBounds] = useState([-5, 5])
  const [isFullscreen, setIsFullscreen] = useState(false)

  const addFunction = () => {
    const colors = ["#FF5555", "#55FF55", "#5555FF", "#FFFF55", "#FF55FF", "#55FFFF"]
    const newId = Math.max(0, ...functions.map((f) => f.id)) + 1
    setFunctions([
      ...functions,
      {
        id: newId,
        expression: "cos(x) * sin(y)",
        color: colors[newId % colors.length],
        opacity: 0.7,
        wireframe: false,
      },
    ])
  }

  const removeFunction = (id) => {
    setFunctions(functions.filter((f) => f.id !== id))
  }

  const updateFunction = (id, field, value) => {
    setFunctions(functions.map((f) => (f.id === id ? { ...f, [field]: value } : f)))
  }

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
                  <PerspectiveCamera makeDefault position={[10, 10, 10]} />
                  <ambientLight intensity={0.5} />
                  <spotLight position={[10, 15, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

                  <Axes size={10} divisions={10} />

                  {functions.map((func) => (
                    <FunctionGraph
                      key={func.id}
                      expression={func.expression}
                      color={func.color}
                      opacity={func.opacity}
                      wireframe={func.wireframe}
                      resolution={resolution}
                      bounds={bounds}
                    />
                  ))}

                  <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} />
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
                            onClick={toggleFullscreen}
                          >
                            {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{isFullscreen ? "Exit" : "Enter"} Fullscreen</p>
                        </TooltipContent>
                      </Tooltip>

                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 border-gray-700 bg-gray-900"
                            onClick={() => {
                              // Capture screenshot logic would go here
                              alert("Screenshot functionality would be implemented here")
                            }}
                          >
                            <Download className="h-4 w-4" />
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>Save Screenshot</p>
                        </TooltipContent>
                      </Tooltip>
                    </div>

                    <div className="text-xs text-white">
                      Domain: [{bounds[0]}, {bounds[1]}] × [{bounds[0]}, {bounds[1]}]
                    </div>
                  </TooltipProvider>
                </div>
              </div>
            </Card>
          </div>

          <div>
            <Card className="bg-gray-900">
              <CardContent className="p-6">
                <h2 className="mb-4 text-xl font-bold text-white">Graph Controls</h2>

                <div className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-white">Functions</h3>
                      <Button variant="outline" size="sm" className="border-gray-700 bg-gray-900" onClick={addFunction}>
                        <Plus className="mr-1 h-3 w-3" />
                        Add Function
                      </Button>
                    </div>

                    {functions.map((func) => (
                      <div key={func.id} className="rounded-lg border border-gray-800 bg-gray-950 p-3">
                        <div className="mb-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="h-3 w-3 rounded-full" style={{ backgroundColor: func.color }} />
                            <span className="text-sm font-medium text-white">Function {func.id}</span>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6 text-gray-400 hover:text-white"
                            onClick={() => removeFunction(func.id)}
                          >
                            <Trash className="h-3 w-3" />
                          </Button>
                        </div>

                        <div className="space-y-2">
                          <div>
                            <Label htmlFor={`expression-${func.id}`} className="text-xs">
                              Expression
                            </Label>
                            <Input
                              id={`expression-${func.id}`}
                              value={func.expression}
                              onChange={(e) => updateFunction(func.id, "expression", e.target.value)}
                              className="h-8 border-gray-800 bg-gray-900 text-sm"
                              placeholder="e.g. sin(x) * cos(y)"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <Label htmlFor={`color-${func.id}`} className="text-xs">
                                Color
                              </Label>
                              <div className="flex h-8 items-center gap-2 rounded-md border border-gray-800 bg-gray-900 px-2">
                                <input
                                  type="color"
                                  value={func.color}
                                  onChange={(e) => updateFunction(func.id, "color", e.target.value)}
                                  className="h-5 w-5 cursor-pointer rounded-full border-0"
                                />
                                <span className="text-xs text-gray-300">{func.color}</span>
                              </div>
                            </div>

                            <div>
                              <Label htmlFor={`opacity-${func.id}`} className="text-xs">
                                Opacity
                              </Label>
                              <div className="flex h-8 items-center gap-2 rounded-md border border-gray-800 bg-gray-900 px-2">
                                <Slider
                                  value={[func.opacity * 100]}
                                  onValueChange={(value) => updateFunction(func.id, "opacity", value[0] / 100)}
                                  min={10}
                                  max={100}
                                  step={1}
                                  className="flex-1"
                                />
                                <span className="w-8 text-right text-xs text-gray-300">
                                  {Math.round(func.opacity * 100)}%
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              id={`wireframe-${func.id}`}
                              checked={func.wireframe}
                              onChange={(e) => updateFunction(func.id, "wireframe", e.target.checked)}
                              className="h-4 w-4 rounded border-gray-700 bg-gray-900"
                            />
                            <Label htmlFor={`wireframe-${func.id}`} className="text-xs">
                              Wireframe
                            </Label>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-white">Graph Settings</h3>

                    <div className="space-y-2">
                      <Label htmlFor="resolution" className="flex items-center justify-between">
                        <span>Resolution</span>
                        <span className="text-xs text-gray-400">
                          {resolution}×{resolution}
                        </span>
                      </Label>
                      <Slider
                        id="resolution"
                        value={[resolution]}
                        onValueChange={(value) => setResolution(value[0])}
                        min={10}
                        max={100}
                        step={5}
                        className="flex-1"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bounds" className="flex items-center justify-between">
                        <span>Domain Bounds</span>
                        <span className="text-xs text-gray-400">
                          [{bounds[0]}, {bounds[1]}]
                        </span>
                      </Label>
                      <Select
                        value={bounds.join(",")}
                        onValueChange={(value) => setBounds(value.split(",").map(Number))}
                      >
                        <SelectTrigger className="border-gray-800 bg-gray-950">
                          <SelectValue placeholder="Select bounds" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="-2,2">[-2, 2]</SelectItem>
                          <SelectItem value="-5,5">[-5, 5]</SelectItem>
                          <SelectItem value="-10,10">[-10, 10]</SelectItem>
                          <SelectItem value="-20,20">[-20, 20]</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <Tabs defaultValue="examples" className="mt-6">
                  <TabsList className="w-full bg-gray-800">
                    <TabsTrigger value="examples" className="flex-1">
                      Examples
                    </TabsTrigger>
                    <TabsTrigger value="help" className="flex-1">
                      Help
                    </TabsTrigger>
                    <TabsTrigger value="tasks" className="flex-1">
                      Tasks
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="examples" className="mt-4 text-sm text-gray-300">
                    <h3 className="mb-2 font-medium text-white">Example Functions</h3>
                    <div className="space-y-2">
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-gray-800 bg-gray-950 text-left"
                        onClick={() =>
                          setFunctions([
                            { id: 1, expression: "sin(x) * cos(y)", color: "#FF5555", opacity: 0.7, wireframe: false },
                          ])
                        }
                      >
                        sin(x) * cos(y)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-gray-800 bg-gray-950 text-left"
                        onClick={() =>
                          setFunctions([
                            { id: 1, expression: "x^2 + y^2", color: "#55FF55", opacity: 0.7, wireframe: false },
                          ])
                        }
                      >
                        x^2 + y^2 (Paraboloid)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-gray-800 bg-gray-950 text-left"
                        onClick={() =>
                          setFunctions([
                            {
                              id: 1,
                              expression: "sin(sqrt(x^2 + y^2))",
                              color: "#5555FF",
                              opacity: 0.7,
                              wireframe: false,
                            },
                          ])
                        }
                      >
                        sin(sqrt(x^2 + y^2)) (Ripple)
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full justify-start border-gray-800 bg-gray-950 text-left"
                        onClick={() =>
                          setFunctions([
                            {
                              id: 1,
                              expression: "exp(-(x^2 + y^2))",
                              color: "#FFFF55",
                              opacity: 0.7,
                              wireframe: false,
                            },
                          ])
                        }
                      >
                        exp(-(x^2 + y^2)) (Bell Curve)
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="help" className="mt-4 text-sm text-gray-300">
                    <h3 className="mb-2 font-medium text-white">Available Functions</h3>
                    <ul className="ml-5 list-disc space-y-1">
                      <li>Basic: +, -, *, /, ^</li>
                      <li>Trigonometric: sin, cos, tan</li>
                      <li>Other: sqrt, abs, exp, log</li>
                      <li>Constants: pi, e</li>
                    </ul>
                    <h3 className="mb-2 mt-4 font-medium text-white">Tips</h3>
                    <ul className="ml-5 list-disc space-y-1">
                      <li>Use x and y as variables in your functions</li>
                      <li>Increase resolution for smoother graphs (may affect performance)</li>
                      <li>Use wireframe mode to see the structure more clearly</li>
                      <li>Adjust opacity when viewing multiple functions</li>
                    </ul>
                  </TabsContent>

                  <TabsContent value="tasks" className="mt-4 text-sm text-gray-300">
                    <h3 className="mb-2 font-medium text-white">Lab Tasks</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Create a graph of z = sin(x) * cos(y) and identify its critical points</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Compare the graphs of z = x^2 + y^2 and z = x^2 - y^2</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Visualize a hyperbolic paraboloid (saddle surface) with z = x^2 - y^2</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Create a graph that represents a wave propagating outward from the origin</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <input type="checkbox" className="mt-1" />
                        <span>Explore how changing parameters affects the shape of the graph</span>
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
