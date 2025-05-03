"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"

interface SocialLinks {
  twitter?: string
  linkedin?: string
  github?: string
  website?: string
}

interface TeamMemberProps {
  name: string
  role: string
  image: string
  description: string
  socialLinks: SocialLinks
  isHiring?: boolean
}

export default function TeamMember({ name, role, image, description, socialLinks, isHiring = false }: TeamMemberProps) {
  return (
    <motion.div
      className={`rounded-xl overflow-hidden ${
        isHiring ? "border-dashed border-2 border-primary/50" : "border border-white/10"
      } bg-black/30 backdrop-blur-sm`}
      whileHover={{ y: -10, boxShadow: "0 10px 30px -15px rgba(var(--primary-rgb), 0.3)" }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-64 overflow-hidden">
        {isHiring ? (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-primary/20 to-secondary/20">
            <motion.div
              className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center"
              animate={{
                scale: [1, 1.1, 1],
                opacity: [0.7, 1, 0.7],
              }}
              transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary"
              >
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
                <circle cx="9" cy="7" r="4"></circle>
                <line x1="19" y1="8" x2="19" y2="14"></line>
                <line x1="16" y1="11" x2="22" y2="11"></line>
              </svg>
            </motion.div>
          </div>
        ) : (
          <Image
            src={image || "/placeholder.svg"}
            alt={name}
            width={400}
            height={400}
            className="object-cover w-full h-full transition-transform duration-500 hover:scale-110"
          />
        )}
      </div>

      <div className="p-6">
        <h3 className="text-xl font-bold mb-1">{name}</h3>
        <p className={`text-sm mb-4 ${isHiring ? "text-primary" : "text-gray-400"}`}>{role}</p>
        <p className="text-gray-300 mb-6">{description}</p>

        {Object.keys(socialLinks).length > 0 && (
          <div className="flex space-x-4">
            {socialLinks.twitter && (
              <Link href={socialLinks.twitter} target="_blank" rel="noopener noreferrer">
                <motion.div
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
                  whileHover={{ backgroundColor: "rgba(29, 161, 242, 0.2)", y: -2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </motion.div>
              </Link>
            )}

            {socialLinks.linkedin && (
              <Link href={socialLinks.linkedin} target="_blank" rel="noopener noreferrer">
                <motion.div
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
                  whileHover={{ backgroundColor: "rgba(0, 119, 181, 0.2)", y: -2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </motion.div>
              </Link>
            )}

            {socialLinks.github && (
              <Link href={socialLinks.github} target="_blank" rel="noopener noreferrer">
                <motion.div
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)", y: -2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300"
                  >
                    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                  </svg>
                </motion.div>
              </Link>
            )}

            {socialLinks.website && (
              <Link href={socialLinks.website} target="_blank" rel="noopener noreferrer">
                <motion.div
                  className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center"
                  whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.1)", y: -2 }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="text-gray-300"
                  >
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="2" y1="12" x2="22" y2="12"></line>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                  </svg>
                </motion.div>
              </Link>
            )}
          </div>
        )}

        {isHiring && (
          <Link href="/careers">
            <motion.button
              className="mt-4 w-full py-2 px-4 rounded bg-primary/20 text-primary border border-primary/30 hover:bg-primary/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              View Open Positions
            </motion.button>
          </Link>
        )}
      </div>
    </motion.div>
  )
}
