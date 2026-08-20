import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  ArrowDownLeft,
  ArrowUpRight,
  Wallet,
  Calendar,
  FileSpreadsheet,
  FileText,
  Printer,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { StatCard } from '../components/common/StatCard';
import { formatCurrency, formatDate, exportToPDF, exportToExcel } from '../utils/formatters';

export const FluxoCaixa: React.FC = () => {
  const { transactions, company, categoriesMap } = useFinancial();

  // Selected period month/year
  const today = new Date();
  const [selectedYear, setSelectedYear] = useState(today.getFullYear());
  const [selectedMonth, setSelectedMonth] = useState(today.getMonth()); // 0-11

  const monthNames = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ];

  // Navigate months
  const handlePrevMonth = () => {
    if (selectedMonth === 0) {
      setSelectedMonth(11);
      setSelectedYear((prev) => prev - 1);
    } else {
      setSelectedMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (selectedMonth === 11) {
      setSelectedMonth(0);
      setSelectedYear((prev) => prev + 1);
    } else {
      setSelectedMonth((prev) => prev + 1);
    }
  };

  // Filter transactions for this month and before this month
  const {
    monthTransactions,
    initialMonthBalance,
    totalMonthIncome,
    totalMonthExpense,
    netMonthResult,
    finalMonthBalance,
    dailyBreakdown,
  } = useMemo(() => {
    let priorBalance = company.initialBalance || 0;

    const targetStart = new Date(selectedYear, selectedMonth, 1);
    const targetEnd = new Date(selectedYear, selectedMonth + 1, 0);

    const mTx: typeof transactions = [];

    // Calculate prior balance up to start of this month
    transactions.forEach((tx: any) => {
      if (tx.status === 'recebido' || tx.status === 'pago') {
        const txDate = new Date(tx.date + 'T00:00:00');
        if (txDate < targetStart) {
          if (tx.type === 'receita') priorBalance += tx.amount;
          if (tx.type === 'despesa') priorBalance -= tx.amount;
        } else if (txDate >= targetStart && txDate <= targetEnd) {
          mTx.push(tx);
        }
      }
    });

    // Sort month transactions by date ascending
    mTx.sort((a: any, b: any) => new Date(a.date).getTime() - new Date(b.date).getTime());

    let mIncome = 0;
    let mExpense = 0;

    // Daily breakdown map
    const daysInMonth = targetEnd.getDate();
    const dailyMap = new Map<number, { day: number; dateStr: string; income: number; expense: number; txs: typeof transactions }>();

    for (let day = 1; day <= daysInMonth; day++) {
      const dayStr = `${selectedYear}-${String(selectedMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      dailyMap.set(day, {
        day,
        dateStr: dayStr,
        income: 0,
        expense: 0,
        txs: [],
      });
    }

    mTx.forEach((tx: any) => {
      const d = new Date(tx.date + 'T00:00:00').getDate();
      const entry = dailyMap.get(d);
      if (entry) {
        if (tx.type === 'receita') {
          entry.income += tx.amount;
          mIncome += tx.amount;
        }
        if (tx.type === 'despesa') {
          entry.expense += tx.amount;
          mExpense += tx.amount;
        }
        entry.txs.push(tx);
      }
    });

    // Build timeline with cumulative balance
    let runningDailyBalance = priorBalance;
    const dailyList: {
      day: number;
      dateStr: string;
      income: number;
      expense: number;
      net: number;
      balance: number;
      txCount: number;
    }[] = [];

    for (let day = 1; day <= daysInMonth; day++) {
      const item = dailyMap.get(day)!;
      runningDailyBalance += item.income - item.expense;
      if (item.income > 0 || item.expense > 0 || day === 1 || day === daysInMonth) {
        dailyList.push({
          day,
          dateStr: item.dateStr,
          income: item.income,
          expense: item.expense,
          net: item.income - item.expense,
          balance: runningDailyBalance,
          txCount: item.txs.length,
        });
      }
    }

    return {
      monthTransactions: mTx,
      initialMonthBalance: priorBalance,
      totalMonthIncome: mIncome,
      totalMonthExpense: mExpense,
      netMonthResult: mIncome - mExpense,
      finalMonthBalance: priorBalance + mIncome - mExpense,
      dailyBreakdown: dailyList,
    };
  }, [transactions, selectedYear, selectedMonth, company.initialBalance]);

  const handleExportPDF = () => {
    exportToPDF(
      monthTransactions,
      categoriesMap,
      company,
      `Fluxo de Caixa - ${monthNames[selectedMonth]} ${selectedYear}`,
      `${monthNames[selectedMonth]} de ${selectedYear}`
    );
  };

  const handleExportExcel = () => {
    exportToExcel(
      monthTransactions,
      categoriesMap,
      company,
      `fluxo-caixa-${monthNames[selectedMonth].toLowerCase()}-${selectedYear}.xlsx`
    );
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Month Navigation & Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Demonstrativo de Fluxo de Caixa
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Acompanhamento diário de saldo inicial, movimentações e saldo final
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Month Selector */}
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-2xs dark:border-slate-800 dark:bg-slate-900">
            <button
              type="button"
              onClick={handlePrevMonth}
              className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="flex items-center gap-1.5 px-2 text-xs font-bold text-slate-800 dark:text-slate-100">
              <Calendar className="h-3.5 w-3.5 text-emerald-600" />
              <span>
                {monthNames[selectedMonth]} {selectedYear}
              </span>
            </div>
            <button
              type="button"
              onClick={handleNextMonth}
              className="p-1.5 rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Export buttons */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={handleExportPDF}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              <FileText className="h-3.5 w-3.5 text-rose-500" />
              <span>PDF</span>
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-600" />
              <span>Excel</span>
            </button>
            <button
              type="button"
              onClick={handlePrint}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cash Flow Statement Summary Ribbon */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {/* Saldo Inicial */}
        <StatCard
          title="Saldo Inicial (Abertura)"
          value={formatCurrency(initialMonthBalance, company.currencySymbol)}
          icon={Wallet}
          variant="slate"
          subtitle={`Posição em 01/${String(selectedMonth + 1).padStart(2, '0')}`}
        />

        {/* (+) Entradas */}
        <StatCard
          title="(+) Total Entradas"
          value={formatCurrency(totalMonthIncome, company.currencySymbol)}
          icon={ArrowDownLeft}
          variant="emerald"
          subtitle="Receitas compensadas"
        />

        {/* (-) Saídas */}
        <StatCard
          title="(-) Total Saídas"
          value={formatCurrency(totalMonthExpense, company.currencySymbol)}
          icon={ArrowUpRight}
          variant="rose"
          subtitle="Despesas pagas"
        />

        {/* (=) Resultado do Mês */}
        <StatCard
          title="(=) Resultado Operacional"
          value={formatCurrency(netMonthResult, company.currencySymbol)}
          icon={TrendingUp}
          variant={netMonthResult >= 0 ? 'purple' : 'rose'}
          subtitle={netMonthResult >= 0 ? 'Superávit / Lucro' : 'Déficit / Prejuízo'}
        />

        {/* (=) Saldo Final */}
        <StatCard
          title="(=) Saldo Final Previsto"
          value={formatCurrency(finalMonthBalance, company.currencySymbol)}
          icon={Wallet}
          variant={finalMonthBalance >= 0 ? 'emerald' : 'rose'}
          subtitle="Posição de fechamento"
        />
      </div>

      {/* Financial Formula Visual Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-linear-to-r from-slate-900 to-indigo-950 p-5 text-white shadow-md">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 font-mono text-xs">
          <div className="text-center lg:text-left">
            <span className="text-[10px] uppercase tracking-wider text-slate-400">Saldo Inicial</span>
            <p className="text-lg font-bold text-white">
              {formatCurrency(initialMonthBalance, company.currencySymbol)}
            </p>
          </div>

          <span className="text-emerald-400 font-bold text-xl">+</span>

          <div className="text-center lg:text-left">
            <span className="text-[10px] uppercase tracking-wider text-emerald-400">Entradas</span>
            <p className="text-lg font-bold text-emerald-400">
              {formatCurrency(totalMonthIncome, company.currencySymbol)}
            </p>
          </div>

          <span className="text-rose-400 font-bold text-xl">-</span>

          <div className="text-center lg:text-left">
            <span className="text-[10px] uppercase tracking-wider text-rose-400">Saídas</span>
            <p className="text-lg font-bold text-rose-400">
              {formatCurrency(totalMonthExpense, company.currencySymbol)}
            </p>
          </div>

          <span className="text-indigo-300 font-bold text-xl">=</span>

          <div className="text-center lg:text-left rounded-xl bg-white/10 px-4 py-2 border border-white/10">
            <span className="text-[10px] uppercase tracking-wider text-indigo-200">Saldo Final</span>
            <p className="text-xl font-bold text-white">
              {formatCurrency(finalMonthBalance, company.currencySymbol)}
            </p>
          </div>
        </div>
      </div>

      {/* Daily Cash Flow Statement Table */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Evolução Diária do Caixa
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Movimentação detalhada dia a dia em {monthNames[selectedMonth]} de {selectedYear}
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4 text-center">Transações</th>
                <th className="py-3 px-4 text-right">(+) Entradas</th>
                <th className="py-3 px-4 text-right">(-) Saídas</th>
                <th className="py-3 px-4 text-right">Resultado do Dia</th>
                <th className="py-3 px-4 text-right">Saldo Acumulado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {dailyBreakdown.map((row) => (
                <tr
                  key={row.dateStr}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors font-mono"
                >
                  <td className="py-3 px-4 text-slate-700 dark:text-slate-300 font-semibold">
                    {formatDate(row.dateStr)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    {row.txCount > 0 ? (
                      <span className="inline-flex items-center justify-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                        {row.txCount} op.
                      </span>
                    ) : (
                      <span className="text-slate-400 text-[10px]">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right text-emerald-600 dark:text-emerald-400">
                    {row.income > 0 ? `+ ${formatCurrency(row.income, company.currencySymbol)}` : '-'}
                  </td>
                  <td className="py-3 px-4 text-right text-rose-600 dark:text-rose-400">
                    {row.expense > 0 ? `- ${formatCurrency(row.expense, company.currencySymbol)}` : '-'}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-bold ${
                      row.net > 0
                        ? 'text-emerald-600 dark:text-emerald-400'
                        : row.net < 0
                        ? 'text-rose-600 dark:text-rose-400'
                        : 'text-slate-400'
                    }`}
                  >
                    {row.net !== 0 ? formatCurrency(row.net, company.currencySymbol) : '-'}
                  </td>
                  <td
                    className={`py-3 px-4 text-right font-bold text-sm ${
                      row.balance >= 0
                        ? 'text-slate-900 dark:text-white'
                        : 'text-rose-600 dark:text-rose-400'
                    }`}
                  >
                    {formatCurrency(row.balance, company.currencySymbol)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
