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
            w-12 h-12 glass-panel rounded-xl
            flex items-center justify-center
            text-2xl font-bold
            bg-gradient-to-br from-blue-500 to-indigo-500
            text-white
            animate-scale-in
            dice-roll
          "
          style={{
            animationDelay: `${index * 0.1}s`
          }}
        >
          {value}
        </div>
      ))}
    </div>
  );
}
