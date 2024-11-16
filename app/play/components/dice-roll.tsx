interface DiceRollProps {
  dice: number[];
}

export function DiceRoll({ dice }: DiceRollProps) {
  return (
    <div className="flex gap-4">
      {dice.map((value, index) => (
        <div
          key={index}
          className="
            w-12 h-12 bg-white rounded-lg shadow-lg
            flex items-center justify-center
            text-2xl font-bold
          "
        >
          {value}
        </div>
      ))}
    </div>
  );
}
