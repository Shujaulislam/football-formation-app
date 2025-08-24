"use client";
import { useFormationStore } from "@/store/formationStore";
import FootballPitch from "./FootballPitch";
import { DndContext, DragEndEvent, useDraggable, useDroppable } from "@dnd-kit/core";
import { useState, useRef, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { formations } from "@/data/formationData";

// Custom hook for responsive pitch sizing
function useResizeObserver() {
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        setDimensions({ width, height });
      }
    });

    resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return { ref, dimensions };
}

// Enhanced Roster Player Component with Shield Design
function RosterPlayer({
  player,
}: {
  player: { id: string; number: number; name: string; role: string };
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: `roster-${player.id}`,
      data: { player, source: "roster" },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  // Generate initials for avatar
  const initials = player.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  // Get last name for display
  const lastName = player.name.split(" ").pop() || player.name;

  // Role-based colors for position badges (preserved)
  const roleColors = {
    GK: "bg-gradient-to-br from-amber-400 to-orange-500",
    DF: "bg-gradient-to-br from-blue-500 to-indigo-600",
    MF: "bg-gradient-to-br from-emerald-500 to-teal-600",
    FW: "bg-gradient-to-br from-rose-500 to-pink-600",
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`group relative cursor-grab transition-all duration-300 transform hover:-translate-y-1 ${
        isDragging ? "opacity-60 scale-105 shadow-2xl rotate-2" : ""
      }`}
    >
      {/* Shield-shaped card with golden gradient */}
      <div className="relative w-24 h-32">
        {/* Shield background with golden gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 rounded-t-3xl rounded-b-2xl shadow-lg transform rotate-0 group-hover:rotate-1 transition-transform duration-300" />

        {/* Dark gradient overlay for better contrast */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/20 to-transparent rounded-t-3xl rounded-b-2xl" />

        {/* Player number badge (top-left) */}
        <div className="absolute -top-2 -left-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center shadow-lg border-2 border-white">
          <span className="text-white font-bold text-sm">#{player.number}</span>
        </div>

        {/* Player initials avatar (center) */}
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2 w-12 h-12 bg-white/90 rounded-full flex items-center justify-center shadow-md">
          <span className="text-gray-800 font-bold text-lg">{initials}</span>
        </div>

        {/* Player last name (center-bottom) */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 text-center">
          <div className="text-white font-bold text-sm leading-tight drop-shadow-lg">
            {lastName.toUpperCase()}
          </div>
        </div>

        {/* Position badge (bottom) */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div
            className={`px-2 py-1 rounded-full text-xs font-bold text-white shadow-md ${
              roleColors[player.role as keyof typeof roleColors] ||
              "bg-gradient-to-br from-gray-400 to-gray-600"
            }`}
          >
            {player.role}
          </div>
        </div>

        {/* Hover effect - show full name */}
        <div className="absolute inset-0 bg-black/80 rounded-t-3xl rounded-b-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="font-bold text-sm leading-tight">{player.name}</div>
            <div className="text-xs opacity-80 mt-1">
              #{player.number} • {player.role}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Simple Draggable Card Component
function DraggableCard() {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({
      id: "draggable-card",
      data: { type: "card" },
    });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className={`bg-gradient-to-br from-yellow-400 to-orange-400 text-black p-6 rounded-xl shadow-lg cursor-grab hover:shadow-xl transition-all duration-200 transform hover:scale-105 ${
        isDragging ? "opacity-50 scale-110 rotate-3" : ""
      }`}
    >
      <div className="font-bold text-lg">🎯 Drag Me</div>
      <div className="text-sm mt-1">Click and drag this card</div>
    </div>
  );
}

// Enhanced Position Drop Zone Component with Draggable Support
function PositionDropZone({
  position,
  player,
  pitchDimensions,
}: {
  position: { id: string; xPercent: number; yPercent: number; role: string };
  player: { id: string; number: number; name: string; role: string } | null;
  pitchDimensions: { width: number; height: number };
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: `position-${position.id}`,
    data: { positionId: position.id },
  });

  // Make position draggable if it has a player
  const {
    attributes,
    listeners,
    setNodeRef: setDraggableRef,
    transform,
    isDragging,
  } = useDraggable({
    id: `position-${position.id}`,
    data: { positionId: position.id, player },
    disabled: !player, // Only draggable when occupied
  });

  const positionX = (pitchDimensions.width * position.xPercent) / 100;
  const positionY = (pitchDimensions.height * position.yPercent) / 100;

  // Enhanced role-based colors for positions
  const roleColors = {
    GK: "border-amber-400 bg-gradient-to-br from-amber-50 to-orange-50",
    DF: "border-blue-400 bg-gradient-to-br from-blue-50 to-indigo-50",
    MF: "border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50",
    FW: "border-rose-400 bg-gradient-to-br from-rose-50 to-pink-50",
  };

  const defaultColor =
    "border-gray-300 bg-gradient-to-br from-gray-50 to-gray-100";
  const positionColor =
    roleColors[position.role as keyof typeof roleColors] || defaultColor;

  // Combine refs for both droppable and draggable
  const combinedRef = (node: HTMLDivElement | null) => {
    setNodeRef(node);
    setDraggableRef(node);
  };

  return (
    <div
      ref={combinedRef}
      {...(player ? { ...attributes, ...listeners } : {})}
      className={`absolute rounded-2xl w-20 h-20 border-4 transition-all duration-300 shadow-lg backdrop-blur-sm ${
        player
          ? "border-blue-500 bg-gradient-to-br from-blue-500 to-blue-600 shadow-blue-500/50 scale-110 cursor-grab"
          : isOver
          ? "border-emerald-500 bg-gradient-to-br from-emerald-400 to-emerald-500 shadow-emerald-500/50 scale-125 rotate-3"
          : `${positionColor} hover:scale-110 hover:rotate-1`
      } ${isDragging ? "opacity-60 scale-105 shadow-2xl rotate-2" : ""}`}
      style={{
        left: `${positionX}px`,
        top: `${positionY}px`,
        transform: `translate(-50%, -50%) ${
          transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : ""
        }`,
      }}
    >
      {player ? (
        <div className="flex flex-col items-center justify-center text-white text-center h-full">
          <div className="text-lg font-bold drop-shadow-lg">
            #{player.number}
          </div>
          <div className="text-xs font-medium leading-tight drop-shadow-lg">
            {player.name
              .split(" ")
              .map((n) => n[0])
              .join(".")
              .toUpperCase()}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <span
            className={`font-bold text-sm ${
              isOver ? "text-emerald-800" : "text-gray-700"
            }`}
          >
            {position.id}
          </span>
        </div>
      )}
    </div>
  );
}

// Simple Drop Zone Component
function DropZone({
  hasCard,
  onCardDropped,
}: {
  hasCard: boolean;
  onCardDropped: () => void;
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: "drop-zone",
    data: { type: "zone" },
  });

  return (
    <div
      ref={setNodeRef}
      className={`min-h-48 border-4 border-dashed rounded-xl flex items-center justify-center transition-all duration-300 ${
        hasCard
          ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-100"
          : isOver
          ? "border-emerald-500 bg-gradient-to-br from-emerald-50 to-green-100 scale-105"
          : "border-gray-400 bg-gradient-to-br from-gray-50 to-gray-100"
      }`}
    >
      {hasCard ? (
        <div className="text-center">
          <div className="text-2xl font-bold text-emerald-600">
            🎉 Card Dropped!
          </div>
          <div className="text-sm mt-2 text-emerald-600">
            The card is now here
          </div>
          <button
            onClick={onCardDropped}
            className="mt-3 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-200"
          >
            Reset Card
          </button>
        </div>
      ) : (
        <div className="text-center">
          <div
            className={`text-2xl font-bold ${
              isOver ? "text-emerald-600" : "text-gray-500"
            }`}
          >
            {isOver ? "🎉 Drop Here!" : "📥 Drop Zone"}
          </div>
          <div
            className={`text-sm mt-2 ${
              isOver ? "text-emerald-600" : "text-gray-400"
            }`}
          >
            {isOver ? "Release to drop the card" : "Drag the yellow card here"}
          </div>
        </div>
      )}
    </div>
  );
}

// Category Filter Component with Horizontal Layout
function CategoryFilter({
  selectedCategories,
  onCategoryToggle,
  playerCounts,
}: {
  selectedCategories: string[];
  onCategoryToggle: (category: string) => void;
  playerCounts: Record<string, number>;
}) {
  const categories = [
    { key: "GK", label: "GK", color: "from-amber-400 to-orange-500" },
    { key: "DF", label: "DF", color: "from-blue-500 to-indigo-600" },
    { key: "MF", label: "MF", color: "from-emerald-500 to-teal-600" },
    { key: "FW", label: "FW", color: "from-rose-500 to-pink-600" },
  ];

  return (
    <div className="mt-6 p-4 bg-slate-600 rounded-xl">
      <h4 className="text-white font-semibold text-sm mb-3 text-center">
        Filter by Position
      </h4>
      <div className="flex gap-2 justify-center">
        {categories.map(({ key, label, color }) => {
          const isSelected = selectedCategories.includes(key);
          return (
            <button
              key={key}
              onClick={() => onCategoryToggle(key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 ${
                isSelected
                  ? `bg-gradient-to-r ${color} text-white shadow-lg`
                  : "bg-slate-500 text-slate-200 hover:bg-slate-400"
              }`}
            >
              {label} ({playerCounts[key] || 0})
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default function FormationVisualizer() {
  const {
    selectedFormation,
    playerPositions,
    assignPlayerToPosition,
    roster,
    selectFormation,
  } = useFormationStore();
  const [isDropped, setIsDropped] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const { ref: pitchRef, dimensions: pitchDimensions } = useResizeObserver();

  // Calculate player counts by category
  const playerCounts = roster.reduce((acc, player) => {
    acc[player.role] = (acc[player.role] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  // Filter roster based on selected categories
  const filteredRoster =
    selectedCategories.length > 0
      ? roster.filter((player) => selectedCategories.includes(player.role))
      : roster;

  // Toggle category selection
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((prev) =>
      prev.includes(category)
        ? prev.filter((c) => c !== category)
        : [...prev, category]
    );
  };

  // Safety check
  if (!selectedFormation || !selectedFormation.positions) {
    return (
      <div className="w-full max-w-[95vw] mx-auto">
        <div className="bg-slate-800 rounded-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            Loading Formation...
          </h2>
          <p className="text-white text-center">Formation data is loading...</p>
        </div>
      </div>
    );
  }

  const handleDragStart = () => {
    // Drag start handling (removed console.log)
  };

  const handleDragEnd = (event: DragEndEvent) => {
    // Handle simple test card drop
    if (event.over?.id === "drop-zone") {
      setIsDropped(true);
      return;
    }

    // Handle player drops on positions
    if (event.over?.id?.toString().startsWith("position-")) {
      const targetPositionId = event.over.id
        .toString()
        .replace("position-", "");
      const draggedPlayerId = event.active.id.toString();

      // Check if dragging from roster or from another position
      if (draggedPlayerId.startsWith("roster-")) {
        // Dragging from roster to position
        const playerId = draggedPlayerId.replace("roster-", "");
        const player = roster.find((p) => p.id === playerId);
        if (player) {
          assignPlayerToPosition(targetPositionId, player);
        }
      } else if (draggedPlayerId.startsWith("position-")) {
        // Dragging from position to position (player swap)
        const sourcePositionId = draggedPlayerId.replace("position-", "");
        const { swapPlayers } = useFormationStore.getState();
        swapPlayers(sourcePositionId, targetPositionId);
      }
    }
  };

  const handleFormationChange = (formationId: string) => {
    selectFormation(formationId);
  };

  return (
    <div className="w-full max-w-[95vw] mx-auto">
      <div className="bg-slate-800 rounded-lg p-6">
        {/* Formation Switcher */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Formation Selector
          </h2>
          <div className="flex justify-center items-center gap-4">
            <label
              htmlFor="formation-select"
              className="text-white font-medium text-lg"
            >
              Select Formation:
            </label>
            <Select
              value={selectedFormation.id}
              onValueChange={handleFormationChange}
            >
              <SelectTrigger className="w-56 bg-white text-gray-900 text-lg">
                <SelectValue placeholder="Choose formation" />
              </SelectTrigger>
              <SelectContent>
                {formations.map(
                  (formation: {
                    id: string;
                    name: string;
                    positions: {
                      id: string;
                      xPercent: number;
                      yPercent: number;
                      role: string;
                    }[];
                  }) => (
                    <SelectItem key={formation.id} value={formation.id}>
                      {formation.name} ({formation.positions.length} players)
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
          </div>
        </div>

        <h2 className="text-3xl font-bold text-white mb-8 text-center">
          {selectedFormation.name} Formation
        </h2>

        {/* Main Content - Pitch and Roster Side by Side */}
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="flex gap-8 items-start">
            {/* Left Side - Pitch (Squashed by 10%) */}
            <div className="flex-1">
              <div
                ref={pitchRef}
                className="w-full max-w-4xl aspect-[10/6.3] mx-auto relative"
              >
                <FootballPitch />
                {selectedFormation.positions.map((pos) => (
                  <PositionDropZone
                    key={pos.id}
                    position={pos}
                    player={playerPositions[pos.id]}
                    pitchDimensions={pitchDimensions}
                  />
                ))}
              </div>
            </div>

            {/* Right Side - Enhanced Roster */}
            <div className="w-96 flex-shrink-0">
              <div className="bg-gradient-to-br from-slate-700 to-slate-800 rounded-2xl p-6 shadow-2xl border border-slate-600">
                <h3 className="text-xl font-bold text-white mb-6 text-center">
                  Available Players ({filteredRoster.length})
                </h3>

                {/* Player Grid - Responsive 2 columns for shield cards */}
                <div className="grid grid-cols-2 gap-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar justify-items-center">
                  {filteredRoster.map((player) => (
                    <RosterPlayer key={player.id} player={player} />
                  ))}
                </div>

                {/* Category Filter at Bottom */}
                <CategoryFilter
                  selectedCategories={selectedCategories}
                  onCategoryToggle={handleCategoryToggle}
                  playerCounts={playerCounts}
                />
              </div>
            </div>
          </div>
        </DndContext>

        {/* Simple Drag & Drop Test Section */}
        <div className="bg-white rounded-xl shadow-xl p-8 mt-8">
          <h3 className="text-2xl font-bold text-center text-gray-800 mb-6">
            🧪 Simple Drag & Drop Test
          </h3>
          <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col items-center">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                  Draggable Card
                </h4>
                {!isDropped && <DraggableCard />}
              </div>
              <div className="flex flex-col items-center">
                <h4 className="text-lg font-semibold text-gray-700 mb-4">
                  Drop Zone
                </h4>
                <DropZone
                  hasCard={isDropped}
                  onCardDropped={() => setIsDropped(false)}
                />
              </div>
            </div>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
