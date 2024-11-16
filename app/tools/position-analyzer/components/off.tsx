'use client';

import { useDroppable } from '@dnd-kit/core';
import { Checker } from './checker';

interface OffProps {
  player: 1 | 2;
  count: number;
}

export function Off({ player, count }: OffProps) {
  const { setNodeRef } = useDroppable({
    id: `off-${player}`,
  });

  return (
    <div
      ref={setNodeRef}
      className="w-full h-20 bg-wood-dark/80 rounded-sm flex flex-col items-center justify-center gap-1"
    >
      {Array.from({ length: Math.min(count, 3) }, (_, i) => (
        <Checker
          key={i}
          id={`off-${player}-${i}`}
          isPlayer1={player === 1}
        />
      ))}
      {count > 3 && (
        <div className="text-white text-xs font-bold bg-black/50 px-1 rounded">
          +{count - 3}
        </div>
      )}
    </div>
  );
}
