import playersData from './players.json';
import formationsData from './formations.json';

export interface Position {
  id: string;
  xPercent: number; // 0–100 (relative to pitch width)
  yPercent: number; // 0–100 (relative to pitch height)
  role: string; // 'GK', 'DF', 'MF', 'FW'
}

export interface Formation {
  id: string;
  name: string;
  positions: Position[];
}

export interface Player {
  id: string;
  name: string;
  number: number;
  role: string; // preferred role, e.g., 'FW'
}

// Convert existing players data to our Player interface
export const sampleRoster: Player[] = (() => {
  const players: Player[] = [];
  let playerId = 1;

  // Add goalkeepers
  if (Array.isArray(playersData.players.GK)) {
    playersData.players.GK.forEach((name: string) => {
      players.push({
        id: playerId.toString(),
        name,
        number: playerId,
        role: 'GK'
      });
      playerId++;
    });
  }

  // Add players from other positions
  Object.entries(playersData.players).forEach(([category, positions]) => {
    if (category === 'GK') return;
    
    if (Array.isArray(positions)) {
      // Handle array case (if any)
      positions.forEach((name: string) => {
        players.push({
          id: playerId.toString(),
          name,
          number: playerId,
          role: category.toUpperCase()
        });
        playerId++;
      });
    } else if (positions && typeof positions === 'object') {
      // Handle object case
      Object.entries(positions as Record<string, string[]>).forEach(([names ]) => {
        if (Array.isArray(names)) {
          names.forEach((name: string) => {
            players.push({
              id: playerId.toString(),
              name,
              number: playerId,
              role: category.toUpperCase()
            });
            playerId++;
          });
        }
      });
    }
  });

  return players;
})();

// Convert existing formations data to our Formation interface
export const formations: Formation[] = (() => {
  if (!formationsData?.FORMATIONS) return [];

  return formationsData.FORMATIONS.map((formationData) => {
    // Get the first sub-formation for now (we can expand this later)
    const subFormation = formationData["sub-formations"]?.[0];
    
    if (!subFormation) {
      // Fallback to basic formation structure
      return {
        id: formationData.formation,
        name: formationData.formation,
        positions: getDefaultPositionsForFormation(formationData.formation)
      };
    }

    // Try to extract positions from sub-formation
    let positions: Array<{ position?: string; x?: number; y?: number; category?: string }> = [];
    // First try to find positions array directly, but only if it exists on subFormation
    if ('positions' in subFormation && Array.isArray((subFormation as any).positions)) {
      positions = (subFormation as any).positions;
    } 
    // If no positions array, look for an array under a dynamic key
    else {
      const dynamicKey = Object.keys(subFormation).find(
        k => Array.isArray((subFormation as any)[k]) && k !== 'positions'
      );
      
      if (dynamicKey && Array.isArray((subFormation as any)[dynamicKey])) {
        positions = (subFormation as any)[dynamicKey];
      }
    }

    // Convert positions to our format
    const convertedPositions = positions.map((pos: { position?: string; x?: number; y?: number; category?: string }, index: number) => ({
      id: pos.position || `pos_${index}`,
      xPercent: pos.x || 0,
      yPercent: pos.y || 0,
      role: pos.category || 'MF'
    }));

    return {
      id: formationData.formation,
      name: formationData.formation,
      positions: convertedPositions.length > 0 ? convertedPositions : getDefaultPositionsForFormation(formationData.formation)
    };
  });
})();

// Helper function to generate default positions for formations
function getDefaultPositionsForFormation(formation: string): Position[] {
  const formationMap: Record<string, Position[]> = {
    '4-3-3': [
      { id: 'GK', xPercent: 50, yPercent: 95, role: 'GK' },
      { id: 'LB', xPercent: 12, yPercent: 75, role: 'DF' },
      { id: 'CB1', xPercent: 32, yPercent: 75, role: 'DF' },
      { id: 'CB2', xPercent: 68, yPercent: 75, role: 'DF' },
      { id: 'RB', xPercent: 88, yPercent: 75, role: 'DF' },
      { id: 'CM1', xPercent: 25, yPercent: 50, role: 'MF' },
      { id: 'CM2', xPercent: 50, yPercent: 48, role: 'MF' },
      { id: 'CM3', xPercent: 75, yPercent: 50, role: 'MF' },
      { id: 'LW', xPercent: 18, yPercent: 20, role: 'FW' },
      { id: 'ST', xPercent: 50, yPercent: 10, role: 'FW' },
      { id: 'RW', xPercent: 82, yPercent: 20, role: 'FW' },
    ],
    '4-4-2': [
      { id: 'GK', xPercent: 50, yPercent: 95, role: 'GK' },
      { id: 'LB', xPercent: 12, yPercent: 75, role: 'DF' },
      { id: 'CB1', xPercent: 32, yPercent: 75, role: 'DF' },
      { id: 'CB2', xPercent: 68, yPercent: 75, role: 'DF' },
      { id: 'RB', xPercent: 88, yPercent: 75, role: 'DF' },
      { id: 'LM', xPercent: 20, yPercent: 50, role: 'MF' },
      { id: 'CM1', xPercent: 40, yPercent: 50, role: 'MF' },
      { id: 'CM2', xPercent: 60, yPercent: 50, role: 'MF' },
      { id: 'RM', xPercent: 80, yPercent: 50, role: 'MF' },
      { id: 'ST1', xPercent: 35, yPercent: 15, role: 'FW' },
      { id: 'ST2', xPercent: 65, yPercent: 15, role: 'FW' },
    ],
    '3-5-2': [
      { id: 'GK', xPercent: 50, yPercent: 95, role: 'GK' },
      { id: 'CB1', xPercent: 25, yPercent: 75, role: 'DF' },
      { id: 'CB2', xPercent: 50, yPercent: 75, role: 'DF' },
      { id: 'CB3', xPercent: 75, yPercent: 75, role: 'DF' },
      { id: 'LWB', xPercent: 15, yPercent: 50, role: 'MF' },
      { id: 'CM1', xPercent: 35, yPercent: 50, role: 'MF' },
      { id: 'CM2', xPercent: 50, yPercent: 50, role: 'MF' },
      { id: 'CM3', xPercent: 65, yPercent: 50, role: 'MF' },
      { id: 'RWB', xPercent: 85, yPercent: 50, role: 'MF' },
      { id: 'CF1', xPercent: 35, yPercent: 15, role: 'FW' },
      { id: 'CF2', xPercent: 65, yPercent: 15, role: 'FW' },
    ],
    '4-5-1': [
      { id: 'GK', xPercent: 50, yPercent: 95, role: 'GK' },
      { id: 'LB', xPercent: 12, yPercent: 75, role: 'DF' },
      { id: 'CB1', xPercent: 32, yPercent: 75, role: 'DF' },
      { id: 'CB2', xPercent: 68, yPercent: 75, role: 'DF' },
      { id: 'RB', xPercent: 88, yPercent: 75, role: 'DF' },
      { id: 'LM', xPercent: 20, yPercent: 50, role: 'MF' },
      { id: 'CM1', xPercent: 35, yPercent: 50, role: 'MF' },
      { id: 'CM2', xPercent: 50, yPercent: 50, role: 'MF' },
      { id: 'CM3', xPercent: 65, yPercent: 50, role: 'MF' },
      { id: 'RM', xPercent: 80, yPercent: 50, role: 'MF' },
      { id: 'ST', xPercent: 50, yPercent: 15, role: 'FW' },
    ],
    '5-3-2': [
      { id: 'GK', xPercent: 50, yPercent: 95, role: 'GK' },
      { id: 'LWB', xPercent: 15, yPercent: 75, role: 'DF' },
      { id: 'CB1', xPercent: 30, yPercent: 75, role: 'DF' },
      { id: 'CB2', xPercent: 50, yPercent: 75, role: 'DF' },
      { id: 'CB3', xPercent: 70, yPercent: 75, role: 'DF' },
      { id: 'RWB', xPercent: 85, yPercent: 75, role: 'DF' },
      { id: 'CM1', xPercent: 35, yPercent: 50, role: 'MF' },
      { id: 'CM2', xPercent: 50, yPercent: 50, role: 'MF' },
      { id: 'CM3', xPercent: 65, yPercent: 50, role: 'MF' },
      { id: 'ST1', xPercent: 35, yPercent: 15, role: 'FW' },
      { id: 'ST2', xPercent: 65, yPercent: 15, role: 'FW' },
    ]
  };

  return formationMap[formation] || formationMap['4-3-3']; // Default to 4-3-3
}

// Export the raw data for debugging
export { playersData, formationsData };