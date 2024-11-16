import Database from 'better-sqlite3';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'news.db');

let db: Database.Database | null = null;

export function getDb() {
  if (!db) {
    db = new Database(DB_PATH, { verbose: console.log });
    initDb();
  }
  return db;
}

export function initDb() {
  const db = getDb();
  
  db.exec(`
    CREATE TABLE IF NOT EXISTS news_items (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT,
      url TEXT UNIQUE,
      image_url TEXT,
      source TEXT NOT NULL,
      category TEXT,
      published_at DATETIME NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE INDEX IF NOT EXISTS idx_published_at ON news_items(published_at DESC);
    CREATE INDEX IF NOT EXISTS idx_category ON news_items(category);
    CREATE INDEX IF NOT EXISTS idx_url ON news_items(url);
  `);

  return db;
}

export function getLatestNews(limit = 10) {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM news_items 
    ORDER BY published_at DESC 
    LIMIT ?
  `).all(limit);
}

export function getFeaturedNews() {
  const db = getDb();
  return db.prepare(`
    SELECT * FROM news_items 
    WHERE category = 'Tournaments' 
    ORDER BY published_at DESC 
    LIMIT 1
  `).get();
}

export function insertNewsItem(item: {
  title: string;
  content: string;
  url: string;
  image_url?: string;
  source: string;
  category: string;
  published_at: string;
}) {
  const db = getDb();
  try {
    db.prepare(`
      INSERT INTO news_items (title, content, url, image_url, source, category, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).run(
      item.title,
      item.content,
      item.url,
      item.image_url,
      item.source,
      item.category,
      item.published_at
    );
    return true;
  } catch (error) {
    if ((error as Error).message.includes('UNIQUE constraint failed')) {
      return false;
    }
    throw error;
  }
}
