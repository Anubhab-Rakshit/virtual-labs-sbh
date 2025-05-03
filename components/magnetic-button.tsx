"use client"

import type React from "react"
import { useRef, useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface MagneticButtonProps {
  children: React.ReactNode
  className?: string
  magneticStrength?: number
  cursorText?: string
  onClick?: () => void
  href?: string
  variant?: "default" | "primary" | "outline" | "ghost" | "link"
  size?: "default" | "sm" | "lg" | "icon"
}

export function MagneticButton({
  children,
  className,
  magneticStrength = 0.3,
  cursorText,
  onClick,
  href,
  variant = "default",
  size = "default",
}: MagneticButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const variantClasses = {
    default: "bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20",
    primary: "bg-primary text-primary-foreground hover:bg-primary/90",
    outline: "border border-primary/50 bg-background hover:bg-primary/10 text-primary",
    ghost: "hover:bg-primary/10 text-primary hover:text-primary",
    link: "text-primary underline-offset-4 hover:underline",
  }

  const sizeClasses = {
    default: "h-10 px-4 py-2",
    sm: "h-9 rounded-md px-3",
    lg: "h-11 rounded-md px-8",
    icon: "h-10 w-10",
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!buttonRef.current) return

      const { clientX, clientY } = e
      const { left, top, width, height } = buttonRef.current.getBoundingClientRect()
      const x = clientX - (left + width / 2)
      const y = clientY - (top + height / 2)
      const distance = Math.sqrt(x * x + y * y)
      const maxDistance = Math.sqrt((width / 2) ** 2 + (height / 2) ** 2) + 50

      if (distance < maxDistance) {
        const strength = magneticStrength * (1 - distance / maxDistance)
        setPosition({ x: x * strength, y: y * strength })
      } else {
        setPosition({ x: 0, y: 0 })
      }
    }

    const handleMouseLeave = () => {
      setPosition({ x: 0, y: 0 })
    }

    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseleave", handleMouseLeave)

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseleave", handleMouseLeave)
    }
  }, [magneticStrength])

  const Component = href ? "a" : "button"
  const props = href ? { href } : { onClick }

  return (
    <motion.div
      ref={buttonRef}
      className={cn(
        "relative inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      animate={{ x: position.x, y: position.y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      data-magnetic
      data-cursor-text={cursorText}
      {...props}
    >
      {children}
    </motion.div>
  )
}
