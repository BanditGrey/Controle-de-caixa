import React, { useState, useMemo } from 'react';
import {
  History,
  ArrowUpDown,
  Download,
  FileSpreadsheet,
  FileText,
  Copy,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { Badge } from '../components/common/Badge';
import { FilterBar } from '../components/common/FilterBar';
import { TransactionModal } from '../components/modals/TransactionModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { FileViewerModal } from '../components/common/FileViewerModal';
import { formatCurrency, formatDate, exportToCSV, exportToExcel, exportToPDF } from '../utils/formatters';
import { Transaction } from '../types';

export const Historico: React.FC = () => {
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
  const [selectedType, setSelectedType] = useState<'todas' | 'receita' | 'despesa'>('todas');
  const [selectedCategory, setSelectedCategory] = useState('todas');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('todos');
  const [selectedStatus, setSelectedStatus] = useState('todos');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  // Sorting
  const [sortField, setSortField] = useState<'date' | 'amount' | 'description'>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');

  // Pagination
  const [currentPageNum, setCurrentPageNum] = useState(1);
  const [pageSize, setPageSize] = useState(15);

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [deletingTransaction, setDeletingTransaction] = useState<Transaction | null>(null);
  const [viewingAttachmentTx, setViewingAttachmentTx] = useState<Transaction | null>(null);

  // Filtered transactions
  const filtered = useMemo(() => {
    return transactions.filter((tx: Transaction) => {
      // Type
      if (selectedType !== 'todas' && tx.type !== selectedType) return false;

      // Search
      if (searchTerm) {
        const q = searchTerm.toLowerCase();
        const matchesDesc = tx.description.toLowerCase().includes(q);
        const matchesEntity = (tx.entityName || '').toLowerCase().includes(q);
        const matchesNotes = (tx.notes || '').toLowerCase().includes(querySafe(q));
        if (!matchesDesc && !matchesEntity && !matchesNotes) return false;
      }

      // Category
      if (selectedCategory !== 'todas' && tx.categoryId !== selectedCategory) return false;

      // Payment method
      if (selectedPaymentMethod !== 'todos' && tx.paymentMethod !== selectedPaymentMethod) return false;

      // Status
      if (selectedStatus !== 'todos' && tx.status !== selectedStatus) return false;

      // Date range
      if (startDate && tx.date < startDate) return false;
      if (endDate && tx.date > endDate) return false;

      return true;
    });
  }, [transactions, selectedType, searchTerm, selectedCategory, selectedPaymentMethod, selectedStatus, startDate, endDate]);

  function querySafe(q: string) {
    return q.toLowerCase();
  }

  // Sorted
  const sorted = useMemo(() => {
    return [...filtered].sort((a: Transaction, b: Transaction) => {
      if (sortField === 'date') {
        const diff = new Date(a.date).getTime() - new Date(b.date).getTime();
        return sortDirection === 'asc' ? diff : -diff;
      }
      if (sortField === 'amount') {
        return sortDirection === 'asc' ? a.amount - b.amount : b.amount - a.amount;
      }
      if (sortField === 'description') {
        return sortDirection === 'asc'
          ? a.description.localeCompare(b.description)
          : b.description.localeCompare(a.description);
      }
      return 0;
    });
  }, [filtered, sortField, sortDirection]);

  // Paginated
  const totalPages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const paginatedTransactions = useMemo(() => {
    const start = (currentPageNum - 1) * pageSize;
    return sorted.slice(start, start + pageSize);
  }, [sorted, currentPageNum, pageSize]);

  const handleSort = (field: 'date' | 'amount' | 'description') => {
    if (sortField === field) {
      setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedType('todas');
    setSelectedCategory('todas');
    setSelectedPaymentMethod('todos');
    setSelectedStatus('todos');
    setStartDate('');
    setEndDate('');
    setCurrentPageNum(1);
  };

  const isViewer = currentUser.role === 'visualizador';

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Histórico & Extrato Unificado
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Pesquisa detalhada e filtros multicritério de todas as operações de caixa
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* Type Filter Buttons */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              type="button"
              onClick={() => {
                setSelectedType('todas');
                setCurrentPageNum(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedType === 'todas'
                  ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                  : 'text-slate-600 dark:text-slate-400'
              }`}
            >
              Todas
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedType('receita');
                setCurrentPageNum(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedType === 'receita'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-600 dark:text-emerald-400'
              }`}
            >
              Entradas
            </button>
            <button
              type="button"
              onClick={() => {
                setSelectedType('despesa');
                setCurrentPageNum(1);
              }}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                selectedType === 'despesa'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 dark:text-rose-400'
              }`}
            >
              Saídas
            </button>
          </div>

          {/* Export tools */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => exportToPDF(sorted, categoriesMap, company, 'Extrato Completo de Caixa', 'Extrato Geral')}
              className="p-1.5 text-rose-500 hover:bg-white dark:hover:bg-slate-700 rounded-lg"
              title="Exportar PDF"
            >
              <FileText className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => exportToExcel(sorted, categoriesMap, company, 'extrato-geral.xlsx')}
              className="p-1.5 text-emerald-600 hover:bg-white dark:hover:bg-slate-700 rounded-lg"
              title="Exportar Excel"
            >
              <FileSpreadsheet className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => exportToCSV(sorted, categoriesMap, 'extrato-geral.csv')}
              className="p-1.5 text-blue-500 hover:bg-white dark:hover:bg-slate-700 rounded-lg"
              title="Exportar CSV"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <FilterBar
        searchTerm={searchTerm}
        onSearchChange={(val: string) => {
          setSearchTerm(val);
          setCurrentPageNum(1);
        }}
        selectedCategory={selectedCategory}
        onCategoryChange={(val: string) => {
          setSelectedCategory(val);
          setCurrentPageNum(1);
        }}
        categories={categories}
        selectedPaymentMethod={selectedPaymentMethod}
        onPaymentMethodChange={(val: string) => {
          setSelectedPaymentMethod(val);
          setCurrentPageNum(1);
        }}
        selectedStatus={selectedStatus}
        onStatusChange={(val: string) => {
          setSelectedStatus(val);
          setCurrentPageNum(1);
        }}
        startDate={startDate}
        onStartDateChange={(val: string) => {
          setStartDate(val);
          setCurrentPageNum(1);
        }}
        endDate={endDate}
        onEndDateChange={(val: string) => {
          setEndDate(val);
          setCurrentPageNum(1);
        }}
        onResetFilters={handleResetFilters}
        totalCount={transactions.length}
        filteredCount={filtered.length}
        placeholder="Buscar em todo o histórico financeiro..."
      />

      {/* Transactions Table Card */}
      <div className="rounded-2xl border border-slate-200/80 bg-white shadow-xs dark:border-slate-800 dark:bg-slate-900 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-slate-100 bg-slate-50/70 text-slate-500 dark:border-slate-800 dark:bg-slate-800/40 uppercase font-semibold text-[10px] tracking-wider select-none">
              <tr>
                <th
                  onClick={() => handleSort('date')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Data</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Tipo</th>
                <th
                  onClick={() => handleSort('description')}
                  className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center gap-1">
                    <span>Descrição & Contato</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4">Categoria</th>
                <th className="py-3 px-4">Pagamento</th>
                <th className="py-3 px-4">Status</th>
                <th
                  onClick={() => handleSort('amount')}
                  className="py-3 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white"
                >
                  <div className="flex items-center justify-end gap-1">
                    <span>Valor (R$)</span>
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-4 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-slate-400">
                    <History className="h-8 w-8 mx-auto mb-2 opacity-40" />
                    <p className="text-sm font-semibold">Nenhuma movimentação encontrada</p>
                    <p className="text-xs mt-1">Ajuste os filtros de pesquisa para visualizar os dados.</p>
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((tx: Transaction) => {
                  const cat = categoriesMap.get(tx.categoryId);
                  const isIncome = tx.type === 'receita';

                  return (
                    <tr
                      key={tx.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors group"
                    >
                      <td className="py-3.5 px-4 font-mono text-slate-500 whitespace-nowrap">
                        {formatDate(tx.date)}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <Badge status={tx.type} size="sm" />
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 dark:text-white">
                          {tx.description}
                        </div>
                        {tx.entityName && (
                          <div className="text-[11px] text-slate-400 font-normal">
                            {isIncome ? 'Cliente: ' : 'Fornecedor: '}
                            {tx.entityName}
                          </div>
                        )}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <span
                            className="h-2.5 w-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: cat?.color || '#64748b' }}
                          />
                          <span className="text-slate-700 dark:text-slate-300">
                            {cat?.name || 'Geral'}
                          </span>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono text-slate-600 dark:text-slate-300 whitespace-nowrap">
                        {tx.paymentMethod}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <button
                          type="button"
                          disabled={isViewer}
                          onClick={() => toggleTransactionStatus(tx.id)}
                          title="Alternar Status"
                        >
                          <Badge status={tx.status} size="sm" />
                        </button>
                      </td>
                      <td
                        className={`py-3.5 px-4 text-right font-mono font-bold whitespace-nowrap text-sm ${
                          isIncome
                            ? 'text-emerald-600 dark:text-emerald-400'
                            : 'text-rose-600 dark:text-rose-400'
                        }`}
                      >
                        {isIncome ? '+ ' : '- '}
                        {formatCurrency(tx.amount, company.currencySymbol)}
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
                            title="Duplicar"
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
                            title="Editar"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            type="button"
                            disabled={isViewer}
                            onClick={() => setDeletingTransaction(tx)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
                            title="Excluir"
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

        {/* Pagination Footer */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 dark:border-slate-800 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <span>Linhas por página:</span>
            <select
              value={pageSize}
              onChange={(e) => {
                setPageSize(Number(e.target.value));
                setCurrentPageNum(1);
              }}
              className="rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 py-1 px-2 text-xs text-slate-700 dark:text-slate-200"
            >
              <option value={10}>10</option>
              <option value={15}>15</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
            <span>
              (Página {currentPageNum} de {totalPages})
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPageNum <= 1}
              onClick={() => setCurrentPageNum((p) => p - 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <span className="font-bold text-slate-800 dark:text-slate-200 px-2 font-mono">
              {currentPageNum} / {totalPages}
            </span>
            <button
              type="button"
              disabled={currentPageNum >= totalPages}
              onClick={() => setCurrentPageNum((p) => p + 1)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-700 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Transaction Modal (Add / Edit) */}
      <TransactionModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingTransaction(null);
        }}
        transactionToEdit={editingTransaction}
      />

      {/* Confirm Delete */}
      {deletingTransaction && (
        <ConfirmDialog
          isOpen={!!deletingTransaction}
          onClose={() => setDeletingTransaction(null)}
          onConfirm={() => deleteTransaction(deletingTransaction.id)}
          title="Excluir Movimentação"
          message={`Tem certeza que deseja excluir "${deletingTransaction.description}"?`}
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
