"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface NeuralNetworkVisualizationProps {
  className?: string
  layers?: number[]
  animated?: boolean
  interactive?: boolean
  theme?: "light" | "dark"
}

export function NeuralNetworkVisualization({
  className,
  layers = [4, 8, 6, 3],
  animated = true,
  interactive = true,
  theme = "dark",
}: NeuralNetworkVisualizationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [activeNode, setActiveNode] = useState<{ layer: number; node: number } | null>(null)
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 })
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
  const [isTraining, setIsTraining] = useState(false)
  const [progress, setProgress] = useState(0)

  // Colors based on theme
  const colors = {
    light: {
      background: "#ffffff",
      node: "#333333",
      activeNode: "#3b82f6",
      connection: "rgba(0, 0, 0, 0.1)",
      activeConnection: "rgba(59, 130, 246, 0.5)",
      text: "#000000",
    },
    dark: {
      background: "transparent",
      node: "#ffffff",
      activeNode: "#3b82f6",
      connection: "rgba(255, 255, 255, 0.1)",
      activeConnection: "rgba(59, 130, 246, 0.5)",
      text: "#ffffff",
    },
  }

  const themeColors = colors[theme]

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

  // Draw the neural network
  useEffect(() => {
    if (!canvasRef.current || dimensions.width === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = dimensions.width
    canvas.height = dimensions.height

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Calculate node positions
    const nodePositions: { x: number; y: number }[][] = []
    const nodeRadius = Math.min(
      dimensions.width / (layers.length * 4),
      dimensions.height / (Math.max(...layers) * 4),
      15,
    )
    const horizontalSpacing = dimensions.width / (layers.length + 1)

    for (let i = 0; i < layers.length; i++) {
      const layerNodes = layers[i]
      const verticalSpacing = dimensions.height / (layerNodes + 1)
      const layerPositions: { x: number; y: number }[] = []

      for (let j = 0; j < layerNodes; j++) {
        layerPositions.push({
          x: horizontalSpacing * (i + 1),
          y: verticalSpacing * (j + 1),
        })
      }

      nodePositions.push(layerPositions)
    }

    // Draw connections
    for (let i = 0; i < nodePositions.length - 1; i++) {
      const currentLayer = nodePositions[i]
      const nextLayer = nodePositions[i + 1]

      for (let j = 0; j < currentLayer.length; j++) {
        for (let k = 0; k < nextLayer.length; k++) {
          const start = currentLayer[j]
          const end = nextLayer[k]

          // Check if this connection should be highlighted
          const isActive =
            activeNode &&
            ((activeNode.layer === i && activeNode.node === j) || (activeNode.layer === i + 1 && activeNode.node === k))

          ctx.beginPath()
          ctx.moveTo(start.x, start.y)
          ctx.lineTo(end.x, end.y)
          ctx.strokeStyle = isActive ? themeColors.activeConnection : themeColors.connection
          ctx.lineWidth = isActive ? 2 : 1
          ctx.stroke()

          // Add animated pulse for training visualization
          if (isTraining && animated) {
            const pulsePosition = (progress % 100) / 100
            const pulseX = start.x + (end.x - start.x) * pulsePosition
            const pulseY = start.y + (end.y - start.y) * pulsePosition

            ctx.beginPath()
            ctx.arc(pulseX, pulseY, 3, 0, Math.PI * 2)
            ctx.fillStyle = themeColors.activeNode
            ctx.fill()
          }
        }
      }
    }

    // Draw nodes
    for (let i = 0; i < nodePositions.length; i++) {
      const layer = nodePositions[i]

      for (let j = 0; j < layer.length; j++) {
        const { x, y } = layer[j]
        const isActive = activeNode && activeNode.layer === i && activeNode.node === j

        // Node glow for active nodes
        if (isActive) {
          ctx.beginPath()
          ctx.arc(x, y, nodeRadius * 1.5, 0, Math.PI * 2)
          ctx.fillStyle = "rgba(59, 130, 246, 0.2)"
          ctx.fill()
        }

        // Node circle
        ctx.beginPath()
        ctx.arc(x, y, nodeRadius, 0, Math.PI * 2)
        ctx.fillStyle = isActive ? themeColors.activeNode : themeColors.node
        ctx.fill()

        // Add labels for input and output layers
        if (i === 0 || i === layers.length - 1) {
          ctx.fillStyle = themeColors.text
          ctx.font = "12px Arial"
          ctx.textAlign = "center"
          ctx.textBaseline = "middle"

          let label = ""
          if (i === 0) {
            label = `Input ${j + 1}`
          } else {
            label = `Output ${j + 1}`
          }

          // Position the label outside the node
          const labelX = i === 0 ? x - nodeRadius * 2 : x + nodeRadius * 2
          ctx.fillText(label, labelX, y)
        }
      }
    }

    // Draw layer labels
    ctx.fillStyle = themeColors.text
    ctx.font = "14px Arial"
    ctx.textAlign = "center"

    for (let i = 0; i < layers.length; i++) {
      const label = i === 0 ? "Input Layer" : i === layers.length - 1 ? "Output Layer" : `Hidden Layer ${i}`
      ctx.fillText(label, horizontalSpacing * (i + 1), 20)
    }
  }, [dimensions, activeNode, layers, isTraining, progress, themeColors, animated])

  // Handle mouse movement for interactive highlighting
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!interactive || !canvasRef.current) return

    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    setMousePos({ x, y })

    // Calculate node positions (same as in drawing effect)
    const nodePositions: { x: number; y: number; layer: number; node: number }[] = []
    const nodeRadius = Math.min(
      dimensions.width / (layers.length * 4),
      dimensions.height / (Math.max(...layers) * 4),
      15,
    )
    const horizontalSpacing = dimensions.width / (layers.length + 1)

    for (let i = 0; i < layers.length; i++) {
      const layerNodes = layers[i]
      const verticalSpacing = dimensions.height / (layerNodes + 1)

      for (let j = 0; j < layerNodes; j++) {
        nodePositions.push({
          x: horizontalSpacing * (i + 1),
          y: verticalSpacing * (j + 1),
          layer: i,
          node: j,
        })
      }
    }

    // Find closest node
    let closestNode = null
    let closestDistance = Number.POSITIVE_INFINITY

    for (const node of nodePositions) {
      const distance = Math.sqrt(Math.pow(node.x - x, 2) + Math.pow(node.y - y, 2))
      if (distance < closestDistance && distance < nodeRadius * 2) {
        closestDistance = distance
        closestNode = { layer: node.layer, node: node.node }
      }
    }

    setActiveNode(closestNode)
  }

  // Simulate training process
  useEffect(() => {
    if (!isTraining || !animated) return

    const interval = setInterval(() => {
      setProgress((prev) => (prev + 1) % 100)
    }, 50)

    return () => clearInterval(interval)
  }, [isTraining, animated])

  return (
    <div className={cn("relative", className)} ref={containerRef}>
      <div className="absolute top-4 right-4 z-10 flex gap-2">
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            isTraining ? "bg-red-500 hover:bg-red-600 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"
          }`}
          onClick={() => setIsTraining(!isTraining)}
        >
          {isTraining ? "Stop Training" : "Start Training"}
        </button>
      </div>

      <canvas
        ref={canvasRef}
        className="w-full h-full cursor-pointer"
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setActiveNode(null)}
      />

      {activeNode && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute bg-black/80 backdrop-blur-sm text-white p-3 rounded-md z-20 pointer-events-none"
          style={{
            left: mousePos.x + 10,
            top: mousePos.y + 10,
          }}
        >
          <p className="text-sm font-medium">
            {activeNode.layer === 0
              ? "Input Node"
              : activeNode.layer === layers.length - 1
                ? "Output Node"
                : "Hidden Node"}
          </p>
          <p className="text-xs opacity-70">
            Layer: {activeNode.layer + 1}, Node: {activeNode.node + 1}
          </p>
          <p className="text-xs opacity-70">Activation: 0.{Math.floor(Math.random() * 999)}</p>
        </motion.div>
      )}
    </div>
  )
}
