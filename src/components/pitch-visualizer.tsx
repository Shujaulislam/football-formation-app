"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Users, ChevronDown, ChevronRight } from "lucide-react"
import formationsData from "@/data/formations.json"
// Import centralized formation positions
import { getFormationPositions } from "@/data/formationPositions"

interface PitchPosition {
  x: number
  y: number
  position: string
  category: string
}

// Using any type for the complex formations.json structure to avoid type conflicts
type FormationData = any

export function PitchVisualizer() {
  const [selectedFormation, setSelectedFormation] = useState<string>("");
  const [pitchPositions, setPitchPositions] = useState<PitchPosition[]>([]);
  const [expandedFormations, setExpandedFormations] = useState<Set<string>>(new Set());

  // NEW: Use centralized formation positions
  const getFormationPositionsFromCentral = (formation: string): PitchPosition[] => {
    const positions = getFormationPositions(formation);
    // Convert FormationPosition to PitchPosition (they have the same structure)
    return positions.map(pos => ({
      x: pos.x,
      y: pos.y,
      position: pos.position,
      category: pos.category
    }));
  };

  // NEW: Toggle formation expansion
  const toggleFormationExpansion = (formation: string) => {
    const newExpanded = new Set(expandedFormations);
    if (newExpanded.has(formation)) {
      newExpanded.delete(formation);
    } else {
      newExpanded.add(formation);
    }
    setExpandedFormations(newExpanded);
  };

  // NEW: Handle sub-formation selection
  const handleSubFormationSelect = (subFormationKey: string) => {
    setSelectedFormation(subFormationKey);
  };

  // OLD: Commented out hardcoded formation positions
  /*
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
        { x: 30, y: 75, position: "LCB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 70, y: 75, position: "RCB", category: "DF" },
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
        { x: 30, y: 75, position: "LCB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 70, y: 75, position: "RCB", category: "DF" },
        { x: 90, y: 75, position: "RWB", category: "MF" },
        { x: 35, y: 50, position: "CM", category: "MF" },
        { x: 65, y: 50, position: "CM", category: "MF" },
        { x: 25, y: 15, position: "LW", category: "FW" },
        { x: 50, y: 15, position: "CF", category: "FW" },
        { x: 75, y: 15, position: "RW", category: "FW" },
      ],
      "5-4-1": [
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 10, y: 75, position: "LWB", category: "MF" },
        { x: 30, y: 75, position: "LCB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 70, y: 75, position: "RCB", category: "DF" },
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
    };

    return positionMappings[formation] || [];
  };
  */

  useEffect(() => {
    if (selectedFormation) {
      // NEW: Use centralized function
      setPitchPositions(getFormationPositionsFromCentral(selectedFormation));
      
      // OLD: Commented out old function call
      // setPitchPositions(getFormationPositions(selectedFormation));
    }
  }, [selectedFormation]);

  const getPositionColor = (category: string) => {
    switch (category) {
      case "GK":
        return "bg-chart-5";
      case "DF":
        return "bg-chart-2";
      case "MF":
        return "bg-chart-3";
      case "FW":
        return "bg-chart-1";
      default:
        return "bg-muted";
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5 text-primary" />
          Pitch Visualizer (With Sub-Formations)
        </CardTitle>
        <CardDescription>
          Visual representation of player positions on the football pitch using centralized formation data with sub-formation support
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* NEW: Hierarchical Formation Selector */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Select Formation:</h3>
          
          {/* Base Formations with Expandable Sub-Formations */}
          <div className="space-y-2 max-h-96 overflow-y-auto border rounded-lg p-4">
            {formationsData.FORMATIONS.map((formationGroup: FormationData, groupIndex: number) => (
              <div key={groupIndex} className="border-b border-gray-200 last:border-b-0 pb-2">
                {/* Base Formation Header */}
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => toggleFormationExpansion(formationGroup.formation)}
                    className="flex items-center gap-2 text-left hover:bg-gray-50 dark:hover:bg-gray-800 p-2 rounded-lg w-full transition-colors"
                  >
                    {expandedFormations.has(formationGroup.formation) ? (
                      <ChevronDown className="h-4 w-4 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-4 w-4 text-gray-500" />
                    )}
                    <span className="font-semibold text-lg">{formationGroup.formation}</span>
                    <Badge variant="secondary" className="ml-2">
                      {formationGroup["sub-formations"].length} variants
                    </Badge>
                  </button>
                </div>

                {/* Sub-Formations (Expandable) */}
                {expandedFormations.has(formationGroup.formation) && (
                  <div className="ml-6 mt-2 space-y-2">
                    {formationGroup["sub-formations"].map((subFormation: any, subIndex: number) => {
                      const subFormationKey = Object.keys(subFormation).find(key => key !== 'description' && key !== 'shape' && key !== 'notes');
                      const subFormationName = subFormationKey ? subFormation[subFormationKey] : 'Standard';
                      
                      return (
                        <div key={subIndex} className="flex items-center gap-3 p-2 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors">
                          <button
                            onClick={() => handleSubFormationSelect(subFormationKey || '')}
                            className={`flex-1 text-left p-2 rounded-lg transition-all ${
                              selectedFormation === subFormationKey
                                ? 'bg-blue-100 dark:bg-blue-800 text-blue-900 dark:text-blue-100 border-2 border-blue-300 dark:border-blue-600'
                                : 'hover:bg-blue-100 dark:hover:bg-blue-800'
                            }`}
                          >
                            <div className="font-medium">{subFormationName}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {subFormation.description}
                            </div>
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* OLD: Simple Select (Commented out but kept for reference) */}
          {/*
          <div className="flex items-center gap-4">
            <Select
              value={selectedFormation}
              onValueChange={setSelectedFormation}
            >
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

            {selectedFormation && (
              <Badge variant="outline">{pitchPositions.length} Players</Badge>
            )}
          </div>
          */}
        </div>

        {/* Debug Info - Show what formation was selected */}
        {selectedFormation && (
          <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Debug:</strong> Selected formation: &ldquo;{selectedFormation}&rdquo; | 
              Positions found: {pitchPositions.length} | 
              First position: {pitchPositions[0] ? `${pitchPositions[0].position} at (${pitchPositions[0].x}%, ${pitchPositions[0].y}%)` : 'None'}
            </p>
          </div>
        )}

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
                      className={`w-8 h-8 rounded-full ${getPositionColor(
                        pos.category
                      )} border-2 border-white flex items-center justify-center text-white text-xs font-bold shadow-lg hover:scale-110 transition-transform cursor-pointer`}
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
              Select a formation from the list above to see how players are positioned on the
              football pitch using centralized formation data with sub-formation support.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
