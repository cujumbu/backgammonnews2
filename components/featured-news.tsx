"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { CalendarIcon } from "lucide-react";
import Image from "next/image";
import { Skeleton } from "@/components/ui/skeleton";
import { NewsItem } from "@/lib/storage";

export default function FeaturedNews() {
  const [article, setArticle] = useState<NewsItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchFeatured() {
      try {
        const response = await fetch('/api/news?type=featured');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch featured article');
        }
        
        if (data.error) {
          setError(data.error);
          return;
        }
        
        setArticle(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching featured article:', error);
        setError('Failed to load featured article');
      } finally {
        setLoading(false);
      }
    }

    fetchFeatured();
  }, []);

  if (loading) {
    return (
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Featured Story</h2>
        <Card className="overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="relative aspect-video md:aspect-auto">
              <Skeleton className="h-full w-full" />
            </div>
            <div className="p-6">
              <Skeleton className="mb-2 h-4 w-24" />
              <Skeleton className="mb-3 h-8 w-3/4" />
              <Skeleton className="mb-4 h-24 w-full" />
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            </div>
          </div>
        </Card>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="mb-12">
        <h2 className="mb-6 text-2xl font-bold">Featured Story</h2>
        <Card className="overflow-hidden p-6">
          <p className="text-muted-foreground">
            {error || 'No featured story available at the moment.'}
          </p>
        </Card>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="mb-6 text-2xl font-bold">Featured Story</h2>
      <Card className="overflow-hidden">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-video md:aspect-auto">
            {article.image_url && (
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover"
                priority
              />
            )}
          </div>
          <div className="p-6">
            <div className="mb-2 text-sm font-medium text-blue-600 dark:text-blue-400">
              {article.category}
            </div>
            <h3 className="mb-3 text-2xl font-bold">{article.title}</h3>
            <p className="mb-4 text-muted-foreground">
              {article.content && article.content.length > 200
                ? `${article.content.substring(0, 200)}...`
                : article.content || 'No content available'}
            </p>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {new Date(article.published_at).toLocaleDateString()}
              </div>
              <span>{article.source}</span>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}