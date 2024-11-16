import { Position } from '../../tools/position-analyzer/lib/types';

export interface Move {
  from: number;
  to: number;
  isHit?: boolean;
}

export class Game {
  private position: Position;
  private remainingDice: number[];

  constructor() {
    this.position = this.getInitialPosition();
    this.remainingDice = [];
  }

  private getInitialPosition(): Position {
    return {
      points: [
        0, // 0 is unused
        2, 0, 0, 0, 0, -5, // 1-6
        0, -3, 0, 0, 0, 5, // 7-12
        -5, 0, 0, 0, 3, 0, // 13-18
        5, 0, 0, 0, 0, -2, // 19-24
      ],
      bar: [0, 0],
      off: [0, 0],
      turn: 1
    };
  }

  public getAvailableMoves(dice: number[]): Move[] {
    this.remainingDice = [...dice];
    const moves: Move[] = [];
    const player = this.position.turn;
    const direction = player === 1 ? 1 : -1;

    // If there are checkers on the bar, they must be moved first
    if (this.position.bar[player - 1] > 0) {
      for (const die of dice) {
        const to = player === 1 ? die : 25 - die;
        if (this.canMoveTo(to)) {
          moves.push({ from: 0, to });
        }
      }
      return moves;
    }

    // Check all possible moves from each point
    for (let from = 1; from <= 24; from++) {
      const checkers = this.position.points[from];
      if ((player === 1 && checkers > 0) || (player === 2 && checkers < 0)) {
        for (const die of dice) {
          const to = from + (die * direction);
          if (to >= 1 && to <= 24 && this.canMoveTo(to)) {
            moves.push({ from, to });
          }
        }
      }
    }

    return moves;
  }

  private canMoveTo(point: number): boolean {
    const player = this.position.turn;
    const checkers = this.position.points[point];
    
    // Can always move to empty point or point with own checkers
    if (checkers === 0 || (player === 1 && checkers > 0) || (player === 2 && checkers < 0)) {
      return true;
    }
    
    // Can hit single opponent checker
    if ((player === 1 && checkers === -1) || (player === 2 && checkers === 1)) {
      return true;
    }
    
    return false;
  }

  public makeMove(move: Move): Position {
    const newPosition = JSON.parse(JSON.stringify(this.position)) as Position;
    const player = this.position.turn;
    
    // Handle moving from bar
    if (move.from === 0) {
      newPosition.bar[player - 1]--;
    } else {
      newPosition.points[move.from] += player === 1 ? -1 : 1;
    }
    
    // Handle hitting opponent's checker
    const targetCheckers = newPosition.points[move.to];
    if ((player === 1 && targetCheckers === -1) || (player === 2 && targetCheckers === 1)) {
      newPosition.points[move.to] = 0;
      newPosition.bar[player === 1 ? 1 : 0]++;
    }
    
    // Add checker to destination
    newPosition.points[move.to] += player === 1 ? 1 : -1;
    
    // Remove used die
    const usedValue = Math.abs(move.to - move.from);
    const dieIndex = this.remainingDice.indexOf(usedValue);
    if (dieIndex !== -1) {
      this.remainingDice.splice(dieIndex, 1);
    }
    
    // Switch turns if no dice remaining
    if (this.remainingDice.length === 0) {
      newPosition.turn = player === 1 ? 2 : 1;
    }
    
    this.position = newPosition;
    return newPosition;
  }

  public getComputerMove(): Move | null {
    const moves = this.getAvailableMoves(this.remainingDice);
    if (moves.length === 0) return null;
    
    // Simple AI: Choose random legal move
    return moves[Math.floor(Math.random() * moves.length)];
  }

  public getCurrentPosition(): Position {
    return this.position;
  }

  public isGameOver(): boolean {
    return this.position.off[0] === 15 || this.position.off[1] === 15;
  }

  public getWinner(): number | null {
    if (!this.isGameOver()) return null;
    return this.position.off[0] === 15 ? 1 : 2;
  }
}
