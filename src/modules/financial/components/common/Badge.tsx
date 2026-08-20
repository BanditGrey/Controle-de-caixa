import React from 'react';

interface BadgeProps {
  status: 'recebido' | 'pago' | 'pendente' | 'vencido' | 'parcial' | 'receita' | 'despesa' | 'admin' | 'financeiro' | 'visualizador' | string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ status, size = 'md', className = '' }) => {
  const normalized = status.toLowerCase();

  let styles = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  let label = status;

  if (normalized === 'recebido' || normalized === 'pago') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/60';
    label = normalized === 'recebido' ? 'Recebido' : 'Pago';
  } else if (normalized === 'pendente') {
    styles = 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/50 dark:text-amber-400 dark:border-amber-800/60';
    label = 'Pendente';
  } else if (normalized === 'vencido') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/60';
    label = 'Vencido';
  } else if (normalized === 'parcial') {
    styles = 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-400 dark:border-blue-800/60';
    label = 'Pago Parcial';
  } else if (normalized === 'receita') {
    styles = 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-400 dark:border-emerald-800/60';
    label = 'Entrada';
  } else if (normalized === 'despesa') {
    styles = 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-400 dark:border-rose-800/60';
    label = 'Saída';
  } else if (normalized === 'admin') {
    styles = 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-400 dark:border-purple-800/60';
    label = 'Administrador';
  } else if (normalized === 'financeiro') {
    styles = 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-950/50 dark:text-cyan-400 dark:border-cyan-800/60';
    label = 'Financeiro';
  } else if (normalized === 'visualizador') {
    styles = 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
    label = 'Visualizador';
  }

  const sizeClasses = {
    sm: 'text-[10px] px-1.5 py-0.5 font-medium',
    md: 'text-xs px-2.5 py-1 font-semibold',
    lg: 'text-sm px-3 py-1.5 font-semibold',
  }[size];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border tracking-wide uppercase font-mono ${sizeClasses} ${styles} ${className}`}
    >
      <span
        className={`w-1.5 h-1.5 rounded-full ${
          normalized === 'recebido' || normalized === 'pago' || normalized === 'receita'
            ? 'bg-emerald-500'
            : normalized === 'pendente'
            ? 'bg-amber-500 animate-pulse'
            : normalized === 'vencido'
            ? 'bg-rose-500'
            : normalized === 'parcial'
            ? 'bg-blue-500'
            : 'bg-slate-400'
        }`}
      />
      {label}
    </span>
  );
};
