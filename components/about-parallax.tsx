"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import Image from "next/image"

export default function AboutParallax() {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  })

  const y1 = useTransform(scrollYProgress, [0, 1], ["0%", "-20%"])
  const y2 = useTransform(scrollYProgress, [0, 1], ["0%", "-10%"])
  const y3 = useTransform(scrollYProgress, [0, 1], ["0%", "-30%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0, 1, 0])

  return (
    <div ref={ref} className="relative h-[50vh] md:h-[70vh] my-24 overflow-hidden">
      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity, y: y1 }}>
        <div className="relative w-full h-full">
          <Image src="/physics-lab.jpg" alt="Physics Virtual Lab" fill className="object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
        </div>
      </motion.div>

      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity, y: y2 }}>
        <div className="absolute top-1/2 left-1/4 transform -translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-primary/30 max-w-xs"
            whileHover={{ scale: 1.05, borderColor: "rgba(var(--primary-rgb), 0.5)" }}
          >
            <h3 className="text-xl font-bold mb-2 text-primary">Immersive Learning</h3>
            <p className="text-gray-300">
              Our virtual labs provide hands-on experience with complex scientific phenomena in a safe, controlled
              environment.
            </p>
          </motion.div>
        </div>
      </motion.div>

      <motion.div className="absolute inset-0 flex items-center justify-center" style={{ opacity, y: y3 }}>
        <div className="absolute top-1/3 right-1/4 transform translate-x-1/2 -translate-y-1/2 z-10">
          <motion.div
            className="bg-black/60 backdrop-blur-md p-6 rounded-xl border border-secondary/30 max-w-xs"
            whileHover={{ scale: 1.05, borderColor: "rgba(var(--secondary-rgb), 0.5)" }}
          >
            <h3 className="text-xl font-bold mb-2 text-secondary">Accessible Education</h3>
            <p className="text-gray-300">
              Breaking down barriers to quality education by making advanced laboratory experiences available to
              everyone, everywhere.
            </p>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
