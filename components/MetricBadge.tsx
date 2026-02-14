
import React from 'react';

interface MetricBadgeProps {
  label: string;
  value: string | number;
  color: 'red' | 'green' | 'blue' | 'yellow' | 'slate';
}

const MetricBadge: React.FC<MetricBadgeProps> = ({ label, value, color }) => {
  const colors = {
    red: 'bg-red-50 text-red-700 border-red-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    slate: 'bg-slate-50 text-slate-700 border-slate-200',
  };

  return (
    <div className={`px-2 py-1 rounded border text-xs font-medium flex justify-between gap-2 ${colors[color]}`}>
      <span className="opacity-70">{label}</span>
      <span>{value}</span>
    </div>
  );
};

export default MetricBadge;
