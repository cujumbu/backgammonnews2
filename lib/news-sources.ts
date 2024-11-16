export const RSS_FEEDS = [
  {
    url: 'https://usbgf.org/feed/',
    name: 'USBGF',
    category: 'Official'
  },
  {
    url: 'https://backgammongalaxy.com/feed',
    name: 'Backgammon Galaxy',
    category: 'Community'
  },
  {
    url: 'https://www.worldbackgammonfederation.org/feed',
    name: 'World Backgammon Federation',
    category: 'Official'
  }
];

export const REDDIT_SOURCES = [
  {
    subreddit: 'backgammon',
    category: 'Community'
  }
];

export const YOUTUBE_CHANNELS = [
  {
    id: 'UCxyCJt3NLP6dprDL_YFu_0g', // Mochy's channel
    name: 'Mochy\'s Backgammon',
    category: 'Strategy'
  },
  {
    id: 'UC7lDtk4rQrXwBtfRYvCL7jw', // XG Backgammon
    name: 'XG Backgammon',
    category: 'Strategy'
  }
];

export const TWITTER_ACCOUNTS = [
  {
    username: 'USBGF',
    category: 'Official'
  },
  {
    username: 'BackgammonGalaxy',
    category: 'Community'
  }
];

export function categorizeContent(title: string, content: string): string {
  const keywords = {
    Tournaments: [
      'tournament', 'championship', 'open', 'competition', 'match', 'final',
      'semifinal', 'qualifier', 'grand prix', 'masters'
    ],
    Strategy: [
      'strategy', 'tip', 'guide', 'analysis', 'position', 'cube', 'doubling',
      'opening', 'endgame', 'bearing off', 'checker play', 'probability'
    ],
    News: [
      'announce', 'update', 'release', 'launch', 'introducing', 'new',
      'breaking', 'latest'
    ],
    Community: [
      'community', 'player', 'club', 'social', 'interview', 'profile',
      'spotlight', 'story', 'feature'
    ],
    Results: [
      'winner', 'won', 'champion', 'victory', 'defeated', 'score',
      'result', 'standings', 'leaderboard'
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
