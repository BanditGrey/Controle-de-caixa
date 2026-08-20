import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { AccountReceivable, PaymentMethod, RecurrenceType } from '../../types';
import { useFinancial } from '../../context/FinancialContext';
import { getTodayString } from '../../utils/formatters';

interface BillReceivableModalProps {
  isOpen: boolean;
  onClose: () => void;
  billToEdit?: AccountReceivable | null;
}

export const BillReceivableModal: React.FC<BillReceivableModalProps> = ({
  isOpen,
  onClose,
  billToEdit,
}) => {
  const { categories, addAccountReceivable, updateAccountReceivable, currentUser } = useFinancial();

  const [description, setDescription] = useState('');
  const [client, setClient] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('mensal');
  const [notes, setNotes] = useState('');

  const incomeCategories = categories.filter((c) => c.type === 'receita');

  useEffect(() => {
    if (billToEdit) {
      setDescription(billToEdit.description);
      setClient(billToEdit.client);
      setAmountStr(billToEdit.amount.toString());
      setDueDate(billToEdit.dueDate);
      setCategoryId(billToEdit.categoryId);
      setPaymentMethod(billToEdit.paymentMethod || 'PIX');
      setRecurrence(billToEdit.recurrence || 'mensal');
      setNotes(billToEdit.notes || '');
    } else {
      setDescription('');
      setClient('');
      setAmountStr('');
      setDueDate(getTodayString());
      setCategoryId(incomeCategories[0]?.id || '');
      setPaymentMethod('PIX');
      setRecurrence('mensal');
      setNotes('');
    }
  }, [billToEdit, isOpen, incomeCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !client.trim()) return;

    const numAmount = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) return;

    const payload = {
      description: description.trim(),
      client: client.trim(),
      amount: numAmount,
      dueDate,
      categoryId: categoryId || incomeCategories[0]?.id || 'cat-rec-1',
      paymentMethod,
      recurrence,
      status: 'pendente' as const,
      notes: notes.trim(),
    };

    if (billToEdit) {
      updateAccountReceivable(billToEdit.id, payload);
    } else {
      addAccountReceivable(payload);
    }

    onClose();
  };

  const isViewer = currentUser.role === 'visualizador';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={billToEdit ? 'Editar Conta a Receber' : 'Nova Conta a Receber'}
      subtitle="Cadastre uma receita futura esperada com controle de vencimento"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descrição do Recebimento / Contrato *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Mensalidade Contrato Suporte TI"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Valor Previsto (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              min="0.01"
              required
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="0,00"
              className="w-full font-mono font-bold rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Cliente / Sacado *
            </label>
            <input
              type="text"
              required
              value={client}
              onChange={(e) => setClient(e.target.value)}
              placeholder="Ex: Clínica Odontológica Sorriso"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Data de Vencimento / Previsão *
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Categoria da Receita *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {incomeCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Forma de Recebimento Prevista
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="PIX">PIX</option>
              <option value="Boleto">Boleto Bancário</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Transferência TED">Transferência TED</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Recorrência
          </label>
          <select
            value={recurrence}
            onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          >
            <option value="mensal">Mensal (Contrato Recorrente)</option>
            <option value="única">Única (Venda / Projeto pontual)</option>
            <option value="anual">Anual</option>
            <option value="semanal">Semanal</option>
          </select>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Observações
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detalhes sobre a negociação, número do pedido ou condições de entrega..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
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
            className={`px-5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 rounded-xl shadow-xs transition-colors ${
              isViewer ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {billToEdit ? 'Salvar Alterações' : 'Cadastrar Conta a Receber'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
