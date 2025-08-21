"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Users, Shuffle, RotateCcw, Star, AlertTriangle, Target, MapPin } from "lucide-react"
import playersData from "@/data/players.json"
import formationsData from "@/data/formations.json"

interface SquadPosition {
  position: string
  player: string | null
  category: string
  playerOriginalPosition?: string
  playerOriginalCategory?: string
  x?: number
  y?: number
}

interface SubFormation {
  [key: string]: string
  description: string
  shape: string
  notes: string
}

export function SquadBuilder() {
  const [selectedFormation, setSelectedFormation] = useState<string>("")
  const [selectedSubFormation, setSelectedSubFormation] = useState<string>("")
  const [squad, setSquad] = useState<SquadPosition[]>([])
  const [availablePlayers, setAvailablePlayers] = useState<any>(null)
  const [builderMode, setBuilderMode] = useState<"formation" | "player">("formation")
  const [showSquadOnPitch, setShowSquadOnPitch] = useState(false)

  useEffect(() => {
    setAvailablePlayers(playersData.players)
  }, [])

  const getFormationPositions = (formation: string, subFormation?: string): SquadPosition[] => {
    const positionMappings: { [key: string]: SquadPosition[] } = {
      "4-4-2": [
        { position: "GK", player: null, category: "GK" },
        { position: "LB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "RB", player: null, category: "DF" },
        { position: "LM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "RM", player: null, category: "MF" },
        { position: "CF", player: null, category: "FW" },
        { position: "CF", player: null, category: "FW" },
      ],
      "4-3-3": [
        { position: "GK", player: null, category: "GK" },
        { position: "LB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "RB", player: null, category: "DF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "LW", player: null, category: "FW" },
        { position: "CF", player: null, category: "FW" },
        { position: "RW", player: null, category: "FW" },
      ],
      "4-5-1": [
        { position: "GK", player: null, category: "GK" },
        { position: "LB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "RB", player: null, category: "DF" },
        { position: "LM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "RM", player: null, category: "MF" },
        { position: "CF", player: null, category: "FW" },
      ],
      "5-3-2": [
        { position: "GK", player: null, category: "GK" },
        { position: "LWB", player: null, category: "MF" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "RWB", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CF", player: null, category: "FW" },
        { position: "CF", player: null, category: "FW" },
      ],
      "5-2-3": [
        { position: "GK", player: null, category: "GK" },
        { position: "LWB", player: null, category: "MF" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "RWB", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "LW", player: null, category: "FW" },
        { position: "CF", player: null, category: "FW" },
        { position: "RW", player: null, category: "FW" },
      ],
      "5-4-1": [
        { position: "GK", player: null, category: "GK" },
        { position: "LWB", player: null, category: "MF" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "RWB", player: null, category: "MF" },
        { position: "LM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "RM", player: null, category: "MF" },
        { position: "CF", player: null, category: "FW" },
      ],
      "3-5-2": [
        { position: "GK", player: null, category: "GK" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "LWB", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "RWB", player: null, category: "MF" },
        { position: "CF", player: null, category: "FW" },
        { position: "CF", player: null, category: "FW" },
      ],
      "3-4-3": [
        { position: "GK", player: null, category: "GK" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "CB", player: null, category: "DF" },
        { position: "LM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "CM", player: null, category: "MF" },
        { position: "RM", player: null, category: "MF" },
        { position: "LW", player: null, category: "FW" },
        { position: "CF", player: null, category: "FW" },
        { position: "RW", player: null, category: "FW" },
      ],
    }

    return positionMappings[formation] || []
  }

  const getAllAvailablePlayers = () => {
    if (!availablePlayers) return []

    const allPlayers: Array<{ name: string; position: string; category: string }> = []

    // GK
    availablePlayers.GK.forEach((player: string) => {
      allPlayers.push({ name: player, position: "GK", category: "GK" })
    })

    // DF
    Object.entries(availablePlayers.DF).forEach(([pos, players]) => {
      ;(players as string[]).forEach((player: string) => {
        allPlayers.push({ name: player, position: pos, category: "DF" })
      })
    })

    // MF
    Object.entries(availablePlayers.MF).forEach(([pos, players]) => {
      ;(players as string[]).forEach((player: string) => {
        allPlayers.push({ name: player, position: pos, category: "MF" })
      })
    })

    // FW
    Object.entries(availablePlayers.FW).forEach(([pos, players]) => {
      ;(players as string[]).forEach((player: string) => {
        allPlayers.push({ name: player, position: pos, category: "FW" })
      })
    })

    return allPlayers
  }

  const getAvailablePlayersForPosition = (position: string, category: string) => {
    if (!availablePlayers) return []

    // Get players already assigned to avoid duplicates
    const assignedPlayers = squad.filter((s) => s.player).map((s) => s.player)

    let players: string[] = []

    if (category === "GK") {
      players = availablePlayers.GK
    } else if (category === "DF") {
      players = availablePlayers.DF[position as keyof typeof availablePlayers.DF] || []
    } else if (category === "MF") {
      players = availablePlayers.MF[position as keyof typeof availablePlayers.MF] || []
    } else if (category === "FW") {
      players = availablePlayers.FW[position as keyof typeof availablePlayers.FW] || []
    }

    return players.filter((player) => !assignedPlayers.includes(player))
  }

  const assignPlayer = (squadIndex: number, playerName: string) => {
    const newSquad = [...squad]
    const allPlayers = getAllAvailablePlayers()
    const playerData = allPlayers.find((p) => p.name === playerName)

    if (playerData) {
      newSquad[squadIndex].player = playerName
      newSquad[squadIndex].playerOriginalPosition = playerData.position
      newSquad[squadIndex].playerOriginalCategory = playerData.category
    }

    setSquad(newSquad)
  }

  const removePlayer = (squadIndex: number) => {
    const newSquad = [...squad]
    newSquad[squadIndex].player = null
    newSquad[squadIndex].playerOriginalPosition = undefined
    newSquad[squadIndex].playerOriginalCategory = undefined
    setSquad(newSquad)
  }

  const autoFillSquad = () => {
    const newSquad = [...squad]

    newSquad.forEach((position, index) => {
      if (!position.player) {
        const availablePlayers = getAvailablePlayersForPosition(position.position, position.category)
        if (availablePlayers.length > 0) {
          assignPlayer(index, availablePlayers[0])
        }
      }
    })

    setSquad(newSquad)
  }

  const clearSquad = () => {
    const newSquad = squad.map((pos) => ({
      ...pos,
      player: null,
      playerOriginalPosition: undefined,
      playerOriginalCategory: undefined,
    }))
    setSquad(newSquad)
  }

  const getPositionColor = (category: string) => {
    switch (category) {
      case "GK":
        return "bg-chart-5 text-white"
      case "DF":
        return "bg-chart-2 text-white"
      case "MF":
        return "bg-chart-3 text-white"
      case "FW":
        return "bg-chart-1 text-white"
      default:
        return "bg-muted"
    }
  }

  const getSquadCompleteness = () => {
    const filledPositions = squad.filter((pos) => pos.player).length
    return squad.length > 0 ? Math.round((filledPositions / squad.length) * 100) : 0
  }

  const isPlayerOutOfPosition = (squadPosition: SquadPosition) => {
    if (!squadPosition.player || !squadPosition.playerOriginalPosition) return false
    return squadPosition.position !== squadPosition.playerOriginalPosition
  }

  const getSubFormations = (formation: string) => {
    const formationData = formationsData.FORMATIONS.find((f) => f.formation === formation)
    return formationData?.["sub-formations"] || []
  }

  const getSquadPitchPositions = () => {
    const positionMappings: { [key: string]: { [key: string]: { x: number; y: number } } } = {
      "4-4-2": {
        GK: { x: 50, y: 90 },
        LB: { x: 20, y: 70 },
        CB: { x: 40, y: 75 },
        RB: { x: 80, y: 70 },
        LM: { x: 20, y: 45 },
        CM: { x: 40, y: 50 },
        RM: { x: 80, y: 45 },
        CF: { x: 40, y: 20 },
      },
      "4-3-3": {
        GK: { x: 50, y: 90 },
        LB: { x: 20, y: 70 },
        CB: { x: 40, y: 75 },
        RB: { x: 80, y: 70 },
        CM: { x: 50, y: 50 },
        LW: { x: 20, y: 20 },
        CF: { x: 50, y: 15 },
        RW: { x: 80, y: 20 },
      },
      "3-4-3": {
        GK: { x: 50, y: 90 },
        CB: { x: 30, y: 75 },
        LM: { x: 15, y: 50 },
        CM: { x: 45, y: 55 },
        RM: { x: 85, y: 50 },
        LW: { x: 20, y: 20 },
        CF: { x: 50, y: 15 },
        RW: { x: 80, y: 20 },
      },
      "4-5-1": {
        GK: { x: 50, y: 90 },
        LB: { x: 20, y: 70 },
        CB: { x: 40, y: 75 },
        RB: { x: 80, y: 70 },
        LM: { x: 15, y: 45 },
        CM: { x: 35, y: 50 },
        RM: { x: 85, y: 45 },
        CF: { x: 50, y: 15 },
      },
      "5-3-2": {
        GK: { x: 50, y: 90 },
        LWB: { x: 15, y: 65 },
        CB: { x: 35, y: 75 },
        RWB: { x: 85, y: 65 },
        CM: { x: 50, y: 50 },
        CF: { x: 40, y: 20 },
      },
      "5-2-3": {
        GK: { x: 50, y: 90 },
        LWB: { x: 15, y: 65 },
        CB: { x: 35, y: 75 },
        RWB: { x: 85, y: 65 },
        CM: { x: 45, y: 55 },
        LW: { x: 20, y: 20 },
        CF: { x: 50, y: 15 },
        RW: { x: 80, y: 20 },
      },
      "5-4-1": {
        GK: { x: 50, y: 90 },
        LWB: { x: 15, y: 65 },
        CB: { x: 35, y: 75 },
        RWB: { x: 85, y: 65 },
        LM: { x: 25, y: 45 },
        CM: { x: 45, y: 50 },
        RM: { x: 75, y: 45 },
        CF: { x: 50, y: 15 },
      },
      "3-5-2": {
        GK: { x: 50, y: 90 },
        CB: { x: 30, y: 75 },
        LWB: { x: 15, y: 55 },
        CM: { x: 50, y: 50 },
        RWB: { x: 85, y: 55 },
        CF: { x: 40, y: 20 },
      },
    }

    const formationPositions = positionMappings[selectedFormation] || {}

    const positionCounts: { [key: string]: number } = {}
    const squadWithPositions = squad.map((pos, index) => {
      const positionKey = pos.position
      positionCounts[positionKey] = (positionCounts[positionKey] || 0) + 1
      const positionIndex = positionCounts[positionKey] - 1

      const basePosition = formationPositions[pos.position] || { x: 50, y: 50 }

      // Smart positioning for multiple players in same position
      let xOffset = 0
      let yOffset = 0

      if (positionIndex > 0) {
        // Spread players horizontally for same position
        xOffset = (positionIndex % 2 === 0 ? 1 : -1) * (Math.ceil(positionIndex / 2) * 8)
        yOffset = positionIndex > 1 ? (positionIndex % 2 === 0 ? 3 : -3) : 0
      }

      return {
        ...pos,
        x: Math.max(5, Math.min(95, basePosition.x + xOffset)),
        y: Math.max(5, Math.min(95, basePosition.y + yOffset)),
      }
    })

    return squadWithPositions
  }

  return (
    <div className="space-y-6">
      {/* Formation Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Squad Builder
          </CardTitle>
          <CardDescription>Select a formation and build your optimal starting XI</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={builderMode === "formation" ? "default" : "outline"}
              size="sm"
              onClick={() => setBuilderMode("formation")}
            >
              <Target className="h-4 w-4 mr-2" />
              Formation First
            </Button>
            <Button
              variant={builderMode === "player" ? "default" : "outline"}
              size="sm"
              onClick={() => setBuilderMode("player")}
            >
              <Users className="h-4 w-4 mr-2" />
              Player First
            </Button>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="flex-1 space-y-2">
              <Select
                value={selectedFormation}
                onValueChange={(value) => {
                  setSelectedFormation(value)
                  setSelectedSubFormation("")
                  setSquad(getFormationPositions(value))
                }}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Choose a formation..." />
                </SelectTrigger>
                <SelectContent>
                  {formationsData.FORMATIONS.map((formation, index) => (
                    <SelectItem key={index} value={formation.formation}>
                      {formation.formation}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedFormation && getSubFormations(selectedFormation).length > 0 && (
                <Select value={selectedSubFormation} onValueChange={setSelectedSubFormation}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Choose sub-formation (optional)..." />
                  </SelectTrigger>
                  <SelectContent>
                    {getSubFormations(selectedFormation).map((subForm, index) => {
                      const subFormName = Object.keys(subForm)[0]
                      const subFormLabel = subForm[subFormName]
                      return (
                        <SelectItem key={index} value={subFormName}>
                          {subFormName} {subFormLabel && `(${subFormLabel})`}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              )}
            </div>

            {squad.length > 0 && (
              <div className="flex gap-2">
                <Button onClick={autoFillSquad} variant="outline" size="sm">
                  <Shuffle className="h-4 w-4 mr-2" />
                  Auto Fill
                </Button>
                <Button onClick={clearSquad} variant="outline" size="sm">
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Clear
                </Button>
              </div>
            )}
          </div>

          {squad.length > 0 && (
            <div className="mt-4 flex items-center gap-4">
              <Badge variant="outline">Squad Completeness: {getSquadCompleteness()}%</Badge>
              <div className="flex-1 bg-muted rounded-full h-2">
                <div
                  className="bg-primary h-2 rounded-full transition-all duration-500"
                  style={{ width: `${getSquadCompleteness()}%` }}
                />
              </div>
            </div>
          )}

          {selectedSubFormation && (
            <Alert className="mt-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>{selectedSubFormation}:</strong>{" "}
                {
                  getSubFormations(selectedFormation).find((sf) => Object.keys(sf)[0] === selectedSubFormation)
                    ?.description
                }
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Squad Formation */}
      {squad.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-secondary" />
              {selectedFormation} Formation {selectedSubFormation && `- ${selectedSubFormation}`}
            </CardTitle>
            <CardDescription>Assign players to positions in your selected formation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {squad.map((position, index) => (
                <Card
                  key={index}
                  className="hover-lift animate-bounce-in"
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  <CardContent className="p-4">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <Badge className={getPositionColor(position.category)}>{position.position}</Badge>
                        <span className="text-xs text-muted-foreground">{position.category}</span>
                      </div>

                      {position.player ? (
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white text-sm font-bold">
                              {position.player.charAt(0)}
                            </div>
                            <div className="flex-1">
                              <span className="font-medium text-sm">{position.player}</span>
                              {isPlayerOutOfPosition(position) && (
                                <div className="flex items-center gap-1 mt-1">
                                  <AlertTriangle className="h-3 w-3 text-amber-500" />
                                  <span className="text-xs text-amber-600">
                                    Playing as {position.position} (Natural: {position.playerOriginalPosition})
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <Button onClick={() => removePlayer(index)} variant="outline" size="sm" className="w-full">
                            Remove
                          </Button>
                        </div>
                      ) : (
                        <div className="space-y-2">
                          <Select onValueChange={(player) => assignPlayer(index, player)}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select player..." />
                            </SelectTrigger>
                            <SelectContent>
                              {/* Natural position players first */}
                              {getAvailablePlayersForPosition(position.position, position.category).length > 0 && (
                                <>
                                  <SelectItem disabled value="natural-header">
                                    ✅ Natural {position.position} Players
                                  </SelectItem>
                                  {getAvailablePlayersForPosition(position.position, position.category).map(
                                    (player, playerIndex) => (
                                      <SelectItem key={`natural-${playerIndex}`} value={player}>
                                        {player}
                                      </SelectItem>
                                    ),
                                  )}
                                </>
                              )}

                              {/* All other available players */}
                              <SelectItem disabled value="other-header">
                                ⚠️ Other Available Players
                              </SelectItem>
                              {getAllAvailablePlayers()
                                .filter((p) => !squad.some((s) => s.player === p.name))
                                .filter(
                                  (p) =>
                                    !getAvailablePlayersForPosition(position.position, position.category).includes(
                                      p.name,
                                    ),
                                )
                                .map((player, playerIndex) => (
                                  <SelectItem key={`other-${playerIndex}`} value={player.name}>
                                    {player.name} ({player.position})
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>

                          {getAvailablePlayersForPosition(position.position, position.category).length === 0 && (
                            <Alert>
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription className="text-xs">
                                No dedicated {position.position} players available. You can assign players from other
                                positions with tactical adjustments.
                              </AlertDescription>
                            </Alert>
                          )}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {getSquadCompleteness() === 100 && (
              <div className="mt-6 space-y-4">
                <div className="text-center animate-bounce-in">
                  <div className="inline-flex items-center gap-2 bg-chart-3 text-white px-4 py-2 rounded-lg">
                    <Star className="h-4 w-4" />
                    Squad Complete!
                  </div>
                </div>

                <div className="text-center">
                  <Button
                    onClick={() => setShowSquadOnPitch(!showSquadOnPitch)}
                    variant="outline"
                    className="hover-lift"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    {showSquadOnPitch ? "Hide" : "View"} Squad on Pitch
                  </Button>
                </div>

                {showSquadOnPitch && (
                  <Card className="animate-slide-in-right">
                    <CardHeader>
                      <CardTitle className="text-lg">
                        Your Squad on Pitch - {selectedFormation}
                        {selectedSubFormation && ` (${selectedSubFormation})`}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="relative w-full max-w-3xl mx-auto bg-gradient-to-b from-green-400 via-green-500 to-green-600 rounded-xl overflow-hidden shadow-2xl">
                        <div className="aspect-[3/4] relative border-4 border-white/90">
                          {/* Enhanced pitch markings */}
                          <div className="absolute inset-0">
                            {/* Center line */}
                            <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/80 transform -translate-y-0.5" />
                            {/* Center circle */}
                            <div className="absolute top-1/2 left-1/2 w-24 h-24 border-2 border-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-white/80 rounded-full transform -translate-x-1/2 -translate-y-1/2" />

                            {/* Goal areas */}
                            <div className="absolute top-0 left-1/4 right-1/4 h-12 border-2 border-white/80 border-t-0" />
                            <div className="absolute bottom-0 left-1/4 right-1/4 h-12 border-2 border-white/80 border-b-0" />

                            {/* Penalty areas */}
                            <div className="absolute top-0 left-1/6 right-1/6 h-20 border-2 border-white/80 border-t-0" />
                            <div className="absolute bottom-0 left-1/6 right-1/6 h-20 border-2 border-white/80 border-b-0" />

                            {/* Penalty spots */}
                            <div className="absolute top-16 left-1/2 w-1 h-1 bg-white/80 rounded-full transform -translate-x-1/2" />
                            <div className="absolute bottom-16 left-1/2 w-1 h-1 bg-white/80 rounded-full transform -translate-x-1/2" />

                            {/* Corner arcs */}
                            <div className="absolute top-0 left-0 w-4 h-4 border-2 border-white/80 border-t-0 border-l-0 rounded-br-full" />
                            <div className="absolute top-0 right-0 w-4 h-4 border-2 border-white/80 border-t-0 border-r-0 rounded-bl-full" />
                            <div className="absolute bottom-0 left-0 w-4 h-4 border-2 border-white/80 border-b-0 border-l-0 rounded-tr-full" />
                            <div className="absolute bottom-0 right-0 w-4 h-4 border-2 border-white/80 border-b-0 border-r-0 rounded-tl-full" />
                          </div>

                          {/* Squad players with improved positioning */}
                          {getSquadPitchPositions().map(
                            (pos, index) =>
                              pos.player && (
                                <div
                                  key={index}
                                  className="absolute transform -translate-x-1/2 -translate-y-1/2 animate-bounce-in group"
                                  style={{
                                    left: `${pos.x}%`,
                                    top: `${pos.y}%`,
                                    animationDelay: `${index * 0.1}s`,
                                  }}
                                >
                                  <div
                                    className={`w-12 h-12 rounded-full ${getPositionColor(pos.category)} border-3 border-white flex items-center justify-center text-white text-sm font-bold shadow-xl hover:scale-110 transition-all duration-300 cursor-pointer relative`}
                                  >
                                    {pos.player.charAt(0)}
                                    {isPlayerOutOfPosition(pos) && (
                                      <div className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full flex items-center justify-center border border-white">
                                        <AlertTriangle className="h-2 w-2 text-white" />
                                      </div>
                                    )}
                                  </div>

                                  {/* Player name tooltip */}
                                  <div className="absolute top-14 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                                    <div className="bg-black/90 text-white text-xs font-medium px-3 py-1 rounded-lg whitespace-nowrap shadow-lg">
                                      {pos.player}
                                      <div className="text-xs text-gray-300">{pos.position}</div>
                                      {isPlayerOutOfPosition(pos) && (
                                        <div className="text-xs text-amber-300">
                                          Natural: {pos.playerOriginalPosition}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ),
                          )}
                        </div>

                        {/* Formation info overlay */}
                        <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-lg text-sm">
                          {selectedFormation} {selectedSubFormation && `- ${selectedSubFormation}`}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {!selectedFormation && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Build Your Squad</h3>
            <p className="text-muted-foreground">
              Select a formation above to start building your optimal starting XI with your available players.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
