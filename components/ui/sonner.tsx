"use client";

import { useTheme } from 'next-themes';

export function Toaster() {
  const { theme } = useTheme();

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className={`rounded-lg bg-background p-4 shadow-lg ${theme === 'dark' ? 'dark' : ''}`}>
        <div className="flex items-center space-x-2">
          <div className="text-sm font-medium">Notification</div>
        </div>
      </div>
    </div>
  );
}
