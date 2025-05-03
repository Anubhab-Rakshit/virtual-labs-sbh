import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Navbar from "@/components/navbar"
import { AuthProvider } from "@/components/auth-provider"
import ParticlesBackground from "@/components/particles-background"
import MagneticCursor from "@/components/magnetic-cursor"
import SmoothScroll from "@/lib/smooth-scroll"
import PageTransitions from "@/components/page-transitions"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
})

export const metadata: Metadata = {
  title: "Virtual Labs Platform",
  description: "Interactive educational platform with virtual labs for Physics, Chemistry, and Mathematics",
  generator: "Code Cuisine",
  applicationName: "Virtual Labs Platform",
  referrer: "origin-when-cross-origin",
  keywords: [
    "virtual labs",
    "interactive learning",
    "physics",
    "chemistry",
    "mathematics",
    "education",
    "STEM",
    "3D simulations",
    "neural networks",
    "data visualization",
    "machine learning",
    "AI",
    "augmented reality",
    "virtual reality",
    "immersive learning",
    "gamification",
    "student engagement",
    "educational technology",
    "online learning",
    "e-learning",
    "interactive simulations",
    "science education",
  ],
  icons: {
    icon: "./favicon.ico",
    shortcut: "./favicon.ico",
    apple: "./favicon.ico",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <AuthProvider>
            <SmoothScroll>
              <div className="relative min-h-screen bg-black">
                <ParticlesBackground />
                <MagneticCursor />
                <Navbar />
                <PageTransitions>
                  <main className="relative z-10">{children}</main>
                </PageTransitions>
              </div>
            </SmoothScroll>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
