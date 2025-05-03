"use client"

import { useRef, useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"

interface CellPart {
  id: string
  name: string
  description: string
  position: { x: number; y: number }
  size: number
  color: string
}

interface CellExplorerProps {
  className?: string
  cellType?: "animal" | "plant" | "bacteria"
}

export function CellExplorer({ className, cellType: initialCellType = "animal" }: CellExplorerProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [selectedPart, setSelectedPart] = useState<string | null>(null)
  const [isZoomed, setIsZoomed] = useState(false)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [cellType, setCellType] = useState<"animal" | "plant" | "bacteria">(initialCellType)

  // Define cell parts based on cell type
  const cellParts: Record<string, CellPart[]> = {
    animal: [
      {
        id: "nucleus",
        name: "Nucleus",
        description: "The control center of the cell, containing genetic material (DNA) that directs cell activities.",
        position: { x: 50, y: 45 },
        size: 18,
        color: "#6366f1",
      },
      {
        id: "mitochondria",
        name: "Mitochondria",
        description: "The powerhouse of the cell, producing energy through cellular respiration.",
        position: { x: 70, y: 60 },
        size: 12,
        color: "#ef4444",
      },
      {
        id: "er",
        name: "Endoplasmic Reticulum",
        description: "A network of membranes involved in protein synthesis and lipid metabolism.",
        position: { x: 35, y: 65 },
        size: 15,
        color: "#3b82f6",
      },
      {
        id: "golgi",
        name: "Golgi Apparatus",
        description: "Processes and packages proteins for secretion or use within the cell.",
        position: { x: 25, y: 40 },
        size: 14,
        color: "#10b981",
      },
      {
        id: "lysosome",
        name: "Lysosome",
        description: "Contains digestive enzymes that break down waste materials and cellular debris.",
        position: { x: 65, y: 30 },
        size: 10,
        color: "#f59e0b",
      },
    ],
    plant: [
      {
        id: "nucleus",
        name: "Nucleus",
        description: "The control center of the cell, containing genetic material (DNA) that directs cell activities.",
        position: { x: 50, y: 45 },
        size: 15,
        color: "#6366f1",
      },
      {
        id: "chloroplast",
        name: "Chloroplast",
        description: "Contains chlorophyll and is responsible for photosynthesis.",
        position: { x: 70, y: 60 },
        size: 14,
        color: "#22c55e",
      },
      {
        id: "vacuole",
        name: "Central Vacuole",
        description: "A large, fluid-filled sac that stores water, nutrients, and waste products.",
        position: { x: 50, y: 50 },
        size: 25,
        color: "#3b82f6",
      },
      {
        id: "cell_wall",
        name: "Cell Wall",
        description: "A rigid layer outside the cell membrane that provides structure and protection.",
        position: { x: 50, y: 50 },
        size: 45,
        color: "#a3a3a3",
      },
      {
        id: "mitochondria",
        name: "Mitochondria",
        description: "The powerhouse of the cell, producing energy through cellular respiration.",
        position: { x: 30, y: 35 },
        size: 10,
        color: "#ef4444",
      },
    ],
    bacteria: [
      {
        id: "nucleoid",
        name: "Nucleoid",
        description: "Region containing the bacterial chromosome (DNA).",
        position: { x: 50, y: 50 },
        size: 20,
        color: "#6366f1",
      },
      {
        id: "ribosome",
        name: "Ribosomes",
        description: "Structures that synthesize proteins.",
        position: { x: 60, y: 40 },
        size: 8,
        color: "#f59e0b",
      },
      {
        id: "plasmid",
        name: "Plasmid",
        description: "Small, circular DNA molecules separate from the chromosome.",
        position: { x: 35, y: 55 },
        size: 10,
        color: "#3b82f6",
      },
      {
        id: "cell_wall",
        name: "Cell Wall",
        description: "Rigid structure that provides shape and protection.",
        position: { x: 50, y: 50 },
        size: 45,
        color: "#a3a3a3",
      },
      {
        id: "flagellum",
        name: "Flagellum",
        description: "Whip-like structure used for movement.",
        position: { x: 50, y: 85 },
        size: 5,
        color: "#10b981",
      },
    ],
  }

  const activeCellParts = cellParts[cellType]

  // Update dimensions on resize
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        const { width, height } = containerRef.current.getBoundingClientRect()
        setDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)

    return () => {
      window.removeEventListener("resize", updateDimensions)
    }
  }, [])

  // Handle part selection
  const handlePartClick = (id: string) => {
    if (selectedPart === id) {
      setSelectedPart(null)
      setIsZoomed(false)
    } else {
      setSelectedPart(id)
      setIsZoomed(true)
    }
  }

  return (
    <div className={cn("relative overflow-hidden rounded-lg", className)} ref={containerRef}>
      {/* Cell background */}
      <div
        className={cn("relative w-full h-full transition-transform duration-500", isZoomed ? "scale-125" : "scale-100")}
      >
        <div
          className={cn(
            "absolute inset-0 rounded-full opacity-50",
            cellType === "animal"
              ? "bg-gradient-to-br from-blue-100 to-purple-100"
              : cellType === "plant"
                ? "bg-gradient-to-br from-green-100 to-teal-100"
                : "bg-gradient-to-br from-yellow-100 to-orange-100",
          )}
          style={{
            width: "80%",
            height: "80%",
            left: "10%",
            top: "10%",
          }}
        />

        {/* Cell membrane/wall */}
        <div
          className={cn(
            "absolute rounded-full border-4",
            cellType === "animal"
              ? "border-blue-300"
              : cellType === "plant"
                ? "border-green-700 border-8"
                : "border-yellow-700 border-8",
          )}
          style={{
            width: "80%",
            height: "80%",
            left: "10%",
            top: "10%",
          }}
        />

        {/* Cell parts */}
        {activeCellParts.map((part) => (
          <motion.div
            key={part.id}
            className={cn(
              "absolute rounded-full cursor-pointer transition-all duration-300",
              selectedPart && selectedPart !== part.id ? "opacity-30" : "opacity-100",
            )}
            style={{
              backgroundColor: part.color,
              width: `${part.size}%`,
              height: `${part.size}%`,
              left: `${part.position.x - part.size / 2}%`,
              top: `${part.position.y - part.size / 2}%`,
              zIndex: part.id === "cell_wall" ? 0 : 10,
            }}
            onClick={() => handlePartClick(part.id)}
            whileHover={{ scale: 1.05 }}
            animate={{
              x: selectedPart === part.id ? dimensions.width * 0.1 : 0,
              y: selectedPart === part.id ? dimensions.height * 0.1 : 0,
              scale: selectedPart === part.id ? 1.2 : 1,
            }}
          />
        ))}
      </div>

      {/* Information panel */}
      <AnimatePresence>
        {selectedPart && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm text-white p-4 rounded-t-lg"
          >
            <button
              className="absolute top-2 right-2 text-white/70 hover:text-white"
              onClick={() => {
                setSelectedPart(null)
                setIsZoomed(false)
              }}
            >
              ✕
            </button>
            {activeCellParts
              .filter((part) => part.id === selectedPart)
              .map((part) => (
                <div key={part.id}>
                  <h3 className="text-xl font-bold mb-2">{part.name}</h3>
                  <p className="text-white/80">{part.description}</p>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cell type selector */}
      <div className="absolute top-4 right-4 flex gap-2">
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            cellType === "animal" ? "bg-blue-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => {
            setSelectedPart(null)
            setIsZoomed(false)
            setCellType("animal")
          }}
        >
          Animal
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            cellType === "plant" ? "bg-green-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => {
            setSelectedPart(null)
            setIsZoomed(false)
            setCellType("plant")
          }}
        >
          Plant
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            cellType === "bacteria" ? "bg-yellow-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => {
            setSelectedPart(null)
            setIsZoomed(false)
            setCellType("bacteria")
          }}
        >
          Bacteria
        </button>
      </div>
    </div>
  )
}
