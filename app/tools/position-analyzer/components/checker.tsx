'use client';

import { useDraggable } from '@dnd-kit/core';
import { motion } from 'framer-motion';

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
  } : undefined;

  return (
    <motion.div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      className={`
        absolute w-8 h-8 rounded-full cursor-move
        ${isPlayer1 ? 'checker-white' : 'checker-black'}
        ${isDragging ? 'z-50 scale-110' : 'z-10'}
        checker-stack-${stackPosition + 1}
      `}
      initial={{ scale: 0.8 }}
      animate={{ scale: isDragging ? 1.1 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ scale: 1.05 }}
    />
  );
}
