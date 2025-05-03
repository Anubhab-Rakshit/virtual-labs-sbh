"use client"

import { useState, useEffect, useRef } from "react"
import { ArrowDown, Compass, Play, Pause, Info } from "lucide-react"
import Navigation from "@/components/ui/Navigation"

// Hydroelectric Generator Simulation Component
export default function HydroelectricGenerator() {
  // State variables
  const [waterFlow, setWaterFlow] = useState(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [magnetStrength, setMagnetStrength] = useState(75)
  const [loopArea, setLoopArea] = useState(50)
  const [loops, setLoops] = useState(2)
  const [turbineRotation, setTurbineRotation] = useState(0)
  const [rpm, setRpm] = useState(0)
  const [showMagneticField, setShowMagneticField] = useState(true)
  const [showElectrons, setShowElectrons] = useState(true)
  const [showCompass, setShowCompass] = useState(true)
  const [showFieldMeter, setShowFieldMeter] = useState(false)
  const [showVoltmeter, setShowVoltmeter] = useState(true)
  const [indicatorType, setIndicatorType] = useState("light") // 'light' or 'voltage'
  const [activeTab, setActiveTab] = useState("simulation")

  // Animation frame reference
  const frameId = useRef(null)
  const waterFlowRef = useRef(null)

  // Start/stop the simulation
  const togglePlay = () => {
    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      setWaterFlow(50) // Start with medium flow when play is pressed
    } else {
      setWaterFlow(0) // Stop the flow when paused
    }
  }

  // Change number of loops
  const changeLoops = (increment) => {
    setLoops((prev) => {
      const newValue = prev + increment
      return Math.max(1, Math.min(5, newValue)) // Limit between 1 and 5
    })
  }

  // Update water flow value
  const updateWaterFlow = (e) => {
    if (isPlaying) {
      setWaterFlow(Number.parseInt(e.target.value))
    }
  }

  // Animation logic for water flow and turbine rotation
  useEffect(() => {
    if (!isPlaying) {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }
      return
    }

    const animate = () => {
      // Update turbine rotation based on water flow
      setTurbineRotation((prev) => (prev + waterFlow / 100) % 360)

      // Calculate RPM based on water flow
      setRpm(Math.round(waterFlow * 1.2))

      frameId.current = requestAnimationFrame(animate)
    }

    frameId.current = requestAnimationFrame(animate)

    return () => {
      if (frameId.current) {
        cancelAnimationFrame(frameId.current)
      }
    }
  }, [isPlaying, waterFlow])

  // Calculate voltage and light intensity based on parameters
  const voltage = (rpm / 100) * (magnetStrength / 100) * (loopArea / 100) * loops
  const lightIntensity = Math.min(1, voltage)

  // Adjust magnet strength
  const handleMagnetStrengthChange = (e) => {
    setMagnetStrength(Number.parseInt(e.target.value))
  }

  // Adjust loop area
  const handleLoopAreaChange = (e) => {
    setLoopArea(Number.parseInt(e.target.value))
  }

  // Toggle indicator type (light bulb or voltmeter)
  const toggleIndicator = () => {
    setIndicatorType((prev) => (prev === "light" ? "voltage" : "light"))
  }

  // Create water drop elements
  const createWaterDrops = () => {
    if (waterFlow === 0) return null

    const drops = []
    const dropCount = Math.floor(waterFlow / 10) + 1

    for (let i = 0; i < dropCount; i++) {
      const delay = i * (400 / dropCount)
      drops.push(
        <div
          key={i}
          className="absolute w-3 h-6 bg-blue-300 rounded-full opacity-80"
          style={{
            top: `${(i * 30) % 100}%`,
            left: "50%",
            transform: "translateX(-50%)",
            animation: `waterDrop ${1500 - waterFlow * 10}ms infinite linear ${delay}ms`,
          }}
        />,
      )
    }

    return drops
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-secondary-50 to-secondary-100 dark:from-secondary-950 dark:to-secondary-900 pb-16">
      <Navigation />

      <div className="pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Hydroelectric Generator Simulation</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Explore how flowing water can be converted into electricity through electromagnetic induction.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="glass-effect rounded-full p-1 inline-flex">
            <button
              onClick={() => setActiveTab("simulation")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "simulation" ? "bg-secondary-500 text-white" : "hover:bg-secondary-500/10"}`}
            >
              Simulation
            </button>
            <button
              onClick={() => setActiveTab("theory")}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "theory" ? "bg-secondary-500 text-white" : "hover:bg-secondary-500/10"}`}
            >
              Theory
            </button>
          </div>
        </div>

        {activeTab === "simulation" ? (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Main simulation area */}
            <div className="flex-1 relative glass-effect rounded-2xl p-6 min-h-[600px]">
              {/* Magnetic field arrows */}
              {showMagneticField && (
                <div className="absolute inset-0 overflow-hidden rounded-2xl">
                  {[...Array(15)].map((_, x) =>
                    [...Array(15)].map((_, y) => (
                      <div
                        key={`${x}-${y}`}
                        className="absolute w-1 h-1"
                        style={{
                          left: `${(x / 14) * 100}%`,
                          top: `${(y / 14) * 100}%`,
                          transform: "translate(-50%, -50%)",
                        }}
                      >
                        <div
                          className="absolute w-3 h-0.5 bg-yellow-300 dark:bg-yellow-500 opacity-20"
                          style={{
                            transform: `rotate(${45}deg)`,
                          }}
                        >
                          <div className="absolute right-0 top-1/2 w-1 h-1 bg-yellow-300 dark:bg-yellow-500 transform rotate-45 -translate-y-1/2"></div>
                        </div>
                      </div>
                    )),
                  )}
                </div>
              )}

              {/* Water pipe */}
              <div className="absolute top-4 left-4 w-32 h-64">
                <div className="absolute left-4 top-0 w-12 h-32 bg-gray-400 dark:bg-gray-600 rounded-t-lg"></div>
                <div className="absolute left-4 top-32 w-24 h-12 bg-gray-400 dark:bg-gray-600"></div>
                <div className="absolute left-16 top-44 w-12 h-20 bg-gray-400 dark:bg-gray-600 rounded-b-lg"></div>

                {/* Water flow container */}
                <div ref={waterFlowRef} className="absolute left-8 top-0 w-4 h-32 overflow-hidden">
                  <div className="relative w-full h-full bg-blue-200 dark:bg-blue-300 opacity-60">
                    {createWaterDrops()}
                  </div>
                </div>

                {/* Valve/faucet */}
                <div className="absolute left-4 top-28 w-12 h-8">
                  <div className="absolute left-0 top-2 w-2 h-4 bg-gray-600 dark:bg-gray-800"></div>
                  <div className="absolute right-0 top-2 w-2 h-4 bg-gray-600 dark:bg-gray-800"></div>
                  <div className="absolute left-4 top-0 w-4 h-8 bg-gray-700 dark:bg-gray-900 rounded-full"></div>
                </div>
              </div>

              {/* Turbine wheel */}
              <div className="absolute top-48 left-28 w-28 h-28">
                <div
                  className="absolute inset-0 rounded-full border-4 border-amber-700 dark:border-amber-600 flex items-center justify-center"
                  style={{ transform: `rotate(${turbineRotation}deg)` }}
                >
                  <div className="absolute w-full h-2 bg-amber-900 dark:bg-amber-800"></div>
                  <div className="absolute w-2 h-full bg-amber-900 dark:bg-amber-800"></div>
                  <div className="absolute w-full h-2 bg-amber-900 dark:bg-amber-800 transform rotate-45"></div>
                  <div className="absolute w-full h-2 bg-amber-900 dark:bg-amber-800 transform -rotate-45"></div>
                </div>

                {/* RPM indicator */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full bg-gray-800 dark:bg-gray-900 flex items-center justify-center border border-gray-600 dark:border-gray-700">
                  <div className="text-center">
                    <div className="text-white font-bold">{rpm}</div>
                    <div className="text-xs text-gray-400">RPM</div>
                  </div>
                </div>

                {/* Magnet */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-8 w-16 h-8 flex">
                  <div className="w-1/2 h-full bg-red-600 flex items-center justify-center">
                    <span className="text-white font-bold">N</span>
                  </div>
                  <div className="w-1/2 h-full bg-blue-600 flex items-center justify-center">
                    <span className="text-white font-bold">S</span>
                  </div>
                </div>
              </div>

              {/* Pickup coil */}
              <div className="absolute top-40 right-28 w-20 h-32">
                <div className="relative w-full h-full">
                  {[...Array(loops)].map((_, i) => (
                    <div
                      key={i}
                      className="absolute w-full rounded-full border-4 border-amber-600 dark:border-amber-500"
                      style={{
                        height: `${70 + i * 10}%`,
                        top: `${15 - i * 5}%`,
                        left: "0",
                      }}
                    >
                      {/* Electron animations */}
                      {showElectrons &&
                        voltage > 0.2 &&
                        [...Array(4)].map((_, j) => (
                          <div
                            key={j}
                            className="absolute w-2 h-2 rounded-full bg-blue-500"
                            style={{
                              top: "50%",
                              left: `${(j * 25) % 100}%`,
                              animation: `electronFlow ${2000 - rpm * 10}ms infinite linear ${j * 200}ms`,
                            }}
                          >
                            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-xs">
                              -
                            </span>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </div>

              {/* Light bulb */}
              <div className="absolute top-8 right-28 w-20 h-20">
                {indicatorType === "light" ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-12 h-16 relative">
                      <div className="absolute bottom-0 w-full h-4 bg-gray-600 dark:bg-gray-700 rounded-b-lg"></div>
                      <div
                        className="absolute bottom-4 w-full h-12 rounded-t-full"
                        style={{
                          backgroundColor: `rgba(255, 255, 100, ${lightIntensity})`,
                          boxShadow: `0 0 ${lightIntensity * 20}px ${lightIntensity * 10}px rgba(255, 255, 100, ${lightIntensity})`,
                        }}
                      ></div>
                      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-1 h-8 bg-gray-400 dark:bg-gray-500"></div>
                    </div>

                    {/* Light rays */}
                    {lightIntensity > 0.1 && (
                      <div className="absolute inset-0">
                        {[...Array(12)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute top-1/2 left-1/2 w-20 h-0.5 bg-yellow-300 dark:bg-yellow-400"
                            style={{
                              opacity: lightIntensity * 0.7,
                              transform: `rotate(${i * 30}deg)`,
                              transformOrigin: "center",
                            }}
                          ></div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-gray-800 dark:bg-gray-900 border-2 border-gray-600 dark:border-gray-700 flex items-center justify-center overflow-hidden">
                      <div className="relative w-full h-2 bg-gray-600 dark:bg-gray-700">
                        <div
                          className="absolute top-0 left-1/2 h-full bg-blue-500"
                          style={{
                            width: `${voltage * 50}%`,
                            transform: "translateX(-50%)",
                          }}
                        ></div>
                      </div>
                      <div className="absolute text-xs text-center">
                        <div className="text-white font-bold">{voltage.toFixed(2)}V</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Compass */}
              {showCompass && (
                <div className="absolute bottom-8 right-16 w-16 h-16">
                  <div className="w-full h-full rounded-full bg-gray-800 dark:bg-gray-900 border-2 border-gray-600 dark:border-gray-700 flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-xs text-gray-400">N</div>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center rotate-180">
                      <div className="text-xs text-gray-400">S</div>
                    </div>
                    <div
                      className="w-1 h-12 absolute top-1/2 left-1/2 transform -translate-y-1/2 -translate-x-1/2"
                      style={{
                        transform: `translate(-50%, -50%) rotate(${turbineRotation}deg)`,
                      }}
                    >
                      <div className="w-full h-1/2 bg-red-500">
                        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-red-600 rounded-full"></div>
                      </div>
                      <div className="w-full h-1/2 bg-gray-400 dark:bg-gray-500"></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Field meter */}
              {showFieldMeter && (
                <div className="absolute bottom-8 right-40 w-10 h-10">
                  <div className="w-full h-full rounded-full bg-gray-800 dark:bg-gray-900 border-2 border-blue-500 flex items-center justify-center">
                    <ArrowDown className="text-blue-500" size={20} />
                  </div>
                </div>
              )}

              {/* Play/pause buttons */}
              <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
                <button
                  className="bg-secondary-500 hover:bg-secondary-600 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-lg"
                  onClick={togglePlay}
                >
                  {isPlaying ? <Pause size={20} /> : <Play size={20} />}
                </button>
              </div>
            </div>

            {/* Controls panel */}
            <div className="w-full lg:w-80 glass-effect rounded-2xl p-6">
              {/* Bar Magnet Control */}
              <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4 mb-4">
                <h3 className="font-bold mb-2 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-secondary-500 flex items-center justify-center text-white text-xs mr-2">
                    1
                  </span>
                  Bar Magnet
                </h3>
                <div className="mb-1 flex justify-between">
                  <span>Strength:</span>
                  <span>{magnetStrength}%</span>
                </div>
                <div className="mb-2 flex items-center">
                  <button
                    className="w-6 h-6 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded"
                    onClick={() => setMagnetStrength(Math.max(0, magnetStrength - 10))}
                  >
                    &lt;
                  </button>
                  <div className="flex-1 mx-1 h-6 bg-gray-200 dark:bg-gray-800 relative rounded">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={magnetStrength}
                      onChange={handleMagnetStrengthChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute top-0 left-0 bottom-0 w-full flex items-center">
                      <div className="absolute left-0 w-full h-1 bg-gray-400 dark:bg-gray-600"></div>
                      <div
                        className="absolute h-full w-4 bg-secondary-400"
                        style={{ left: `${magnetStrength}%`, transform: "translateX(-50%)" }}
                      ></div>
                    </div>
                  </div>
                  <button
                    className="w-6 h-6 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded"
                    onClick={() => setMagnetStrength(Math.min(100, magnetStrength + 10))}
                  >
                    &gt;
                  </button>
                </div>
                <div className="flex justify-between text-xs">
                  <span>0%</span>
                  <span>50%</span>
                  <span>100%</span>
                </div>

                <div className="mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showMagneticField}
                      onChange={() => setShowMagneticField(!showMagneticField)}
                      className="mr-2 accent-secondary-500"
                    />
                    <span>Magnetic Field (B)</span>
                  </label>
                </div>
              </div>

              {/* Pickup Coil Control */}
              <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4 mb-4">
                <h3 className="font-bold mb-2 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-secondary-500 flex items-center justify-center text-white text-xs mr-2">
                    2
                  </span>
                  Pickup Coil
                </h3>

                <div className="mb-2 flex items-center">
                  <span className="mr-2">Indicator:</span>
                  <div className="flex gap-1">
                    <button
                      className={`w-10 h-10 border ${indicatorType === "light" ? "border-secondary-500 bg-gray-200 dark:bg-gray-700" : "border-gray-300 dark:border-gray-600"} flex items-center justify-center rounded`}
                      onClick={() => setIndicatorType("light")}
                    >
                      <div className="w-6 h-6 rounded-full bg-yellow-200 dark:bg-yellow-300"></div>
                    </button>
                    <button
                      className={`w-10 h-10 border ${indicatorType === "voltage" ? "border-secondary-500 bg-gray-200 dark:bg-gray-700" : "border-gray-300 dark:border-gray-600"} flex items-center justify-center rounded`}
                      onClick={() => setIndicatorType("voltage")}
                    >
                      <div className="w-6 h-4 bg-blue-500 flex items-center justify-center">
                        <span className="text-white text-xs">V</span>
                      </div>
                    </button>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="flex items-center">
                    <span className="mr-2">Loops:</span>
                    <div className="flex items-center">
                      <button
                        className="w-6 h-6 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded"
                        onClick={() => changeLoops(-1)}
                      >
                        &lt;
                      </button>
                      <div className="w-6 h-6 bg-white dark:bg-gray-800 flex items-center justify-center mx-1 rounded">
                        {loops}
                      </div>
                      <button
                        className="w-6 h-6 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded"
                        onClick={() => changeLoops(1)}
                      >
                        &gt;
                      </button>
                    </div>
                  </div>
                </div>

                <div className="mb-1 flex justify-between">
                  <span>Loop Area:</span>
                  <span>{loopArea}%</span>
                </div>
                <div className="mb-2 flex items-center">
                  <button
                    className="w-6 h-6 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded"
                    onClick={() => setLoopArea(Math.max(20, loopArea - 10))}
                  >
                    &lt;
                  </button>
                  <div className="flex-1 mx-1 h-6 bg-gray-200 dark:bg-gray-800 relative rounded">
                    <input
                      type="range"
                      min="20"
                      max="100"
                      value={loopArea}
                      onChange={handleLoopAreaChange}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute top-0 left-0 bottom-0 w-full flex items-center">
                      <div className="absolute left-0 w-full h-1 bg-gray-400 dark:bg-gray-600"></div>
                      <div
                        className="absolute h-full w-4 bg-secondary-400"
                        style={{ left: `${((loopArea - 20) * 100) / 80}%`, transform: "translateX(-50%)" }}
                      ></div>
                    </div>
                  </div>
                  <button
                    className="w-6 h-6 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded"
                    onClick={() => setLoopArea(Math.min(100, loopArea + 10))}
                  >
                    &gt;
                  </button>
                </div>
                <div className="flex justify-between text-xs">
                  <span>20%</span>
                  <span>60%</span>
                  <span>100%</span>
                </div>

                <div className="mt-2">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={showElectrons}
                      onChange={() => setShowElectrons(!showElectrons)}
                      className="mr-2 accent-secondary-500"
                    />
                    <span>Electrons</span>
                    <span className="ml-1 text-blue-600 text-xs">-</span>
                  </label>
                </div>
              </div>

              {/* Water Flow Control */}
              <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4 mb-4">
                <h3 className="font-bold mb-2 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-secondary-500 flex items-center justify-center text-white text-xs mr-2">
                    3
                  </span>
                  Water Flow
                </h3>
                <div className="mb-1 flex justify-between">
                  <span>Flow Rate:</span>
                  <span>{waterFlow}%</span>
                </div>
                <div className="mb-2 flex items-center">
                  <button
                    className="w-6 h-6 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded"
                    onClick={() => isPlaying && setWaterFlow(Math.max(0, waterFlow - 10))}
                    disabled={!isPlaying}
                  >
                    &lt;
                  </button>
                  <div className="flex-1 mx-1 h-6 bg-gray-200 dark:bg-gray-800 relative rounded">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={waterFlow}
                      onChange={updateWaterFlow}
                      disabled={!isPlaying}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <div className="absolute top-0 left-0 bottom-0 w-full flex items-center">
                      <div className="absolute left-0 w-full h-1 bg-gray-400 dark:bg-gray-600"></div>
                      <div
                        className="absolute h-full w-4 bg-secondary-400"
                        style={{ left: `${waterFlow}%`, transform: "translateX(-50%)" }}
                      ></div>
                    </div>
                  </div>
                  <button
                    className="w-6 h-6 bg-gray-300 dark:bg-gray-700 flex items-center justify-center rounded"
                    onClick={() => isPlaying && setWaterFlow(Math.min(100, waterFlow + 10))}
                    disabled={!isPlaying}
                  >
                    &gt;
                  </button>
                </div>
              </div>

              {/* Tools */}
              <div className="bg-secondary-50 dark:bg-secondary-900/50 rounded-lg p-4">
                <h3 className="font-bold mb-2 flex items-center">
                  <span className="w-6 h-6 rounded-full bg-secondary-500 flex items-center justify-center text-white text-xs mr-2">
                    4
                  </span>
                  Tools
                </h3>

                <label className="flex items-center mb-2">
                  <input
                    type="checkbox"
                    checked={showCompass}
                    onChange={() => setShowCompass(!showCompass)}
                    className="mr-2 accent-secondary-500"
                  />
                  <span>Compass</span>
                  <span className="ml-2 text-xs">S — N</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showFieldMeter}
                    onChange={() => setShowFieldMeter(!showFieldMeter)}
                    className="mr-2 accent-secondary-500"
                  />
                  <span>Field Meter</span>
                  <Compass className="ml-2 text-blue-600" size={16} />
                </label>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-effect rounded-2xl p-8 max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white">
              Understanding Hydroelectric Generation
            </h2>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">How It Works</h3>
                <p className="text-gray-700 dark:text-gray-300">
                  Hydroelectric generators convert the kinetic energy of flowing water into electrical energy. This
                  process is based on the principle of electromagnetic induction discovered by Michael Faraday.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-bold text-blue-700 dark:text-blue-400 mb-1">1. Water Flow</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    Flowing water turns a turbine, converting hydraulic energy into mechanical energy. The faster the
                    water flows, the faster the turbine spins.
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-bold text-purple-700 dark:text-purple-400 mb-1">2. Magnetic Field</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    The turbine is connected to a magnet that rotates within a coil of wire. The magnetic field strength
                    affects the voltage output.
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-bold text-green-700 dark:text-green-400 mb-1">3. Electromagnetic Induction</h4>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    As the magnet rotates, it creates a changing magnetic field, which induces an electric current in
                    the coil according to Faraday's Law.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Faraday's Law of Induction</h3>
                <p className="text-gray-700 dark:text-gray-300 mb-4">
                  Faraday's Law states that the induced electromotive force (EMF) in a closed circuit is equal to the
                  negative of the rate of change of magnetic flux through the circuit.
                </p>
                <div className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg text-center">
                  <p className="font-mono">EMF = -N × (dΦ/dt)</p>
                  <p className="text-sm mt-2">
                    Where N is the number of turns in the coil, and dΦ/dt is the rate of change of magnetic flux.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">Factors Affecting Output</h3>
                <ul className="list-disc pl-5 space-y-2 text-gray-700 dark:text-gray-300">
                  <li>
                    <strong>Number of coil loops:</strong> More loops result in higher voltage output.
                  </li>
                  <li>
                    <strong>Magnetic field strength:</strong> Stronger magnets produce more voltage.
                  </li>
                  <li>
                    <strong>Coil area:</strong> Larger coil area captures more magnetic flux.
                  </li>
                  <li>
                    <strong>Rotation speed:</strong> Faster rotation creates more rapid flux changes.
                  </li>
                </ul>
              </div>

              <div className="p-4 bg-secondary-50 dark:bg-secondary-900/50 rounded-lg flex items-start">
                <Info className="text-secondary-600 dark:text-secondary-400 mr-3 mt-1 flex-shrink-0" size={20} />
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Real-world hydroelectric plants use the same principles but on a much larger scale. Water from dams or
                  rivers flows through large turbines connected to generators, producing electricity that powers homes
                  and businesses.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
