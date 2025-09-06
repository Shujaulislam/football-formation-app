/**
 * Football Player Flexibility Scoring System
 * 
 * This module implements realistic football position flexibility calculations
 * based on actual football tactical knowledge and player versatility.
 */

export interface PositionFlexibility {
  position: string;
  category: string;
  compatiblePositions: string[];
  flexibilityScore: number; // 0-100
}

export interface PlayerFlexibilityResult {
  playerName: string;
  primaryPositions: string[];
  flexibilityScore: number;
  positionBreakdown: PositionFlexibility[];
  footballLogic: string;
}

// Football position compatibility matrix based on real tactical knowledge
const POSITION_COMPATIBILITY_MATRIX: { [key: string]: { compatible: string[], score: number } } = {
  // Goalkeepers - highly specialized
  'GK': { 
    compatible: ['GK'], 
    score: 7 // 7% - only GK position
  },
  
  // Defenders - moderate flexibility
  'CB': { 
    compatible: ['CB', 'DM', 'CM'], 
    score: 20 // 20% - can play defensive midfield, sometimes central midfield
  },
  'LB': { 
    compatible: ['LB', 'LWB', 'LM', 'CB'], 
    score: 27 // 27% - can play wing-back, left midfield, sometimes center-back
  },
  'RB': { 
    compatible: ['RB', 'RWB', 'RM', 'CB'], 
    score: 27 // 27% - can play wing-back, right midfield, sometimes center-back
  },
  
  // Midfielders - highest flexibility
  'CM': { 
    compatible: ['CM', 'AM', 'DM', 'LM', 'RM', 'CB', 'LB', 'RB'], 
    score: 53 // 53% - most versatile position in football
  },
  'AM': { 
    compatible: ['AM', 'CM', 'LW', 'RW', 'CF'], 
    score: 33 // 33% - can play attacking roles and central midfield
  },
  'DM': { 
    compatible: ['DM', 'CM', 'CB'], 
    score: 20 // 20% - defensive specialist, can play center-back
  },
  'LM': { 
    compatible: ['LM', 'LW', 'CM', 'LB'], 
    score: 27 // 27% - can play winger, central midfield, or left-back
  },
  'RM': { 
    compatible: ['RM', 'RW', 'CM', 'RB'], 
    score: 27 // 27% - can play winger, central midfield, or right-back
  },
  'LWB': { 
    compatible: ['LWB', 'LB', 'LM', 'LW'], 
    score: 27 // 27% - hybrid position, can play full-back or winger
  },
  'RWB': { 
    compatible: ['RWB', 'RB', 'RM', 'RW'], 
    score: 27 // 27% - hybrid position, can play full-back or winger
  },
  
  // Forwards - moderate flexibility
  'CF': { 
    compatible: ['CF', 'AM', 'LW', 'RW'], 
    score: 27 // 27% - can play attacking midfield or wing positions
  },
  'LW': { 
    compatible: ['LW', 'LM', 'CF', 'AM'], 
    score: 27 // 27% - can play left midfield or central attacking roles
  },
  'RW': { 
    compatible: ['RW', 'RM', 'CF', 'AM'], 
    score: 27 // 27% - can play right midfield or central attacking roles
  },
  'SS': { 
    compatible: ['SS', 'AM', 'CF', 'LW', 'RW'], 
    score: 33 // 33% - second striker is naturally versatile
  }
};

// Total number of positions in the system
const TOTAL_POSITIONS = 15;

/**
 * Calculate realistic football flexibility for a player
 */
export function calculatePlayerFlexibility(
  playerName: string, 
  playerPositions: string[]
): PlayerFlexibilityResult {
  if (!playerPositions || playerPositions.length === 0) {
    return {
      playerName,
      primaryPositions: [],
      flexibilityScore: 0,
      positionBreakdown: [],
      footballLogic: "No positions assigned"
    };
  }

  // Get all unique compatible positions for this player
  const allCompatiblePositions = new Set<string>();
  const positionBreakdown: PositionFlexibility[] = [];

  playerPositions.forEach(position => {
    const compatibility = POSITION_COMPATIBILITY_MATRIX[position];
    if (compatibility) {
      // Add all compatible positions
      compatibility.compatible.forEach(pos => allCompatiblePositions.add(pos));
      
      // Create breakdown for this position
      positionBreakdown.push({
        position,
        category: getPositionCategory(position),
        compatiblePositions: compatibility.compatible,
        flexibilityScore: compatibility.score
      });
    }
  });

  // Calculate overall flexibility score
  const uniqueCompatibleCount = allCompatiblePositions.size;
  const flexibilityScore = Math.round((uniqueCompatibleCount / TOTAL_POSITIONS) * 100);

  // Generate football logic explanation
  const footballLogic = generateFootballLogic(playerPositions, positionBreakdown);

  return {
    playerName,
    primaryPositions: playerPositions,
    flexibilityScore,
    positionBreakdown,
    footballLogic
  };
}

/**
 * Get position category (GK, DF, MF, FW)
 */
function getPositionCategory(position: string): string {
  if (position === 'GK') return 'GK';
  if (['CB', 'LB', 'RB'].includes(position)) return 'DF';
  if (['CM', 'AM', 'DM', 'LM', 'RM', 'LWB', 'RWB'].includes(position)) return 'MF';
  if (['CF', 'LW', 'RW', 'SS'].includes(position)) return 'FW';
  return 'Unknown';
}

/**
 * Generate football logic explanation for player flexibility
 */
function generateFootballLogic(
  primaryPositions: string[], 
  positionBreakdown: PositionFlexibility[]
): string {
  const categories = primaryPositions.map(pos => getPositionCategory(pos));
  const uniqueCategories = [...new Set(categories)];

  if (uniqueCategories.length === 1) {
    const category = uniqueCategories[0];
    switch (category) {
      case 'GK':
        return "Goalkeeper specialist - highly specialized position with limited flexibility";
      case 'DF':
        return "Defensive specialist - can adapt to defensive midfield roles";
      case 'MF':
        return "Midfield specialist - naturally versatile with good tactical awareness";
      case 'FW':
        return "Attacking specialist - can adapt to various attacking roles";
    }
  }

  if (uniqueCategories.includes('MF') && uniqueCategories.length > 1) {
    return "Versatile midfielder - excellent tactical flexibility across multiple areas";
  }

  if (uniqueCategories.includes('DF') && uniqueCategories.includes('MF')) {
    return "Defensive utility player - strong in both defense and midfield";
  }

  if (uniqueCategories.includes('MF') && uniqueCategories.includes('FW')) {
    return "Attacking midfielder - creative player with good attacking instincts";
  }

  return "Multi-positional player - valuable tactical flexibility";
}

/**
 * Get all available positions in the system
 */
export function getAllPositions(): string[] {
  return Object.keys(POSITION_COMPATIBILITY_MATRIX);
}

/**
 * Get position compatibility for a specific position
 */
export function getPositionCompatibility(position: string): { compatible: string[], score: number } | null {
  return POSITION_COMPATIBILITY_MATRIX[position] || null;
}
