"use client"

import { useEffect, useRef, useState } from "react"
import * as THREE from "three"
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls"
import { CSS2DRenderer, CSS2DObject } from "three/examples/jsm/renderers/CSS2DRenderer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"

// Define molecule data structure
interface Atom {
  element: string
  position: [number, number, number]
  color: string
}

interface Bond {
  atoms: [number, number]
  order: number
}

interface Molecule {
  name: string
  formula: string
  atoms: Atom[]
  bonds: Bond[]
}

// Color mapping for common elements
const elementColors = {
  H: "#FFFFFF",
  C: "#909090",
  N: "#3050F8",
  O: "#FF0D0D",
  F: "#90E050",
  P: "#FF8000",
  S: "#FFFF30",
  Cl: "#1FF01F",
  Br: "#A62929",
  I: "#940094",
  Na: "#AB5CF2",
  Mg: "#8AFF00",
  Ca: "#3DFF00",
  Fe: "#E06633",
  default: "#FFD3D3",
}

// Atomic radii in Angstroms
const atomicRadii = {
  H: 0.25,
  C: 0.7,
  N: 0.65,
  O: 0.6,
  F: 0.5,
  P: 1.0,
  S: 1.0,
  Cl: 1.0,
  Br: 1.15,
  I: 1.4,
  Na: 1.8,
  Mg: 1.5,
  Ca: 1.8,
  Fe: 1.4,
  default: 0.8,
}

// Sample molecules
const molecules: Record<string, Molecule> = {
  water: {
    name: "Water",
    formula: "H₂O",
    atoms: [
      { element: "O", position: [0, 0, 0], color: elementColors.O },
      { element: "H", position: [0.8, -0.5, 0], color: elementColors.H },
      { element: "H", position: [-0.8, -0.5, 0], color: elementColors.H },
    ],
    bonds: [
      { atoms: [0, 1], order: 1 },
      { atoms: [0, 2], order: 1 },
    ],
  },
  methane: {
    name: "Methane",
    formula: "CH₄",
    atoms: [
      { element: "C", position: [0, 0, 0], color: elementColors.C },
      { element: "H", position: [0.8, 0.8, 0.8], color: elementColors.H },
      { element: "H", position: [-0.8, -0.8, 0.8], color: elementColors.H },
      { element: "H", position: [0.8, -0.8, -0.8], color: elementColors.H },
      { element: "H", position: [-0.8, 0.8, -0.8], color: elementColors.H },
    ],
    bonds: [
      { atoms: [0, 1], order: 1 },
      { atoms: [0, 2], order: 1 },
      { atoms: [0, 3], order: 1 },
      { atoms: [0, 4], order: 1 },
    ],
  },
  ammonia: {
    name: "Ammonia",
    formula: "NH₃",
    atoms: [
      { element: "N", position: [0, 0, 0], color: elementColors.N },
      { element: "H", position: [0.8, 0.6, 0], color: elementColors.H },
      { element: "H", position: [-0.4, 0.6, 0.7], color: elementColors.H },
      { element: "H", position: [-0.4, 0.6, -0.7], color: elementColors.H },
    ],
    bonds: [
      { atoms: [0, 1], order: 1 },
      { atoms: [0, 2], order: 1 },
      { atoms: [0, 3], order: 1 },
    ],
  },
  ethanol: {
    name: "Ethanol",
    formula: "C₂H₅OH",
    atoms: [
      { element: "C", position: [0, 0, 0], color: elementColors.C },
      { element: "C", position: [1.5, 0, 0], color: elementColors.C },
      { element: "O", position: [2.8, 0.5, 0], color: elementColors.O },
      { element: "H", position: [-0.5, 1.0, 0], color: elementColors.H },
      { element: "H", position: [-0.5, -0.5, 0.9], color: elementColors.H },
      { element: "H", position: [-0.5, -0.5, -0.9], color: elementColors.H },
      { element: "H", position: [1.5, -1.0, 0.5], color: elementColors.H },
      { element: "H", position: [1.5, -0.5, -1.0], color: elementColors.H },
      { element: "H", position: [3.3, -0.3, 0], color: elementColors.H },
    ],
    bonds: [
      { atoms: [0, 1], order: 1 },
      { atoms: [1, 2], order: 1 },
      { atoms: [0, 3], order: 1 },
      { atoms: [0, 4], order: 1 },
      { atoms: [0, 5], order: 1 },
      { atoms: [1, 6], order: 1 },
      { atoms: [1, 7], order: 1 },
      { atoms: [2, 8], order: 1 },
    ],
  },
}

interface MolecularViewerProps {
  initialMolecule?: string
}

export default function MolecularViewer3D({ initialMolecule = "water" }: MolecularViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null)
  const labelRendererRef = useRef<CSS2DRenderer | null>(null)
  const sceneRef = useRef<THREE.Scene | null>(null)
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null)
  const controlsRef = useRef<OrbitControls | null>(null)
  const animationFrameRef = useRef<number | null>(null)
  const moleculeGroupRef = useRef<THREE.Group | null>(null)

  const [currentMolecule, setCurrentMolecule] = useState(initialMolecule)
  const [showLabels, setShowLabels] = useState(true)
  const [renderStyle, setRenderStyle] = useState<"ball-and-stick" | "space-filling">("ball-and-stick")
  const [rotationSpeed, setRotationSpeed] = useState(0)
  const [isInitialized, setIsInitialized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { toast } = useToast()

  // Initialize the 3D scene
  useEffect(() => {
    if (!containerRef.current || isInitialized) return

    try {
      // Create scene
      const scene = new THREE.Scene()
      scene.background = new THREE.Color(0x121212)
      sceneRef.current = scene

      // Create camera
      const camera = new THREE.PerspectiveCamera(
        75,
        containerRef.current.clientWidth / containerRef.current.clientHeight,
        0.1,
        1000,
      )
      camera.position.z = 5
      cameraRef.current = camera

      // Create renderer
      const renderer = new THREE.WebGLRenderer({ antialias: true })
      renderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      containerRef.current.appendChild(renderer.domElement)
      rendererRef.current = renderer

      // Create label renderer
      const labelRenderer = new CSS2DRenderer()
      labelRenderer.setSize(containerRef.current.clientWidth, containerRef.current.clientHeight)
      labelRenderer.domElement.style.position = "absolute"
      labelRenderer.domElement.style.top = "0"
      labelRenderer.domElement.style.pointerEvents = "none"
      containerRef.current.appendChild(labelRenderer.domElement)
      labelRendererRef.current = labelRenderer

      // Create controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.25
      controlsRef.current = controls

      // Add ambient light
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)

      // Add directional light
      const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
      directionalLight.position.set(1, 1, 1)
      scene.add(directionalLight)

      // Create molecule group
      const moleculeGroup = new THREE.Group()
      scene.add(moleculeGroup)
      moleculeGroupRef.current = moleculeGroup

      // Handle window resize
      const handleResize = () => {
        if (!containerRef.current || !cameraRef.current || !rendererRef.current || !labelRendererRef.current) return

        const width = containerRef.current.clientWidth
        const height = containerRef.current.clientHeight

        cameraRef.current.aspect = width / height
        cameraRef.current.updateProjectionMatrix()

        rendererRef.current.setSize(width, height)
        labelRendererRef.current.setSize(width, height)
      }

      window.addEventListener("resize", handleResize)

      // Animation loop
      const animate = () => {
        animationFrameRef.current = requestAnimationFrame(animate)

        if (controlsRef.current) {
          controlsRef.current.update()
        }

        if (moleculeGroupRef.current && rotationSpeed > 0) {
          moleculeGroupRef.current.rotation.y += rotationSpeed / 100
        }

        if (rendererRef.current && sceneRef.current && cameraRef.current) {
          rendererRef.current.render(sceneRef.current, cameraRef.current)
        }

        if (labelRendererRef.current && sceneRef.current && cameraRef.current) {
          labelRendererRef.current.render(sceneRef.current, cameraRef.current)
        }
      }

      animate()
      setIsInitialized(true)

      // Cleanup function
      return () => {
        window.removeEventListener("resize", handleResize)

        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current)
        }

        if (rendererRef.current && containerRef.current) {
          containerRef.current.removeChild(rendererRef.current.domElement)
        }

        if (labelRendererRef.current && containerRef.current) {
          containerRef.current.removeChild(labelRendererRef.current.domElement)
        }

        if (controlsRef.current) {
          controlsRef.current.dispose()
        }
      }
    } catch (error) {
      console.error("Error initializing 3D viewer:", error)
      toast({
        title: "Error",
        description: "Failed to initialize 3D viewer. Please try again.",
        variant: "destructive",
      })
    }
  }, [isInitialized, rotationSpeed, toast])

  // Load molecule
  useEffect(() => {
    if (!isInitialized || !moleculeGroupRef.current || !sceneRef.current) return

    try {
      // Clear previous molecule
      while (moleculeGroupRef.current.children.length > 0) {
        const object = moleculeGroupRef.current.children[0]
        moleculeGroupRef.current.remove(object)
      }

      const molecule = molecules[currentMolecule]
      if (!molecule) return

      // Scale factor for the molecule
      const scaleFactor = 1.5

      // Create atoms
      molecule.atoms.forEach((atom, index) => {
        const radius =
          (atomicRadii[atom.element as keyof typeof atomicRadii] || atomicRadii.default) *
          (renderStyle === "space-filling" ? 1 : 0.5)

        const geometry = new THREE.SphereGeometry(radius * scaleFactor, 32, 32)
        const material = new THREE.MeshPhongMaterial({
          color: new THREE.Color(atom.color),
          specular: 0x555555,
          shininess: 30,
        })

        const sphere = new THREE.Mesh(geometry, material)
        sphere.position.set(
          atom.position[0] * scaleFactor,
          atom.position[1] * scaleFactor,
          atom.position[2] * scaleFactor,
        )

        moleculeGroupRef.current?.add(sphere)

        // Add label if enabled
        if (showLabels) {
          const labelDiv = document.createElement("div")
          labelDiv.className = "text-xs font-bold"
          labelDiv.textContent = atom.element
          labelDiv.style.color = "white"
          labelDiv.style.backgroundColor = "rgba(0,0,0,0.5)"
          labelDiv.style.padding = "2px 4px"
          labelDiv.style.borderRadius = "4px"

          const label = new CSS2DObject(labelDiv)
          label.position.set(
            atom.position[0] * scaleFactor,
            atom.position[1] * scaleFactor + radius * scaleFactor + 0.2,
            atom.position[2] * scaleFactor,
          )

          sphere.add(label)
        }
      })

      // Create bonds if using ball-and-stick model
      if (renderStyle === "ball-and-stick") {
        molecule.bonds.forEach((bond) => {
          const atom1 = molecule.atoms[bond.atoms[0]]
          const atom2 = molecule.atoms[bond.atoms[1]]

          const start = new THREE.Vector3(
            atom1.position[0] * scaleFactor,
            atom1.position[1] * scaleFactor,
            atom1.position[2] * scaleFactor,
          )

          const end = new THREE.Vector3(
            atom2.position[0] * scaleFactor,
            atom2.position[1] * scaleFactor,
            atom2.position[2] * scaleFactor,
          )

          const direction = new THREE.Vector3().subVectors(end, start)
          const length = direction.length()

          // Create a cylinder for the bond
          const bondGeometry = new THREE.CylinderGeometry(0.1, 0.1, length, 8)
          const bondMaterial = new THREE.MeshPhongMaterial({ color: 0xcccccc })
          const bondCylinder = new THREE.Mesh(bondGeometry, bondMaterial)

          // Position and rotate the cylinder to connect the atoms
          const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5)
          bondCylinder.position.copy(midpoint)

          // Align the cylinder with the bond direction
          bondCylinder.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), direction.clone().normalize())

          moleculeGroupRef.current?.add(bondCylinder)
        })
      }

      // Center the molecule
      const box = new THREE.Box3().setFromObject(moleculeGroupRef.current)
      const center = box.getCenter(new THREE.Vector3())
      moleculeGroupRef.current.position.sub(center)

      // Reset camera and controls
      if (cameraRef.current && controlsRef.current) {
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const fov = cameraRef.current.fov * (Math.PI / 180)
        let cameraDistance = maxDim / (2 * Math.tan(fov / 2))

        // Add some padding
        cameraDistance *= 1.5

        cameraRef.current.position.z = cameraDistance
        controlsRef.current.target.set(0, 0, 0)
        controlsRef.current.update()
      }
    } catch (error) {
      console.error("Error loading molecule:", error)
      toast({
        title: "Error",
        description: "Failed to load molecule. Please try again.",
        variant: "destructive",
      })
    }
  }, [currentMolecule, isInitialized, renderStyle, showLabels, toast])

  // Handle fullscreen toggle
  const toggleFullscreen = () => {
    try {
      if (!containerRef.current) return

      if (!isFullscreen) {
        if (containerRef.current.requestFullscreen) {
          containerRef.current.requestFullscreen()
        }
      } else {
        if (document.exitFullscreen) {
          document.exitFullscreen()
        }
      }
    } catch (error) {
      console.error("Error toggling fullscreen:", error)
      toast({
        title: "Error",
        description: "Failed to toggle fullscreen. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Update fullscreen state
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Take a screenshot
  const takeScreenshot = () => {
    try {
      if (!rendererRef.current) return

      // Render the scene
      if (sceneRef.current && cameraRef.current) {
        rendererRef.current.render(sceneRef.current, cameraRef.current)
      }

      // Get the canvas data URL
      const dataURL = rendererRef.current.domElement.toDataURL("image/png")

      // Create a link element and trigger download
      const link = document.createElement("a")
      link.href = dataURL
      link.download = `${molecules[currentMolecule]?.name || "molecule"}.png`
      link.click()

      toast({
        title: "Screenshot Saved",
        description: "Your molecule screenshot has been downloaded.",
      })
    } catch (error) {
      console.error("Error taking screenshot:", error)
      toast({
        title: "Error",
        description: "Failed to take screenshot. Please try again.",
        variant: "destructive",
      })
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>3D Molecular Viewer - {molecules[currentMolecule]?.formula || "Molecule"}</CardTitle>
        <CardDescription>Interact with 3D molecular structures. Drag to rotate, scroll to zoom.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div
            ref={containerRef}
            className="w-full h-[400px] relative bg-gray-900 rounded-md overflow-hidden"
            style={{ touchAction: "none" }}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Select Molecule</label>
              <Select value={currentMolecule} onValueChange={setCurrentMolecule}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a molecule" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(molecules).map(([key, molecule]) => (
                    <SelectItem key={key} value={key}>
                      {molecule.name} ({molecule.formula})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Visualization Style</label>
              <Tabs value={renderStyle} onValueChange={(value) => setRenderStyle(value as any)}>
                <TabsList className="w-full">
                  <TabsTrigger value="ball-and-stick" className="flex-1">
                    Ball and Stick
                  </TabsTrigger>
                  <TabsTrigger value="space-filling" className="flex-1">
                    Space Filling
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Rotation Speed</label>
              <span className="text-xs text-gray-500">{rotationSpeed}</span>
            </div>
            <Slider
              value={[rotationSpeed]}
              min={0}
              max={10}
              step={1}
              onValueChange={(values) => setRotationSpeed(values[0])}
            />
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowLabels(!showLabels)}>
            {showLabels ? "Hide Labels" : "Show Labels"}
          </Button>
          <Button variant="outline" size="sm" onClick={takeScreenshot}>
            Take Screenshot
          </Button>
        </div>
        <Button variant="outline" size="sm" onClick={toggleFullscreen}>
          {isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
        </Button>
      </CardFooter>
    </Card>
  )
}
