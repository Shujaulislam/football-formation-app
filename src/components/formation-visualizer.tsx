"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { TreePine, Info, Zap, Shield, Swords } from "lucide-react"
import formationsData from "@/data/formations.json"

interface SubFormation {
  [key: string]: string
  description: string
  shape: string
  notes: string
}

interface Formation {
  formation: string
  "sub-formations": SubFormation[]
}

export function FormationVisualizer() {
  const [selectedFormation, setSelectedFormation] = useState<Formation | null>(null)
  const [selectedSubFormation, setSelectedSubFormation] = useState<SubFormation | null>(null)
  const [formations, setFormations] = useState<Formation[]>([])

  useEffect(() => {
    setFormations(formationsData.FORMATIONS)
    setSelectedFormation(formationsData.FORMATIONS[0])
  }, [])

  const getFormationIcon = (formation: string) => {
    if (formation.includes("5")) return <Shield className="h-4 w-4" />
    if (formation.includes("3-4-3") || formation.includes("4-3-3")) return <Swords className="h-4 w-4" />
    return <TreePine className="h-4 w-4" />
  }

  const getShapeColor = (shape: string) => {
    if (shape.toLowerCase().includes("diamond")) return "bg-chart-1"
    if (shape.toLowerCase().includes("triangle")) return "bg-chart-2"
    if (shape.toLowerCase().includes("flat")) return "bg-chart-3"
    return "bg-chart-4"
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formation List */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TreePine className="h-5 w-5 text-primary" />
            Formation Hierarchy
          </CardTitle>
          <CardDescription>Explore different tactical setups and their variations</CardDescription>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[600px]">
            <div className="space-y-3">
              {formations.map((formation, index) => (
                <div key={index} className="space-y-2">
                  <Button
                    variant={selectedFormation?.formation === formation.formation ? "default" : "outline"}
                    className="w-full justify-start hover-lift"
                    onClick={() => {
                      setSelectedFormation(formation)
                      setSelectedSubFormation(null)
                    }}
                  >
                    {getFormationIcon(formation.formation)}
                    <span className="ml-2 font-semibold">{formation.formation}</span>
                    <Badge variant="secondary" className="ml-auto">
                      {formation["sub-formations"].length}
                    </Badge>
                  </Button>

                  {selectedFormation?.formation === formation.formation && (
                    <div className="ml-4 space-y-1 animate-bounce-in">
                      {formation["sub-formations"].map((subForm, subIndex) => {
                        const subFormName = Object.keys(subForm)[0]
                        const subFormLabel = subForm[subFormName]
                        return (
                          <Button
                            key={subIndex}
                            variant={selectedSubFormation === subForm ? "secondary" : "ghost"}
                            size="sm"
                            className="w-full justify-start text-xs hover-lift"
                            onClick={() => setSelectedSubFormation(subForm)}
                          >
                            <div className={`w-2 h-2 rounded-full mr-2 ${getShapeColor(subForm.shape)}`} />
                            {subFormName} {subFormLabel && `(${subFormLabel})`}
                          </Button>
                        )
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Formation Details */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5 text-secondary" />
            {selectedSubFormation
              ? Object.keys(selectedSubFormation)[0]
              : selectedFormation?.formation || "Select a Formation"}
          </CardTitle>
          <CardDescription>
            {selectedSubFormation
              ? selectedSubFormation[Object.keys(selectedSubFormation)[0]]
              : "Detailed tactical analysis and formation breakdown"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {selectedSubFormation ? (
            <div className="animate-slide-in-right space-y-6">
              {/* Formation Shape Visualization */}
              <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg p-6 border-2 border-green-200 dark:border-green-700">
                <div className="text-center">
                  <Badge className={`${getShapeColor(selectedSubFormation.shape)} text-white mb-4`}>
                    {selectedSubFormation.shape}
                  </Badge>
                  <div className="text-4xl font-bold text-green-700 dark:text-green-300 mb-2">
                    {Object.keys(selectedSubFormation)[0]}
                  </div>
                  <p className="text-green-600 dark:text-green-400 font-medium">{selectedSubFormation.description}</p>
                </div>
              </div>

              {/* Tactical Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="border-primary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <Zap className="h-4 w-4 text-primary" />
                      Tactical Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selectedSubFormation.notes}</p>
                  </CardContent>
                </Card>

                <Card className="border-secondary/20">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm flex items-center gap-2">
                      <TreePine className="h-4 w-4 text-secondary" />
                      Formation Shape
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-2">
                      <div className={`w-4 h-4 rounded-full ${getShapeColor(selectedSubFormation.shape)}`} />
                      <span className="text-sm font-medium">{selectedSubFormation.shape}</span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      This formation utilizes a {selectedSubFormation.shape.toLowerCase()} structure for optimal
                      tactical positioning.
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Formation Layout */}
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-sm flex items-center gap-2">
                    <TreePine className="h-4 w-4 text-primary" />
                    Formation Layout
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative w-full max-w-md mx-auto bg-gradient-to-b from-green-400 to-green-500 rounded-lg overflow-hidden">
                    <div className="aspect-[2/3] relative border-4 border-white">
                      {/* Pitch markings */}
                      <div className="absolute inset-0">
                        <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-0.5" />
                        <div className="absolute top-1/2 left-1/2 w-16 h-16 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                        <div className="absolute top-0 left-1/4 right-1/4 h-6 border-2 border-white border-t-0" />
                        <div className="absolute bottom-0 left-1/4 right-1/4 h-6 border-2 border-white border-b-0" />
                      </div>

                      {/* Formation positions visualization */}
                      {(() => {
                        const formationName = Object.keys(selectedSubFormation)[0]
                        const positions = getFormationPositions(formationName)
                        return positions.map((pos, index) => (
                          <div
                            key={index}
                            className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-bounce-in"
                            style={{
                              left: `${pos.x}%`,
                              top: `${pos.y}%`,
                              animationDelay: `${index * 0.1}s`,
                            }}
                          >
                            <div
                              className={`w-6 h-6 rounded-full ${getPositionColor(pos.category)} border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg`}
                            >
                              {pos.position.slice(0, 2)}
                            </div>
                          </div>
                        ))
                      })()}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : selectedFormation ? (
            <div className="text-center py-12 animate-bounce-in">
              <TreePine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">{selectedFormation.formation} Formation Family</h3>
              <p className="text-muted-foreground mb-4">
                This formation has {selectedFormation["sub-formations"].length} tactical variations. Select a
                sub-formation to see detailed analysis.
              </p>
              <Badge variant="outline">{selectedFormation["sub-formations"].length} Sub-formations Available</Badge>
            </div>
          ) : (
            <div className="text-center py-12">
              <TreePine className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Formation Visualizer</h3>
              <p className="text-muted-foreground">
                Select a formation from the list to explore its tactical variations and detailed analysis.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )

  function getFormationPositions(formation: string) {
    const positionMappings: { [key: string]: Array<{ x: number; y: number; position: string; category: string }> } = {
      "4-4-2": [
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 15, y: 45, position: "LM", category: "MF" },
        { x: 35, y: 45, position: "CM", category: "MF" },
        { x: 65, y: 45, position: "CM", category: "MF" },
        { x: 85, y: 45, position: "RM", category: "MF" },
        { x: 35, y: 15, position: "CF", category: "FW" },
        { x: 65, y: 15, position: "CF", category: "FW" },
      ],
      "4-3-3": [
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 35, y: 50, position: "CM", category: "MF" },
        { x: 50, y: 45, position: "CM", category: "MF" },
        { x: 65, y: 50, position: "CM", category: "MF" },
        { x: 15, y: 15, position: "LW", category: "FW" },
        { x: 50, y: 15, position: "CF", category: "FW" },
        { x: 85, y: 15, position: "RW", category: "FW" },
      ],
      "3-4-3": [
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 25, y: 75, position: "CB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 75, y: 75, position: "CB", category: "DF" },
        { x: 15, y: 45, position: "LM", category: "MF" },
        { x: 35, y: 45, position: "CM", category: "MF" },
        { x: 65, y: 45, position: "CM", category: "MF" },
        { x: 85, y: 45, position: "RM", category: "MF" },
        { x: 15, y: 15, position: "LW", category: "FW" },
        { x: 50, y: 15, position: "CF", category: "FW" },
        { x: 85, y: 15, position: "RW", category: "FW" },
      ],
    }
    return positionMappings[formation] || []
  }

  function getPositionColor(category: string) {
    switch (category) {
      case "GK":
        return "bg-chart-5"
      case "DF":
        return "bg-chart-2"
      case "MF":
        return "bg-chart-3"
      case "FW":
        return "bg-chart-1"
      default:
        return "bg-muted"
    }
  }
}
