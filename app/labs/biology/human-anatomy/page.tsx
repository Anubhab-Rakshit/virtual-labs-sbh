"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { ArrowLeft, ZoomIn, ZoomOut, RotateCw, RotateCcw, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"

// Anatomy systems
const anatomySystems = {
  skeletal: {
    name: "Skeletal System",
    description: "The framework of bones and cartilage that supports the body and protects vital organs.",
    parts: [
      { id: "skull", name: "Skull", description: "Protects the brain and forms the face." },
      { id: "spine", name: "Vertebral Column", description: "Protects the spinal cord and supports the body." },
      { id: "ribs", name: "Ribcage", description: "Protects vital organs in the chest." },
      { id: "pelvis", name: "Pelvis", description: "Connects the spine to the lower limbs." },
      { id: "femur", name: "Femur", description: "The thigh bone, the longest bone in the body." },
      { id: "tibia", name: "Tibia", description: "The shin bone, bears weight in the lower leg." },
      { id: "humerus", name: "Humerus", description: "The upper arm bone." },
      { id: "radius", name: "Radius", description: "One of the forearm bones." },
      { id: "ulna", name: "Ulna", description: "One of the forearm bones." },
    ],
    image: "/placeholder.svg?height=600&width=400",
  },
  muscular: {
    name: "Muscular System",
    description: "The system of muscles that enables movement, maintains posture, and produces heat.",
    parts: [
      { id: "pectoralis", name: "Pectoralis Major", description: "Chest muscle that moves the arm." },
      { id: "biceps", name: "Biceps Brachii", description: "Flexes the elbow and rotates the forearm." },
      { id: "triceps", name: "Triceps Brachii", description: "Extends the elbow." },
      { id: "quadriceps", name: "Quadriceps Femoris", description: "Extends the knee and flexes the hip." },
      { id: "hamstrings", name: "Hamstrings", description: "Flexes the knee and extends the hip." },
      {
        id: "gastrocnemius",
        name: "Gastrocnemius",
        description: "Calf muscle that flexes the knee and points the foot.",
      },
      { id: "deltoid", name: "Deltoid", description: "Shoulder muscle that abducts, flexes, and extends the arm." },
      { id: "trapezius", name: "Trapezius", description: "Upper back muscle that moves the shoulder blade." },
      { id: "latissimus", name: "Latissimus Dorsi", description: "Back muscle that adducts and extends the arm." },
    ],
    image: "/placeholder.svg?height=600&width=400",
  },
  circulatory: {
    name: "Circulatory System",
    description: "The system that transports blood, nutrients, gases, and hormones throughout the body.",
    parts: [
      { id: "heart", name: "Heart", description: "Pumps blood throughout the body." },
      { id: "aorta", name: "Aorta", description: "The largest artery, carries blood from the heart." },
      { id: "vena-cava", name: "Vena Cava", description: "Large veins that return blood to the heart." },
      { id: "pulmonary", name: "Pulmonary Vessels", description: "Carry blood between the heart and lungs." },
      { id: "carotid", name: "Carotid Arteries", description: "Supply blood to the brain and head." },
      { id: "femoral", name: "Femoral Vessels", description: "Supply blood to the legs." },
      { id: "coronary", name: "Coronary Vessels", description: "Supply blood to the heart muscle." },
      { id: "capillaries", name: "Capillaries", description: "Tiny vessels where exchange of materials occurs." },
    ],
    image: "/placeholder.svg?height=600&width=400",
  },
  nervous: {
    name: "Nervous System",
    description: "The network that transmits signals between different parts of the body.",
    parts: [
      { id: "brain", name: "Brain", description: "The control center of the nervous system." },
      {
        id: "spinal-cord",
        name: "Spinal Cord",
        description: "The main pathway for information connecting the brain and body.",
      },
      {
        id: "peripheral",
        name: "Peripheral Nerves",
        description: "Connect the central nervous system to limbs and organs.",
      },
      { id: "cranial", name: "Cranial Nerves", description: "Connect the brain to the head and neck." },
      { id: "autonomic", name: "Autonomic Nervous System", description: "Controls involuntary functions." },
      {
        id: "cerebrum",
        name: "Cerebrum",
        description: "The largest part of the brain, responsible for higher functions.",
      },
      { id: "cerebellum", name: "Cerebellum", description: "Coordinates movement and balance." },
      {
        id: "brainstem",
        name: "Brainstem",
        description: "Connects the brain to the spinal cord, controls basic functions.",
      },
    ],
    image: "/placeholder.svg?height=600&width=400",
  },
  respiratory: {
    name: "Respiratory System",
    description: "The organs involved in breathing that enable gas exchange.",
    parts: [
      { id: "nose", name: "Nose", description: "Filters, warms, and humidifies inhaled air." },
      { id: "pharynx", name: "Pharynx", description: "Throat, a passageway for air and food." },
      { id: "larynx", name: "Larynx", description: "Voice box, contains vocal cords." },
      { id: "trachea", name: "Trachea", description: "Windpipe, connects larynx to bronchi." },
      { id: "bronchi", name: "Bronchi", description: "Airways that lead to the lungs." },
      { id: "lungs", name: "Lungs", description: "Main organs of respiration where gas exchange occurs." },
      { id: "diaphragm", name: "Diaphragm", description: "Muscle that contracts to expand the lungs." },
      { id: "alveoli", name: "Alveoli", description: "Tiny air sacs where oxygen and carbon dioxide are exchanged." },
    ],
    image: "/placeholder.svg?height=600&width=400",
  },
  digestive: {
    name: "Digestive System",
    description: "The organs that break down food into nutrients that can be absorbed and used by the body.",
    parts: [
      { id: "mouth", name: "Mouth", description: "Where digestion begins with chewing and saliva." },
      { id: "esophagus", name: "Esophagus", description: "Tube that carries food from mouth to stomach." },
      { id: "stomach", name: "Stomach", description: "Muscular organ that mixes food with digestive juices." },
      { id: "small-intestine", name: "Small Intestine", description: "Where most digestion and absorption occurs." },
      { id: "large-intestine", name: "Large Intestine", description: "Absorbs water and forms feces." },
      { id: "liver", name: "Liver", description: "Produces bile and performs many metabolic functions." },
      { id: "pancreas", name: "Pancreas", description: "Produces digestive enzymes and hormones." },
      { id: "gallbladder", name: "Gallbladder", description: "Stores and concentrates bile." },
    ],
    image: "/placeholder.svg?height=600&width=400",
  },
}

export default function HumanAnatomyLab() {
  const [activeSystem, setActiveSystem] = useState("skeletal")
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [zoomLevel, setZoomLevel] = useState(1)
  const [rotation, setRotation] = useState(0)
  const [showLabels, setShowLabels] = useState(true)
  const [viewMode, setViewMode] = useState<"3d" | "cross-section">("3d")
  const [visibleSystems, setVisibleSystems] = useState<string[]>(["skeletal"])
  const [isMounted, setIsMounted] = useState(false)

  // Safe client-side rendering
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Handle system change
  const handleSystemChange = (system: string) => {
    setActiveSystem(system)
    setSelectedPart(null)

    // Update visible systems
    if (!visibleSystems.includes(system)) {
      setVisibleSystems([...visibleSystems, system])
    }
  }

  // Toggle system visibility
  const toggleSystemVisibility = (system: string) => {
    if (visibleSystems.includes(system)) {
      // Don't allow removing the active system
      if (system === activeSystem) return

      setVisibleSystems(visibleSystems.filter((s) => s !== system))
    } else {
      setVisibleSystems([...visibleSystems, system])
    }
  }

  // Handle part selection
  const handlePartClick = (partId: string) => {
    setSelectedPart(partId)
  }

  // Zoom in/out
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.25, 3))
  }

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.25, 0.5))
  }

  // Rotate model
  const handleRotateClockwise = () => {
    setRotation((prev) => (prev + 90) % 360)
  }

  const handleRotateCounterClockwise = () => {
    setRotation((prev) => (prev - 90 + 360) % 360)
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
          <h1 className="text-2xl font-bold text-white">Human Anatomy Lab</h1>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <Card className="overflow-hidden border-gray-800 bg-gray-900">
              <CardContent className="p-6">
                <div className="flex flex-col items-center">
                  <div className="relative mb-4 h-[600px] w-full max-w-md">
                    <div
                      className="h-full w-full overflow-hidden rounded-lg border border-gray-700 bg-black"
                      style={{
                        transform: `scale(${zoomLevel}) rotate(${rotation}deg)`,
                        transition: "transform 0.3s ease",
                      }}
                    >
                      {/* Layered anatomy systems */}
                      {visibleSystems.map((system, index) => (
                        <div
                          key={system}
                          className="absolute inset-0 transition-opacity"
                          style={{
                            zIndex: index,
                            opacity: system === activeSystem ? 1 : 0.5,
                          }}
                        >
                          <img
                            src={anatomySystems[system as keyof typeof anatomySystems].image || "/placeholder.svg"}
                            alt={anatomySystems[system as keyof typeof anatomySystems].name}
                            className="h-full w-full object-contain"
                          />

                          {/* Part labels */}
                          {showLabels && system === activeSystem && (
                            <div className="absolute inset-0">
                              {anatomySystems[system as keyof typeof anatomySystems].parts.map((part) => (
                                <div
                                  key={part.id}
                                  className={`absolute cursor-pointer rounded-full border-2 p-1 transition-all ${
                                    selectedPart === part.id
                                      ? "border-orange-500 bg-orange-500/30"
                                      : "border-blue-500 bg-blue-500/30"
                                  }`}
                                  style={{
                                    // Placeholder positions - would be specific in a real implementation
                                    top: `${Math.random() * 80 + 10}%`,
                                    left: `${Math.random() * 80 + 10}%`,
                                    transform: "translate(-50%, -50%)",
                                  }}
                                  onClick={() => handlePartClick(part.id)}
                                >
                                  <div className="h-3 w-3 rounded-full bg-white" />
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {/* Controls overlay */}
                    <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 rounded-lg bg-black/70 p-2 backdrop-blur-sm">
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleZoomIn}
                          className="h-8 w-8 border-gray-700 bg-gray-900"
                        >
                          <ZoomIn className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleZoomOut}
                          className="h-8 w-8 border-gray-700 bg-gray-900"
                        >
                          <ZoomOut className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleRotateClockwise}
                          className="h-8 w-8 border-gray-700 bg-gray-900"
                        >
                          <RotateCw className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={handleRotateCounterClockwise}
                          className="h-8 w-8 border-gray-700 bg-gray-900"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                          <Label htmlFor="show-labels" className="text-xs text-white">
                            Labels
                          </Label>
                          <Switch id="show-labels" checked={showLabels} onCheckedChange={setShowLabels} />
                        </div>
                        <Select
                          value={viewMode}
                          onValueChange={(value) => setViewMode(value as "3d" | "cross-section")}
                        >
                          <SelectTrigger className="h-8 w-[130px] border-gray-700 bg-gray-900">
                            <SelectValue placeholder="View Mode" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="3d">3D View</SelectItem>
                            <SelectItem value="cross-section">Cross Section</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Selected part information */}
                  {selectedPart && (
                    <div className="mt-4 w-full rounded-lg border border-gray-800 bg-gray-950 p-4">
                      <h3 className="mb-2 text-lg font-medium text-white">
                        {
                          anatomySystems[activeSystem as keyof typeof anatomySystems].parts.find(
                            (p) => p.id === selectedPart,
                          )?.name
                        }
                      </h3>
                      <p className="text-gray-300">
                        {
                          anatomySystems[activeSystem as keyof typeof anatomySystems].parts.find(
                            (p) => p.id === selectedPart,
                          )?.description
                        }
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div>
            <Card className="border-gray-800 bg-gray-900">
              <CardContent className="p-6">
                <Tabs defaultValue="systems">
                  <TabsList className="w-full bg-gray-800">
                    <TabsTrigger value="systems" className="flex-1">
                      Systems
                    </TabsTrigger>
                    <TabsTrigger value="parts" className="flex-1">
                      Parts
                    </TabsTrigger>
                    <TabsTrigger value="layers" className="flex-1">
                      Layers
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="systems" className="mt-4 space-y-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-gray-200">Body System</label>
                      <Select value={activeSystem} onValueChange={handleSystemChange}>
                        <SelectTrigger className="border-gray-800 bg-gray-950">
                          <SelectValue placeholder="Select body system" />
                        </SelectTrigger>
                        <SelectContent>
                          {Object.entries(anatomySystems).map(([key, system]) => (
                            <SelectItem key={key} value={key}>
                              {system.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="rounded-lg border border-gray-800 bg-gray-950 p-4">
                      <h3 className="mb-2 text-lg font-medium text-white">
                        {anatomySystems[activeSystem as keyof typeof anatomySystems].name}
                      </h3>
                      <p className="mb-4 text-sm text-gray-300">
                        {anatomySystems[activeSystem as keyof typeof anatomySystems].description}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-gray-200">Key Functions:</p>
                        <ul className="list-inside list-disc space-y-1 text-sm text-gray-300">
                          {activeSystem === "skeletal" && (
                            <>
                              <li>Support and protection of soft tissues</li>
                              <li>Mineral storage (calcium, phosphorus)</li>
                              <li>Blood cell production in bone marrow</li>
                              <li>Leverage for muscle action</li>
                            </>
                          )}
                          {activeSystem === "muscular" && (
                            <>
                              <li>Movement and locomotion</li>
                              <li>Posture maintenance</li>
                              <li>Heat production</li>
                              <li>Support for soft tissues</li>
                            </>
                          )}
                          {activeSystem === "circulatory" && (
                            <>
                              <li>Transport of oxygen, nutrients, and hormones</li>
                              <li>Removal of metabolic waste</li>
                              <li>Temperature regulation</li>
                              <li>Immune system support</li>
                            </>
                          )}
                          {activeSystem === "nervous" && (
                            <>
                              <li>Sensory perception</li>
                              <li>Motor control</li>
                              <li>Information processing</li>
                              <li>Regulation of body functions</li>
                            </>
                          )}
                          {activeSystem === "respiratory" && (
                            <>
                              <li>Oxygen intake and carbon dioxide removal</li>
                              <li>Acid-base balance regulation</li>
                              <li>Voice production</li>
                              <li>Protection from inhaled pathogens</li>
                            </>
                          )}
                          {activeSystem === "digestive" && (
                            <>
                              <li>Food breakdown and nutrient absorption</li>
                              <li>Waste elimination</li>
                              <li>Water and electrolyte balance</li>
                              <li>Storage of energy as glycogen and fat</li>
                            </>
                          )}
                        </ul>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="parts" className="mt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">
                        {anatomySystems[activeSystem as keyof typeof anatomySystems].name} Components
                      </h3>
                      <div className="grid grid-cols-1 gap-2">
                        {anatomySystems[activeSystem as keyof typeof anatomySystems].parts.map((part) => (
                          <div
                            key={part.id}
                            className={`cursor-pointer rounded-lg border p-3 transition-colors ${
                              selectedPart === part.id
                                ? "border-orange-500 bg-orange-500/10"
                                : "border-gray-800 bg-gray-950 hover:border-gray-700"
                            }`}
                            onClick={() => handlePartClick(part.id)}
                          >
                            <h4 className="font-medium text-white">{part.name}</h4>
                            <p className="text-sm text-gray-400">{part.description}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="layers" className="mt-4">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium text-white">Visible Layers</h3>
                      <div className="space-y-2">
                        {Object.entries(anatomySystems).map(([key, system]) => (
                          <div
                            key={key}
                            className="flex items-center justify-between rounded-lg border border-gray-800 bg-gray-950 p-3"
                          >
                            <span className="text-gray-200">{system.name}</span>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8"
                                onClick={() => toggleSystemVisibility(key)}
                                disabled={key === activeSystem}
                              >
                                {visibleSystems.includes(key) ? (
                                  <Eye className="h-4 w-4" />
                                ) : (
                                  <EyeOff className="h-4 w-4" />
                                )}
                              </Button>
                              <Button
                                variant={activeSystem === key ? "default" : "outline"}
                                size="sm"
                                onClick={() => handleSystemChange(key)}
                              >
                                {activeSystem === key ? "Active" : "Activate"}
                              </Button>
                            </div>
                          </div>
                        ))}
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
