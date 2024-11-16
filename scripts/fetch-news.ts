import Parser from 'rss-parser';
import { RSS_FEEDS } from '../lib/news-sources';
import { addNewsItem } from '../lib/storage';
import { categorizeContent } from '../lib/news-sources';

const parser = new Parser();

async function fetchRSSFeeds() {
  for (const feed of RSS_FEEDS) {
    try {
      const feedContent = await parser.parseURL(feed.url);
      
      for (const item of feedContent.items) {
        const category = categorizeContent(item.title || '', item.content || '');
        
        addNewsItem({
          title: item.title || '',
          content: item.content || '',
          url: item.link || '',
          image_url: extractImageUrl(item.content || ''),
          source: feed.name,
          category,
          published_at: item.pubDate || new Date().toISOString()
        });
      }
      
      console.log(`Processed ${feedContent.items.length} items from ${feed.name}`);
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error);
    }
  }
}

function extractImageUrl(content: string): string | undefined {
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch?.[1];
}

async function main() {
  try {
    await fetchRSSFeeds();
    // Add more sources here as we implement them
  } catch (error) {
    console.error('Error in news fetching:', error);
    process.exit(1);
  }
}

main();