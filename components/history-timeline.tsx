"use client"

import { motion } from "framer-motion"
import { ScrollAnimation } from "@/components/scroll-animation"

const timelineEvents = [
  {
    year: "2019",
    title: "Concept Development",
    description:
      "The idea for Virtual Labs was born when our founder, Dr. Sarah Johnson, recognized the limitations of traditional laboratory education while teaching at MIT.",
  },
  {
    year: "2020",
    title: "Research & Prototyping",
    description:
      "Our team began researching and developing prototypes for interactive simulations, focusing on physics experiments that are difficult to perform in traditional settings.",
  },
  {
    year: "2021",
    title: "Alpha Launch",
    description:
      "We launched our alpha version with three physics labs, receiving enthusiastic feedback from early adopters in educational institutions across the country.",
  },
  {
    year: "2022",
    title: "Expansion to Chemistry & Mathematics",
    description:
      "Expanding our platform to include chemistry and mathematics labs, we doubled our user base and secured our first round of major funding.",
  },
  {
    year: "2023",
    title: "Global Reach & Partnerships",
    description:
      "Virtual Labs expanded internationally, forming partnerships with universities and educational organizations in over 30 countries.",
  },
  {
    year: "2024",
    title: "Next Generation Platform",
    description:
      "Today, we're launching our next-generation platform with enhanced interactivity, accessibility features, and a growing library of over 50 virtual laboratories.",
  },
]

export default function HistoryTimeline() {
  return (
    <div className="relative max-w-4xl mx-auto">
      {/* Vertical line */}
      <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-primary/50 via-white/30 to-secondary/50 transform md:translate-x-[-0.5px]" />

      {/* Timeline events */}
      {timelineEvents.map((event, index) => (
        <ScrollAnimation
          key={index}
          animation={index % 2 === 0 ? "slide-right" : "slide-left"}
          className="mb-16 relative"
        >
          <div
            className={`flex flex-col md:flex-row items-start ${
              index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
            }`}
          >
            {/* Year marker */}
            <div className="md:w-1/2 flex flex-row md:flex-col items-center mb-4 md:mb-0">
              <motion.div
                className="w-12 h-12 rounded-full bg-black flex items-center justify-center border-2 border-primary z-10 mr-4 md:mr-0"
                initial={{ scale: 0.8, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="text-primary font-bold">{event.year}</span>
              </motion.div>
              <div
                className={`h-px md:h-auto md:w-px flex-grow bg-gradient-to-r md:bg-gradient-to-b from-primary/50 to-transparent ${
                  index % 2 === 0 ? "md:mr-0" : "md:ml-0"
                }`}
              />
            </div>

            {/* Content */}
            <div className={`md:w-1/2 ${index % 2 === 0 ? "md:pl-8" : "md:pr-8"} flex-grow`}>
              <motion.div
                className="bg-black/30 backdrop-blur-sm p-6 rounded-lg border border-white/10"
                initial={{ y: 20, opacity: 0 }}
                whileInView={{ y: 0, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{
                  boxShadow: "0 8px 30px rgba(var(--primary-rgb), 0.2)",
                  borderColor: "rgba(var(--primary-rgb), 0.3)",
                }}
              >
                <h3 className="text-xl font-bold mb-2 text-white">{event.title}</h3>
                <p className="text-gray-300">{event.description}</p>
              </motion.div>
            </div>
          </div>
        </ScrollAnimation>
      ))}
    </div>
  )
}
