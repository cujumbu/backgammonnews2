import { Position } from '../../tools/position-analyzer/lib/types';
import { Engine } from 'xgammon';

export interface Move {
  from: number;
  to: number;
  isHit?: boolean;
}

export class Game {
  private engine: any; // XGammon engine instance
  private position: Position;
  private remainingDice: number[];

  constructor() {
    this.engine = new Engine();
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
    return this.engine.getLegalMoves(this.position, dice);
  }

  public makeMove(move: Move): Position {
    const newPosition = this.engine.makeMove(this.position, move);
    this.position = newPosition;
    
    // Remove used die
    const usedValue = Math.abs(move.to - move.from);
    const dieIndex = this.remainingDice.indexOf(usedValue);
    if (dieIndex !== -1) {
      this.remainingDice.splice(dieIndex, 1);
    }
    
    return newPosition;
  }

  public getComputerMove(): Move | null {
    return this.engine.getBestMove(this.position, this.remainingDice);
  }

  public getCurrentPosition(): Position {
    return this.position;
  }

  public isGameOver(): boolean {
    return this.engine.isGameOver(this.position);
  }

  public getWinner(): number | null {
    if (!this.isGameOver()) return null;
    return this.engine.getWinner(this.position);
  }
}
