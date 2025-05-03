"use client"

import { useRef, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface ParticleWaveProps {
  className?: string
  particleCount?: number
  waveHeight?: number
  waveSpeed?: number
  particleSize?: number
  particleColor?: string
  interactive?: boolean
}

export function ParticleWave({
  className,
  particleCount = 100,
  waveHeight = 50,
  waveSpeed = 0.05,
  particleSize = 2,
  particleColor = "#ffffff",
  interactive = true,
}: ParticleWaveProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const particlesRef = useRef<
    {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      baseY: number
      waveOffset: number
    }[]
  >([])
  const mouseRef = useRef<{ x: number; y: number; radius: number }>({ x: 0, y: 0, radius: 150 })
  const timeRef = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Initialize particles
    particlesRef.current = []
    for (let i = 0; i < particleCount; i++) {
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const size = Math.random() * particleSize + 1
      const speedX = (Math.random() - 0.5) * 0.5
      const speedY = (Math.random() - 0.5) * 0.2
      const waveOffset = Math.random() * Math.PI * 2

      particlesRef.current.push({
        x,
        y,
        size,
        speedX,
        speedY,
        baseY: y,
        waveOffset,
      })
    }

    // Animation loop
    const animate = () => {
      if (!canvas || !ctx) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)
      timeRef.current += waveSpeed

      particlesRef.current.forEach((particle) => {
        // Update position
        particle.x += particle.speedX
        particle.y =
          particle.baseY + Math.sin(timeRef.current + particle.waveOffset) * waveHeight * (particle.size / particleSize)

        // Boundary check
        if (particle.x < 0) particle.x = canvas.width
        if (particle.x > canvas.width) particle.x = 0
        if (particle.y < 0) particle.y = canvas.height
        if (particle.y > canvas.height) particle.y = 0

        // Mouse interaction
        if (interactive) {
          const dx = particle.x - mouseRef.current.x
          const dy = particle.y - mouseRef.current.y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < mouseRef.current.radius) {
            const force = (mouseRef.current.radius - distance) / mouseRef.current.radius
            particle.x += dx * force * 0.02
            particle.y += dy * force * 0.02
          }
        }

        // Draw particle
        ctx.beginPath()
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2)
        ctx.fillStyle = particleColor
        ctx.fill()
      })

      // Draw connections
      ctx.strokeStyle = particleColor
      ctx.lineWidth = 0.1
      for (let i = 0; i < particlesRef.current.length; i++) {
        for (let j = i + 1; j < particlesRef.current.length; j++) {
          const dx = particlesRef.current[i].x - particlesRef.current[j].x
          const dy = particlesRef.current[i].y - particlesRef.current[j].y
          const distance = Math.sqrt(dx * dx + dy * dy)

          if (distance < 100) {
            ctx.globalAlpha = (100 - distance) / 1000
            ctx.beginPath()
            ctx.moveTo(particlesRef.current[i].x, particlesRef.current[i].y)
            ctx.lineTo(particlesRef.current[j].x, particlesRef.current[j].y)
            ctx.stroke()
          }
        }
      }

      ctx.globalAlpha = 1

      animationRef.current = requestAnimationFrame(animate)
    }

    animate()

    // Mouse move handler
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current.x = e.clientX
      mouseRef.current.y = e.clientY
    }

    if (interactive) {
      window.addEventListener("mousemove", handleMouseMove)
    }

    return () => {
      cancelAnimationFrame(animationRef.current)
      window.removeEventListener("resize", setCanvasDimensions)
      if (interactive) {
        window.removeEventListener("mousemove", handleMouseMove)
      }
    }
  }, [particleCount, waveHeight, waveSpeed, particleSize, particleColor, interactive])

  return (
    <motion.canvas
      ref={canvasRef}
      className={cn("w-full h-full", className)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    />
  )
}
