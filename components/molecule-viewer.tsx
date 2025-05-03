"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface MoleculeViewerProps {
  className?: string
}

export function MoleculeViewer({ className }: MoleculeViewerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [molecule, setMolecule] = useState<string>("water")
  const [isRotating, setIsRotating] = useState(true)
  const [rotationSpeed, setRotationSpeed] = useState(0.01)
  const animationRef = useRef<number>(0)

  // Molecule data
  const molecules = {
    water: {
      atoms: [
        { element: "O", color: "#ff0000", radius: 0.4, position: [0, 0, 0] },
        { element: "H", color: "#ffffff", radius: 0.2, position: [-0.8, -0.5, 0] },
        { element: "H", color: "#ffffff", radius: 0.2, position: [0.8, -0.5, 0] },
      ],
      bonds: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
      ],
    },
    methane: {
      atoms: [
        { element: "C", color: "#808080", radius: 0.4, position: [0, 0, 0] },
        { element: "H", color: "#ffffff", radius: 0.2, position: [0.8, 0.8, 0.8] },
        { element: "H", color: "#ffffff", radius: 0.2, position: [-0.8, -0.8, 0.8] },
        { element: "H", color: "#ffffff", radius: 0.2, position: [0.8, -0.8, -0.8] },
        { element: "H", color: "#ffffff", radius: 0.2, position: [-0.8, 0.8, -0.8] },
      ],
      bonds: [
        { from: 0, to: 1 },
        { from: 0, to: 2 },
        { from: 0, to: 3 },
        { from: 0, to: 4 },
      ],
    },
    benzene: {
      atoms: [
        { element: "C", color: "#808080", radius: 0.4, position: [0, 1, 0] },
        { element: "C", color: "#808080", radius: 0.4, position: [0.866, 0.5, 0] },
        { element: "C", color: "#808080", radius: 0.4, position: [0.866, -0.5, 0] },
        { element: "C", color: "#808080", radius: 0.4, position: [0, -1, 0] },
        { element: "C", color: "#808080", radius: 0.4, position: [-0.866, -0.5, 0] },
        { element: "C", color: "#808080", radius: 0.4, position: [-0.866, 0.5, 0] },
        { element: "H", color: "#ffffff", radius: 0.2, position: [0, 1.8, 0] },
        { element: "H", color: "#ffffff", radius: 0.2, position: [1.56, 0.9, 0] },
        { element: "H", color: "#ffffff", radius: 0.2, position: [1.56, -0.9, 0] },
        { element: "H", color: "#ffffff", radius: 0.2, position: [0, -1.8, 0] },
        { element: "H", color: "#ffffff", radius: 0.2, position: [-1.56, -0.9, 0] },
        { element: "H", color: "#ffffff", radius: 0.2, position: [-1.56, 0.9, 0] },
      ],
      bonds: [
        { from: 0, to: 1 },
        { from: 1, to: 2 },
        { from: 2, to: 3 },
        { from: 3, to: 4 },
        { from: 4, to: 5 },
        { from: 5, to: 0 },
        { from: 0, to: 6 },
        { from: 1, to: 7 },
        { from: 2, to: 8 },
        { from: 3, to: 9 },
        { from: 4, to: 10 },
        { from: 5, to: 11 },
      ],
    },
  }

  // 3D rendering
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (!canvas) return
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // 3D rotation matrices
    let angleX = 0
    let angleY = 0

    const rotateX = (point: number[], angle: number) => {
      const [x, y, z] = point
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return [x, y * cos - z * sin, y * sin + z * cos]
    }

    const rotateY = (point: number[], angle: number) => {
      const [x, y, z] = point
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      return [x * cos + z * sin, y, -x * sin + z * cos]
    }

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update rotation angles
      if (isRotating) {
        angleY += rotationSpeed
        angleX += rotationSpeed * 0.5
      }

      // Get current molecule data
      const moleculeData = molecules[molecule as keyof typeof molecules]
      if (!moleculeData) return

      // Scale factor
      const scale = Math.min(canvas.width, canvas.height) / 4

      // Center of canvas
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2

      // Sort atoms by z-coordinate for proper depth rendering
      const atoms = [...moleculeData.atoms].map((atom, index) => ({
        ...atom,
        index,
        position: rotateY(rotateX(atom.position, angleX), angleY),
      }))

      atoms.sort((a, b) => a.position[2] - b.position[2])

      // Draw bonds
      ctx.lineWidth = 5
      ctx.lineCap = "round"
      ctx.strokeStyle = "rgba(255, 255, 255, 0.5)"

      moleculeData.bonds.forEach((bond) => {
        const fromAtom = moleculeData.atoms[bond.from]
        const toAtom = moleculeData.atoms[bond.to]

        const fromPos = rotateY(rotateX(fromAtom.position, angleX), angleY)
        const toPos = rotateY(rotateX(toAtom.position, angleX), angleY)

        ctx.beginPath()
        ctx.moveTo(centerX + fromPos[0] * scale, centerY + fromPos[1] * scale)
        ctx.lineTo(centerX + toPos[0] * scale, centerY + toPos[1] * scale)
        ctx.stroke()
      })

      // Draw atoms
      atoms.forEach((atom) => {
        const [x, y, z] = atom.position
        const depth = (z + 2) / 4 // Normalize depth for shading
        const radius = atom.radius * scale * (0.8 + depth * 0.2) // Scale radius by depth

        // Draw atom
        ctx.beginPath()
        ctx.arc(centerX + x * scale, centerY + y * scale, radius, 0, Math.PI * 2)

        // Create gradient for 3D effect
        const gradient = ctx.createRadialGradient(
          centerX + x * scale - radius * 0.3,
          centerY + y * scale - radius * 0.3,
          0,
          centerX + x * scale,
          centerY + y * scale,
          radius,
        )
        gradient.addColorStop(0, atom.color)
        gradient.addColorStop(1, shadeColor(atom.color, -30))

        ctx.fillStyle = gradient
        ctx.fill()

        // Add highlight
        ctx.beginPath()
        ctx.arc(centerX + x * scale - radius * 0.3, centerY + y * scale - radius * 0.3, radius * 0.3, 0, Math.PI * 2)
        ctx.fillStyle = "rgba(255, 255, 255, 0.3)"
        ctx.fill()

        // Add element label
        ctx.fillStyle = "#ffffff"
        ctx.font = `${radius * 0.8}px Arial`
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(atom.element, centerX + x * scale, centerY + y * scale)
      })

      animationRef.current = requestAnimationFrame(animate)
    }

    // Helper function to shade colors
    const shadeColor = (color: string, percent: number) => {
      let R = Number.parseInt(color.substring(1, 3), 16)
      let G = Number.parseInt(color.substring(3, 5), 16)
      let B = Number.parseInt(color.substring(5, 7), 16)

      R = Math.floor((R * (100 + percent)) / 100)
      G = Math.floor((G * (100 + percent)) / 100)
      B = Math.floor((B * (100 + percent)) / 100)

      R = R < 255 ? R : 255
      G = G < 255 ? G : 255
      B = B < 255 ? B : 255

      R = R.toString(16).padStart(2, "0")
      G = G.toString(16).padStart(2, "0")
      B = B.toString(16).padStart(2, "0")

      return `#${R}${G}${B}`
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [molecule, isRotating, rotationSpeed])

  return (
    <div className={cn("relative w-full h-full", className)}>
      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-move"
        onMouseDown={() => setIsRotating(false)}
        onMouseUp={() => setIsRotating(true)}
        onMouseLeave={() => setIsRotating(true)}
      />

      <div className="absolute bottom-4 left-4 flex gap-2">
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            molecule === "water" ? "bg-blue-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => setMolecule("water")}
        >
          H₂O
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            molecule === "methane" ? "bg-blue-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => setMolecule("methane")}
        >
          CH₄
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            molecule === "benzene" ? "bg-blue-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => setMolecule("benzene")}
        >
          C₆H₆
        </button>
      </div>

      <div className="absolute bottom-4 right-4">
        <input
          type="range"
          min="0.001"
          max="0.05"
          step="0.001"
          value={rotationSpeed}
          onChange={(e) => setRotationSpeed(Number.parseFloat(e.target.value))}
          className="w-32"
        />
      </div>
    </div>
  )
}
