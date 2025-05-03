export function debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null
  
    return (...args: Parameters<T>) => {
      if (timeout) clearTimeout(timeout)
      timeout = setTimeout(() => func(...args), wait)
    }
  }
  
  export function throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle = false
  
    return (...args: Parameters<T>) => {
      if (!inThrottle) {
        func(...args)
        inThrottle = true
        setTimeout(() => (inThrottle = false), limit)
      }
    }
  }
  
  export function isReducedMotion(): boolean {
    if (typeof window === "undefined") return false
    return window.matchMedia("(prefers-reduced-motion: reduce)").matches
  }
  
  export function isMobile(): boolean {
    if (typeof window === "undefined") return false
    return window.innerWidth < 768
  }
  
  export function optimizeAnimations(callback: () => void): () => void {
    if (typeof window === "undefined") return callback
  
    // Check if device is low-end
    const isLowEnd =
      navigator.hardwareConcurrency <= 4 ||
      /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  
    // If reduced motion is preferred or device is low-end, reduce animation quality
    if (isReducedMotion() || isLowEnd) {
      return throttle(callback, 50) // More aggressive throttling
    }
  
    return throttle(callback, 16) // Normal throttling at ~60fps
  }
  