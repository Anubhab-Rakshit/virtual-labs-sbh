"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { HomeIcon, Menu, X } from "lucide-react"

export default function Navigation() {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center">
              <HomeIcon className="h-6 w-6 text-teal-500 mr-2" />
              <span className="font-bold text-xl text-slate-800">Science Lab</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              href="/"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/" ? "bg-teal-100 text-teal-800" : "text-slate-600 hover:bg-teal-50"
              }`}
            >
              Home
            </Link>
            <Link
              href="/ph-scale"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/ph-scale" ? "bg-teal-100 text-teal-800" : "text-slate-600 hover:bg-teal-50"
              }`}
            >
              pH Scale
            </Link>
            <Link
              href="/hydroelectric"
              className={`px-3 py-2 rounded-md text-sm font-medium ${
                pathname === "/hydroelectric" ? "bg-teal-100 text-teal-800" : "text-slate-600 hover:bg-teal-50"
              }`}
            >
              Hydroelectric
            </Link>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:bg-teal-50 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              href="/"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/" ? "bg-teal-100 text-teal-800" : "text-slate-600 hover:bg-teal-50"
              }`}
            >
              Home
            </Link>
            <Link
              href="/ph-scale"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/ph-scale" ? "bg-teal-100 text-teal-800" : "text-slate-600 hover:bg-teal-50"
              }`}
            >
              pH Scale
            </Link>
            <Link
              href="/hydroelectric"
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                pathname === "/hydroelectric" ? "bg-teal-100 text-teal-800" : "text-slate-600 hover:bg-teal-50"
              }`}
            >
              Hydroelectric
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}
