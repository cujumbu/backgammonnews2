"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsItem } from "@/lib/storage";

export default function NewsGrid() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchNews() {
      try {
        const response = await fetch('/api/news?limit=6');
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch news');
        }

        if (data.error) {
          setError(data.error);
          return;
        }

        setNews(Array.isArray(data) ? data : []);
        setError(null);
      } catch (error) {
        console.error('Error fetching news:', error);
        setError('Failed to load news articles');
      } finally {
        setLoading(false);
      }
    }

    fetchNews();
  }, []);

  if (loading) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold">Latest News</h2>
        <div className="grid gap-6">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <div className="grid md:grid-cols-2">
                <div className="relative aspect-video md:aspect-square">
                  <Skeleton className="h-full w-full" />
                </div>
                <div className="p-6">
                  <Skeleton className="mb-2 h-4 w-24" />
                  <Skeleton className="mb-3 h-6 w-3/4" />
                  <Skeleton className="mb-4 h-20 w-full" />
                  <div className="flex items-center justify-between">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !news.length) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold">Latest News</h2>
        <Card className="p-6">
          <p className="text-muted-foreground">
            {error || 'No news articles available.'}
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Latest News</h2>
      <div className="grid gap-6">
        {news.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="relative aspect-video md:aspect-square">
                {item.image_url && (
                  <Image
                    src={item.image_url}
                    alt={item.title}
                    fill
                    className="object-cover"
                  />
                )}
              </div>
              <div className="p-6">
                <div className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
                  {item.category}
                </div>
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="mb-4 text-sm text-muted-foreground">
                  {item.content && item.content.length > 150
                    ? `${item.content.substring(0, 150)}...`
                    : item.content || 'No content available'}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {new Date(item.published_at).toLocaleDateString()}
                  </div>
                  <span>{item.source}</span>
                </div>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}