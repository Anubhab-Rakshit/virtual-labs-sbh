"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import { ChevronDown } from "lucide-react"

export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const [isLanguageOpen, setIsLanguageOpen] = useState(false)
  const [selectedLanguage, setSelectedLanguage] = useState("English")
  const navRef = useRef<HTMLElement>(null)
  const languageRef = useRef<HTMLDivElement>(null)

  // Initialize language from localStorage on component mount
  useEffect(() => {
    // Only run in the browser, not during SSR
    if (typeof window !== 'undefined') {
      const savedLanguage = localStorage.getItem("selectedLanguage")
      if (savedLanguage) {
        setSelectedLanguage(savedLanguage)
        
        // Apply the saved language on initial load
        const langCode = getLanguageCode(savedLanguage)
        // Example: i18n.changeLanguage(langCode)
        console.log(`Initializing with saved language: ${savedLanguage} (${langCode})`)
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])


  // Close language dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (languageRef.current && !languageRef.current.contains(event.target as Node)) {
        setIsLanguageOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Labs", href: "/labs" },
    { name: "About", href: "/about" },
    { name: "Dashboard", href: "/student-dashboard" },
  ]

  const languages = [
    { name: "English", code: "en" },
    { name: "Bengali", code: "bn" },
    { name: "Hindi", code: "hi" },
    { name: "Tamil", code: "ta"}
  ]
  
  // Function to get language code from name
  const getLanguageCode = (name: string): string => {
    const language = languages.find(lang => lang.name === name)
    return language ? language.code : "en"
  }

  const handleLanguageChange = (language: string) => {
    setSelectedLanguage(language)
    setIsLanguageOpen(false)
    
    
    // Get language code
    const langCode = getLanguageCode(language)

    // Store language preference in localStorage
    localStorage.setItem("selectedLanguage", langCode);
    
    // Here you would implement actual language change logic
    // Example: i18n.changeLanguage(langCode)
    console.log(`Language changed to: ${language} (${langCode})`)

    setTimeout(() => {
      // Reload the page to apply the new language
      window.location.reload()
    }, 100)

  }

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500",
          isScrolled 
            ? "py-3 bg-black/80 backdrop-blur-md border-b border-white/10" 
            : "py-6 bg-transparent"
        )}
      >
        <div className="container px-4 mx-auto flex items-center justify-between">
          <Link
            href="/"
            className="text-white text-2xl font-extralight tracking-wider"
            onMouseEnter={() => setHovered("logo")}
            onMouseLeave={() => setHovered(null)}
            data-cursor-text="Home"
          >
            <motion.span
              animate={{
                opacity: hovered === "logo" ? 1 : 0.9,
                y: hovered === "logo" ? -2 : 0,
              }}
              transition={{ duration: 0.2 }}
            >
              VIRTUAL LABS
            </motion.span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative"
                onMouseEnter={() => setHovered(item.href)}
                onMouseLeave={() => setHovered(null)}
                data-cursor-text="View"
              >
                <motion.span
                  className={cn(
                    "text-white/70 hover:text-white transition-colors text-sm uppercase tracking-wider",
                    pathname === item.href && "text-white",
                  )}
                  animate={{
                    y: hovered === item.href ? -2 : 0,
                    opacity: hovered === item.href ? 1 : pathname === item.href ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                </motion.span>

                {/* Underline animation */}
                {pathname === item.href && (
                  <motion.div
                    className="absolute -bottom-1 left-0 w-full h-[1px] bg-white"
                    layoutId="navbar-underline"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}

                {/* Hover underline */}
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-[1px] bg-white"
                  initial={{ scaleX: 0, originX: "left" }}
                  animate={{ scaleX: hovered === item.href ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            ))}

            {/* Language Dropdown */}
            <div className="relative" ref={languageRef}>
              <button
                className="flex items-center gap-1 text-white/70 hover:text-white transition-colors text-sm uppercase tracking-wider"
                onClick={() => setIsLanguageOpen(!isLanguageOpen)}
                onMouseEnter={() => setHovered("language")}
                onMouseLeave={() => setHovered(null)}
                data-cursor-text="Language"
              >
                <motion.span
                  animate={{
                    y: hovered === "language" ? -2 : 0,
                    opacity: hovered === "language" ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {selectedLanguage}
                </motion.span>
                <motion.div
                  animate={{
                    rotateZ: isLanguageOpen ? 180 : 0,
                    y: hovered === "language" ? -2 : 0,
                    opacity: hovered === "language" ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  <ChevronDown size={14} />
                </motion.div>
              </button>

              {/* Hover underline */}
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-[1px] bg-white"
                initial={{ scaleX: 0, originX: "left" }}
                animate={{ scaleX: hovered === "language" ? 1 : 0 }}
                transition={{ duration: 0.2 }}
              />

              {/* Language dropdown menu */}
              <AnimatePresence>
                {isLanguageOpen && (
                  <motion.div
                    className="absolute top-full right-0 mt-2 bg-black/90 backdrop-blur-md border border-white/10 rounded-md overflow-hidden w-32"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                  >
                    {languages.map((language) => (
                      <button
                        key={language.code}
                        className={cn(
                          "block w-full text-left px-4 py-2 text-sm transition-colors",
                          selectedLanguage === language.name 
                            ? "text-white bg-white/10" 
                            : "text-white/70 hover:text-white hover:bg-white/5"
                        )}
                        onClick={() => handleLanguageChange(language.name)}
                      >
                        {language.name}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {session ? (
              <motion.button
                onClick={() => signOut()}
                className="text-white/70 hover:text-white transition-colors text-sm uppercase tracking-wider"
                onMouseEnter={() => setHovered("logout")}
                onMouseLeave={() => setHovered(null)}
                data-cursor-text="Logout"
                animate={{
                  y: hovered === "logout" ? -2 : 0,
                  opacity: hovered === "logout" ? 1 : 0.7,
                }}
                transition={{ duration: 0.2 }}
              >
                Logout
              </motion.button>
            ) : (
              <Link
                href="/auth/login"
                className="relative"
                onMouseEnter={() => setHovered("login")}
                onMouseLeave={() => setHovered(null)}
                data-cursor-text="Login"
              >
                <motion.span
                  className="text-white/70 hover:text-white transition-colors text-sm uppercase tracking-wider"
                  animate={{
                    y: hovered === "login" ? -2 : 0,
                    opacity: hovered === "login" ? 1 : 0.7,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  Login
                </motion.span>

                {/* Hover underline */}
                <motion.div
                  className="absolute -bottom-1 left-0 w-full h-[1px] bg-white"
                  initial={{ scaleX: 0, originX: "left" }}
                  animate={{ scaleX: hovered === "login" ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                />
              </Link>
            )}
          </div>

          <button
            className="md:hidden z-50 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
            data-cursor-text={isMenuOpen ? "Close" : "Menu"}
          >
            <div className="flex flex-col space-y-1.5">
              <motion.span
                className="w-6 h-px bg-white block"
                animate={{
                  rotate: isMenuOpen ? 45 : 0,
                  y: isMenuOpen ? 6 : 0,
                  backgroundColor: isMenuOpen ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.7)",
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-6 h-px bg-white block"
                animate={{
                  opacity: isMenuOpen ? 0 : 1,
                  backgroundColor: isMenuOpen ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.7)",
                }}
                transition={{ duration: 0.3 }}
              />
              <motion.span
                className="w-6 h-px bg-white block"
                animate={{
                  rotate: isMenuOpen ? -45 : 0,
                  y: isMenuOpen ? -6 : 0,
                  backgroundColor: isMenuOpen ? "rgb(255, 255, 255)" : "rgba(255, 255, 255, 0.7)",
                }}
                transition={{ duration: 0.3 }}
              />
            </div>
          </button>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 bg-black z-40 flex flex-col items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="flex flex-col items-center space-y-10">
              {navItems.map((item, index) => (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 + 0.1 }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "text-white/70 hover:text-white transition-colors text-3xl uppercase tracking-wider",
                      pathname === item.href && "text-white",
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}

              {/* Mobile Language Selector */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 + 0.1 }}
                className="flex flex-col items-center space-y-4"
              >
                <div className="text-white/70 text-xl uppercase tracking-wider">
                  Language
                </div>
                <div className="flex space-x-4">
                  {languages.map((language, index) => (
                    <button
                      key={language.code}
                      className={cn(
                        "text-white/70 hover:text-white transition-colors text-xl",
                        selectedLanguage === language.name && "text-white underline"
                      )}
                      onClick={() => handleLanguageChange(language.name)}
                    >
                      {language.name}
                    </button>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: (navItems.length + 1) * 0.1 + 0.1 }}
              >
                {session ? (
                  <button
                    onClick={() => signOut()}
                    className="text-white/70 hover:text-white transition-colors text-3xl uppercase tracking-wider"
                  >
                    Logout
                  </button>
                ) : (
                  <Link
                    href="/auth/login"
                    className="text-white/70 hover:text-white transition-colors text-3xl uppercase tracking-wider"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                )}
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background for Home page */}
      {pathname === "/" && (
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-black/90 to-blue-950/30" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(0,0,0,0)_0%,rgba(0,0,0,0.8)_80%)]" />
          <div className="absolute inset-0 bg-grid-white/[0.02] bg-[length:50px_50px]" />
        </div>
      )}
    </>
  )
}