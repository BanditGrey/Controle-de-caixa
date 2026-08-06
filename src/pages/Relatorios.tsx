import React, { useState, useMemo } from 'react';
import {
  FileSpreadsheet,
  FileText,
  Printer,
  TrendingUp,
  Receipt,
  Users,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { formatCurrency, exportToPDF, exportToExcel } from '../utils/formatters';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { Transaction } from '../types';

type ReportType = 'dre' | 'despesas' | 'receitas';

export const Relatorios: React.FC = () => {
  const { transactions, categoriesMap, company } = useFinancial();

  const [activeReport, setActiveReport] = useState<ReportType>('dre');
  const [periodPreset, setPeriodPreset] = useState<'este_mes' | 'mes_anterior' | '3meses' | 'este_ano'>('este_mes');

  // Calculate filtered date range based on preset
  const dateRange = useMemo(() => {
    const today = new Date();
    let start = new Date(today.getFullYear(), today.getMonth(), 1);
    let end = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    if (periodPreset === 'mes_anterior') {
      start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      end = new Date(today.getFullYear(), today.getMonth(), 0);
    } else if (periodPreset === '3meses') {
      start = new Date(today.getFullYear(), today.getMonth() - 2, 1);
      end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (periodPreset === 'este_ano') {
      start = new Date(today.getFullYear(), 0, 1);
      end = new Date(today.getFullYear(), 11, 31);
    }

    const fmt = (d: Date) =>
      `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

    return {
      startDate: fmt(start),
      endDate: fmt(end),
      label:
        periodPreset === 'este_mes'
          ? 'Mês Atual'
          : periodPreset === 'mes_anterior'
          ? 'Mês Anterior'
          : periodPreset === '3meses'
          ? 'Últimos 3 Meses'
          : 'Ano Atual',
    };
  }, [periodPreset]);

  // Filter transactions in date range
  const periodTransactions = useMemo(() => {
    return transactions.filter((t: Transaction) => {
      if (t.status !== 'recebido' && t.status !== 'pago') return false;
      return t.date >= dateRange.startDate && t.date <= dateRange.endDate;
    });
  }, [transactions, dateRange]);

  // DRE Calculations
  const dreData = useMemo(() => {
    let grossRevenue = 0;
    let costOfGoods = 0;
    const operationalExpenses: { name: string; amount: number; color: string; icon: string }[] = [];
    let totalOpExpenses = 0;

    const expenseCategoryTotals = new Map<string, number>();

    periodTransactions.forEach((tx: Transaction) => {
      if (tx.type === 'receita') {
        grossRevenue += tx.amount;
      } else {
        const cat = categoriesMap.get(tx.categoryId);
        if (cat?.name?.toLowerCase().includes('fornecedor') || cat?.name?.toLowerCase().includes('mercadoria')) {
          costOfGoods += tx.amount;
        } else {
          expenseCategoryTotals.set(
            tx.categoryId,
            (expenseCategoryTotals.get(tx.categoryId) || 0) + tx.amount
          );
          totalOpExpenses += tx.amount;
        }
      }
    });

    expenseCategoryTotals.forEach((amt, catId) => {
      const cat = categoriesMap.get(catId);
      operationalExpenses.push({
        name: cat?.name || 'Outras Despesas',
        amount: amt,
        color: cat?.color || '#ef4444',
        icon: cat?.icon || 'Receipt',
      });
    });

    operationalExpenses.sort((a, b) => b.amount - a.amount);

    const grossProfit = grossRevenue - costOfGoods;
    const netOperatingProfit = grossProfit - totalOpExpenses;
    const netProfitMargin = grossRevenue > 0 ? (netOperatingProfit / grossRevenue) * 100 : 0;

    return {
      grossRevenue,
      costOfGoods,
      grossProfit,
      operationalExpenses,
      totalOpExpenses,
      netOperatingProfit,
      netProfitMargin,
    };
  }, [periodTransactions, categoriesMap]);

  // Category Expenses Breakdown
  const categoryExpensesBreakdown = useMemo(() => {
    let total = 0;
    const map = new Map<string, { count: number; total: number }>();

    periodTransactions
      .filter((t: Transaction) => t.type === 'despesa')
      .forEach((t: Transaction) => {
        total += t.amount;
        const cur = map.get(t.categoryId) || { count: 0, total: 0 };
        cur.count += 1;
        cur.total += t.amount;
        map.set(t.categoryId, cur);
      });

    return Array.from(map.entries())
      .map(([catId, val]) => {
        const cat = categoriesMap.get(catId);
        return {
          id: catId,
          name: cat?.name || 'Outros',
          color: cat?.color || '#ef4444',
          icon: cat?.icon || 'Receipt',
          total: val.total,
          count: val.count,
          percentage: total > 0 ? (val.total / total) * 100 : 0,
          budgetLimit: cat?.budgetLimit,
        };
      })
      .sort((a, b) => b.total - a.total);
  }, [periodTransactions, categoriesMap]);

  // Category Revenues Breakdown & Top Clients
  const revenueBreakdown = useMemo(() => {
    let total = 0;
    const catMap = new Map<string, { count: number; total: number }>();
    const clientMap = new Map<string, { count: number; total: number }>();

    periodTransactions
      .filter((t: Transaction) => t.type === 'receita')
      .forEach((t: Transaction) => {
        total += t.amount;

        const curCat = catMap.get(t.categoryId) || { count: 0, total: 0 };
        curCat.count += 1;
        curCat.total += t.amount;
        catMap.set(t.categoryId, curCat);

        const clientName = t.entityName || 'Vendas Balcão / Diversos';
        const curClient = clientMap.get(clientName) || { count: 0, total: 0 };
        curClient.count += 1;
        curClient.total += t.amount;
        clientMap.set(clientName, curClient);
      });

    const categoriesList = Array.from(catMap.entries())
      .map(([catId, val]) => {
        const cat = categoriesMap.get(catId);
        return {
          id: catId,
          name: cat?.name || 'Vendas',
          color: cat?.color || '#10b981',
          icon: cat?.icon || 'ShoppingBag',
          total: val.total,
          count: val.count,
          percentage: total > 0 ? (val.total / total) * 100 : 0,
        };
      })
      .sort((a, b) => b.total - a.total);

    const topClientsList = Array.from(clientMap.entries())
      .map(([name, val]) => ({
        name,
        total: val.total,
        count: val.count,
        percentage: total > 0 ? (val.total / total) * 100 : 0,
      }))
      .sort((a, b) => b.total - a.total);

    return { totalRevenue: total, categoriesList, topClientsList };
  }, [periodTransactions, categoriesMap]);

  const handleExportPDF = () => {
    exportToPDF(
      periodTransactions,
      categoriesMap,
      company,
      `Relatório Financeiro - ${dateRange.label}`,
      dateRange.label
    );
  };

  const handleExportExcel = () => {
    exportToExcel(periodTransactions, categoriesMap, company, `relatorio-financeiro-${periodPreset}.xlsx`);
  };

  return (
    <div className="space-y-6">
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Relatórios & Análise Financeira
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            DRE Simplificado, centros de custo, faturamento por cliente e comparativos
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {/* Period Presets */}
          <div className="flex items-center gap-1 p-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPeriodPreset('este_mes')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                periodPreset === 'este_mes'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Este Mês
            </button>
            <button
              type="button"
              onClick={() => setPeriodPreset('mes_anterior')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                periodPreset === 'mes_anterior'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Mês Anterior
            </button>
            <button
              type="button"
              onClick={() => setPeriodPreset('3meses')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                periodPreset === '3meses'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Trimestre
            </button>
            <button
              type="button"
              onClick={() => setPeriodPreset('este_ano')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                periodPreset === 'este_ano'
                  ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
              }`}
            >
              Ano Completo
            </button>
          </div>

          {/* Export Actions */}
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
              onClick={() => window.print()}
              className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white hover:bg-white dark:hover:bg-slate-700 rounded-lg transition-all"
            >
              <Printer className="h-3.5 w-3.5 text-slate-500" />
              <span>Imprimir</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Category Switcher Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto p-1.5 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveReport('dre')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeReport === 'dre'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <TrendingUp className="h-4 w-4" />
          <span>DRE Simplificado</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReport('despesas')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeReport === 'despesas'
              ? 'bg-rose-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Receipt className="h-4 w-4" />
          <span>Despesas por Categoria</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveReport('receitas')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-xl transition-all ${
            activeReport === 'receitas'
              ? 'bg-cyan-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Users className="h-4 w-4" />
          <span>Receitas & Clientes</span>
        </button>
      </div>

      {/* REPORT CONTENT VIEW 1: DRE SIMPLIFICADO */}
      {activeReport === 'dre' && (
        <div className="space-y-6">
          {/* Top DRE KPIs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase text-slate-400">Receita Bruta Total</span>
              <p className="mt-2 text-2xl font-bold font-mono text-emerald-600 dark:text-emerald-400">
                {formatCurrency(dreData.grossRevenue, company.currencySymbol)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">Faturamento no período</span>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase text-slate-400">Despesas Totais</span>
              <p className="mt-2 text-2xl font-bold font-mono text-rose-600 dark:text-rose-400">
                {formatCurrency(dreData.costOfGoods + dreData.totalOpExpenses, company.currencySymbol)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">Custos + Operacional</span>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase text-slate-400">Resultado Líquido</span>
              <p
                className={`mt-2 text-2xl font-bold font-mono ${
                  dreData.netOperatingProfit >= 0 ? 'text-indigo-600 dark:text-indigo-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {formatCurrency(dreData.netOperatingProfit, company.currencySymbol)}
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">Lucro / Prejuízo apurado</span>
            </div>

            <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
              <span className="text-xs font-semibold uppercase text-slate-400">Margem Operacional</span>
              <p
                className={`mt-2 text-2xl font-bold font-mono ${
                  dreData.netProfitMargin >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'
                }`}
              >
                {dreData.netProfitMargin.toFixed(1)}%
              </p>
              <span className="text-[11px] text-slate-400 mt-1 block">Eficiência sobre a receita</span>
            </div>
          </div>

          {/* DRE Structured Financial Statement */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="text-base font-bold text-slate-900 dark:text-white mb-4">
              Demonstração do Resultado ({dateRange.label})
            </h3>

            <div className="space-y-3 font-mono text-xs">
              {/* 1. Receita Bruta */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-300 font-bold">
                <span className="font-sans">(+) 1. RECEITA OPERACIONAL BRUTA</span>
                <span className="text-sm">{formatCurrency(dreData.grossRevenue, company.currencySymbol)}</span>
              </div>

              {/* 2. Custos */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300">
                <span className="font-sans">(-) 2. CUSTO DE FORNECEDORES & MERCADORIAS</span>
                <span className="text-rose-600 dark:text-rose-400 font-semibold">
                  - {formatCurrency(dreData.costOfGoods, company.currencySymbol)}
                </span>
              </div>

              {/* 3. Lucro Bruto */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold">
                <span className="font-sans">(=) 3. LUCRO BRUTO</span>
                <span className="text-sm">{formatCurrency(dreData.grossProfit, company.currencySymbol)}</span>
              </div>

              {/* 4. Despesas Operacionais Detail */}
              <div className="pt-2 pl-4 border-l-2 border-rose-300 dark:border-rose-800 space-y-2">
                <span className="text-[11px] font-sans font-semibold uppercase tracking-wider text-slate-400">
                  (-) 4. Despesas Operacionais Detalhadas:
                </span>
                {dreData.operationalExpenses.map((exp) => (
                  <div key={exp.name} className="flex items-center justify-between text-slate-600 dark:text-slate-300 py-1">
                    <span className="font-sans">{exp.name}</span>
                    <span className="text-rose-600 dark:text-rose-400">
                      - {formatCurrency(exp.amount, company.currencySymbol)}
                    </span>
                  </div>
                ))}
              </div>

              {/* 5. Total Despesas Operacionais */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/70 dark:bg-rose-950/30 text-rose-900 dark:text-rose-300 font-semibold">
                <span className="font-sans">(-) TOTAL DESPESAS OPERACIONAIS</span>
                <span>- {formatCurrency(dreData.totalOpExpenses, company.currencySymbol)}</span>
              </div>

              {/* 6. Resultado Líquido Final */}
              <div
                className={`flex items-center justify-between p-4 rounded-xl font-bold text-sm text-white shadow-md ${
                  dreData.netOperatingProfit >= 0 ? 'bg-linear-to-r from-emerald-600 to-teal-700' : 'bg-linear-to-r from-rose-600 to-red-800'
                }`}
              >
                <span className="font-sans">(=) RESULTADO LÍQUIDO DO EXERCÍCIO</span>
                <span className="text-base">{formatCurrency(dreData.netOperatingProfit, company.currencySymbol)}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT VIEW 2: DESPESAS POR CATEGORIA */}
      {activeReport === 'despesas' && (
        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Detalhamento de Despesas por Centro de Custo
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Classificação por volume de gastos e percentual de participação
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 uppercase font-semibold text-[10px] tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Centro de Custo / Categoria</th>
                    <th className="py-3 px-4 text-center">Nº Lançamentos</th>
                    <th className="py-3 px-4 text-right">Valor Total</th>
                    <th className="py-3 px-4 text-right">Participação (%)</th>
                    <th className="py-3 px-4 text-right">Teto Orçado</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
                  {categoryExpensesBreakdown.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-2.5">
                          <div
                            className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                            style={{ backgroundColor: item.color }}
                          >
                            <CategoryIcon name={item.icon} size={14} className="text-white" />
                          </div>
                          <span className="font-bold text-slate-900 dark:text-white">{item.name}</span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-center font-mono text-slate-600 dark:text-slate-300">
                        {item.count}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-rose-600 dark:text-rose-400 text-sm">
                        {formatCurrency(item.total, company.currencySymbol)}
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                        {item.percentage.toFixed(1)}%
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono text-slate-500">
                        {item.budgetLimit ? formatCurrency(item.budgetLimit, company.currencySymbol) : '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* REPORT CONTENT VIEW 3: RECEITAS & CLIENTES */}
      {activeReport === 'receitas' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Categories */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Receitas por Categoria
            </h3>
            <div className="space-y-3">
              {revenueBreakdown.categoriesList.map((cat) => (
                <div
                  key={cat.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    <div
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-white"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} size={14} className="text-white" />
                    </div>
                    <div>
                      <h5 className="font-bold text-slate-900 dark:text-white">{cat.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">{cat.count} vendas</span>
                    </div>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                      {formatCurrency(cat.total, company.currencySymbol)}
                    </span>
                    <span className="text-[10px] text-slate-400">{cat.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Clients */}
          <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900">
            <h3 className="font-bold text-slate-900 dark:text-white text-base mb-4">
              Principais Clientes & Pagadores
            </h3>
            <div className="space-y-3">
              {revenueBreakdown.topClientsList.map((cli) => (
                <div
                  key={cli.name}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 text-xs"
                >
                  <div>
                    <h5 className="font-bold text-slate-900 dark:text-white">{cli.name}</h5>
                    <span className="text-[10px] text-slate-400 font-mono">{cli.count} transações</span>
                  </div>
                  <div className="text-right font-mono">
                    <span className="font-bold text-emerald-600 dark:text-emerald-400 block">
                      {formatCurrency(cli.total, company.currencySymbol)}
                    </span>
                    <span className="text-[10px] text-slate-400">{cli.percentage.toFixed(1)}%</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
