"use client"

import { useRef, useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface WaveSimulationProps {
  className?: string
}

export function WaveSimulation({ className }: WaveSimulationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [waveType, setWaveType] = useState<"sine" | "square" | "sawtooth" | "interference">("sine")
  const [amplitude, setAmplitude] = useState(50)
  const [frequency, setFrequency] = useState(0.02)
  const [speed, setSpeed] = useState(0.05)
  const [damping, setDamping] = useState(0)
  const animationRef = useRef<number>(0)
  const timeRef = useRef(0)

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

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return

      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update time
      timeRef.current += speed

      // Draw grid
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)"
      ctx.lineWidth = 1

      // Vertical grid lines
      for (let x = 0; x < canvas.width; x += 50) {
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
      }

      // Horizontal grid lines
      for (let y = 0; y < canvas.height; y += 50) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
      }

      // Draw x and y axes
      ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
      ctx.lineWidth = 2

      // x-axis
      ctx.beginPath()
      ctx.moveTo(0, canvas.height / 2)
      ctx.lineTo(canvas.width, canvas.height / 2)
      ctx.stroke()

      // y-axis
      ctx.beginPath()
      ctx.moveTo(50, 0)
      ctx.lineTo(50, canvas.height)
      ctx.stroke()

      // Draw wave
      ctx.strokeStyle = "#3b82f6"
      ctx.lineWidth = 3
      ctx.beginPath()

      for (let x = 0; x < canvas.width; x++) {
        let y = 0

        // Calculate wave height based on type
        switch (waveType) {
          case "sine":
            y = Math.sin((x - timeRef.current * 100) * frequency) * amplitude * Math.exp(-damping * (x / canvas.width))
            break
          case "square":
            y =
              (Math.sin((x - timeRef.current * 100) * frequency) > 0 ? 1 : -1) *
              amplitude *
              Math.exp(-damping * (x / canvas.width))
            break
          case "sawtooth":
            y =
              ((((x - timeRef.current * 100) * frequency) % (2 * Math.PI)) / Math.PI - 1) *
              amplitude *
              Math.exp(-damping * (x / canvas.width))
            break
          case "interference":
            y =
              (Math.sin((x - timeRef.current * 100) * frequency) +
                Math.sin((x - timeRef.current * 100) * frequency * 1.5)) *
              (amplitude / 2) *
              Math.exp(-damping * (x / canvas.width))
            break
        }

        if (x === 0) {
          ctx.moveTo(x, canvas.height / 2 + y)
        } else {
          ctx.lineTo(x, canvas.height / 2 + y)
        }
      }

      ctx.stroke()

      // Draw wave particles for visual effect
      ctx.fillStyle = "#3b82f6"
      for (let x = 0; x < canvas.width; x += 20) {
        let y = 0

        switch (waveType) {
          case "sine":
            y = Math.sin((x - timeRef.current * 100) * frequency) * amplitude * Math.exp(-damping * (x / canvas.width))
            break
          case "square":
            y =
              (Math.sin((x - timeRef.current * 100) * frequency) > 0 ? 1 : -1) *
              amplitude *
              Math.exp(-damping * (x / canvas.width))
            break
          case "sawtooth":
            y =
              ((((x - timeRef.current * 100) * frequency) % (2 * Math.PI)) / Math.PI - 1) *
              amplitude *
              Math.exp(-damping * (x / canvas.width))
            break
          case "interference":
            y =
              (Math.sin((x - timeRef.current * 100) * frequency) +
                Math.sin((x - timeRef.current * 100) * frequency * 1.5)) *
              (amplitude / 2) *
              Math.exp(-damping * (x / canvas.width))
            break
        }

        ctx.beginPath()
        ctx.arc(x, canvas.height / 2 + y, 4, 0, Math.PI * 2)
        ctx.fill()
      }

      // Draw wave envelope
      if (damping > 0) {
        ctx.strokeStyle = "rgba(59, 130, 246, 0.3)"
        ctx.lineWidth = 2
        ctx.beginPath()

        for (let x = 0; x < canvas.width; x++) {
          const envelope = amplitude * Math.exp(-damping * (x / canvas.width))
          if (x === 0) {
            ctx.moveTo(x, canvas.height / 2 - envelope)
          } else {
            ctx.lineTo(x, canvas.height / 2 - envelope)
          }
        }

        for (let x = canvas.width; x >= 0; x--) {
          const envelope = amplitude * Math.exp(-damping * (x / canvas.width))
          ctx.lineTo(x, canvas.height / 2 + envelope)
        }

        ctx.closePath()
        ctx.fillStyle = "rgba(59, 130, 246, 0.1)"
        ctx.fill()
        ctx.stroke()
      }

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [waveType, amplitude, frequency, speed, damping])

  return (
    <div className={cn("relative w-full h-full", className)}>
      <canvas ref={canvasRef} className="w-full h-full" />

      <div className="absolute top-4 left-4 flex gap-2">
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            waveType === "sine" ? "bg-blue-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => setWaveType("sine")}
        >
          Sine
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            waveType === "square" ? "bg-blue-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => setWaveType("square")}
        >
          Square
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            waveType === "sawtooth" ? "bg-blue-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => setWaveType("sawtooth")}
        >
          Sawtooth
        </button>
        <button
          className={`px-3 py-1 rounded-md text-sm ${
            waveType === "interference" ? "bg-blue-500 text-white" : "bg-white/10 text-white/70 hover:bg-white/20"
          }`}
          onClick={() => setWaveType("interference")}
        >
          Interference
        </button>
      </div>

      <div className="absolute bottom-4 left-4 right-4 flex flex-col gap-2 bg-black/50 backdrop-blur-sm p-3 rounded-md">
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-sm w-24">Amplitude:</span>
          <input
            type="range"
            min="10"
            max="100"
            value={amplitude}
            onChange={(e) => setAmplitude(Number.parseInt(e.target.value))}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-sm w-24">Frequency:</span>
          <input
            type="range"
            min="0.005"
            max="0.05"
            step="0.001"
            value={frequency}
            onChange={(e) => setFrequency(Number.parseFloat(e.target.value))}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-sm w-24">Speed:</span>
          <input
            type="range"
            min="0"
            max="0.1"
            step="0.001"
            value={speed}
            onChange={(e) => setSpeed(Number.parseFloat(e.target.value))}
            className="flex-1"
          />
        </div>
        <div className="flex items-center gap-2">
          <span className="text-white/70 text-sm w-24">Damping:</span>
          <input
            type="range"
            min="0"
            max="5"
            step="0.1"
            value={damping}
            onChange={(e) => setDamping(Number.parseFloat(e.target.value))}
            className="flex-1"
          />
        </div>
      </div>
    </div>
  )
}
