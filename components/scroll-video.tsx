"use client"

import { useRef, useEffect, useState } from "react"
import { useScroll, motion, useTransform } from "framer-motion"
import { cn } from "@/lib/utils"

interface ScrollVideoProps {
  src: string
  className?: string
  threshold?: [number, number]
  poster?: string
  loop?: boolean
  muted?: boolean
  autoplay?: boolean
  controls?: boolean
  height?: string
  width?: string
}

export function ScrollVideo({
  src,
  className,
  threshold = [0, 1],
  poster,
  loop = true,
  muted = true,
  autoplay = false,
  controls = false,
  height = "100%",
  width = "100%",
}: ScrollVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [isInView, setIsInView] = useState(false)
  const [videoDuration, setVideoDuration] = useState(0)
  const [isReady, setIsReady] = useState(false)

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  // Map scroll progress to video time
  const videoProgress = useTransform(scrollYProgress, threshold, [0, 1])

  // Handle video metadata loaded
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleMetadataLoaded = () => {
      setVideoDuration(video.duration)
      setIsReady(true)
      if (autoplay) video.play()
    }

    video.addEventListener("loadedmetadata", handleMetadataLoaded)

    return () => {
      video.removeEventListener("loadedmetadata", handleMetadataLoaded)
    }
  }, [autoplay])

  // Update video time based on scroll
  useEffect(() => {
    const video = videoRef.current
    if (!video || !isReady || videoDuration <= 0) return

    const unsubscribe = videoProgress.onChange((progress) => {
      if (progress >= 0 && progress <= 1) {
        video.currentTime = progress * videoDuration
        setIsInView(true)
      } else {
        setIsInView(false)
      }
    })

    return () => unsubscribe()
  }, [videoProgress, isReady, videoDuration])

  return (
    <div ref={containerRef} className={cn("relative overflow-hidden", className)} style={{ height, width }}>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: isInView ? 1 : 0 }} transition={{ duration: 0.5 }}>
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster={poster}
          playsInline
          loop={loop}
          muted={muted}
          controls={controls}
          preload="auto"
        >
          <source src={src} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </motion.div>
    </div>
  )
}
