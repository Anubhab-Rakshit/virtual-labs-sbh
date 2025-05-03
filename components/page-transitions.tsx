"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { usePathname } from "next/navigation"

export default function PageTransitions({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const [isAnimating, setIsAnimating] = useState(false)
  const [displayChildren, setDisplayChildren] = useState(children)
  const previousPathRef = useRef<string>("")

  useEffect(() => {
    if (previousPathRef.current !== pathname) {
      setIsAnimating(true)
      previousPathRef.current = pathname

      // Update displayed children after animation out completes
      const timer = setTimeout(() => {
        setDisplayChildren(children)
      }, 600) // Match exit animation duration

      return () => clearTimeout(timer)
    } else {
      setDisplayChildren(children)
    }
  }, [pathname, children])

  return (
    <AnimatePresence mode="wait" onExitComplete={() => setIsAnimating(false)}>
      <motion.div
        key={pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="page-transition-container"
      >
        {displayChildren}
      </motion.div>
    </AnimatePresence>
  )
}
