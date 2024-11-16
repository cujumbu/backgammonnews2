import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS, categorizeContent } from '@/lib/news-sources';
import { addNewsItem } from '@/lib/storage';
import { parseAndValidateDate } from '@/lib/utils';

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
      console.log(`Fetching ${feed.name} from ${feed.url}...`);
      const feedContent = await parser.parseURL(feed.url);
      let addedCount = 0;
      
      console.log(`Found ${feedContent.items?.length || 0} items in ${feed.name}`);
      
      for (const item of feedContent.items?.slice(0, 10) || []) {
        if (!item.title || !item.link) {
          console.log(`Skipping item in ${feed.name} - missing title or link`);
          continue;
        }
        
        const content = item.contentSnippet || item.content || '';
        const truncatedContent = content.length > 1000 ? 
          content.substring(0, 1000) + '...' : content;
        
        const published_at = parseAndValidateDate(item.pubDate || new Date());
        
        try {
          const success = await addNewsItem({
            title: item.title,
            content: truncatedContent,
            url: item.link,
            image_url: extractImageUrl(item.content || ''),
            source: feed.name,
            category: categorizeContent(item.title, content),
            published_at
          });

          if (success) {
            addedCount++;
            console.log(`Added item from ${feed.name}: ${item.title}`);
          } else {
            console.log(`Skipped duplicate item from ${feed.name}: ${item.title}`);
          }
        } catch (itemError) {
          console.error(`Error adding item from ${feed.name}:`, itemError);
        }
      }
      
      results.push({ source: feed.name, count: addedCount });
      console.log(`Completed ${feed.name}: ${addedCount} items added`);
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error);
      results.push({ 
        source: feed.name, 
        error: error instanceof Error ? 
          `${error.name}: ${error.message}` : 
          'Unknown error' 
      });
    }
  }
  return results;
}

function extractImageUrl(content: string): string | undefined {
  if (!content) return undefined;
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch?.[1];
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  console.log('Starting news fetch...');
  try {
    const rssResults = await fetchRSSFeeds();
    console.log('News fetch completed:', rssResults);

    return NextResponse.json({
      message: 'News fetched successfully',
      results: {
        rss: rssResults
      }
    });
  } catch (error) {
    console.error('Error in fetch-news route:', error);
    return NextResponse.json(
      { 
        error: error instanceof Error ? 
          `${error.name}: ${error.message}` : 
          'Failed to fetch news',
        details: error instanceof Error ? error.stack : undefined
      }, 
      { status: 500 }
    );
  }
}
