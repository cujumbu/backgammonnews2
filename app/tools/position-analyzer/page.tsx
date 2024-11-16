"use client";

import { useState } from 'react';
import { parsePosition } from './lib/parser';
import { analyzePosition } from './lib/analyzer';
import { PositionAnalysis } from './lib/types';
import { AnalysisCard } from './components/analysis-card';
import { PositionInput } from './components/position-input';

export default function PositionAnalyzer() {
  const [positionStr, setPositionStr] = useState('');
  const [analysis, setAnalysis] = useState<PositionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    try {
      setError(null);
      const position = parsePosition(positionStr);
      const result = analyzePosition(position);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid position format');
      setAnalysis(null);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Advanced Position Analyzer</h1>
      
      <PositionInput
        value={positionStr}
        onChange={setPositionStr}
        onAnalyze={handleAnalyze}
        error={error}
      />

      {analysis && (
        <div className="mt-6 space-y-6">
          <h2 className="text-xl font-semibold">Analysis Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <AnalysisCard title="Pip Count">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Player 1:</span>
                  <span className="font-medium">{analysis.pipCount.player1}</span>
                </div>
                <div className="flex justify-between">
                  <span>Player 2:</span>
                  <span className="font-medium">{analysis.pipCount.player2}</span>
                </div>
                <div className="flex justify-between text-blue-600">
                  <span>Difference:</span>
                  <span className="font-medium">{analysis.pipCount.difference}</span>
                </div>
              </div>
            </AnalysisCard>

            <AnalysisCard title="Position Strength">
              <div className="space-y-2">
                {Object.entries(analysis.strength).map(([key, value]) => (
                  <div key={key} className="flex justify-between">
                    <span className="capitalize">{key}:</span>
                    <div className="flex items-center">
                      <div className="w-24 h-2 bg-gray-200 rounded mr-2">
                        <div
                          className="h-full bg-blue-600 rounded"
                          style={{ width: `${value * 100}%` }}
                        />
                      </div>
                      <span className="font-medium">{(value * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </AnalysisCard>

            <AnalysisCard title="Blockade Analysis">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>P1 Blocks:</span>
                  <span className="font-medium">{analysis.blockade.player1Blocks}</span>
                </div>
                <div className="flex justify-between">
                  <span>P2 Blocks:</span>
                  <span className="font-medium">{analysis.blockade.player2Blocks}</span>
                </div>
                <div className="flex justify-between">
                  <span>P1 Prime:</span>
                  <span className="font-medium">{analysis.blockade.player1PrimeLength}</span>
                </div>
                <div className="flex justify-between">
                  <span>P2 Prime:</span>
                  <span className="font-medium">{analysis.blockade.player2PrimeLength}</span>
                </div>
              </div>
            </AnalysisCard>

            <AnalysisCard title="Blot Analysis">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>P1 Blots:</span>
                  <span className="font-medium">{analysis.blots.player1Blots}</span>
                </div>
                <div className="flex justify-between">
                  <span>P2 Blots:</span>
                  <span className="font-medium">{analysis.blots.player2Blots}</span>
                </div>
                <div className="flex justify-between">
                  <span>P1 Direct Shots:</span>
                  <span className="font-medium">{analysis.blots.player1DirectShots}</span>
                </div>
                <div className="flex justify-between">
                  <span>P2 Direct Shots:</span>
                  <span className="font-medium">{analysis.blots.player2DirectShots}</span>
                </div>
              </div>
            </AnalysisCard>

            <AnalysisCard title="Winning Chances">
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Win:</span>
                    <span className="font-medium text-green-600">
                      {(analysis.winProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className="h-full bg-green-600 rounded"
                      style={{ width: `${analysis.winProbability * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Gammon:</span>
                    <span className="font-medium text-yellow-600">
                      {(analysis.gammonProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className="h-full bg-yellow-600 rounded"
                      style={{ width: `${analysis.gammonProbability * 100}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between mb-1">
                    <span>Backgammon:</span>
                    <span className="font-medium text-red-600">
                      {(analysis.backgammonProbability * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-200 rounded">
                    <div
                      className="h-full bg-red-600 rounded"
                      style={{ width: `${analysis.backgammonProbability * 100}%` }}
                    />
                  </div>
                </div>
              </div>
            </AnalysisCard>

            <AnalysisCard title="Cube Action">
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span>Equity:</span>
                  <span className={`font-bold ${
                    analysis.equity > 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {analysis.equity.toFixed(3)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Market Position:</span>
                  <span className={`font-medium ${
                    analysis.marketPosition ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {analysis.marketPosition ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </AnalysisCard>
          </div>

          <AnalysisCard title="Recommendations">
            <ul className="space-y-2 list-disc list-inside">
              {analysis.recommendations.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </AnalysisCard>
        </div>
      )}
    </div>
  );
}
