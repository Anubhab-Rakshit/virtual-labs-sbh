"use client"

import type React from "react"

import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface Card3DProps {
  children: React.ReactNode
  className?: string
  depth?: number
  glare?: boolean
  shadow?: boolean
  border?: boolean
  borderColor?: string
  borderWidth?: number
  borderGlow?: boolean
  glowColor?: string
  perspective?: number
  disabled?: boolean
}

export function Card3D({
  children,
  className,
  depth = 50,
  glare = true,
  shadow = true,
  border = false,
  borderColor = "rgba(255, 255, 255, 0.2)",
  borderWidth = 1,
  borderGlow = false,
  glowColor = "rgba(255, 255, 255, 0.4)",
  perspective = 1000,
  disabled = false,
}: Card3DProps) {
  const [rotateX, setRotateX] = useState(0)
  const [rotateY, setRotateY] = useState(0)
  const [glarePosition, setGlarePosition] = useState({ x: 0, y: 0 })
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const [isHovered, setIsHovered] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current || disabled) return

    const rect = cardRef.current.getBoundingClientRect()

    // Calculate mouse position relative to card center (in percentage)
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5

    // Set rotation values
    setRotateX(-y * 20) // Invert Y axis for natural tilt
    setRotateY(x * 20)

    // Set glare position
    setGlarePosition({ x: x * 100 + 50, y: y * 100 + 50 })

    // Set mouse position for shadow
    setMousePosition({ x, y })
  }

  const handleMouseEnter = () => {
    if (!disabled) {
      setIsHovered(true)
    }
  }

  const handleMouseLeave = () => {
    if (!disabled) {
      setIsHovered(false)
      setRotateX(0)
      setRotateY(0)
    }
  }

  // Reset on component unmount or when disabled changes
  useEffect(() => {
    return () => {
      setRotateX(0)
      setRotateY(0)
      setIsHovered(false)
    }
  }, [disabled])

  return (
    <motion.div
      ref={cardRef}
      className={cn("relative overflow-hidden", className)}
      style={{
        perspective: `${perspective}px`,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: rotateX,
        rotateY: rotateY,
        z: isHovered ? depth : 0,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 20,
        mass: 0.8,
      }}
    >
      {/* Main content */}
      <div className="relative z-10">{children}</div>

      {/* Border */}
      {border && (
        <motion.div
          className="absolute inset-0 z-0 rounded-[inherit] pointer-events-none"
          style={{
            border: `${borderWidth}px solid ${borderColor}`,
          }}
          animate={{
            boxShadow: borderGlow && isHovered ? `0 0 15px 2px ${glowColor}` : "none",
          }}
        />
      )}

      {/* Glare effect */}
      {glare && (
        <motion.div
          className="absolute inset-0 z-20 pointer-events-none overflow-hidden rounded-[inherit]"
          animate={{
            opacity: isHovered ? 0.15 : 0,
          }}
        >
          <div
            className="absolute w-[200%] h-[200%] top-0 left-0 bg-gradient-to-br from-white via-white to-transparent opacity-0"
            style={{
              opacity: isHovered ? 0.7 : 0,
              transform: `translate(${glarePosition.x}%, ${glarePosition.y}%) rotate(30deg)`,
              transformOrigin: "0 0",
            }}
          />
        </motion.div>
      )}

      {/* Shadow */}
      {shadow && (
        <motion.div
          className="absolute -z-10 inset-0 rounded-[inherit] bg-black/20 blur-xl"
          animate={{
            opacity: isHovered ? 1 : 0,
            x: isHovered ? mousePosition.x * 20 : 0,
            y: isHovered ? mousePosition.y * 20 : 0,
            scale: isHovered ? 0.85 : 1,
          }}
          transition={{
            opacity: { duration: 0.3 },
          }}
        />
      )}
    </motion.div>
  )
}
