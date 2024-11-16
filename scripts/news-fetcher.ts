import cron from 'node-cron';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import fetch from 'cross-fetch';
import { RSS_FEEDS, REDDIT_SOURCES, categorizeContent } from '../lib/news-sources';
import { addNewsItem } from '../lib/storage';

const parser = new Parser({
  timeout: 5000,
  maxRedirects: 3,
  headers: {
    'User-Agent': 'BackgammonNews/1.0',
    'Accept': 'application/rss+xml, application/xml'
  }
});

let isRunning = false;

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
        
        const success = await addNewsItem({
          title: item.title,
          content: truncatedContent,
          url: item.link,
          image_url: extractImageUrl(item.content || ''),
          source: feed.name,
          category: categorizeContent(item.title, content),
          published_at: new Date(item.pubDate || Date.now())
        });

        if (success) addedCount++;
      }
      
      results.push({ source: feed.name, count: addedCount });
    } catch (error) {
      console.error(`Error fetching ${feed.name}:`, error);
      results.push({ 
        source: feed.name, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
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
        
        const success = await addNewsItem({
          title,
          content: truncatedContent,
          url: `https://reddit.com${permalink}`,
          image_url: extractImageFromRedditPost(post.data),
          source: `Reddit - r/${source.subreddit}`,
          category: categorizeContent(title, selftext),
          published_at: new Date(created_utc * 1000)
        });

        if (success) addedCount++;
      }
      
      results.push({ source: `Reddit - r/${source.subreddit}`, count: addedCount });
    } catch (error) {
      console.error(`Error fetching Reddit r/${source.subreddit}:`, error);
      results.push({ 
        source: `Reddit - r/${source.subreddit}`, 
        error: error instanceof Error ? error.message : 'Unknown error' 
      });
    }
  }
  return results;
}

function extractImageUrl(content: string): string | undefined {
  if (!content) return undefined;
  const $ = cheerio.load(content);
  const img = $('img').first();
  return img.length ? img.attr('src') : undefined;
}

function extractImageFromRedditPost(post: any): string | undefined {
  if (post.preview?.images?.[0]?.source?.url) {
    return post.preview.images[0].source.url.replace(/&amp;/g, '&');
  }
  return post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default' ?
    post.thumbnail : undefined;
}

async function runNewsFetcher() {
  if (isRunning) {
    console.log('News fetcher already running, skipping...');
    return;
  }

  isRunning = true;
  console.log('Starting news fetch:', new Date().toISOString());
  
  try {
    const [rssResults, redditResults] = await Promise.all([
      fetchRSSFeeds(),
      fetchRedditPosts()
    ]);
    
    console.log('News fetch completed:', {
      rss: rssResults,
      reddit: redditResults
    });

    return {
      rss: rssResults,
      reddit: redditResults
    };
  } catch (error) {
    console.error('Error in news fetcher:', error);
    throw error;
  } finally {
    isRunning = false;
  }
}

// Run every 6 hours
cron.schedule('0 */6 * * *', runNewsFetcher);

// Initial run
runNewsFetcher();
