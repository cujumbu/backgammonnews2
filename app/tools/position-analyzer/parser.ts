import { Position } from './types';

export function parsePosition(input: string): Position {
  try {
    const [p1Points, p2Points, bar, off, turn] = input.split('/');
    
    const points = Array(25).fill(0);
    
    // Parse player 1's points
    p1Points.split(',').forEach(point => {
      const [pos, count] = point.split(':').map(Number);
      if (isNaN(pos) || isNaN(count) || pos < 1 || pos > 24 || count < 0) {
        throw new Error('Invalid point specification');
      }
      points[pos] = count;
    });
    
    // Parse player 2's points
    p2Points.split(',').forEach(point => {
      const [pos, count] = point.split(':').map(Number);
      if (isNaN(pos) || isNaN(count) || pos < 1 || pos > 24 || count < 0) {
        throw new Error('Invalid point specification');
      }
      points[pos] = -count; // Negative for player 2
    });
    
    // Validate total checkers
    const totalCheckers = points.reduce((sum, count) => sum + Math.abs(count), 0);
    if (totalCheckers > 30) {
      throw new Error('Too many checkers on the board');
    }
    
    // Parse bar
    const [bar1, bar2] = bar.split(',').map(Number);
    if (isNaN(bar1) || isNaN(bar2) || bar1 < 0 || bar2 < 0) {
      throw new Error('Invalid bar counts');
    }
    
    // Parse off
    const [off1, off2] = off.split(',').map(Number);
    if (isNaN(off1) || isNaN(off2) || off1 < 0 || off2 < 0) {
      throw new Error('Invalid off counts');
    }
    
    // Validate total checkers including bar and off
    const totalWithBarAndOff = totalCheckers + bar1 + bar2 + off1 + off2;
    if (totalWithBarAndOff !== 30) {
      throw new Error(`Invalid total checkers: ${totalWithBarAndOff}`);
    }
    
    // Parse turn
    const turnNum = parseInt(turn);
    if (turnNum !== 1 && turnNum !== 2) {
      throw new Error('Turn must be 1 or 2');
    }
    
    return {
      points,
      bar: [bar1, bar2],
      off: [off1, off2],
      turn: turnNum
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Invalid position format: ${error.message}`);
    }
    throw new Error('Invalid position format');
  }
}
