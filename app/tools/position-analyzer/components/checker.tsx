'use client';

import { useDraggable } from '@dnd-kit/core';

interface CheckerProps {
  id: string;
  isPlayer1: boolean;
}

export function Checker({ id, isPlayer1 }: CheckerProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id,
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
      className={`
        w-6 h-6 rounded-full border-2 cursor-move transition-transform
        ${isPlayer1 
          ? 'bg-white border-gray-300 hover:bg-gray-100' 
          : 'bg-black border-gray-700 hover:bg-gray-900'
        }
        ${isDragging ? 'z-50 scale-110' : 'z-10'}
      `}
    />
  );
}
