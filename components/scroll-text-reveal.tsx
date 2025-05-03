"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScrollTextRevealProps {
  children: string
  className?: string
  startColor?: string
  endColor?: string
  as?: React.ElementType
  fontSize?: string
  fontWeight?: string
  letterSpacing?: string
  lineHeight?: string
  threshold?: [number, number]
  staggerDelay?: number
}

export function ScrollTextReveal({
  children,
  className,
  startColor = "#ffffff",
  endColor = "rgba(255, 255, 255, 0.3)",
  as: Component = "h2",
  fontSize = "clamp(2rem, 8vw, 8rem)",
  fontWeight = "200",
  letterSpacing = "-0.02em",
  lineHeight = "0.9",
  threshold = [0, 0.5],
  staggerDelay = 0.01,
}: ScrollTextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const characters = children.split("")
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  useEffect(() => {
    const unsubscribe = scrollYProgress.onChange((value) => {
      setProgress(Math.max(0, Math.min(1, (value - threshold[0]) / (threshold[1] - threshold[0]))))
    })

    return () => unsubscribe()
  }, [scrollYProgress, threshold])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current)
      }
    }
  }, [])

  return (
    <Component
      ref={ref}
      className={cn("flex flex-wrap overflow-hidden", className)}
      style={{
        fontSize,
        fontWeight,
        letterSpacing,
        lineHeight,
      }}
    >
      {characters.map((char, index) => {
        const charProgress = Math.max(0, Math.min(1, progress - index * staggerDelay))
        const colorValue = charProgress

        // Calculate color based on progress
        const color = `rgba(255, 255, 255, ${1 - colorValue * 0.7})`

        return (
          <motion.span
            key={`${index}-${char}`}
            style={{
              color,
              display: "inline-block",
              width: char === " " ? "0.3em" : "auto",
              transform: isVisible ? "translateY(0)" : "translateY(100%)",
              opacity: isVisible ? 1 : 0,
              transition: `transform 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.02}s, opacity 0.5s cubic-bezier(0.22, 1, 0.36, 1) ${index * 0.02}s`,
            }}
          >
            {char}
          </motion.span>
        )
      })}
    </Component>
  )
}
