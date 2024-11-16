"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcwIcon } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[400px] flex-col items-center justify-center">
      <h2 className="mb-4 text-2xl font-bold">Something went wrong!</h2>
      <Button onClick={reset} variant="outline" className="gap-2">
        <RefreshCcwIcon className="h-4 w-4" />
        Try again
      </Button>
    </div>
  );
}