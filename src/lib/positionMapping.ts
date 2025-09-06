/**
 * Position Mapping Standardization
 * 
 * This module handles position name variations and mappings across different data sources.
 * It ensures consistency between players.json, formations, and component logic.
 */

export interface PositionMapping {
  standard: string;        // Standard position name
  variations: string[];    // Alternative names for this position
  category: string;        // GK, DF, MF, FW
  description: string;     // Human-readable description
}

// Standard position mappings with all known variations
export const POSITION_MAPPINGS: PositionMapping[] = [
  // Goalkeepers
  {
    standard: "GK",
    variations: ["GK", "Goalkeeper", "Keeper"],
    category: "GK",
    description: "Goalkeeper"
  },
  
  // Defenders
  {
    standard: "CB",
    variations: ["CB", "Center Back", "Centre Back", "Central Defender"],
    category: "DF",
    description: "Center Back"
  },
  {
    standard: "LB",
    variations: ["LB", "Left Back", "Left Defender"],
    category: "DF",
    description: "Left Back"
  },
  {
    standard: "RB",
    variations: ["RB", "Right Back", "Right Defender"],
    category: "DF",
    description: "Right Back"
  },
  
  // Midfielders
  {
    standard: "CM",
    variations: ["CM", "Central Midfielder", "Center Midfielder"],
    category: "MF",
    description: "Central Midfielder"
  },
  {
    standard: "AM",
    variations: ["AM", "CAM", "Attacking Midfielder", "Central Attacking Midfielder"],
    category: "MF",
    description: "Attacking Midfielder"
  },
  {
    standard: "DM",
    variations: ["DM", "CDM", "Defensive Midfielder", "Central Defensive Midfielder"],
    category: "MF",
    description: "Defensive Midfielder"
  },
  {
    standard: "LM",
    variations: ["LM", "Left Midfielder", "Left Wing Midfielder"],
    category: "MF",
    description: "Left Midfielder"
  },
  {
    standard: "RM",
    variations: ["RM", "Right Midfielder", "Right Wing Midfielder"],
    category: "MF",
    description: "Right Midfielder"
  },
  {
    standard: "LWB",
    variations: ["LWB", "Left Wing Back", "Left Wing-Back"],
    category: "MF",
    description: "Left Wing Back"
  },
  {
    standard: "RWB",
    variations: ["RWB", "Right Wing Back", "Right Wing-Back"],
    category: "MF",
    description: "Right Wing Back"
  },
  
  // Forwards
  {
    standard: "CF",
    variations: ["CF", "ST", "Striker", "Center Forward", "Centre Forward"],
    category: "FW",
    description: "Center Forward"
  },
  {
    standard: "LW",
    variations: ["LW", "Left Winger", "Left Forward"],
    category: "FW",
    description: "Left Winger"
  },
  {
    standard: "RW",
    variations: ["RW", "Right Winger", "Right Forward"],
    category: "FW",
    description: "Right Winger"
  },
  {
    standard: "SS",
    variations: ["SS", "Second Striker", "Supporting Striker"],
    category: "FW",
    description: "Second Striker"
  }
];

// Create lookup maps for efficient searching
const POSITION_TO_STANDARD = new Map<string, string>();
const STANDARD_TO_MAPPING = new Map<string, PositionMapping>();

// Initialize lookup maps
POSITION_MAPPINGS.forEach(mapping => {
  STANDARD_TO_MAPPING.set(mapping.standard, mapping);
  mapping.variations.forEach(variation => {
    POSITION_TO_STANDARD.set(variation.toUpperCase(), mapping.standard);
  });
});

/**
 * Convert any position name to its standard form
 */
export function standardizePosition(position: string): string {
  if (!position) return position;
  
  const standard = POSITION_TO_STANDARD.get(position.toUpperCase());
  return standard || position; // Return original if no mapping found
}

/**
 * Get position mapping for a standard position
 */
export function getPositionMapping(position: string): PositionMapping | null {
  const standard = standardizePosition(position);
  return STANDARD_TO_MAPPING.get(standard) || null;
}

/**
 * Get all variations for a position
 */
export function getPositionVariations(position: string): string[] {
  const mapping = getPositionMapping(position);
  return mapping ? mapping.variations : [position];
}

/**
 * Check if two positions are the same (accounting for variations)
 */
export function arePositionsEqual(pos1: string, pos2: string): boolean {
  return standardizePosition(pos1) === standardizePosition(pos2);
}

/**
 * Get position category (GK, DF, MF, FW)
 */
export function getPositionCategory(position: string): string {
  const mapping = getPositionMapping(position);
  return mapping ? mapping.category : "Unknown";
}

/**
 * Get human-readable description for a position
 */
export function getPositionDescription(position: string): string {
  const mapping = getPositionMapping(position);
  return mapping ? mapping.description : position;
}

/**
 * Standardize an array of positions
 */
export function standardizePositions(positions: string[]): string[] {
  return positions.map(pos => standardizePosition(pos));
}

/**
 * Get all standard positions
 */
export function getAllStandardPositions(): string[] {
  return POSITION_MAPPINGS.map(mapping => mapping.standard);
}

/**
 * Get positions by category
 */
export function getPositionsByCategory(category: string): string[] {
  return POSITION_MAPPINGS
    .filter(mapping => mapping.category === category)
    .map(mapping => mapping.standard);
}

/**
 * Find positions that can be used as alternatives for a given position
 * This is based on tactical compatibility, not just name variations
 */
export function getTacticalAlternatives(position: string): string[] {
  const standard = standardizePosition(position);
  
  // Tactical alternatives based on football knowledge
  const tacticalMap: { [key: string]: string[] } = {
    // Defenders
    'LB': ['LWB', 'LM'],
    'RB': ['RWB', 'RM'],
    'CB': ['DM'],
    
    // Midfielders
    'CM': ['AM', 'DM'],
    'AM': ['CM', 'LW', 'RW', 'CF'],
    'DM': ['CM', 'CB'],
    'LM': ['LW', 'LB', 'LWB'],
    'RM': ['RW', 'RB', 'RWB'],
    'LWB': ['LB', 'LM', 'LW'],
    'RWB': ['RB', 'RM', 'RW'],
    
    // Forwards
    'CF': ['AM', 'LW', 'RW'],
    'LW': ['LM', 'CF', 'AM'],
    'RW': ['RM', 'CF', 'AM'],
    'SS': ['AM', 'CF', 'LW', 'RW']
  };
  
  return tacticalMap[standard] || [];
}
