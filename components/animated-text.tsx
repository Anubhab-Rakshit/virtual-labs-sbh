"use client"

import type React from "react"

import { useRef, useEffect, useState, type ReactNode } from "react"
import { motion, useInView, useAnimation, type Variants } from "framer-motion"
import { cn } from "@/lib/utils"

type AnimationType =
  | "fade"
  | "slide-up"
  | "slide-down"
  | "slide-left"
  | "slide-right"
  | "reveal"
  | "typewriter"
  | "wave"
  | "bounce"
  | "glitch"
  | "gradient"
  | "blur"
  | "split-words"
  | "split-chars"

interface AnimatedTextProps {
  text: string | ReactNode
  as?: React.ElementType
  animation?: AnimationType
  delay?: number
  duration?: number
  staggerChildren?: number
  className?: string
  once?: boolean
  threshold?: number
  color?: string
  gradient?: string
  repeat?: boolean
  repeatDelay?: number
}

export function AnimatedText({
  text,
  as: Component = "div",
  animation = "fade",
  delay = 0,
  duration = 0.5,
  staggerChildren = 0.03,
  className = "",
  once = true,
  threshold = 0.1,
  color = "",
  gradient = "from-primary to-secondary",
  repeat = false,
  repeatDelay = 5,
}: AnimatedTextProps) {
  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, { once, amount: threshold })
  const controls = useAnimation()
  const [isClient, setIsClient] = useState(false)

  // Split text into words and characters for certain animations
  const words = typeof text === "string" ? text.split(" ") : []
  const characters = typeof text === "string" ? text.split("") : []

  useEffect(() => {
    setIsClient(true)
  }, [])

  useEffect(() => {
    if (isInView) {
      controls.start("visible")
    } else if (!once) {
      controls.start("hidden")
    }
  }, [isInView, controls, once])

  // Set up repeating animation if needed
  useEffect(() => {
    if (repeat && isInView) {
      const interval = setInterval(() => {
        controls.start("hidden").then(() => {
          setTimeout(() => {
            controls.start("visible")
          }, 100)
        })
      }, repeatDelay * 1000)

      return () => clearInterval(interval)
    }
  }, [repeat, repeatDelay, controls, isInView])

  // Define animation variants
  const getVariants = (): Variants => {
    switch (animation) {
      case "fade":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration,
              delay,
            },
          },
        }
      case "slide-up":
        return {
          hidden: { opacity: 0, y: 50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
            },
          },
        }
      case "slide-down":
        return {
          hidden: { opacity: 0, y: -50 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
            },
          },
        }
      case "slide-left":
        return {
          hidden: { opacity: 0, x: 50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
              delay,
            },
          },
        }
      case "slide-right":
        return {
          hidden: { opacity: 0, x: -50 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
              delay,
            },
          },
        }
      case "reveal":
        return {
          hidden: { clipPath: "inset(0 100% 0 0)" },
          visible: {
            clipPath: "inset(0 0% 0 0)",
            transition: {
              duration,
              delay,
              ease: "easeInOut",
            },
          },
        }
      case "typewriter":
        return {
          hidden: { width: 0, opacity: 0 },
          visible: {
            width: "100%",
            opacity: 1,
            transition: {
              width: {
                duration: duration * 2,
                delay,
                ease: "linear",
              },
              opacity: {
                duration: 0.1,
                delay,
              },
            },
          },
        }
      case "wave":
        return {
          hidden: { opacity: 0, y: 0 },
          visible: {
            opacity: 1,
            y: 0,
            transition: {
              duration,
              delay,
            },
          },
        }
      case "bounce":
        return {
          hidden: { opacity: 0, scale: 0.8, y: 20 },
          visible: {
            opacity: 1,
            scale: 1,
            y: 0,
            transition: {
              type: "spring",
              stiffness: 300,
              damping: 10,
              delay,
            },
          },
        }
      case "glitch":
        return {
          hidden: { opacity: 0, x: 0 },
          visible: {
            opacity: 1,
            x: 0,
            transition: {
              duration,
              delay,
            },
          },
        }
      case "blur":
        return {
          hidden: { opacity: 0, filter: "blur(20px)" },
          visible: {
            opacity: 1,
            filter: "blur(0px)",
            transition: {
              duration,
              delay,
            },
          },
        }
      case "gradient":
      case "split-words":
      case "split-chars":
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration,
              delay,
            },
          },
        }
      default:
        return {
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: {
              duration,
              delay,
            },
          },
        }
    }
  }

  const containerVariants = getVariants()

  // Define variants for staggered children
  const childVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration * 0.8,
      },
    },
  }

  // For wave animation, we need special child variants
  const waveChildVariants: Variants = {
    hidden: { opacity: 0, y: 0 },
    visible: (i: number) => ({
      opacity: 1,
      y: [0, -15, 0],
      transition: {
        delay: delay + i * staggerChildren,
        duration: duration,
        repeat: repeat ? Number.POSITIVE_INFINITY : 0,
        repeatDelay: repeat ? 0.25 : 0,
      },
    }),
  }

  // For glitch animation, we need special child variants
  const glitchChildVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (i: number) => ({
      opacity: 1,
      x: [0, -2, 3, -1, 0],
      y: [0, 1, -2, 1, 0],
      filter: ["blur(0px)", "blur(1px)", "blur(0px)", "blur(2px)", "blur(0px)"],
      transition: {
        delay: delay + i * staggerChildren,
        duration: duration,
        times: [0, 0.2, 0.4, 0.6, 1],
        repeat: repeat ? Number.POSITIVE_INFINITY : 0,
        repeatDelay: repeat ? 1 : 0,
      },
    }),
  }

  // Render different animations
  if (!isClient) {
    return <Component className={className}>{text}</Component>
  }

  // For split animations (words or characters)
  if (animation === "split-words" && typeof text === "string") {
    return (
      <Component ref={ref} className={cn("inline-block", className)}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren,
                delayChildren: delay,
              },
            },
          }}
          aria-label={text}
        >
          {words.map((word, i) => (
            <motion.span
              key={i}
              className="inline-block whitespace-nowrap"
              variants={childVariants}
              style={{ marginRight: "0.25em" }}
            >
              {word}
            </motion.span>
          ))}
        </motion.div>
      </Component>
    )
  }

  if (animation === "split-chars" && typeof text === "string") {
    return (
      <Component ref={ref} className={cn("inline-block", className)}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren,
                delayChildren: delay,
              },
            },
          }}
          aria-label={text}
        >
          {characters.map((char, i) => (
            <motion.span
              key={i}
              className="inline-block"
              variants={char === " " ? { hidden: {}, visible: {} } : childVariants}
            >
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
      </Component>
    )
  }

  if (animation === "wave" && typeof text === "string") {
    return (
      <Component ref={ref} className={cn("inline-block", className)}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren,
                delayChildren: delay,
              },
            },
          }}
          aria-label={text}
        >
          {characters.map((char, i) => (
            <motion.span key={i} className="inline-block" custom={i} variants={waveChildVariants}>
              {char === " " ? "\u00A0" : char}
            </motion.span>
          ))}
        </motion.div>
      </Component>
    )
  }

  if (animation === "glitch" && typeof text === "string") {
    return (
      <Component ref={ref} className={cn("inline-block", className)}>
        <motion.div
          initial="hidden"
          animate={controls}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: staggerChildren / 2,
                delayChildren: delay,
              },
            },
          }}
          aria-label={text}
        >
          {characters.map((char, i) => (
            <motion.span key={i} className="inline-block relative" custom={i} variants={glitchChildVariants}>
              {char === " " ? "\u00A0" : char}
              {char !== " " && (
                <>
                  <span
                    className="absolute left-0 top-0 opacity-0 text-red-500 mix-blend-screen"
                    style={{ clipPath: "inset(0 0 50% 0)" }}
                  >
                    {char}
                  </span>
                  <span
                    className="absolute left-0 top-0 opacity-0 text-blue-500 mix-blend-screen"
                    style={{ clipPath: "inset(50% 0 0 0)" }}
                  >
                    {char}
                  </span>
                </>
              )}
            </motion.span>
          ))}
        </motion.div>
      </Component>
    )
  }

  if (animation === "gradient" && typeof text === "string") {
    return (
      <Component ref={ref} className={className}>
        <motion.div
          ref={ref}
          initial="hidden"
          animate={controls}
          variants={containerVariants}
          className={cn("bg-gradient-to-r bg-clip-text text-transparent animate-gradient bg-300%", gradient)}
          style={{ backgroundSize: "300%" }}
        >
          {text}
        </motion.div>
      </Component>
    )
  }

  if (animation === "typewriter" && typeof text === "string") {
    return (
      <Component ref={ref} className={cn("inline-block overflow-hidden whitespace-nowrap", className)}>
        <motion.div initial="hidden" animate={controls} variants={containerVariants} className="inline-block">
          {text}
        </motion.div>
      </Component>
    )
  }

  // Default animation
  return (
    <Component ref={ref} className={className}>
      <motion.div
        initial="hidden"
        animate={controls}
        variants={containerVariants}
        style={{ color: color || undefined }}
      >
        {text}
      </motion.div>
    </Component>
  )
}
