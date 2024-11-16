'use client';

import { useState } from 'react';
import { AnalysisCard } from './components/analysis-card';
import { PositionInput } from './components/position-input';
import { Position, PositionAnalysis, parsePosition, analyzePosition } from './lib';

export default function PositionAnalyzerPage() {
  const [position, setPosition] = useState('');
  const [analysis, setAnalysis] = useState<PositionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    try {
      setError(null);
      const parsedPosition = parsePosition(position);
      const result = analyzePosition(parsedPosition);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to analyze position');
      setAnalysis(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Backgammon Position Analyzer</h1>
      
      <PositionInput
        value={position}
        onChange={setPosition}
        onAnalyze={handleAnalyze}
        error={error}
      />

      {analysis && (
        <div className="grid gap-6 md:grid-cols-2">
          <AnalysisCard title="Pip Count">
            <div className="space-y-2">
              <p>Player 1: {analysis.pipCount.player1}</p>
              <p>Player 2: {analysis.pipCount.player2}</p>
              <p>Difference: {analysis.pipCount.difference}</p>
            </div>
          </AnalysisCard>

          <AnalysisCard title="Position Strength">
            <div className="space-y-2">
              <p>Timing: {(analysis.strength.timing * 100).toFixed(1)}%</p>
              <p>Priming: {(analysis.strength.priming * 100).toFixed(1)}%</p>
              <p>Blocking: {(analysis.strength.blocking * 100).toFixed(1)}%</p>
              <p>Blitz: {(analysis.strength.blitzAttack * 100).toFixed(1)}%</p>
              <p>Backgame: {(analysis.strength.backgame * 100).toFixed(1)}%</p>
            </div>
          </AnalysisCard>

          <AnalysisCard title="Winning Chances">
            <div className="space-y-2">
              <p>Win: {(analysis.winProbability * 100).toFixed(1)}%</p>
              <p>Gammon: {(analysis.gammonProbability * 100).toFixed(1)}%</p>
              <p>Backgammon: {(analysis.backgammonProbability * 100).toFixed(1)}%</p>
              <p>Equity: {analysis.equity.toFixed(3)}</p>
            </div>
          </AnalysisCard>

          <AnalysisCard title="Recommendations">
            <ul className="list-disc list-inside space-y-2">
              {analysis.recommendations.map((rec, i) => (
                <li key={i} className="text-sm">{rec}</li>
              ))}
            </ul>
          </AnalysisCard>
        </div>
      )}
    </div>
  );
}
