import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS, REDDIT_SOURCES, categorizeContent } from '@/lib/news-sources';
import { addNewsItem } from '@/lib/storage';

const parser = new Parser({
  timeout: 5000,
  maxRedirects: 3,
  headers: {
    'User-Agent': 'BackgammonNews/1.0',
    'Accept': 'application/rss+xml, application/xml'
  }
});

async function fetchRSSFeeds() {
  const results = [];
  for (const feed of RSS_FEEDS) {
    try {
      const feedContent = await parser.parseURL(feed.url);
      let addedCount = 0;
      
      for (const item of feedContent.items?.slice(0, 10) || []) {
        if (!item.title || !item.link) continue;
        
        const content = item.contentSnippet || item.content || '';
        const truncatedContent = content.length > 1000 ? 
          content.substring(0, 1000) + '...' : content;
        
        await addNewsItem({
          title: item.title,
          content: truncatedContent,
          url: item.link,
          image_url: extractImageUrl(item.content || ''),
          source: feed.name,
          category: categorizeContent(item.title, content),
          published_at: item.pubDate || new Date().toISOString()
        });
        addedCount++;
      }
      
      results.push({ source: feed.name, count: addedCount });
    } catch (err) {
      const error = err as Error;
      results.push({ source: feed.name, error: error.message });
    }
  }
  return results;
}

// Rest of the file remains unchanged as it's working correctly
