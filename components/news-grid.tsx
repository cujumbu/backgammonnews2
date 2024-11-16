"use client";

import { useEffect, useState } from "react";
import { NewsItem } from "@/lib/storage";

interface NewsGridProps {
  limit?: number;
}

export default function NewsGrid({ limit = 10 }: NewsGridProps) {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch(`/api/news?limit=${limit}`);
        if (!response.ok) {
          throw new Error('Failed to fetch news');
        }
        const data = await response.json();
        setNews(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news articles');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, [limit]);

  if (loading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="animate-pulse glass-panel p-6 rounded-xl">
            <div className="mb-2 h-4 w-24 bg-gray-200 rounded" />
            <div className="mb-3 h-6 w-3/4 bg-gray-200 rounded" />
            <div className="mb-4 h-20 w-full bg-gray-200 rounded" />
            <div className="flex items-center justify-between">
              <div className="h-4 w-32 bg-gray-200 rounded" />
              <div className="h-4 w-24 bg-gray-200 rounded" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error || !news.length) {
    return (
      <div className="glass-panel p-6 rounded-xl">
        <p className="text-gray-600">
          {error || 'No news articles available.'}
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {news.map((item) => (
        <article 
          key={item.id} 
          className="glass-panel hover:shadow-lg transition-all duration-300 rounded-xl overflow-hidden group"
        >
          <a 
            href={item.url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="block p-6"
          >
            <div className="mb-2 text-sm font-medium text-blue-600">
              {item.category}
            </div>
            <h3 className="mb-3 text-xl font-bold group-hover:text-blue-600 transition-colors duration-200">
              {item.title}
            </h3>
            <p className="mb-4 text-sm text-gray-600 line-clamp-3">
              {item.content || 'No content available'}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <span className="mr-2">📅</span>
                {new Date(item.published_at).toLocaleDateString()}
              </div>
              <span>{item.source}</span>
            </div>
          </a>
        </article>
      ))}
    </div>
  );
}
