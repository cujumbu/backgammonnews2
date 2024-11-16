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
      className="w-full h-24 bg-wood-dark rounded flex flex-col items-center justify-center"
    >
      {Array.from({ length: Math.min(count, 3) }, (_, i) => (
        <Checker
          key={i}
          pointIndex={25}
          checkerIndex={i}
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
