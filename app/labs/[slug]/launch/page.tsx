"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, notFound, useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { ArrowLeft, X, Maximize, Minimize, Settings, Info, Download, Share } from "lucide-react"
import { getLabBySlug } from "@/lib/labs"
import { NeuralNetworkVisualization } from "@/components/neural-network-visualization"
import { CellExplorer } from "@/components/cell-explorer"
import { MoleculeViewer } from "@/components/molecule-viewer"
import { WaveSimulation } from "@/components/wave-simulation"
import { InteractiveGraph } from "@/components/interactive-graph"
import type { Lab } from "@/types/lab"

export default function LabLaunchPage() {
  const params = useParams()
  const router = useRouter()
  const slug = params?.slug as string
  const [lab, setLab] = useState<Lab | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showInfo, setShowInfo] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const fetchLab = async () => {
      try {
        const labData = await getLabBySlug(slug)
        if (!labData) {
          notFound()
        }
        setLab(labData)
        setIsLoading(false)
      } catch (error) {
        console.error("Error fetching lab:", error)
        notFound()
      }
    }

    fetchLab()
  }, [slug])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen()
      setIsFullscreen(true)
    } else {
      document.exitFullscreen()
      setIsFullscreen(false)
    }
  }

  // Handle fullscreen change event
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener("fullscreenchange", handleFullscreenChange)
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange)
    }
  }, [])

  // Get the appropriate visualization component based on lab category
  const getVisualizationComponent = () => {
    if (!lab) return null

    switch (lab.category) {
      case "physics":
        return <WaveSimulation className="w-full h-full" />
      case "chemistry":
        return <MoleculeViewer className="w-full h-full" />
      case "mathematics":
        return (
          <InteractiveGraph
            data={[
              { x: 0, y: 0, label: "Origin" },
              { x: 1, y: 1 },
              { x: 2, y: 4 },
              { x: 3, y: 9 },
              { x: 4, y: 16 },
              { x: 5, y: 25 },
              { x: 6, y: 36 },
              { x: 7, y: 49 },
              { x: 8, y: 64 },
              { x: 9, y: 81 },
              { x: 10, y: 100, label: "y = x²" },
            ]}
            width={600}
            height={400}
            lineColor="#10b981"
            pointColor="#10b981"
            showGrid={true}
            showAxes={true}
            title="Quadratic Function"
            xLabel="x"
            yLabel="y = x²"
            className="w-full h-full"
          />
        )
      case "computer":
        return <NeuralNetworkVisualization className="w-full h-full" />
      case "biology":
        return <CellExplorer className="w-full h-full" />
      default:
        return null
    }
  }

  if (isLoading) {
    return (
      <div className="fixed inset-0 bg-black flex items-center justify-center">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white/70">Loading lab...</p>
        </div>
      </div>
    )
  }

  if (!lab) {
    return notFound()
  }

  return (
    <div ref={containerRef} className="fixed inset-0 bg-black flex flex-col">
      {/* Header */}
      <div className="bg-black/80 backdrop-blur-md border-b border-white/10 p-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push(`/labs/${slug}`)}
            className="text-white/70 hover:text-white flex items-center gap-2 group"
          >
            <ArrowLeft className="h-5 w-5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Lab</span>
          </button>
          <h1 className="text-xl font-light text-white hidden md:block">{lab.title}</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowSettings(!showSettings)}
            className={`p-2 rounded-md ${
              showSettings ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={() => setShowInfo(!showInfo)}
            className={`p-2 rounded-md ${
              showInfo ? "bg-white/20 text-white" : "text-white/70 hover:text-white hover:bg-white/10"
            }`}
          >
            <Info className="h-5 w-5" />
          </button>
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10"
          >
            {isFullscreen ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </button>
          <button
            onClick={() => router.push(`/labs/${slug}`)}
            className="p-2 rounded-md text-white/70 hover:text-white hover:bg-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 relative">
        {/* Lab visualization */}
        <div className="absolute inset-0">{getVisualizationComponent()}</div>

        {/* Info panel */}
        <AnimatePresence>
          {showInfo && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="absolute top-0 right-0 bottom-0 w-80 bg-black/80 backdrop-blur-md border-l border-white/10 p-6 overflow-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light text-white">Lab Information</h2>
                <button onClick={() => setShowInfo(false)} className="text-white/70 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-white/70 text-sm mb-1">Description</h3>
                  <p className="text-white">{lab.description}</p>
                </div>

                <div>
                  <h3 className="text-white/70 text-sm mb-1">Learning Objectives</h3>
                  <ul className="list-disc pl-5 text-white space-y-1">
                    {lab.learningObjectives.map((objective, index) => (
                      <li key={index}>{objective}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-white/70 text-sm mb-1">Instructions</h3>
                  <ol className="list-decimal pl-5 text-white space-y-2">
                    {lab.instructions.map((instruction, index) => (
                      <li key={index}>
                        <span className="font-medium">{instruction.title}:</span> {instruction.description}
                      </li>
                    ))}
                  </ol>
                </div>

                <div className="flex gap-2">
                  <button className="flex items-center gap-1 text-white/70 hover:text-white text-sm border border-white/20 rounded-md px-3 py-1">
                    <Download className="h-4 w-4" />
                    Save Results
                  </button>
                  <button className="flex items-center gap-1 text-white/70 hover:text-white text-sm border border-white/20 rounded-md px-3 py-1">
                    <Share className="h-4 w-4" />
                    Share
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Settings panel */}
        <AnimatePresence>
          {showSettings && (
            <motion.div
              initial={{ opacity: 0, x: -300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -300 }}
              className="absolute top-0 left-0 bottom-0 w-80 bg-black/80 backdrop-blur-md border-r border-white/10 p-6 overflow-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-light text-white">Lab Settings</h2>
                <button onClick={() => setShowSettings(false)} className="text-white/70 hover:text-white">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Settings will vary based on lab type */}
                {lab.category === "physics" && (
                  <>
                    <div>
                      <h3 className="text-white/70 text-sm mb-3">Wave Type</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="bg-blue-500 text-white py-1 px-3 rounded-md">Sine</button>
                        <button className="bg-white/10 text-white/70 hover:bg-white/20 hover:text-white py-1 px-3 rounded-md">
                          Square
                        </button>
                        <button className="bg-white/10 text-white/70 hover:bg-white/20 hover:text-white py-1 px-3 rounded-md">
                          Sawtooth
                        </button>
                        <button className="bg-white/10 text-white/70 hover:bg-white/20 hover:text-white py-1 px-3 rounded-md">
                          Interference
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white/70 text-sm mb-2">Amplitude</h3>
                      <input type="range" className="w-full" />
                    </div>

                    <div>
                      <h3 className="text-white/70 text-sm mb-2">Frequency</h3>
                      <input type="range" className="w-full" />
                    </div>

                    <div>
                      <h3 className="text-white/70 text-sm mb-2">Damping</h3>
                      <input type="range" className="w-full" />
                    </div>
                  </>
                )}

                {lab.category === "chemistry" && (
                  <>
                    <div>
                      <h3 className="text-white/70 text-sm mb-3">Molecule</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <button className="bg-blue-500 text-white py-1 px-3 rounded-md">H₂O</button>
                        <button className="bg-white/10 text-white/70 hover:bg-white/20 hover:text-white py-1 px-3 rounded-md">
                          CH₄
                        </button>
                        <button className="bg-white/10 text-white/70 hover:bg-white/20 hover:text-white py-1 px-3 rounded-md">
                          C₆H₆
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white/70 text-sm mb-2">Rotation Speed</h3>
                      <input type="range" className="w-full" />
                    </div>

                    <div>
                      <h3 className="text-white/70 text-sm mb-2">Display Mode</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="bg-blue-500 text-white py-1 px-3 rounded-md">Ball & Stick</button>
                        <button className="bg-white/10 text-white/70 hover:bg-white/20 hover:text-white py-1 px-3 rounded-md">
                          Space Filling
                        </button>
                      </div>
                    </div>
                  </>
                )}

                {lab.category === "computer" && (
                  <>
                    <div>
                      <h3 className="text-white/70 text-sm mb-3">Network Architecture</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white">Input Layer</span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value="4"
                            className="w-16 bg-white/10 text-white border border-white/20 rounded-md px-2 py-1"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white">Hidden Layer 1</span>
                          <input
                            type="number"
                            min="1"
                            max="20"
                            value="8"
                            className="w-16 bg-white/10 text-white border border-white/20 rounded-md px-2 py-1"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white">Hidden Layer 2</span>
                          <input
                            type="number"
                            min="0"
                            max="20"
                            value="6"
                            className="w-16 bg-white/10 text-white border border-white/20 rounded-md px-2 py-1"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white">Output Layer</span>
                          <input
                            type="number"
                            min="1"
                            max="10"
                            value="3"
                            className="w-16 bg-white/10 text-white border border-white/20 rounded-md px-2 py-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white/70 text-sm mb-2">Learning Rate</h3>
                      <input type="range" className="w-full" />
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-white">Training</span>
                      <button className="bg-blue-500 text-white py-1 px-3 rounded-md">Start</button>
                    </div>
                  </>
                )}

                {lab.category === "biology" && (
                  <>
                    <div>
                      <h3 className="text-white/70 text-sm mb-3">Cell Type</h3>
                      <div className="grid grid-cols-3 gap-2">
                        <button className="bg-blue-500 text-white py-1 px-3 rounded-md">Animal</button>
                        <button className="bg-white/10 text-white/70 hover:bg-white/20 hover:text-white py-1 px-3 rounded-md">
                          Plant
                        </button>
                        <button className="bg-white/10 text-white/70 hover:bg-white/20 hover:text-white py-1 px-3 rounded-md">
                          Bacteria
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white/70 text-sm mb-2">Zoom Level</h3>
                      <input type="range" className="w-full" />
                    </div>

                    <div>
                      <h3 className="text-white/70 text-sm mb-2">Visible Organelles</h3>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked className="rounded" />
                          <span className="text-white">Nucleus</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked className="rounded" />
                          <span className="text-white">Mitochondria</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked className="rounded" />
                          <span className="text-white">Endoplasmic Reticulum</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked className="rounded" />
                          <span className="text-white">Golgi Apparatus</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked className="rounded" />
                          <span className="text-white">Lysosomes</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}

                {lab.category === "mathematics" && (
                  <>
                    <div>
                      <h3 className="text-white/70 text-sm mb-3">Function Type</h3>
                      <div className="grid grid-cols-2 gap-2">
                        <button className="bg-blue-500 text-white py-1 px-3 rounded-md">Quadratic</button>
                        <button className="bg-white/10 text-white/70 hover:bg-white/20 hover:text-white py-1 px-3 rounded-md">
                          Linear
                        </button>
                        <button className="bg-white/10 text-white/70 hover:bg-white/20 hover:text-white py-1 px-3 rounded-md">
                          Exponential
                        </button>
                        <button className="bg-white/10 text-white/70 hover:bg-white/20 hover:text-white py-1 px-3 rounded-md">
                          Trigonometric
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white/70 text-sm mb-2">Parameters</h3>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-white">a</span>
                          <input
                            type="number"
                            value="1"
                            className="w-16 bg-white/10 text-white border border-white/20 rounded-md px-2 py-1"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white">b</span>
                          <input
                            type="number"
                            value="0"
                            className="w-16 bg-white/10 text-white border border-white/20 rounded-md px-2 py-1"
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-white">c</span>
                          <input
                            type="number"
                            value="0"
                            className="w-16 bg-white/10 text-white border border-white/20 rounded-md px-2 py-1"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-white/70 text-sm mb-2">Display Options</h3>
                      <div className="space-y-1">
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked className="rounded" />
                          <span className="text-white">Grid</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked className="rounded" />
                          <span className="text-white">Axes</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked className="rounded" />
                          <span className="text-white">Points</span>
                        </label>
                        <label className="flex items-center gap-2">
                          <input type="checkbox" checked className="rounded" />
                          <span className="text-white">Labels</span>
                        </label>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
