import React, { useMemo } from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from 'recharts';
import { useFinancial } from '../../context/FinancialContext';
import { formatCurrency } from '../../utils/formatters';

export const CashFlowBarChart: React.FC = () => {
  const { transactions, company, darkMode } = useFinancial();

  const monthlyData = useMemo(() => {
    const monthsNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    const today = new Date();
    const result: { monthKey: string; name: string; entradas: number; saidas: number; lucro: number }[] = [];

    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
      const y = d.getFullYear();
      const m = d.getMonth();
      const monthLabel = `${monthsNames[m]} ${String(y).slice(2)}`;

      let entradas = 0;
      let saidas = 0;

      transactions
        .filter((t) => t.status === 'recebido' || t.status === 'pago')
        .forEach((t) => {
          const tDate = new Date(t.date + 'T00:00:00');
          if (tDate.getFullYear() === y && tDate.getMonth() === m) {
            if (t.type === 'receita') entradas += t.amount;
            if (t.type === 'despesa') saidas += t.amount;
          }
        });

      result.push({
        monthKey: `${y}-${m}`,
        name: monthLabel,
        entradas,
        saidas,
        lucro: entradas - saidas,
      });
    }

    return result;
  }, [transactions]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/95 text-xs font-mono">
          <p className="font-bold text-slate-800 dark:text-slate-100 font-sans border-b border-slate-100 dark:border-slate-800 pb-1 mb-2">
            {label}
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400">
              <span>Entradas:</span>
              <span className="font-bold">{formatCurrency(data.entradas, company.currencySymbol)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-rose-600 dark:text-rose-400">
              <span>Saídas:</span>
              <span className="font-bold">{formatCurrency(data.saidas, company.currencySymbol)}</span>
            </div>
            <div
              className={`flex items-center justify-between gap-4 pt-1.5 border-t border-slate-100 dark:border-slate-800 font-bold ${
                data.lucro >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              <span>Resultado:</span>
              <span>{formatCurrency(data.lucro, company.currencySymbol)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Comparativo Mensal (Entradas vs Saídas)
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Performance financeira nos últimos 6 meses
          </p>
        </div>
      </div>

      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={darkMode ? '#1e293b' : '#f1f5f9'}
            />
            <XAxis
              dataKey="name"
              tickLine={false}
              axisLine={false}
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tick={{ fill: darkMode ? '#94a3b8' : '#64748b', fontSize: 11 }}
              tickFormatter={(v) => `${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend
              verticalAlign="top"
              align="right"
              iconType="circle"
              wrapperStyle={{ fontSize: '11px', paddingBottom: '10px' }}
            />
            <Bar dataKey="entradas" name="Entradas" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={32} />
            <Bar dataKey="saidas" name="Saídas" fill="#ef4444" radius={[6, 6, 0, 0]} maxBarSize={32} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
