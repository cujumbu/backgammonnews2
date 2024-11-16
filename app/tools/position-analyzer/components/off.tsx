'use client';

import { useDroppable } from '@dnd-kit/core';
import { Checker } from './checker';

interface OffProps {
  player: 1 | 2;
  count: number;
}

export function Off({ player, count }: OffProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `off-${player}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        w-full h-24 bg-wood-dark/80 rounded-lg 
        flex flex-col items-center justify-center gap-1
        ${isOver ? 'opacity-70' : ''}
      `}
    >
      {Array.from({ length: Math.min(count, 3) }, (_, i) => (
        <Checker
          key={i}
          id={`off-${player}-${i}`}
          isPlayer1={player === 1}
          stackPosition={i}
        />
      ))}
      {count > 3 && (
        <div className="text-white text-xs font-bold bg-black/50 px-2 py-1 rounded-full">
          +{count - 3}
        </div>
      )}
    </div>
  );
}
