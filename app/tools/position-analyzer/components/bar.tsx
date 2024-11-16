'use client';

import { useDroppable } from '@dnd-kit/core';
import { Checker } from './checker';

interface BarProps {
  player: 1 | 2;
  count: number;
}

export function Bar({ player, count }: BarProps) {
  const { setNodeRef, isOver } = useDroppable({
    id: `bar-${player}`,
  });

  return (
    <div
      ref={setNodeRef}
      className={`
        w-10 h-full bg-wood-dark/80 rounded-lg 
        flex flex-col items-center justify-center gap-1
        ${isOver ? 'opacity-70' : ''}
      `}
    >
      {Array.from({ length: Math.min(count, 3) }, (_, i) => (
        <Checker
          key={i}
          id={`bar-${player}-${i}`}
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
