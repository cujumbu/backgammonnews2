import { NextResponse } from 'next/server';
import Parser from 'rss-parser';
import { RSS_FEEDS, REDDIT_SOURCES, categorizeContent } from '@/lib/news-sources';
import { addNewsItem } from '@/lib/storage';
import fetch from 'node-fetch';

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

async function fetchRedditPosts() {
  const results = [];
  for (const source of REDDIT_SOURCES) {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${source.subreddit}/hot.json?limit=10`,
        {
          headers: {
            'User-Agent': 'BackgammonNews/1.0',
            'Accept': 'application/json'
          }
        }
      );
      
      if (!response.ok) {
        throw new Error(`Reddit returned ${response.status}`);
      }
      
      const data = await response.json();
      let addedCount = 0;
      
      for (const post of data.data?.children?.slice(0, 5) || []) {
        const { title, selftext, permalink, created_utc } = post.data;
        if (!title) continue;
        
        const truncatedContent = selftext.length > 1000 ? 
          selftext.substring(0, 1000) + '...' : selftext;
        
        await addNewsItem({
          title,
          content: truncatedContent,
          url: `https://reddit.com${permalink}`,
          image_url: extractImageFromRedditPost(post.data),
          source: `Reddit - r/${source.subreddit}`,
          category: categorizeContent(title, selftext),
          published_at: new Date(created_utc * 1000).toISOString()
        });
        addedCount++;
      }
      
      results.push({ source: `Reddit - r/${source.subreddit}`, count: addedCount });
    } catch (error) {
      results.push({ 
        source: `Reddit - r/${source.subreddit}`, 
        error: error instanceof Error ? error.message : 'Failed to fetch Reddit posts' 
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

function extractImageFromRedditPost(post: any): string | undefined {
  if (post.preview?.images?.[0]?.source?.url) {
    return post.preview.images[0].source.url.replace(/&amp;/g, '&');
  }
  return post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' ?
    post.thumbnail : undefined;
}

export async function GET() {
  try {
    const [rssResults, redditResults] = await Promise.all([
      fetchRSSFeeds(),
      fetchRedditPosts()
    ]);

    return NextResponse.json({
      message: 'News fetched successfully',
      results: {
        rss: rssResults,
        reddit: redditResults
      }
    });
  } catch (error) {
    return NextResponse.json(
      { 
        error: error instanceof Error ? error.message : 'Failed to fetch news' 
      }, 
      { status: 500 }
    );
  }
}
