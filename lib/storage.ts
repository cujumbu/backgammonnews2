import { z } from 'zod';

const NewsItemSchema = z.object({
  id: z.number(),
  title: z.string(),
  content: z.string().optional(),
  url: z.string().url(),
  image_url: z.string().url().optional(),
  source: z.string(),
  category: z.string(),
  published_at: z.string().datetime(),
});

export type NewsItem = z.infer<typeof NewsItemSchema>;

const MAX_ITEMS = 100;

class NewsStorage {
  private static instance: NewsStorage;
  private cache: NewsItem[] = [];
  private initialized = false;
  private initPromise: Promise<void> | null = null;

  private constructor() {
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

    const now = new Date();
    this.cache = [
      {
        id: 1,
        title: "Nordic Open 2024 Announced",
        content: "The Nordic Open 2024 has been announced for April 15-18 in Copenhagen, Denmark. This prestigious tournament attracts players from around the world.",
        url: "https://example.com/nordic-open-2024",
        image_url: "https://images.unsplash.com/photo-1596451190630-186aff535bf2",
        source: "USBGF",
        category: "Tournaments",
        published_at: now.toISOString()
      },
      {
        id: 2,
        title: "Advanced Opening Strategies",
        content: "Learn about the most effective opening moves in backgammon and how to use them to gain an early advantage.",
        url: "https://example.com/opening-strategies",
        image_url: "https://images.unsplash.com/photo-1611159063981-b8c8c4301869",
        source: "Backgammon Experts",
        category: "Strategy",
        published_at: new Date(now.getTime() - 86400000).toISOString()
      }
    ];
    this.initialized = true;
  }

  private async ensureInitialized(): Promise<void> {
    if (this.initPromise) {
      await this.initPromise;
    }
  }

  public async getAll(): Promise<NewsItem[]> {
    await this.ensureInitialized();
    return [...this.cache];
  }

  public async getLatest(limit = 10): Promise<NewsItem[]> {
    await this.ensureInitialized();
    return this.cache
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, limit);
  }

  public async getFeatured(): Promise<NewsItem | null> {
    await this.ensureInitialized();
    return this.cache
      .filter(item => item.category === 'Tournaments')
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())[0] || null;
  }

  public async add(item: Omit<NewsItem, 'id'>): Promise<boolean> {
    await this.ensureInitialized();
    
    const newItem = {
      ...item,
      id: Date.now(),
      content: item.content || '',
    };

    const validated = NewsItemSchema.safeParse(newItem);
    if (!validated.success) {
      console.error('Invalid news item:', validated.error);
      return false;
    }

    if (!this.cache.some(existing => existing.url === item.url)) {
      this.cache.push(validated.data);
      await this.pruneOldItems();
      return true;
    }
    return false;
  }

  private async pruneOldItems(): Promise<void> {
    this.cache = this.cache
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime())
      .slice(0, MAX_ITEMS);
  }
}

export const newsStorage = NewsStorage.getInstance();

export async function getLatestNews(limit = 10): Promise<NewsItem[]> {
  return newsStorage.getLatest(limit);
}

export async function getFeaturedNews(): Promise<NewsItem | null> {
  return newsStorage.getFeatured();
}

export async function addNewsItem(item: Omit<NewsItem, 'id'>): Promise<boolean> {
  return newsStorage.add(item);
}

export async function initializeStorage(): Promise<void> {
  await newsStorage.getAll();
}