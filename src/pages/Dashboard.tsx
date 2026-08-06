import React, { useState } from 'react';
import {
  Wallet,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  FileCheck2,
  AlertTriangle,
  CheckCircle2,
  FileText,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { BalanceEvolutionAreaChart } from '../components/charts/BalanceEvolutionAreaChart';
import { CategoryPieChart } from '../components/charts/CategoryPieChart';
import { CashFlowBarChart } from '../components/charts/CashFlowBarChart';
import { PaymentMethodChart } from '../components/charts/PaymentMethodChart';
import { formatCurrency, formatDate, getDaysDiff } from '../utils/formatters';
import { Transaction, AccountPayable } from '../types';
import { FileViewerModal } from '../components/common/FileViewerModal';

interface DashboardProps {
  onNavigate: (page: string) => void;
  onOpenNewIncome: () => void;
  onOpenNewExpense: () => void;
  onOpenPayBill: (bill: AccountPayable) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  onNavigate,
  onOpenNewIncome,
  onOpenNewExpense,
  onOpenPayBill,
}) => {
  const {
    company,
    currentBalance,
    monthIncome,
    monthExpense,
    monthNet,
    pendingPayablesTotal,
    pendingReceivablesTotal,
    overduePayablesCount,
    todayDueCount,
    transactions,
    accountsPayable,
    categoriesMap,
  } = useFinancial();

  const [selectedAttachmentTx, setSelectedAttachmentTx] = useState<Transaction | null>(null);

  // Recent transactions (last 6)
  const recentTransactions = transactions.slice(0, 6);

  // Urgent pending payables (due today or overdue)
  const urgentPayables = accountsPayable
    .filter((b) => b.status === 'pendente' || b.status === 'vencido' || b.status === 'parcial')
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime())
    .slice(0, 4);

  // Low balance alert condition
  const isLowBalance = currentBalance < company.lowBalanceThreshold;

  return (
    <div className="space-y-6">
      {/* Active Alerts Banner */}
      {(overduePayablesCount > 0 || todayDueCount > 0 || isLowBalance) && (
        <div className="space-y-2">
          {overduePayablesCount > 0 && (
            <div className="flex items-center justify-between rounded-2xl border border-rose-200 bg-rose-50/90 p-4 text-xs dark:border-rose-900/60 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-rose-500 text-white shrink-0">
                  <AlertTriangle className="h-4 w-4" />
                </div>
                <div>
                  <strong className="font-bold">Atenção aos vencimentos!</strong> Você possui{' '}
                  <span className="font-bold">{overduePayablesCount} conta(s) em atraso</span> que
                  precisam de quitação.
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('contas-pagar')}
                className="font-bold underline hover:opacity-80 shrink-0 ml-2"
              >
                Ver Contas →
              </button>
            </div>
          )}

          {isLowBalance && (
            <div className="flex items-center justify-between rounded-2xl border border-amber-200 bg-amber-50/90 p-4 text-xs dark:border-amber-900/60 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500 text-white shrink-0">
                  <Wallet className="h-4 w-4" />
                </div>
                <div>
                  <strong className="font-bold">Alerta de Saldo Mínimo:</strong> O saldo atual de caixa está abaixo do limite configurado de{' '}
                  {formatCurrency(company.lowBalanceThreshold, company.currencySymbol)}.
                </div>
              </div>
              <button
                type="button"
                onClick={() => onNavigate('configuracoes')}
                className="font-bold underline hover:opacity-80 shrink-0 ml-2"
              >
                Ajustar Limite →
              </button>
            </div>
          )}
        </div>
      )}

      {/* Main KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {/* Saldo Atual */}
        <StatCard
          title="Saldo Atual Caixa"
          value={formatCurrency(currentBalance, company.currencySymbol)}
          icon={Wallet}
          variant={currentBalance >= 0 ? 'emerald' : 'rose'}
          subtitle="Saldo em conta e caixa físico"
          action={{
            label: 'Ver Extrato',
            onClick: () => onNavigate('fluxo-caixa'),
          }}
        />

        {/* Entradas do Mês */}
        <StatCard
          title="Entradas (Mês)"
          value={formatCurrency(monthIncome, company.currencySymbol)}
          icon={ArrowDownLeft}
          variant="emerald"
          subtitle="Receitas realizadas este mês"
          action={{
            label: '+ Nova',
            onClick: onOpenNewIncome,
          }}
        />

        {/* Saídas do Mês */}
        <StatCard
          title="Saídas (Mês)"
          value={formatCurrency(monthExpense, company.currencySymbol)}
          icon={ArrowUpRight}
          variant="rose"
          subtitle="Despesas pagas no período"
          action={{
            label: '+ Nova',
            onClick: onOpenNewExpense,
          }}
        />

        {/* Lucro / Resultado Líquido */}
        <StatCard
          title="Resultado Líquido"
          value={formatCurrency(monthNet, company.currencySymbol)}
          icon={TrendingUp}
          variant={monthNet >= 0 ? 'purple' : 'rose'}
          trend={{
            value: monthNet >= 0 ? 'Positivo' : 'Negativo',
            isPositive: monthNet >= 0,
            label: '(Receitas - Despesas)',
          }}
        />

        {/* Contas a Pagar Pendentes */}
        <StatCard
          title="Contas a Pagar"
          value={formatCurrency(pendingPayablesTotal, company.currencySymbol)}
          icon={Receipt}
          variant="amber"
          subtitle={overduePayablesCount > 0 ? `${overduePayablesCount} vencidas!` : 'Compromissos pendentes'}
          onClick={() => onNavigate('contas-pagar')}
        />

        {/* Contas a Receber Pendentes */}
        <StatCard
          title="Contas a Receber"
          value={formatCurrency(pendingReceivablesTotal, company.currencySymbol)}
          icon={FileCheck2}
          variant="blue"
          subtitle="Faturas e contratos previstos"
          onClick={() => onNavigate('contas-receber')}
        />
      </div>

      {/* Row 1: Charts (Evolution + Category Distribution) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <BalanceEvolutionAreaChart />
        </div>
        <div className="lg:col-span-5">
          <CategoryPieChart />
        </div>
      </div>

      {/* Row 2: Charts (Monthly Comparison + Payment Methods) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7">
          <CashFlowBarChart />
        </div>
        <div className="lg:col-span-5">
          <PaymentMethodChart />
        </div>
      </div>

      {/* Row 3: Recent Transactions & Upcoming Payables */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Recent Transactions Table */}
        <div className="lg:col-span-8 rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Últimas Movimentações do Caixa
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Lançamentos recentes de entradas e saídas
              </p>
            </div>
            <button
              type="button"
              onClick={() => onNavigate('historico')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300"
            >
              Ver Todas ({transactions.length}) →
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="border-b border-slate-100 text-slate-400 dark:border-slate-800 font-semibold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Data</th>
                  <th className="py-2.5 px-3">Descrição & Contato</th>
                  <th className="py-2.5 px-3">Categoria</th>
                  <th className="py-2.5 px-3">Pagamento</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3 text-right">Valor</th>
                  <th className="py-2.5 px-3 text-center">Anexo</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 font-medium">
                {recentTransactions.map((tx) => {
                  const cat = categoriesMap.get(tx.categoryId);
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3 px-3">
                        <p className="font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                          {tx.description}
                        </p>
                        {tx.entityName && (
                          <span className="text-[11px] text-slate-400">{tx.entityName}</span>
                        )}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          {cat && (
                            <span
                              className="h-2 w-2 rounded-full shrink-0"
                              style={{ backgroundColor: cat.color }}
                            />
                          )}
                          <span className="text-slate-600 dark:text-slate-300 truncate max-w-32">
                            {cat?.name || 'Geral'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono text-slate-500 whitespace-nowrap">
                        {tx.paymentMethod}
                      </td>
                      <td className="py-3 px-3 whitespace-nowrap">
                        <Badge status={tx.status} size="sm" />
                      </td>
                      <td
                        className={`py-3 px-3 text-right font-mono font-bold whitespace-nowrap ${
                          tx.type === 'receita'
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {tx.type === 'receita' ? '+' : '- '}
                        {formatCurrency(tx.amount, company.currencySymbol)}
                      </td>
                      <td className="py-3 px-3 text-center">
                        {tx.attachment ? (
                          <button
                            type="button"
                            onClick={() => setSelectedAttachmentTx(tx)}
                            className="text-emerald-600 hover:text-emerald-700 p-1 rounded-md hover:bg-emerald-50 dark:hover:bg-emerald-950/40"
                            title={tx.attachment.name}
                          >
                            <FileText className="h-4 w-4" />
                          </button>
                        ) : (
                          <span className="text-slate-300 dark:text-slate-600">-</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Upcoming Payables Card */}
        <div className="lg:col-span-4 rounded-2xl bg-white p-5 shadow-xs border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Próximos Vencimentos
              </h3>
              <button
                type="button"
                onClick={() => onNavigate('contas-pagar')}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400"
              >
                Gerenciar →
              </button>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Contas com vencimento imediato ou em atraso
            </p>

            <div className="space-y-3">
              {urgentPayables.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  <CheckCircle2 className="h-8 w-8 text-emerald-500 mx-auto mb-2 opacity-80" />
                  <p>Tudo em dia! Nenhuma conta vencendo nos próximos dias.</p>
                </div>
              ) : (
                urgentPayables.map((bill) => {
                  const daysDiff = getDaysDiff(bill.dueDate);
                  const isOverdue = daysDiff < 0;
                  const isDueToday = daysDiff === 0;

                  return (
                    <div
                      key={bill.id}
                      className={`p-3 rounded-xl border transition-colors flex items-center justify-between gap-3 text-xs ${
                        isOverdue
                          ? 'border-rose-200 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-950/20'
                          : isDueToday
                          ? 'border-amber-200 bg-amber-50/50 dark:border-amber-900/40 dark:bg-amber-950/20'
                          : 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-800/30'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <h5 className="font-bold text-slate-800 dark:text-slate-100 truncate">
                          {bill.description}
                        </h5>
                        <div className="flex items-center gap-2 mt-1 text-[11px]">
                          <span className="text-slate-500 truncate">{bill.supplier}</span>
                          <span
                            className={`font-semibold font-mono ${
                              isOverdue
                                ? 'text-rose-600 dark:text-rose-400'
                                : isDueToday
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-slate-500'
                            }`}
                          >
                            {isOverdue
                              ? `Atrasado há ${Math.abs(daysDiff)}d`
                              : isDueToday
                              ? 'Vence Hoje'
                              : `Vence em ${daysDiff}d`}
                          </span>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <div className="font-bold font-mono text-slate-900 dark:text-white">
                          {formatCurrency(bill.amount, company.currencySymbol)}
                        </div>
                        <button
                          type="button"
                          onClick={() => onOpenPayBill(bill)}
                          className="mt-1 text-[11px] font-bold text-rose-600 hover:text-rose-700 dark:text-rose-400 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 px-2 py-0.5 rounded-lg shadow-2xs"
                        >
                          Quitar
                        </button>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => onNavigate('contas-pagar')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-semibold transition-colors text-center"
            >
              Ver Todas as Contas a Pagar
            </button>
          </div>
        </div>
      </div>

      {/* File Attachment Viewer Modal */}
      {selectedAttachmentTx && (
        <FileViewerModal
          isOpen={!!selectedAttachmentTx}
          onClose={() => setSelectedAttachmentTx(null)}
          attachment={selectedAttachmentTx.attachment}
          description={selectedAttachmentTx.description}
          amountFormatted={formatCurrency(selectedAttachmentTx.amount, company.currencySymbol)}
          entityName={selectedAttachmentTx.entityName}
        />
      )}
    </div>
  );
};
