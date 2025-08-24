"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Checkbox } from "@/components/ui/checkbox"
import { GitCompare, Zap, TreePine } from "lucide-react"
import formationsData from "@/data/formations.json"

interface SubFormation {
  [key: string]: string
  description: string
  shape: string
  notes: string
}

export function FormationComparison() {
  const [selectedFormations, setSelectedFormations] = useState<SubFormation[]>([])
  const [allSubFormations, setAllSubFormations] = useState<Array<SubFormation & { parentFormation: string }>>([])

  useEffect(() => {
    const subForms: Array<SubFormation & { parentFormation: string }> = []
    formationsData.FORMATIONS.forEach((formation) => {
      formation["sub-formations"].forEach((subForm) => {
        // Remove undefined properties to satisfy SubFormation type
        const cleanedSubForm: SubFormation = Object.fromEntries(
          Object.entries(subForm).filter(([v]) => v !== undefined)
        ) as SubFormation
        subForms.push({ ...cleanedSubForm, parentFormation: formation.formation })
      })
    })
    setAllSubFormations(subForms)
  }, [])

  const toggleFormationSelection = (subFormation: SubFormation & { parentFormation: string }) => {
    if (selectedFormations.find((sf) => Object.keys(sf)[0] === Object.keys(subFormation)[0])) {
      setSelectedFormations(selectedFormations.filter((sf) => Object.keys(sf)[0] !== Object.keys(subFormation)[0]))
    } else if (selectedFormations.length < 3) {
      setSelectedFormations([...selectedFormations, subFormation])
    }
  }

  const getShapeColor = (shape: string) => {
    if (shape.toLowerCase().includes("diamond")) return "bg-chart-1"
    if (shape.toLowerCase().includes("triangle")) return "bg-chart-2"
    if (shape.toLowerCase().includes("flat")) return "bg-chart-3"
    return "bg-chart-4"
  }

  const clearSelection = () => {
    setSelectedFormations([])
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formation Selection */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GitCompare className="h-5 w-5 text-primary" />
            Formation Comparison
          </CardTitle>
          <CardDescription>Select up to 3 formations to compare side-by-side</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline">{selectedFormations.length}/3 Selected</Badge>
              {selectedFormations.length > 0 && (
                <Button onClick={clearSelection} variant="outline" size="sm">
                  Clear All
                </Button>
              )}
            </div>

            <ScrollArea className="h-[500px]">
              <div className="space-y-2">
                {allSubFormations.map((subForm, index) => {
                  const subFormName = Object.keys(subForm)[0]
                  const isSelected = selectedFormations.find((sf) => Object.keys(sf)[0] === subFormName)
                  const isDisabled = !isSelected && selectedFormations.length >= 3

                  return (
                    <div
                      key={index}
                      className={`flex items-center space-x-2 p-3 rounded-lg border transition-all hover-lift ${
                        isSelected ? "bg-primary/10 border-primary" : "hover:bg-muted/50"
                      } ${isDisabled ? "opacity-50" : ""}`}
                    >
                      <Checkbox
                        checked={!!isSelected}
                        onCheckedChange={() => !isDisabled && toggleFormationSelection(subForm)}
                        disabled={isDisabled}
                      />
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm">{subFormName}</div>
                        <div className="text-xs text-muted-foreground">
                          {subForm.parentFormation} • {subForm.shape}
                        </div>
                      </div>
                      <div className={`w-3 h-3 rounded-full ${getShapeColor(subForm.shape)}`} />
                    </div>
                  )
                })}
              </div>
            </ScrollArea>
          </div>
        </CardContent>
      </Card>

      {/* Comparison View */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-secondary" />
            Tactical Comparison
          </CardTitle>
          <CardDescription>Side-by-side analysis of selected formations</CardDescription>
        </CardHeader>
        <CardContent>
          {selectedFormations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {selectedFormations.map((formation, index) => {
                const formationName = Object.keys(formation)[0]
                return (
                  <Card
                    key={index}
                    className="animate-slide-in-right border-primary/20"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <CardHeader className="pb-3">
                      <CardTitle className="text-lg">{formationName}</CardTitle>
                      <CardDescription className="text-sm">{formation.parentFormation}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Badge className={`${getShapeColor(formation.shape)} text-white mb-2`}>{formation.shape}</Badge>
                        <p className="text-sm text-muted-foreground">{formation.description}</p>
                      </div>

                      <div className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <TreePine className="h-4 w-4" />
                          Tactical Notes
                        </h4>
                        <p className="text-xs text-muted-foreground leading-relaxed">{formation.notes}</p>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-12">
              <GitCompare className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Compare Formations</h3>
              <p className="text-muted-foreground">
                Select formations from the list to compare their tactical characteristics side-by-side.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
