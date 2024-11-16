'use client';

import { useDroppable } from '@dnd-kit/core';
import { Checker } from './checker';

interface BarProps {
  player: 1 | 2;
  count: number;
}

export function Bar({ player, count }: BarProps) {
  const { setNodeRef } = useDroppable({
    id: `bar-${player}`,
  });

  return (
    <div
      ref={setNodeRef}
      className="w-8 h-full bg-wood-dark/80 rounded-sm flex flex-col items-center justify-center gap-1"
    >
      {Array.from({ length: Math.min(count, 3) }, (_, i) => (
        <Checker
          key={i}
          id={`bar-${player}-${i}`}
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
