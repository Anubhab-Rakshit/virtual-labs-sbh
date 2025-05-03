"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RotateCcw, Plus } from "lucide-react"

export default function ChemistryTitrationLab() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [phValue, setPhValue] = useState(7)
  const [baseVolume, setBaseVolume] = useState(50)
  const [acidConcentration, setAcidConcentration] = useState(0.1)
  const [baseConcentration, setBaseConcentration] = useState(0.1)
  const [addedAcidVolume, setAddedAcidVolume] = useState(0)
  const [indicator, setIndicator] = useState("phenolphthalein")
  const [isEndpoint, setIsEndpoint] = useState(false)

  // Calculate pH based on volumes and concentrations
  useEffect(() => {
    // Simple pH calculation for acid-base titration
    // This is a simplified model for educational purposes
    const molesBase = (baseVolume * baseConcentration) / 1000 // Convert mL to L
    const molesAcid = (addedAcidVolume * acidConcentration) / 1000

    let newPh

    if (molesAcid < molesBase) {
      // Excess base
      const excessBase = molesBase - molesAcid
      const concentration = excessBase / ((baseVolume + addedAcidVolume) / 1000)
      newPh = 14 + Math.log10(concentration)

      // Clamp pH to realistic values
      newPh = Math.min(14, Math.max(0, newPh))
    } else if (molesAcid > molesBase) {
      // Excess acid
      const excessAcid = molesAcid - molesBase
      const concentration = excessAcid / ((baseVolume + addedAcidVolume) / 1000)
      newPh = -Math.log10(concentration)

      // Clamp pH to realistic values
      newPh = Math.min(14, Math.max(0, newPh))
    } else {
      // Exact neutralization (equivalence point)
      newPh = 7
    }

    setPhValue(Number.parseFloat(newPh.toFixed(2)))

    // Check if we're at or near the endpoint
    const equivalencePoint = (molesBase / baseConcentration) * acidConcentration
    setIsEndpoint(Math.abs(addedAcidVolume - equivalencePoint) < 0.5)

    // Draw the solution
    drawSolution()
  }, [addedAcidVolume, baseVolume, acidConcentration, baseConcentration])

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
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Initial drawing
    drawSolution()

    return () => {
      window.removeEventListener("resize", resizeCanvas)
    }
  }, [])

  const drawSolution = () => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw beaker
    const beakerWidth = Math.min(300, canvas.width * 0.6)
    const beakerHeight = Math.min(400, canvas.height * 0.7)
    const beakerX = (canvas.width - beakerWidth) / 2
    const beakerY = canvas.height - beakerHeight - 50

    // Draw beaker outline
    ctx.beginPath()
    ctx.rect(beakerX, beakerY, beakerWidth, beakerHeight)
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw solution
    let solutionColor

    if (indicator === "phenolphthalein") {
      // Phenolphthalein: colorless in acidic, pink in basic
      if (phValue >= 8.2) {
        // Pink in basic solution
        const intensity = Math.min(1, (phValue - 8.2) / 2)
        solutionColor = `rgba(255, 105, 180, ${intensity})`
      } else {
        // Colorless in acidic solution
        solutionColor = "rgba(200, 200, 255, 0.3)"
      }
    } else if (indicator === "methylOrange") {
      // Methyl orange: red in acidic, yellow in basic
      if (phValue <= 4.4) {
        // Red in acidic solution
        const intensity = Math.min(1, (4.4 - phValue) / 2)
        solutionColor = `rgba(255, 50, 50, ${intensity + 0.3})`
      } else {
        // Yellow in basic solution
        solutionColor = "rgba(255, 255, 50, 0.5)"
      }
    } else {
      // Universal indicator: color spectrum based on pH
      if (phValue <= 3) {
        solutionColor = "rgba(255, 0, 0, 0.5)" // Red
      } else if (phValue <= 5) {
        solutionColor = "rgba(255, 165, 0, 0.5)" // Orange
      } else if (phValue <= 6) {
        solutionColor = "rgba(255, 255, 0, 0.5)" // Yellow
      } else if (phValue <= 8) {
        solutionColor = "rgba(0, 255, 0, 0.5)" // Green
      } else if (phValue <= 10) {
        solutionColor = "rgba(0, 0, 255, 0.5)" // Blue
      } else {
        solutionColor = "rgba(128, 0, 128, 0.5)" // Purple
      }
    }

    // Fill beaker with solution
    ctx.fillStyle = solutionColor
    ctx.fillRect(beakerX, beakerY, beakerWidth, beakerHeight)

    // Draw pH value
    ctx.font = "24px Arial"
    ctx.fillStyle = "#ffffff"
    ctx.textAlign = "center"
    ctx.fillText(`pH: ${phValue}`, canvas.width / 2, beakerY - 20)

    // Draw added volume
    ctx.font = "18px Arial"
    ctx.fillText(`Acid added: ${addedAcidVolume.toFixed(1)} mL`, canvas.width / 2, beakerY + beakerHeight + 30)

    // Draw burette
    const buretteWidth = 20
    const buretteHeight = beakerY - 50
    const buretteX = canvas.width / 2 - buretteWidth / 2
    const buretteY = 20

    ctx.beginPath()
    ctx.rect(buretteX, buretteY, buretteWidth, buretteHeight)
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 2
    ctx.stroke()

    // Draw acid in burette
    const maxAcidVolume = 50 // mL
    const acidHeight = (1 - Math.min(addedAcidVolume, maxAcidVolume) / maxAcidVolume) * buretteHeight

    ctx.fillStyle = "rgba(255, 200, 200, 0.7)"
    ctx.fillRect(buretteX, buretteY, buretteWidth, acidHeight)

    // Draw burette tip
    ctx.beginPath()
    ctx.moveTo(buretteX + buretteWidth / 2, buretteY + buretteHeight)
    ctx.lineTo(buretteX + buretteWidth / 2, beakerY - 10)
    ctx.strokeStyle = "#ffffff"
    ctx.lineWidth = 1
    ctx.stroke()

    // Draw drop if adding acid
    if (addedAcidVolume > 0 && addedAcidVolume % 1 < 0.3) {
      ctx.beginPath()
      ctx.arc(buretteX + buretteWidth / 2, beakerY - 5, 3, 0, Math.PI * 2)
      ctx.fillStyle = "rgba(255, 200, 200, 0.7)"
      ctx.fill()
    }

    // Highlight if at endpoint
    if (isEndpoint) {
      ctx.beginPath()
      ctx.rect(beakerX - 10, beakerY - 10, beakerWidth + 20, beakerHeight + 20)
      ctx.strokeStyle = "#ffff00"
      ctx.lineWidth = 3
      ctx.setLineDash([10, 10])
      ctx.stroke()
      ctx.setLineDash([])

      ctx.font = "bold 24px Arial"
      ctx.fillStyle = "#ffff00"
      ctx.fillText("Endpoint Reached!", canvas.width / 2, beakerY - 50)
    }
  }

  const resetExperiment = () => {
    setAddedAcidVolume(0)
    setIsEndpoint(false)
  }

  const addAcid = (amount: number) => {
    setAddedAcidVolume((prev) => Math.max(0, Math.min(100, prev + amount)))
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
              <Button onClick={() => addAcid(0.1)} className="gap-2">
                <Plus className="h-4 w-4" />
                Add 0.1 mL
              </Button>

              <Button onClick={() => addAcid(1)}>Add 1 mL</Button>

              <Button onClick={() => addAcid(5)}>Add 5 mL</Button>

              <Button variant="outline" onClick={resetExperiment} className="gap-2">
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
                        <label className="text-sm font-medium">Base Volume: {baseVolume} mL</label>
                      </div>
                      <Slider
                        value={[baseVolume]}
                        min={10}
                        max={100}
                        step={1}
                        onValueChange={(value) => {
                          setBaseVolume(value[0])
                          resetExperiment()
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <label className="text-sm font-medium">Acid Concentration: {acidConcentration} M</label>
                      </div>
                      <Slider
                        value={[acidConcentration]}
                        min={0.01}
                        max={0.5}
                        step={0.01}
                        onValueChange={(value) => {
                          setAcidConcentration(value[0])
                          resetExperiment()
                        }}
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
                        <label className="text-sm font-medium">Base Concentration: {baseConcentration} M</label>
                      </div>
                      <Slider
                        value={[baseConcentration]}
                        min={0.01}
                        max={0.5}
                        step={0.01}
                        onValueChange={(value) => {
                          setBaseConcentration(value[0])
                          resetExperiment()
                        }}
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium">Indicator</label>
                      <div className="grid grid-cols-3 gap-2">
                        <Button
                          variant={indicator === "phenolphthalein" ? "default" : "outline"}
                          onClick={() => setIndicator("phenolphthalein")}
                          className="w-full"
                        >
                          Phenolphthalein
                        </Button>
                        <Button
                          variant={indicator === "methylOrange" ? "default" : "outline"}
                          onClick={() => setIndicator("methylOrange")}
                          className="w-full"
                        >
                          Methyl Orange
                        </Button>
                        <Button
                          variant={indicator === "universal" ? "default" : "outline"}
                          onClick={() => setIndicator("universal")}
                          className="w-full"
                        >
                          Universal
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="theory" className="py-4">
            <Card>
              <CardContent className="pt-6">
                <h3 className="text-lg font-bold mb-2">Acid-Base Titration Theory</h3>
                <p className="mb-4">
                  Titration is a common laboratory method used to determine the concentration of an acid or base by
                  neutralizing it with a standard solution of base or acid with a known concentration.
                </p>

                <h4 className="font-bold mb-1">Key Concepts:</h4>
                <ul className="list-disc pl-5 space-y-2 mb-4">
                  <li>
                    <span className="font-medium">Equivalence Point:</span> The point at which the moles of acid exactly
                    equal the moles of base, resulting in complete neutralization.
                  </li>
                  <li>
                    <span className="font-medium">Endpoint:</span> The point at which the indicator changes color,
                    signaling that the titration is complete.
                  </li>
                  <li>
                    <span className="font-medium">Indicators:</span> Chemicals that change color at specific pH values,
                    helping to visualize the endpoint.
                  </li>
                </ul>

                <h4 className="font-bold mb-1">Indicators Used:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>
                    <span className="font-medium">Phenolphthalein:</span> Colorless in acidic solutions (pH &lt; 8.2),
                    pink in basic solutions (pH &gt; 8.2)
                  </li>
                  <li>
                    <span className="font-medium">Methyl Orange:</span> Red in acidic solutions (pH &lt; 3.1), yellow in
                    basic solutions (pH &gt; 4.4)
                  </li>
                  <li>
                    <span className="font-medium">Universal Indicator:</span> Shows different colors across the pH
                    spectrum
                  </li>
                </ul>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
