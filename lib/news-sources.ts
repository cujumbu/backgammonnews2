export const RSS_FEEDS = [
  {
    url: 'https://usbgf.org/feed/',
    name: 'USBGF',
    category: 'Official'
  },
  {
    url: 'https://wbgf.info/news/feed/',
    name: 'WBGF',
    category: 'Official'
  }
];

export function categorizeContent(title: string, content: string): string {
  const keywords = {
    Tournaments: [
      'tournament', 'championship', 'open', 'competition', 'match', 'final',
      'semifinal', 'qualifier', 'grand prix', 'masters', 'trophy', 'winner',
      'results', 'standings', 'prizes', 'registration'
    ],
    Strategy: [
      'strategy', 'tip', 'guide', 'analysis', 'position', 'cube', 'doubling',
      'opening', 'endgame', 'bearing off', 'checker play', 'tutorial', 'lesson',
      'tactic', 'skill', 'improvement', 'study', 'pattern', 'move'
    ],
    News: [
      'announce', 'update', 'release', 'launch', 'introducing', 'new',
      'breaking', 'latest', 'feature', 'development', 'change', 'upcoming'
    ],
    Community: [
      'community', 'player', 'club', 'social', 'interview', 'profile',
      'spotlight', 'story', 'feature', 'member', 'group', 'meet', 'join'
    ],
    Software: [
      'software', 'app', 'program', 'bot', 'ai', 'computer', 'online',
      'digital', 'platform', 'version', 'update', 'download', 'mobile'
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
