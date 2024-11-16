'use client';

import { useDroppable } from '@dnd-kit/core';
import { Checker } from './checker';

interface PointProps {
  index: number;
  value: number;
  isTop: boolean;
  isDragging?: boolean;
}

export function Point({ index, value, isTop, isDragging }: PointProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `point-${index}`,
  });

  const checkers = Math.abs(value);
  const isPlayer1 = value > 0;

  return (
    <div
      ref={setNodeRef}
      className={`
        relative h-full 
        ${index % 2 === 0 ? 'point-dark' : 'point-light'}
        ${isTop ? 'triangle-down' : 'triangle-up'}
        ${isOver ? 'opacity-70' : ''}
        ${isDragging ? 'opacity-50' : ''}
      `}
    >
      <div 
        className={`
          absolute inset-x-0 
          ${isTop ? 'bottom-0' : 'top-0'}
          flex flex-col items-center
        `}
      >
        {Array.from({ length: Math.min(checkers, 5) }, (_, i) => (
          <Checker
            key={i}
            id={`point-${index}-${i}`}
            isPlayer1={isPlayer1}
            stackPosition={i}
          />
        ))}
        {checkers > 5 && (
          <div className={`
            absolute ${isTop ? 'bottom-0' : 'top-0'} 
            text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-full
            transform ${isTop ? 'translate-y-8' : '-translate-y-8'}
          `}>
            +{checkers - 5}
          </div>
        )}
      </div>
    </div>
  );
}
