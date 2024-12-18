"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
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
        <h2 className="text-2xl font-bold mb-6">Featured Story</h2>
        <div className="animate-pulse glass-panel rounded-xl overflow-hidden">
          <div className="grid md:grid-cols-2">
            <div className="aspect-video bg-gray-200" />
            <div className="p-6">
              <div className="mb-2 h-4 w-24 bg-gray-200 rounded" />
              <div className="mb-3 h-8 w-3/4 bg-gray-200 rounded" />
              <div className="mb-4 h-24 w-full bg-gray-200 rounded" />
              <div className="flex items-center justify-between">
                <div className="h-4 w-32 bg-gray-200 rounded" />
                <div className="h-4 w-24 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error || !article) {
    return (
      <section className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Featured Story</h2>
        <div className="glass-panel rounded-xl p-6">
          <p className="text-gray-600">
            {error || 'No featured story available at the moment.'}
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="mb-12">
      <h2 className="text-2xl font-bold mb-6">Featured Story</h2>
      <div className="glass-panel rounded-xl overflow-hidden group">
        <div className="grid md:grid-cols-2">
          <div className="relative aspect-video">
            {article.image_url ? (
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                priority
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500 to-indigo-500" />
            )}
          </div>
          <div className="p-6">
            <div className="mb-2 text-sm font-medium text-blue-600">
              {article.category}
            </div>
            <h3 className="mb-3 text-2xl font-bold group-hover:text-blue-600 transition-colors duration-200">
              {article.title}
            </h3>
            <p className="mb-4 text-gray-600 line-clamp-3">
              {article.content || 'No content available'}
            </p>
            <div className="flex items-center justify-between text-sm text-gray-500">
              <div className="flex items-center">
                <span className="mr-2">📅</span>
                {new Date(article.published_at).toLocaleDateString()}
              </div>
              <span>{article.source}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
