"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, Users, Zap } from "lucide-react"
import playersData from "@/data/players.json"
import formationsData from "@/data/formations.json"

console.log("[v0] formationsData structure:", formationsData)
console.log("[v0] formationsData.formations:", formationsData?.formations)

// Enhanced color scheme with shades and accents
const POSITION_COLORS = {
  FW: {
    primary: "bg-red-500",
    secondary: "bg-red-400",
    accent: "bg-red-600",
    text: "text-red-500",
    border: "border-red-500",
    glow: "shadow-red-500/50",
  },
  MF: {
    primary: "bg-yellow-500",
    secondary: "bg-yellow-400",
    accent: "bg-yellow-600",
    text: "text-yellow-600",
    border: "border-yellow-500",
    glow: "shadow-yellow-500/50",
  },
  DF: {
    primary: "bg-green-500",
    secondary: "bg-green-400",
    accent: "bg-green-600",
    text: "text-green-600",
    border: "border-green-500",
    glow: "shadow-green-500/50",
  },
  GK: {
    primary: "bg-blue-500",
    secondary: "bg-blue-400",
    accent: "bg-blue-600",
    text: "text-blue-500",
    border: "border-blue-500",
    glow: "shadow-blue-500/50",
  },
}

const getPlayerMainPosition = (position: string) => {
  if (position === "GK") return "GK"
  if (["CB", "LB", "RB", "LWB", "RWB"].includes(position)) return "DF"
  if (["AM", "DM", "CM", "LM", "RM"].includes(position)) return "MF"
  if (["CF", "LW", "RW", "SS"].includes(position)) return "FW"
  return "DF"
}

const getAllPlayers = () => {
  const players: Array<{ name: string; position: string; mainPosition: string }> = []

  if (!playersData?.players) {
    console.log("[v0] Players data is missing")
    return players
  }

  // GK
  if (playersData.players.GK) {
    playersData.players.GK.forEach((name) => {
      players.push({ name, position: "GK", mainPosition: "GK" })
    })
  }

  // DF
  if (playersData.players.DF) {
    Object.entries(playersData.players.DF).forEach(([pos, names]) => {
      if (Array.isArray(names)) {
        names.forEach((name) => {
          players.push({ name, position: pos, mainPosition: "DF" })
        })
      }
    })
  }

  // MF
  if (playersData.players.MF) {
    Object.entries(playersData.players.MF).forEach(([pos, names]) => {
      if (Array.isArray(names)) {
        names.forEach((name) => {
          players.push({ name, position: pos, mainPosition: "MF" })
        })
      }
    })
  }

  // FW
  if (playersData.players.FW) {
    Object.entries(playersData.players.FW).forEach(([pos, names]) => {
      if (Array.isArray(names)) {
        names.forEach((name) => {
          players.push({ name, position: pos, mainPosition: "FW" })
        })
      }
    })
  }

  return players
}

const getFormationPositions = (formation: string, subFormation?: string) => {
  console.log("[v0] Looking for formation:", formation, "subFormation:", subFormation)

  if (!formationsData || !Array.isArray(formationsData.formations)) {
    console.log("[v0] formationsData.formations is not an array:", formationsData)
    return []
  }

  const formationData = formationsData.formations.find((f) => f.name === formation)
  if (!formationData) {
    console.log("[v0] Formation not found:", formation)
    return []
  }

  if (subFormation && formationData.subFormations) {
    const subFormationData = formationData.subFormations.find((sf) => sf.name === subFormation)
    return subFormationData?.positions || formationData.positions || []
  }

  return formationData.positions || []
}

const getBestPlayerForPosition = (requiredPosition: string, availablePlayers: any[], assignedPlayers: Set<string>) => {
  if (!Array.isArray(availablePlayers)) return null

  // First try to find exact position match
  const exactMatch = availablePlayers.find((p) => p.position === requiredPosition && !assignedPlayers.has(p.name))
  if (exactMatch) return exactMatch

  // Then try compatible positions based on formation context
  const compatiblePositions: Record<string, string[]> = {
    LM: ["LW", "LB", "LWB"],
    RM: ["RW", "RB", "RWB"],
    AM: ["CM", "CF"],
    DM: ["CM", "CB"],
    LW: ["LM", "LWB"],
    RW: ["RM", "RWB"],
    CF: ["AM", "SS"],
    SS: ["CF", "AM"],
  }

  const compatible = compatiblePositions[requiredPosition] || []
  for (const pos of compatible) {
    const match = availablePlayers.find((p) => p.position === pos && !assignedPlayers.has(p.name))
    if (match) return match
  }

  // Last resort: any player from same main position category
  const mainPos = getPlayerMainPosition(requiredPosition)
  return availablePlayers.find((p) => p.mainPosition === mainPos && !assignedPlayers.has(p.name))
}

export default function EnhancedPitchVisualizer() {
  const [selectedFormation, setSelectedFormation] = useState("4-3-3")
  const [selectedSubFormation, setSelectedSubFormation] = useState<string>()
  const [selectedPositions, setSelectedPositions] = useState<Set<string>>(new Set(["GK", "DF", "MF", "FW"]))
  const [assignedPlayers, setAssignedPlayers] = useState<Record<string, any>>({})
  const [isFormationModalOpen, setIsFormationModalOpen] = useState(false)

  const allPlayers = getAllPlayers()
  const formationPositions = getFormationPositions(selectedFormation, selectedSubFormation)

  const currentFormation = formationsData?.formations?.find((f) => f.name === selectedFormation)
  const availableFormations = formationsData?.formations || []

  const filteredPlayers = allPlayers.filter((player) => selectedPositions.has(player.mainPosition))

  if (!formationsData || !Array.isArray(formationsData.formations) || formationsData.formations.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6 flex items-center justify-center">
        <Card className="bg-slate-800 border-slate-600 p-8">
          <CardContent>
            <h2 className="text-white text-xl font-bold mb-4">Formation Data Not Available</h2>
            <p className="text-slate-300">
              The formations data could not be loaded. Please check that the formations.json file is properly formatted.
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const togglePositionFilter = (position: string) => {
    const newSelected = new Set(selectedPositions)
    if (newSelected.has(position)) {
      newSelected.delete(position)
    } else {
      newSelected.add(position)
    }
    setSelectedPositions(newSelected)
  }

  const assignBest11 = () => {
    const newAssignments: Record<string, any> = {}
    const assignedPlayerNames = new Set<string>()

    formationPositions.forEach((pos) => {
      const bestPlayer = getBestPlayerForPosition(pos.position, allPlayers, assignedPlayerNames)
      if (bestPlayer) {
        newAssignments[`${pos.x}-${pos.y}`] = bestPlayer
        assignedPlayerNames.add(bestPlayer.name)
      }
    })

    setAssignedPlayers(newAssignments)
  }

  const assignPlayerToPosition = (player: any, positionKey: string) => {
    setAssignedPlayers((prev) => ({
      ...prev,
      [positionKey]: player,
    }))
  }

  const removePlayerFromPosition = (positionKey: string) => {
    setAssignedPlayers((prev) => {
      const newAssignments = { ...prev }
      delete newAssignments[positionKey]
      return newAssignments
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header Controls */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            {/* Formation Selector */}
            <Dialog open={isFormationModalOpen} onOpenChange={setIsFormationModalOpen}>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-slate-800 border-slate-600 text-white hover:bg-slate-700 px-6 py-3 text-lg font-bold"
                >
                  <Users className="w-5 h-5 mr-2" />
                  {selectedFormation}
                  <ChevronDown className="w-4 h-4 ml-2" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-6xl bg-slate-900 border-slate-700">
                <DialogHeader className="bg-red-600 -mx-6 -mt-6 px-6 py-4 mb-6">
                  <DialogTitle className="text-white text-2xl font-bold">FORMATION</DialogTitle>
                </DialogHeader>

                {/* Formation Options */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {availableFormations.map((formation) => (
                    <Button
                      key={formation.name}
                      variant={selectedFormation === formation.name ? "default" : "outline"}
                      className={`${
                        selectedFormation === formation.name
                          ? "bg-yellow-500 text-black border-yellow-400"
                          : "bg-slate-700 border-slate-600 text-white hover:bg-slate-600"
                      } px-4 py-2`}
                      onClick={() => {
                        setSelectedFormation(formation.name)
                        setSelectedSubFormation(undefined)
                      }}
                    >
                      {formation.name}
                    </Button>
                  ))}
                </div>

                {/* Sub-formations */}
                {currentFormation && currentFormation.subFormations && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {currentFormation.subFormations.map((subFormation) => (
                      <Card
                        key={subFormation.name}
                        className={`bg-slate-800 border-slate-600 cursor-pointer transition-all hover:scale-105 ${
                          selectedSubFormation === subFormation.name ? "ring-2 ring-yellow-500" : ""
                        }`}
                        onClick={() => {
                          setSelectedSubFormation(subFormation.name)
                          setIsFormationModalOpen(false)
                        }}
                      >
                        <CardContent className="p-4">
                          {/* Mini Pitch */}
                          <div className="relative bg-green-600 rounded-lg h-32 mb-3 overflow-hidden">
                            <div className="absolute inset-2 border border-white/30 rounded">
                              <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30"></div>
                              <div className="absolute top-1/2 left-1/2 w-4 h-4 border border-white/30 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                            </div>

                            {(subFormation.positions || []).map((pos, idx) => {
                              const colors = POSITION_COLORS[getPlayerMainPosition(pos.position)]
                              return (
                                <div
                                  key={idx}
                                  className={`absolute w-3 h-3 ${colors.primary} rounded-full border border-white/50 transform -translate-x-1/2 -translate-y-1/2`}
                                  style={{
                                    left: `${pos.x}%`,
                                    top: `${pos.y}%`,
                                  }}
                                />
                              )
                            })}
                          </div>

                          <h3 className="text-white font-bold text-center text-lg">{subFormation.name}</h3>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </DialogContent>
            </Dialog>

            {selectedSubFormation && (
              <Badge variant="secondary" className="bg-slate-700 text-white px-3 py-1">
                {selectedSubFormation}
              </Badge>
            )}
          </div>

          {/* Best 11 Button */}
          <Button
            onClick={assignBest11}
            className="bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-black font-bold px-6 py-3 text-lg"
          >
            <Zap className="w-5 h-5 mr-2" />
            BEST 11
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Pitch */}
          <div className="lg:col-span-3">
            <Card className="bg-slate-800 border-slate-600 overflow-hidden">
              <CardContent className="p-0">
                {/* Professional Pitch */}
                <div className="relative bg-gradient-to-b from-green-500 to-green-600 h-[600px] overflow-hidden">
                  {/* Pitch Pattern */}
                  <div className="absolute inset-0 opacity-20">
                    <div
                      className="absolute inset-0"
                      style={{
                        backgroundImage: `repeating-linear-gradient(
                        90deg,
                        transparent,
                        transparent 49px,
                        rgba(255,255,255,0.1) 50px
                      )`,
                      }}
                    ></div>
                  </div>

                  {/* Pitch Markings */}
                  <div className="absolute inset-4 border-2 border-white/80 rounded-lg">
                    {/* Center Line */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-white/80 transform -translate-x-1/2"></div>

                    {/* Center Circle */}
                    <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>
                    <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2"></div>

                    {/* Penalty Areas */}
                    <div className="absolute top-1/2 left-0 w-16 h-32 border-2 border-white/80 border-l-0 transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-0 w-16 h-32 border-2 border-white/80 border-r-0 transform -translate-y-1/2"></div>

                    {/* Goal Areas */}
                    <div className="absolute top-1/2 left-0 w-8 h-16 border-2 border-white/80 border-l-0 transform -translate-y-1/2"></div>
                    <div className="absolute top-1/2 right-0 w-8 h-16 border-2 border-white/80 border-r-0 transform -translate-y-1/2"></div>
                  </div>

                  {/* Player Positions */}
                  {formationPositions.map((position, index) => {
                    const positionKey = `${position.x}-${position.y}`
                    const assignedPlayer = assignedPlayers[positionKey]
                    const colors = POSITION_COLORS[getPlayerMainPosition(position.position)]
                    const isVisible = selectedPositions.has(getPlayerMainPosition(position.position))

                    if (!isVisible) return null

                    return (
                      <div
                        key={index}
                        className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
                        style={{
                          left: `${position.x}%`,
                          top: `${position.y}%`,
                        }}
                        onClick={() => assignedPlayer && removePlayerFromPosition(positionKey)}
                      >
                        {assignedPlayer ? (
                          <div className={`relative animate-bounce-in`}>
                            {/* Player Card */}
                            <div
                              className={`bg-gradient-to-b from-yellow-400 to-yellow-500 rounded-lg p-2 min-w-[80px] shadow-lg ${colors.glow} shadow-lg border-2 border-white/50 group-hover:scale-110 transition-transform`}
                            >
                              <div className="text-center">
                                <div className="text-xs font-bold text-black mb-1">{assignedPlayer.name}</div>
                                <div className={`text-xs px-2 py-0.5 rounded ${colors.primary} text-white font-bold`}>
                                  {assignedPlayer.position}
                                </div>
                              </div>
                            </div>

                            {/* Position mismatch warning */}
                            {assignedPlayer.position !== position.position && (
                              <div className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white text-xs font-bold">!</span>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div
                            className={`w-12 h-12 ${colors.secondary} rounded-full border-2 border-white/80 flex items-center justify-center ${colors.glow} shadow-lg group-hover:scale-110 transition-transform animate-pulse`}
                          >
                            <span className="text-white font-bold text-xs">{position.position}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Position Filters */}
            <Card className="bg-slate-800 border-slate-600">
              <CardContent className="p-4">
                <h3 className="text-white font-bold mb-4">Position Filter</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(POSITION_COLORS).map(([position, colors]) => (
                    <Button
                      key={position}
                      variant={selectedPositions.has(position) ? "default" : "outline"}
                      className={`${
                        selectedPositions.has(position)
                          ? `${colors.primary} text-white hover:${colors.accent}`
                          : "bg-slate-700 border-slate-600 text-slate-300 hover:bg-slate-600"
                      } font-bold`}
                      onClick={() => togglePositionFilter(position)}
                    >
                      {position}
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Available Players */}
            <Card className="bg-slate-800 border-slate-600">
              <CardContent className="p-4">
                <h3 className="text-white font-bold mb-4">Available Players ({filteredPlayers.length})</h3>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {filteredPlayers.map((player, index) => {
                    const colors = POSITION_COLORS[player.mainPosition]
                    const isAssigned = Object.values(assignedPlayers).some((p) => p?.name === player.name)

                    return (
                      <div
                        key={index}
                        className={`p-2 rounded-lg border cursor-pointer transition-all hover:scale-105 ${
                          isAssigned
                            ? "bg-slate-700 border-slate-600 opacity-50"
                            : `bg-slate-700 border-slate-600 hover:${colors.glow} hover:shadow-lg`
                        }`}
                        onClick={() => {
                          if (!isAssigned) {
                            // Find empty position that matches this player
                            const suitablePosition = formationPositions.find((pos) => {
                              const posKey = `${pos.x}-${pos.y}`
                              return (
                                !assignedPlayers[posKey] &&
                                (pos.position === player.position ||
                                  getPlayerMainPosition(pos.position) === player.mainPosition)
                              )
                            })

                            if (suitablePosition) {
                              assignPlayerToPosition(player, `${suitablePosition.x}-${suitablePosition.y}`)
                            }
                          }
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-white font-medium">{player.name}</div>
                            <div className={`text-xs ${colors.text} font-bold`}>{player.position}</div>
                          </div>
                          <div className={`w-3 h-3 ${colors.primary} rounded-full`}></div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
