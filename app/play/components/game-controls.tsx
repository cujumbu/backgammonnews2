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
          px-6 py-3 rounded-lg font-semibold text-white
          ${canRoll 
            ? 'bg-blue-600 hover:bg-blue-700' 
            : 'bg-gray-400 cursor-not-allowed'}
        `}
      >
        Roll Dice
      </button>
      
      <button
        onClick={onReset}
        className="px-6 py-3 rounded-lg font-semibold text-gray-700 bg-gray-200 hover:bg-gray-300"
      >
        New Game
      </button>
    </div>
  );
}
