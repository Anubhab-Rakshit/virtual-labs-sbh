"use client"

import { motion } from "framer-motion"
import { ScrollAnimation } from "@/components/scroll-animation"
import { AnimatedText } from "@/components/animated-text"

export default function MissionVision() {
  return (
    <div className="container mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16">
        <ScrollAnimation animation="slide-right" className="h-full">
          <motion.div
            className="h-full p-8 rounded-xl border border-primary/20 backdrop-blur-sm bg-black/40 flex flex-col"
            whileHover={{ scale: 1.02, borderColor: "rgba(var(--primary-rgb), 0.4)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <AnimatedText
                text="Our Mission"
                as="h3"
                className="text-2xl md:text-3xl font-bold mb-4"
                animation="gradient"
                gradient="from-primary to-white"
              />
              <div className="w-16 h-1 bg-primary rounded mb-6"></div>
            </div>

            <p className="text-gray-300 mb-6 flex-grow">
              To democratize access to high-quality laboratory experiences by creating immersive, interactive virtual
              environments that transcend physical limitations and make complex scientific concepts accessible to
              learners worldwide, regardless of their resources or location.
            </p>

            <div className="mt-auto">
              <motion.div
                className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(var(--primary-rgb), 0.2)",
                    "0 0 0 10px rgba(var(--primary-rgb), 0)",
                    "0 0 0 0 rgba(var(--primary-rgb), 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </ScrollAnimation>

        <ScrollAnimation animation="slide-left" className="h-full">
          <motion.div
            className="h-full p-8 rounded-xl border border-secondary/20 backdrop-blur-sm bg-black/40 flex flex-col"
            whileHover={{ scale: 1.02, borderColor: "rgba(var(--secondary-rgb), 0.4)" }}
            transition={{ duration: 0.3 }}
          >
            <div className="mb-6">
              <AnimatedText
                text="Our Vision"
                as="h3"
                className="text-2xl md:text-3xl font-bold mb-4"
                animation="gradient"
                gradient="from-secondary to-white"
              />
              <div className="w-16 h-1 bg-secondary rounded mb-6"></div>
            </div>

            <p className="text-gray-300 mb-6 flex-grow">
              To pioneer a future where education is boundless, where every student can explore the frontiers of science
              through technology that adapts to their unique learning style. We envision a world where virtual
              laboratories are an integral part of education, inspiring the next generation of scientists, engineers,
              and innovators.
            </p>

            <div className="mt-auto">
              <motion.div
                className="w-16 h-16 rounded-full bg-secondary/10 flex items-center justify-center"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(var(--secondary-rgb), 0.2)",
                    "0 0 0 10px rgba(var(--secondary-rgb), 0)",
                    "0 0 0 0 rgba(var(--secondary-rgb), 0)",
                  ],
                }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-secondary"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="2" y1="12" x2="22" y2="12"></line>
                  <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                </svg>
              </motion.div>
            </div>
          </motion.div>
        </ScrollAnimation>
      </div>
    </div>
  )
}
