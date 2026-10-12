import React from 'react';
import { RiskLevel } from '../../types';
import { AlertTriangle, AlertCircle, CheckCircle } from 'lucide-react';

export const RiskBadge: React.FC<{ level: RiskLevel; label?: string; size?: 'sm' | 'md' }> = ({
  level,
  label,
  size = 'md',
}) => {
  const displayLabel = label || level;

  if (level === 'High') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium text-rose-400 ${
          size === 'sm' ? 'text-[11px]' : 'text-xs'
        }`}
      >
        <AlertTriangle className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
        <span>{displayLabel}</span>
      </span>
    );
  }

  if (level === 'Medium') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 font-medium text-amber-400 ${
          size === 'sm' ? 'text-[11px]' : 'text-xs'
        }`}
      >
        <AlertCircle className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
        <span>{displayLabel}</span>
      </span>
    );
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium text-teal-400 ${
        size === 'sm' ? 'text-[11px]' : 'text-xs'
      }`}
    >
      <CheckCircle className={size === 'sm' ? 'h-3 w-3' : 'h-3.5 w-3.5'} />
      <span>{displayLabel}</span>
    </span>
  );
};
