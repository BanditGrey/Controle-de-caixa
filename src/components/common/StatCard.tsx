import React from 'react';
import { LucideIcon, TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'emerald' | 'rose' | 'amber' | 'blue' | 'purple' | 'slate';
  trend?: {
    value: number | string;
    isPositive?: boolean;
    label?: string;
  };
  action?: {
    label: string;
    onClick: () => void;
  };
  onClick?: () => void;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'slate',
  trend,
  action,
  onClick,
}) => {
  const variantStyles = {
    emerald: {
      bg: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20',
      borderGlow: 'hover:border-emerald-500/40',
      iconBg: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400',
      valueColor: 'text-emerald-600 dark:text-emerald-400',
    },
    rose: {
      bg: 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border-rose-500/20',
      borderGlow: 'hover:border-rose-500/40',
      iconBg: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-400',
      valueColor: 'text-rose-600 dark:text-rose-400',
    },
    amber: {
      bg: 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20',
      borderGlow: 'hover:border-amber-500/40',
      iconBg: 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-400',
      valueColor: 'text-amber-600 dark:text-amber-400',
    },
    blue: {
      bg: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
      borderGlow: 'hover:border-blue-500/40',
      iconBg: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-400',
      valueColor: 'text-blue-600 dark:text-blue-400',
    },
    purple: {
      bg: 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
      borderGlow: 'hover:border-purple-500/40',
      iconBg: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-400',
      valueColor: 'text-purple-600 dark:text-purple-400',
    },
    slate: {
      bg: 'bg-slate-500/10 text-slate-600 dark:text-slate-400 border-slate-500/20',
      borderGlow: 'hover:border-slate-400/40',
      iconBg: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
      valueColor: 'text-slate-900 dark:text-slate-100',
    },
  }[variant];

  return (
    <div
      onClick={onClick}
      className={`relative overflow-hidden rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:-translate-y-0.5' : ''
      } ${variantStyles.borderGlow}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        <div className={`flex h-10 w-10 items-center justify-center rounded-xl transition-transform ${variantStyles.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>

      <div className="mt-3">
        <div className={`text-2xl font-bold tracking-tight ${variantStyles.valueColor} font-mono sm:text-3xl`}>
          {value}
        </div>

        {(subtitle || trend || action) && (
          <div className="mt-2.5 flex items-center justify-between gap-2 text-xs">
            {trend && (
              <div className="flex items-center gap-1 font-medium">
                {trend.isPositive === true && <TrendingUp className="h-3.5 w-3.5 text-emerald-500" />}
                {trend.isPositive === false && <TrendingDown className="h-3.5 w-3.5 text-rose-500" />}
                {trend.isPositive === undefined && <Minus className="h-3.5 w-3.5 text-slate-400" />}
                <span
                  className={
                    trend.isPositive === true
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : trend.isPositive === false
                      ? 'text-rose-600 dark:text-rose-400'
                      : 'text-slate-500'
                  }
                >
                  {trend.value}
                </span>
                {trend.label && <span className="text-slate-400 dark:text-slate-500">{trend.label}</span>}
              </div>
            )}

            {subtitle && !trend && (
              <span className="text-slate-500 dark:text-slate-400 line-clamp-1">{subtitle}</span>
            )}

            {action && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                className="font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 transition-colors"
              >
                {action.label} →
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
