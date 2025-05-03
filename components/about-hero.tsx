"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { AnimatedText } from "@/components/animated-text"
import { ScrollAnimation } from "@/components/scroll-animation"

export default function AboutHero() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  })

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.9])

  return (
    <div ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
      {/* Background grid with animated dots */}
      <div className="absolute inset-0 bg-grid opacity-20" />

      {/* Animated particles in background */}
      <div className="absolute inset-0">
        {Array.from({ length: 50 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/50"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 5,
            }}
          />
        ))}
      </div>

      {/* Hero content */}
      <motion.div className="relative z-10 text-center px-4" style={{ y, opacity, scale }}>
        <ScrollAnimation animation="fade-in" className="mb-6">
          <AnimatedText
            text="About Virtual Labs"
            as="h1"
            className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6"
            animation="gradient"
            gradient="from-primary via-white to-secondary"
            duration={1}
          />
        </ScrollAnimation>

        <ScrollAnimation animation="fade-in" delay={0.2}>
          <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Transforming education through immersive, interactive virtual laboratories that make complex concepts
            accessible to everyone.
          </p>
        </ScrollAnimation>

        {/* Decorative elements */}
        <motion.div
          className="absolute -z-10 w-[600px] h-[600px] rounded-full border border-primary/20 left-1/2 top-1/2"
          style={{ x: "-50%", y: "-50%" }}
          animate={{
            scale: [1, 1.05, 1],
            borderWidth: ["1px", "2px", "1px"],
          }}
          transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
        />

        <motion.div
          className="absolute -z-10 w-[400px] h-[400px] rounded-full border border-secondary/20 left-1/2 top-1/2"
          style={{ x: "-50%", y: "-50%" }}
          animate={{
            scale: [1.1, 1, 1.1],
            borderWidth: ["1px", "2px", "1px"],
          }}
          transition={{ duration: 6, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        />
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-10 left-1/2 transform -translate-x-1/2"
        animate={{ y: [0, 10, 0] }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
      >
        <div className="w-6 h-10 rounded-full border-2 border-white/30 flex justify-center p-1">
          <motion.div
            className="w-1 h-2 bg-white rounded-full"
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.5, repeat: Number.POSITIVE_INFINITY, delay: 0.5 }}
          />
        </div>
      </motion.div>
    </div>
  )
}
