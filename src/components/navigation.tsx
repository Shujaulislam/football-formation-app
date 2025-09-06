"use client"

import { FloatingDock } from "@/components/ui/floating-dock"
import { 
  BarChart3, 
  Target, 
  Users, 
  GitCompare, 
  MapPin, 
  Zap,
  Home
} from "lucide-react"

const navigationItems = [
  {
    title: "Home",
    icon: <Home className="h-5 w-5" />,
    href: "/"
  },
  {
    title: "Formation Visualizer",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/formation-visualizer"
  },
  {
    title: "Player Matching",
    icon: <Target className="h-5 w-5" />,
    href: "/player-matching"
  },
  {
    title: "Squad Builder",
    icon: <Users className="h-5 w-5" />,
    href: "/squad-builder"
  },
  {
    title: "Formation Comparison",
    icon: <GitCompare className="h-5 w-5" />,
    href: "/formation-comparison"
  },
  {
    title: "Pitch View",
    icon: <MapPin className="h-5 w-5" />,
    href: "/pitch-view"
  },
  {
    title: "Formation Plotting",
    icon: <Zap className="h-5 w-5" />,
    href: "/formation-plotting"
  }
]

export function Navigation() {
  return (
    <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
      <FloatingDock 
        items={navigationItems}
        desktopClassName="bg-card/80 backdrop-blur-md border border-border/50 shadow-lg"
        mobileClassName="bg-card/80 backdrop-blur-md border border-border/50 shadow-lg"
      />
    </div>
  )
}
