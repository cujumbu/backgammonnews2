import { Position, PositionAnalysis, PipCount, BlockadeAnalysis, BlotAnalysis, PositionStrength } from './types';

function analyzePipCount(position: Position): PipCount {
  let p1Pips = 0;
  let p2Pips = 0;
  
  // Count pips for points
  for (let i = 1; i <= 24; i++) {
    const checkers = position.points[i];
    if (checkers > 0) {
      p1Pips += checkers * (25 - i);
    } else if (checkers < 0) {
      p2Pips += -checkers * i;
    }
  }
  
  // Add bar checkers
  p1Pips += position.bar[0] * 25;
  p2Pips += position.bar[1] * 25;
  
  return {
    player1: p1Pips,
    player2: p2Pips,
    difference: p1Pips - p2Pips
  };
}

function analyzeBlockades(position: Position): BlockadeAnalysis {
  let p1Blocks = 0;
  let p2Blocks = 0;
  let p1MaxPrime = 0;
  let p2MaxPrime = 0;
  let currentP1Prime = 0;
  let currentP2Prime = 0;
  let p1Anchors = 0;
  let p2Anchors = 0;

  // Analyze consecutive points (primes)
  for (let i = 1; i <= 24; i++) {
    const checkers = position.points[i];
    if (checkers >= 2) {
      p1Blocks++;
      currentP1Prime++;
      if (i >= 19) p1Anchors++; // Back anchors for P1
    } else {
      p1MaxPrime = Math.max(p1MaxPrime, currentP1Prime);
      currentP1Prime = 0;
    }
    
    if (checkers <= -2) {
      p2Blocks++;
      currentP2Prime++;
      if (i <= 6) p2Anchors++; // Back anchors for P2
    } else {
      p2MaxPrime = Math.max(p2MaxPrime, currentP2Prime);
      currentP2Prime = 0;
    }
  }

  return {
    player1Blocks: p1Blocks,
    player2Blocks: p2Blocks,
    player1PrimeLength: p1MaxPrime,
    player2PrimeLength: p2MaxPrime,
    player1Anchors: p1Anchors,
    player2Anchors: p2Anchors
  };
}

function analyzeBlots(position: Position): BlotAnalysis {
  let p1Blots = 0;
  let p2Blots = 0;
  let p1DirectShots = 0;
  let p2DirectShots = 0;
  let p1IndirectShots = 0;
  let p2IndirectShots = 0;

  // Count blots and analyze their vulnerability
  for (let i = 1; i <= 24; i++) {
    const checkers = position.points[i];
    
    // Count blots
    if (checkers === 1) p1Blots++;
    if (checkers === -1) p2Blots++;
    
    // Analyze direct shots (within 6 pips)
    if (checkers === 1) {
      for (let j = 1; j <= 6; j++) {
        if (i - j >= 1 && position.points[i - j] <= -2) p1DirectShots++;
      }
    }
    if (checkers === -1) {
      for (let j = 1; j <= 6; j++) {
        if (i + j <= 24 && position.points[i + j] >= 2) p2DirectShots++;
      }
    }
    
    // Analyze indirect shots (combinations)
    if (checkers === 1) {
      for (let j = 1; j <= 5; j++) {
        for (let k = j + 1; k <= 6; k++) {
          if (i - j >= 1 && i - k >= 1 && 
              position.points[i - j] <= -1 && position.points[i - k] <= -1) {
            p1IndirectShots++;
          }
        }
      }
    }
    if (checkers === -1) {
      for (let j = 1; j <= 5; j++) {
        for (let k = j + 1; k <= 6; k++) {
          if (i + j <= 24 && i + k <= 24 && 
              position.points[i + j] >= 1 && position.points[i + k] >= 1) {
            p2IndirectShots++;
          }
        }
      }
    }
  }

  return {
    player1Blots: p1Blots,
    player2Blots: p2Blots,
    player1DirectShots: p1DirectShots,
    player2DirectShots: p2DirectShots,
    player1IndirectShots: p1IndirectShots,
    player2IndirectShots: p2IndirectShots
  };
}

function analyzeStrength(position: Position, pipCount: PipCount, blockade: BlockadeAnalysis): PositionStrength {
  const timing = calculateTiming(pipCount);
  const priming = calculatePriming(blockade);
  const blocking = calculateBlocking(position, blockade);
  const blitzAttack = calculateBlitz(position, pipCount);
  const backgame = calculateBackgame(position, blockade);

  return {
    timing,
    priming,
    blocking,
    blitzAttack,
    backgame
  };
}

function calculateTiming(pipCount: PipCount): number {
  return Math.min(1, Math.max(-1, -pipCount.difference / 30));
}

function calculatePriming(blockade: BlockadeAnalysis): number {
  return Math.max(
    blockade.player1PrimeLength / 6,
    blockade.player2PrimeLength / 6
  );
}

function calculateBlocking(position: Position, blockade: BlockadeAnalysis): number {
  const totalBlocks = blockade.player1Blocks + blockade.player2Blocks;
  return Math.min(1, totalBlocks / 12);
}

function calculateBlitz(position: Position, pipCount: PipCount): number {
  const pipAdvantage = Math.abs(pipCount.difference);
  return Math.min(1, Math.max(0, (30 - pipAdvantage) / 30));
}

function calculateBackgame(position: Position, blockade: BlockadeAnalysis): number {
  return Math.max(
    blockade.player1Anchors / 4,
    blockade.player2Anchors / 4
  );
}

function generateRecommendations(
  position: Position,
  pipCount: PipCount,
  blockade: BlockadeAnalysis,
  blots: BlotAnalysis,
  strength: PositionStrength
): string[] {
  const recommendations: string[] = [];

  // Analyze position type and suggest strategy
  if (strength.priming > 0.7) {
    recommendations.push("Strong priming game - focus on maintaining and extending your prime");
  }
  
  if (strength.backgame > 0.7) {
    recommendations.push("Strong backgame position - hold your anchors and wait for shots");
  }
  
  if (strength.blitzAttack > 0.7 && pipCount.difference < -20) {
    recommendations.push("Consider a blitz attack - hit and cover aggressively");
  }

  // Safety recommendations
  const currentPlayer = position.turn === 1 ? "player1" : "player2";
  if (blots[`${currentPlayer}Blots` as keyof BlotAnalysis] > 2) {
    recommendations.push("Multiple blots exposed - prioritize safety");
  }

  // Cube recommendations
  if (Math.abs(pipCount.difference) > 30) {
    recommendations.push("Consider doubling - significant positional advantage");
  }

  return recommendations;
}

export function analyzePosition(position: Position): PositionAnalysis {
  const pipCount = analyzePipCount(position);
  const blockade = analyzeBlockades(position);
  const blots = analyzeBlots(position);
  const strength = analyzeStrength(position, pipCount, blockade);
  
  // Calculate equity and winning chances
  const pipAdvantage = position.turn === 1 ? -pipCount.difference : pipCount.difference;
  const baseEquity = pipAdvantage / 40;
  const adjustedEquity = baseEquity * (1 + strength.timing + strength.priming);
  
  // Calculate winning probabilities
  const baseWinProb = 0.5 + (adjustedEquity / 4);
  const winProbability = Math.max(0.02, Math.min(0.98, baseWinProb));
  
  // Estimate gammon and backgammon probabilities
  const gammonProbability = Math.max(0, Math.min(winProbability * 0.2, 0.3));
  const backgammonProbability = Math.max(0, Math.min(gammonProbability * 0.1, 0.05));
  
  // Determine if it's a market position for the cube
  const marketPosition = Math.abs(adjustedEquity) >= 0.6;
  
  // Generate strategic recommendations
  const recommendations = generateRecommendations(position, pipCount, blockade, blots, strength);

  return {
    pipCount,
    blockade,
    blots,
    strength,
    equity: adjustedEquity,
    winProbability,
    gammonProbability,
    backgammonProbability,
    marketPosition,
    recommendations
  };
}
