/// <reference types="node-cron" />

import cron from 'node-cron';
import Parser from 'rss-parser';
import * as cheerio from 'cheerio';
import { RSS_FEEDS, categorizeContent } from '../lib/news-sources';
import { addNewsItem } from '../lib/storage';
import { parseAndValidateDate } from '../lib/utils';

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
        
        const published_at = parseAndValidateDate(item.pubDate || new Date());
        
        const success = await addNewsItem({
          title: item.title,
          content: truncatedContent,
          url: item.link,
          image_url: extractImageUrl(item.content || ''),
          source: feed.name,
          category: categorizeContent(item.title, content),
          published_at
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

function extractImageUrl(content: string): string | undefined {
  if (!content) return undefined;
  const $ = cheerio.load(content);
  const img = $('img').first();
  return img.length ? img.attr('src') : undefined;
}

async function runNewsFetcher() {
  if (isRunning) {
    console.log('News fetcher already running, skipping...');
    return;
  }

  isRunning = true;
  console.log('Starting news fetch:', new Date().toISOString());
  
  try {
    const rssResults = await fetchRSSFeeds();
    
    console.log('News fetch completed:', {
      rss: rssResults
    });

    return {
      rss: rssResults
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
