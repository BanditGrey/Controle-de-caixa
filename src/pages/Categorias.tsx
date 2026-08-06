import React, { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Trash2,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { CategoryIcon } from '../components/common/CategoryIcon';
import { CategoryModal } from '../components/modals/CategoryModal';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { formatCurrency } from '../utils/formatters';
import { Category, TransactionType } from '../types';

export const Categorias: React.FC = () => {
  const { categories, transactions, company, deleteCategory, currentUser } = useFinancial();

  const [activeTab, setActiveTab] = useState<'todas' | 'receita' | 'despesa'>('todas');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [deletingCategory, setDeletingCategory] = useState<Category | null>(null);
  const [newCatType, setNewCatType] = useState<TransactionType>('despesa');

  // Calculate monthly stats per category
  const categoryStats = useMemo(() => {
    const today = new Date();
    const curMonth = today.getMonth();
    const curYear = today.getFullYear();

    const stats = new Map<string, { totalAmount: number; count: number }>();

    transactions.forEach((tx: any) => {
      if (tx.status === 'recebido' || tx.status === 'pago') {
        const txDate = new Date(tx.date + 'T00:00:00');
        if (txDate.getMonth() === curMonth && txDate.getFullYear() === curYear) {
          const cur = stats.get(tx.categoryId) || { totalAmount: 0, count: 0 };
          cur.totalAmount += tx.amount;
          cur.count += 1;
          stats.set(tx.categoryId, cur);
        }
      }
    });

    return stats;
  }, [transactions]);

  const filteredCategories = useMemo(() => {
    if (activeTab === 'todas') return categories;
    return categories.filter((c: Category) => c.type === activeTab);
  }, [categories, activeTab]);

  const isViewer = currentUser.role === 'visualizador';

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">
            Categorias & Centros de Custo
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Organize suas receitas e despesas com limites orçamentários mensais
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={isViewer}
            onClick={() => {
              setEditingCategory(null);
              setNewCatType('receita');
              setIsModalOpen(true);
            }}
            className={`flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 transition-colors ${
              isViewer ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>+ Categoria de Receita</span>
          </button>

          <button
            type="button"
            disabled={isViewer}
            onClick={() => {
              setEditingCategory(null);
              setNewCatType('despesa');
              setIsModalOpen(true);
            }}
            className={`flex items-center gap-1.5 rounded-xl bg-rose-600 px-3.5 py-2.5 text-xs font-bold text-white shadow-xs hover:bg-rose-700 active:bg-rose-800 transition-colors ${
              isViewer ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            <Plus className="h-4 w-4" />
            <span>+ Categoria de Despesa</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 p-1 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl w-fit text-xs font-semibold">
        <button
          type="button"
          onClick={() => setActiveTab('todas')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'todas'
              ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-bold shadow-2xs'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Todas ({categories.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('receita')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'receita'
              ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Receitas ({categories.filter((c: any) => c.type === 'receita').length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('despesa')}
          className={`px-4 py-2 rounded-xl transition-all ${
            activeTab === 'despesa'
              ? 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 font-bold'
              : 'text-slate-500 hover:text-slate-900 dark:text-slate-400'
          }`}
        >
          Despesas ({categories.filter((c: any) => c.type === 'despesa').length})
        </button>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredCategories.map((cat: Category) => {
          const stats = categoryStats.get(cat.id) || { totalAmount: 0, count: 0 };
          const isExpense = cat.type === 'despesa';
          const hasBudget = isExpense && cat.budgetLimit && cat.budgetLimit > 0;
          const budgetPercent = hasBudget ? (stats.totalAmount / cat.budgetLimit!) * 100 : 0;
          const isOverBudget = hasBudget && stats.totalAmount > cat.budgetLimit!;

          return (
            <div
              key={cat.id}
              className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-xs dark:border-slate-800 dark:bg-slate-900 flex flex-col justify-between hover:border-slate-400 dark:hover:border-slate-700 transition-all group"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-xs"
                      style={{ backgroundColor: cat.color }}
                    >
                      <CategoryIcon name={cat.icon} size={20} className="text-white" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-slate-900 dark:text-white truncate text-sm">
                        {cat.name}
                      </h4>
                      <span
                        className={`inline-block text-[10px] font-semibold uppercase tracking-wider font-mono ${
                          isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isExpense ? 'Despesa' : 'Receita'}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      disabled={isViewer}
                      onClick={() => {
                        setEditingCategory(cat);
                        setIsModalOpen(true);
                      }}
                      className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Editar Categoria"
                    >
                      <Edit2 className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      disabled={isViewer}
                      onClick={() => setDeletingCategory(cat)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                      title="Excluir Categoria"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>

                {cat.description && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {cat.description}
                  </p>
                )}

                {/* Amount in Current Month */}
                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                  <span className="text-slate-500">Mês Corrente:</span>
                  <span
                    className={`font-mono font-bold text-sm ${
                      isExpense ? 'text-rose-600 dark:text-rose-400' : 'text-emerald-600 dark:text-emerald-400'
                    }`}
                  >
                    {isExpense ? '- ' : '+ '}
                    {formatCurrency(stats.totalAmount, company.currencySymbol)}
                  </span>
                </div>

                {/* Budget Limit Progress Bar if set */}
                {hasBudget && (
                  <div className="mt-3 space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] font-mono">
                      <span className="text-slate-500">Teto Orçado:</span>
                      <span className="font-semibold text-slate-800 dark:text-slate-200">
                        {formatCurrency(cat.budgetLimit!, company.currencySymbol)}
                      </span>
                    </div>

                    <div className="h-2 w-full rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          isOverBudget
                            ? 'bg-rose-500'
                            : budgetPercent > 80
                            ? 'bg-amber-500'
                            : 'bg-emerald-500'
                        }`}
                        style={{ width: `${Math.min(budgetPercent, 100)}%` }}
                      />
                    </div>

                    <div className="flex items-center justify-between text-[10px]">
                      <span
                        className={`font-semibold ${
                          isOverBudget
                            ? 'text-rose-600 dark:text-rose-400'
                            : budgetPercent > 80
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-emerald-600 dark:text-emerald-400'
                        }`}
                      >
                        {isOverBudget
                          ? `Estourou em ${(budgetPercent - 100).toFixed(0)}%`
                          : `${budgetPercent.toFixed(0)}% utilizado`}
                      </span>
                      <span className="text-slate-400 font-mono">
                        {stats.count} lançamento(s)
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Category Modal (Add / Edit) */}
      <CategoryModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingCategory(null);
        }}
        categoryToEdit={editingCategory}
        initialType={newCatType}
      />

      {/* Confirm Delete */}
      {deletingCategory && (
        <ConfirmDialog
          isOpen={!!deletingCategory}
          onClose={() => setDeletingCategory(null)}
          onConfirm={() => deleteCategory(deletingCategory.id)}
          title="Excluir Categoria"
          message={`Tem certeza que deseja excluir a categoria "${deletingCategory.name}"?`}
          confirmText="Sim, Excluir"
          variant="danger"
        />
      )}
    </div>
  );
};
