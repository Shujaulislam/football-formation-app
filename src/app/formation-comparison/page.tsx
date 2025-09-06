import { FormationComparison } from '@/components/formation-comparison'
import React from 'react'

export default function FormationComparisonPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-card to-muted pb-20">
      <div className="container mx-auto px-4 py-8">
        <FormationComparison />
      </div>
    </div>
  )
}
