import { SquadBuilder } from '@/components/squad-builder'
import React from 'react'

export default function SquadBuilderPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted pb-20">
      <div className="container mx-auto px-4 py-8">
        <SquadBuilder />
      </div>
    </div>
  )
}