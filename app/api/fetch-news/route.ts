import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS, categorizeContent } from '@/lib/news-sources';
import { addNewsItem } from '@/lib/storage';
import { parseAndValidateDate } from '@/lib/utils';

const parser = new Parser({
  timeout: 10000, // Increased timeout to 10 seconds
  maxRedirects: 5,
  headers: {
    'User-Agent': 'BackgammonNews/1.0 (https://backgammon-news.com)',
    'Accept': 'application/rss+xml, application/xml, text/xml, */*'
  },
  customFields: {
    item: [
      ['media:content', 'media'],
      ['media:thumbnail', 'thumbnail'],
      ['enclosure', 'enclosure']
    ]
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
          const imageUrl = extractImageUrl(item) || undefined;
          
          const success = await addNewsItem({
            title: item.title,
            content: truncatedContent,
            url: item.link,
            image_url: imageUrl,
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

function extractImageUrl(item: any): string | undefined {
  // Try different possible image sources in order of preference
  if (item.media?.$.url) {
    return item.media.$.url;
  }
  
  if (item.thumbnail?.$.url) {
    return item.thumbnail.$.url;
  }
  
  if (item.enclosure?.url && item.enclosure.type?.startsWith('image/')) {
    return item.enclosure.url;
  }
  
  if (item.content) {
    const imgMatch = item.content.match(/<img[^>]+src="([^">]+)"/);
    if (imgMatch) {
      return imgMatch[1];
    }
  }
  
  return undefined;
}

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  console.log('Starting news fetch...');
  try {
    const rssResults = await fetchRSSFeeds();
    
    // Check if we got any successful results
    const successfulFeeds = rssResults.filter(result => !result.error);
    if (successfulFeeds.length === 0) {
      throw new Error('Failed to fetch news from any sources');
    }
    
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
