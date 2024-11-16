import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS, REDDIT_SOURCES, categorizeContent } from '@/lib/news-sources';
import { addNewsItem } from '@/lib/storage';

const parser = new Parser();

async function fetchRSSFeeds() {
  for (const feed of RSS_FEEDS) {
    try {
      console.log(`Fetching from ${feed.name}...`);
      const feedContent = await parser.parseURL(feed.url);
      
      for (const item of feedContent.items) {
        await addNewsItem({
          title: item.title || '',
          content: item.contentSnippet || item.content || '',
          url: item.link || '',
          image_url: extractImageUrl(item.content || ''),
          source: feed.name,
          category: categorizeContent(item.title || '', item.content || ''),
          published_at: item.pubDate || new Date().toISOString()
        });
      }
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error);
    }
  }
}

async function fetchRedditPosts() {
  for (const source of REDDIT_SOURCES) {
    try {
      console.log(`Fetching from Reddit r/${source.subreddit}...`);
      const response = await fetch(
        `https://www.reddit.com/r/${source.subreddit}/new.json?limit=25`,
        {
          headers: {
            'User-Agent': 'BackgammonNews/1.0'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Reddit API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      for (const post of data.data.children) {
        const { title, selftext, permalink, created_utc } = post.data;
        if (!title) continue;
        
        const fullRedditUrl = `https://reddit.com${permalink}`;
        const category = categorizeContent(title, selftext);
        
        await addNewsItem({
          title,
          content: selftext,
          url: fullRedditUrl,
          source: `Reddit - r/${source.subreddit}`,
          category,
          published_at: new Date(created_utc * 1000).toISOString()
        });
      }
    } catch (error) {
      console.error(`Error fetching Reddit posts from r/${source.subreddit}:`, error);
    }
  }
}

function extractImageUrl(content: string): string | undefined {
  if (!content) return undefined;
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch?.[1];
}

// This endpoint will be called by a CRON service
export async function GET() {
  try {
    await Promise.all([
      fetchRSSFeeds(),
      fetchRedditPosts()
    ]);
    
    return NextResponse.json({ status: 'success' });
  } catch (error) {
    console.error('Error in news fetcher:', error);
    return NextResponse.json({ status: 'error', message: error.message }, { status: 500 });
  }
}
