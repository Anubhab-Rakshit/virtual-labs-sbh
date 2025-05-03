"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface GlowingButtonProps {
  children: React.ReactNode
  className?: string
  glowColor?: string
  cursorText?: string
  onClick?: () => void
}

export function GlowingButton({
  children,
  className,
  glowColor = "rgba(99, 102, 241, 0.5)",
  cursorText,
  onClick,
}: GlowingButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return

    const rect = buttonRef.current.getBoundingClientRect()
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    })
  }

  return (
    <motion.button
      ref={buttonRef}
      className={cn(
        "relative overflow-hidden rounded-md bg-black border border-white/20 text-white px-4 py-2 transition-all",
        className,
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      data-cursor-text={cursorText}
    >
      {/* Glow effect */}
      <motion.div
        className="absolute pointer-events-none"
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.5,
        }}
        transition={{ duration: 0.3 }}
        style={{
          left: mousePosition.x,
          top: mousePosition.y,
          width: 150,
          height: 150,
          borderRadius: "50%",
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)`,
          transform: "translate(-50%, -50%)",
        }}
      />

      {/* Border glow */}
      <motion.div
        className="absolute inset-0 pointer-events-none rounded-md"
        animate={{
          opacity: isHovered ? 1 : 0,
          boxShadow: isHovered ? `0 0 20px 2px ${glowColor}` : "0 0 0px 0px rgba(0,0,0,0)",
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Button content */}
      <span className="relative z-10">{children}</span>
    </motion.button>
  )
}
