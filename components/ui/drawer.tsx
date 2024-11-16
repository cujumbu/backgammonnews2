"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';

interface DrawerProps extends React.HTMLAttributes<HTMLDivElement> {
  open?: boolean;
  onClose?: () => void;
}

export function Drawer({ 
  children, 
  className,
  open = false,
  onClose,
  ...props 
}: DrawerProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && open) {
        onClose?.();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
      />
      <div
        className={cn(
          "fixed bottom-0 left-0 right-0 h-[90vh] rounded-t-[10px] bg-background p-4",
          className
        )}
        {...props}
      >
        <div className="mx-auto mb-8 h-1.5 w-12 rounded-full bg-muted" />
        {children}
      </div>
    </div>
  );
}
