"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { LayoutGrid, Shield, Swords, Layers, ListTree, ChevronDown, Info, Zap, TreePine } from "lucide-react"
import formationsData from "@/data/formations.json"

// Type for the formation data structure
type FormationVariant = {
  name: string;
  description: string;
  shape: string;
  notes: string;
};

interface SubFormation extends FormationVariant {
  // This will contain the formation type as a dynamic key
  [key: string]: string | undefined;
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
    console.log('All Formations:', formationsData.FORMATIONS);
    console.log('Number of formations loaded:', formationsData.FORMATIONS.length);
    
    // Log each formation's sub-formations
    formationsData.FORMATIONS.forEach((f, i) => {
      console.log(`Formation ${i + 1}: ${f.formation} has ${f['sub-formations'].length} sub-formations`);
      f['sub-formations'].forEach((sub, j) => {
        const subName = Object.keys(sub).find(k => !['description', 'shape', 'notes'].includes(k));
        console.log(`  Sub-formation ${j + 1}: ${subName}`);
      });
    });

    // Convert the raw data into the typed Formation[] structure
    const parsedFormations: Formation[] = formationsData.FORMATIONS.map((f: any) => ({
      formation: f.formation,
      "sub-formations": f["sub-formations"].map((sub: any) => {
        // Find the dynamic key (the sub-formation name)
        const subName = Object.keys(sub).find(
          (k) => !["description", "shape", "notes"].includes(k)
        );
        return {
          name: subName || "Unknown",
          description: sub.description,
          shape: sub.shape,
          notes: sub.notes,
          ...(subName ? { [subName]: sub[subName] } : {}),
        } as SubFormation;
      }),
    }));

    setFormations(parsedFormations);
    setSelectedFormation(parsedFormations[0]);
  }, [])

  // Helper function to get the formation name from a sub-formation object
  const getFormationName = (subForm: SubFormation): [string, string] => {
    const keys = Object.keys(subForm).filter(k => !['description', 'shape', 'notes'].includes(k));
    const name = keys[0] || 'Unknown';
    const label = subForm[name] as string;
    return [name, label];
  };

  const getFormationIcon = (formation: string) => {
    if (formation.includes("5")) return <Shield className="h-4 w-4 text-blue-500" />
    if (formation.includes("3-4-3") || formation.includes("4-3-3")) return <Swords className="h-4 w-4 text-amber-500" />
    if (formation.includes("4-4-2")) return <Layers className="h-4 w-4 text-emerald-500" />
    if (formation.includes("4-5-1")) return <ListTree className="h-4 w-4 text-purple-500" />
    return <LayoutGrid className="h-4 w-4 text-gray-500" />
  }

  const getShapeColor = (shape: string) => {
    if (shape.toLowerCase().includes("diamond")) return "bg-chart-1"
    if (shape.toLowerCase().includes("triangle")) return "bg-chart-2"
    if (shape.toLowerCase().includes("flat")) return "bg-chart-3"
    return "bg-chart-4"
  }

  const [openFormations, setOpenFormations] = useState<{[key: string]: boolean}>({});

  const toggleFormation = (formation: string) => {
    setOpenFormations(prev => ({
      ...prev,
      [formation]: !prev[formation]
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Formation List */}
      <Card className="lg:col-span-1 border-0 shadow-sm bg-gradient-to-b from-background to-muted/20">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <LayoutGrid className="h-5 w-5 text-primary" />
            Formation Library
          </CardTitle>
          <CardDescription className="text-sm">Select a formation to explore tactical variations</CardDescription>
        </CardHeader>
        <CardContent className="pt-0">
          <ScrollArea className="h-[600px] pr-3 -mr-3">
            <div className="space-y-1">
              {formations.map((formation, index) => (
                <div key={index} className="space-y-1">
                  <div 
                    className="flex flex-col cursor-pointer"
                    onClick={() => toggleFormation(formation.formation)}
                  >
                    <div className="flex items-center justify-between px-3 h-10 rounded-md hover:bg-muted/50 transition-all duration-200">
                      <div className="flex items-center gap-2">
                        {getFormationIcon(formation.formation)}
                        <span className="text-sm font-medium">{formation.formation}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="h-5 rounded-md px-1.5 text-xs font-normal">
                          {formation["sub-formations"].length}
                        </Badge>
                        <ChevronDown 
                          className={`h-4 w-4 opacity-70 transition-transform duration-200 ${
                            openFormations[formation.formation] ? 'rotate-180' : ''
                          }`} 
                        />
                      </div>
                    </div>
                  </div>
                  
                  {openFormations[formation.formation] && (
                    <div className="ml-6 space-y-1 py-1 border-l-2 border-muted/30 pl-3">
                      {formation["sub-formations"].map((subForm, subIndex) => {
                        const [name, label] = getFormationName(subForm);
                        return (
                          <Button
                            key={subIndex}
                            variant={selectedSubFormation === subForm ? "secondary" : "ghost"}
                            className={`w-full justify-start text-sm rounded-md ${
                              selectedSubFormation === subForm 
                                ? 'bg-primary/10 text-foreground' 
                                : 'text-muted-foreground hover:bg-muted/50'
                            }`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedFormation(formation);
                              setSelectedSubFormation(subForm);
                            }}
                          >
                            <span className="truncate">{label || name}</span>
                            <Badge
                              variant="outline"
                              className={`ml-2 text-xs h-5 rounded ${getShapeColor(subForm.shape)}`}
                            >
                              {subForm.shape}
                            </Badge>
                          </Button>
                        );
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
              ? getFormationName(selectedSubFormation)[0]
              : selectedFormation?.formation || "Select a Formation"}
          </CardTitle>
          <CardDescription>
            {selectedSubFormation
              ? getFormationName(selectedSubFormation)[1]
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
                    {getFormationName(selectedSubFormation)[0]}
                  </div>
                  <p className="text-green-600 dark:text-green-400 font-medium">
                    {getFormationName(selectedSubFormation)[1]}
                  </p>
                  <p className="mt-2 text-green-700/80 dark:text-green-300/80">
                    {selectedSubFormation.description}
                  </p>
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

      {/* Debug Section - Remove in production */}
      <div className="lg:col-span-3 p-4 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-800">
        <details className="text-sm">
          <summary className="cursor-pointer font-medium text-gray-700 dark:text-gray-300">Debug Information</summary>
          <div className="mt-2 p-3 bg-white dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700">
            <h4 className="font-semibold mb-2">Formations Loaded: {formations.length}</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {formations.map((formation, i) => (
                <div key={i} className="border p-3 rounded">
                  <div className="font-medium">{formation.formation}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Sub-formations: {formation["sub-formations"].length}
                  </div>
                  <div className="mt-1 text-xs">
                    {formation["sub-formations"].map((sub, j) => {
                      const [name] = getFormationName(sub);
                      return (
                        <div key={j} className="truncate">
                          • {name}: {sub.description.substring(0, 60)}...
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </details>
      </div>
    </div>
  )

  function getFormationPositions(formation: string) {
    const positionMappings: { [key: string]: Array<{ x: number; y: number; position: string; category: string }> } = {
      // 4-4-2 Variations
      "4-4-2": [
        // Standard Flat 4-4-2
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 15, y: 50, position: "LM", category: "MF" },
        { x: 35, y: 50, position: "CM", category: "MF" },
        { x: 65, y: 50, position: "CM", category: "MF" },
        { x: 85, y: 50, position: "RM", category: "MF" },
        { x: 35, y: 15, position: "ST", category: "FW" },
        { x: 65, y: 15, position: "ST", category: "FW" },
      ],
      "4-1-2-1-2": [
        // Diamond 4-4-2
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 50, y: 60, position: "CDM", category: "MF" },
        { x: 20, y: 50, position: "LM", category: "MF" },
        { x: 80, y: 50, position: "RM", category: "MF" },
        { x: 50, y: 40, position: "CAM", category: "MF" },
        { x: 35, y: 15, position: "ST", category: "FW" },
        { x: 65, y: 15, position: "ST", category: "FW" },
      ],
      "4-3-1-2": [
        // Triangle 4-4-2
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 25, y: 55, position: "CM", category: "MF" },
        { x: 50, y: 55, position: "CM", category: "MF" },
        { x: 75, y: 55, position: "CM", category: "MF" },
        { x: 50, y: 35, position: "CAM", category: "MF" },
        { x: 35, y: 15, position: "ST", category: "FW" },
        { x: 65, y: 15, position: "ST", category: "FW" },
      ],
      "4-2-2-2": [
        // Inverted Trapezium 4-4-2
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 30, y: 60, position: "CDM", category: "MF" },
        { x: 70, y: 60, position: "CDM", category: "MF" },
        { x: 25, y: 40, position: "LM", category: "MF" },
        { x: 75, y: 40, position: "RM", category: "MF" },
        { x: 35, y: 15, position: "ST", category: "FW" },
        { x: 65, y: 15, position: "ST", category: "FW" },
      ],
      "4-4-1-1": [
        // Straight line 4-4-1-1
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 15, y: 50, position: "LM", category: "MF" },
        { x: 35, y: 50, position: "CM", category: "MF" },
        { x: 65, y: 50, position: "CM", category: "MF" },
        { x: 85, y: 50, position: "RM", category: "MF" },
        { x: 50, y: 25, position: "CF", category: "FW" },
        { x: 50, y: 15, position: "ST", category: "FW" },
      ],

      // 4-5-1 Variations
      "4-5-1": [
        // Standard Flat 4-5-1
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 10, y: 50, position: "LM", category: "MF" },
        { x: 30, y: 50, position: "CM", category: "MF" },
        { x: 50, y: 50, position: "CM", category: "MF" },
        { x: 70, y: 50, position: "CM", category: "MF" },
        { x: 90, y: 50, position: "RM", category: "MF" },
        { x: 50, y: 15, position: "ST", category: "FW" },
      ],
      "4-1-4-1": [
        // Inverted Equilateral Triangle 4-5-1
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 50, y: 60, position: "CDM", category: "MF" },
        { x: 20, y: 40, position: "LM", category: "MF" },
        { x: 40, y: 35, position: "CM", category: "MF" },
        { x: 60, y: 35, position: "CM", category: "MF" },
        { x: 80, y: 40, position: "RM", category: "MF" },
        { x: 50, y: 15, position: "ST", category: "FW" },
      ],
      "4-2-3-1": [
        // 4-2-3-1 formation
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 30, y: 55, position: "CDM", category: "MF" },
        { x: 70, y: 55, position: "CDM", category: "MF" },
        { x: 20, y: 35, position: "LW", category: "FW" },
        { x: 50, y: 30, position: "CAM", category: "MF" },
        { x: 80, y: 35, position: "RW", category: "FW" },
        { x: 50, y: 10, position: "ST", category: "FW" },
      ],
      "4-3-2-1": [
        // Pyramid 4-5-1
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 25, y: 55, position: "CM", category: "MF" },
        { x: 50, y: 55, position: "CM", category: "MF" },
        { x: 75, y: 55, position: "CM", category: "MF" },
        { x: 35, y: 30, position: "LF", category: "FW" },
        { x: 65, y: 30, position: "RF", category: "FW" },
        { x: 50, y: 15, position: "ST", category: "FW" },
      ],
      
      // 4-3-3 Variations
      "4-3-3": [
        // Standard Flat 4-3-3
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 30, y: 55, position: "CM", category: "MF" },
        { x: 50, y: 50, position: "CM", category: "MF" },
        { x: 70, y: 55, position: "CM", category: "MF" },
        { x: 15, y: 15, position: "LW", category: "FW" },
        { x: 50, y: 15, position: "ST", category: "FW" },
        { x: 85, y: 15, position: "RW", category: "FW" },
      ],
      "4-1-2-3": [
        // Inverted Equilateral Triangle 4-3-3
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 50, y: 60, position: "CDM", category: "MF" },
        { x: 30, y: 40, position: "CM", category: "MF" },
        { x: 70, y: 40, position: "CM", category: "MF" },
        { x: 15, y: 15, position: "LW", category: "FW" },
        { x: 50, y: 15, position: "ST", category: "FW" },
        { x: 85, y: 15, position: "RW", category: "FW" },
      ],
      "4-2-1-3": [
        // Equilateral Triangle 4-3-3
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LB", category: "DF" },
        { x: 35, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RB", category: "DF" },
        { x: 35, y: 55, position: "CDM", category: "MF" },
        { x: 65, y: 55, position: "CDM", category: "MF" },
        { x: 50, y: 40, position: "CAM", category: "MF" },
        { x: 15, y: 15, position: "LW", category: "FW" },
        { x: 50, y: 15, position: "ST", category: "FW" },
        { x: 85, y: 15, position: "RW", category: "FW" },
      ],

      // 3-5-2 Variations
      "3-5-2": [
        // Standard 3-5-2
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 25, y: 75, position: "LCB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 75, y: 75, position: "RCB", category: "DF" },
        { x: 10, y: 50, position: "LWB", category: "MF" },
        { x: 30, y: 50, position: "CM", category: "MF" },
        { x: 50, y: 45, position: "CM", category: "MF" },
        { x: 70, y: 50, position: "CM", category: "MF" },
        { x: 90, y: 50, position: "RWB", category: "MF" },
        { x: 35, y: 15, position: "ST", category: "FW" },
        { x: 65, y: 15, position: "ST", category: "FW" },
      ],
      "5-2-1-2": [
        // 3-5-2 with CAM
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LCB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 85, y: 75, position: "RCB", category: "DF" },
        { x: 10, y: 50, position: "LWB", category: "MF" },
        { x: 30, y: 50, position: "CM", category: "MF" },
        { x: 70, y: 50, position: "CM", category: "MF" },
        { x: 90, y: 50, position: "RWB", category: "MF" },
        { x: 50, y: 35, position: "CAM", category: "MF" },
        { x: 35, y: 15, position: "ST", category: "FW" },
        { x: 65, y: 15, position: "ST", category: "FW" },
      ],

      // 3-4-3 Variations
      "3-4-3": [
        // Standard 3-4-3
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 25, y: 75, position: "LCB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 75, y: 75, position: "RCB", category: "DF" },
        { x: 15, y: 50, position: "LM", category: "MF" },
        { x: 40, y: 50, position: "CM", category: "MF" },
        { x: 60, y: 50, position: "CM", category: "MF" },
        { x: 85, y: 50, position: "RM", category: "MF" },
        { x: 15, y: 15, position: "LW", category: "FW" },
        { x: 50, y: 15, position: "ST", category: "FW" },
        { x: 85, y: 15, position: "RW", category: "FW" },
      ],
      "3-4-2-1": [
        // 3-4-2-1 formation
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 25, y: 75, position: "LCB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 75, y: 75, position: "RCB", category: "DF" },
        { x: 15, y: 50, position: "LM", category: "MF" },
        { x: 40, y: 50, position: "CM", category: "MF" },
        { x: 60, y: 50, position: "CM", category: "MF" },
        { x: 85, y: 50, position: "RM", category: "MF" },
        { x: 30, y: 25, position: "LF", category: "FW" },
        { x: 70, y: 25, position: "RF", category: "FW" },
        { x: 50, y: 10, position: "ST", category: "FW" },
      ],

      // 5-3-2 Variations
      "5-3-2": [
        // Standard 5-3-2
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 15, y: 75, position: "LWB", category: "DF" },
        { x: 35, y: 75, position: "LCB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 65, y: 75, position: "RCB", category: "DF" },
        { x: 85, y: 75, position: "RWB", category: "DF" },
        { x: 30, y: 50, position: "CM", category: "MF" },
        { x: 50, y: 50, position: "CM", category: "MF" },
        { x: 70, y: 50, position: "CM", category: "MF" },
        { x: 35, y: 15, position: "ST", category: "FW" },
        { x: 65, y: 15, position: "ST", category: "FW" },
      ],

      // 5-2-3 Variations
      "5-2-3": [
        // Standard 5-2-3
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 10, y: 75, position: "LWB", category: "DF" },
        { x: 30, y: 75, position: "LCB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 70, y: 75, position: "RCB", category: "DF" },
        { x: 90, y: 75, position: "RWB", category: "DF" },
        { x: 35, y: 50, position: "CM", category: "MF" },
        { x: 65, y: 50, position: "CM", category: "MF" },
        { x: 25, y: 15, position: "LW", category: "FW" },
        { x: 50, y: 15, position: "ST", category: "FW" },
        { x: 75, y: 15, position: "RW", category: "FW" },
      ],
      "5-2-2-1": [
        // 5-2-2-1 formation
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 10, y: 75, position: "LWB", category: "DF" },
        { x: 30, y: 75, position: "LCB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 70, y: 75, position: "RCB", category: "DF" },
        { x: 90, y: 75, position: "RWB", category: "DF" },
        { x: 35, y: 50, position: "CM", category: "MF" },
        { x: 65, y: 50, position: "CM", category: "MF" },
        { x: 30, y: 25, position: "LF", category: "FW" },
        { x: 70, y: 25, position: "RF", category: "FW" },
        { x: 50, y: 10, position: "ST", category: "FW" },
      ],

      // 5-4-1 Variations
      "5-4-1": [
        // Standard 5-4-1
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 10, y: 75, position: "LWB", category: "DF" },
        { x: 30, y: 75, position: "LCB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 70, y: 75, position: "RCB", category: "DF" },
        { x: 90, y: 75, position: "RWB", category: "DF" },
        { x: 15, y: 50, position: "LM", category: "MF" },
        { x: 35, y: 50, position: "CM", category: "MF" },
        { x: 65, y: 50, position: "CM", category: "MF" },
        { x: 85, y: 50, position: "RM", category: "MF" },
        { x: 50, y: 15, position: "ST", category: "FW" },
      ],
      "5-1-2-1-1": [
        // Diamond 5-4-1
        { x: 50, y: 95, position: "GK", category: "GK" },
        { x: 10, y: 75, position: "LWB", category: "DF" },
        { x: 30, y: 75, position: "LCB", category: "DF" },
        { x: 50, y: 75, position: "CB", category: "DF" },
        { x: 70, y: 75, position: "RCB", category: "DF" },
        { x: 90, y: 75, position: "RWB", category: "DF" },
        { x: 50, y: 60, position: "CDM", category: "MF" },
        { x: 25, y: 40, position: "LM", category: "MF" },
        { x: 75, y: 40, position: "RM", category: "MF" },
        { x: 50, y: 30, position: "CAM", category: "MF" },
        { x: 50, y: 10, position: "ST", category: "FW" },
      ]
    };
    
    // Extract just the formation numbers (e.g., "4-4-2" from "4-4-2 Standard Flat")
    const baseFormation = formation.split(' ')[0];
    return positionMappings[baseFormation] || [];
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
