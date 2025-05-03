"use client"

import { useEffect, useState, type ReactNode } from "react"
import { useInView } from "framer-motion"
import { useRef } from "react"

interface DeferredLoadProps {
  children: ReactNode
  placeholder?: ReactNode
  threshold?: number
}

export function DeferredLoad({
  children,
  placeholder = <div className="min-h-[200px] bg-black/20 animate-pulse rounded-lg" />,
  threshold = 0.1,
}: DeferredLoadProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, amount: threshold })

  useEffect(() => {
    if (isInView) {
      // Add a small delay to prioritize more important content
      const timer = setTimeout(() => {
        setIsLoaded(true)
      }, 100)

      return () => clearTimeout(timer)
    }
  }, [isInView])

  return <div ref={ref}>{isLoaded ? children : placeholder}</div>
}
