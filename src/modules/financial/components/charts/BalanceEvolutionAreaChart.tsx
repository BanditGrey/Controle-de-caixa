import React, { useState, useMemo } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { useFinancial } from '../../context/FinancialContext';
import { formatCurrency, formatDate } from '../../utils/formatters';

interface BalanceEvolutionAreaChartProps {
  periodFilter?: '7dias' | '30dias' | '6meses' | '12meses';
}

export const BalanceEvolutionAreaChart: React.FC<BalanceEvolutionAreaChartProps> = () => {
  const { transactions, company, darkMode } = useFinancial();
  const [period, setPeriod] = useState<'7dias' | '30dias' | '6meses' | '12meses'>('30dias');

  const chartData = useMemo(() => {
    // Sort transactions by date ascending
    const sorted = [...transactions]
      .filter((t) => t.status === 'recebido' || t.status === 'pago')
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

    if (period === '7dias' || period === '30dias') {
      const daysCount = period === '7dias' ? 7 : 30;
      const today = new Date();
      const points: { dateStr: string; label: string; entradas: number; saidas: number; saldoAcumulado: number }[] = [];

      let runningBalance = company.initialBalance || 0;

      // Group by day for the last N days
      for (let i = daysCount - 1; i >= 0; i--) {
        const d = new Date();
        d.setDate(today.getDate() - i);
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        const dateKey = `${y}-${m}-${day}`;

        let dayIn = 0;
        let dayOut = 0;

        sorted.forEach((t) => {
          if (t.date === dateKey) {
            if (t.type === 'receita') dayIn += t.amount;
            if (t.type === 'despesa') dayOut += t.amount;
          }
        });

        runningBalance += dayIn - dayOut;

        points.push({
          dateStr: dateKey,
          label: `${day}/${m}`,
          entradas: dayIn,
          saidas: dayOut,
          saldoAcumulado: runningBalance,
        });
      }

      return points;
    } else {
      // 6 or 12 months grouping
      const monthsCount = period === '6meses' ? 6 : 12;
      const points: { dateStr: string; label: string; entradas: number; saidas: number; saldoAcumulado: number }[] = [];
      const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const today = new Date();

      let runningBalance = company.initialBalance || 0;

      for (let i = monthsCount - 1; i >= 0; i--) {
        const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
        const y = d.getFullYear();
        const m = d.getMonth();
        const monthLabel = `${monthNames[m]}/${String(y).slice(2)}`;

        let mIn = 0;
        let mOut = 0;

        sorted.forEach((t) => {
          const tDate = new Date(t.date + 'T00:00:00');
          if (tDate.getFullYear() === y && tDate.getMonth() === m) {
            if (t.type === 'receita') mIn += t.amount;
            if (t.type === 'despesa') mOut += t.amount;
          }
        });

        runningBalance += mIn - mOut;

        points.push({
          dateStr: `${y}-${m}`,
          label: monthLabel,
          entradas: mIn,
          saidas: mOut,
          saldoAcumulado: runningBalance,
        });
      }

      return points;
    }
  }, [transactions, company.initialBalance, period]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3.5 shadow-xl backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/95 text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-100 border-b border-slate-100 dark:border-slate-800 pb-1.5 mb-2">
            Período: {label}
          </p>
          <div className="space-y-1.5 font-mono">
            <div className="flex items-center justify-between gap-4 text-emerald-600 dark:text-emerald-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-emerald-500" />
                Entradas:
              </span>
              <span className="font-semibold">{formatCurrency(data.entradas, company.currencySymbol)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-rose-600 dark:text-rose-400">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-rose-500" />
                Saídas:
              </span>
              <span className="font-semibold">{formatCurrency(data.saidas, company.currencySymbol)}</span>
            </div>
            <div className="flex items-center justify-between gap-4 text-indigo-600 dark:text-indigo-400 pt-1.5 border-t border-slate-100 dark:border-slate-800 font-bold">
              <span className="flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-indigo-500" />
                Saldo Caixa:
              </span>
              <span>{formatCurrency(data.saldoAcumulado, company.currencySymbol)}</span>
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
        <div>
          <h3 className="font-bold text-slate-900 dark:text-white text-base">
            Evolução do Saldo & Fluxo de Caixa
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Acompanhe o saldo acumulado e a relação entre entradas e saídas
          </p>
        </div>

        {/* Period Selector Buttons */}
        <div className="inline-flex rounded-xl bg-slate-100 p-1 dark:bg-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setPeriod('7dias')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              period === '7dias'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            7 Dias
          </button>
          <button
            type="button"
            onClick={() => setPeriod('30dias')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              period === '30dias'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            30 Dias
          </button>
          <button
            type="button"
            onClick={() => setPeriod('6meses')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              period === '6meses'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            6 Meses
          </button>
          <button
            type="button"
            onClick={() => setPeriod('12meses')}
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
              period === '12meses'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
            }`}
          >
            12 Meses
          </button>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
            <defs>
              <linearGradient id="colorSaldo" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorEntradas" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke={darkMode ? '#1e293b' : '#f1f5f9'}
            />
            <XAxis
              dataKey="label"
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
            <Area
              type="monotone"
              dataKey="saldoAcumulado"
              name="Saldo Acumulado"
              stroke="#6366f1"
              strokeWidth={3}
              fillOpacity={1}
              fill="url(#colorSaldo)"
            />
            <Area
              type="monotone"
              dataKey="entradas"
              name="Entradas"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorEntradas)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend Indicators */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-slate-600 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-indigo-500" />
          <span className="font-medium">Saldo Acumulado</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-emerald-500" />
          <span className="font-medium">Entradas Realizadas</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-full bg-rose-500" />
          <span className="font-medium">Saídas Realizadas</span>
        </div>
      </div>
    </div>
  );
};
