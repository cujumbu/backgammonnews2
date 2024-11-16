'use client';

import { useDraggable } from '@dnd-kit/core';

interface CheckerProps {
  pointIndex: number;
  checkerIndex: number;
  isPlayer1: boolean;
}

export function Checker({ pointIndex, checkerIndex, isPlayer1 }: CheckerProps) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: `checker-${pointIndex}-${checkerIndex}`,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`w-8 h-8 rounded-full border-2 cursor-move
        ${isPlayer1 ? 'bg-white border-gray-300' : 'bg-black border-gray-700'}
      `}
    />
  );
}
