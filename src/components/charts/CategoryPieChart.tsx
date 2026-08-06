import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from 'recharts';
import { useFinancial } from '../../context/FinancialContext';
import { formatCurrency } from '../../utils/formatters';
import { CategoryIcon } from '../common/CategoryIcon';

const DEFAULT_COLORS = [
  '#ef4444',
  '#f97316',
  '#eab308',
  '#10b981',
  '#06b6d4',
  '#3b82f6',
  '#6366f1',
  '#8b5cf6',
  '#ec4899',
  '#64748b',
];

export const CategoryPieChart: React.FC = () => {
  const { transactions, categories, company } = useFinancial();
  const [activeType, setActiveType] = useState<'despesa' | 'receita'>('despesa');

  const { chartData, totalAmount } = useMemo(() => {
    const categoryTotals = new Map<string, number>();

    transactions
      .filter((t) => (t.status === 'recebido' || t.status === 'pago') && t.type === activeType)
      .forEach((t) => {
        const current = categoryTotals.get(t.categoryId) || 0;
        categoryTotals.set(t.categoryId, current + t.amount);
      });

    let total = 0;
    const data: { id: string; name: string; value: number; color: string; icon: string; percentage: number }[] = [];

    categoryTotals.forEach((amt, catId) => {
      total += amt;
      const catObj = categories.find((c) => c.id === catId);
      data.push({
        id: catId,
        name: catObj?.name || 'Outros',
        value: amt,
        color: catObj?.color || DEFAULT_COLORS[data.length % DEFAULT_COLORS.length],
        icon: catObj?.icon || 'CircleDollarSign',
        percentage: 0,
      });
    });

    // Calculate percentage
    data.forEach((d) => {
      d.percentage = total > 0 ? (d.value / total) * 100 : 0;
    });

    // Sort descending
    data.sort((a, b) => b.value - a.value);

    return { chartData: data, totalAmount: total };
  }, [transactions, categories, activeType]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/95 text-xs">
          <div className="flex items-center gap-2 font-bold text-slate-800 dark:text-slate-100">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.color }} />
            {item.name}
          </div>
          <div className="mt-1.5 flex items-center justify-between gap-4 font-mono">
            <span className="text-slate-500">Valor:</span>
            <span className="font-semibold text-slate-900 dark:text-white">
              {formatCurrency(item.value, company.currencySymbol)}
            </span>
          </div>
          <div className="flex items-center justify-between gap-4 font-mono text-slate-500">
            <span>Participação:</span>
            <span className="font-semibold text-emerald-600 dark:text-emerald-400">
              {item.percentage.toFixed(1)}%
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Distribuição por Categoria
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {activeType === 'despesa' ? 'Onde sua empresa mais gasta' : 'Principais fontes de receita'}
          </p>
        </div>

        {/* Switch Type Tabs */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800">
          <button
            type="button"
            onClick={() => setActiveType('despesa')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeType === 'despesa'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Despesas
          </button>
          <button
            type="button"
            onClick={() => setActiveType('receita')}
            className={`rounded-lg px-3 py-1 text-xs font-semibold transition-all ${
              activeType === 'receita'
                ? 'bg-emerald-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            Receitas
          </button>
        </div>
      </div>

      {chartData.length === 0 ? (
        <div className="h-64 flex flex-col items-center justify-center text-slate-400 text-xs">
          <p>Nenhuma movimentação registrada nesta categoria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
          <div className="md:col-span-6 h-64 relative">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={85}
                  paddingAngle={3}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
            {/* Center Total Text */}
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-[10px] uppercase font-semibold text-slate-400">Total</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-100 font-mono">
                {formatCurrency(totalAmount, company.currencySymbol)}
              </span>
            </div>
          </div>

          {/* Category List Breakdown */}
          <div className="md:col-span-6 space-y-2.5 max-h-64 overflow-y-auto pr-1">
            {chartData.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between text-xs p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  <div
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                    style={{ backgroundColor: item.color }}
                  >
                    <CategoryIcon name={item.icon} size={14} className="text-white" />
                  </div>
                  <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                    {item.name}
                  </span>
                </div>
                <div className="flex items-center gap-2 font-mono shrink-0 pl-2">
                  <span className="font-semibold text-slate-900 dark:text-white">
                    {formatCurrency(item.value, company.currencySymbol)}
                  </span>
                  <span className="text-[11px] text-slate-400 w-10 text-right">
                    {item.percentage.toFixed(0)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
