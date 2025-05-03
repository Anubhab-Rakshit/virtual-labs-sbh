"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { motion, useScroll, useTransform, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"

interface TextRevealProps {
  children: string
  className?: string
  startColor?: string
  endColor?: string
  threshold?: [number, number]
  fontSize?: string
  fontWeight?: string
  delay?: number
  triggerOnce?: boolean
  as?: React.ElementType
}

export function TextReveal({
  children,
  className,
  startColor = "rgba(255, 255, 255, 1)",
  endColor = "rgba(255, 255, 255, 0.3)",
  threshold = [0, 0.5],
  fontSize = "clamp(2rem, 8vw, 8rem)",
  fontWeight = "200",
  delay = 0,
  triggerOnce = true,
  as: Component = "h2",
}: TextRevealProps) {
  const ref = useRef<HTMLDivElement>(null)
  const characters = children.split("")
  const [isInView, setIsInView] = useState(false)

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const colorProgress = useTransform(scrollYProgress, threshold, [0, 1])

  const smoothProgress = useSpring(colorProgress, {
    stiffness: 100,
    damping: 30,
  })

  const textColor = useTransform(smoothProgress, [0, 1], [startColor, endColor])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          if (triggerOnce) observer.disconnect()
        } else if (!triggerOnce) {
          setIsInView(false)
        }
      },
      { threshold: 0.1 },
    )

    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [triggerOnce])

  return (
    <Component ref={ref} className={cn("flex flex-wrap relative", className)}>
      {characters.map((char, index) => {
        const visibilityDelay = isInView ? delay + index * 0.05 : 0

        return (
          <motion.span
            key={`${index}-${char}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: isInView ? 1 : 0, y: isInView ? 0 : 20 }}
            transition={{
              duration: 0.5,
              delay: visibilityDelay,
              ease: [0.22, 1, 0.36, 1],
            }}
            style={{
              color: textColor,
              fontSize,
              fontWeight,
              display: "inline-block",
              width: char === " " ? "0.5em" : "auto",
              whiteSpace: "pre",
            }}
          >
            {char}
          </motion.span>
        )
      })}
    </Component>
  )
}
