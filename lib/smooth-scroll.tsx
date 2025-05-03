"use client"

import type React from "react"
import Lenis from "@studio-freight/lenis"
import { useEffect, useState } from "react"
import { usePathname } from "next/navigation"

interface SmoothScrollProps {
  children: React.ReactNode
  options?: {
    lerp?: number
    duration?: number
    smoothWheel?: boolean
    smoothTouch?: boolean
    wheelMultiplier?: number
    touchMultiplier?: number
  }
}

export default function SmoothScroll({
  children,
  options = {
    lerp: 0.1,
    duration: 1.2,
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 2,
  },
}: SmoothScrollProps) {
  const pathname = usePathname()
  const [lenis, setLenis] = useState<Lenis | null>(null)
  const [isReady, setIsReady] = useState(false)

  // Initialize lenis
  useEffect(() => {
    const lenisInstance = new Lenis({
      duration: options.duration,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: "vertical",
      gestureDirection: "vertical",
      smooth: options.smoothWheel,
      smoothTouch: options.smoothTouch,
      touchMultiplier: options.touchMultiplier,
      wheelMultiplier: options.wheelMultiplier,
    })

    const raf = (time: number) => {
      lenisInstance.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)
    setLenis(lenisInstance)
    setIsReady(true)

    return () => {
      cancelAnimationFrame(rafId)
      lenisInstance.destroy()
      setLenis(null)
    }
  }, [
    options.duration,
    options.lerp,
    options.smoothTouch,
    options.smoothWheel,
    options.touchMultiplier,
    options.wheelMultiplier,
  ])

  // Handle route changes
  useEffect(() => {
    if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true })
    }
  }, [pathname, lenis])

  return <div className={`transition-opacity duration-500 ${isReady ? "opacity-100" : "opacity-0"}`}>{children}</div>
}
