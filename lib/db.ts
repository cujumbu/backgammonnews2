import { createDbWorker } from 'sql.js-httpvfs';

const workerUrl = new URL(
  'sql.js-httpvfs/dist/sqlite.worker.js',
  import.meta.url
);

const wasmUrl = new URL(
  'sql.js-httpvfs/dist/sql-wasm.wasm',
  import.meta.url
);

let dbWorker: any = null;

export async function initDb() {
  if (dbWorker) return dbWorker;

  dbWorker = await createDbWorker(
    [
      {
        from: "inline",
        config: {
          serverMode: "full",
          url: "/api/db",
          requestChunkSize: 4096,
        },
      },
    ],
    workerUrl.toString(),
    wasmUrl.toString()
  );

  await dbWorker.db.exec(`
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

  return dbWorker;
}

export async function getLatestNews(limit = 10) {
  const worker = await initDb();
  const result = await worker.db.exec(`
    SELECT * FROM news_items 
    ORDER BY published_at DESC 
    LIMIT ?
  `, [limit]);
  return result[0]?.values || [];
}

export async function getFeaturedNews() {
  const worker = await initDb();
  const result = await worker.db.exec(`
    SELECT * FROM news_items 
    WHERE category = 'Tournaments' 
    ORDER BY published_at DESC 
    LIMIT 1
  `);
  return result[0]?.values?.[0] || null;
}

export async function insertNewsItem(item: {
  title: string;
  content: string;
  url: string;
  image_url?: string;
  source: string;
  category: string;
  published_at: string;
}) {
  const worker = await initDb();
  try {
    await worker.db.exec(`
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
