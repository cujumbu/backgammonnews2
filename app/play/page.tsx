'use client';

import { useState, useEffect } from 'react';
import { Board } from '../tools/position-analyzer/components/board';
import { Position } from '../tools/position-analyzer/lib/types';
import { DiceRoll } from './components/dice-roll';
import { GameControls } from './components/game-controls';
import { GameStatus } from './components/game-status';

const INITIAL_POSITION: Position = {
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

interface Move {
  from: number;
  to: number;
  isHit?: boolean;
}

export default function PlayPage() {
  const [position, setPosition] = useState<Position>(INITIAL_POSITION);
  const [dice, setDice] = useState<number[]>([]);
  const [gameState, setGameState] = useState<'rolling' | 'moving' | 'computerTurn'>('rolling');
  const [message, setMessage] = useState<string>('Roll the dice to start');

  const rollDice = () => {
    if (gameState !== 'rolling') return;
    
    const newDice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    setDice(newDice);
    setGameState('moving');
    setMessage('Your turn to move');
  };

  const resetGame = () => {
    setPosition(INITIAL_POSITION);
    setDice([]);
    setGameState('rolling');
    setMessage('Roll the dice to start');
  };

  useEffect(() => {
    if (gameState === 'computerTurn') {
      const timeout = setTimeout(() => {
        // Simple computer move: just reset to player's turn
        setGameState('rolling');
        setMessage('Your turn to roll');
      }, 1500);
      return () => clearTimeout(timeout);
    }
  }, [gameState]);

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Play Backgammon</h1>
      
      <div className="mb-8">
        <GameStatus 
          message={message}
          dice={dice}
          gameState={gameState}
        />
      </div>

      <div className="mb-8">
        <Board 
          position={position}
          onChange={setPosition}
        />
      </div>

      <div className="flex justify-center gap-4">
        <GameControls
          onRoll={rollDice}
          onReset={resetGame}
          canRoll={gameState === 'rolling'}
        />
      </div>

      {dice.length > 0 && (
        <div className="mt-4 flex justify-center">
          <DiceRoll dice={dice} />
        </div>
      )}
    </div>
  );
}
