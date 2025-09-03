/**
 * Formation Compatibility Data
 * 
 * This file contains lightweight formation data specifically for compatibility checking.
 * It focuses on position requirements rather than visual coordinates.
 */

export interface FormationPosition {
  position: string;
  category: string;
  isRequired: boolean; // Whether this position is mandatory for the formation
  alternatives?: string[]; // Alternative positions that can fill this role
}

export interface FormationCompatibility {
  formation: string;
  description: string;
  positions: FormationPosition[];
  totalPositions: number;
  tacticalNotes: string;
}

// Standardized position mappings for compatibility checking
export const FORMATION_COMPATIBILITY_DATA: FormationCompatibility[] = [
  {
    formation: "4-4-2",
    description: "Classic balanced formation with four defenders, four midfielders, and two strikers",
    positions: [
      { position: "GK", category: "GK", isRequired: true },
      { position: "LB", category: "DF", isRequired: true, alternatives: ["LWB"] },
      { position: "CB", category: "DF", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "RB", category: "DF", isRequired: true, alternatives: ["RWB"] },
      { position: "LM", category: "MF", isRequired: true, alternatives: ["LW", "LWB"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "RM", category: "MF", isRequired: true, alternatives: ["RW", "RWB"] },
      { position: "CF", category: "FW", isRequired: true, alternatives: ["ST"] },
      { position: "CF", category: "FW", isRequired: true, alternatives: ["ST"] }
    ],
    totalPositions: 11,
    tacticalNotes: "Balanced formation requiring good wing play and central midfield control"
  },
  {
    formation: "4-3-3",
    description: "Attacking formation with three forwards and three central midfielders",
    positions: [
      { position: "GK", category: "GK", isRequired: true },
      { position: "LB", category: "DF", isRequired: true, alternatives: ["LWB"] },
      { position: "CB", category: "DF", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "RB", category: "DF", isRequired: true, alternatives: ["RWB"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "LW", category: "FW", isRequired: true, alternatives: ["LM"] },
      { position: "CF", category: "FW", isRequired: true, alternatives: ["ST"] },
      { position: "RW", category: "FW", isRequired: true, alternatives: ["RM"] }
    ],
    totalPositions: 11,
    tacticalNotes: "Attacking formation requiring pacey wingers and creative midfielders"
  },
  {
    formation: "3-4-3",
    description: "Attacking formation with three defenders and three forwards",
    positions: [
      { position: "GK", category: "GK", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "LM", category: "MF", isRequired: true, alternatives: ["LW", "LWB"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "RM", category: "MF", isRequired: true, alternatives: ["RW", "RWB"] },
      { position: "LW", category: "FW", isRequired: true, alternatives: ["LM"] },
      { position: "CF", category: "FW", isRequired: true, alternatives: ["ST"] },
      { position: "RW", category: "FW", isRequired: true, alternatives: ["RM"] }
    ],
    totalPositions: 11,
    tacticalNotes: "High-risk, high-reward formation requiring strong wing-backs and creative midfielders"
  },
  {
    formation: "4-2-3-1",
    description: "Balanced formation with two defensive midfielders and an attacking midfielder",
    positions: [
      { position: "GK", category: "GK", isRequired: true },
      { position: "LB", category: "DF", isRequired: true, alternatives: ["LWB"] },
      { position: "CB", category: "DF", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "RB", category: "DF", isRequired: true, alternatives: ["RWB"] },
      { position: "DM", category: "MF", isRequired: true, alternatives: ["CM"] },
      { position: "DM", category: "MF", isRequired: true, alternatives: ["CM"] },
      { position: "AM", category: "MF", isRequired: true, alternatives: ["CM"] },
      { position: "LW", category: "FW", isRequired: true, alternatives: ["LM"] },
      { position: "RW", category: "FW", isRequired: true, alternatives: ["RM"] },
      { position: "CF", category: "FW", isRequired: true, alternatives: ["ST"] }
    ],
    totalPositions: 11,
    tacticalNotes: "Tactically flexible formation with strong defensive base and creative attacking options"
  },
  {
    formation: "4-1-4-1",
    description: "Defensive formation with one holding midfielder and four attacking midfielders",
    positions: [
      { position: "GK", category: "GK", isRequired: true },
      { position: "LB", category: "DF", isRequired: true, alternatives: ["LWB"] },
      { position: "CB", category: "DF", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "RB", category: "DF", isRequired: true, alternatives: ["RWB"] },
      { position: "DM", category: "MF", isRequired: true, alternatives: ["CM"] },
      { position: "LM", category: "MF", isRequired: true, alternatives: ["LW", "LWB"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM"] },
      { position: "RM", category: "MF", isRequired: true, alternatives: ["RW", "RWB"] },
      { position: "CF", category: "FW", isRequired: true, alternatives: ["ST"] }
    ],
    totalPositions: 11,
    tacticalNotes: "Defensive formation requiring strong holding midfielder and pacey wingers"
  },
  {
    formation: "3-5-2",
    description: "Midfield-heavy formation with three defenders and five midfielders",
    positions: [
      { position: "GK", category: "GK", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "LWB", category: "MF", isRequired: true, alternatives: ["LM", "LB"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "RWB", category: "MF", isRequired: true, alternatives: ["RM", "RB"] },
      { position: "CF", category: "FW", isRequired: true, alternatives: ["ST"] },
      { position: "CF", category: "FW", isRequired: true, alternatives: ["ST"] }
    ],
    totalPositions: 11,
    tacticalNotes: "Midfield-dominant formation requiring versatile wing-backs and strong central midfielders"
  },
  {
    formation: "5-3-2",
    description: "Defensive formation with five defenders and three midfielders",
    positions: [
      { position: "GK", category: "GK", isRequired: true },
      { position: "LWB", category: "DF", isRequired: true, alternatives: ["LB"] },
      { position: "CB", category: "DF", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "RWB", category: "DF", isRequired: true, alternatives: ["RB"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "CF", category: "FW", isRequired: true, alternatives: ["ST"] },
      { position: "CF", category: "FW", isRequired: true, alternatives: ["ST"] }
    ],
    totalPositions: 11,
    tacticalNotes: "Ultra-defensive formation requiring strong wing-backs and creative midfielders"
  },
  {
    formation: "5-4-1",
    description: "Defensive formation with five defenders and four midfielders",
    positions: [
      { position: "GK", category: "GK", isRequired: true },
      { position: "LWB", category: "DF", isRequired: true, alternatives: ["LB"] },
      { position: "CB", category: "DF", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "CB", category: "DF", isRequired: true },
      { position: "RWB", category: "DF", isRequired: true, alternatives: ["RB"] },
      { position: "LM", category: "MF", isRequired: true, alternatives: ["LW", "LWB"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "CM", category: "MF", isRequired: true, alternatives: ["AM", "DM"] },
      { position: "RM", category: "MF", isRequired: true, alternatives: ["RW", "RWB"] },
      { position: "CF", category: "FW", isRequired: true, alternatives: ["ST"] }
    ],
    totalPositions: 11,
    tacticalNotes: "Defensive formation requiring strong wing-backs and a hardworking lone striker"
  }
];

/**
 * Get formation compatibility data by formation name
 */
export function getFormationCompatibility(formation: string): FormationCompatibility | null {
  return FORMATION_COMPATIBILITY_DATA.find(f => f.formation === formation) || null;
}

/**
 * Get all available formations for compatibility checking
 */
export function getAllFormations(): string[] {
  return FORMATION_COMPATIBILITY_DATA.map(f => f.formation);
}

/**
 * Check if a formation exists in the compatibility data
 */
export function isValidFormation(formation: string): boolean {
  return FORMATION_COMPATIBILITY_DATA.some(f => f.formation === formation);
}
