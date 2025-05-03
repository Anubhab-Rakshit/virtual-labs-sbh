"use client"

import { motion } from "framer-motion"

const technologies = {
  frontend: [
    { name: "React", icon: "⚛️" },
    { name: "Next.js", icon: "▲" },
    { name: "TypeScript", icon: "TS" },
    { name: "Tailwind CSS", icon: "🌊" },
    { name: "Framer Motion", icon: "🔄" },
  ],
  graphics: [
    { name: "Three.js", icon: "🔺" },
    { name: "WebGL", icon: "🌐" },
    { name: "GLSL Shaders", icon: "🎨" },
    { name: "Canvas API", icon: "🖌️" },
    { name: "SVG Animation", icon: "📊" },
  ],
  backend: [
    { name: "Node.js", icon: "🟢" },
    { name: "Vercel", icon: "▲" },
    { name: "PostgreSQL", icon: "🐘" },
    { name: "Redis", icon: "🔴" },
    { name: "GraphQL", icon: "⬢" },
  ],
  simulation: [
    { name: "Physics Engine", icon: "🔄" },
    { name: "Chemistry Modeling", icon: "⚗️" },
    { name: "Mathematical Solvers", icon: "🧮" },
    { name: "Data Visualization", icon: "📈" },
    { name: "Machine Learning", icon: "🧠" },
  ],
}

export default function TechStack() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {Object.entries(technologies).map(([category, techs]) => (
        <motion.div
          key={category}
          className="bg-black/30 backdrop-blur-sm rounded-xl border border-white/10 overflow-hidden"
          whileHover={{
            y: -5,
            boxShadow: "0 10px 30px -15px rgba(var(--primary-rgb), 0.3)",
            borderColor: "rgba(var(--primary-rgb), 0.3)",
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="p-6 border-b border-white/10">
            <h3 className="text-xl font-bold capitalize">
              {category === "frontend"
                ? "Frontend"
                : category === "backend"
                  ? "Backend & Infrastructure"
                  : category === "graphics"
                    ? "Graphics & Rendering"
                    : "Simulation & Modeling"}
            </h3>
          </div>

          <div className="p-6">
            <div className="grid grid-cols-1 gap-4">
              {techs.map((tech, index) => (
                <motion.div
                  key={tech.name}
                  className="flex items-center p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mr-4 text-lg">
                    {tech.icon}
                  </div>
                  <span>{tech.name}</span>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
