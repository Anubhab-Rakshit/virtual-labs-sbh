"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { motion, useInView, useAnimation } from "framer-motion"
import { cn } from "@/lib/utils"

interface RevealTextProps {
  children: React.ReactNode
  className?: string
  delay?: number
  duration?: number
  once?: boolean
  threshold?: number
  direction?: "up" | "down" | "left" | "right"
  distance?: number
  staggerChildren?: boolean
  staggerDelay?: number
  as?: React.ElementType
}

export function RevealText({
  children,
  className,
  delay = 0,
  duration = 0.5,
  once = true,
  threshold = 0.1,
  direction = "up",
  distance = 30,
  staggerChildren = false,
  staggerDelay = 0.05,
  as: Component = "div",
}: RevealTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const controls = useAnimation()
  const [wordCount, setWordCount] = useState(0)

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else if (!once) {
      controls.start("hidden")
    }
  }, [isInView, controls, once])

  useEffect(() => {
    if (staggerChildren && ref.current) {
      // Count words for staggered animation
      const text = ref.current.textContent || ""
      const words = text.trim().split(/\s+/)
      setWordCount(words.length)
    }
  }, [staggerChildren, children])

  // Set initial and animate variants based on direction
  const getVariants = () => {
    let initial = {}

    switch (direction) {
      case "up":
        initial = { y: distance, opacity: 0 }
        return {
          hidden: initial,
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: staggerChildren ? staggerDelay : 0,
            },
          },
        }
      case "down":
        initial = { y: -distance, opacity: 0 }
        return {
          hidden: initial,
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: staggerChildren ? staggerDelay : 0,
            },
          },
        }
      case "left":
        initial = { x: distance, opacity: 0 }
        return {
          hidden: initial,
          visible: {
            x: 0,
            opacity: 1,
            transition: {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: staggerChildren ? staggerDelay : 0,
            },
          },
        }
      case "right":
        initial = { x: -distance, opacity: 0 }
        return {
          hidden: initial,
          visible: {
            x: 0,
            opacity: 1,
            transition: {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: staggerChildren ? staggerDelay : 0,
            },
          },
        }
      default:
        initial = { y: distance, opacity: 0 }
        return {
          hidden: initial,
          visible: {
            y: 0,
            opacity: 1,
            transition: {
              duration,
              delay,
              ease: [0.22, 1, 0.36, 1],
              staggerChildren: staggerChildren ? staggerDelay : 0,
            },
          },
        }
    }
  }

  const variants = getVariants()
  const childVariants = getVariants()

  // If staggering children, split text into words
  if (staggerChildren && typeof children === "string") {
    const words = children.split(" ")
    return (
      <Component ref={ref} className={cn("inline-block", className)}>
        <motion.div initial="hidden" animate={controls} variants={variants} className="inline-flex flex-wrap">
          {words.map((word, i) => (
            <motion.span key={i} className="inline-block mr-[0.25em] last:mr-0" variants={childVariants}>
              {word}
            </motion.span>
          ))}
        </motion.div>
      </Component>
    )
  }

  // Regular animation without staggering
  return (
    <Component ref={ref} className={className}>
      <motion.div initial="hidden" animate={controls} variants={variants}>
        {children}
      </motion.div>
    </Component>
  )
}
