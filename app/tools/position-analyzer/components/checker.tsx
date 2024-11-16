'use client';

import { useDraggable } from '@dnd-kit/core';

interface CheckerProps {
  id: string;
  isPlayer1: boolean;
  stackPosition?: number;
}

export function Checker({ id, isPlayer1, stackPosition = 0 }: CheckerProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
    zIndex: isDragging ? 50 : 10,
    scale: isDragging ? 1.1 : 1,
  } : undefined;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        absolute w-8 h-8 rounded-full cursor-move transition-transform
        ${isPlayer1 ? 'checker-white' : 'checker-black'}
        checker-stack-${stackPosition + 1}
        hover:scale-105
      `}
    />
  );
}
