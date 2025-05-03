"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FuturisticButtonProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
  disabled?: boolean
  variant?: "primary" | "secondary" | "accent" | "outline" | "ghost"
  size?: "sm" | "md" | "lg"
  glow?: boolean
  hoverScale?: number
  icon?: React.ReactNode
  iconPosition?: "left" | "right"
  loading?: boolean
}

export function FuturisticButton({
  children,
  className,
  onClick,
  disabled = false,
  variant = "primary",
  size = "md",
  glow = true,
  hoverScale = 1.05,
  icon,
  iconPosition = "left",
  loading = false,
}: FuturisticButtonProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isPressed, setIsPressed] = useState(false)

  // Determine base styles based on variant
  const getBaseStyles = () => {
    switch (variant) {
      case "primary":
        return "bg-primary text-primary-foreground border-primary/50"
      case "secondary":
        return "bg-secondary text-secondary-foreground border-secondary/50"
      case "accent":
        return "bg-accent text-accent-foreground border-accent/50"
      case "outline":
        return "bg-transparent border-primary/50 text-primary hover:bg-primary/10"
      case "ghost":
        return "bg-transparent text-foreground hover:bg-muted/30 border-transparent"
      default:
        return "bg-primary text-primary-foreground border-primary/50"
    }
  }

  // Determine size styles
  const getSizeStyles = () => {
    switch (size) {
      case "sm":
        return "text-xs px-3 py-1.5 rounded-md"
      case "md":
        return "text-sm px-4 py-2 rounded-md"
      case "lg":
        return "text-base px-6 py-3 rounded-lg"
      default:
        return "text-sm px-4 py-2 rounded-md"
    }
  }

  // Determine glow styles
  const getGlowStyles = () => {
    if (!glow || !isHovered) return ""

    switch (variant) {
      case "primary":
        return "shadow-[0_0_15px_rgba(var(--primary),0.5)]"
      case "secondary":
        return "shadow-[0_0_15px_rgba(var(--secondary),0.5)]"
      case "accent":
        return "shadow-[0_0_15px_rgba(var(--accent),0.5)]"
      case "outline":
        return "shadow-[0_0_10px_rgba(var(--primary),0.3)]"
      case "ghost":
        return ""
      default:
        return "shadow-[0_0_15px_rgba(var(--primary),0.5)]"
    }
  }

  return (
    <motion.button
      className={cn(
        "relative overflow-hidden border transition-colors duration-300",
        "flex items-center justify-center gap-2 font-medium",
        getBaseStyles(),
        getSizeStyles(),
        disabled && "opacity-50 cursor-not-allowed",
        className,
      )}
      style={{
        boxShadow: getGlowStyles(),
      }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      onTapStart={() => setIsPressed(true)}
      onTap={() => setIsPressed(false)}
      onTapCancel={() => setIsPressed(false)}
      onClick={disabled ? undefined : onClick}
      animate={{
        scale: isPressed ? 0.97 : isHovered ? hoverScale : 1,
      }}
      transition={{
        type: "spring",
        stiffness: 500,
        damping: 30,
      }}
      disabled={disabled || loading}
    >
      {/* Background animation */}
      {variant !== "ghost" && variant !== "outline" && (
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
          initial={{ x: "-100%", opacity: 0 }}
          animate={{
            x: isHovered ? "100%" : "-100%",
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      )}

      {/* Border animation */}
      {(variant === "outline" || variant === "ghost") && (
        <motion.div
          className="absolute inset-0 rounded-[inherit] pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{
            opacity: isHovered ? 1 : 0,
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="absolute inset-0 rounded-[inherit] border border-primary/50 opacity-0 animate-pulse" />
        </motion.div>
      )}

      {/* Loading spinner */}
      {loading ? (
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 rounded-full border-2 border-current border-t-transparent animate-spin" />
          <span>Loading...</span>
        </div>
      ) : (
        <>
          {icon && iconPosition === "left" && <span>{icon}</span>}
          {children}
          {icon && iconPosition === "right" && <span>{icon}</span>}
        </>
      )}
    </motion.button>
  )
}
