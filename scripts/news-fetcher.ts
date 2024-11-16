import cron from 'node-cron';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import fetch from 'node-fetch';
import { 
  RSS_FEEDS, 
  REDDIT_SOURCES, 
  YOUTUBE_CHANNELS,
  categorizeContent 
} from '../lib/news-sources';
import { addNewsItem } from '../lib/storage';

const parser = new Parser();

// YouTube API key would be needed here
const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

async function fetchRSSFeeds() {
  for (const feed of RSS_FEEDS) {
    try {
      console.log(`Fetching from ${feed.name}...`);
      const feedContent = await parser.parseURL(feed.url);
      
      for (const item of feedContent.items) {
        const category = categorizeContent(item.title || '', item.content || '');
        
        await addNewsItem({
          title: item.title || '',
          content: item.contentSnippet || item.content || '',
          url: item.link || '',
          image_url: extractImageUrl(item.content || ''),
          source: feed.name,
          category,
          published_at: item.pubDate || new Date().toISOString()
        });
      }
      
      console.log(`✓ Processed ${feedContent.items.length} items from ${feed.name}`);
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
        const { title, selftext, url, created_utc, permalink } = post.data;
        
        // Skip posts that are just links to other subreddits
        if (!title || url.includes('/r/')) continue;
        
        const category = categorizeContent(title, selftext);
        const fullRedditUrl = `https://reddit.com${permalink}`;
        
        await addNewsItem({
          title,
          content: selftext,
          url: fullRedditUrl,
          image_url: extractImageFromRedditPost(post.data),
          source: `Reddit - r/${source.subreddit}`,
          category,
          published_at: new Date(created_utc * 1000).toISOString()
        });
      }
      
      console.log(`✓ Processed Reddit posts from r/${source.subreddit}`);
    } catch (error) {
      console.error(`Error fetching Reddit posts from r/${source.subreddit}:`, error);
    }
  }
}

async function fetchYouTubeVideos() {
  if (!YOUTUBE_API_KEY) {
    console.log('Skipping YouTube fetch - no API key provided');
    return;
  }

  for (const channel of YOUTUBE_CHANNELS) {
    try {
      console.log(`Fetching videos from ${channel.name}...`);
      const response = await fetch(
        `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${channel.id}&part=snippet,id&order=date&maxResults=10`
      );
      
      if (!response.ok) {
        throw new Error(`YouTube API returned ${response.status}`);
      }
      
      const data = await response.json();
      
      for (const item of data.items) {
        if (item.id.kind !== 'youtube#video') continue;
        
        const videoUrl = `https://www.youtube.com/watch?v=${item.id.videoId}`;
        const thumbnailUrl = item.snippet.thumbnails.high?.url;
        
        await addNewsItem({
          title: item.snippet.title,
          content: item.snippet.description,
          url: videoUrl,
          image_url: thumbnailUrl,
          source: channel.name,
          category: channel.category,
          published_at: item.snippet.publishedAt
        });
      }
      
      console.log(`✓ Processed videos from ${channel.name}`);
    } catch (error) {
      console.error(`Error fetching YouTube videos from ${channel.name}:`, error);
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

function extractImageFromRedditPost(post: any): string | undefined {
  if (post.preview?.images?.[0]?.source?.url) {
    return post.preview.images[0].source.url;
  }
  
  if (post.thumbnail && post.thumbnail !== 'self' && post.thumbnail !== 'default') {
    return post.thumbnail;
  }
  
  return undefined;
}

async function runNewsFetcher() {
  console.log('Starting news fetch:', new Date().toISOString());
  
  try {
    await Promise.all([
      fetchRSSFeeds(),
      fetchRedditPosts(),
      fetchYouTubeVideos()
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
