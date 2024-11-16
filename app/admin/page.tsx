"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCcw, CheckCircle, XCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

interface FetchResult {
  source: string;
  count?: number;
  error?: string;
}

interface NewsResponse {
  message: string;
  results?: {
    rss: FetchResult[];
    reddit: FetchResult[];
  };
}

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<NewsResponse["results"] | null>(null);

  async function refreshNews() {
    setIsLoading(true);
    setStatus("idle");
    setMessage("");
    setDetails(null);

    try {
      const response = await fetch("/api/fetch-news");
      
      if (!response.ok) {
        const text = await response.text();
        let errorMessage: string;
        try {
          const data = JSON.parse(text);
          errorMessage = data.message || 'Failed to fetch news';
        } catch {
          errorMessage = text || 'Failed to fetch news';
        }
        throw new Error(errorMessage);
      }

      const data: NewsResponse = await response.json();
      setStatus("success");
      setMessage(data.message || "News successfully updated");
      setDetails(data.results);
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-3xl font-bold">Admin Dashboard</h1>

      <Card className="p-6">
        <h2 className="mb-4 text-xl font-semibold">News Management</h2>
        
        <div className="flex items-center gap-4 mb-4">
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

        {details && (
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-medium mb-2">RSS Feeds:</h3>
              <ul className="space-y-1 text-sm">
                {details.rss.map((result, i) => (
                  <li key={i} className={result.error ? "text-red-500" : "text-green-500"}>
                    {result.source}: {result.error ? result.error : `${result.count} items fetched`}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Reddit:</h3>
              <ul className="space-y-1 text-sm">
                {details.reddit.map((result, i) => (
                  <li key={i} className={result.error ? "text-red-500" : "text-green-500"}>
                    {result.source}: {result.error ? result.error : `${result.count} items fetched`}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
