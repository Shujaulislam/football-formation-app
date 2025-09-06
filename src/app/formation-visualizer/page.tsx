import { FormationVisualizer } from '@/components/formation-visualizer'
import React from 'react'

export default function FormationVisualizerPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted">
      <div className="container mx-auto px-4 py-8">
        <FormationVisualizer />
      </div>
    </div>
  )
}
