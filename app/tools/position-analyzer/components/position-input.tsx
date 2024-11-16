interface PositionInputProps {
  value: string;
  onChange: (value: string) => void;
  onAnalyze: () => void;
  error?: string | null;
}

export function PositionInput({ value, onChange, onAnalyze, error }: PositionInputProps) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Enter Position
      </label>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full h-32 p-3 border rounded-md"
        placeholder="Example: 4:2,6:2,8:2,13:5,24:2/1:2,12:5,17:3,19:3/2,0/0,0/1"
      />
      <p className="mt-2 text-sm text-gray-500">
        Format: player1Points/player2Points/bar/off/turn
        <br />
        Points: position:count (comma-separated)
        <br />
        Bar: player1,player2
        <br />
        Off: player1,player2
        <br />
        Turn: 1 or 2
      </p>
      
      <div className="mt-4">
        <button
          onClick={onAnalyze}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Analyze Position
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}
    </div>
  );
}
