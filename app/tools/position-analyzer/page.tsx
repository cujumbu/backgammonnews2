'use client';

import { useState } from 'react';
import { AnalysisCard } from './components/analysis-card';
import { PositionInput } from './components/position-input';
import type { PositionAnalysis } from './lib/types';
import { analyzePosition } from './lib/analyzer';
import { parsePosition } from './lib/parser';

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
      <h1 className="text-3xl font-bold mb-6">Position Analyzer</h1>
      
      <PositionInput
        value={position}
        onChange={setPosition}
        onAnalyze={handleAnalyze}
        error={error}
      />

      {analysis && (
        <div className="space-y-6">
          <AnalysisCard title="Pip Count">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600">Player 1</p>
                <p className="text-xl font-semibold">{analysis.pipCount.player1}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Player 2</p>
                <p className="text-xl font-semibold">{analysis.pipCount.player2}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm text-gray-600">Difference</p>
                <p className="text-xl font-semibold">{analysis.pipCount.difference}</p>
              </div>
            </div>
          </AnalysisCard>

          <AnalysisCard title="Position Strength">
            <div className="space-y-2">
              {Object.entries(analysis.strength).map(([key, value]) => (
                <div key={key} className="flex justify-between items-center">
                  <span className="capitalize">{key}</span>
                  <div className="w-48 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${value * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </AnalysisCard>

          <AnalysisCard title="Winning Chances">
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-600">Win Probability</p>
                <p className="text-xl font-semibold">
                  {(analysis.winProbability * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Gammon Probability</p>
                <p className="text-xl font-semibold">
                  {(analysis.gammonProbability * 100).toFixed(1)}%
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Backgammon Probability</p>
                <p className="text-xl font-semibold">
                  {(analysis.backgammonProbability * 100).toFixed(1)}%
                </p>
              </div>
            </div>
          </AnalysisCard>

          <AnalysisCard title="Recommendations">
            <ul className="space-y-2">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="flex items-start">
                  <span className="text-blue-600 mr-2">•</span>
                  <span>{rec}</span>
                </li>
              ))}
            </ul>
          </AnalysisCard>

          <AnalysisCard title="Detailed Analysis">
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Blockade Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Player 1 Blocks</p>
                    <p>{analysis.blockade.player1Blocks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Player 2 Blocks</p>
                    <p>{analysis.blockade.player2Blocks}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">P1 Prime Length</p>
                    <p>{analysis.blockade.player1PrimeLength}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">P2 Prime Length</p>
                    <p>{analysis.blockade.player2PrimeLength}</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Blot Analysis</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Player 1 Blots</p>
                    <p>{analysis.blots.player1Blots}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Player 2 Blots</p>
                    <p>{analysis.blots.player2Blots}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">P1 Direct Shots</p>
                    <p>{analysis.blots.player1DirectShots}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">P2 Direct Shots</p>
                    <p>{analysis.blots.player2DirectShots}</p>
                  </div>
                </div>
              </div>
            </div>
          </AnalysisCard>
        </div>
      )}
    </div>
  );
}
