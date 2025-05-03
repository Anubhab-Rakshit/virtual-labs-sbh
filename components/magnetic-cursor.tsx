"use client"

import { useEffect, useRef, useState } from "react"
import { motion, useMotionValue, useSpring } from "framer-motion"

export default function MagneticCursor() {
  const cursorRef = useRef<HTMLDivElement>(null)
  const cursorRingRef = useRef<HTMLDivElement>(null)
  const [cursorText, setCursorText] = useState("")
  const [cursorVariant, setCursorVariant] = useState("default")

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  const springConfig = { damping: 25, stiffness: 700 }
  const cursorX = useSpring(mouseX, springConfig)
  const cursorY = useSpring(mouseY, springConfig)

  const ringX = useSpring(mouseX, { ...springConfig, damping: 50, stiffness: 400 })
  const ringY = useSpring(mouseY, { ...springConfig, damping: 50, stiffness: 400 })

  useEffect(() => {
    const moveCursor = (e: MouseEvent) => {
      mouseX.set(e.clientX)
      mouseY.set(e.clientY)
    }

    const handleMouseEnter = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isLink =
        target.tagName.toLowerCase() === "a" ||
        target.tagName.toLowerCase() === "button" ||
        target.closest("a") ||
        target.closest("button") ||
        target.dataset.magnetic

      if (isLink) {
        setCursorVariant("hover")
        const text = target.getAttribute("data-cursor-text") || ""
        setCursorText(text)
      }
    }

    const handleMouseLeave = () => {
      setCursorVariant("default")
      setCursorText("")
    }

    document.addEventListener("mousemove", moveCursor)
    document.addEventListener("mouseover", handleMouseEnter)
    document.addEventListener("mouseout", handleMouseLeave)

    // Hide default cursor
    document.documentElement.classList.add("hide-cursor")

    return () => {
      document.removeEventListener("mousemove", moveCursor)
      document.removeEventListener("mouseover", handleMouseEnter)
      document.removeEventListener("mouseout", handleMouseLeave)
      document.documentElement.classList.remove("hide-cursor")
    }
  }, [mouseX, mouseY])

  const variants = {
    default: {
      width: 12,
      height: 12,
      backgroundColor: "rgba(255, 255, 255, 0.5)",
    },
    hover: {
      width: 40,
      height: 40,
      backgroundColor: "rgba(255, 255, 255, 0.1)",
      mixBlendMode: "difference" as const,
    },
    text: {
      width: 80,
      height: 80,
      backgroundColor: "rgba(255, 255, 255, 0.2)",
    },
  }

  const ringVariants = {
    default: {
      width: 32,
      height: 32,
      opacity: 0.4,
      borderWidth: "1px",
    },
    hover: {
      width: 80,
      height: 80,
      opacity: 0.2,
      borderWidth: "1px",
      backgroundColor: "rgba(255, 255, 255, 0.1)",
    },
  }

  return (
    <>
      <motion.div
        ref={cursorRef}
        className="fixed top-0 left-0 z-[9999] rounded-full pointer-events-none mix-blend-difference"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={variants}
        animate={cursorText ? "text" : cursorVariant}
        transition={{
          type: "spring",
          damping: 35,
          stiffness: 400,
          mass: 0.1,
        }}
      >
        {cursorText && (
          <span className="flex items-center justify-center w-full h-full text-white text-xs font-medium">
            {cursorText}
          </span>
        )}
      </motion.div>

      <motion.div
        ref={cursorRingRef}
        className="fixed top-0 left-0 z-[9998] rounded-full border border-white/30 pointer-events-none"
        style={{
          x: ringX,
          y: ringY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        variants={ringVariants}
        animate={cursorVariant}
        transition={{
          type: "spring",
          damping: 35,
          stiffness: 400,
          mass: 0.1,
        }}
      />
    </>
  )
}
