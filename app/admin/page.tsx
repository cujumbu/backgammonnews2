"use client";

import { useState } from "react";

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
    <div>
      <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
      
      <div className="p-4 border rounded">
        <h2 className="text-xl font-semibold mb-4">News Management</h2>
        
        <div className="mb-4">
          <button
            onClick={refreshNews}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {isLoading ? "Fetching..." : "Refresh News"}
          </button>

          {status === "success" && (
            <div className="mt-2 text-green-600">
              {message}
            </div>
          )}

          {status === "error" && (
            <div className="mt-2 text-red-600">
              {message}
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
      </div>
    </div>
  );
}
