"use client"

import { useState, useEffect } from "react"
import {
  MoleculeWater,
  MoleculeMethane,
  MoleculeAmmonia,
  MoleculeOxygen,
  MoleculeCarbonDioxide,
} from "./molecule-images"

// Map of molecule keys to their SVG components
const moleculeSvgs = {
  water: MoleculeWater,
  methane: MoleculeMethane,
  ammonia: MoleculeAmmonia,
  oxygen: MoleculeOxygen,
  carbon_dioxide: MoleculeCarbonDioxide,
}

interface StaticViewerProps {
  molecule: string
  isRotating: boolean
}

export default function StaticViewer({ molecule, isRotating }: StaticViewerProps) {
  const [rotation, setRotation] = useState(0)

  // Handle rotation animation
  useEffect(() => {
    if (!isRotating) return

    const interval = setInterval(() => {
      setRotation((prev) => (prev + 1) % 360)
    }, 50)

    return () => clearInterval(interval)
  }, [isRotating])

  // Get the correct SVG component
  const MoleculeSvg = moleculeSvgs[molecule] || MoleculeWater

  return (
    <div className="flex h-full w-full items-center justify-center bg-gray-900">
      <div className="transition-transform duration-300 ease-linear" style={{ transform: `rotate(${rotation}deg)` }}>
        <div className="h-64 w-64">
          <MoleculeSvg />
        </div>
      </div>
    </div>
  )
}
