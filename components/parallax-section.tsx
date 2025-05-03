"use client"

import type React from "react"
import { useRef } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

interface ParallaxSectionProps {
  children: React.ReactNode
  className?: string
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  offset?: number[]
  opacityEffect?: boolean
  scaleEffect?: boolean
  once?: boolean
  threshold?: number
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
}

export function ParallaxSection({
  children,
  className,
  speed = 0.2,
  direction = "up",
  offset = [0, 1],
  opacityEffect = false,
  scaleEffect = false,
  once = true,
  threshold = 0.1,
  springConfig = {
    stiffness: 100,
    damping: 30,
    mass: 1,
  },
}: ParallaxSectionProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const springScrollY = useSpring(scrollYProgress, {
    stiffness: springConfig.stiffness || 100,
    damping: springConfig.damping || 30,
    mass: springConfig.mass || 1,
  })

  // Calculate transform values based on direction
  const upTransform = useTransform(springScrollY, offset, ["0%", `${-30 * speed}%`])
  const downTransform = useTransform(springScrollY, offset, ["0%", `${30 * speed}%`])
  const leftTransform = useTransform(springScrollY, offset, ["0%", `${-30 * speed}%`])
  const rightTransform = useTransform(springScrollY, offset, ["0%", `${30 * speed}%`])

  let transformValue
  switch (direction) {
    case "up":
      transformValue = upTransform
      break
    case "down":
      transformValue = downTransform
      break
    case "left":
      transformValue = leftTransform
      break
    case "right":
      transformValue = rightTransform
      break
    default:
      transformValue = upTransform
  }

  // Calculate opacity if needed
  const opacityValue = useTransform(springScrollY, [0, 0.5, 1], [0.4, 1, 0.4])
  const defaultOpacity = useTransform(springScrollY, [0, 1], [1, 1])

  const opacity = opacityEffect ? opacityValue : defaultOpacity

  // Calculate scale if needed
  const scaleValue = useTransform(springScrollY, [0, 0.5, 1], [0.8, 1, 0.8])
  const defaultScale = useTransform(springScrollY, [0, 1], [1, 1])

  const scale = scaleEffect ? scaleValue : defaultScale

  return (
    <motion.div
      ref={ref}
      className={cn("relative overflow-hidden", className)}
      initial={isInView ? "visible" : "hidden"}
      animate={isInView ? "visible" : "hidden"}
      variants={{
        hidden: { opacity: opacityEffect ? 0 : 1 },
        visible: { opacity: 1 },
      }}
      transition={{ duration: 0.6 }}
    >
      <motion.div
        style={{
          [direction === "up" || direction === "down" ? "y" : "x"]: transformValue,
          opacity,
          scale,
        }}
        className="w-full h-full"
      >
        {children}
      </motion.div>
    </motion.div>
  )
}
