"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Play, Pause, RotateCcw } from "lucide-react"

export default function PhysicsPendulumLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const animationRef = useRef<number>(0)
  const [isRunning, setIsRunning] = useState(false)
  const [length, setLength] = useState(150)
  const [gravity, setGravity] = useState(9.8)
  const [initialAngle, setInitialAngle] = useState(30)
  const [damping, setDamping] = useState(0.999)

  // Pendulum state
  const pendulumRef = useRef({
    angle: 0,
    angleVelocity: 0,
    angleAcceleration: 0,
    origin: { x: 0, y: 0 },
    position: { x: 0, y: 0 },
  })

  // Initialize pendulum
  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = canvas.clientWidth
      canvas.height = canvas.clientHeight

      // Set pendulum origin to center-top of canvas
      pendulumRef.current.origin = {
        x: canvas.width / 2,
        y: 50,
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Reset pendulum
    resetPendulum()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationRef.current)
    }
  }, [])

  // Reset pendulum when parameters change
  useEffect(() => {
    resetPendulum()
  }, [length, initialAngle])

  const resetPendulum = () => {
    // Convert degrees to radians
    const angleInRadians = (initialAngle * Math.PI) / 180

    pendulumRef.current = {
      angle: angleInRadians,
      angleVelocity: 0,
      angleAcceleration: 0,
      origin: pendulumRef.current.origin,
      position: {
        x: pendulumRef.current.origin.x + length * Math.sin(angleInRadians),
        y: pendulumRef.current.origin.y + length * Math.cos(angleInRadians),
      },
    }

    // Draw initial state
    drawPendulum()
  }

  const startSimulation = () => {
    setIsRunning(true)
    animatePendulum()
  }

  const pauseSimulation = () => {
    setIsRunning(false)
    cancelAnimationFrame(animationRef.current)
  }

  const animatePendulum = () => {
    if (!canvasRef.current) return

    // Physics calculations
    const pendulum = pendulumRef.current

    // F = mg * sin(angle)
    // a = F / m = g * sin(angle)
    pendulum.angleAcceleration = ((-1 * gravity) / length) * Math.sin(pendulum.angle)

    // Update velocity and apply damping
    pendulum.angleVelocity += pendulum.angleAcceleration
    pendulum.angleVelocity *= damping

    // Update angle
    pendulum.angle += pendulum.angleVelocity

    // Calculate bob position
    pendulum.position = {
      x: pendulum.origin.x + length * Math.sin(pendulum.angle),
      y: pendulum.origin.y + length * Math.cos(pendulum.angle),
    }

    // Draw the pendulum
    drawPendulum()

    // Continue animation
    if (isRunning) {
      animationRef.current = requestAnimationFrame(animatePendulum)
    }
  }

  const drawPendulum = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const pendulum = pendulumRef.current

    // Draw string
    ctx.beginPath()
    ctx.moveTo(pendulum.origin.x, pendulum.origin.y)
    ctx.lineTo(pendulum.position.x, pendulum.position.y)
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw pivot point
    ctx.beginPath()
    ctx.arc(pendulum.origin.x, pendulum.origin.y, 5, 0, Math.PI * 2)
    ctx.fillStyle = "#ffffff"
    ctx.fill()

    // Draw bob
    ctx.beginPath()
    ctx.arc(pendulum.position.x, pendulum.position.y, 20, 0, Math.PI * 2)
    ctx.fillStyle = "#3b82f6"
    ctx.fill()

    // Draw angle indicator
    const angleInDegrees = (pendulum.angle * 180) / Math.PI
    ctx.font = "16px Arial"
    ctx.fillStyle = "#ffffff"
    ctx.fillText(`Angle: ${angleInDegrees.toFixed(1)}°`, 20, 30)
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 relative">
        <canvas ref={canvasRef} className="w-full h-full bg-black" />
      </div>

      <div className="bg-background p-4 border-t">
        <Tabs defaultValue="controls">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="controls">Controls</TabsTrigger>
            <TabsTrigger value="theory">Theory</TabsTrigger>
          </TabsList>

          <TabsContent value="controls" className="space-y-4 py-4">
            <div className="flex gap-4">
              <Button onClick={isRunning ? pauseSimulation : startSimulation} className="gap-2">
                {isRunning ? (
                  <>
                    <Pause className="h-4 w-4" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4" />
                    Start
                  </>
                )}
              </Button>

              <Button
                variant="outline"
                onClick={() => {
                  pauseSimulation()
                  resetPendulum()
                }}
                className="gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Pendulum Length: {length} cm</label>
                      </div>
                      <Slider
                        value={[length]}
                        min={50}
                        max={300}
                        step={1}
                        onValueChange={(value) => setLength(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Initial Angle: {initialAngle}°</label>
                      </div>
                      <Slider
                        value={[initialAngle]}
                        min={0}
                        max={90}
                        step={1}
                        onValueChange={(value) => setInitialAngle(value[0])}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Gravity: {gravity} m/s²</label>
                      </div>
                      <Slider
                        value={[gravity]}
                        min={1}
                        max={20}
                        step={0.1}
                        onValueChange={(value) => setGravity(value[0])}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Damping: {((1 - damping) * 100).toFixed(1)}%</label>
                      </div>
                      <Slider
                        value={[damping]}
                        min={0.9}
                        max={1}
                        step={0.001}
                        onValueChange={(value) => setDamping(value[0])}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="theory" className="py-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-2">Simple Pendulum Theory</h3>
                <p className="mb-4">
                  A simple pendulum consists of a mass (bob) attached to a weightless string. When displaced from
                  equilibrium and released, it oscillates about its equilibrium position under the influence of gravity.
                </p>

                <h4 className="font-bold mb-1">Key Equations:</h4>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>
                    Period of oscillation: T = 2π√(L/g)
                    <br />
                    <span className="text-sm text-muted-foreground">
                      Where L is the length and g is the acceleration due to gravity
                    </span>
                  </li>
                  <li>
                    Angular acceleration: α = -(g/L)sin(θ)
                    <br />
                    <span className="text-sm text-muted-foreground">Where θ is the angle from the vertical</span>
                  </li>
                </ul>

                <h4 className="font-bold mb-1">Observations:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>The period is independent of the mass of the bob</li>
                  <li>The period increases with the length of the pendulum</li>
                  <li>The period decreases with increasing gravity</li>
                  <li>For small angles, the motion is approximately simple harmonic</li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
