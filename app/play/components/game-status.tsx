interface GameStatusProps {
  message: string;
  dice: number[];
  gameState: 'rolling' | 'moving' | 'computerTurn';
}

export function GameStatus({ message, gameState }: GameStatusProps) {
  return (
    <div className="glass-panel p-6 rounded-2xl text-center animate-fade-in">
      <div className="text-lg font-medium mb-2 bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
        {message}
      </div>
      <div className="text-sm text-gray-600">
        {gameState === 'rolling' && (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-bounce">🎲</span>
            Your turn to roll
          </span>
        )}
        {gameState === 'moving' && (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-pulse">👆</span>
            Your turn to move
          </span>
        )}
        {gameState === 'computerTurn' && (
          <span className="flex items-center justify-center gap-2">
            <span className="animate-spin">⚙️</span>
            Computer is thinking...
          </span>
        )}
      </div>
    </div>
  );
}
