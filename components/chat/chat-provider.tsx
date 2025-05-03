"use client"

import { useState, useEffect } from "react"
import { ChatInterface } from "./chat-interface"

export function ChatProvider() {
  const [isMounted, setIsMounted] = useState(false)

  // Prevent hydration errors by only rendering on client
  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return <ChatInterface />
}
