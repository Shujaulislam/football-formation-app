"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Progress } from "@/components/ui/progress"
import { Users, Search, AlertCircle, CheckCircle, Target, Star, Zap } from "lucide-react"
import playersData from "@/data/players.json"
import formationsData from "@/data/formations.json"

interface PlayerData {
  players: {
    GK: string[]
    DF: {
      CB: string[]
      LB: string[]
      RB: string[]
    }
    MF: {
      AM: string[]
      DM: string[]
      CM: string[]
      LM: string[]
      RM: string[]
      LWB: string[]
      RWB: string[]
    }
    FW: {
      CF: string[]
      LW: string[]
      RW: string[]
      SS: string[]
    }
  }
}

export function PlayerPositionMatcher() {
  const [players, setPlayers] = useState<PlayerData["players"] | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedPosition, setSelectedPosition] = useState<string | null>(null)
  const [selectedFormationForCheck, setSelectedFormationForCheck] = useState<string>("")
  const [showFlexibilityMatrix, setShowFlexibilityMatrix] = useState(false)

  useEffect(() => {
    setPlayers(playersData.players)
  }, [])

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

  const getPositionIcon = (category: string) => {
    switch (category) {
      case "GK":
        return "🥅"
      case "DF":
        return "🛡️"
      case "MF":
        return "⚡"
      case "FW":
        return "⚽"
      default:
        return "👤"
    }
  }

  const getAllPositions = () => {
    if (!players) return []

    const positions = []

    // GK
    positions.push({ category: "GK", position: "GK", players: players.GK, count: players.GK.length })

    // DF
    Object.entries(players.DF).forEach(([pos, playerList]) => {
      positions.push({ category: "DF", position: pos, players: playerList, count: playerList.length })
    })

    // MF
    Object.entries(players.MF).forEach(([pos, playerList]) => {
      positions.push({ category: "MF", position: pos, players: playerList, count: playerList.length })
    })

    // FW
    Object.entries(players.FW).forEach(([pos, playerList]) => {
      positions.push({ category: "FW", position: pos, players: playerList, count: playerList.length })
    })

    return positions
  }

  const filteredPositions = getAllPositions().filter(
    (pos) =>
      pos.position.toLowerCase().includes(searchTerm.toLowerCase()) ||
      pos.players.some((player) => player.toLowerCase().includes(searchTerm.toLowerCase())),
  )

  const getPlayersByPosition = (position: string) => {
    const posData = getAllPositions().find((p) => p.position === position)
    return posData?.players || []
  }

  const getPlayerVersatilityScore = (playerName: string): number => {
    if (!players) return 0

    let positionCount = 0
    const totalPositions = 13 // Total possible positions

    // Check GK
    if (players.GK.includes(playerName)) positionCount++

    // Check DF positions
    Object.values(players.DF).forEach((positionPlayers) => {
      if (positionPlayers.includes(playerName)) positionCount++
    })

    // Check MF positions
    Object.values(players.MF).forEach((positionPlayers) => {
      if (positionPlayers.includes(playerName)) positionCount++
    })

    // Check FW positions
    Object.values(players.FW).forEach((positionPlayers) => {
      if (positionPlayers.includes(playerName)) positionCount++
    })

    // Convert to percentage with proper calculation
    return Math.round((positionCount / totalPositions) * 100)
  }

  const getAllPlayersWithPositions = () => {
    if (!players) return []

    const allPlayers: Array<{ name: string; positions: string[]; category: string; versatility: number }> = []

    // GK
    players.GK.forEach((player) => {
      allPlayers.push({
        name: player,
        positions: ["GK"],
        category: "GK",
        versatility: getPlayerVersatilityScore(player),
      })
    })

    // DF
    Object.entries(players.DF).forEach(([pos, playerList]) => {
      playerList.forEach((player) => {
        const existingPlayer = allPlayers.find((p) => p.name === player)
        if (existingPlayer) {
          existingPlayer.positions.push(pos)
          existingPlayer.versatility = getPlayerVersatilityScore(player)
        } else {
          allPlayers.push({
            name: player,
            positions: [pos],
            category: "DF",
            versatility: getPlayerVersatilityScore(player),
          })
        }
      })
    })

    // MF
    Object.entries(players.MF).forEach(([pos, playerList]) => {
      playerList.forEach((player) => {
        const existingPlayer = allPlayers.find((p) => p.name === player)
        if (existingPlayer) {
          existingPlayer.positions.push(pos)
          existingPlayer.versatility = getPlayerVersatilityScore(player)
        } else {
          allPlayers.push({
            name: player,
            positions: [pos],
            category: "MF",
            versatility: getPlayerVersatilityScore(player),
          })
        }
      })
    })

    // FW
    Object.entries(players.FW).forEach(([pos, playerList]) => {
      playerList.forEach((player) => {
        const existingPlayer = allPlayers.find((p) => p.name === player)
        if (existingPlayer) {
          existingPlayer.positions.push(pos)
          existingPlayer.versatility = getPlayerVersatilityScore(player)
        } else {
          allPlayers.push({
            name: player,
            positions: [pos],
            category: "FW",
            versatility: getPlayerVersatilityScore(player),
          })
        }
      })
    })

    return allPlayers
  }

  const checkFormationCompatibility = (formation: string) => {
    const formationPositions = getFormationPositions(formation)
    if (formationPositions.length === 0) return { compatibility: [], compatibilityScore: 0 }

    const compatibility = formationPositions.map((pos) => {
      const availablePlayers = getAvailablePlayersForPosition(pos.position, pos.category)
      const fallbackPlayers = getAllAvailablePlayersForCrossPosition(pos.position, pos.category)
      const totalAvailable = availablePlayers.length + fallbackPlayers.length

      return {
        position: pos.position,
        category: pos.category,
        availablePlayers: availablePlayers.length,
        fallbackPlayers: fallbackPlayers.length,
        totalAvailable,
        hasPlayers: totalAvailable > 0,
        players: [...availablePlayers, ...fallbackPlayers.map((p) => `${p.name} (${p.position})`)],
      }
    })

    const totalPositions = compatibility.length
    const filledPositions = compatibility.filter((p) => p.hasPlayers).length
    const compatibilityScore = totalPositions > 0 ? Math.round((filledPositions / totalPositions) * 100) : 0

    return { compatibility, compatibilityScore }
  }

  const getFormationPositions = (formation: string) => {
    const positionMappings: { [key: string]: Array<{ position: string; category: string }> } = {
      "4-4-2": [
        { position: "GK", category: "GK" },
        { position: "LB", category: "DF" },
        { position: "CB", category: "DF" },
        { position: "CB", category: "DF" },
        { position: "RB", category: "DF" },
        { position: "LM", category: "MF" },
        { position: "CM", category: "MF" },
        { position: "CM", category: "MF" },
        { position: "RM", category: "MF" },
        { position: "CF", category: "FW" },
        { position: "CF", category: "FW" },
      ],
      "4-3-3": [
        { position: "GK", category: "GK" },
        { position: "LB", category: "DF" },
        { position: "CB", category: "DF" },
        { position: "CB", category: "DF" },
        { position: "RB", category: "DF" },
        { position: "CM", category: "MF" },
        { position: "CM", category: "MF" },
        { position: "CM", category: "MF" },
        { position: "LW", category: "FW" },
        { position: "CF", category: "FW" },
        { position: "RW", category: "FW" },
      ],
      "3-4-3": [
        { position: "GK", category: "GK" },
        { position: "CB", category: "DF" },
        { position: "CB", category: "DF" },
        { position: "CB", category: "DF" },
        { position: "LM", category: "MF" },
        { position: "CM", category: "MF" },
        { position: "CM", category: "MF" },
        { position: "RM", category: "MF" },
        { position: "LW", category: "FW" },
        { position: "CF", category: "FW" },
        { position: "RW", category: "FW" },
      ],
    }
    return positionMappings[formation] || []
  }

  const getAvailablePlayersForPosition = (position: string, category: string) => {
    if (!players) return []

    let positionPlayers: string[] = []

    if (category === "GK") {
      positionPlayers = players.GK
    } else if (category === "DF") {
      positionPlayers = players.DF[position as keyof typeof players.DF] || []
    } else if (category === "MF") {
      positionPlayers = players.MF[position as keyof typeof players.MF] || []
    } else if (category === "FW") {
      positionPlayers = players.FW[position as keyof typeof players.FW] || []
    }

    return positionPlayers
  }

  const getAllAvailablePlayersForCrossPosition = (targetPosition: string, targetCategory: string) => {
    if (!players) return []

    const crossPositionSuggestions: Array<{ name: string; position: string; category: string }> = []

    // Smart cross-position logic based on tactical compatibility
    if (targetPosition === "LM" || targetPosition === "RM") {
      // Wing midfielders can be filled by wingers or fullbacks
      if (targetPosition === "LM") {
        players.FW.LW.forEach((player) =>
          crossPositionSuggestions.push({ name: player, position: "LW", category: "FW" }),
        )
        players.DF.LB.forEach((player) =>
          crossPositionSuggestions.push({ name: player, position: "LB", category: "DF" }),
        )
      } else {
        players.FW.RW.forEach((player) =>
          crossPositionSuggestions.push({ name: player, position: "RW", category: "FW" }),
        )
        players.DF.RB.forEach((player) =>
          crossPositionSuggestions.push({ name: player, position: "RB", category: "DF" }),
        )
      }
    }

    // Center midfielders can play AM/DM
    if (targetPosition === "CM") {
      players.MF.AM.forEach((player) => crossPositionSuggestions.push({ name: player, position: "AM", category: "MF" }))
      players.MF.DM.forEach((player) => crossPositionSuggestions.push({ name: player, position: "DM", category: "MF" }))
    }

    // Wingers can play as wing midfielders
    if (targetPosition === "LW") {
      players.MF.LM.forEach((player) => crossPositionSuggestions.push({ name: player, position: "LM", category: "MF" }))
    }
    if (targetPosition === "RW") {
      players.MF.RM.forEach((player) => crossPositionSuggestions.push({ name: player, position: "RM", category: "MF" }))
    }

    return crossPositionSuggestions.slice(0, 3) // Limit to top 3 suggestions
  }

  return (
    <div className="space-y-6">
      {/* Feature Toggle Buttons */}
      <div className="flex gap-2 flex-wrap">
        <Button
          variant={!showFlexibilityMatrix && !selectedFormationForCheck ? "default" : "outline"}
          onClick={() => {
            setShowFlexibilityMatrix(false)
            setSelectedFormationForCheck("")
          }}
        >
          <Target className="h-4 w-4 mr-2" />
          Position Analysis
        </Button>
        <Button
          variant={showFlexibilityMatrix ? "default" : "outline"}
          onClick={() => {
            setShowFlexibilityMatrix(true)
            setSelectedFormationForCheck("")
          }}
        >
          <Star className="h-4 w-4 mr-2" />
          Flexibility Matrix
        </Button>
        <Select value={selectedFormationForCheck} onValueChange={setSelectedFormationForCheck}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder="Formation Compatibility Check..." />
          </SelectTrigger>
          <SelectContent>
            {formationsData.FORMATIONS.map((formation, index) => (
              <SelectItem key={index} value={formation.formation}>
                <Zap className="h-4 w-4 mr-2 inline" />
                {formation.formation}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Formation Compatibility Checker */}
      {selectedFormationForCheck && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              Formation Compatibility: {selectedFormationForCheck}
            </CardTitle>
            <CardDescription>Analyze how well your squad fits this formation</CardDescription>
          </CardHeader>
          <CardContent>
            {(() => {
              const { compatibility, compatibilityScore } = checkFormationCompatibility(selectedFormationForCheck)
              return (
                <div className="space-y-4">
                  <div className="flex items-center gap-4">
                    <Badge
                      variant={
                        compatibilityScore >= 80 ? "default" : compatibilityScore >= 60 ? "secondary" : "destructive"
                      }
                    >
                      {compatibilityScore}% Compatible
                    </Badge>
                    <Progress value={compatibilityScore} className="flex-1" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {compatibility.map((pos, index) => (
                      <Card key={index} className={`border ${pos.hasPlayers ? "border-green-200" : "border-red-200"}`}>
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between mb-2">
                            <Badge className={getPositionColor(pos.category)}>{pos.position}</Badge>
                            {pos.hasPlayers ? (
                              <CheckCircle className="h-4 w-4 text-green-500" />
                            ) : (
                              <AlertCircle className="h-4 w-4 text-red-500" />
                            )}
                          </div>
                          <div className="text-sm">
                            {pos.availablePlayers} natural + {pos.fallbackPlayers} adaptable
                          </div>
                          {pos.players.length > 0 && (
                            <div className="text-xs text-muted-foreground mt-1">
                              {pos.players.slice(0, 2).join(", ")}
                              {pos.players.length > 2 && ` +${pos.players.length - 2} more`}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      {/* Position Flexibility Matrix */}
      {showFlexibilityMatrix && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Star className="h-5 w-5 text-secondary" />
              Player Flexibility Matrix
            </CardTitle>
            <CardDescription>Player versatility and multi-position capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {getAllPlayersWithPositions()
                .sort((a, b) => b.versatility - a.versatility)
                .map((player, index) => (
                  <Card key={index} className="hover-lift">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                          {player.name.charAt(0)}
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{player.name}</div>
                          <div className="flex gap-1 mt-1">
                            {player.positions.map((pos, posIndex) => (
                              <Badge key={posIndex} variant="outline" className="text-xs">
                                {pos}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold text-lg">{player.versatility}%</div>
                          <div className="text-xs text-muted-foreground">Versatility</div>
                          <Progress value={player.versatility} className="w-20 mt-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Original Position Analysis */}
      {!showFlexibilityMatrix && !selectedFormationForCheck && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Position Overview */}
          <Card className="lg:col-span-1">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Position Analysis
              </CardTitle>
              <CardDescription>Player distribution across all positions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search positions or players..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <ScrollArea className="h-[500px]">
                  <div className="space-y-2">
                    {filteredPositions.map((pos, index) => (
                      <Button
                        key={index}
                        variant={selectedPosition === pos.position ? "default" : "outline"}
                        className="w-full justify-start hover-lift"
                        onClick={() => setSelectedPosition(pos.position)}
                      >
                        <span className="text-lg mr-2">{getPositionIcon(pos.category)}</span>
                        <div className="flex-1 text-left">
                          <div className="font-semibold">{pos.position}</div>
                          <div className="text-xs text-muted-foreground">
                            {pos.category} • {pos.count} players
                          </div>
                        </div>
                        {pos.count === 0 ? (
                          <AlertCircle className="h-4 w-4 text-destructive" />
                        ) : (
                          <CheckCircle className="h-4 w-4 text-chart-3" />
                        )}
                      </Button>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            </CardContent>
          </Card>

          {/* Player Details */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-secondary" />
                {selectedPosition ? `${selectedPosition} Players` : "Player Details"}
              </CardTitle>
              <CardDescription>
                {selectedPosition
                  ? `Available players for ${selectedPosition} position`
                  : "Select a position to view available players"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedPosition ? (
                <div className="animate-slide-in-right">
                  {getPlayersByPosition(selectedPosition).length > 0 ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 mb-4">
                        <Badge
                          className={getPositionColor(
                            getAllPositions().find((p) => p.position === selectedPosition)?.category || "",
                          )}
                        >
                          {selectedPosition}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {getPlayersByPosition(selectedPosition).length} available players
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {getPlayersByPosition(selectedPosition).map((player, index) => (
                          <Card
                            key={index}
                            className="hover-lift border-primary/20 animate-bounce-in"
                            style={{ animationDelay: `${index * 0.1}s` }}
                          >
                            <CardContent className="p-4">
                              <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                                  {player.charAt(0)}
                                </div>
                                <div className="flex-1">
                                  <div className="font-semibold">{player}</div>
                                  <div className="text-xs text-muted-foreground">{selectedPosition} Position</div>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  Available
                                </Badge>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 animate-bounce-in">
                      <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2 text-destructive">No Players Available</h3>
                      <p className="text-muted-foreground mb-4">
                        You don't have any players for the {selectedPosition} position.
                      </p>
                      <Badge variant="destructive">Position Gap Identified</Badge>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Users className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Player Position Matcher</h3>
                  <p className="text-muted-foreground mb-4">
                    Select a position from the list to see available players and identify gaps in your squad.
                  </p>
                  <div className="flex justify-center gap-2">
                    <Badge variant="outline">24 Total Players</Badge>
                    <Badge variant="outline">13 Positions</Badge>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
