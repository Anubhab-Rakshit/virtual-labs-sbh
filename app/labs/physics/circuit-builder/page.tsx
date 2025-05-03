"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, Trash, RotateCw, Play, Pause } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

// Component types
interface CircuitComponent {
  id: string
  type: "resistor" | "battery" | "capacitor" | "inductor" | "switch" | "wire" | "bulb" | "ammeter" | "voltmeter"
  x: number
  y: number
  rotation: number
  value: number
  state?: boolean
  connections: string[]
}

interface CircuitNode {
  id: string
  x: number
  y: number
  connections: string[]
}

interface CircuitState {
  components: CircuitComponent[]
  nodes: CircuitNode[]
  selectedComponentId: string | null
  isDragging: boolean
  isConnecting: boolean
  connectingFrom: string | null
  voltage: number
  current: number
  power: number
}

// Predefined circuits
const predefinedCircuits = {
  simple: {
    components: [
      { id: "bat1", type: "battery", x: 200, y: 150, rotation: 0, value: 9, connections: ["n1", "n2"] },
      { id: "res1", type: "resistor", x: 400, y: 150, rotation: 0, value: 100, connections: ["n2", "n3"] },
      { id: "sw1", type: "switch", x: 300, y: 250, rotation: 90, value: 0, state: true, connections: ["n3", "n4"] },
      { id: "bulb1", type: "bulb", x: 200, y: 350, rotation: 0, value: 0, connections: ["n4", "n1"] },
    ],
    nodes: [
      { id: "n1", x: 200, y: 100, connections: ["bat1", "bulb1"] },
      { id: "n2", x: 200, y: 200, connections: ["bat1", "res1"] },
      { id: "n3", x: 400, y: 200, connections: ["res1", "sw1"] },
      { id: "n4", x: 200, y: 300, connections: ["sw1", "bulb1"] },
    ],
  },
  parallel: {
    components: [
      { id: "bat1", type: "battery", x: 150, y: 200, rotation: 0, value: 12, connections: ["n1", "n2"] },
      { id: "res1", type: "resistor", x: 300, y: 150, rotation: 0, value: 200, connections: ["n2", "n3"] },
      { id: "res2", type: "resistor", x: 300, y: 250, rotation: 0, value: 100, connections: ["n2", "n3"] },
      { id: "sw1", type: "switch", x: 450, y: 200, rotation: 0, value: 0, state: true, connections: ["n3", "n4"] },
      { id: "bulb1", type: "bulb", x: 300, y: 350, rotation: 0, value: 0, connections: ["n4", "n1"] },
    ],
    nodes: [
      { id: "n1", x: 150, y: 150, connections: ["bat1", "bulb1"] },
      { id: "n2", x: 150, y: 250, connections: ["bat1", "res1", "res2"] },
      { id: "n3", x: 450, y: 150, connections: ["res1", "res2", "sw1"] },
      { id: "n4", x: 450, y: 350, connections: ["sw1", "bulb1"] },
    ],
  },
  series: {
    components: [
      { id: "bat1", type: "battery", x: 150, y: 200, rotation: 0, value: 9, connections: ["n1", "n2"] },
      { id: "res1", type: "resistor", x: 300, y: 200, rotation: 0, value: 100, connections: ["n2", "n3"] },
      { id: "res2", type: "resistor", x: 450, y: 200, rotation: 0, value: 200, connections: ["n3", "n4"] },
      { id: "bulb1", type: "bulb", x: 300, y: 350, rotation: 0, value: 0, connections: ["n4", "n1"] },
    ],
    nodes: [
      { id: "n1", x: 150, y: 150, connections: ["bat1", "bulb1"] },
      { id: "n2", x: 150, y: 250, connections: ["bat1", "res1"] },
      { id: "n3", x: 300, y: 250, connections: ["res1", "res2"] },
      { id: "n4", x: 450, y: 250, connections: ["res2", "bulb1"] },
    ],
  },
}

// Component images (simplified for now)
const componentImages = {
  resistor: "/placeholder.svg?height=50&width=100",
  battery: "/placeholder.svg?height=50&width=100",
  capacitor: "/placeholder.svg?height=50&width=100",
  inductor: "/placeholder.svg?height=50&width=100",
  switch: "/placeholder.svg?height=50&width=100",
  wire: "/placeholder.svg?height=50&width=100",
  bulb: "/placeholder.svg?height=50&width=100",
  ammeter: "/placeholder.svg?height=50&width=100",
  voltmeter: "/placeholder.svg?height=50&width=100",
}

// Component values and units
const componentUnits = {
  resistor: "Ω",
  battery: "V",
  capacitor: "μF",
  inductor: "mH",
  switch: "",
  wire: "",
  bulb: "W",
  ammeter: "",
  voltmeter: "",
}

export default function CircuitBuilderLab() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [circuit, setCircuit] = useState<CircuitState>({
    components: [],
    nodes: [],
    selectedComponentId: null,
    isDragging: false,
    isConnecting: false,
    connectingFrom: null,
    voltage: 0,
    current: 0,
    power: 0,
  })
  const [activeTab, setActiveTab] = useState("build")
  const [selectedComponentType, setSelectedComponentType] = useState<CircuitComponent["type"]>("resistor")
  const [componentValue, setComponentValue] = useState(100)
  const [isSimulating, setIsSimulating] = useState(false)
  const [selectedCircuit, setSelectedCircuit] = useState("")
  const [isMounted, setIsMounted] = useState(false)

  // Safe client-side rendering
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Load a predefined circuit
  const loadCircuit = (circuitName: keyof typeof predefinedCircuits) => {
    const circuitData = predefinedCircuits[circuitName]
    setCircuit({
      ...circuit,
      components: [...circuitData.components],
      nodes: [...circuitData.nodes],
      selectedComponentId: null,
      isDragging: false,
      isConnecting: false,
      connectingFrom: null,
    })
  }

  // Add a new component to the circuit
  const addComponent = (type: CircuitComponent["type"], x: number, y: number) => {
    const id = `${type}${circuit.components.length + 1}`
    const newComponent: CircuitComponent = {
      id,
      type,
      x,
      y,
      rotation: 0,
      value: componentValue,
      connections: [],
      ...(type === "switch" ? { state: false } : {}),
    }

    setCircuit({
      ...circuit,
      components: [...circuit.components, newComponent],
      selectedComponentId: id,
    })
  }

  // Remove a component from the circuit
  const removeComponent = (id: string) => {
    // Remove component
    const updatedComponents = circuit.components.filter((comp) => comp.id !== id)

    // Remove connections to this component
    const updatedNodes = circuit.nodes.map((node) => ({
      ...node,
      connections: node.connections.filter((connId) => connId !== id),
    }))

    setCircuit({
      ...circuit,
      components: updatedComponents,
      nodes: updatedNodes,
      selectedComponentId: null,
    })
  }

  // Toggle a switch component
  const toggleSwitch = (id: string) => {
    const updatedComponents = circuit.components.map((comp) =>
      comp.id === id && comp.type === "switch" ? { ...comp, state: !comp.state } : comp,
    )

    setCircuit({
      ...circuit,
      components: updatedComponents,
    })
  }

  // Rotate the selected component
  const rotateComponent = () => {
    if (!circuit.selectedComponentId) return

    const updatedComponents = circuit.components.map((comp) =>
      comp.id === circuit.selectedComponentId ? { ...comp, rotation: (comp.rotation + 90) % 360 } : comp,
    )

    setCircuit({
      ...circuit,
      components: updatedComponents,
    })
  }

  // Handle canvas click
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // If in connection mode, handle connection logic
    if (circuit.isConnecting && circuit.connectingFrom) {
      // Create a new node at the click position
      const nodeId = `n${circuit.nodes.length + 1}`
      const newNode: CircuitNode = {
        id: nodeId,
        x,
        y,
        connections: [circuit.connectingFrom],
      }

      // Update the component's connections
      const updatedComponents = circuit.components.map((comp) =>
        comp.id === circuit.connectingFrom ? { ...comp, connections: [...comp.connections, nodeId] } : comp,
      )

      setCircuit({
        ...circuit,
        components: updatedComponents,
        nodes: [...circuit.nodes, newNode],
        isConnecting: false,
        connectingFrom: null,
      })
      return
    }

    // Check if clicked on an existing component
    const clickedComponent = circuit.components.find((comp) => Math.abs(comp.x - x) < 30 && Math.abs(comp.y - y) < 30)

    if (clickedComponent) {
      // If it's a switch, toggle it
      if (clickedComponent.type === "switch" && isSimulating) {
        toggleSwitch(clickedComponent.id)
        return
      }

      // Otherwise, select the component
      setCircuit({
        ...circuit,
        selectedComponentId: clickedComponent.id,
        isDragging: true,
      })
      return
    }

    // If no component was clicked, add a new one
    if (activeTab === "build" && !isSimulating) {
      addComponent(selectedComponentType, x, y)
    }
  }

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!circuit.isDragging || !circuit.selectedComponentId || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    const updatedComponents = circuit.components.map((comp) =>
      comp.id === circuit.selectedComponentId ? { ...comp, x, y } : comp,
    )

    setCircuit({
      ...circuit,
      components: updatedComponents,
    })
  }

  // Handle mouse up to end dragging
  const handleMouseUp = () => {
    if (circuit.isDragging) {
      setCircuit({
        ...circuit,
        isDragging: false,
      })
    }
  }

  // Start connecting a component
  const startConnecting = () => {
    if (!circuit.selectedComponentId) return

    setCircuit({
      ...circuit,
      isConnecting: true,
      connectingFrom: circuit.selectedComponentId,
    })
  }

  // Clear the circuit
  const clearCircuit = () => {
    setCircuit({
      components: [],
      nodes: [],
      selectedComponentId: null,
      isDragging: false,
      isConnecting: false,
      connectingFrom: null,
      voltage: 0,
      current: 0,
      power: 0,
    })
  }

  // Start/stop simulation
  const toggleSimulation = () => {
    if (isSimulating) {
      setIsSimulating(false)
      return
    }

    // Simple simulation - just calculate voltage, current, and power
    let totalVoltage = 0
    let totalResistance = 0

    circuit.components.forEach((comp) => {
      if (comp.type === "battery") {
        totalVoltage += comp.value
      } else if (comp.type === "resistor") {
        totalResistance += comp.value
      }
    })

    // Prevent division by zero
    if (totalResistance === 0) totalResistance = 0.001

    const current = totalVoltage / totalResistance
    const power = totalVoltage * current

    setCircuit({
      ...circuit,
      voltage: totalVoltage,
      current: current,
      power: power,
    })

    setIsSimulating(true)
  }

  // Draw the circuit on the canvas
  useEffect(() => {
    if (!canvasRef.current || !isMounted) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#333"
    ctx.lineWidth = 0.5
    for (let x = 0; x < canvas.width; x += 20) {
      ctx.beginPath()
      ctx.moveTo(x, 0)
      ctx.lineTo(x, canvas.height)
      ctx.stroke()
    }
    for (let y = 0; y < canvas.height; y += 20) {
      ctx.beginPath()
      ctx.moveTo(0, y)
      ctx.lineTo(canvas.width, y)
      ctx.stroke()
    }

    // Draw connections
    ctx.strokeStyle = "#666"
    ctx.lineWidth = 2
    circuit.nodes.forEach((node) => {
      if (node.connections.length >= 2) {
        // Find the components connected to this node
        const connectedComponents = node.connections.map((connId) =>
          circuit.components.find((comp) => comp.id === connId),
        )

        // Draw lines between the node and each component
        connectedComponents.forEach((comp) => {
          if (!comp) return

          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(comp.x, comp.y)
          ctx.stroke()
        })

        // Draw the node
        ctx.fillStyle = "#666"
        ctx.beginPath()
        ctx.arc(node.x, node.y, 5, 0, Math.PI * 2)
        ctx.fill()
      }
    })

    // Draw components
    circuit.components.forEach((comp) => {
      // Draw component placeholder
      ctx.save()
      ctx.translate(comp.x, comp.y)
      ctx.rotate((comp.rotation * Math.PI) / 180)

      // Different drawing based on component type
      switch (comp.type) {
        case "resistor":
          ctx.strokeStyle = "#3b82f6"
          ctx.lineWidth = 2
          ctx.strokeRect(-25, -10, 50, 20)
          ctx.fillStyle = "#fff"
          ctx.font = "10px Arial"
          ctx.fillText(`${comp.value}Ω`, -15, 5)
          break
        case "battery":
          ctx.strokeStyle = "#ef4444"
          ctx.lineWidth = 2
          ctx.strokeRect(-25, -10, 50, 20)
          ctx.fillStyle = "#fff"
          ctx.font = "10px Arial"
          ctx.fillText(`${comp.value}V`, -10, 5)
          break
        case "switch":
          ctx.strokeStyle = comp.state ? "#10b981" : "#6b7280"
          ctx.lineWidth = 2
          ctx.strokeRect(-25, -10, 50, 20)
          ctx.fillStyle = "#fff"
          ctx.font = "10px Arial"
          ctx.fillText(comp.state ? "ON" : "OFF", -10, 5)
          break
        case "bulb":
          ctx.strokeStyle = isSimulating ? "#facc15" : "#6b7280"
          ctx.lineWidth = 2
          ctx.beginPath()
          ctx.arc(0, 0, 15, 0, Math.PI * 2)
          ctx.stroke()
          if (isSimulating) {
            ctx.fillStyle = "#facc15"
            ctx.globalAlpha = 0.3
            ctx.fill()
            ctx.globalAlpha = 1.0
          }
          break
        default:
          ctx.strokeStyle = "#6b7280"
          ctx.lineWidth = 2
          ctx.strokeRect(-25, -10, 50, 20)
          ctx.fillStyle = "#fff"
          ctx.font = "10px Arial"
          ctx.fillText(comp.type, -15, 5)
      }

      // Highlight selected component
      if (comp.id === circuit.selectedComponentId) {
        ctx.strokeStyle = "#f97316"
        ctx.lineWidth = 2
        ctx.strokeRect(-30, -15, 60, 30)
      }

      ctx.restore()
    })

    // Draw connecting line if in connecting mode
    if (circuit.isConnecting && circuit.connectingFrom) {
      const fromComp = circuit.components.find((comp) => comp.id === circuit.connectingFrom)
      if (fromComp) {
        ctx.strokeStyle = "#f97316"
        ctx.lineWidth = 2
        ctx.setLineDash([5, 5])
        ctx.beginPath()
        ctx.moveTo(fromComp.x, fromComp.y)
        ctx.lineTo(canvas.width / 2, canvas.height / 2) // Just a placeholder
        ctx.stroke()
        ctx.setLineDash([])
      }
    }
  }, [circuit, isSimulating, isMounted])

  if (!isMounted) {
    return null // Return null on server-side to prevent hydration issues
  }

  return (
    <div className="flex min-h-[calc(100vh-4rem)] flex-col bg-gray-950">
      <div className="container mx-auto px-4 py-6">
        <div className="mb-6 flex items-center">
          <br/> <br/>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-gray-800 bg-gray-900">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <canvas
                    ref={canvasRef}
                    width={800}
                    height={600}
                    className="border border-gray-700 bg-gray-800"
                    onClick={handleCanvasClick}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                  />

                  <div className="mt-4 flex w-full items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Button
                        variant={isSimulating ? "destructive" : "default"}
                        onClick={toggleSimulation}
                        disabled={circuit.components.length === 0}
                      >
                        {isSimulating ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
                        {isSimulating ? "Stop" : "Start"} Simulation
                      </Button>
                      <Button variant="outline" onClick={clearCircuit} disabled={circuit.components.length === 0}>
                        <Trash className="mr-2 h-4 w-4" />
                        Clear
                      </Button>
                    </div>

                    {isSimulating && (
                      <div className="flex items-center gap-4">
                        <div className="text-sm">
                          <span className="text-gray-400">Voltage: </span>
                          <span className="font-medium text-white">{circuit.voltage.toFixed(2)} V</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">Current: </span>
                          <span className="font-medium text-white">{circuit.current.toFixed(2)} A</span>
                        </div>
                        <div className="text-sm">
                          <span className="text-gray-400">Power: </span>
                          <span className="font-medium text-white">{circuit.power.toFixed(2)} W</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-gray-800 bg-gray-900">
              <CardContent className="p-6">
                <Tabs value={activeTab} onValueChange={setActiveTab}>
                  <TabsList className="w-full bg-gray-800">
                    <TabsTrigger value="build" className="flex-1">
                      Build
                    </TabsTrigger>
                    <TabsTrigger value="components" className="flex-1">
                      Components
                    </TabsTrigger>
                    <TabsTrigger value="templates" className="flex-1">
                      Templates
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="build" className="mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-200">Component Type</label>
                        <Select
                          value={selectedComponentType}
                          onValueChange={(value) => setSelectedComponentType(value as CircuitComponent["type"])}
                          disabled={isSimulating}
                        >
                          <SelectTrigger className="border-gray-800 bg-gray-950">
                            <SelectValue placeholder="Select component" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="resistor">Resistor</SelectItem>
                            <SelectItem value="battery">Battery</SelectItem>
                            <SelectItem value="capacitor">Capacitor</SelectItem>
                            <SelectItem value="inductor">Inductor</SelectItem>
                            <SelectItem value="switch">Switch</SelectItem>
                            <SelectItem value="wire">Wire</SelectItem>
                            <SelectItem value="bulb">Light Bulb</SelectItem>
                            <SelectItem value="ammeter">Ammeter</SelectItem>
                            <SelectItem value="voltmeter">Voltmeter</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-sm font-medium text-gray-200">
                            Value ({componentUnits[selectedComponentType]})
                          </label>
                          <span className="text-sm text-gray-400">{componentValue}</span>
                        </div>
                        <Slider
                          min={1}
                          max={1000}
                          step={1}
                          value={[componentValue]}
                          onValueChange={(value) => setComponentValue(value[0])}
                          disabled={
                            isSimulating || selectedComponentType === "switch" || selectedComponentType === "wire"
                          }
                        />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={rotateComponent}
                                disabled={!circuit.selectedComponentId || isSimulating}
                              >
                                <RotateCw className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Rotate Component</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={startConnecting}
                                disabled={!circuit.selectedComponentId || isSimulating}
                              >
                                Connect
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Connect Component</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>

                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  circuit.selectedComponentId && removeComponent(circuit.selectedComponentId)
                                }
                                disabled={!circuit.selectedComponentId || isSimulating}
                              >
                                <Trash className="h-4 w-4" />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Delete Component</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>

                      <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                        <h3 className="mb-2 text-lg font-medium text-white">Instructions</h3>
                        <ul className="space-y-1 text-sm text-gray-300">
                          <li>• Click on the canvas to place a component</li>
                          <li>• Select a component and click "Connect" to create connections</li>
                          <li>• Use the "Rotate" button to change component orientation</li>
                          <li>• Click "Start Simulation" to see the circuit in action</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="components" className="mt-4">
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-2">
                        {Object.entries(componentImages).map(([type, image]) => (
                          <div
                            key={type}
                            className={`flex cursor-pointer flex-col items-center rounded-lg border border-gray-800 p-2 ${
                              selectedComponentType === type ? "border-blue-500 bg-gray-800" : ""
                            }`}
                            onClick={() => setSelectedComponentType(type as CircuitComponent["type"])}
                          >
                            <div className="h-12 w-12">
                              <img
                                src={image || "/placeholder.svg"}
                                alt={type}
                                className="h-full w-full object-contain"
                              />
                            </div>
                            <span className="mt-1 text-xs text-gray-300 capitalize">{type}</span>
                          </div>
                        ))}
                      </div>

                      <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                        <h3 className="mb-2 text-lg font-medium text-white">Component Info</h3>
                        <div className="space-y-2 text-sm text-gray-300">
                          {selectedComponentType === "resistor" && (
                            <>
                              <p>
                                <span className="font-medium text-gray-200">Resistor:</span> Limits the flow of current
                                in a circuit.
                              </p>
                              <p>
                                <span className="font-medium text-gray-200">Unit:</span> Ohms (Ω)
                              </p>
                              <p>
                                <span className="font-medium text-gray-200">Formula:</span> V = IR (Voltage = Current ×
                                Resistance)
                              </p>
                            </>
                          )}

                          {selectedComponentType === "battery" && (
                            <>
                              <p>
                                <span className="font-medium text-gray-200">Battery:</span> Provides electrical energy
                                to the circuit.
                              </p>
                              <p>
                                <span className="font-medium text-gray-200">Unit:</span> Volts (V)
                              </p>
                              <p>
                                <span className="font-medium text-gray-200">Note:</span> The positive terminal is at the
                                top in the default orientation.
                              </p>
                            </>
                          )}

                          {selectedComponentType === "switch" && (
                            <>
                              <p>
                                <span className="font-medium text-gray-200">Switch:</span> Controls the flow of current
                                by opening or closing the circuit.
                              </p>
                              <p>
                                <span className="font-medium text-gray-200">States:</span> ON (closed) or OFF (open)
                              </p>
                              <p>
                                <span className="font-medium text-gray-200">Note:</span> Click on the switch during
                                simulation to toggle its state.
                              </p>
                            </>
                          )}

                          {selectedComponentType === "bulb" && (
                            <>
                              <p>
                                <span className="font-medium text-gray-200">Light Bulb:</span> Converts electrical
                                energy to light.
                              </p>
                              <p>
                                <span className="font-medium text-gray-200">Unit:</span> Watts (W)
                              </p>
                              <p>
                                <span className="font-medium text-gray-200">Note:</span> The bulb will light up during
                                simulation if current flows through it.
                              </p>
                            </>
                          )}

                          {selectedComponentType === "capacitor" && (
                            <>
                              <p>
                                <span className="font-medium text-gray-200">Capacitor:</span> Stores electrical energy
                                in an electric field.
                              </p>
                              <p>
                                <span className="font-medium text-gray-200">Unit:</span> Microfarads (μF)
                              </p>
                              <p>
                                <span className="font-medium text-gray-200">Formula:</span> Q = CV (Charge = Capacitance
                                × Voltage)
                              </p>
                            </>
                          )}

                          {selectedComponentType === "inductor" && (
                            <>
                              <p>
                                <span className="font-medium text-gray-200">Inductor:</span> Stores energy in a magnetic
                                field when current flows through it.
                              </p>
                              <p>
                                <span className="font-medium text-gray-200">Unit:</span> Millihenries (mH)
                              </p>
                              <p>
                                <span className="font-medium text-gray-200">Formula:</span> V = L(dI/dt) (Voltage =
                                Inductance × Rate of change of current)
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="templates" className="mt-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-gray-200">Load Template</label>
                        <Select
                          value={selectedCircuit}
                          onValueChange={(value) => {
                            setSelectedCircuit(value)
                            loadCircuit(value as keyof typeof predefinedCircuits)
                          }}
                          disabled={isSimulating}
                        >
                          <SelectTrigger className="border-gray-800 bg-gray-950">
                            <SelectValue placeholder="Select a circuit template" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="simple">Simple Circuit</SelectItem>
                            <SelectItem value="series">Series Circuit</SelectItem>
                            <SelectItem value="parallel">Parallel Circuit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                        <h3 className="mb-2 text-lg font-medium text-white">Template Descriptions</h3>
                        <div className="space-y-3 text-sm text-gray-300">
                          <div>
                            <p className="font-medium text-gray-200">Simple Circuit:</p>
                            <p>A basic circuit with a battery, resistor, switch, and light bulb connected in series.</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-200">Series Circuit:</p>
                            <p>A circuit with multiple resistors connected end-to-end, sharing the same current.</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-200">Parallel Circuit:</p>
                            <p>
                              A circuit with multiple paths for current flow, where components share the same voltage.
                            </p>
                          </div>
                        </div>
                      </div>

                      <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                        <h3 className="mb-2 text-lg font-medium text-white">Circuit Laws</h3>
                        <div className="space-y-3 text-sm text-gray-300">
                          <div>
                            <p className="font-medium text-gray-200">Ohm's Law:</p>
                            <p>V = IR (Voltage = Current × Resistance)</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-200">Kirchhoff's Current Law:</p>
                            <p>The sum of currents entering a node equals the sum of currents leaving the node.</p>
                          </div>
                          <div>
                            <p className="font-medium text-gray-200">Kirchhoff's Voltage Law:</p>
                            <p>The sum of all voltages around any closed loop in a circuit equals zero.</p>
                          </div>
                        </div>
                      </div>
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
