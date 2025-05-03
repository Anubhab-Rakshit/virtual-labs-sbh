"use client"

import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence, useInView } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    text: "The virtual labs platform has transformed how I teach physics. Students are more engaged and understand complex concepts better.",
    author: "Dr. Sarah Johnson",
    role: "Physics Professor",
    image: "/avatars/sarah-johnson.png",
  },
  {
    text: "Being able to visualize chemical reactions in 3D has helped me grasp concepts I struggled with for years.",
    author: "Michael Chen",
    role: "Chemistry Student",
    image: "/avatars/michael-chen.png",
  },
  {
    text: "The interactive nature of these labs makes learning mathematics exciting rather than intimidating.",
    author: "Emily Rodriguez",
    role: "High School Teacher",
    image: "/avatars/emily-rodriguez.png",
  },
  {
    text: "The neural network visualizations have completely changed how I understand AI concepts. It's like seeing the math come alive.",
    author: "Dr. James Wilson",
    role: "Computer Science Professor",
    image: "/avatars/james-wilson.png",
  },
  {
    text: "As a biology teacher, the 3D cell models have been revolutionary for helping students understand cellular processes.",
    author: "Maria Sanchez",
    role: "Biology Instructor",
    image: "/avatars/maria-sanchez.png",
  },
]

export function EnhancedTestimonials() {
  const [activeIndex, setActiveIndex] = useState(0)
  const containerRef = useRef(null)
  const isInView = useInView(containerRef, { once: false, amount: 0.3 })

  useEffect(() => {
    if (!isInView) return

    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % testimonials.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [isInView])

  return (
    <section className="py-32 relative overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05),transparent_70%)]"></div>
      <div className="absolute inset-0 bg-grid opacity-5"></div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={isInView ? { opacity: 1 } : { opacity: 0 }}
        transition={{ duration: 1 }}
        className="container px-4 mx-auto"
      >
        <h2 className="text-[clamp(2rem,8vw,8rem)] font-light tracking-tight text-white mb-16 text-center">
          WHAT PEOPLE SAY
        </h2>

        <div className="max-w-6xl mx-auto">
          <div className="relative h-[300px]">
            <AnimatePresence mode="wait">
              {testimonials.map(
                (testimonial, index) =>
                  index === activeIndex && (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.5 }}
                      className="absolute inset-0 flex items-center justify-center"
                    >
                      <div className="bg-black/30 backdrop-blur-sm border border-white/10 rounded-xl p-8 max-w-2xl mx-auto">
                        <div className="flex flex-col items-center text-center">
                          <Quote className="h-10 w-10 text-white/30 mb-4" />
                          <p className="text-xl md:text-2xl text-white/90 italic mb-6">"{testimonial.text}"</p>
                          <div className="mt-4">
                            <p className="font-medium text-white text-lg">{testimonial.author}</p>
                            <p className="text-white/60">{testimonial.role}</p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ),
              )}
            </AnimatePresence>
          </div>

          <div className="flex justify-center mt-8 gap-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setActiveIndex(index)}
                className={`w-3 h-3 rounded-full transition-all ${
                  index === activeIndex ? "bg-white w-6" : "bg-white/30"
                }`}
                aria-label={`View testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </motion.div>
    </section>
  )
}
