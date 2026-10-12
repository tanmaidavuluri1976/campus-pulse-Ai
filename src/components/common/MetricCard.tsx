import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'teal' | 'violet' | 'amber' | 'rose' | 'default';
  onClick?: () => void;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  onClick,
}) => {
  const variantStyles = {
    teal: 'border-teal-500/20 bg-gradient-to-b from-teal-950/20 to-slate-900/60 text-teal-400',
    violet: 'border-violet-500/20 bg-gradient-to-b from-violet-950/20 to-slate-900/60 text-violet-400',
    amber: 'border-amber-500/20 bg-gradient-to-b from-amber-950/20 to-slate-900/60 text-amber-400',
    rose: 'border-rose-500/20 bg-gradient-to-b from-rose-950/20 to-slate-900/60 text-rose-400',
    default: 'border-slate-800 bg-slate-900/60 text-slate-300',
  };

  return (
    <div
      onClick={onClick}
      className={`rounded-xl border p-4 sm:p-5 transition-all ${
        variantStyles[variant]
      } ${onClick ? 'cursor-pointer hover:border-slate-700 hover:bg-slate-900' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-400">{title}</span>
        <div className="rounded-lg bg-slate-800/80 p-2">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="font-mono text-2xl sm:text-3xl font-bold tracking-tight text-white tabular-nums">
          {value}
        </span>
      </div>
      {subtitle && (
        <div className="mt-1 text-xs text-slate-400">
          {subtitle}
        </div>
      )}
    </div>
  );
};
