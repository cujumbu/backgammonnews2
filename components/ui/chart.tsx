"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';

interface ChartProps extends React.HTMLAttributes<HTMLDivElement> {
  data: Array<Record<string, any>>;
  xKey: string;
  yKey: string;
}

export function Chart({ data, xKey, yKey, className, ...props }: ChartProps) {
  return (
    <div className={cn("w-full h-[400px]", className)} {...props}>
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        Chart visualization placeholder
      </div>
    </div>
  );
}
