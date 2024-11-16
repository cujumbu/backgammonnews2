'use client';

import { useDroppable } from '@dnd-kit/core';
import { Checker } from './checker';

interface PointProps {
  index: number;
  value: number;
  isTop: boolean;
}

export function Point({ index, value, isTop }: PointProps) {
  const { setNodeRef } = useDroppable({
    id: `point-${index}`,
  });

  const checkers = Math.abs(value);
  const isPlayer1 = value > 0;

  return (
    <div
      ref={setNodeRef}
      className={`relative h-full ${
        index % 2 === 0 ? 'bg-point-dark' : 'bg-point-light'
      } ${isTop ? 'triangle-down' : 'triangle-up'}`}
    >
      <div 
        className={`absolute inset-x-0 ${
          isTop ? 'bottom-0' : 'top-0'
        } flex flex-col items-center gap-[2px]`}
      >
        {Array.from({ length: Math.min(checkers, 5) }, (_, i) => (
          <Checker
            key={i}
            id={`checker-${index}-${i}`}
            isPlayer1={isPlayer1}
          />
        ))}
        {checkers > 5 && (
          <div className="text-white text-xs font-bold bg-black/50 px-1 rounded">
            +{checkers - 5}
          </div>
        )}
      </div>
    </div>
  );
}
