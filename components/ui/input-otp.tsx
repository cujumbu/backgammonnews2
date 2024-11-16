"use client";

import * as React from 'react';
import { cn } from '@/lib/utils';

interface InputOTPProps extends React.InputHTMLAttributes<HTMLInputElement> {
  length?: number;
  onComplete?: (value: string) => void;
}

export function InputOTP({ 
  className,
  length = 6,
  onComplete,
  ...props 
}: InputOTPProps) {
  const [value, setValue] = React.useState('');
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([]);

  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(-1);
    const newFullValue = value.slice(0, index) + newValue + value.slice(index + 1);
    setValue(newFullValue);

    if (newValue && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }

    if (newFullValue.length === length) {
      onComplete?.(newFullValue);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className={cn("flex gap-2", className)}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={el => inputRefs.current[i] = el}
          type="text"
          inputMode="numeric"
          pattern="[0-9]"
          maxLength={1}
          value={value[i] || ''}
          onChange={e => handleChange(i, e)}
          onKeyDown={e => handleKeyDown(i, e)}
          className="h-10 w-10 rounded-md border border-input bg-background text-center text-lg"
          {...props}
        />
      ))}
    </div>
  );
}
