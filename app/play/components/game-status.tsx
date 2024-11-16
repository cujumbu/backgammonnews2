interface GameStatusProps {
  message: string;
  dice: number[];
  gameState: 'rolling' | 'moving' | 'computerTurn';
}

export function GameStatus({ message, gameState }: GameStatusProps) {
  return (
    <div className="text-center">
      <div className="text-lg font-medium mb-2">
        {message}
      </div>
      <div className="text-sm text-gray-600">
        {gameState === 'rolling' && "Your turn to roll"}
        {gameState === 'moving' && "Your turn to move"}
        {gameState === 'computerTurn' && "Computer is thinking..."}
      </div>
    </div>
  );
}
