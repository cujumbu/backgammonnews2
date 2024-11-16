export interface Position {
  points: number[];
  bar: [number, number];
  off: [number, number];
  turn: number;
}

export interface PipCount {
  player1: number;
  player2: number;
  difference: number;
}

export interface BlockadeAnalysis {
  player1Blocks: number;
  player2Blocks: number;
  player1PrimeLength: number;
  player2PrimeLength: number;
  player1Anchors: number;
  player2Anchors: number;
}

export interface BlotAnalysis {
  player1Blots: number;
  player2Blots: number;
  player1DirectShots: number;
  player2DirectShots: number;
  player1IndirectShots: number;
  player2IndirectShots: number;
}

export interface PositionStrength {
  timing: number;
  priming: number;
  blocking: number;
  blitzAttack: number;
  backgame: number;
}

export interface PositionAnalysis {
  pipCount: PipCount;
  blockade: BlockadeAnalysis;
  blots: BlotAnalysis;
  strength: PositionStrength;
  equity: number;
  winProbability: number;
  gammonProbability: number;
  backgammonProbability: number;
  marketPosition: boolean;
  recommendations: string[];
}
