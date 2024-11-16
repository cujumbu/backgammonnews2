import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS, REDDIT_SOURCES, categorizeContent } from '@/lib/news-sources';
import { addNewsItem } from '@/lib/storage';

const parser = new Parser();

async function fetchRSSFeeds() {
  const results = [];
  for (const feed of RSS_FEEDS) {
    try {
      console.log(`Fetching from ${feed.name}...`);
      const feedContent = await parser.parseURL(feed.url);
      let addedCount = 0;
      
      for (const item of feedContent.items) {
        if (!item.title || !item.link) continue;
        
        try {
          await addNewsItem({
            title: item.title,
            content: item.contentSnippet || item.content || '',
            url: item.link,
            image_url: extractImageUrl(item.content || ''),
            source: feed.name,
            category: categorizeContent(item.title, item.content || ''),
            published_at: item.pubDate || new Date().toISOString()
          });
          addedCount++;
        } catch (error) {
          console.error(`Error adding item from ${feed.name}:`, error);
        }
      }
      
      results.push({ source: feed.name, count: addedCount });
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error);
      results.push({ source: feed.name, error: error.message });
    }
  }
  return results;
}

async function fetchRedditPosts() {
  const results = [];
  for (const source of REDDIT_SOURCES) {
    try {
      console.log(`Fetching from Reddit r/${source.subreddit}...`);
      
      // Use .json extension to get the JSON feed without API authentication
      const response = await fetch(
        `https://www.reddit.com/r/${source.subreddit}/hot.json?limit=25`,
        {
          headers: {
            'User-Agent': 'BackgammonNews/1.0 (https://backgammon-news.com)'
          },
          next: { revalidate: 3600 } // Cache for 1 hour
        }
      );
      
      if (!response.ok) {
        throw new Error(`Reddit returned ${response.status}`);
      }
      
      const data = await response.json();
      let addedCount = 0;
      
      for (const post of data.data.children) {
        const { title, selftext, permalink, created_utc } = post.data;
        if (!title) continue;
        
        // Skip posts that are just links to other subreddits
        if (permalink.includes('/r/') && permalink !== `/r/${source.subreddit}/`) continue;
        
        const fullRedditUrl = `https://reddit.com${permalink}`;
        const category = categorizeContent(title, selftext);
        
        try {
          await addNewsItem({
            title,
            content: selftext,
            url: fullRedditUrl,
            image_url: extractImageFromRedditPost(post.data),
            source: `Reddit - r/${source.subreddit}`,
            category,
            published_at: new Date(created_utc * 1000).toISOString()
          });
          addedCount++;
        } catch (error) {
          console.error(`Error adding Reddit post:`, error);
        }
      }
      
      results.push({ source: `Reddit - r/${source.subreddit}`, count: addedCount });
    } catch (error) {
      console.error(`Error fetching Reddit posts from r/${source.subreddit}:`, error);
      results.push({ source: `Reddit - r/${source.subreddit}`, error: error.message });
    }
  }
  return results;
}

function extractImageUrl(content: string): string | undefined {
  if (!content) return undefined;
  const imgMatch = content.match(/<img[^>]+src="([^">]+)"/);
  return imgMatch?.[1];
}

function extractImageFromRedditPost(post: any): string | undefined {
  // Try to get the highest quality image from preview
  if (post.preview?.images?.[0]?.source?.url) {
    return post.preview.images[0].source.url.replace(/&amp;/g, '&');
  }
  
  // Fallback to thumbnail if available and valid
  if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') {
    return post.thumbnail;
  }
  
  return undefined;
}

export async function GET() {
  try {
    const [rssResults, redditResults] = await Promise.all([
      fetchRSSFeeds(),
      fetchRedditPosts()
    ]);
    
    return NextResponse.json({
      status: 'success',
      message: 'News fetched successfully',
      results: {
        rss: rssResults,
        reddit: redditResults
      }
    });
  } catch (error) {
    console.error('Error in news fetcher:', error);
    return NextResponse.json({ 
      status: 'error', 
      message: error.message || 'An error occurred while fetching news'
    }, { 
      status: 500 
    });
  }
}
