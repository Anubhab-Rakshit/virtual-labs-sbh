"use client"

import { useRef, type ReactNode } from "react"
import { motion, useScroll, useTransform, useSpring, useInView } from "framer-motion"
import { cn } from "@/lib/utils"

type SectionType = "normal" | "sticky" | "parallax" | "horizontal-scroll" | "reveal" | "zoom" | "fade" | "split" | "pin"

interface ScrollSectionProps {
  children: ReactNode
  type?: SectionType
  className?: string
  height?: string
  speed?: number
  direction?: "up" | "down" | "left" | "right"
  threshold?: number
  once?: boolean
  spring?: boolean
  springConfig?: {
    stiffness?: number
    damping?: number
    mass?: number
  }
  backgroundColor?: string
  backgroundImage?: string
  backgroundOpacity?: number
  backgroundBlur?: number
  backgroundParallax?: boolean
  foregroundParallax?: boolean
  splitRatio?: number
  zIndex?: number
  id?: string
}

export function ScrollSection({
  children,
  type = "normal",
  className = "",
  height = "100vh",
  speed = 1,
  direction = "up",
  threshold = 0.1,
  once = false,
  spring = true,
  springConfig = {
    stiffness: 100,
    damping: 30,
    mass: 1,
  },
  backgroundColor = "",
  backgroundImage = "",
  backgroundOpacity = 1,
  backgroundBlur = 0,
  backgroundParallax = false,
  foregroundParallax = false,
  splitRatio = 0.5,
  zIndex = 1,
  id,
}: ScrollSectionProps) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const backgroundRef = useRef<HTMLDivElement>(null)
  const isInView = useInView(sectionRef, { once, amount: threshold })

  const { scrollYProgress } = useScroll({
    target: sectionRef,
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

  // Background parallax effect
  const backgroundYTransform = backgroundParallax ? ["0%", `${30 * speed}%`] : ["0%", "0%"]
  const backgroundY = useTransform(progress, [0, 1], backgroundYTransform)

  // Foreground parallax effect
  const foregroundYTransform = foregroundParallax ? ["0%", `${-30 * speed}%`] : ["0%", "0%"]
  const foregroundY = useTransform(progress, [0, 1], foregroundYTransform)

  // Horizontal scroll effect
  const horizontalXTransform = ["0%", `-${100 * speed}%`]
  const horizontalX = useTransform(progress, [0, 1], horizontalXTransform)

  // Zoom effect
  const scaleTransform = type === "zoom" ? [0.8, 1, 1.2] : [1, 1, 1]
  const scale = useTransform(progress, [0, 0.5, 1], scaleTransform)

  // Fade effect
  const opacityTransform = type === "fade" ? [0, 1, 1, 0] : [1, 1, 1, 1]
  const opacity = useTransform(progress, [0, 0.3, 0.7, 1], opacityTransform)

  // Reveal effect
  const revealTransform =
    type === "reveal"
      ? ["inset(0% 0% 100% 0%)", "inset(0% 0% 0% 0%)", "inset(100% 0% 0% 0%)"]
      : ["inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)", "inset(0% 0% 0% 0%)"]
  const clipPath = useTransform(progress, [0, 0.5, 1], revealTransform)

  // Split effect
  const splitXTransform = type === "split" ? ["0%", "0%", `-${50 * speed}%`] : ["0%", "0%", "0%"]
  const leftX = useTransform(progress, [0, 0.5, 1], splitXTransform)

  const splitRightXTransform = type === "split" ? ["0%", "0%", `${50 * speed}%`] : ["0%", "0%", "0%"]
  const rightX = useTransform(progress, [0, 0.5, 1], splitRightXTransform)

  // Get section styles based on type
  const getSectionStyles = () => {
    const baseStyles = {
      position: "relative",
      height: height,
      overflow: "hidden",
      zIndex: zIndex,
    }

    switch (type) {
      case "sticky":
        return {
          ...baseStyles,
          height: `calc(${height} * 2)`, // Double height for sticky effect
        }
      case "pin":
        return {
          ...baseStyles,
          height: `calc(${height} * 3)`, // Triple height for pin effect
        }
      default:
        return baseStyles
    }
  }

  // Get content styles based on type
  const getContentStyles = () => {
    switch (type) {
      case "sticky":
      case "pin":
        return {
          position: "sticky",
          top: 0,
          height: height,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }
      case "horizontal-scroll":
        return {
          display: "flex",
          flexWrap: "nowrap",
          width: "fit-content",
        }
      case "split":
        return {
          display: "flex",
          flexDirection: "row",
          height: "100%",
        }
      default:
        return {}
    }
  }

  // Get animation props based on type
  const getAnimationProps = () => {
    switch (type) {
      case "parallax":
        return {
          y:
            direction === "up" || direction === "down"
              ? direction === "up"
                ? foregroundY
                : useTransform(foregroundY, (value) => -value)
              : 0,
          x:
            direction === "left" || direction === "right"
              ? direction === "left"
                ? useTransform(progress, [0, 1], ["0%", `${-30 * speed}%`])
                : useTransform(progress, [0, 1], ["0%", `${30 * speed}%`])
              : 0,
        }
      case "horizontal-scroll":
        return {
          x: horizontalX,
        }
      case "zoom":
        return {
          scale,
        }
      case "fade":
        return {
          opacity,
        }
      case "reveal":
        return {
          clipPath,
        }
      default:
        return {}
    }
  }

  return (
    <motion.section ref={sectionRef} id={id} className={cn("relative", className)} style={getSectionStyles() as any}>
      {/* Background */}
      {(backgroundColor || backgroundImage) && (
        <motion.div
          ref={backgroundRef}
          className="absolute inset-0 w-full h-full"
          style={{
            backgroundColor: backgroundColor || undefined,
            backgroundImage: backgroundImage ? `url(${backgroundImage})` : undefined,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: backgroundOpacity,
            filter: backgroundBlur ? `blur(${backgroundBlur}px)` : undefined,
            y: backgroundY,
          }}
        />
      )}

      {/* Content */}
      {type === "split" ? (
        <div className="relative w-full h-full flex" style={getContentStyles() as any}>
          <motion.div
            className="flex-1"
            style={{
              width: `${splitRatio * 100}%`,
              x: leftX,
            }}
          >
            {Array.isArray(children) && children[0] ? children[0] : null}
          </motion.div>
          <motion.div
            className="flex-1"
            style={{
              width: `${(1 - splitRatio) * 100}%`,
              x: rightX,
            }}
          >
            {Array.isArray(children) && children[1] ? children[1] : Array.isArray(children) ? null : children}
          </motion.div>
        </div>
      ) : (
        <motion.div
          ref={contentRef}
          className="relative w-full h-full"
          style={{
            ...(getContentStyles() as any),
            ...getAnimationProps(),
          }}
        >
          {children}
        </motion.div>
      )}
    </motion.section>
  )
}
