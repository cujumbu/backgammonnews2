import { z } from 'zod';
import { LRUCache } from 'lru-cache';

const NewsItemSchema = z.object({
  id: z.number(),
  title: z.string().max(200),
  content: z.string().max(1000).optional(),
  url: z.string().url(),
  image_url: z.string().url().optional(),
  source: z.string().max(50),
  category: z.string().max(50),
  published_at: z.string().datetime(),
});

export type NewsItem = z.infer<typeof NewsItemSchema>;

const MAX_ITEMS = parseInt(process.env.NEXT_PUBLIC_MAX_NEWS_ITEMS || '50', 10);
const CACHE_TTL = 1000 * 60 * 60 * 24; // 24 hours

class NewsStorage {
  private static instance: NewsStorage;
  private cache: LRUCache<number, NewsItem>;
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {
    this.cache = new LRUCache<number, NewsItem>({
      max: MAX_ITEMS,
      maxSize: 1000 * 1000, // 1MB total size limit
      sizeCalculation: (value) => {
        return Buffer.byteLength(JSON.stringify(value), 'utf8');
      },
      ttl: CACHE_TTL,
      updateAgeOnGet: true,
      updateAgeOnHas: true,
      allowStale: false
    });
    this.initPromise = this.initializeWithSampleData();
  }

  public static getInstance(): NewsStorage {
    if (!NewsStorage.instance) {
      NewsStorage.instance = new NewsStorage();
    }
    return NewsStorage.instance;
  }

  private async initializeWithSampleData(): Promise<void> {
    if (this.initialized) return;

    const now = new Date().toISOString();
    const sampleData: NewsItem[] = [
      {
        id: 1,
        title: "Nordic Open 2024 Announced",
        content: "The Nordic Open 2024 has been announced for April 15-18 in Copenhagen, Denmark.",
        url: "https://example.com/nordic-open-2024",
        image_url: "https://images.unsplash.com/photo-1596451190630-186aff535bf2",
        source: "USBGF",
        category: "Tournaments",
        published_at: now
      }
    ];

    for (const item of sampleData) {
      this.cache.set(item.id, item);
    }
    this.initialized = true;
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  public async getAll(): Promise<NewsItem[]> {
    await this.ensureInitialized();
    const values = Array.from(this.cache.values());
    return values.filter((item): item is NewsItem => item !== undefined);
  }

  public async getLatest(limit = 10): Promise<NewsItem[]> {
    await this.ensureInitialized();
    const values = Array.from(this.cache.values());
    const validItems = values.filter((item): item is NewsItem => item !== undefined);
    return validItems
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, Math.min(limit, MAX_ITEMS));
  }

  public async getFeatured(): Promise<NewsItem | null> {
    await this.ensureInitialized();
    const values = Array.from(this.cache.values());
    const validItems = values.filter((item): item is NewsItem => item !== undefined);
    return validItems
      .filter(item => item.category === 'Tournaments')
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())[0] || null;
  }

  public async add(item: Omit<NewsItem, 'id'>): Promise<boolean> {
    await this.ensureInitialized();
    
    const newItem = {
      ...item,
      id: Date.now(),
      content: item.content ? item.content.substring(0, 1000) : '',
      title: item.title.substring(0, 200)
    };

    const validated = NewsItemSchema.safeParse(newItem);
    if (!validated.success) {
      console.error('Invalid news item:', validated.error);
      return false;
    }

    // Check if URL already exists
    const values = Array.from(this.cache.values());
    const validItems = values.filter((item): item is NewsItem => item !== undefined);
    const exists = validItems.some(existing => existing.url === item.url);
    
    if (!exists) {
      this.cache.set(newItem.id, validated.data);
      return true;
    }
    return false;
  }

  public async clear(): Promise<void> {
    this.cache.clear();
    this.initialized = false;
    await this.initializeWithSampleData();
  }
}

export const newsStorage = NewsStorage.getInstance();

export async function getLatestNews(limit = 10): Promise<NewsItem[]> {
  return newsStorage.getLatest(Math.min(limit, MAX_ITEMS));
}

export async function getFeaturedNews(): Promise<NewsItem | null> {
  return newsStorage.getFeatured();
}

export async function addNewsItem(item: Omit<NewsItem, 'id'>): Promise<boolean> {
  return newsStorage.add(item);
}

export async function clearStorage(): Promise<void> {
  return newsStorage.clear();
}
