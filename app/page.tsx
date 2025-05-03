"use client"

import { useRef, useEffect, useState } from "react"
import Link from "next/link"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ArrowRight, Beaker, Atom, Calculator, Cpu, Dna, Play, ChevronDown } from "lucide-react"
import { MagneticButton } from "@/components/magnetic-button"
import { ParallaxSection } from "@/components/parallax-section"
import { RevealText } from "@/components/reveal-text"
import { ScrollIndicator } from "@/components/scroll-indicator"
import { InteractiveGraph } from "@/components/interactive-graph"
import { ScrollVideo } from "@/components/scroll-video"
import { ScrollTextReveal } from "@/components/scroll-text-reveal"
import { NeuralNetworkVisualization } from "@/components/neural-network-visualization"
import { CellExplorer } from "@/components/cell-explorer"
import { ParticleWave } from "@/components/particle-wave"
import { CodeAnimation } from "@/components/code-animation"
import { MoleculeViewer } from "@/components/molecule-viewer"
import { WaveSimulation } from "@/components/wave-simulation"
import { GlowingButton } from "@/components/glowing-button"
import { LabCard } from "@/components/lab-card"
import { EnhancedTestimonials } from "@/components/enhanced-testimonials"
import { getFeaturedLabs } from "@/lib/labs"
import type { Lab } from "@/types/lab"
import IconWithText from '@/components/IconWithText';


export default function Home() {
  const heroRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [featuredLabs, setFeaturedLabs] = useState<Lab[]>([])
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [scrollY, setScrollY] = useState(0)

  // Parallax effect for hero section
  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  })

  const heroY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5], [1, 0])
  const heroScale = useTransform(scrollYProgress, [0, 0.5], [1, 1.1])

  useEffect(() => {
    setIsLoaded(true)

    const fetchFeaturedLabs = async () => {
      const labs = await getFeaturedLabs()
      setFeaturedLabs(labs)
    }

    fetchFeaturedLabs()

    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Sample data for interactive graph
  const physicsData = [
    { x: 0, y: 0, label: "Start" },
    { x: 1, y: 2 },
    { x: 2, y: 4 },
    { x: 3, y: 6 },
    { x: 4, y: 8 },
    { x: 5, y: 10, label: "Peak" },
    { x: 6, y: 8 },
    { x: 7, y: 6 },
    { x: 8, y: 4 },
    { x: 9, y: 2 },
    { x: 10, y: 0, label: "End" },
  ]

  const chemistryData = [
    { x: 0, y: 7, label: "Initial pH" },
    { x: 1, y: 7 },
    { x: 2, y: 6.8 },
    { x: 3, y: 6.5 },
    { x: 4, y: 6 },
    { x: 5, y: 5 },
    { x: 6, y: 4 },
    { x: 7, y: 3, label: "Endpoint" },
    { x: 8, y: 2 },
    { x: 9, y: 1.5 },
    { x: 10, y: 1, label: "Final pH" },
  ]

  const categories = [
    { id: "physics", name: "Physics", icon: <Atom className="h-6 w-6" />, color: "from-blue-500 to-indigo-600" },
    { id: "chemistry", name: "Chemistry", icon: <Beaker className="h-6 w-6" />, color: "from-purple-500 to-pink-600" },
    {
      id: "mathematics",
      name: "Mathematics",
      icon: <Calculator className="h-6 w-6" />,
      color: "from-green-500 to-emerald-600",
    },
    { id: "computer", name: "Computer Science", icon: <Cpu className="h-6 w-6" />, color: "from-cyan-500 to-blue-600" },
    { id: "biology", name: "Biology", icon: <Dna className="h-6 w-6" />, color: "from-rose-500 to-red-600" },
  ]

  return (
    <>
      {/* Hero Section with Particle Wave Background */}
      <section
        ref={heroRef}
        className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden"
      >
        {/* Particle Wave Background */}
        <div className="absolute inset-0 z-0">
          <ParticleWave className="absolute inset-0" />
          <div className="absolute inset-0 bg-black/50 z-10" />
        </div>

        <motion.div
          className="container relative z-10 px-4 mx-auto"
          style={{ y: heroY, opacity: heroOpacity, scale: heroScale }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="max-w-4xl mx-auto text-center"
          >
           
            <ScrollTextReveal
              className="text-[clamp(3rem,15vw,15rem)] font-light tracking-tight leading-none text-white"
              startColor="#ffffff"
              endColor="rgba(255, 255, 255, 0.3)"
            >
             VIRTUAL LABS
            </ScrollTextReveal>

            <RevealText className="max-w-[700px] mx-auto text-xl text-white/70 mt-8" delay={0.4}>
              Explore interactive educational experiments in Physics, Chemistry, Mathematics, Computer Science, and
              Biology. Learn through immersive virtual experiences.
            </RevealText>

            <RevealText delay={0.6}>
              <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/labs">
                  <GlowingButton
                    className="px-8 py-4 text-lg font-medium"
                    glowColor="rgba(99, 102, 241, 0.5)"
                    cursorText="Explore"
                  >
                    <span className="flex items-center">
                      Explore Labs
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </span>
                  </GlowingButton>
                </Link>

                <Link href="#categories">
                  <MagneticButton
                    className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 px-8 py-4 text-lg"
                    magneticStrength={0.4}
                    cursorText="Discover"
                  >
                    <span className="flex items-center">
                      Discover
                      <ChevronDown className="ml-2 h-5 w-5" />
                    </span>
                  </MagneticButton>
                </Link>
              </div>
            </RevealText>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
          <ScrollIndicator />
        </div>
      </section>

      {/* Categories Showcase Section */}
      <section id="categories" className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid opacity-10"></div>
        <div className="container px-4 mx-auto">
          <ScrollTextReveal
            className="text-[clamp(2rem,8vw,8rem)] font-light tracking-tight text-white mb-16 text-center"
            startColor="#ffffff"
            endColor="rgba(255, 255, 255, 0.3)"
          >
            EXPLORE
          </ScrollTextReveal>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-16">
            {categories.map((category) => (
              <motion.button
                key={category.id}
                className={`relative overflow-hidden rounded-xl p-6 ${
                  activeCategory === category.id
                    ? `bg-gradient-to-br ${category.color}`
                    : "bg-white/5 hover:bg-white/10"
                } transition-all duration-300`}
                onClick={() => setActiveCategory(activeCategory === category.id ? null : category.id)}
                whileHover={{ y: -5 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex flex-col items-center text-center">
                  <div
                    className={`p-3 rounded-full mb-3 ${activeCategory === category.id ? "bg-white/20" : "bg-white/5"}`}
                  >
                    {category.icon}
                  </div>
                  <h3 className="text-lg font-medium text-white">{category.name}</h3>
                </div>
              </motion.button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            {activeCategory === "physics" && (
              <motion.div
                key="physics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <h3 className="text-3xl font-light text-white mb-6">Physics Labs</h3>
                  <p className="text-white/70 mb-6">
                    Explore the fundamental laws that govern our universe through interactive simulations. From
                    classical mechanics to quantum phenomena, our physics labs offer hands-on experience with complex
                    concepts.
                  </p>
                  <div className="space-y-4">
                    <FeatureItem
                      title="Wave Phenomena"
                      description="Visualize interference, diffraction, and resonance in real-time simulations."
                    />
                    <FeatureItem
                      title="Mechanics & Motion"
                      description="Experiment with forces, energy conservation, and simple machines."
                    />
                    <FeatureItem
                      title="Electromagnetism"
                      description="Explore electric fields, circuits, and magnetic interactions."
                    />
                  </div>
                  <Link href="/labs/category/physics">
                    <MagneticButton className="mt-8 border border-blue-500/30 bg-blue-500/10 text-blue-400 hover:bg-blue-500/20">
                      <span className="flex items-center">
                        Explore Physics Labs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </MagneticButton>
                  </Link>
                </div>
                <div className="h-[400px] rounded-xl overflow-hidden">
                  <WaveSimulation className="w-full h-full" />
                </div>
              </motion.div>
            )}

            {activeCategory === "chemistry" && (
              <motion.div
                key="chemistry"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <h3 className="text-3xl font-light text-white mb-6">Chemistry Labs</h3>
                  <p className="text-white/70 mb-6">
                    Conduct virtual experiments with chemical reactions, molecular structures, and analytical techniques
                    in a safe, interactive environment.
                  </p>
                  <div className="space-y-4">
                    <FeatureItem
                      title="Molecular Modeling"
                      description="Visualize and manipulate 3D molecular structures to understand bonding."
                    />
                    <FeatureItem
                      title="Titration & pH Analysis"
                      description="Perform virtual titrations and analyze acid-base reactions."
                    />
                    <FeatureItem
                      title="Organic Reactions"
                      description="Explore reaction mechanisms and synthesis pathways."
                    />
                  </div>
                  <Link href="/labs/category/chemistry">
                    <MagneticButton className="mt-8 border border-purple-500/30 bg-purple-500/10 text-purple-400 hover:bg-purple-500/20">
                      <span className="flex items-center">
                        Explore Chemistry Labs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </MagneticButton>
                  </Link>
                </div>
                <div className="h-[400px] rounded-xl overflow-hidden">
                  <MoleculeViewer className="w-full h-full" />
                </div>
              </motion.div>
            )}

            {activeCategory === "mathematics" && (
              <motion.div
                key="mathematics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <h3 className="text-3xl font-light text-white mb-6">Mathematics Labs</h3>
                  <p className="text-white/70 mb-6">
                    Visualize abstract mathematical concepts, explore geometric principles, and discover patterns
                    through interactive simulations.
                  </p>
                  <div className="space-y-4">
                    <FeatureItem
                      title="Fractal Exploration"
                      description="Dive into the infinite complexity of fractals and iterative systems."
                    />
                    <FeatureItem
                      title="3D Geometry"
                      description="Manipulate and transform geometric shapes in three dimensions."
                    />
                    <FeatureItem
                      title="Probability & Statistics"
                      description="Visualize statistical distributions and probability concepts."
                    />
                  </div>
                  <Link href="/labs/category/mathematics">
                    <MagneticButton className="mt-8 border border-green-500/30 bg-green-500/10 text-green-400 hover:bg-green-500/20">
                      <span className="flex items-center">
                        Explore Mathematics Labs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </MagneticButton>
                  </Link>
                </div>
                <div className="h-[400px] rounded-xl overflow-hidden bg-black">
                  <InteractiveGraph
                    data={[
                      { x: 0, y: 0 },
                      { x: 1, y: 1 },
                      { x: 2, y: 4 },
                      { x: 3, y: 9 },
                      { x: 4, y: 16 },
                      { x: 5, y: 25 },
                      { x: 6, y: 36 },
                      { x: 7, y: 49 },
                      { x: 8, y: 64 },
                      { x: 9, y: 81 },
                      { x: 10, y: 100 },
                    ]}
                    width={600}
                    height={400}
                    lineColor="#10b981"
                    pointColor="#10b981"
                    showGrid={true}
                    showAxes={true}
                    title="Quadratic Function"
                    xLabel="x"
                    yLabel="y = x²"
                    className="w-full h-full"
                  />
                </div>
              </motion.div>
            )}

            {activeCategory === "computer" && (
              <motion.div
                key="computer"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <h3 className="text-3xl font-light text-white mb-6">Computer Science Labs</h3>
                  <p className="text-white/70 mb-6">
                    Explore algorithms, data structures, and artificial intelligence through interactive visualizations
                    and simulations.
                  </p>
                  <div className="space-y-4">
                    <FeatureItem
                      title="Neural Networks"
                      description="Visualize how neural networks learn and make predictions."
                    />
                    <FeatureItem
                      title="Algorithm Visualization"
                      description="See sorting, searching, and graph algorithms in action."
                    />
                    <FeatureItem
                      title="Data Structures"
                      description="Interact with trees, graphs, and other complex data structures."
                    />
                  </div>
                  <Link href="/labs/category/computer">
                    <MagneticButton className="mt-8 border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/20">
                      <span className="flex items-center">
                        Explore Computer Science Labs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </MagneticButton>
                  </Link>
                </div>
                <div className="h-[400px] rounded-xl overflow-hidden bg-black/50 backdrop-blur-sm">
                  <div className="p-4 h-full">
                    <NeuralNetworkVisualization className="w-full h-full" />
                  </div>
                </div>
              </motion.div>
            )}

            {activeCategory === "biology" && (
              <motion.div
                key="biology"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center"
              >
                <div>
                  <h3 className="text-3xl font-light text-white mb-6">Biology Labs</h3>
                  <p className="text-white/70 mb-6">
                    Explore cellular structures, genetic processes, and ecological systems through interactive
                    visualizations and virtual experiments.
                  </p>
                  <div className="space-y-4">
                    <FeatureItem
                      title="Cell Biology"
                      description="Explore cellular structures and processes in 3D interactive models."
                    />
                    <FeatureItem
                      title="Genetics & DNA"
                      description="Visualize DNA replication, transcription, and translation."
                    />
                    <FeatureItem
                      title="Ecological Systems"
                      description="Simulate ecosystem dynamics and population interactions."
                    />
                  </div>
                  <Link href="/labs/category/biology">
                    <MagneticButton className="mt-8 border border-rose-500/30 bg-rose-500/10 text-rose-400 hover:bg-rose-500/20">
                      <span className="flex items-center">
                        Explore Biology Labs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </MagneticButton>
                  </Link>
                </div>
                <div className="h-[400px] rounded-xl overflow-hidden bg-black/50 backdrop-blur-sm">
                  <CellExplorer className="w-full h-full" />
                </div>
              </motion.div>
            )}

            {!activeCategory && (
              <motion.div
                key="all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="col-span-1 md:col-span-5"
              >
                <div className="text-center mb-12">
                  <h3 className="text-3xl font-light text-white mb-4">Select a category to explore</h3>
                  <p className="text-white/70 max-w-2xl mx-auto">
                    Click on any of the categories above to discover our interactive labs and simulations.
                  </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featuredLabs.map((lab) => (
                    <LabCard key={lab.id} lab={lab} />
                  ))}
                </div>
                <div className="text-center mt-12">
                  <Link href="/labs">
                    <GlowingButton className="px-8 py-3">
                      <span className="flex items-center">
                        View All Labs
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </span>
                    </GlowingButton>
                  </Link>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </section>

      {/* Interactive Visualization Section */}
      <ParallaxSection className="py-32 relative bg-black/50" speed={0.2} direction="up">
        <div className="container px-4 mx-auto">
          <ScrollTextReveal
            className="text-[clamp(2rem,5vw,5rem)] font-light tracking-tight text-white mb-16 text-center"
            startColor="#ffffff"
            endColor="rgba(255, 255, 255, 0.3)"
          >
            VISUALIZE DATA
          </ScrollTextReveal>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <div>
              <RevealText as="h3" className="text-2xl font-light text-white mb-6">
                Physics: Distance vs. Time
              </RevealText>

              <InteractiveGraph
                data={physicsData}
                width={600}
                height={400}
                lineColor="#3b82f6"
                pointColor="#3b82f6"
                showGrid={true}
                showAxes={true}
                title="Linear Motion"
                xLabel="Time (s)"
                yLabel="Distance (m)"
                className="mx-auto"
              />
            </div>

            <div>
              <RevealText as="h3" className="text-2xl font-light text-white mb-6">
                Chemistry: Titration Curve
              </RevealText>

              <InteractiveGraph
                data={chemistryData}
                width={600}
                height={400}
                lineColor="#ec4899"
                pointColor="#ec4899"
                showGrid={true}
                showAxes={true}
                title="Acid-Base Titration"
                xLabel="Volume (mL)"
                yLabel="pH"
                className="mx-auto"
              />
            </div>
          </div>
        </div>
      </ParallaxSection>

      {/* Computer Science Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-blue-900/10 to-black/0"></div>
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="order-2 lg:order-1">
              <ScrollTextReveal
                className="text-[clamp(2rem,5vw,5rem)] font-light tracking-tight text-white mb-6"
                startColor="#ffffff"
                endColor="rgba(255, 255, 255, 0.3)"
              >
                CODE COMES ALIVE
              </ScrollTextReveal>

              <RevealText className="text-xl text-white/70 mb-8">
                Experience the power of algorithms and data structures through interactive visualizations. Our computer
                science labs bring abstract concepts to life, making learning intuitive and engaging.
              </RevealText>

              <div className="space-y-4 mb-8">
                <FeatureItem
                  title="Neural Networks"
                  description="Visualize how neural networks process information and learn patterns."
                />
                <FeatureItem
                  title="Sorting Algorithms"
                  description="Compare the efficiency of different sorting algorithms in real-time."
                />
                <FeatureItem
                  title="Data Structures"
                  description="Interact with trees, graphs, and other complex data structures."
                />
              </div>

              <Link href="/labs/category/computer">
                <GlowingButton className="px-6 py-3" glowColor="rgba(6, 182, 212, 0.5)" cursorText="Explore">
                  <span className="flex items-center">
                    Explore Computer Science Labs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </GlowingButton>
              </Link>
            </div>

            <div className="order-1 lg:order-2 h-[500px] rounded-xl overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
              <CodeAnimation className="w-full h-full" />
            </div>
          </div>
        </div>
      </section>

      {/* Biology Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-green-900/10 to-black/0"></div>
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="h-[500px] rounded-xl overflow-hidden bg-black/30 backdrop-blur-sm border border-white/10">
              <CellExplorer className="w-full h-full" />
            </div>

            <div>
              <ScrollTextReveal
                className="text-[clamp(2rem,5vw,5rem)] font-light tracking-tight text-white mb-6"
                startColor="#ffffff"
                endColor="rgba(255, 255, 255, 0.3)"
              >
                EXPLORE LIFE
              </ScrollTextReveal>

              <RevealText className="text-xl text-white/70 mb-8">
                Journey inside cells, explore DNA, and understand complex biological systems through interactive 3D
                models and simulations. Our biology labs make microscopic worlds accessible.
              </RevealText>

              <div className="space-y-4 mb-8">
                <FeatureItem
                  title="Cell Explorer"
                  description="Examine cellular structures and processes in interactive 3D models."
                />
                <FeatureItem
                  title="DNA & Genetics"
                  description="Visualize DNA replication, transcription, and protein synthesis."
                />
                <FeatureItem
                  title="Virtual Dissection"
                  description="Perform virtual dissections with detailed anatomical models."
                />
              </div>

              <Link href="/labs/category/biology">
                <GlowingButton className="px-6 py-3" glowColor="rgba(220, 38, 38, 0.5)" cursorText="Explore">
                  <span className="flex items-center">
                    Explore Biology Labs
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </span>
                </GlowingButton>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <EnhancedTestimonials />

      {/* Video Section */}
      <section className="py-32 relative">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div>
              <ScrollTextReveal
                className="text-[clamp(2rem,5vw,5rem)] font-light tracking-tight text-white mb-8"
                startColor="#ffffff"
                endColor="rgba(255, 255, 255, 0.3)"
              >
                LEARN BY DOING
              </ScrollTextReveal>

              <RevealText className="text-xl text-white/70 mb-8">
                Our interactive labs allow you to experiment, make mistakes, and learn from them in a safe environment.
                Manipulate variables, observe outcomes, and develop a deeper understanding of scientific principles.
              </RevealText>

              <RevealText delay={0.2}>
                <Link href="/labs">
                  <MagneticButton
                    className="border border-white/20 bg-white/5 backdrop-blur-sm text-white hover:bg-white/10 px-8 py-3 mt-8"
                    magneticStrength={0.4}
                    cursorText="Watch"
                  >
                    <span className="flex items-center">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Demo
                    </span>
                  </MagneticButton>
                </Link>
              </RevealText>
            </div>

            <div className="relative h-[400px] rounded-lg overflow-hidden">
              <ScrollVideo
                src="/lab-demo.mp4"
                poster="/lab-demo-poster.jpeg"
                className="rounded-lg"
                threshold={[0.3, 0.8]}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Labs Section */}
      <ParallaxSection className="py-32 relative" speed={0.2} direction="up">
        <div className="container px-4 mx-auto">
          <ScrollTextReveal
            className="text-[clamp(2rem,8vw,8rem)] font-light tracking-tight text-white mb-16"
            startColor="#ffffff"
            endColor="rgba(255, 255, 255, 0.3)"
          >
            FEATURED
          </ScrollTextReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredLabs.map((lab) => (
              <LabCard key={lab.id} lab={lab} />
            ))}
          </div>
        </div>
      </ParallaxSection>

      {/* Call to Action */}
      <section className="py-32 relative">
        <div className="container px-4 mx-auto">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollTextReveal
              className="text-[clamp(2rem,8vw,8rem)] font-light tracking-tight text-white mb-8"
              startColor="#ffffff"
              endColor="rgba(255, 255, 255, 0.3)"
            >
              START NOW
            </ScrollTextReveal>

            <RevealText className="text-xl text-white/70 mb-12" delay={0.2}>
              Join thousands of students and educators who are using our virtual labs to enhance their learning
              experience.
            </RevealText>

            <RevealText delay={0.4}>
              <Link href="/labs">
                <GlowingButton className="px-8 py-4 text-lg" glowColor="rgba(99, 102, 241, 0.5)" cursorText="Start">
                  <span className="flex items-center">
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </span>
                </GlowingButton>
              </Link>
            </RevealText>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 relative border-t border-white/10">
        <div className="container px-4 mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-light text-white mb-4">Virtual Labs</h3>
              <p className="text-white/70">
                Interactive educational platform with virtual labs for Physics, Chemistry, Mathematics, Computer
                Science, and Biology.
              </p>
            </div>

            <div>
              <h4 className="text-lg font-light text-white mb-4">Labs</h4>
              <ul className="space-y-2">
                {categories.map((category) => (
                  <li key={category.id}>
                    <Link
                      href={`/labs/category/${category.id}`}
                      className="text-white/70 hover:text-white transition-colors"
                    >
                      {category.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-light text-white mb-4">Company</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/about" className="text-white/70 hover:text-white transition-colors">
                    About
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-white/70 hover:text-white transition-colors">
                    Contact
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-white/70 hover:text-white transition-colors">
                    Careers
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-lg font-light text-white mb-4">Legal</h4>
              <ul className="space-y-2">
                <li>
                  <Link href="/terms" className="text-white/70 hover:text-white transition-colors">
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-white/70 hover:text-white transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/cookies" className="text-white/70 hover:text-white transition-colors">
                    Cookie Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-16 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center">
            <p className="text-white/50 text-sm">© 2023 Virtual Labs. All rights reserved.</p>

            <div className="flex space-x-4 mt-4 md:mt-0">
              <Link href="#" className="text-white/70 hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </Link>

              <Link href="#" className="text-white/70 hover:text-white transition-colors">
                <span className="sr-only">GitHub</span>
                <svg className="h-6 w-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}

function FeatureItem({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex gap-3">
      <div className="flex-shrink-0 h-6 w-6 rounded-full bg-white/10 flex items-center justify-center mt-0.5">
        <div className="h-2 w-2 rounded-full bg-white"></div>
      </div>
      <div>
        <h4 className="text-white font-medium">{title}</h4>
        <p className="text-white/60 text-sm">{description}</p>
      </div>
    </div>
  )
}
