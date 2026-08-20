import React, { useMemo } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, Cell } from 'recharts';
import { useFinancial } from '../../context/FinancialContext';
import { formatCurrency } from '../../utils/formatters';

const METHOD_COLORS: Record<string, string> = {
  PIX: '#10b981',
  'Cartão de Crédito': '#6366f1',
  'Cartão de Débito': '#06b6d4',
  Boleto: '#f59e0b',
  Dinheiro: '#84cc16',
  'Transferência TED': '#8b5cf6',
};

export const PaymentMethodChart: React.FC = () => {
  const { transactions, company } = useFinancial();

  const data = useMemo(() => {
    const counts: Record<string, { count: number; total: number }> = {};

    transactions
      .filter((t) => t.status === 'recebido' || t.status === 'pago')
      .forEach((t) => {
        if (!counts[t.paymentMethod]) {
          counts[t.paymentMethod] = { count: 0, total: 0 };
        }
        counts[t.paymentMethod].count += 1;
        counts[t.paymentMethod].total += t.amount;
      });

    return Object.entries(counts)
      .map(([method, val]) => ({
        method,
        total: val.total,
        count: val.count,
        color: METHOD_COLORS[method] || '#94a3b8',
      }))
      .sort((a, b) => b.total - a.total);
  }, [transactions]);

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="rounded-xl border border-slate-200 bg-white/95 p-3 shadow-xl backdrop-blur-xs dark:border-slate-800 dark:bg-slate-900/95 text-xs">
          <p className="font-bold text-slate-800 dark:text-slate-100 mb-1">{item.method}</p>
          <p className="text-slate-500 font-mono">
            Volume: <span className="font-semibold text-slate-900 dark:text-white">{formatCurrency(item.total, company.currencySymbol)}</span>
          </p>
          <p className="text-slate-500 font-mono">
            Operações: <span className="font-semibold text-indigo-600 dark:text-indigo-400">{item.count} transações</span>
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
      <h3 className="font-bold text-slate-900 dark:text-white text-base">
        Meios de Pagamento Mais Utilizados
      </h3>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
        Volume financeiro movimentado por modalidade
      </p>

      <div className="h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 15, left: 35, bottom: 5 }}>
            <XAxis type="number" hide />
            <YAxis
              type="category"
              dataKey="method"
              tickLine={false}
              axisLine={false}
              tick={{ fill: '#64748b', fontSize: 11 }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="total" radius={[0, 6, 6, 0]} maxBarSize={20}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
