import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { join } from 'path';

const DB_PATH = join(process.cwd(), 'data', 'news.db');

// Initialize database connection
export async function getDb() {
  return open({
    filename: DB_PATH,
    driver: sqlite3.Database
  });
}

// Initialize database schema
export async function initDb() {
  const db = await getDb();
  
  await db.exec(`
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

// Get latest news items
export async function getLatestNews(limit = 10) {
  const db = await getDb();
  return db.all(`
    SELECT * FROM news_items 
    ORDER BY published_at DESC 
    LIMIT ?
  `, limit);
}

// Get featured news item
export async function getFeaturedNews() {
  const db = await getDb();
  return db.get(`
    SELECT * FROM news_items 
    WHERE category = 'Tournaments' 
    ORDER BY published_at DESC 
    LIMIT 1
  `);
}

// Insert new news item
export async function insertNewsItem(item: {
  title: string;
  content: string;
  url: string;
  image_url?: string;
  source: string;
  category: string;
  published_at: string;
}) {
  const db = await getDb();
  try {
    await db.run(`
      INSERT INTO news_items (title, content, url, image_url, source, category, published_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      item.title,
      item.content,
      item.url,
      item.image_url,
      item.source,
      item.category,
      item.published_at
    ]);
    return true;
  } catch (error) {
    if ((error as Error).message.includes('UNIQUE constraint failed')) {
      return false;
    }
    throw error;
  }
}
