"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");

  async function refreshNews() {
    setIsLoading(true);
    setStatus("idle");
    setMessage("");

    try {
      const response = await fetch("/api/fetch-news");
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to fetch news");
      }

      setStatus("success");
      setMessage("News successfully updated");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">News Management</h2>
        
        <div className="flex items-center gap-4">
          <Button
            onClick={refreshNews}
            disabled={isLoading}
            className="gap-2"
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {isLoading ? "Fetching..." : "Refresh News"}
          </Button>

          {status === "success" && (
            <div className="flex items-center gap-2 text-green-600">
              <CheckCircle className="h-5 w-5" />
              <span>{message}</span>
            </div>
          )}

          {status === "error" && (
            <div className="flex items-center gap-2 text-red-600">
              <XCircle className="h-5 w-5" />
              <span>{message}</span>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
}
