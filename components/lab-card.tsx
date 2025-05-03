"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { ArrowRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { Lab } from "@/types/lab"

interface LabCardProps {
  lab: Lab
  className?: string
}

export function LabCard({ lab, className }: LabCardProps) {
  const [isHovered, setIsHovered] = useState(false)

  // Get category color
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "physics":
        return "bg-blue-600"
      case "chemistry":
        return "bg-purple-600"
      case "mathematics":
        return "bg-green-600"
      case "computer":
        return "bg-cyan-600"
      case "biology":
        return "bg-rose-600"
      default:
        return "bg-gray-600"
    }
  }

  return (
    <Link
      href={`${lab.link}`}
      className={className}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      data-cursor-text="View"
    >
      <motion.div
        className="group relative h-full"
        animate={{
          scale: isHovered ? 0.98 : 1,
          y: isHovered ? -8 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 25 }}
      >
        <div className="overflow-hidden border border-white/10 bg-white/5 backdrop-blur-sm rounded-xl h-full relative">
          <div className="relative h-56 overflow-hidden">
            <Image
              src={lab.thumbnail || "/placeholder.svg"}
              alt={lab.title}
              fill
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

            <motion.div
              className="absolute top-3 right-3 z-10"
              animate={{
                y: isHovered ? 0 : 5,
                opacity: isHovered ? 1 : 0.8,
              }}
            >
              <Badge className={`capitalize ${getCategoryColor(lab.category)}`}>{lab.category}</Badge>
            </motion.div>
          </div>

          <div className="p-6 relative">
            <motion.h3
              className="text-2xl font-light text-white mb-2 tracking-tight"
              animate={{
                x: isHovered ? 8 : 0,
                color: isHovered ? "rgba(255, 255, 255, 1)" : "rgba(255, 255, 255, 0.9)",
              }}
              transition={{ duration: 0.3 }}
            >
              {lab.title}
            </motion.h3>

            <motion.p
              className="text-white/60 line-clamp-2 mb-6"
              animate={{
                x: isHovered ? 8 : 0,
                opacity: isHovered ? 0.8 : 0.6,
              }}
              transition={{ duration: 0.3, delay: 0.05 }}
            >
              {lab.description}
            </motion.p>

            <div className="flex justify-between items-center">
              <motion.span
                className="text-sm text-white/50"
                animate={{
                  x: isHovered ? 8 : 0,
                  opacity: isHovered ? 0.7 : 0.5,
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                {lab.difficulty} • {lab.duration}
              </motion.span>

              <motion.div
                className="relative overflow-hidden"
                animate={{
                  x: isHovered ? 0 : 10,
                  opacity: isHovered ? 1 : 0.7,
                }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <span className="bg-white/10 text-white hover:bg-white/20 rounded-md px-4 py-2 text-sm transition-colors flex items-center gap-2">
                  View Lab
                  <ArrowRight className="h-4 w-4" />
                </span>
              </motion.div>
            </div>

            {/* Hover effect - line from left */}
            <motion.div
              className="absolute left-0 top-0 h-full w-1 bg-white"
              initial={{ scaleY: 0, originY: 0 }}
              animate={{
                scaleY: isHovered ? 1 : 0,
                opacity: isHovered ? 0.5 : 0,
              }}
              transition={{ duration: 0.3 }}
            />
          </div>
        </div>
      </motion.div>
    </Link>
  )
}
