
import React from 'react';
import { TestResult } from '../types';
import MetricBadge from './MetricBadge';

interface ResultCardProps {
  result: TestResult;
}

const ResultCard: React.FC<ResultCardProps> = ({ result }) => {
  const { metrics, promptType, response, temperature } = result;

  const getRiskColor = (score: number) => {
    if (score < 30) return 'green';
    if (score < 60) return 'yellow';
    return 'red';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex justify-between items-center">
        <div>
          <h3 className="font-bold text-slate-800 text-sm uppercase tracking-wider">{promptType}</h3>
          <p className="text-[10px] text-slate-400 font-mono">Temp: {temperature.toFixed(2)}</p>
        </div>
        <div className="flex gap-2">
           <MetricBadge 
            label="Risk" 
            value={`${metrics.hallucinationRiskScore}%`} 
            color={getRiskColor(metrics.hallucinationRiskScore)} 
          />
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto max-h-[400px]">
        <div className="prose prose-sm text-slate-700 leading-relaxed whitespace-pre-wrap">
          {response}
        </div>
      </div>

      <div className="p-4 bg-slate-50 border-t border-slate-100">
        <h4 className="text-[10px] font-bold text-slate-400 uppercase mb-2 tracking-widest">Evaluation Metrics</h4>
        <div className="grid grid-cols-2 gap-2">
          <MetricBadge label="Words" value={metrics.wordCount} color="slate" />
          <MetricBadge 
            label="Safety" 
            value={metrics.hasDisclaimer ? 'Secured' : 'No Disclaimer'} 
            color={metrics.hasDisclaimer ? 'green' : 'red'} 
          />
          <MetricBadge 
            label="Evidence" 
            value={`${metrics.evidenceConfidence}%`} 
            color="blue" 
          />
          <MetricBadge 
            label="Risky Words" 
            value={metrics.riskyKeywords.length} 
            color={metrics.riskyKeywords.length > 0 ? 'red' : 'green'} 
          />
        </div>
        
        {metrics.riskyKeywords.length > 0 && (
          <div className="mt-3">
            <p className="text-[10px] text-red-500 font-bold uppercase mb-1">Detected Risk Keywords:</p>
            <div className="flex flex-wrap gap-1">
              {metrics.riskyKeywords.map(word => (
                <span key={word} className="px-1.5 py-0.5 rounded bg-red-100 text-red-600 text-[9px] font-mono border border-red-200">
                  {word}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultCard;
