"use client"

import { useState } from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { Bell, Settings, LogOut } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface DashboardHeaderProps {
  student: any
  loading?: boolean
}

export function DashboardHeader({ student, loading = false }: DashboardHeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false)

  // Mock notifications if they don't exist
  const notifications = [
    {
      id: "notification-1",
      message: "New lab available: Quantum Physics",
      time: "2 hours ago",
      read: false,
    },
    {
      id: "notification-2",
      message: "Quiz completed: Acid-Base Titration",
      time: "1 day ago",
      read: true,
    },
  ]

  if (loading) {
    return <div className="w-full h-16 bg-black/50 backdrop-blur-md border-b border-white/10 animate-pulse"></div>
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-white/10 bg-black/50 backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="relative h-8 w-8">
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 opacity-70 blur-sm"></div>
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-black text-white">
                VL
              </div>
            </div>
            <span className="text-lg font-medium text-white">Virtual Labs</span>
          </Link>

          <nav className="hidden md:flex gap-1 ml-6">
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
              Dashboard
            </Button>
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
              Labs
            </Button>
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
              Resources
            </Button>
            <Button variant="ghost" className="text-white/70 hover:text-white hover:bg-white/10">
              Community
            </Button>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-white/70 hover:text-white hover:bg-white/10"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell className="h-5 w-5" />
              <span className="sr-only">Notifications</span>
              {notifications.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-indigo-500 text-white text-xs">
                  {notifications.length}
                </Badge>
              )}
            </Button>

            {showNotifications && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute right-0 mt-2 w-80 rounded-lg border border-white/10 bg-black/90 backdrop-blur-lg shadow-lg"
              >
                <div className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-white">Notifications</h3>
                    <Button variant="ghost" size="sm" className="text-xs text-white/70 hover:text-white">
                      Mark all as read
                    </Button>
                  </div>
                  <div className="space-y-3 max-h-80 overflow-y-auto">
                    {notifications.map((notification, i) => (
                      <div key={i} className="flex gap-3 p-2 rounded-md hover:bg-white/5 transition-colors">
                        <div
                          className={`h-2 w-2 mt-2 rounded-full ${notification.read ? "bg-white/30" : "bg-indigo-500"}`}
                        />
                        <div>
                          <p className="text-sm text-white">{notification.message}</p>
                          <p className="text-xs text-white/50">{notification.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          <Button variant="ghost" size="icon" className="text-white/70 hover:text-white hover:bg-white/10">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10 border border-white/20">
                  <AvatarImage src={student.avatar || "/avatars/user-avatar.png"} alt={student.name} />
                  <AvatarFallback className="bg-white/10 text-white">
                    {student.name
                      ? student.name
                          .split(" ")
                          .map((n: string) => n[0])
                          .join("")
                      : "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              className="w-56 bg-black/90 backdrop-blur-lg border border-white/10 text-white"
              align="end"
              forceMount
            >
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">{student.name || "User"}</p>
                  <p className="text-xs text-white/70 truncate">{student.email || "user@example.com"}</p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Profile</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Settings</DropdownMenuItem>
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer">Support</DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/10" />
              <DropdownMenuItem className="hover:bg-white/10 cursor-pointer flex items-center text-red-400">
                <LogOut className="mr-2 h-4 w-4" />
                <span>Log out</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
