import React from 'react';
import { Search, Filter, X, Calendar, DollarSign, Tag, CreditCard } from 'lucide-react';
import { Category, PaymentMethod } from '../../types';

interface FilterBarProps {
  searchTerm: string;
  onSearchChange: (val: string) => void;
  selectedCategory?: string;
  onCategoryChange?: (val: string) => void;
  categories?: Category[];
  selectedPaymentMethod?: string;
  onPaymentMethodChange?: (val: string) => void;
  selectedStatus?: string;
  onStatusChange?: (val: string) => void;
  startDate?: string;
  onStartDateChange?: (val: string) => void;
  endDate?: string;
  onEndDateChange?: (val: string) => void;
  minValue?: string;
  onMinValueChange?: (val: string) => void;
  maxValue?: string;
  onMaxValueChange?: (val: string) => void;
  onResetFilters: () => void;
  totalCount: number;
  filteredCount: number;
  placeholder?: string;
  statusOptions?: { value: string; label: string }[];
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories = [],
  selectedPaymentMethod,
  onPaymentMethodChange,
  selectedStatus,
  onStatusChange,
  startDate,
  onStartDateChange,
  endDate,
  onEndDateChange,
  minValue,
  onMinValueChange,
  maxValue,
  onMaxValueChange,
  onResetFilters,
  totalCount,
  filteredCount,
  placeholder = 'Buscar por descrição, cliente ou fornecedor...',
  statusOptions,
}) => {
  const [showAdvanced, setShowAdvanced] = React.useState(false);

  const hasActiveFilters =
    searchTerm ||
    (selectedCategory && selectedCategory !== 'todas') ||
    (selectedPaymentMethod && selectedPaymentMethod !== 'todos') ||
    (selectedStatus && selectedStatus !== 'todos') ||
    startDate ||
    endDate ||
    minValue ||
    maxValue;

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-xs dark:border-slate-800 dark:bg-slate-900 space-y-3">
      {/* Top Search & Quick Toggle */}
      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={placeholder}
            className="w-full rounded-xl border border-slate-300 bg-slate-50/50 py-2.5 pl-10 pr-4 text-xs text-slate-900 focus:border-emerald-500 focus:bg-white focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800/60 dark:text-white dark:focus:bg-slate-800"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <button
            type="button"
            onClick={() => setShowAdvanced(!showAdvanced)}
            className={`flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-xs font-semibold transition-colors ${
              showAdvanced || hasActiveFilters
                ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            <Filter className="h-3.5 w-3.5" />
            <span>Filtros Avançados</span>
            {hasActiveFilters && (
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
            )}
          </button>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={onResetFilters}
              className="flex items-center gap-1 text-xs text-rose-500 hover:text-rose-600 font-medium px-2 py-1"
            >
              <X className="h-3.5 w-3.5" />
              Limpar
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel */}
      {showAdvanced && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-3 border-t border-slate-100 dark:border-slate-800 text-xs">
          {/* Category Filter */}
          {onCategoryChange && categories.length > 0 && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Categoria
              </label>
              <select
                value={selectedCategory || 'todas'}
                onChange={(e) => onCategoryChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="todas">Todas as categorias</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Payment Method Filter */}
          {onPaymentMethodChange && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Forma de Pagamento
              </label>
              <select
                value={selectedPaymentMethod || 'todos'}
                onChange={(e) => onPaymentMethodChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="todos">Todos os meios</option>
                <option value="PIX">PIX</option>
                <option value="Cartão de Crédito">Cartão de Crédito</option>
                <option value="Cartão de Débito">Cartão de Débito</option>
                <option value="Boleto">Boleto</option>
                <option value="Dinheiro">Dinheiro</option>
                <option value="Transferência TED">Transferência TED</option>
              </select>
            </div>
          )}

          {/* Status Filter */}
          {onStatusChange && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Status
              </label>
              <select
                value={selectedStatus || 'todos'}
                onChange={(e) => onStatusChange(e.target.value)}
                className="w-full rounded-xl border border-slate-300 bg-white px-3 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              >
                <option value="todos">Todos os status</option>
                {statusOptions ? (
                  statusOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))
                ) : (
                  <>
                    <option value="recebido">Recebido / Pago</option>
                    <option value="pendente">Pendente</option>
                    <option value="vencido">Vencido</option>
                  </>
                )}
              </select>
            </div>
          )}

          {/* Date range filters */}
          {onStartDateChange && onEndDateChange && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 dark:text-slate-400 mb-1">
                Data Inicial / Final
              </label>
              <div className="grid grid-cols-2 gap-1.5">
                <input
                  type="date"
                  value={startDate || ''}
                  onChange={(e) => onStartDateChange(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-[11px] text-slate-900 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
                <input
                  type="date"
                  value={endDate || ''}
                  onChange={(e) => onEndDateChange(e.target.value)}
                  className="rounded-xl border border-slate-300 bg-white px-2 py-1.5 text-[11px] text-slate-900 focus:border-emerald-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Results Count Line */}
      <div className="flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400 pt-1">
        <span>
          Mostrando <strong className="text-slate-800 dark:text-slate-200">{filteredCount}</strong> de{' '}
          {totalCount} registros
        </span>
        {filteredCount < totalCount && (
          <span className="text-amber-600 dark:text-amber-400 font-medium">
            (Filtros ativos aplicados)
          </span>
        )}
      </div>
    </div>
  );
};
