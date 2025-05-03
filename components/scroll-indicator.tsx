"use client"

import type React from "react"
import { motion, useScroll, useSpring, useTransform } from "framer-motion"
import { ChevronDown } from "lucide-react"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollIndicatorProps {
  className?: string
  text?: string
  icon?: React.ReactNode
  fadeOut?: boolean
}

export function ScrollIndicator({
  className,
  text = "Scroll to explore",
  icon = <ChevronDown className="h-5 w-5" />,
  fadeOut = true,
}: ScrollIndicatorProps) {
  const [isClient, setIsClient] = useState(false)
  const { scrollY } = useScroll()

  // Fade out the indicator as the user scrolls
  const opacity = useTransform(scrollY, [0, 200], fadeOut ? [1, 0] : [1, 1])

  const springConfig = { stiffness: 100, damping: 30, mass: 1 }
  const y = useSpring(useTransform(scrollY, [0, 100], [0, 20]), springConfig)

  // Animation for the icon
  const iconY = useSpring(useTransform(scrollY, [0, 100], [0, 10]), { ...springConfig, stiffness: 200, damping: 10 })

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) return null

  return (
    <motion.div
      className={cn("flex flex-col items-center justify-center text-center pointer-events-none", className)}
      style={{ opacity, y }}
    >
      {text && <span className="text-sm font-light text-muted-foreground mb-2">{text}</span>}
      <motion.div
        animate={{
          y: [0, 8, 0],
        }}
        transition={{
          duration: 1.5,
          repeat: Number.POSITIVE_INFINITY,
          repeatType: "loop",
          ease: "easeInOut",
        }}
        style={{ y: iconY }}
        className="text-primary/80"
      >
        {icon}
      </motion.div>
    </motion.div>
  )
}
