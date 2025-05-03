"use client"

import type React from "react"
import { useRef, useEffect } from "react"

interface Particle {
  x: number
  y: number
  size: number
  color: string
  speedX: number
  speedY: number
}

interface ParticleConfig {
  count: number
  sizeRange: { min: number; max: number }
  speedRange: { min: number; max: number }
  colorPalette: string[]
}

const ParticlesBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const particlesRef = useRef<Particle[]>([])
  const animationFrameId = useRef<number>(0)
  const animationFrameCount = useRef(0)

  const getParticleConfig = (): ParticleConfig => ({
    count: window.innerWidth < 768 ? 50 : 80,
    sizeRange: { min: 2, max: 6 },
    speedRange: { min: 0.5, max: 1.5 },
    colorPalette: ["#ffffff", "#cccccc", "#eeeeee"],
  })

  const initParticles = (canvas: HTMLCanvasElement, config: ParticleConfig) => {
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    particlesRef.current = []
    for (let i = 0; i < config.count; i++) {
      const size = Math.random() * (config.sizeRange.max - config.sizeRange.min) + config.sizeRange.min
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const speedX = (Math.random() - 0.5) * config.speedRange.max
      const speedY = (Math.random() - 0.5) * config.speedRange.max
      const color = config.colorPalette[Math.floor(Math.random() * config.colorPalette.length)]

      particlesRef.current.push({ x, y, size, color, speedX, speedY })
    }

    // Reduce animation complexity on mobile
    const isMobile = window.innerWidth < 768
    if (isMobile) {
      config.count = Math.floor(config.count / 2)
      config.sizeRange.max = Math.min(config.sizeRange.max, 4)
    }
  }

  const updateCanvasSize = (canvas: HTMLCanvasElement) => {
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
  }

  const animate = () => {
    if (!canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    particlesRef.current.forEach((p) => {
      p.x += p.speedX
      p.y += p.speedY

      // Bounce off edges
      if (p.x + p.size > canvas.width || p.x - p.size < 0) {
        p.speedX = -p.speedX
      }
      if (p.y + p.size > canvas.height || p.y - p.size < 0) {
        p.speedY = -p.speedY
      }

      ctx.beginPath()
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
      ctx.fillStyle = p.color
      ctx.fill()
    })

    // Draw connections (only on even frames to improve performance)
    if (animationFrameCount.current % 2 === 0) {
      ctx.globalAlpha = 0.2
      for (let i = 0; i < particlesRef.current.length; i += 2) {
        // Skip every other particle
        const p1 = particlesRef.current[i]
        for (let j = i + 2; j < particlesRef.current.length; j += 2) {
          // Skip every other particle
          const p2 = particlesRef.current[j]
          const dx = p1.x - p2.x
          const dy = p1.y - p2.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.beginPath()
            ctx.strokeStyle = p1.color
            ctx.globalAlpha = (100 - distance) / 1000
            ctx.lineWidth = 0.5
            ctx.moveTo(p1.x, p1.y)
            ctx.lineTo(p2.x, p2.y)
            ctx.stroke()
          }
        }
      }
    }
    animationFrameCount.current++

    animationFrameId.current = requestAnimationFrame(animate)
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const config = getParticleConfig()
    updateCanvasSize(canvas)
    initParticles(canvas, config)

    const handleResize = () => {
      updateCanvasSize(canvas)
      initParticles(canvas, getParticleConfig())
    }

    window.addEventListener("resize", handleResize)
    animationFrameId.current = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId.current)
    }
  }, [])

  return <canvas ref={canvasRef} style={{ position: "fixed", top: 0, left: 0, zIndex: -1 }} />
}

export default ParticlesBackground
