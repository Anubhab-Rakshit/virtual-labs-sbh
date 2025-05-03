"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

type FractalType = "mandelbrot" | "julia" | "burningShip" | "tricorn"

export default function MathFractalsLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [fractalType, setFractalType] = useState<FractalType>("mandelbrot")
  const [maxIterations, setMaxIterations] = useState(100)
  const [zoom, setZoom] = useState(1)
  const [centerX, setCenterX] = useState(0)
  const [centerY, setCenterY] = useState(0)
  const [juliaConstant, setJuliaConstant] = useState({ real: -0.7, imag: 0.27 })
  const [colorScheme, setColorScheme] = useState("rainbow")
  const [isRendering, setIsRendering] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })

  // Render the fractal
  const renderFractal = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    setIsRendering(true)

    // Create image data
    const imageData = ctx.createImageData(canvas.width, canvas.height)
    const data = imageData.data

    // Calculate boundaries
    const xMin = centerX - 2 / zoom
    const xMax = centerX + 2 / zoom
    const yMin = centerY - 2 / zoom
    const yMax = centerY + 2 / zoom

    // For each pixel
    for (let x = 0; x < canvas.width; x++) {
      for (let y = 0; y < canvas.height; y++) {
        // Map pixel position to complex plane
        const real = xMin + (xMax - xMin) * (x / canvas.width)
        const imag = yMin + (yMax - yMin) * (y / canvas.height)

        // Calculate iterations
        let iterations = 0
        let zReal = 0
        let zImag = 0
        let cReal = real
        let cImag = imag

        // For Julia set, use constant
        if (fractalType === "julia") {
          cReal = juliaConstant.real
          cImag = juliaConstant.imag
          zReal = real
          zImag = imag
        }

        // Iterate until escape or max iterations
        while (iterations < maxIterations) {
          // z = z^2 + c
          const zRealTemp = zReal
          const zImagTemp = zImag

          if (fractalType === "mandelbrot" || fractalType === "julia") {
            // Standard formula: z = z^2 + c
            zReal = zRealTemp * zRealTemp - zImagTemp * zImagTemp + cReal
            zImag = 2 * zRealTemp * zImagTemp + cImag
          } else if (fractalType === "burningShip") {
            // Burning Ship: z = (|Re(z)| + i|Im(z)|)^2 + c
            zReal = Math.abs(zRealTemp) * Math.abs(zRealTemp) - Math.abs(zImagTemp) * Math.abs(zImagTemp) + cReal
            zImag = 2 * Math.abs(zRealTemp) * Math.abs(zImagTemp) + cImag
          } else if (fractalType === "tricorn") {
            // Tricorn: z = (z*)^2 + c (complex conjugate)
            zReal = zRealTemp * zRealTemp - zImagTemp * zImagTemp + cReal
            zImag = -2 * zRealTemp * zImagTemp + cImag
          }

          // Check if point escapes
          if (zReal * zReal + zImag * zImag > 4) {
            break
          }

          iterations++
        }

        // Color the pixel based on iterations
        const pixelIndex = (y * canvas.width + x) * 4

        if (iterations === maxIterations) {
          // Point is in set (black)
          data[pixelIndex] = 0
          data[pixelIndex + 1] = 0
          data[pixelIndex + 2] = 0
          data[pixelIndex + 3] = 255
        } else {
          // Point escapes (color based on iterations)
          const normalizedIterations = iterations / maxIterations

          if (colorScheme === "rainbow") {
            // Rainbow coloring
            const hue = 360 * normalizedIterations
            const saturation = 100
            const lightness = 50

            // Convert HSL to RGB
            const c = ((1 - Math.abs((2 * lightness) / 100 - 1)) * saturation) / 100
            const x = c * (1 - Math.abs(((hue / 60) % 2) - 1))
            const m = lightness / 100 - c / 2

            let r, g, b

            if (hue < 60) {
              ;[r, g, b] = [c, x, 0]
            } else if (hue < 120) {
              ;[r, g, b] = [x, c, 0]
            } else if (hue < 180) {
              ;[r, g, b] = [0, c, x]
            } else if (hue < 240) {
              ;[r, g, b] = [0, x, c]
            } else if (hue < 300) {
              ;[r, g, b] = [x, 0, c]
            } else {
              ;[r, g, b] = [c, 0, x]
            }

            data[pixelIndex] = Math.round((r + m) * 255)
            data[pixelIndex + 1] = Math.round((g + m) * 255)
            data[pixelIndex + 2] = Math.round((b + m) * 255)
            data[pixelIndex + 3] = 255
          } else if (colorScheme === "grayscale") {
            // Grayscale coloring
            const value = Math.round(normalizedIterations * 255)
            data[pixelIndex] = value
            data[pixelIndex + 1] = value
            data[pixelIndex + 2] = value
            data[pixelIndex + 3] = 255
          } else if (colorScheme === "fire") {
            // Fire coloring (black to red to yellow to white)
            const r = Math.min(255, Math.round(normalizedIterations * 255 * 3))
            const g = Math.max(0, Math.min(255, Math.round(normalizedIterations * 255 * 3 - 255)))
            const b = Math.max(0, Math.min(255, Math.round(normalizedIterations * 255 * 3 - 510)))

            data[pixelIndex] = r
            data[pixelIndex + 1] = g
            data[pixelIndex + 2] = b
            data[pixelIndex + 3] = 255
          } else if (colorScheme === "ocean") {
            // Ocean coloring (dark blue to light blue to white)
            const r = Math.max(0, Math.min(255, Math.round(normalizedIterations * 255 * 3 - 510)))
            const g = Math.max(0, Math.min(255, Math.round(normalizedIterations * 255 * 3 - 255)))
            const b = Math.min(255, Math.round(normalizedIterations * 255 * 3))

            data[pixelIndex] = r
            data[pixelIndex + 1] = g
            data[pixelIndex + 2] = b
            data[pixelIndex + 3] = 255
          }
        }
      }
    }

    // Put image data on canvas
    ctx.putImageData(imageData, 0, 0)
    setIsRendering(false)
  }

  // Initialize canvas
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight
      renderFractal()
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Mouse events for dragging
    const handleMouseDown = (e: MouseEvent) => {
      setIsDragging(true)
      setDragStart({
        x: e.clientX,
        y: e.clientY,
      })
    }

    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging) return

      const dx = e.clientX - dragStart.x
      const dy = e.clientY - dragStart.y

      // Convert pixel movement to complex plane movement
      const xRange = 4 / zoom
      const yRange = 4 / zoom

      const xMove = (dx / canvas.width) * xRange
      const yMove = (dy / canvas.height) * yRange

      setCenterX(centerX - xMove)
      setCenterY(centerY - yMove)

      setDragStart({
        x: e.clientX,
        y: e.clientY,
      })
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    canvas.addEventListener("mousedown", handleMouseDown)
    window.addEventListener("mousemove", handleMouseMove)
    window.addEventListener("mouseup", handleMouseUp)

    // Initial render
    renderFractal()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      canvas.removeEventListener("mousedown", handleMouseDown)
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragStart, centerX, centerY, zoom])

  // Re-render when parameters change
  useEffect(() => {
    renderFractal()
  }, [fractalType, maxIterations, zoom, centerX, centerY, juliaConstant, colorScheme])

  const resetView = () => {
    setCenterX(0)
    setCenterY(0)
    setZoom(1)
    renderFractal()
  }

  const handleZoom = (factor: number) => {
    setZoom(zoom * factor)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full bg-black cursor-move" />

        {isRendering && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="text-white text-center">
              <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p>Rendering...</p>
            </div>
          </div>
        )}
      </div>

      <div className="bg-background p-4 border-t">
        <Tabs defaultValue="controls">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="theory">Theory</TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="space-y-4 py-4">
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => handleZoom(1.5)} className="gap-2">
                <ZoomIn className="h-4 w-4" />
                Zoom In
              </Button>

              <Button onClick={() => handleZoom(0.67)} className="gap-2">
                <ZoomOut className="h-4 w-4" />
                Zoom Out
              </Button>

              <Button variant="outline" onClick={resetView} className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Reset View
              </Button>

              <div className="ml-auto text-sm text-muted-foreground">Drag to pan • Zoom: {zoom.toFixed(2)}x</div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Fractal Type</Label>
                      <Select
                        value={fractalType}
                        onValueChange={(value) => {
                          setFractalType(value as FractalType)
                          resetView()
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select fractal type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mandelbrot">Mandelbrot Set</SelectItem>
                          <SelectItem value="julia">Julia Set</SelectItem>
                          <SelectItem value="burningShip">Burning Ship</SelectItem>
                          <SelectItem value="tricorn">Tricorn</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Color Scheme</Label>
                      <Select value={colorScheme} onValueChange={setColorScheme}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select color scheme" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="rainbow">Rainbow</SelectItem>
                          <SelectItem value="grayscale">Grayscale</SelectItem>
                          <SelectItem value="fire">Fire</SelectItem>
                          <SelectItem value="ocean">Ocean</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <Label>Iterations: {maxIterations}</Label>
                      </div>
                      <Slider
                        value={[maxIterations]}
                        min={10}
                        max={500}
                        step={10}
                        onValueChange={(value) => setMaxIterations(value[0])}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {fractalType === "julia" && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Julia Set Parameters</h3>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Real Part (c)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={juliaConstant.real}
                            onChange={(e) =>
                              setJuliaConstant({
                                ...juliaConstant,
                                real: Number.parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Imaginary Part (c)</Label>
                          <Input
                            type="number"
                            step="0.01"
                            value={juliaConstant.imag}
                            onChange={(e) =>
                              setJuliaConstant({
                                ...juliaConstant,
                                imag: Number.parseFloat(e.target.value),
                              })
                            }
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setJuliaConstant({ real: -0.7, imag: 0.27 })}
                          className="w-full"
                        >
                          Preset 1
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setJuliaConstant({ real: 0.285, imag: 0.01 })}
                          className="w-full"
                        >
                          Preset 2
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setJuliaConstant({ real: -0.8, imag: 0.156 })}
                          className="w-full"
                        >
                          Preset 3
                        </Button>
                        <Button
                          variant="outline"
                          onClick={() => setJuliaConstant({ real: -0.4, imag: 0.6 })}
                          className="w-full"
                        >
                          Preset 4
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {fractalType !== "julia" && (
                <Card>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <h3 className="font-medium">Navigation</h3>
                      <p className="text-sm text-muted-foreground">
                        Click and drag on the fractal to pan. Use the zoom buttons to zoom in and out.
                      </p>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Center X</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={centerX}
                            onChange={(e) => setCenterX(Number.parseFloat(e.target.value))}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Center Y</Label>
                          <Input
                            type="number"
                            step="0.1"
                            value={centerY}
                            onChange={(e) => setCenterY(Number.parseFloat(e.target.value))}
                          />
                        </div>
                      </div>

                      {fractalType === "mandelbrot" && (
                        <div className="grid grid-cols-2 gap-2">
                          <Button
                            variant="outline"
                            onClick={() => {
                              setCenterX(-0.75)
                              setCenterY(0)
                              setZoom(1)
                            }}
                            className="w-full"
                          >
                            Main View
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setCenterX(-0.16)
                              setCenterY(1.0405)
                              setZoom(100)
                            }}
                            className="w-full"
                          >
                            Mini Bulb
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setCenterX(-1.25)
                              setCenterY(0.02)
                              setZoom(25)
                            }}
                            className="w-full"
                          >
                            Valley
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => {
                              setCenterX(-1.74)
                              setCenterY(0.028)
                              setZoom(200)
                            }}
                            className="w-full"
                          >
                            Spiral
                          </Button>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="theory" className="py-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-2">Fractal Mathematics</h3>
                <p className="mb-4">
                  Fractals are infinitely complex patterns that are self-similar across different scales. They are
                  created by repeating a simple process over and over in an ongoing feedback loop.
                </p>

                <h4 className="font-bold mb-1">Key Concepts:</h4>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>
                    <span className="font-medium">Mandelbrot Set:</span> The set of complex numbers c for which the
                    function f(z) = z² + c does not diverge when iterated from z = 0.
                  </li>
                  <li>
                    <span className="font-medium">Julia Set:</span> Related to the Mandelbrot set, it's the set of
                    points that remain bounded under iteration of f(z) = z² + c for a fixed complex parameter c.
                  </li>
                  <li>
                    <span className="font-medium">Self-Similarity:</span> A property where parts of an object are
                    similar to the whole object at different scales.
                  </li>
                  <li>
                    <span className="font-medium">Escape Time Algorithm:</span> The method used to color points based on
                    how quickly the iterative function diverges.
                  </li>
                </ul>

                <h4 className="font-bold mb-1">Mathematical Formula:</h4>
                <p className="mb-2">For each point (x,y) on the complex plane:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Mandelbrot: z₊₁ = z²ₙ + c, where z₀ = 0 and c = x + yi</li>
                  <li>Julia: z₊₁ = z²ₙ + c, where z₀ = x + yi and c is constant</li>
                  <li>Burning Ship: z₊₁ = (|Re(z)|+i|Im(z)|)² + c</li>
                  <li>Tricorn: z₊₁ = (z*)² + c, where z* is the complex conjugate</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
