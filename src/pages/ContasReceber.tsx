import React, { useState, useMemo } from 'react';
import {
  Plus,
  FileCheck2,
  AlertTriangle,
  Clock,
  CheckCircle2,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { BillReceivableModal } from '../components/modals/BillReceivableModal';
import { SettleModal } from '../components/modals/SettleModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatCurrency, formatDate, getDaysDiff } from '../utils/formatters';
import { AccountReceivable } from '../types';

export const ContasReceber: React.FC = () => {
  const {
    accountsReceivable,
    categoriesMap,
    company,
    deleteAccountReceivable,
    currentUser,
  } = useFinancial();

  const [activeTab, setActiveTab] = useState<'todas' | 'pendentes' | 'hoje' | 'vencidas' | 'recebidas'>('todas');
  const [searchTerm, setSearchTerm] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBill, setEditingBill] = useState<AccountReceivable | null>(null);
  const [settlingBill, setSettlingBill] = useState<AccountReceivable | null>(null);
  const [deletingBill, setDeletingBill] = useState<AccountReceivable | null>(null);

  // Metrics
  const { totalToReceive, totalOverdue, totalReceivedThisMonth, dueNext7Days } = useMemo(() => {
    let toRec = 0;
    let overdue = 0;
    let rec = 0;
    let next7 = 0;

    accountsReceivable.forEach((b: AccountReceivable) => {
      const remaining = b.amount - (b.receivedAmount || 0);
      if (b.status === 'pendente' || b.status === 'vencido' || b.status === 'parcial') {
        toRec += remaining;
        const diff = getDaysDiff(b.dueDate);
        if (diff < 0) overdue += remaining;
        if (diff >= 0 && diff <= 7) next7 += remaining;
      } else if (b.status === 'recebido') {
        rec += b.amount;
      }
    });

    return {
      totalToReceive: toRec,
      totalOverdue: overdue,
      totalReceivedThisMonth: rec,
      dueNext7Days: next7,
    };
  }, [accountsReceivable]);

  // Filter accounts
  const filteredBills = useMemo(() => {
    return accountsReceivable.filter((bill: AccountReceivable) => {
      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesDesc = bill.description.toLowerCase().includes(q);
        const matchesClient = bill.client.toLowerCase().includes(q);
        if (!matchesDesc && !matchesClient) return false;
      }

      // Tab filter
      const diff = getDaysDiff(bill.dueDate);
      if (activeTab === 'pendentes') {
        return bill.status === 'pendente' || bill.status === 'parcial';
      }
      if (activeTab === 'hoje') {
        return (bill.status === 'pendente' || bill.status === 'parcial') && diff === 0;
      }
      if (activeTab === 'vencidas') {
        return (bill.status === 'pendente' || bill.status === 'vencido' || bill.status === 'parcial') && diff < 0;
      }
      if (activeTab === 'recebidas') {
        return bill.status === 'recebido';
      }

      return true;
    });
  }, [accountsReceivable, searchTerm, activeTab]);

  const isViewer = currentUser.role === 'visualizador';

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Contas a Receber & Cobranças
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Acompanhe faturamento futuro, contratos mensais e quitação de recebimentos
          </p>
        </div>

        <button
          type="button"
          disabled={isViewer}
          onClick={() => {
            setEditingBill(null);
            setIsModalOpen(true);
          }}
          className={`flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 transition-colors ${
            isViewer ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          <Plus className="h-4 w-4" />
          <span>Nova Conta a Receber</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total a Receber (Em Aberto)"
          value={formatCurrency(totalToReceive, company.currencySymbol)}
          icon={FileCheck2}
          variant="blue"
          subtitle="Receitas previstas a compensar"
        />

        <StatCard
          title="Em Atraso / Inadimplência"
          value={formatCurrency(totalOverdue, company.currencySymbol)}
          icon={AlertTriangle}
          variant={totalOverdue > 0 ? 'rose' : 'slate'}
          subtitle={totalOverdue > 0 ? 'Cobrança pendente de clientes' : 'Sem atrasos registrados'}
        />

        <StatCard
          title="Previsão para 7 Dias"
          value={formatCurrency(dueNext7Days, company.currencySymbol)}
          icon={Clock}
          variant="amber"
          subtitle="Entradas esperadas na semana"
        />

        <StatCard
          title="Total Recebido (Mês)"
          value={formatCurrency(totalReceivedThisMonth, company.currencySymbol)}
          icon={CheckCircle2}
          variant="emerald"
          subtitle="Títulos compensados"
        />
      </div>

      {/* Status Navigation Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-slate-200/80 dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('todas')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'todas'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Todas ({accountsReceivable.length})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pendentes')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'pendentes'
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pendentes
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('hoje')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'hoje'
                ? 'bg-amber-500 text-white shadow-xs'
                : 'text-amber-600 dark:text-amber-400'
            }`}
          >
            Vencendo Hoje
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('vencidas')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'vencidas'
                ? 'bg-rose-500 text-white shadow-xs'
                : 'text-rose-600 dark:text-rose-400'
            }`}
          >
            Em Atraso
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('recebidas')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'recebidas'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'text-emerald-600 dark:text-emerald-400'
            }`}
          >
            Recebidas
          </button>
        </div>

        <div className="w-full sm:w-64">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Filtrar por cliente ou contrato..."
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2 px-3 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>
      </div>

      {/* Receivables Table Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Vencimento / Previsão</th>
                <th className="py-3 px-4">Descrição & Cliente</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Recorrência</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Valor</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredBills.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    <FileCheck2 className="h-8 w-8 mx-auto mb-2 opacity-40 text-emerald-500" />
                    <p className="text-sm font-semibold">Nenhuma conta a receber encontrada</p>
                    <p className="text-xs mt-1">Nenhum registro para a aba selecionada.</p>
                  </td>
                </tr>
              ) : (
                filteredBills.map((bill: AccountReceivable) => {
                  const cat = categoriesMap.get(bill.categoryId);
                  const diff = getDaysDiff(bill.dueDate);
                  const isReceived = bill.status === 'recebido';
                  const isOverdue = !isReceived && diff < 0;
                  const isDueToday = !isReceived && diff === 0;

                  return (
                    <tr
                      key={bill.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      {/* Due Date */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-mono font-bold text-slate-800 dark:text-slate-200">
                          {formatDate(bill.dueDate)}
                        </div>
                        {!isReceived && (
                          <span
                            className={`text-[10px] font-semibold ${
                              isOverdue
                                ? 'text-rose-600 dark:text-rose-400'
                                : isDueToday
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-slate-400'
                            }`}
                          >
                            {isOverdue
                              ? `Atrasado há ${Math.abs(diff)}d`
                              : isDueToday
                              ? 'Vence Hoje!'
                              : `Em ${diff} dias`}
                          </span>
                        )}
                        {isReceived && bill.receivedDate && (
                          <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono">
                            Recebido em {formatDate(bill.receivedDate)}
                          </span>
                        )}
                      </td>

                      {/* Description & Client */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {bill.description}
                        </div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          Cliente: {bill.client}
                        </div>
                        {bill.notes && (
                          <div className="text-[10px] text-slate-400 italic">{bill.notes}</div>
                        )}
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat?.color || '#10b981' }}
                          />
                          <span className="text-slate-700 dark:text-slate-300">
                            {cat?.name || 'Receitas'}
                          </span>
                        </div>
                      </td>

                      {/* Recurrence */}
                      <td className="py-3.5 px-4 capitalize text-slate-500 whitespace-nowrap">
                        {bill.recurrence || 'única'}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge
                          status={isOverdue ? 'vencido' : bill.status}
                          size="sm"
                        />
                      </td>

                      {/* Amount */}
                      <td className="py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap">
                        <div className="text-sm text-emerald-600 dark:text-emerald-400">
                          + {formatCurrency(bill.amount, company.currencySymbol)}
                        </div>
                        {bill.receivedAmount && bill.receivedAmount < bill.amount && (
                          <div className="text-[10px] text-slate-400">
                            Compensado: {formatCurrency(bill.receivedAmount, company.currencySymbol)}
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          {!isReceived && (
                            <button
                              type="button"
                              disabled={isViewer}
                              onClick={() => setSettlingBill(bill)}
                              className={`flex items-center gap-1 px-2.5 py-1 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-lg shadow-2xs transition-colors ${
                                isViewer ? 'opacity-50 cursor-not-allowed' : ''
                              }`}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              <span>Receber</span>
                            </button>
                          )}

                          <button
                            type="button"
                            disabled={isViewer}
                            onClick={() => {
                              setEditingBill(bill);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                            title="Editar Conta"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>

                          <button
                            type="button"
                            disabled={isViewer}
                            onClick={() => setDeletingBill(bill)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Excluir Conta"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bill Receivable Modal (Add / Edit) */}
      <BillReceivableModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingBill(null);
        }}
        billToEdit={editingBill}
      />

      {/* Settle Modal */}
      {settlingBill && (
        <SettleModal
          isOpen={!!settlingBill}
          onClose={() => setSettlingBill(null)}
          bill={settlingBill}
          type="receber"
        />
      )}

      {/* Confirm Delete */}
      {deletingBill && (
        <ConfirmDialog
          isOpen={!!deletingBill}
          onClose={() => setDeletingBill(null)}
          onConfirm={() => deleteAccountReceivable(deletingBill.id)}
          title="Excluir Conta a Receber"
          message={`Tem certeza que deseja remover a conta "${deletingBill.description}" do cliente ${deletingBill.client}?`}
          confirmText="Sim, Excluir"
          variant="danger"
        />
      )}
    </div>
  );
};
