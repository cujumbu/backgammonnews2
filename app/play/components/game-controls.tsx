interface GameControlsProps {
  onRoll: () => void;
  onReset: () => void;
  canRoll: boolean;
}

export function GameControls({ onRoll, onReset, canRoll }: GameControlsProps) {
  return (
    <div className="flex gap-4">
      <button
        onClick={onRoll}
        disabled={!canRoll}
        className={`
          glass-button
          ${!canRoll && 'opacity-50 cursor-not-allowed hover:transform-none'}
        `}
      >
        Roll Dice
      </button>
      
      <button
        onClick={onReset}
        className="px-6 py-3 rounded-xl font-medium text-gray-700 
                 bg-gradient-to-r from-gray-100 to-gray-200
                 hover:from-gray-200 hover:to-gray-300
                 transition-all duration-300 ease-out
                 shadow-lg hover:shadow-xl
                 hover:-translate-y-0.5"
      >
        New Game
      </button>
    </div>
  );
}
