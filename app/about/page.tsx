import type { Metadata } from "next"
import Link from "next/link"

import { AnimatedText } from "@/components/animated-text"
import { ScrollAnimation } from "@/components/scroll-animation"
import { ScrollSection } from "@/components/scroll-section"
import { FuturisticButton } from "@/components/futuristic-button"
import { WebGLBackground } from "@/components/webgl-background"
import TeamMember from "@/components/team-member"
import AboutHero from "@/components/about-hero"
import MissionVision from "@/components/mission-vision"
import HistoryTimeline from "@/components/history-timeline"
import TechStack from "@/components/tech-stack"
import AboutParallax from "@/components/about-parallax"

export const metadata: Metadata = {
  title: "About | Virtual Labs Platform",
  description: "Learn about our mission to revolutionize education through interactive virtual laboratories",
}

export default function AboutPage() {
  return (
    <div className="relative min-h-screen">
      {/* Custom WebGL background with subtle animation */}
      <WebGLBackground
        color1="#050505"
        color2="#0a0a1a"
        noiseIntensity={0.1}
        noiseSpeed={0.1}
        displacementIntensity={0.2}
        className="fixed inset-0 z-0"
      />

      {/* Hero Section */}
      <AboutHero />

      {/* Mission & Vision */}
      <ScrollSection
        type="parallax"
        height="100vh"
        className="relative z-10 flex items-center justify-center px-4 md:px-8 lg:px-16"
        foregroundParallax
        speed={0.5}
      >
        <MissionVision />
      </ScrollSection>

      {/* About Content */}
      <ScrollSection
        type="normal"
        className="relative z-10 px-4 py-24 md:px-8 lg:px-16"
        backgroundColor="rgba(0,0,0,0.7)"
        backgroundOpacity={0.9}
      >
        <div className="container mx-auto">
          <ScrollAnimation animation="fade-in" className="mb-16">
            <AnimatedText
              text="Revolutionizing Education Through Technology"
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-8 text-center"
              animation="gradient"
              gradient="from-primary via-white to-secondary"
            />

            <div className="max-w-4xl mx-auto text-lg space-y-6 text-gray-300">
              <p>
                Virtual Labs is an innovative educational platform designed to transform how students interact with
                complex scientific concepts. By leveraging cutting-edge web technologies, we've created immersive,
                interactive laboratory experiences that transcend the limitations of traditional educational
                environments.
              </p>
              <p>
                Our platform bridges the gap between theoretical knowledge and practical application, providing students
                and educators with tools that make abstract concepts tangible and engaging. Whether exploring the
                quantum realm, visualizing complex mathematical functions, or conducting virtual chemistry experiments,
                our labs offer unprecedented access to educational experiences that would otherwise be constrained by
                physical resources, safety concerns, or scale limitations.
              </p>
            </div>
          </ScrollAnimation>

          {/* Parallax Image Section */}
          <AboutParallax />

          {/* History Timeline */}
          <ScrollAnimation animation="fade-in" className="my-24">
            <AnimatedText
              text="Our Journey"
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-center"
              animation="gradient"
              gradient="from-primary via-white to-secondary"
            />

            <HistoryTimeline />
          </ScrollAnimation>

          {/* Team Section */}
          <ScrollAnimation animation="fade-in" className="my-24">
            <AnimatedText
              text="Meet Our Team"
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-center"
              animation="gradient"
              gradient="from-primary via-white to-secondary"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <TeamMember
                name="Dr. Sarah Johnson"
                role="Founder & Lead Scientist"
                image="/avatars/sarah-johnson.png"
                description="Ph.D. in Quantum Physics with a passion for making complex scientific concepts accessible to everyone."
                socialLinks={{
                  twitter: "https://twitter.com",
                  linkedin: "https://linkedin.com",
                  github: "https://github.com",
                }}
              />
              <TeamMember
                name="Michael Chen"
                role="Chief Technology Officer"
                image="/avatars/michael-chen.png"
                description="Former Google engineer with expertise in WebGL, 3D visualization, and creating immersive digital experiences."
                socialLinks={{
                  twitter: "https://twitter.com",
                  linkedin: "https://linkedin.com",
                  github: "https://github.com",
                }}
              />
              <TeamMember
                name="Emily Rodriguez"
                role="Educational Director"
                image="/avatars/emily-rodriguez.png"
                description="Educational psychologist specializing in digital learning environments and cognitive development."
                socialLinks={{
                  twitter: "https://twitter.com",
                  linkedin: "https://linkedin.com",
                  github: "https://github.com",
                }}
              />
              <TeamMember
                name="James Wilson"
                role="Creative Director"
                image="/avatars/james-wilson.png"
                description="Award-winning designer with a background in UI/UX and interactive media for educational platforms."
                socialLinks={{
                  twitter: "https://twitter.com",
                  linkedin: "https://linkedin.com",
                  github: "https://github.com",
                }}
              />
              <TeamMember
                name="Maria Sanchez"
                role="Content Strategist"
                image="/avatars/maria-sanchez.png"
                description="Science communicator and former educator who ensures our content is both scientifically accurate and pedagogically sound."
                socialLinks={{
                  twitter: "https://twitter.com",
                  linkedin: "https://linkedin.com",
                  github: "https://github.com",
                }}
              />
              <TeamMember
                name="Join Our Team"
                role="Various Positions"
                image="/avatars/user-avatar.png"
                description="We're always looking for passionate individuals to join our mission of revolutionizing education."
                socialLinks={{}}
                isHiring={true}
              />
            </div>
          </ScrollAnimation>

          {/* Technology Stack */}
          <ScrollAnimation animation="fade-in" className="my-24">
            <AnimatedText
              text="Our Technology"
              as="h2"
              className="text-3xl md:text-4xl lg:text-5xl font-bold mb-16 text-center"
              animation="gradient"
              gradient="from-primary via-white to-secondary"
            />

            <TechStack />
          </ScrollAnimation>

          {/* Call to Action */}
          <ScrollAnimation animation="fade-in" className="my-24 text-center">
            <div className="max-w-3xl mx-auto bg-black/50 p-8 rounded-xl border border-primary/20 backdrop-blur-sm">
              <AnimatedText
                text="Ready to Experience the Future of Education?"
                as="h3"
                className="text-2xl md:text-3xl font-bold mb-6"
                animation="typewriter"
              />
              <p className="text-lg text-gray-300 mb-8">
                Join thousands of students and educators who are already transforming their learning experience with
                Virtual Labs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/labs">
                  <FuturisticButton size="lg" variant="primary">
                    Explore Our Labs
                  </FuturisticButton>
                </Link>
                <Link href="/auth/login">
                  <FuturisticButton size="lg" variant="outline">
                    Sign Up for Free
                  </FuturisticButton>
                </Link>
              </div>
            </div>
          </ScrollAnimation>
        </div>
      </ScrollSection>
    </div>
  )
}
