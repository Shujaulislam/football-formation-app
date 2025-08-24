// Formation Position Mappings
// This file contains all the position coordinates for different formations
// Each formation has an array of positions with x, y coordinates and player details

export interface FormationPosition {
  x: number;
  y: number;
  position: string;
  category: string;
}

// 4-4-2 Formation Variations
export const formation4_4_2: { [key: string]: FormationPosition[] } = {
  "4-4-2": [
    // Standard Flat 4-4-2
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LB", category: "DF" },
    { x: 35, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RB", category: "DF" },
    { x: 15, y: 50, position: "LM", category: "MF" },
    { x: 35, y: 50, position: "CM", category: "MF" },
    { x: 65, y: 50, position: "CM", category: "MF" },
    { x: 85, y: 50, position: "RM", category: "MF" },
    { x: 35, y: 15, position: "ST", category: "FW" },
    { x: 65, y: 15, position: "ST", category: "FW" },
  ],
  "4-1-2-1-2": [
    // Diamond 4-4-2
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LB", category: "DF" },
    { x: 35, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RB", category: "DF" },
    { x: 50, y: 60, position: "CDM", category: "MF" },
    { x: 20, y: 50, position: "LM", category: "MF" },
    { x: 80, y: 50, position: "RM", category: "MF" },
    { x: 50, y: 40, position: "CAM", category: "MF" },
    { x: 35, y: 15, position: "ST", category: "FW" },
    { x: 65, y: 15, position: "ST", category: "FW" },
  ],
  "4-3-1-2": [
    // Triangle 4-4-2
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LB", category: "DF" },
    { x: 35, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RB", category: "DF" },
    { x: 25, y: 55, position: "CM", category: "MF" },
    { x: 50, y: 55, position: "CM", category: "MF" },
    { x: 75, y: 55, position: "CM", category: "MF" },
    { x: 50, y: 35, position: "CAM", category: "MF" },
    { x: 35, y: 15, position: "ST", category: "FW" },
    { x: 65, y: 15, position: "ST", category: "FW" },
  ],
  "4-2-2-2": [
    // Inverted Trapezium 4-4-2
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LB", category: "DF" },
    { x: 35, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RB", category: "DF" },
    { x: 30, y: 60, position: "CDM", category: "MF" },
    { x: 70, y: 60, position: "CDM", category: "MF" },
    { x: 25, y: 40, position: "LM", category: "MF" },
    { x: 75, y: 40, position: "RM", category: "MF" },
    { x: 35, y: 15, position: "ST", category: "FW" },
    { x: 65, y: 15, position: "ST", category: "FW" },
  ],
  "4-4-1-1": [
    // Straight line 4-4-1-1
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LB", category: "DF" },
    { x: 35, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RB", category: "DF" },
    { x: 15, y: 50, position: "LM", category: "MF" },
    { x: 35, y: 50, position: "CM", category: "MF" },
    { x: 65, y: 50, position: "CM", category: "MF" },
    { x: 85, y: 50, position: "RM", category: "MF" },
    { x: 50, y: 25, position: "CF", category: "FW" },
    { x: 50, y: 15, position: "ST", category: "FW" },
  ],
};

// 4-5-1 Formation Variations
export const formation4_5_1: { [key: string]: FormationPosition[] } = {
  "4-5-1": [
    // Standard Flat 4-5-1
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LB", category: "DF" },
    { x: 35, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RB", category: "DF" },
    { x: 10, y: 50, position: "LM", category: "MF" },
    { x: 30, y: 50, position: "CM", category: "MF" },
    { x: 50, y: 50, position: "CM", category: "MF" },
    { x: 70, y: 50, position: "CM", category: "MF" },
    { x: 90, y: 50, position: "RM", category: "MF" },
    { x: 50, y: 15, position: "ST", category: "FW" },
  ],
  "4-1-4-1": [
    // Inverted Equilateral Triangle 4-5-1
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LB", category: "DF" },
    { x: 35, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RB", category: "DF" },
    { x: 50, y: 60, position: "CDM", category: "MF" },
    { x: 20, y: 40, position: "LM", category: "MF" },
    { x: 40, y: 35, position: "CM", category: "MF" },
    { x: 60, y: 35, position: "CM", category: "MF" },
    { x: 80, y: 40, position: "RM", category: "MF" },
    { x: 50, y: 15, position: "ST", category: "FW" },
  ],
  "4-2-3-1": [
    // 4-2-3-1 formation
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LB", category: "DF" },
    { x: 35, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RB", category: "DF" },
    { x: 30, y: 55, position: "CDM", category: "MF" },
    { x: 70, y: 55, position: "CDM", category: "MF" },
    { x: 20, y: 35, position: "LW", category: "FW" },
    { x: 50, y: 30, position: "CAM", category: "MF" },
    { x: 80, y: 35, position: "RW", category: "FW" },
    { x: 50, y: 10, position: "ST", category: "FW" },
  ],
  "4-3-2-1": [
    // Pyramid 4-5-1
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LB", category: "DF" },
    { x: 35, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RB", category: "DF" },
    { x: 25, y: 55, position: "CM", category: "MF" },
    { x: 50, y: 55, position: "CM", category: "MF" },
    { x: 75, y: 55, position: "CM", category: "MF" },
    { x: 35, y: 30, position: "LF", category: "FW" },
    { x: 65, y: 30, position: "RF", category: "FW" },
    { x: 50, y: 15, position: "ST", category: "FW" },
  ],
};

// 4-3-3 Formation Variations
export const formation4_3_3: { [key: string]: FormationPosition[] } = {
  "4-3-3": [
    // Standard Flat 4-3-3
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LB", category: "DF" },
    { x: 35, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RB", category: "DF" },
    { x: 30, y: 55, position: "CM", category: "MF" },
    { x: 50, y: 50, position: "CM", category: "MF" },
    { x: 70, y: 55, position: "CM", category: "MF" },
    { x: 15, y: 15, position: "LW", category: "FW" },
    { x: 50, y: 15, position: "ST", category: "FW" },
    { x: 85, y: 15, position: "RW", category: "FW" },
  ],
  "4-1-2-3": [
    // Inverted Equilateral Triangle 4-3-3
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LB", category: "DF" },
    { x: 35, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RB", category: "DF" },
    { x: 50, y: 60, position: "CDM", category: "MF" },
    { x: 30, y: 40, position: "CM", category: "MF" },
    { x: 70, y: 40, position: "CM", category: "MF" },
    { x: 15, y: 15, position: "LW", category: "FW" },
    { x: 50, y: 15, position: "ST", category: "FW" },
    { x: 85, y: 15, position: "RW", category: "FW" },
  ],
  "4-2-1-3": [
    // Equilateral Triangle 4-3-3
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LB", category: "DF" },
    { x: 35, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RB", category: "DF" },
    { x: 35, y: 55, position: "CDM", category: "MF" },
    { x: 65, y: 55, position: "CDM", category: "MF" },
    { x: 50, y: 40, position: "CAM", category: "MF" },
    { x: 15, y: 15, position: "LW", category: "FW" },
    { x: 50, y: 15, position: "ST", category: "FW" },
    { x: 85, y: 15, position: "RW", category: "FW" },
  ],
};

// 3-5-2 Formation Variations
export const formation3_5_2: { [key: string]: FormationPosition[] } = {
  "3-5-2": [
    // Standard 3-5-2
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 25, y: 75, position: "LCB", category: "DF" },
    { x: 50, y: 75, position: "CB", category: "DF" },
    { x: 75, y: 75, position: "RCB", category: "DF" },
    { x: 10, y: 50, position: "LWB", category: "MF" },
    { x: 30, y: 50, position: "CM", category: "MF" },
    { x: 50, y: 45, position: "CM", category: "MF" },
    { x: 70, y: 50, position: "CM", category: "MF" },
    { x: 90, y: 50, position: "RWB", category: "MF" },
    { x: 35, y: 15, position: "ST", category: "FW" },
    { x: 65, y: 15, position: "ST", category: "FW" },
  ],
  "5-2-1-2": [
    // 3-5-2 with CAM
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LCB", category: "DF" },
    { x: 50, y: 75, position: "CB", category: "DF" },
    { x: 85, y: 75, position: "RCB", category: "DF" },
    { x: 10, y: 50, position: "LWB", category: "MF" },
    { x: 30, y: 50, position: "CM", category: "MF" },
    { x: 70, y: 50, position: "CM", category: "MF" },
    { x: 90, y: 50, position: "RWB", category: "MF" },
    { x: 50, y: 35, position: "CAM", category: "MF" },
    { x: 35, y: 15, position: "ST", category: "FW" },
    { x: 65, y: 15, position: "ST", category: "FW" },
  ],
};

// 3-4-3 Formation Variations
export const formation3_4_3: { [key: string]: FormationPosition[] } = {
  "3-4-3": [
    // Standard 3-4-3
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 25, y: 75, position: "LCB", category: "DF" },
    { x: 50, y: 75, position: "CB", category: "DF" },
    { x: 75, y: 75, position: "RCB", category: "DF" },
    { x: 15, y: 50, position: "LM", category: "MF" },
    { x: 40, y: 50, position: "CM", category: "MF" },
    { x: 60, y: 50, position: "CM", category: "MF" },
    { x: 85, y: 50, position: "RM", category: "MF" },
    { x: 15, y: 15, position: "LW", category: "FW" },
    { x: 50, y: 15, position: "ST", category: "FW" },
    { x: 85, y: 15, position: "RW", category: "FW" },
  ],
  "3-4-2-1": [
    // 3-4-2-1 formation
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 25, y: 75, position: "LCB", category: "DF" },
    { x: 50, y: 75, position: "CB", category: "DF" },
    { x: 75, y: 75, position: "RCB", category: "DF" },
    { x: 15, y: 50, position: "LM", category: "MF" },
    { x: 40, y: 50, position: "CM", category: "MF" },
    { x: 60, y: 50, position: "CM", category: "MF" },
    { x: 85, y: 50, position: "RM", category: "MF" },
    { x: 30, y: 25, position: "LF", category: "FW" },
    { x: 70, y: 25, position: "RF", category: "FW" },
    { x: 50, y: 10, position: "ST", category: "FW" },
  ],
};

// 5-3-2 Formation Variations
export const formation5_3_2: { [key: string]: FormationPosition[] } = {
  "5-3-2": [
    // Standard 5-3-2
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 15, y: 75, position: "LWB", category: "DF" },
    { x: 35, y: 75, position: "LCB", category: "DF" },
    { x: 50, y: 75, position: "CB", category: "DF" },
    { x: 65, y: 75, position: "RCB", category: "DF" },
    { x: 85, y: 75, position: "RWB", category: "DF" },
    { x: 30, y: 50, position: "CM", category: "MF" },
    { x: 50, y: 50, position: "CM", category: "MF" },
    { x: 70, y: 50, position: "CM", category: "MF" },
    { x: 35, y: 15, position: "ST", category: "FW" },
    { x: 65, y: 15, position: "ST", category: "FW" },
  ],
};

// 5-2-3 Formation Variations
export const formation5_2_3: { [key: string]: FormationPosition[] } = {
  "5-2-3": [
    // Standard 5-2-3
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 10, y: 75, position: "LWB", category: "DF" },
    { x: 30, y: 75, position: "LCB", category: "DF" },
    { x: 50, y: 75, position: "CB", category: "DF" },
    { x: 70, y: 75, position: "RCB", category: "DF" },
    { x: 90, y: 75, position: "RWB", category: "DF" },
    { x: 35, y: 50, position: "CM", category: "MF" },
    { x: 65, y: 50, position: "CM", category: "MF" },
    { x: 25, y: 15, position: "LW", category: "FW" },
    { x: 50, y: 15, position: "ST", category: "FW" },
    { x: 75, y: 15, position: "RW", category: "FW" },
  ],
  "5-2-2-1": [
    // 5-2-2-1 formation
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 10, y: 75, position: "LWB", category: "DF" },
    { x: 30, y: 75, position: "LCB", category: "DF" },
    { x: 50, y: 75, position: "CB", category: "DF" },
    { x: 70, y: 75, position: "RCB", category: "DF" },
    { x: 90, y: 75, position: "RWB", category: "DF" },
    { x: 35, y: 50, position: "CM", category: "MF" },
    { x: 65, y: 50, position: "CM", category: "MF" },
    { x: 30, y: 25, position: "LF", category: "FW" },
    { x: 70, y: 25, position: "RF", category: "FW" },
    { x: 50, y: 10, position: "ST", category: "FW" },
  ],
};

// 5-4-1 Formation Variations
export const formation5_4_1: { [key: string]: FormationPosition[] } = {
  "5-4-1": [
    // Standard 5-4-1
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 10, y: 75, position: "LWB", category: "DF" },
    { x: 30, y: 75, position: "LCB", category: "DF" },
    { x: 50, y: 75, position: "CB", category: "DF" },
    { x: 70, y: 75, position: "RCB", category: "DF" },
    { x: 90, y: 75, position: "RWB", category: "DF" },
    { x: 15, y: 50, position: "LM", category: "MF" },
    { x: 35, y: 50, position: "CM", category: "MF" },
    { x: 65, y: 50, position: "CM", category: "MF" },
    { x: 85, y: 50, position: "RM", category: "MF" },
    { x: 50, y: 15, position: "ST", category: "FW" },
  ],
  "5-1-2-1-1": [
    // Diamond 5-4-1
    { x: 50, y: 95, position: "GK", category: "GK" },
    { x: 10, y: 75, position: "LWB", category: "DF" },
    { x: 30, y: 75, position: "LCB", category: "DF" },
    { x: 50, y: 75, position: "CB", category: "DF" },
    { x: 70, y: 75, position: "RCB", category: "DF" },
    { x: 90, y: 75, position: "RWB", category: "DF" },
    { x: 50, y: 60, position: "CDM", category: "MF" },
    { x: 25, y: 40, position: "LM", category: "MF" },
    { x: 75, y: 40, position: "RM", category: "MF" },
    { x: 50, y: 30, position: "CAM", category: "MF" },
    { x: 50, y: 10, position: "ST", category: "FW" },
  ],
};

// Combined formation positions mapping
export const allFormationPositions: { [key: string]: FormationPosition[] } = {
  ...formation4_4_2,
  ...formation4_5_1,
  ...formation4_3_3,
  ...formation3_5_2,
  ...formation3_4_3,
  ...formation5_3_2,
  ...formation5_2_3,
  ...formation5_4_1,
};

// Helper function to get positions for a formation
export function getFormationPositions(formation: string): FormationPosition[] {
  // Extract just the formation numbers (e.g., "4-4-2" from "4-4-2 Standard Flat")
  const baseFormation = formation.split(" ")[0];
  return allFormationPositions[baseFormation] || [];
}
