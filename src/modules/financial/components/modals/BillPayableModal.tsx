import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { AccountPayable, PaymentMethod, RecurrenceType } from '../../types';
import { useFinancial } from '../../context/FinancialContext';
import { getTodayString } from '../../utils/formatters';

interface BillPayableModalProps {
  isOpen: boolean;
  onClose: () => void;
  billToEdit?: AccountPayable | null;
}

export const BillPayableModal: React.FC<BillPayableModalProps> = ({
  isOpen,
  onClose,
  billToEdit,
}) => {
  const { categories, addAccountPayable, updateAccountPayable, currentUser } = useFinancial();

  const [description, setDescription] = useState('');
  const [supplier, setSupplier] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [dueDate, setDueDate] = useState(getTodayString());
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('Boleto');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('mensal');
  const [barcode, setBarcode] = useState('');
  const [alertDays, setAlertDays] = useState(3);
  const [notes, setNotes] = useState('');

  const expenseCategories = categories.filter((c) => c.type === 'despesa');

  useEffect(() => {
    if (billToEdit) {
      setDescription(billToEdit.description);
      setSupplier(billToEdit.supplier);
      setAmountStr(billToEdit.amount.toString());
      setDueDate(billToEdit.dueDate);
      setCategoryId(billToEdit.categoryId);
      setPaymentMethod(billToEdit.paymentMethod || 'Boleto');
      setRecurrence(billToEdit.recurrence || 'mensal');
      setBarcode(billToEdit.barcode || '');
      setAlertDays(billToEdit.alertDays || 3);
      setNotes(billToEdit.notes || '');
    } else {
      setDescription('');
      setSupplier('');
      setAmountStr('');
      setDueDate(getTodayString());
      setCategoryId(expenseCategories[0]?.id || '');
      setPaymentMethod('Boleto');
      setRecurrence('mensal');
      setBarcode('');
      setAlertDays(3);
      setNotes('');
    }
  }, [billToEdit, isOpen, expenseCategories]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim() || !supplier.trim()) return;

    const numAmount = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) return;

    const payload = {
      description: description.trim(),
      supplier: supplier.trim(),
      amount: numAmount,
      dueDate,
      categoryId: categoryId || expenseCategories[0]?.id || 'cat-desp-1',
      paymentMethod,
      recurrence,
      barcode: barcode.trim(),
      alertDays: Number(alertDays) || 3,
      status: 'pendente' as const,
      notes: notes.trim(),
    };

    if (billToEdit) {
      updateAccountPayable(billToEdit.id, payload);
    } else {
      addAccountPayable(payload);
    }

    onClose();
  };

  const isViewer = currentUser.role === 'visualizador';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={billToEdit ? 'Editar Conta a Pagar' : 'Nova Conta a Pagar'}
      subtitle="Cadastre uma obrigação financeira com controle de vencimento"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descrição da Despesa / Título *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ex: Aluguel Comercial Março"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
              className="w-full font-mono font-bold rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Fornecedor / Beneficiário *
            </label>
            <input
              type="text"
              required
              value={supplier}
              onChange={(e) => setSupplier(e.target.value)}
              placeholder="Ex: Imobiliária Nova Era"
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Data de Vencimento *
            </label>
            <input
              type="date"
              required
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Categoria da Despesa *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {expenseCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Forma de Pagamento
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="Boleto">Boleto Bancário</option>
              <option value="PIX">PIX</option>
              <option value="Cartão de Crédito">Cartão de Crédito</option>
              <option value="Transferência TED">Transferência TED</option>
              <option value="Dinheiro">Dinheiro</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Recorrência
            </label>
            <select
              value={recurrence}
              onChange={(e) => setRecurrence(e.target.value as RecurrenceType)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value="mensal">Mensal (Todo mês)</option>
              <option value="única">Única (Não se repete)</option>
              <option value="anual">Anual</option>
              <option value="semanal">Semanal</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Alerta de Vencimento
            </label>
            <select
              value={alertDays}
              onChange={(e) => setAlertDays(Number(e.target.value))}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              <option value={1}>1 dia antes</option>
              <option value={3}>3 dias antes (Recomendado)</option>
              <option value={5}>5 dias antes</option>
              <option value={7}>7 dias antes</option>
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Código de Barras / Linha Digitável do Boleto (Opcional)
          </label>
          <input
            type="text"
            value={barcode}
            onChange={(e) => setBarcode(e.target.value)}
            placeholder="Ex: 34191.79001 01043.510047 91020.150008 5 95680000245000"
            className="w-full font-mono text-xs rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-slate-900 focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Observações
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Detalhes sobre a fatura, contrato ou instruções de pagamento..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-rose-500 focus:outline-hidden focus:ring-2 focus:ring-rose-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
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
            className={`px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 active:bg-rose-800 rounded-xl shadow-xs transition-colors ${
              isViewer ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {billToEdit ? 'Salvar Alterações' : 'Cadastrar Conta a Pagar'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
