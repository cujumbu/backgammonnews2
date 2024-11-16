export interface AnalysisCardProps {
  title: string;
  children: React.ReactNode;
}

export function AnalysisCard({ title, children }: AnalysisCardProps) {
  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-lg font-medium mb-3">{title}</h3>
      {children}
    </div>
  );
}
