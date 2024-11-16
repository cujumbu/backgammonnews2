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
  };
  error?: string;
}

export default function AdminPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [details, setDetails] = useState<NewsResponse["results"] | null>(null);
  const [errorDetails, setErrorDetails] = useState<string>("");

  async function refreshNews() {
    setIsLoading(true);
    setStatus("idle");
    setMessage("");
    setDetails(null);
    setErrorDetails("");

    try {
      const response = await fetch("/api/fetch-news");
      const text = await response.text();
      
      let data: NewsResponse;
      try {
        data = JSON.parse(text);
      } catch (e) {
        console.error('Failed to parse response:', text);
        throw new Error(`Invalid response format: ${text}`);
      }
      
      if (!response.ok) {
        throw new Error(data.error || data.message || 'Failed to fetch news');
      }

      setStatus("success");
      setMessage(data.message || "News successfully updated");
      setDetails(data.results);
    } catch (error) {
      console.error('Error refreshing news:', error);
      setStatus("error");
      setMessage(error instanceof Error ? error.message : 'An error occurred');
      setErrorDetails(error instanceof Error ? error.stack || '' : '');
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
            className="px-4 py-2 bg-blue-600 text-white rounded disabled:opacity-50 hover:bg-blue-700"
          >
            {isLoading ? "Fetching..." : "Refresh News"}
          </button>

          {status === "success" && (
            <div className="mt-2 text-green-600">
              {message}
            </div>
          )}

          {status === "error" && (
            <div className="mt-2">
              <div className="text-red-600 font-medium">
                {message}
              </div>
              {errorDetails && (
                <pre className="mt-2 p-2 bg-red-50 text-red-800 text-sm overflow-x-auto">
                  {errorDetails}
                </pre>
              )}
            </div>
          )}
        </div>

        {details && (
          <div className="mt-4 space-y-4">
            <div>
              <h3 className="font-medium mb-2">RSS Feeds:</h3>
              <ul className="space-y-1">
                {details.rss.map((result, i) => (
                  <li 
                    key={i} 
                    className={`p-2 rounded ${
                      result.error 
                        ? "bg-red-50 text-red-700" 
                        : "bg-green-50 text-green-700"
                    }`}
                  >
                    <span className="font-medium">{result.source}:</span>{" "}
                    {result.error 
                      ? result.error 
                      : `${result.count} items fetched`
                    }
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
