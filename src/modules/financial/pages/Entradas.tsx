import React, { useState, useMemo } from 'react';
import {
  Plus,
  ArrowDownLeft,
  DollarSign,
  Clock,
  CheckCircle2,
  FileSpreadsheet,
  FileText,
  Copy,
  Edit2,
  Trash2,
  Download,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { StatCard } from '../components/common/StatCard';
import { Badge } from '../components/common/Badge';
import { FilterBar } from '../components/common/FilterBar';
import { TransactionModal } from '../components/modals/TransactionModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { FileViewerModal } from '../components/common/FileViewerModal';
import { formatCurrency, formatDate, exportToCSV, exportToExcel, exportToPDF } from '../utils/formatters';
import { Transaction } from '../types';

export const Entradas: React.FC = () => {
  const {
    transactions,
    categories,
    categoriesMap,
    company,
    deleteTransaction,
    duplicateTransaction,
    toggleTransactionStatus,
    currentUser,
  } = useFinancial();

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('todos');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [viewingAttachmentTx, setViewingAttachmentTx] = useState<Transaction | null>(null);

  // Filter income transactions
  const allIncomes = useMemo(() => {
    return transactions.filter((t: Transaction) => t.type === 'receita');
  }, [transactions]);

  const filteredIncomes = useMemo(() => {
    return allIncomes.filter((tx: Transaction) => {
      // Search
      if (searchTerm) {
        const query = searchTerm.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(query);
        const matchesEntity = (tx.entityName || '').toLowerCase().includes(query);
        const matchesNotes = (tx.notes || '').toLowerCase().includes(query);
        if (!matchesDesc && !matchesEntity && !matchesNotes) return false;
      }

      // Category
      if (selectedCategory !== 'todas' && tx.categoryId !== selectedCategory) {
        return false;
      }

      // Payment method
      if (selectedPaymentMethod !== 'todos' && tx.paymentMethod !== selectedPaymentMethod) {
        return false;
      }

      // Status
      if (selectedStatus !== 'todos' && tx.status !== selectedStatus) {
        return false;
      }

      // Date range
      if (startDate && tx.date < startDate) return false;
      if (endDate && tx.date > endDate) return false;

      return true;
    });
  }, [allIncomes, searchTerm, selectedCategory, selectedPaymentMethod, selectedStatus, startDate, endDate]);

  // Income metrics
  const { totalReceived, totalPending, averageTicket } = useMemo(() => {
    let rec = 0;
    let pend = 0;
    let recCount = 0;

    filteredIncomes.forEach((tx: Transaction) => {
      if (tx.status === 'recebido') {
        rec += tx.amount;
        recCount++;
      } else {
        pend += tx.amount;
      }
    });

    return {
      totalReceived: rec,
      totalPending: pend,
      averageTicket: recCount > 0 ? rec / recCount : 0,
    };
  }, [filteredIncomes]);

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('todas');
    setSelectedPaymentMethod('todos');
    setSelectedStatus('todos');
    setStartDate('');
    setEndDate('');
  };

  const handleExportCSV = () => {
    exportToCSV(filteredIncomes, categoriesMap, 'entradas-receitas.csv');
  };

  const handleExportExcel = () => {
    exportToExcel(filteredIncomes, categoriesMap, company, 'entradas-receitas.xlsx');
  };

  const handleExportPDF = () => {
    exportToPDF(filteredIncomes, categoriesMap, company, 'Relatório de Entradas (Receitas)', 'Entradas Filtradas');
  };

  const isViewer = currentUser.role === 'visualizador';

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">
            Gestão de Entradas & Receitas
          </h2>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400">
            Cadastre e acompanhe todas as vendas, serviços e ingressos de caixa
          </p>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          {/* Export Dropdown / Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={handleExportPDF}
              className="p-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 rounded-lg"
              title="PDF"
            >
              <FileText className="h-4 w-4 text-rose-500" />
            </button>
            <button
              type="button"
              onClick={handleExportExcel}
              className="p-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 rounded-lg"
              title="Excel"
            >
              <FileSpreadsheet className="h-4 w-4 text-emerald-600" />
            </button>
            <button
              type="button"
              onClick={handleExportCSV}
              className="p-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 dark:text-slate-300 rounded-lg"
              title="CSV"
            >
              <Download className="h-4 w-4 text-blue-500" />
            </button>
          </div>

          <button
            type="button"
            disabled={isViewer}
            onClick={() => {
              setEditingTransaction(null);
              setIsModalOpen(true);
            }}
            className={`flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 transition-colors ${
              isViewer ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>Nova Entrada</span>
          </button>
        </div>
      </div>

      {/* KPI Cards (2 columns on mobile) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <StatCard
          title="Total Recebido"
          value={formatCurrency(totalReceived, company.currencySymbol)}
          icon={CheckCircle2}
          variant="emerald"
          subtitle="Valores compensados"
        />

        <StatCard
          title="Entradas Pendentes"
          value={formatCurrency(totalPending, company.currencySymbol)}
          icon={Clock}
          variant="amber"
          subtitle="A receber"
        />

        <StatCard
          title="Total Previsto"
          value={formatCurrency(totalReceived + totalPending, company.currencySymbol)}
          icon={ArrowDownLeft}
          variant="purple"
          subtitle="Recebido + Pendente"
        />

        <StatCard
          title="Ticket Médio"
          value={formatCurrency(averageTicket, company.currencySymbol)}
          icon={DollarSign}
          variant="slate"
          subtitle="Média por venda"
        />
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories.filter((c) => c.type === 'receita')}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={setSelectedPaymentMethod}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
        statusOptions={[
          { value: 'todos', label: 'Todos os status' },
          { value: 'recebido', label: 'Recebido' },
          { value: 'pendente', label: 'Pendente' },
        ]}
        startDate={startDate}
        onStartDateChange={setStartDate}
        endDate={endDate}
        onEndDateChange={setEndDate}
        onResetFilters={handleResetFilters}
        totalCount={allIncomes.length}
        filteredCount={filteredIncomes.length}
        placeholder="Buscar receita ou cliente..."
      />

      {/* Transactions Container */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 uppercase font-semibold text-[10px] tracking-wider">
              <tr>
                <th className="py-3 px-4">Data</th>
                <th className="py-3 px-4">Descrição & Cliente</th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Meio de Pagamento</th>
                <th className="py-3 px-4">Recorrência</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Valor (R$)</th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredIncomes.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <ArrowDownLeft className="h-8 w-8 mx-auto mb-2 opacity-40 text-emerald-500" />
                    <p className="text-sm font-semibold">Nenhuma entrada encontrada</p>
                    <p className="text-xs mt-1">
                      Tente ajustar os filtros ou clique em "+ Nova Entrada" para registrar.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredIncomes.map((tx: Transaction) => {
                  const cat = categoriesMap.get(tx.categoryId);
                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {tx.description}
                        </div>
                        {tx.entityName && (
                          <div className="text-[11px] text-slate-400 font-normal">
                            Cliente: {tx.entityName}
                          </div>
                        )}
                        {tx.notes && (
                          <div className="text-[10px] text-slate-400 italic line-clamp-1">
                            {tx.notes}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat?.color || '#10b981' }}
                          />
                          <span className="text-slate-700 dark:text-slate-300">
                            {cat?.name || 'Vendas'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {tx.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 capitalize text-slate-500 whitespace-nowrap">
                        {tx.recurrence || 'única'}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          disabled={isViewer}
                          onClick={() => toggleTransactionStatus(tx.id)}
                          title="Clique para alternar o status"
                          className={isViewer ? '' : 'cursor-pointer hover:opacity-80'}
                        >
                          <Badge status={tx.status} size="sm" />
                        </button>
                      </td>
                      <td className="py-3.5 px-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 whitespace-nowrap text-sm">
                        + {formatCurrency(tx.amount, company.currencySymbol)}
                      </td>
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          {tx.attachment && (
                            <button
                              type="button"
                              onClick={() => setViewingAttachmentTx(tx)}
                              className="p-1.5 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 rounded-lg transition-colors"
                              title="Ver Comprovante"
                            >
                              <FileText className="h-4 w-4" />
                            </button>
                          )}
                          <button
                            type="button"
                            disabled={isViewer}
                            onClick={() => duplicateTransaction(tx.id)}
                            className="p-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            title="Duplicar Lançamento"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={isViewer}
                            onClick={() => {
                              setEditingTransaction(tx);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-indigo-950/40 rounded-lg transition-colors"
                            title="Editar Entrada"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={isViewer}
                            onClick={() => setDeletingTransaction(tx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Excluir Entrada"
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

        {/* Mobile Card List View */}
        <div className="sm:hidden p-3 space-y-2.5">
          {filteredIncomes.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-xs">
              <ArrowDownLeft className="h-8 w-8 mx-auto mb-2 opacity-40 text-emerald-500" />
              <p className="font-semibold">Nenhuma entrada encontrada</p>
            </div>
          ) : (
            filteredIncomes.map((tx: Transaction) => {
              const cat = categoriesMap.get(tx.categoryId);
              return (
                <div
                  key={tx.id}
                  className="p-3.5 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-2.5 shadow-2xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-xs text-slate-900 dark:text-white leading-tight">
                        {tx.description}
                      </h4>
                      {tx.entityName && (
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                          Cliente: {tx.entityName}
                        </p>
                      )}
                    </div>
                    <div className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400 whitespace-nowrap">
                      + {formatCurrency(tx.amount, company.currencySymbol)}
                    </div>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-2 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center gap-2">
                      <span className="font-mono">{formatDate(tx.date)}</span>
                      <span className="font-mono">• {tx.paymentMethod}</span>
                    </div>
                    <button
                      type="button"
                      disabled={isViewer}
                      onClick={() => toggleTransactionStatus(tx.id)}
                    >
                      <Badge status={tx.status} size="sm" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-1 text-xs">
                    <div className="flex items-center gap-1.5 text-[11px] text-slate-600 dark:text-slate-300">
                      <span
                        className="h-2 w-2 rounded-full shrink-0"
                        style={{ backgroundColor: cat?.color || '#10b981' }}
                      />
                      <span className="truncate max-w-32">{cat?.name || 'Vendas'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      {tx.attachment && (
                        <button
                          type="button"
                          onClick={() => setViewingAttachmentTx(tx)}
                          className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                          title="Ver Comprovante"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                      )}
                      <button
                        type="button"
                        disabled={isViewer}
                        onClick={() => {
                          setEditingTransaction(tx);
                          setIsModalOpen(true);
                        }}
                        className="p-1 text-slate-400 hover:text-indigo-600 rounded"
                      >
                        <Edit2 className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        disabled={isViewer}
                        onClick={() => setDeletingTransaction(tx)}
                        className="p-1 text-slate-400 hover:text-rose-600 rounded"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Transaction Modal (Add / Edit) */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        initialType="receita"
        transactionToEdit={editingTransaction}
      />

      {/* Confirm Delete Dialog */}
      {deletingTransaction && (
        <ConfirmDialog
          isOpen={!!deletingTransaction}
          onClose={() => setDeletingTransaction(null)}
          onConfirm={() => deleteTransaction(deletingTransaction.id)}
          title="Excluir Entrada de Caixa"
          message={`Tem certeza que deseja excluir a entrada "${deletingTransaction.description}" no valor de ${formatCurrency(
            deletingTransaction.amount,
            company.currencySymbol
          )}? Esta ação não pode ser desfeita.`}
          confirmText="Sim, Excluir"
          variant="danger"
        />
      )}

      {/* Attachment Viewer */}
      {viewingAttachmentTx && (
        <FileViewerModal
          isOpen={!!viewingAttachmentTx}
          onClose={() => setViewingAttachmentTx(null)}
          attachment={viewingAttachmentTx.attachment}
          description={viewingAttachmentTx.description}
          amountFormatted={formatCurrency(viewingAttachmentTx.amount, company.currencySymbol)}
          entityName={viewingAttachmentTx.entityName}
        />
      )}
    </div>
  );
};
