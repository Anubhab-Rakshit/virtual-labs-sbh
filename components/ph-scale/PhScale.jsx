"use client"

import { useState, useEffect, useRef } from "react"
import { ChevronDown } from "lucide-react"
import Navigation from "@/components/ui/Navigation"

const SOLUTIONS = [
  { name: "Battery Acid", ph: 1, color: "#FF0000" },
  { name: "Stomach Acid", ph: 2, color: "#FF3300" },
  { name: "Orange Juice", ph: 3, color: "#FF8C00" },
  { name: "Tomato Juice", ph: 4, color: "#FFD700" },
  { name: "Black Coffee", ph: 5, color: "#FFFF00" },
  { name: "Urine", ph: 6, color: "#ADFF2F" },
  { name: "Pure Water", ph: 7, color: "#90EE90" },
  { name: "Sea Water", ph: 8, color: "#20B2AA" },
  { name: "Baking Soda", ph: 9, color: "#00BFFF" },
  { name: "Milk of Magnesia", ph: 10, color: "#1E90FF" },
  { name: "Ammonia", ph: 11, color: "#4169E1" },
  { name: "Soapy Water", ph: 12, color: "#8A2BE2" },
  { name: "Bleach", ph: 13, color: "#9400D3" },
  { name: "Drain Cleaner", ph: 14, color: "#800080" },
]

export default function PhScale() {
  // Container state
  const [liquidLevel, setLiquidLevel] = useState(50)
  const [waterDrops, setWaterDrops] = useState([])
  const [soluteDrops, setSoluteDrops] = useState([])
  const containerRef = useRef(null)
  const beakerRef = useRef(null)
  const waterDropperRef = useRef(null)
  const soluteDropperRef = useRef(null)

  // Solution state
  const [waterVolume, setWaterVolume] = useState(210) // mL initially with water
  const [soluteVolume, setSoluteVolume] = useState(2) // mL
  const [waterSolution] = useState(SOLUTIONS[6]) // Pure Water pH 7 - fixed
  const [soluteSolution, setSoluteSolution] = useState(SOLUTIONS[0]) // Battery Acid pH 1
  const [mixedSolution, setMixedSolution] = useState({
    name: "Mixed Solution",
    ph: 3.03,
    color: "#FF8C00", // Orange juice color
  })

  // Dropper state
  const [isWaterPouring, setIsWaterPouring] = useState(false)
  const [isSolutePouring, setIsSolutePouring] = useState(false)
  const [showAboutPh, setShowAboutPh] = useState(false)
  const [showMolecules, setShowMolecules] = useState(false)

  // Calculate the mixed pH based on volumes and original pH values
  useEffect(() => {
    if (waterVolume + soluteVolume === 0) return

    // Convert pH to hydrogen ion concentration [H+]
    const waterHPlus = Math.pow(10, -waterSolution.ph)
    const soluteHPlus = Math.pow(10, -soluteSolution.ph)

    // Calculate weighted average based on volumes
    const totalVolume = waterVolume + soluteVolume
    const mixedHPlus = (waterHPlus * waterVolume + soluteHPlus * soluteVolume) / totalVolume

    // Convert back to pH
    const mixedPh = -Math.log10(mixedHPlus)

    // Find the closest solution or interpolate between two
    let closestSolution = SOLUTIONS[0]
    let minDifference = Math.abs(SOLUTIONS[0].ph - mixedPh)

    for (const solution of SOLUTIONS) {
      const difference = Math.abs(solution.ph - mixedPh)
      if (difference < minDifference) {
        minDifference = difference
        closestSolution = solution
      }
    }

    // Interpolate color if between two integer pH values
    let finalColor = closestSolution.color
    if (minDifference > 0.1) {
      const lowerPh = Math.floor(mixedPh)
      const upperPh = Math.ceil(mixedPh)

      if (lowerPh !== upperPh && lowerPh >= 1 && upperPh <= 14) {
        const lowerSolution = SOLUTIONS.find((s) => s.ph === lowerPh)
        const upperSolution = SOLUTIONS.find((s) => s.ph === upperPh)

        if (lowerSolution && upperSolution) {
          // Linear interpolation between colors
          const fraction = mixedPh - lowerPh

          const lowerRgb = hexToRgb(lowerSolution.color)
          const upperRgb = hexToRgb(upperSolution.color)

          const r = Math.round(lowerRgb.r + fraction * (upperRgb.r - lowerRgb.r))
          const g = Math.round(lowerRgb.g + fraction * (upperRgb.g - lowerRgb.g))
          const b = Math.round(lowerRgb.b + fraction * (upperRgb.b - lowerRgb.b))

          finalColor = rgbToHex(r, g, b)
        }
      }
    }

    // Create a custom solution object for the mixed solution
    setMixedSolution({
      name: `Mixed Solution`,
      ph: Number.parseFloat(mixedPh.toFixed(2)),
      color: finalColor,
    })
  }, [waterVolume, soluteVolume, waterSolution, soluteSolution])

  // Helper functions for color interpolation
  const hexToRgb = (hex) => {
    const r = Number.parseInt(hex.slice(1, 3), 16)
    const g = Number.parseInt(hex.slice(3, 5), 16)
    const b = Number.parseInt(hex.slice(5, 7), 16)
    return { r, g, b }
  }

  const rgbToHex = (r, g, b) => {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }

  // Handle water dropper animation
  useEffect(() => {
    if (!isWaterPouring) {
      return
    }

    const createDrop = () => {
      if (!isWaterPouring || !waterDropperRef.current || !beakerRef.current || !containerRef.current) return

      const dropperRect = waterDropperRef.current.getBoundingClientRect()
      const beakerRect = beakerRef.current.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()

      // Calculate drop position relative to the container
      const dropX =  dropperRect.width *3  + containerRect.left
      const dropY =  containerRect.top + dropperRect.bottom * 0.4

      // Calculate the target position (top of beaker)
      const targetY = beakerRect.top - containerRect.top
      const distance = targetY - dropY

      const newDrop = {
        id: Date.now(),
        x: dropX,
        y: dropY,
        targetY: targetY,
        distance: distance,
        opacity: 1,
        color: waterSolution.color,
      }

      setWaterDrops((prev) => [...prev, newDrop])

      // Remove old drops and increase volumes
      setTimeout(() => {
        setWaterDrops((prev) => prev.filter((drop) => drop.id !== newDrop.id))
        setWaterVolume((prev) => prev + 5) // Add 5mL of water
      }, 500)
    }

    const interval = setInterval(createDrop, 300)
    return () => clearInterval(interval)
  }, [isWaterPouring, waterSolution.color])

  // Handle solute dropper animation
  useEffect(() => {
    if (!isSolutePouring) {
      return
    }

    const createDrop = () => {
      if (!isSolutePouring || !soluteDropperRef.current || !beakerRef.current || !containerRef.current) return

      const dropperRect = soluteDropperRef.current.getBoundingClientRect()
      const beakerRect = beakerRef.current.getBoundingClientRect()
      const containerRect = containerRef.current.getBoundingClientRect()

      // Calculate drop position relative to the container
      const dropX =  dropperRect.width *3  + containerRect.left
      const dropY =  containerRect.top + dropperRect.bottom * 0.4

      // Calculate the target position (top of beaker)
      const targetY = beakerRect.top - containerRect.top
      const distance = targetY - dropY

      const newDrop = {
        id: Date.now(),
        x: dropX,
        y: dropY,
        targetY: targetY,
        distance: distance,
        opacity: 1,
        color: soluteSolution.color,
      }

      setSoluteDrops((prev) => [...prev, newDrop])

      // Remove old drops and increase volumes
      setTimeout(() => {
        setSoluteDrops((prev) => prev.filter((drop) => drop.id !== newDrop.id))
        setSoluteVolume((prev) => prev + 1) // Add 1mL of solute
      }, 500)
    }

    const interval = setInterval(createDrop, 500)
    return () => clearInterval(interval)
  }, [isSolutePouring, soluteSolution.color])

  // Handle dropper clicks
  const handleWaterDropperClick = () => {
    setIsWaterPouring(!isWaterPouring)
    if (isSolutePouring) setIsSolutePouring(false)
  }

  const handleSoluteDropperClick = () => {
    setIsSolutePouring(!isSolutePouring)
    if (isWaterPouring) setIsWaterPouring(false)
  }

  // Function to drain the container
  const drainContainer = () => {
    setWaterVolume(0)
    setSoluteVolume(0)
    setLiquidLevel(0)
  }

  // Function to handle solute solution change
  const handleSoluteSolutionChange = (solution) => {
    setSoluteSolution(solution)
  }

  // Update liquid level based on total volume
  useEffect(() => {
    const totalVolume = waterVolume + soluteVolume
    const maxVolume = 500 // Maximum beaker capacity in mL
    const newLiquidLevel = Math.min((totalVolume / maxVolume) * 100, 90)
    setLiquidLevel(newLiquidLevel)
  }, [waterVolume, soluteVolume])

  return (
    <>
      <Navigation />
      <div className="min-h-screen bg-[#f0f2f5] pt-16" ref={containerRef}>
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Left Panel - Solution Selection */}
            <div className="w-full md:w-1/4 bg-white rounded-lg shadow-sm p-5">
              <h2 className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white font-bold">
                  1
                </div>
                <span className="text-xl font-semibold text-slate-800">Select Solute</span>
              </h2>

              <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2">
                {SOLUTIONS.map((solution) => (
                  <div
                    key={`solute-${solution.ph}`}
                    className={`flex items-center p-2 rounded-md cursor-pointer ${
                      soluteSolution.ph === solution.ph ? "bg-slate-100" : ""
                    } hover:bg-slate-100`}
                    onClick={() => handleSoluteSolutionChange(solution)}
                  >
                    <div className="flex items-center justify-center w-6 h-6 rounded-full border border-slate-300 mr-2">
                      {soluteSolution.ph === solution.ph && (
                        <div className="w-4 h-4 rounded-full" style={{ backgroundColor: solution.color }}></div>
                      )}
                    </div>
                    <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: solution.color }}></div>
                    <span className="text-slate-800">
                      {solution.name} <span className="text-slate-500">(pH {solution.ph})</span>
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-slate-100 p-4 rounded-md">
                <h3 className="font-medium mb-2 text-slate-800">Water Source</h3>
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full mr-2" style={{ backgroundColor: waterSolution.color }}></div>
                  <span className="text-slate-800">(pH 7)</span>
                </div>
                <p className="mt-2 text-sm text-slate-600">
                  The water dropper always uses pure water with a neutral pH of 7.
                </p>
              </div>

              <div className="mt-4">
                <label className="flex items-center text-slate-800">
                  <input
                    type="checkbox"
                    checked={showMolecules}
                    onChange={() => setShowMolecules(!showMolecules)}
                    className="mr-2"
                  />
                  Show Molecules
                </label>
              </div>
            </div>

            {/* Middle Panel - Visualization */}
            <div className="w-full md:w-2/4 bg-white rounded-lg shadow-sm p-5 relative">
              <h2 className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white font-bold">
                  2
                </div>
                <span className="text-xl font-semibold text-slate-800">Mix Solutions</span>
              </h2>

              <div className="flex justify-center mb-4 relative">
                {/* Water Dropper */}
                <div className="flex flex-col items-center mx-8 relative">
                  <div
                    ref={waterDropperRef}
                    className={`w-16 h-16 rounded-full mb-2 flex items-center justify-center cursor-pointer border-4 border-white shadow-md transition-transform ${isWaterPouring ? "scale-110" : ""}`}
                    style={{ backgroundColor: waterSolution.color }}
                    onClick={handleWaterDropperClick}
                  >
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-600 rounded-full"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-800">Water</div>
                    <div className="text-xs text-slate-500">(Click to {isWaterPouring ? "stop" : "start"})</div>
                  </div>
                </div>

                {/* Solute Dropper */}
                <div className="flex flex-col items-center mx-8 relative">
                  <div
                    ref={soluteDropperRef}
                    className={`w-16 h-16 rounded-full mb-2 flex items-center justify-center cursor-pointer border-4 border-white shadow-md transition-transform ${isSolutePouring ? "scale-110" : ""}`}
                    style={{ backgroundColor: soluteSolution.color }}
                    onClick={handleSoluteDropperClick}
                  >
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 w-2 h-2 bg-slate-600 rounded-full"></div>
                  </div>
                  <div className="text-center">
                    <div className="text-slate-800">Solute</div>
                    <div className="text-xs text-slate-500">(Click to {isSolutePouring ? "stop" : "start"})</div>
                  </div>
                </div>
              </div>

              {/* Water Drops */}
              {waterDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="absolute w-4 h-8 rounded-b-full"
                  style={{
                    left: `${drop.x}px`,
                    top: `${drop.y}px`,
                    backgroundColor: drop.color,
                    opacity: 0.8,
                    transform: "translateX(-50%)", // Center the drop
                    animation: `customDropFall${drop.id} 500ms linear forwards`,
                  }}
                />
              ))}

              {/* Solute Drops */}
              {soluteDrops.map((drop) => (
                <div
                  key={drop.id}
                  className="absolute w-4 h-8 rounded-b-full"
                  style={{
                    left: `${drop.x}px`,
                    top: `${drop.y}px`,
                    backgroundColor: drop.color,
                    opacity: 0.8,
                    transform: "translateX(-50%)", // Center the drop
                    animation: `customDropFall${drop.id} 500ms linear forwards`,
                  }}
                />
              ))}

              {/* Beaker */}
              <div
                className="relative w-64 h-80 mx-auto border-8 border-slate-200 rounded-lg overflow-hidden bg-white"
                ref={beakerRef}
              >
                {/* Measurement lines */}
                <div className="absolute left-0 w-8 h-0.5 bg-slate-300" style={{ bottom: "20%" }}>
                  <span className="absolute -left-6 text-xs text-slate-500" style={{ bottom: "0" }}>
                    100
                  </span>
                </div>
                <div className="absolute left-0 w-8 h-0.5 bg-slate-300" style={{ bottom: "40%" }}>
                  <span className="absolute -left-6 text-xs text-slate-500" style={{ bottom: "0" }}>
                    200
                  </span>
                </div>
                <div className="absolute left-0 w-8 h-0.5 bg-slate-300" style={{ bottom: "60%" }}>
                  <span className="absolute -left-6 text-xs text-slate-500" style={{ bottom: "0" }}>
                    300
                  </span>
                </div>
                <div className="absolute left-0 w-8 h-0.5 bg-slate-300" style={{ bottom: "80%" }}>
                  <span className="absolute -left-6 text-xs text-slate-500" style={{ bottom: "0" }}>
                    400
                  </span>
                </div>

                {/* Liquid */}
                <div
                  className="absolute bottom-0 w-full transition-all duration-300 ease-in-out"
                  style={{
                    height: `${liquidLevel}%`,
                    backgroundColor: mixedSolution.color,
                  }}
                >
                  {/* pH Value Label */}
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 font-bold text-4xl"
                    style={{
                      color: "#000000",
                    }}
                  >
                    <div>pH</div>
                    <div>{mixedSolution.ph}</div>
                  </div>

                  {/* Molecules visualization */}
                  {showMolecules && liquidLevel > 0 && (
                    <div className="absolute inset-0 overflow-hidden">
                      {Array.from({ length: 20 }).map((_, i) => {
                        const isHydrogen = mixedSolution.ph < 7 || (mixedSolution.ph === 7 && i < 10)
                        return (
                          <div
                            key={i}
                            className={`absolute w-5 h-5 rounded-full flex items-center justify-center text-white text-xs font-bold`}
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              backgroundColor: isHydrogen ? "#ff5555" : "#5555ff",
                              animation: `float ${3 + Math.random()}s infinite ease-in-out ${Math.random() * 2}s`,
                            }}
                          >
                            {isHydrogen ? "H+" : "OH-"}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Drain Button */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={drainContainer}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Drain Beaker
                </button>
              </div>

              {/* pH Scale */}
              <div className="mt-8">
                <h3 className="text-center font-medium mb-2 text-slate-800">pH Scale</h3>
                <div className="relative">
                  <div
                    className="h-6 rounded-md overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(to right, #FF0000, #FF8C00, #FFFF00, #90EE90, #00BFFF, #4169E1, #800080)",
                    }}
                  ></div>
                  {liquidLevel > 0 && (
                    <div
                      className="absolute bottom-0 w-1 h-8 bg-black"
                      style={{
                        left: `${((mixedSolution.ph - 1) / 13) * 100}%`,
                        transform: "translateX(-50%)",
                      }}
                    >
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full border-2 border-black"></div>
                    </div>
                  )}
                </div>
                <div className="flex justify-between mt-1 text-xs text-slate-600">
                  <span>Acidic</span>
                  <span>Neutral</span>
                  <span>Basic</span>
                </div>
              </div>
            </div>

            {/* Right Panel - Data & Information */}
            <div className="w-full md:w-1/4 bg-white rounded-lg shadow-sm p-5">
              <h2 className="flex items-center gap-2 mb-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-teal-500 text-white font-bold">
                  3
                </div>
                <span className="text-xl font-semibold text-slate-800">Solution Data</span>
              </h2>

              <div className="space-y-4">
                {/* Water Data */}
                <div className="bg-slate-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2 text-slate-800 flex items-center">
                    <span className="inline-block w-4 h-4 mr-2">💧</span> Water
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">pH:</span>
                    <span className="font-medium text-slate-800">{waterSolution.ph}</span>
                    <span className="text-slate-600">Volume:</span>
                    <span className="font-medium text-slate-800">{waterVolume.toFixed(0)} mL</span>
                    <span className="text-slate-600">Color:</span>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: waterSolution.color }}></div>
                  </div>
                </div>

                {/* Solute Data */}
                <div className="bg-slate-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2 text-slate-800 flex items-center">
                    <span className="inline-block w-4 h-4 mr-2">🧪</span> Solute
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">pH:</span>
                    <span className="font-medium text-slate-800">{soluteSolution.ph}</span>
                    <span className="text-slate-600">Volume:</span>
                    <span className="font-medium text-slate-800">{soluteVolume.toFixed(0)} mL</span>
                    <span className="text-slate-600">Color:</span>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: soluteSolution.color }}></div>
                  </div>
                </div>

                {/* Mixed Solution Data */}
                <div className="bg-slate-50 p-4 rounded-md">
                  <h3 className="font-medium mb-2 text-slate-800 flex items-center">
                    <span className="inline-block w-4 h-4 mr-2">🔬</span> Mixed Solution
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <span className="text-slate-600">pH:</span>
                    <span className="font-medium text-slate-800">{mixedSolution.ph}</span>
                    <span className="text-slate-600">Total Volume:</span>
                    <span className="font-medium text-slate-800">{(waterVolume + soluteVolume).toFixed(0)} mL</span>
                    <span className="text-slate-600">Color:</span>
                    <div className="w-6 h-6 rounded-full" style={{ backgroundColor: mixedSolution.color }}></div>
                  </div>
                </div>

                {/* About pH */}
                <div className="bg-slate-50 p-4 rounded-md">
                  <button
                    onClick={() => setShowAboutPh(!showAboutPh)}
                    className="flex items-center justify-between w-full text-left font-medium text-slate-800"
                  >
                    <div className="flex items-center">
                      <span className="inline-block w-4 h-4 mr-2">ℹ️</span>
                      About pH
                    </div>
                    <ChevronDown size={16} className={`transition-transform ${showAboutPh ? "rotate-180" : ""}`} />
                  </button>
                  {showAboutPh && (
                    <div className="mt-2 text-sm text-slate-600">
                      <p className="mb-2">
                        The pH scale measures how acidic or basic a substance is. It ranges from 0 to 14:
                      </p>
                      <ul className="list-disc pl-5 space-y-1">
                        <li>Acidic solutions have pH values less than 7</li>
                        <li>Neutral solutions have a pH of 7</li>
                        <li>Basic solutions have pH values greater than 7</li>
                      </ul>
                      <p className="mt-2">
                        Each unit of pH represents a 10-fold change in acidity. When solutions mix, the resulting pH
                        depends on their relative volumes and original pH values.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes dropFall {
          0% {
            transform: translateY(0);
          }
          100% {
            transform: translateY(100px);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translate(0, 0);
          }
          50% {
            transform: translate(0, -5px);
          }
        }
      `}</style>

      {/* Dynamic drop animations */}
      <style jsx>{`
        ${[...waterDrops, ...soluteDrops]
          .map(
            (drop) => `
          @keyframes customDropFall${drop.id} {
            0% {
              transform: translateX(-50%) translateY(0);
              opacity: 0.9;
            }
            100% {
              transform: translateX(-50%) translateY(${drop.distance}px);
              opacity: 0;
            }
          }
        `,
          )
          .join("\n")}
      `}</style>
    </>
  )
}
