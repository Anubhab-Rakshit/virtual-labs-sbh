"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimationType =
  | "fade-in"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "scale-up"
  | "scale-down"
  | "rotate"
  | "blur"
  | "reveal"
  | "parallax"
  | "sticky"
  | "pin"
  | "follow-path"

interface ScrollAnimationProps {
  children: ReactNode
  animation: AnimationType
  className?: string
  delay?: number
  duration?: number
  threshold?: number
  once?: boolean
  speed?: number
  distance?: number
  startOffset?: number
  endOffset?: number
  spring?: boolean
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
  path?: {
    points: [number, number][]
    closed?: boolean
  }
  customProps?: Record<string, any>
}

export function ScrollAnimation({
  children,
  animation,
  className = "",
  delay = 0,
  duration = 0.5,
  threshold = 0.1,
  once = true,
  speed = 1,
  distance = 100,
  startOffset = 0,
  endOffset = 1,
  spring = false,
  springConfig = {
    stiffness: 100,
    damping: 30,
    mass: 1,
  },
  path,
  customProps = {},
}: ScrollAnimationProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  // Create spring-based scroll progress if needed
  const springScrollProgress = useSpring(scrollYProgress, {
    stiffness: springConfig.stiffness || 100,
    damping: springConfig.damping || 30,
    mass: springConfig.mass || 1,
  })

  // Use either spring or regular scroll progress
  const progress = spring ? springScrollProgress : scrollYProgress

  // Calculate animation ranges based on offsets
  const effectiveStart = startOffset
  const effectiveEnd = endOffset

  // Define default transform values
  const defaultTransform = {
    opacity: useTransform(progress, [0, 1], [1, 1]),
    x: useTransform(progress, [0, 1], [0, 0]),
    y: useTransform(progress, [0, 1], [0, 0]),
    scale: useTransform(progress, [0, 1], [1, 1]),
    rotate: useTransform(progress, [0, 1], [0, 0]),
    filter: useTransform(progress, [0, 1], ["blur(0px)", "blur(0px)"]),
    clipPath: useTransform(progress, [0, 1], ["inset(0 0 0 0)", "inset(0 0 0 0)"]),
  }

  // Create transform values based on animation type
  const getAnimationProps = () => {
    switch (animation) {
      case "fade-in":
        return {
          ...defaultTransform,
          opacity: useTransform(progress, [effectiveStart, effectiveEnd], [0, 1]),
        }
      case "slide-up":
        return {
          ...defaultTransform,
          opacity: useTransform(progress, [effectiveStart, effectiveEnd], [0, 1]),
          y: useTransform(progress, [effectiveStart, effectiveEnd], [distance * speed, 0]),
        }
      case "slide-down":
        return {
          ...defaultTransform,
          opacity: useTransform(progress, [effectiveStart, effectiveEnd], [0, 1]),
          y: useTransform(progress, [effectiveStart, effectiveEnd], [-distance * speed, 0]),
        }
      case "slide-left":
        return {
          ...defaultTransform,
          opacity: useTransform(progress, [effectiveStart, effectiveEnd], [0, 1]),
          x: useTransform(progress, [effectiveStart, effectiveEnd], [distance * speed, 0]),
        }
      case "slide-right":
        return {
          ...defaultTransform,
          opacity: useTransform(progress, [effectiveStart, effectiveEnd], [0, 1]),
          x: useTransform(progress, [effectiveStart, effectiveEnd], [-distance * speed, 0]),
        }
      case "scale-up":
        return {
          ...defaultTransform,
          opacity: useTransform(progress, [effectiveStart, effectiveEnd], [0, 1]),
          scale: useTransform(progress, [effectiveStart, effectiveEnd], [0.8, 1]),
        }
      case "scale-down":
        return {
          ...defaultTransform,
          opacity: useTransform(progress, [effectiveStart, effectiveEnd], [0, 1]),
          scale: useTransform(progress, [effectiveStart, effectiveEnd], [1.2, 1]),
        }
      case "rotate":
        return {
          ...defaultTransform,
          opacity: useTransform(progress, [effectiveStart, effectiveEnd], [0, 1]),
          rotate: useTransform(progress, [effectiveStart, effectiveEnd], [45 * speed, 0]),
        }
      case "blur":
        return {
          ...defaultTransform,
          opacity: useTransform(progress, [effectiveStart, effectiveEnd], [0, 1]),
          filter: useTransform(progress, [effectiveStart, effectiveEnd], [`blur(${10 * speed}px)`, "blur(0px)"]),
        }
      case "reveal":
        return {
          ...defaultTransform,
          clipPath: useTransform(progress, [effectiveStart, effectiveEnd], ["inset(0 100% 0 0)", "inset(0 0% 0 0)"]),
        }
      case "parallax":
        return {
          ...defaultTransform,
          y: useTransform(progress, [0, 1], [0, -distance * speed]),
        }
      case "sticky":
        return {
          ...defaultTransform,
          position: "sticky",
          top: 0,
          opacity: useTransform(
            progress,
            [effectiveStart, effectiveStart + 0.1, effectiveEnd - 0.1, effectiveEnd],
            [0, 1, 1, 0],
          ),
        }
      case "pin":
        // Pin effect is handled differently with CSS
        return {}
      case "follow-path":
        if (!path || !path.points || path.points.length < 2) {
          console.error("Path points are required for follow-path animation")
          return {}
        }

        // Create motion values for x and y coordinates along the path
        const pathX = useTransform(
          progress,
          [0, 1],
          path.points.map((p) => p[0]),
        )
        const pathY = useTransform(
          progress,
          [0, 1],
          path.points.map((p) => p[1]),
        )

        return {
          ...defaultTransform,
          x: pathX,
          y: pathY,
        }
      default:
        return {}
    }
  }

  const animationProps = getAnimationProps()

  // Handle pin effect with CSS
  const pinStyles =
    animation === "pin"
      ? {
          position: "sticky",
          top: 0,
          height: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }
      : {}

  return (
    <motion.div
      ref={ref}
      className={cn(className)}
      style={{
        ...animationProps,
        ...pinStyles,
        ...customProps,
      }}
      transition={{
        duration,
        delay,
      }}
    >
      {children}
    </motion.div>
  )
}
