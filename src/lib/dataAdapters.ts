/**
 * Data Adapters
 * 
 * This module provides adapter functions to convert between different data formats
 * used across the application (coordinates, compatibility, visual, etc.)
 */

import { FormationPosition } from '@/data/formationCompatibility';
import { standardizePosition, getPositionCategory } from './positionMapping';

// Import types from existing data files
interface CoordinatePosition {
  x: number;
  y: number;
  position: string;
  category: string;
}

interface CoordinatePositionPercent {
  xPercent: number;
  yPercent: number;
  role: string;
  id?: string;
}

interface SimplePosition {
  position: string;
  category: string;
}

/**
 * Convert coordinate-based formation data to compatibility format
 */
export function convertCoordinatesToCompatibility(
  coordinatePositions: CoordinatePosition[]
): FormationPosition[] {
  return coordinatePositions.map(pos => ({
    position: standardizePosition(pos.position),
    category: getPositionCategory(pos.position),
    isRequired: true,
    alternatives: []
  }));
}

/**
 * Convert percentage-based formation data to compatibility format
 */
export function convertPercentToCompatibility(
  percentPositions: CoordinatePositionPercent[]
): FormationPosition[] {
  return percentPositions.map(pos => ({
    position: standardizePosition(pos.role),
    category: getPositionCategory(pos.role),
    isRequired: true,
    alternatives: []
  }));
}

/**
 * Convert compatibility format to simple position format
 */
export function convertCompatibilityToSimple(
  compatibilityPositions: FormationPosition[]
): SimplePosition[] {
  return compatibilityPositions.map(pos => ({
    position: pos.position,
    category: pos.category
  }));
}

/**
 * Convert any formation data format to simple position format
 */
export function convertToSimplePositions(
  data: any,
  format: 'coordinates' | 'percent' | 'compatibility' | 'simple'
): SimplePosition[] {
  switch (format) {
    case 'coordinates':
      return convertCompatibilityToSimple(
        convertCoordinatesToCompatibility(data as CoordinatePosition[])
      );
    case 'percent':
      return convertCompatibilityToSimple(
        convertPercentToCompatibility(data as CoordinatePositionPercent[])
      );
    case 'compatibility':
      return convertCompatibilityToSimple(data as FormationPosition[]);
    case 'simple':
      return data as SimplePosition[];
    default:
      throw new Error(`Unknown format: ${format}`);
  }
}

/**
 * Extract unique positions from formation data
 */
export function extractUniquePositions(
  positions: SimplePosition[]
): { position: string; category: string; count: number }[] {
  const positionCounts = new Map<string, { category: string; count: number }>();
  
  positions.forEach(pos => {
    const standard = standardizePosition(pos.position);
    const existing = positionCounts.get(standard);
    
    if (existing) {
      existing.count++;
    } else {
      positionCounts.set(standard, {
        category: getPositionCategory(pos.position),
        count: 1
      });
    }
  });
  
  return Array.from(positionCounts.entries()).map(([position, data]) => ({
    position,
    category: data.category,
    count: data.count
  }));
}

/**
 * Validate formation data format
 */
export function validateFormationData(
  data: any,
  expectedFormat: 'coordinates' | 'percent' | 'compatibility' | 'simple'
): boolean {
  if (!Array.isArray(data)) return false;
  
  switch (expectedFormat) {
    case 'coordinates':
      return data.every((pos: any) => 
        typeof pos.x === 'number' && 
        typeof pos.y === 'number' && 
        typeof pos.position === 'string' && 
        typeof pos.category === 'string'
      );
    case 'percent':
      return data.every((pos: any) => 
        typeof pos.xPercent === 'number' && 
        typeof pos.yPercent === 'number' && 
        typeof pos.role === 'string'
      );
    case 'compatibility':
      return data.every((pos: any) => 
        typeof pos.position === 'string' && 
        typeof pos.category === 'string' && 
        typeof pos.isRequired === 'boolean'
      );
    case 'simple':
      return data.every((pos: any) => 
        typeof pos.position === 'string' && 
        typeof pos.category === 'string'
      );
    default:
      return false;
  }
}

/**
 * Merge formation data from multiple sources
 */
export function mergeFormationData(
  sources: Array<{ data: any; format: 'coordinates' | 'percent' | 'compatibility' | 'simple' }>
): SimplePosition[] {
  const allPositions: SimplePosition[] = [];
  
  sources.forEach(source => {
    try {
      const positions = convertToSimplePositions(source.data, source.format);
      allPositions.push(...positions);
    } catch (error) {
      console.warn(`Failed to convert formation data: ${error}`);
    }
  });
  
  return allPositions;
}

/**
 * Create formation summary from position data
 */
export function createFormationSummary(
  positions: SimplePosition[],
  formationName: string
): {
  formation: string;
  totalPositions: number;
  positionBreakdown: { [category: string]: number };
  uniquePositions: { position: string; category: string; count: number }[];
} {
  const uniquePositions = extractUniquePositions(positions);
  const positionBreakdown: { [category: string]: number } = {};
  
  uniquePositions.forEach(pos => {
    positionBreakdown[pos.category] = (positionBreakdown[pos.category] || 0) + pos.count;
  });
  
  return {
    formation: formationName,
    totalPositions: positions.length,
    positionBreakdown,
    uniquePositions
  };
}
