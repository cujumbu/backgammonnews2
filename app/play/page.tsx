'use client';

import { useState, useEffect } from 'react';
import { Board } from '../tools/position-analyzer/components/board';
import { Position } from '../tools/position-analyzer/lib/types';
import { Game, Move } from './lib/game';
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

export default function PlayPage() {
  const [game, setGame] = useState(() => new Game());
  const [position, setPosition] = useState<Position>(INITIAL_POSITION);
  const [dice, setDice] = useState<number[]>([]);
  const [availableMoves, setAvailableMoves] = useState<Move[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'rolling' | 'moving' | 'computerTurn'>('rolling');
  const [message, setMessage] = useState<string>('Roll the dice to start');

  useEffect(() => {
    if (gameState === 'computerTurn') {
      // Add delay to make computer's move visible
      const timeout = setTimeout(() => {
        const computerMove = game.getComputerMove();
        if (computerMove) {
          makeMove(computerMove);
          setGameState('rolling');
        }
      }, 1000);
      return () => clearTimeout(timeout);
    }
  }, [gameState]);

  const rollDice = () => {
    if (gameState !== 'rolling') return;
    
    const newDice = [
      Math.floor(Math.random() * 6) + 1,
      Math.floor(Math.random() * 6) + 1
    ];
    setDice(newDice);
    
    const moves = game.getAvailableMoves(newDice);
    setAvailableMoves(moves);
    
    if (moves.length === 0) {
      setMessage('No moves available');
      setGameState('computerTurn');
    } else {
      setMessage('Select a point to move from');
      setGameState('moving');
    }
  };

  const makeMove = (move: Move) => {
    const newPosition = game.makeMove(move);
    setPosition(newPosition);
    
    const remainingMoves = game.getAvailableMoves(dice);
    setAvailableMoves(remainingMoves);
    
    if (remainingMoves.length === 0) {
      setGameState('computerTurn');
      setMessage("Computer's turn");
    }
  };

  const handlePointClick = (pointIndex: number) => {
    if (gameState !== 'moving') return;

    if (selectedPoint === null) {
      // Selecting source point
      const validMoves = availableMoves.filter(move => move.from === pointIndex);
      if (validMoves.length > 0) {
        setSelectedPoint(pointIndex);
        setMessage('Select destination point');
      }
    } else {
      // Selecting destination point
      const move = availableMoves.find(
        move => move.from === selectedPoint && move.to === pointIndex
      );
      
      if (move) {
        makeMove(move);
        setSelectedPoint(null);
        setMessage('Select next move or wait for computer');
      }
    }
  };

  const resetGame = () => {
    setGame(new Game());
    setPosition(INITIAL_POSITION);
    setDice([]);
    setAvailableMoves([]);
    setSelectedPoint(null);
    setGameState('rolling');
    setMessage('Roll the dice to start');
  };

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
          onChange={() => {}} // Board is read-only during game
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
