'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent, useSensor, useSensors, PointerSensor } from '@dnd-kit/core';
import { restrictToWindowEdges } from '@dnd-kit/modifiers';
import { Point } from './point';
import { Bar } from './bar';
import { Off } from './off';
import { Position } from '../lib/types';

interface BoardProps {
  position: Position;
  onChange: (position: Position) => void;
}

export function Board({ position, onChange }: BoardProps) {
  const [_activeDragger, setActiveDragger] = useState<string | null>(null);
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragger(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragger(null);
    const { active, over } = event;

    if (!over) return;

    const fromId = active.id as string;
    const toId = over.id as string;

    // Create a deep copy of the position
    const newPosition = JSON.parse(JSON.stringify(position)) as Position;

    // Handle moving checkers
    const [fromType, fromPoint] = fromId.split('-');
    const [toType, toPoint] = toId.split('-');

    // Remove from source
    if (fromType === 'point') {
      const pointIndex = parseInt(fromPoint);
      if (newPosition.points[pointIndex] > 0) {
        newPosition.points[pointIndex]--;
      } else if (newPosition.points[pointIndex] < 0) {
        newPosition.points[pointIndex]++;
      }
    } else if (fromType === 'bar') {
      const playerIndex = parseInt(fromPoint) - 1;
      if (newPosition.bar[playerIndex] > 0) {
        newPosition.bar[playerIndex]--;
      }
    }

    // Add to destination
    if (toType === 'point') {
      const pointIndex = parseInt(toPoint);
      const currentValue = newPosition.points[pointIndex];
      const isPlayer1 = fromType === 'bar' ? parseInt(fromPoint) === 1 :
                       fromType === 'point' && newPosition.points[parseInt(fromPoint)] >= 0;
      
      if (currentValue === 0 || (currentValue > 0) === isPlayer1) {
        newPosition.points[pointIndex] += isPlayer1 ? 1 : -1;
      }
    } else if (toType === 'bar') {
      const playerIndex = parseInt(toPoint) - 1;
      newPosition.bar[playerIndex]++;
    } else if (toType === 'off') {
      const playerIndex = parseInt(toPoint) - 1;
      newPosition.off[playerIndex]++;
    }

    onChange(newPosition);
  };

  return (
    <DndContext 
      sensors={sensors} 
      onDragStart={handleDragStart} 
      onDragEnd={handleDragEnd}
      modifiers={[restrictToWindowEdges]}
    >
      <div className="relative w-full max-w-4xl mx-auto bg-wood-pattern rounded-lg p-6 shadow-xl">
        <div className="aspect-[2/1] relative">
          <div className="absolute inset-0 grid grid-cols-12 gap-1">
            {/* Top row (points 13-24) */}
            <div className="col-span-12 grid grid-cols-12 gap-1 h-[45%]">
              {Array.from({ length: 12 }, (_, i) => (
                <Point
                  key={24 - i}
                  index={24 - i}
                  value={position.points[24 - i]}
                  isTop
                />
              ))}
            </div>

            {/* Middle bar */}
            <div className="col-span-12 flex justify-center items-center h-[10%] relative">
              <div className="absolute left-4">
                <Bar player={1} count={position.bar[0]} />
              </div>
              <div className="absolute right-4">
                <Bar player={2} count={position.bar[1]} />
              </div>
            </div>

            {/* Bottom row (points 1-12) */}
            <div className="col-span-12 grid grid-cols-12 gap-1 h-[45%]">
              {Array.from({ length: 12 }, (_, i) => (
                <Point
                  key={i + 1}
                  index={i + 1}
                  value={position.points[i + 1]}
                  isTop={false}
                />
              ))}
            </div>
          </div>

          {/* Off areas */}
          <div className="absolute -right-16 inset-y-0 w-12 flex flex-col justify-between">
            <Off player={2} count={position.off[1]} />
            <Off player={1} count={position.off[0]} />
          </div>

          {/* Point numbers */}
          <div className="absolute -bottom-6 left-0 right-16 grid grid-cols-12 gap-1 text-xs text-center">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={i + 1}>{i + 1}</div>
            ))}
          </div>
          <div className="absolute -top-6 left-0 right-16 grid grid-cols-12 gap-1 text-xs text-center">
            {Array.from({ length: 12 }, (_, i) => (
              <div key={24 - i}>{24 - i}</div>
            ))}
          </div>
        </div>
      </div>
    </DndContext>
  );
}
