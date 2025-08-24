import { create } from 'zustand';
import { Formation, Player, formations, sampleRoster } from '../data/formationData';

interface PlayerPositionMap {
  [positionId: string]: Player | null;
}

interface FormationState {
  selectedFormation: Formation;
  playerPositions: PlayerPositionMap;
  roster: Player[];
  selectFormation: (formationId: string) => void;
  assignPlayerToPosition: (positionId: string, player: Player) => void;
  swapPlayers: (pos1: string, pos2: string) => void;
  resetPositions: () => void;
}

export const useFormationStore = create<FormationState>((set) => ({
  selectedFormation: formations[0],
  playerPositions: {},
  roster: sampleRoster,
  selectFormation: (formationId) => set(() => ({
    selectedFormation: formations.find(f => f.id === formationId) || formations[0],
    playerPositions: {},
  })),
  assignPlayerToPosition: (positionId, player) =>
    set((state) => {
      if (!player) {
        // Remove player from position
        const removedPlayer = state.playerPositions[positionId]
        const newPlayerPositions = { ...state.playerPositions }
        delete newPlayerPositions[positionId]
        
        return {
          playerPositions: newPlayerPositions,
          roster: removedPlayer ? [...state.roster, removedPlayer] : state.roster
        }
      } else {
        // Assign player to position
        return {
          playerPositions: { ...state.playerPositions, [positionId]: player },
          roster: state.roster.filter(p => p.id !== player.id)
        }
      }
    }),
  swapPlayers: (pos1, pos2) =>
    set((state) => {
      const player1 = state.playerPositions[pos1];
      const player2 = state.playerPositions[pos2];
      return {
        playerPositions: {
          ...state.playerPositions,
          [pos1]: player2 || null,
          [pos2]: player1 || null,
        },
      };
    }),
  resetPositions: () =>
    set(() => ({
      playerPositions: {},
      roster: sampleRoster,
    })),
}));
