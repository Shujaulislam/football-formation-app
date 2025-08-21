"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FormationVisualizer } from "@/components/formation-visualizer"
import { PlayerPositionMatcher } from "@/components/player-position-matcher"
import { SquadBuilder } from "@/components/squad-builder"
import { FormationComparison } from "@/components/formation-comparison"
import { PitchVisualizer } from "@/components/pitch-visualizer"
import EnhancedPitchVisualizer from "@/components/enhanced-pitch-visualizer"
import { Trophy, Users, Target, BarChart3, GitCompare, MapPin, Zap } from "lucide-react"

export default function Home() {
  const [activeTab, setActiveTab] = useState("formations")

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      {/* Header */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary rounded-lg animate-pulse-glow">
                <Trophy className="h-6 w-6 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold font-[family-name:var(--font-work-sans)] text-foreground">
                  Football Tactical Analysis
                </h1>
                <p className="text-sm text-muted-foreground">
                  Analyze formations, match players, and build optimal squads
                </p>
              </div>
            </div>
            <Badge variant="secondary" className="animate-bounce-in">
              Pro Analysis
            </Badge>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover-lift border-primary/20 bg-gradient-to-r from-card to-primary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Formations</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">8</div>
              <p className="text-xs text-muted-foreground">With 25+ sub-formations</p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-secondary/20 bg-gradient-to-r from-card to-secondary/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Available Players</CardTitle>
              <Users className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">24</div>
              <p className="text-xs text-muted-foreground">Across all positions</p>
            </CardContent>
          </Card>

          <Card className="hover-lift border-accent/20 bg-gradient-to-r from-card to-accent/5">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Position Coverage</CardTitle>
              <Target className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">92%</div>
              <p className="text-xs text-muted-foreground">Missing only LM position</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-card border">
            <TabsTrigger
              value="formations"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-300"
            >
              <BarChart3 className="h-4 w-4 mr-2" />
              Formation Visualizer
            </TabsTrigger>
            <TabsTrigger
              value="matching"
              className="data-[state=active]:bg-secondary data-[state=active]:text-secondary-foreground transition-all duration-300"
            >
              <Target className="h-4 w-4 mr-2" />
              Player Matching
            </TabsTrigger>
            <TabsTrigger
              value="builder"
              className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground transition-all duration-300"
            >
              <Users className="h-4 w-4 mr-2" />
              Squad Builder
            </TabsTrigger>
            <TabsTrigger
              value="comparison"
              className="data-[state=active]:bg-chart-1 data-[state=active]:text-white transition-all duration-300"
            >
              <GitCompare className="h-4 w-4 mr-2" />
              Compare
            </TabsTrigger>
            <TabsTrigger
              value="pitch"
              className="data-[state=active]:bg-chart-2 data-[state=active]:text-white transition-all duration-300"
            >
              <MapPin className="h-4 w-4 mr-2" />
              Pitch View
            </TabsTrigger>
            <TabsTrigger
              value="enhanced-pitch"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-yellow-500 data-[state=active]:to-orange-500 data-[state=active]:text-black transition-all duration-300"
            >
              <Zap className="h-4 w-4 mr-2" />
              Enhanced Pitch
            </TabsTrigger>
          </TabsList>

          <TabsContent value="formations" className="animate-slide-in-right">
            <FormationVisualizer />
          </TabsContent>

          <TabsContent value="matching" className="animate-slide-in-right">
            <PlayerPositionMatcher />
          </TabsContent>

          <TabsContent value="builder" className="animate-slide-in-right">
            <SquadBuilder />
          </TabsContent>

          <TabsContent value="comparison" className="animate-slide-in-right">
            <FormationComparison />
          </TabsContent>

          <TabsContent value="pitch" className="animate-slide-in-right">
            <PitchVisualizer />
          </TabsContent>

          <TabsContent value="enhanced-pitch" className="animate-slide-in-right">
            <EnhancedPitchVisualizer />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
