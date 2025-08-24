"use client"
import { useFormationStore } from "@/store/formationStore"
import FootballPitch from "./FootballPitch"
import {
  DndContext,
  DragEndEvent,
  DragStartEvent,
  useDraggable,
  useDroppable,
} from "@dnd-kit/core"
import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { formations } from '../data/formationData';

// Roster Player Component (Draggable)
function RosterPlayer({ player }: { player: { id: string; number: number; name: string; role: string } }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `roster-${player.id}`,
    data: { player, source: 'roster' }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`bg-slate-700 rounded-lg p-3 text-center cursor-grab hover:bg-slate-600 transition-colors ${
        isDragging ? 'opacity-50 scale-110' : ''
      }`}
    >
      <div className="text-white font-bold text-sm">#{player.number}</div>
      <div className="text-xs opacity-90 truncate">{player.name}</div>
      <div className="text-xs text-blue-400 font-medium">{player.role}</div>
    </div>
  )
}

// Simple Draggable Card Component
function DraggableCard() {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: 'draggable-card',
    data: { type: 'card' }
  })

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`bg-yellow-400 text-black p-6 rounded-lg shadow-lg cursor-grab hover:bg-yellow-300 transition-colors ${
        isDragging ? 'opacity-50 scale-105' : ''
      }`}
    >
      <div className="font-bold text-lg">🎯 Drag Me</div>
      <div className="text-sm mt-1">Click and drag this card</div>
    </div>
  )
}

// Position Drop Zone Component
function PositionDropZone({ position, player }: { 
  position: { id: string; xPercent: number; yPercent: number }; 
  player: { id: string; number: number; name: string; role: string } | null 
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `position-${position.id}`,
    data: { positionId: position.id }
  })

  return (
    <div
      ref={setNodeRef}
      className={`absolute rounded-full w-16 h-16 border-4 transition-all ${
        player 
          ? 'border-blue-500 bg-blue-600' 
          : isOver 
            ? 'border-green-500 bg-green-400' 
            : 'border-white bg-gray-300 opacity-70'
      }`}
      style={{ 
        left: `${position.xPercent}%`, 
        top: `${position.yPercent}%`, 
        transform: 'translate(-50%, -50%)' 
      }}
    >
      {player ? (
        <div className="flex items-center justify-center text-white text-center">
          <div className="text-xs font-bold">#{player.number}</div>
        </div>
      ) : (
        <div className="flex items-center justify-center">
          <span className={`font-bold text-sm ${
            isOver ? 'text-green-800' : 'text-gray-600'
          }`}>
            {position.id}
          </span>
        </div>
      )}
    </div>
  )
}

// Simple Drop Zone Component
function DropZone({ hasCard, onCardDropped }: { hasCard: boolean; onCardDropped: () => void }) {
  const { setNodeRef, isOver } = useDroppable({
    id: 'drop-zone',
    data: { type: 'zone' }
  })

  return (
    <div
      ref={setNodeRef}
      className={`min-h-48 border-4 border-dashed rounded-lg flex items-center justify-center transition-colors ${
        hasCard 
          ? 'border-green-500 bg-green-100' 
          : isOver 
            ? 'border-green-500 bg-green-100' 
            : 'border-gray-400 bg-gray-50'
      }`}
    >
      {hasCard ? (
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">🎉 Card Dropped!</div>
          <div className="text-sm mt-2 text-green-600">The card is now here</div>
          <button 
            onClick={onCardDropped}
            className="mt-3 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
          >
            Reset Card
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div className={`text-2xl font-bold ${isOver ? 'text-green-600' : 'text-gray-500'}`}>
            {isOver ? '🎉 Drop Here!' : '📥 Drop Zone'}
          </div>
          <div className={`text-sm mt-2 ${isOver ? 'text-green-600' : 'text-gray-400'}`}>
            {isOver ? 'Release to drop the card' : 'Drag the yellow card here'}
          </div>
        </div>
      )}
    </div>
  )
}

export default function FormationVisualizer() {
  const { selectedFormation, playerPositions, assignPlayerToPosition, roster, selectFormation } = useFormationStore();
  const [isDropped, setIsDropped] = useState(false);

  // Safety check
  if (!selectedFormation || !selectedFormation.positions) {
    return (
      <div className="w-full max-w-6xl mx-auto">
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Loading Formation...
          </h2>
          <p className="text-white text-center">Formation data is loading...</p>
        </div>
      </div>
    )
  }

  const handleDragStart = (event: DragStartEvent) => {
    console.log('FormationVisualizer - Drag started:', event);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    console.log('FormationVisualizer - Drag ended:', event);
    
    // Handle simple test card drop
    if (event.over?.id === 'drop-zone') {
      setIsDropped(true);
      return;
    }
    
    // Handle player drops on positions
    if (event.over?.id?.toString().startsWith('position-')) {
      const positionId = event.over.id.toString().replace('position-', '');
      const playerId = event.active.id.toString().replace('roster-', '');
      
      const player = roster.find(p => p.id === playerId);
      if (player) {
        assignPlayerToPosition(positionId, player);
      }
    }
  };

  const handleFormationChange = (formationId: string) => {
    selectFormation(formationId);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="bg-slate-800 rounded-lg p-6">
        {/* Formation Switcher */}
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-white mb-4">Formation Selector</h2>
          <div className="flex justify-center items-center gap-4">
            <label htmlFor="formation-select" className="text-white font-medium">
              Select Formation:
            </label>
            <Select value={selectedFormation.id} onValueChange={handleFormationChange}>
              <SelectTrigger className="w-48 bg-white text-gray-900">
                <SelectValue placeholder="Choose formation" />
              </SelectTrigger>
              <SelectContent>
                {formations.map((formation: { id: string; name: string; positions: { id: string; xPercent: number; yPercent: number; role: string }[] }) => (
                  <SelectItem key={formation.id} value={formation.id}>
                    {formation.name} ({formation.positions.length} players)
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-6 text-center">{selectedFormation.name} Formation</h2>

        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="w-full max-w-4xl aspect-[10/7] mx-auto relative mb-8">
            <FootballPitch />
            {selectedFormation.positions.map(pos => (
              <PositionDropZone key={pos.id} position={pos} player={playerPositions[pos.id]} />
            ))}
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4 text-center">Available Players ({roster.length})</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-48 overflow-y-auto">
              {roster.map((player) => (<RosterPlayer key={player.id} player={player} />))}
            </div>
          </div>
        </DndContext>

        <div className="bg-white rounded-xl shadow-xl p-8 mt-8">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">🧪 Simple Drag & Drop Test</h3>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Draggable Card</h4>
                {!isDropped && <DraggableCard />}
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">Drop Zone</h4>
                <DropZone hasCard={isDropped} onCardDropped={() => setIsDropped(false)} />
              </div>
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
