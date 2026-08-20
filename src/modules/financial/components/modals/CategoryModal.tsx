import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Category, TransactionType } from '../../types';
import { useFinancial } from '../../context/FinancialContext';
import { CategoryIcon, AVAILABLE_CATEGORY_ICONS } from '../common/CategoryIcon';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  categoryToEdit?: Category | null;
  initialType?: TransactionType;
}

const COLOR_PALETTE = [
  '#10b981', // Emerald
  '#06b6d4', // Cyan
  '#3b82f6', // Blue
  '#6366f1', // Indigo
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#ef4444', // Red
  '#f97316', // Orange
  '#eab308', // Yellow
  '#84cc16', // Lime
  '#14b8a6', // Teal
  '#64748b', // Slate
];

export const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  categoryToEdit,
  initialType = 'despesa',
}) => {
  const { addCategory, updateCategory, currentUser } = useFinancial();

  const [name, setName] = useState('');
  const [type, setType] = useState<TransactionType>(initialType);
  const [color, setColor] = useState(COLOR_PALETTE[0]);
  const [icon, setIcon] = useState('ShoppingBag');
  const [budgetLimitStr, setBudgetLimitStr] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (categoryToEdit) {
      setName(categoryToEdit.name);
      setType(categoryToEdit.type);
      setColor(categoryToEdit.color);
      setIcon(categoryToEdit.icon);
      setBudgetLimitStr(categoryToEdit.budgetLimit ? categoryToEdit.budgetLimit.toString() : '');
      setDescription(categoryToEdit.description || '');
    } else {
      setName('');
      setType(initialType);
      setColor(initialType === 'receita' ? '#10b981' : '#ef4444');
      setIcon(initialType === 'receita' ? 'ShoppingBag' : 'Truck');
      setBudgetLimitStr('');
      setDescription('');
    }
  }, [categoryToEdit, initialType, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const budgetLimit = budgetLimitStr ? parseFloat(budgetLimitStr.replace(',', '.')) : undefined;

    const payload = {
      name: name.trim(),
      type,
      color,
      icon,
      budgetLimit: budgetLimit && !isNaN(budgetLimit) ? budgetLimit : undefined,
      description: description.trim(),
    };

    if (categoryToEdit) {
      updateCategory(categoryToEdit.id, payload);
    } else {
      addCategory(payload);
    }

    onClose();
  };

  const isViewer = currentUser.role === 'visualizador';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={categoryToEdit ? 'Editar Categoria Financeira' : 'Nova Categoria Financeira'}
      subtitle="Defina o nome, cor e ícone para classificar seus lançamentos"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type selector */}
        {!categoryToEdit && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => {
                setType('receita');
                setColor('#10b981');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'receita'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Categoria de Receita
            </button>
            <button
              type="button"
              onClick={() => {
                setType('despesa');
                setColor('#ef4444');
              }}
              className={`py-2 rounded-lg text-xs font-bold transition-all ${
                type === 'despesa'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300'
              }`}
            >
              Categoria de Despesa
            </button>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Nome da Categoria *
          </label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ex: Consultoria Técnica, Aluguel, Combustível..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {type === 'despesa' && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Limite de Gasto / Orçamento Mensal (R$ Opcional)
            </label>
            <input
              type="number"
              step="0.01"
              value={budgetLimitStr}
              onChange={(e) => setBudgetLimitStr(e.target.value)}
              placeholder="Ex: 3500.00"
              className="w-full font-mono rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-indigo-500 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
            <p className="text-[11px] text-slate-400 mt-1">
              Se preenchido, o sistema alertará quando os gastos ultrapassarem esse limite.
            </p>
          </div>
        )}

        {/* Color Picker Palette */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Cor de Destaque
          </label>
          <div className="flex flex-wrap gap-2">
            {COLOR_PALETTE.map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setColor(c)}
                className={`h-7 w-7 rounded-full transition-transform ${
                  color === c ? 'scale-110 ring-2 ring-offset-2 ring-slate-900 dark:ring-white' : 'hover:scale-105'
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>

        {/* Icon Picker Grid */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
            Ícone Representativo
          </label>
          <div className="grid grid-cols-6 sm:grid-cols-9 gap-2 max-h-36 overflow-y-auto p-2 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-950">
            {AVAILABLE_CATEGORY_ICONS.map((ic) => (
              <button
                key={ic}
                type="button"
                onClick={() => setIcon(ic)}
                className={`flex h-9 w-9 items-center justify-center rounded-lg transition-all ${
                  icon === ic
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <CategoryIcon name={ic} size={16} />
              </button>
            ))}
          </div>
        </div>

        {/* Preview Card */}
        <div className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex items-center gap-3">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-xl text-white font-bold"
            style={{ backgroundColor: color }}
          >
            <CategoryIcon name={icon} size={20} className="text-white" />
          </div>
          <div>
            <span className="text-xs text-slate-400">Prévia da Categoria</span>
            <h5 className="text-sm font-bold text-slate-900 dark:text-white">
              {name || 'Nome da Categoria'}
            </h5>
          </div>
        </div>

        <div className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={isViewer}
            className={`px-5 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors ${
              isViewer ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {categoryToEdit ? 'Salvar Categoria' : 'Criar Categoria'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
