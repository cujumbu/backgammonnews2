export const RSS_FEEDS = [
  {
    url: 'https://usbgf.org/feed/',
    name: 'USBGF',
    category: 'Official'
  }
];

export const REDDIT_SOURCES = [
  {
    subreddit: 'backgammon',
    category: 'Community'
  }
];

// Removed unreliable feeds (Chicago Point, BKGM)

export function categorizeContent(title: string, content: string): string {
  const keywords = {
    Tournaments: [
      'tournament', 'championship', 'open', 'competition', 'match', 'final',
      'semifinal', 'qualifier', 'grand prix', 'masters'
    ],
    Strategy: [
      'strategy', 'tip', 'guide', 'analysis', 'position', 'cube', 'doubling',
      'opening', 'endgame', 'bearing off', 'checker play'
    ],
    News: [
      'announce', 'update', 'release', 'launch', 'introducing', 'new',
      'breaking', 'latest'
    ],
    Community: [
      'community', 'player', 'club', 'social', 'interview', 'profile',
      'spotlight', 'story', 'feature'
    ]
  };

  const text = `${title} ${content}`.toLowerCase();
  
  for (const [category, words] of Object.entries(keywords)) {
    if (words.some(word => text.includes(word))) {
      return category;
    }
  }

  return 'Other';
}
