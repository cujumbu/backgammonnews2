import * as React from "react";
import { cn } from "@/lib/utils";

interface InputOTPProps extends React.InputHTMLAttributes<HTMLInputElement> {
  value: string;
  maxLength?: number;
  onComplete?: (value: string) => void;
}

const InputOTP = React.forwardRef<HTMLInputElement, InputOTPProps>(
  ({ className, maxLength = 6, value, onChange, onComplete, ...props }, ref) => {
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/[^0-9]/g, "").slice(0, maxLength);
      onChange?.(e);
      if (newValue.length === maxLength) {
        onComplete?.(newValue);
      }
    };

    return (
      <div className="flex gap-2">
        {[...Array(maxLength)].map((_, i) => (
          <div
            key={i}
            className={cn(
              "relative h-10 w-10 rounded-md border bg-transparent text-center text-base",
              className
            )}
          >
            <input
              ref={i === 0 ? ref : undefined}
              className="absolute inset-0 h-full w-full opacity-0"
              type="text"
              pattern="[0-9]*"
              inputMode="numeric"
              maxLength={maxLength}
              value={value}
              onChange={handleChange}
              {...props}
            />
            <div className="pointer-events-none flex h-full items-center justify-center">
              {value[i] || ""}
            </div>
          </div>
        ))}
      </div>
    );
  }
);

InputOTP.displayName = "InputOTP";

export { InputOTP };
