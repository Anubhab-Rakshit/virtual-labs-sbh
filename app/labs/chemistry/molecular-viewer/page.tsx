"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import StaticViewer from "./static-viewer"
import MolecularViewer3D from "./3d-viewer"
import { MoleculeImages } from "./molecule-images"

export default function MolecularViewerPage() {
  const [activeTab, setActiveTab] = useState<string>("3d")

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2">Molecular Viewer Laboratory</h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Explore molecular structures in both 2D and 3D. Understand chemical bonds, molecular geometry, and structural
          properties of various compounds.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="3d">3D Interactive Viewer</TabsTrigger>
          <TabsTrigger value="2d">2D Molecular Structures</TabsTrigger>
        </TabsList>

        <TabsContent value="3d" className="mt-6">
          <MolecularViewer3D initialMolecule="water" />

          <div className="mt-8">
            <Card>
              <CardHeader>
                <CardTitle>How to Use the 3D Viewer</CardTitle>
                <CardDescription>Learn how to interact with the 3D molecular models</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h3 className="font-semibold">Navigation Controls</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Click and drag to rotate the molecule</li>
                      <li>Scroll to zoom in and out</li>
                      <li>Right-click and drag to pan</li>
                      <li>Double-click to reset the view</li>
                    </ul>
                  </div>
                  <div className="space-y-2">
                    <h3 className="font-semibold">Visualization Options</h3>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Switch between ball-and-stick and space-filling models</li>
                      <li>Toggle atom labels on/off</li>
                      <li>Adjust rotation speed for automatic rotation</li>
                      <li>Take screenshots of the current view</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="2d" className="mt-6">
          <StaticViewer />
          <MoleculeImages />
        </TabsContent>
      </Tabs>
    </div>
  )
}
