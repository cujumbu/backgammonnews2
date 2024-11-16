"use client";

import { useState } from 'react';
import { analyzePosition } from 'gnubg-position';

interface PositionAnalysis {
  equity: number;
  winSingle: number;
  winGammon: number;
  winBackgammon: number;
  loseSingle: number;
  loseGammon: number;
  loseBackgammon: number;
}

export default function PositionAnalyzer() {
  const [position, setPosition] = useState('');
  const [analysis, setAnalysis] = useState<PositionAnalysis | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = () => {
    try {
      setError(null);
      const result = analyzePosition(position);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid position format');
      setAnalysis(null);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Position Analyzer</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Enter Position (GNU Backgammon Format)
        </label>
        <textarea
          value={position}
          onChange={(e) => setPosition(e.target.value)}
          className="w-full h-32 p-3 border rounded-md"
          placeholder="Example: 4HPwATDgc/ABMA:0:0:1:00:0:0:0:0:10"
        />
        <p className="mt-2 text-sm text-gray-500">
          Enter a position in GNU Backgammon format to analyze winning probabilities and equity.
        </p>
      </div>

      <button
        onClick={handleAnalyze}
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Analyze Position
      </button>

      {error && (
        <div className="mt-4 p-4 bg-red-50 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {analysis && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-4">Analysis Results</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-3">Equity</h3>
              <p className="text-3xl font-bold text-blue-600">
                {analysis.equity.toFixed(3)}
              </p>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-3">Win Probabilities</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Single:</span>
                  <span className="font-medium">{(analysis.winSingle * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Gammon:</span>
                  <span className="font-medium">{(analysis.winGammon * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Backgammon:</span>
                  <span className="font-medium">{(analysis.winBackgammon * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-3">Loss Probabilities</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Single:</span>
                  <span className="font-medium">{(analysis.loseSingle * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Gammon:</span>
                  <span className="font-medium">{(analysis.loseGammon * 100).toFixed(1)}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Backgammon:</span>
                  <span className="font-medium">{(analysis.loseBackgammon * 100).toFixed(1)}%</span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-white rounded-lg shadow">
              <h3 className="text-lg font-medium mb-3">Total Probabilities</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Win:</span>
                  <span className="font-medium text-green-600">
                    {((analysis.winSingle + analysis.winGammon + analysis.winBackgammon) * 100).toFixed(1)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Lose:</span>
                  <span className="font-medium text-red-600">
                    {((analysis.loseSingle + analysis.loseGammon + analysis.loseBackgammon) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
