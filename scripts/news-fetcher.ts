import cron from 'node-cron';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { RSS_FEEDS, REDDIT_SOURCES, categorizeContent } from '../lib/news-sources';
import { addNewsItem } from '../lib/storage';

const parser = new Parser();

async function fetchRSSFeeds() {
  for (const feed of RSS_FEEDS) {
    try {
      const feedContent = await parser.parseURL(feed.url);
      
      for (const item of feedContent.items) {
        const category = categorizeContent(item.title || '', item.content || '');
        
        await addNewsItem({
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

async function fetchRedditPosts() {
  for (const source of REDDIT_SOURCES) {
    try {
      const response = await fetch(
        `https://www.reddit.com/r/${source.subreddit}/new.json?limit=25`
      );
      const data = await response.json();
      
      for (const post of data.data.children) {
        const { title, selftext, url, created_utc } = post.data;
        if (!title || url.includes('/r/')) continue;
        
        const category = categorizeContent(title, selftext);
        
        await addNewsItem({
          title,
          content: selftext,
          url,
          source: `Reddit - r/${source.subreddit}`,
          category,
          published_at: new Date(created_utc * 1000).toISOString()
        });
      }
      
      console.log(`Processed Reddit posts from r/${source.subreddit}`);
    } catch (error) {
      console.error(`Error fetching Reddit posts from r/${source.subreddit}:`, error);
    }
  }
}

function extractImageUrl(content: string): string | undefined {
  if (!content) return undefined;
  
  // Try to extract from HTML content
  const $ = cheerio.load(content);
  const img = $('img').first();
  if (img.length) return img.attr('src');
  
  // Try to extract from markdown
  const mdImageMatch = content.match(/!\[.*?\]\((.*?)\)/);
  if (mdImageMatch) return mdImageMatch[1];
  
  return undefined;
}

async function runNewsFetcher() {
  console.log('Starting news fetch:', new Date().toISOString());
  
  try {
    await Promise.all([
      fetchRSSFeeds(),
      fetchRedditPosts()
    ]);
    
    console.log('News fetch completed:', new Date().toISOString());
  } catch (error) {
    console.error('Error in news fetcher:', error);
  }
}

// Run every 6 hours
cron.schedule('0 */6 * * *', runNewsFetcher);

// Run immediately on start
runNewsFetcher();