export const RSS_FEEDS = [
  {
    url: 'https://usbgf.org/feed/',
    name: 'USBGF',
    category: 'Official'
  },
  {
    url: 'https://www.gammon.com/feed',
    name: 'Gammon.com',
    category: 'Community'
  }
];

export const REDDIT_SOURCES = [
  {
    subreddit: 'backgammon',
    category: 'Community'
  }
];

export const TWITTER_SOURCES = [
  {
    hashtags: ['backgammon', 'bgmon'],
    category: 'Social'
  }
];

export function categorizeContent(title: string, content: string): string {
  const keywords = {
    Tournaments: ['tournament', 'championship', 'open', 'competition'],
    Strategy: ['strategy', 'tip', 'guide', 'analysis', 'position'],
    News: ['announce', 'update', 'release', 'launch'],
    Community: ['community', 'player', 'club', 'social']
  };

  const text = `${title} ${content}`.toLowerCase();
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => text.includes(word))) {
      return category;
    }
  }

  return 'Other';
}