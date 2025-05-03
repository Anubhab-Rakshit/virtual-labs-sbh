"use client"

import { useState, useEffect, useRef } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { useSession, signOut } from "next-auth/react"
import { cn } from "@/lib/utils"
import IconWithText from '@/components/IconWithText';
export default function Navbar() {
  const pathname = usePathname()
  const { data: session } = useSession()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [hovered, setHovered] = useState<string | null>(null)
  const navRef = useRef<HTMLElement>(null)

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

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Labs", href: "/labs" },
    { name: "About", href: "/about" },
    {name : "Dashboard", href: "/student-dashboard"},
  ]

  return (
    <>
      <header
        ref={navRef}
        className={cn(
          "fixed top-0 left-0 w-full z-50 transition-all duration-500",
          isScrolled ? "py-3 bg-black/80 backdrop-blur-md border-b border-white/10" : "py-6 bg-transparent",
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
            <section className="">
                      <IconWithText text="অন্বেষণ" />
            </section>
          </Link>
          
          

          <div className="hidden md:flex items-center gap-8">
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

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: navItems.length * 0.1 + 0.1 }}
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
    </>
  )
}
