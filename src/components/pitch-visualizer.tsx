"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { MapPin, Users } from "lucide-react"
import formationsData from "@/data/formations.json"

interface PitchPosition {
  x: number
  y: number
  position: string
  category: string
}

export function PitchVisualizer() {
  const [selectedFormation, setSelectedFormation] = useState<string>("")
  const [pitchPositions, setPitchPositions] = useState<PitchPosition[]>([])

  const getFormationPositions = (formation: string): PitchPosition[] => {
    // Simplified pitch positioning - in a real app, you'd have more precise coordinates
    const positionMappings: { [key: string]: PitchPosition[] } = {
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
      "4-5-1": [
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 15, y: 45, position: "LM", category: "MF" },
        { x: 30, y: 45, position: "CM", category: "MF" },
        { x: 50, y: 45, position: "CM", category: "MF" },
        { x: 70, y: 45, position: "CM", category: "MF" },
        { x: 85, y: 45, position: "RM", category: "MF" },
        { x: 50, y: 15, position: "CF", category: "FW" },
      ],
      "5-3-2": [
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 10, y: 75, position: "LWB", category: "MF" },
        { x: 30, y: 75, position: "CB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 70, y: 75, position: "CB", category: "DF" },
        { x: 90, y: 75, position: "RWB", category: "MF" },
        { x: 35, y: 45, position: "CM", category: "MF" },
        { x: 50, y: 45, position: "CM", category: "MF" },
        { x: 65, y: 45, position: "CM", category: "MF" },
        { x: 35, y: 15, position: "CF", category: "FW" },
        { x: 65, y: 15, position: "CF", category: "FW" },
      ],
      "5-2-3": [
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 10, y: 75, position: "LWB", category: "MF" },
        { x: 30, y: 75, position: "CB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 70, y: 75, position: "CB", category: "DF" },
        { x: 90, y: 75, position: "RWB", category: "MF" },
        { x: 40, y: 45, position: "CM", category: "MF" },
        { x: 60, y: 45, position: "CM", category: "MF" },
        { x: 15, y: 15, position: "LW", category: "FW" },
        { x: 50, y: 15, position: "CF", category: "FW" },
        { x: 85, y: 15, position: "RW", category: "FW" },
      ],
      "5-4-1": [
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 10, y: 75, position: "LWB", category: "MF" },
        { x: 30, y: 75, position: "CB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 70, y: 75, position: "CB", category: "DF" },
        { x: 90, y: 75, position: "RWB", category: "MF" },
        { x: 25, y: 45, position: "LM", category: "MF" },
        { x: 40, y: 45, position: "CM", category: "MF" },
        { x: 60, y: 45, position: "CM", category: "MF" },
        { x: 75, y: 45, position: "RM", category: "MF" },
        { x: 50, y: 15, position: "CF", category: "FW" },
      ],
      "3-5-2": [
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 25, y: 75, position: "CB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 75, y: 75, position: "CB", category: "DF" },
        { x: 10, y: 45, position: "LWB", category: "MF" },
        { x: 35, y: 45, position: "CM", category: "MF" },
        { x: 50, y: 45, position: "CM", category: "MF" },
        { x: 65, y: 45, position: "CM", category: "MF" },
        { x: 90, y: 45, position: "RWB", category: "MF" },
        { x: 35, y: 15, position: "CF", category: "FW" },
        { x: 65, y: 15, position: "CF", category: "FW" },
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

  useEffect(() => {
    if (selectedFormation) {
      setPitchPositions(getFormationPositions(selectedFormation))
    }
  }, [selectedFormation])

  const getPositionColor = (category: string) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Pitch Visualizer
        </CardTitle>
        <CardDescription>Visual representation of player positions on the football pitch</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Select value={selectedFormation} onValueChange={setSelectedFormation}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Select formation to visualize..." />
            </SelectTrigger>
            <SelectContent>
              {formationsData.FORMATIONS.map((formation, index) => (
                <SelectItem key={index} value={formation.formation}>
                  {formation.formation}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {selectedFormation && <Badge variant="outline">{pitchPositions.length} Players</Badge>}
        </div>

        {selectedFormation ? (
          <div className="relative">
            {/* Football Pitch */}
            <div className="relative w-full max-w-2xl mx-auto bg-gradient-to-b from-green-400 to-green-500 rounded-lg overflow-hidden">
              <div className="aspect-[2/3] relative border-4 border-white">
                {/* Pitch markings */}
                <div className="absolute inset-0">
                  {/* Center line */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white transform -translate-y-0.5" />
                  {/* Center circle */}
                  <div className="absolute top-1/2 left-1/2 w-20 h-20 border-2 border-white rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                  {/* Goal areas */}
                  <div className="absolute top-0 left-1/4 right-1/4 h-8 border-2 border-white border-t-0" />
                  <div className="absolute bottom-0 left-1/4 right-1/4 h-8 border-2 border-white border-b-0" />
                  {/* Penalty areas */}
                  <div className="absolute top-0 left-1/6 right-1/6 h-16 border-2 border-white border-t-0" />
                  <div className="absolute bottom-0 left-1/6 right-1/6 h-16 border-2 border-white border-b-0" />
                </div>

                {/* Player positions */}
                {pitchPositions.map((pos, index) => (
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
                      className={`w-8 h-8 rounded-full ${getPositionColor(pos.category)} border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 transition-transform cursor-pointer`}
                    >
                      {pos.position.slice(0, 2)}
                    </div>
                    <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs font-medium text-white bg-black/50 px-1 rounded whitespace-nowrap">
                      {pos.position}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Legend */}
            <div className="flex justify-center gap-4 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-chart-5 border border-white" />
                <span className="text-sm">GK</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-chart-2 border border-white" />
                <span className="text-sm">DF</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-chart-3 border border-white" />
                <span className="text-sm">MF</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-chart-1 border border-white" />
                <span className="text-sm">FW</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Pitch Visualization</h3>
            <p className="text-muted-foreground">
              Select a formation to see how players are positioned on the football pitch.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
