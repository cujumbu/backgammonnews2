'use client';

import { useState } from 'react';
import { DndContext, DragEndEvent, DragStartEvent } from '@dnd-kit/core';
import { Point } from './point';
import { Bar } from './bar';
import { Off } from './off';
import { Position } from '../lib/types';

interface BoardProps {
  position: Position;
  onChange: (position: Position) => void;
}

export function Board({ position, onChange }: BoardProps) {
  const [activeDragger, setActiveDragger] = useState<string | null>(null);

  const handleDragStart = (event: DragStartEvent) => {
    setActiveDragger(event.active.id as string);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragger(null);
    const { active, over } = event;

    if (!over) return;

    const fromId = active.id as string;
    const toId = over.id as string;

    // Parse the IDs to determine source and destination
    const [fromType, fromIndex] = fromId.split('-');
    const [toType, toIndex] = toId.split('-');

    const newPosition = { ...position };

    // Remove checker from source
    if (fromType === 'point') {
      const pointIndex = parseInt(fromIndex);
      const value = newPosition.points[pointIndex];
      if (value > 0) {
        newPosition.points[pointIndex]--;
      } else if (value < 0) {
        newPosition.points[pointIndex]++;
      }
    } else if (fromType === 'bar') {
      const playerIndex = parseInt(fromIndex) - 1;
      newPosition.bar[playerIndex]--;
    } else if (fromType === 'off') {
      const playerIndex = parseInt(fromIndex) - 1;
      newPosition.off[playerIndex]--;
    }

    // Add checker to destination
    if (toType === 'point') {
      const pointIndex = parseInt(toIndex);
      const currentValue = newPosition.points[pointIndex];
      if (currentValue >= 0) {
        newPosition.points[pointIndex]++;
      } else {
        newPosition.points[pointIndex]--;
      }
    } else if (toType === 'bar') {
      const playerIndex = parseInt(toIndex) - 1;
      newPosition.bar[playerIndex]++;
    } else if (toType === 'off') {
      const playerIndex = parseInt(toIndex) - 1;
      newPosition.off[playerIndex]++;
    }

    onChange(newPosition);
  };

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="relative w-full max-w-3xl mx-auto aspect-[2/1] bg-wood-pattern rounded-lg p-4">
        <div className="absolute inset-0 grid grid-cols-12 gap-2 p-4">
          {/* Points 13-24 (top) */}
          <div className="col-span-12 grid grid-cols-12 gap-2 h-[45%]">
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
          <div className="col-span-12 flex justify-between items-center h-[10%]">
            <Bar player={1} count={position.bar[0]} />
            <Bar player={2} count={position.bar[1]} />
          </div>

          {/* Points 1-12 (bottom) */}
          <div className="col-span-12 grid grid-cols-12 gap-2 h-[45%]">
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
      </div>
    </DndContext>
  );
}
