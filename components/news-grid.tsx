import { useEffect, useState } from "react";
import Image from "next/image";
import { CalendarIcon } from "lucide-react";
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
            <div key={i} className="animate-pulse overflow-hidden rounded-lg border">
              <div className="grid md:grid-cols-2">
                <div className="aspect-video bg-gray-200 md:aspect-square" />
                <div className="p-6">
                  <div className="mb-2 h-4 w-24 bg-gray-200 rounded" />
                  <div className="mb-3 h-6 w-3/4 bg-gray-200 rounded" />
                  <div className="mb-4 h-20 w-full bg-gray-200 rounded" />
                  <div className="flex items-center justify-between">
                    <div className="h-4 w-32 bg-gray-200 rounded" />
                    <div className="h-4 w-24 bg-gray-200 rounded" />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error || !news.length) {
    return (
      <div>
        <h2 className="mb-6 text-2xl font-bold">Latest News</h2>
        <div className="rounded-lg border p-6">
          <p className="text-gray-600">
            {error || 'No news articles available.'}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="mb-6 text-2xl font-bold">Latest News</h2>
      <div className="grid gap-6">
        {news.map((item) => (
          <div key={item.id} className="overflow-hidden rounded-lg border">
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
                <div className="mb-2 text-sm font-medium text-blue-600">
                  {item.category}
                </div>
                <h3 className="mb-3 text-xl font-bold">{item.title}</h3>
                <p className="mb-4 text-sm text-gray-600">
                  {item.content && item.content.length > 150
                    ? `${item.content.substring(0, 150)}...`
                    : item.content || 'No content available'}
                </p>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <div className="flex items-center">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {new Date(item.published_at).toLocaleDateString()}
                  </div>
                  <span>{item.source}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
