import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { Transaction, TransactionType, PaymentMethod, RecurrenceType } from '../../types';
import { useFinancial } from '../../context/FinancialContext';
import { getTodayString } from '../../utils/formatters';
import { UploadCloud, Check, ArrowDownLeft, ArrowUpRight, FileText } from 'lucide-react';
import { CategoryIcon } from '../common/CategoryIcon';

interface TransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: TransactionType;
  transactionToEdit?: Transaction | null;
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'PIX',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Boleto',
  'Dinheiro',
  'Transferência TED',
];

export const TransactionModal: React.FC<TransactionModalProps> = ({
  isOpen,
  onClose,
  initialType = 'receita',
  transactionToEdit,
}) => {
  const { categories, addTransaction, updateTransaction, currentUser } = useFinancial();

  const [type, setType] = useState<TransactionType>(initialType);
  const [description, setDescription] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const [date, setDate] = useState(getTodayString());
  const [categoryId, setCategoryId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [entityName, setEntityName] = useState('');
  const [status, setStatus] = useState<'recebido' | 'pago' | 'pendente'>('recebido');
  const [recurrence, setRecurrence] = useState<RecurrenceType>('única');
  const [notes, setNotes] = useState('');
  const [attachmentName, setAttachmentName] = useState<string | null>(null);

  // Fill state on edit
  useEffect(() => {
    if (transactionToEdit) {
      setType(transactionToEdit.type);
      setDescription(transactionToEdit.description);
      setAmountStr(transactionToEdit.amount.toString());
      setDate(transactionToEdit.date);
      setCategoryId(transactionToEdit.categoryId);
      setPaymentMethod(transactionToEdit.paymentMethod);
      setEntityName(transactionToEdit.entityName || '');
      setStatus(transactionToEdit.status);
      setRecurrence(transactionToEdit.recurrence || 'única');
      setNotes(transactionToEdit.notes || '');
      setAttachmentName(transactionToEdit.attachment?.name || null);
    } else {
      setType(initialType);
      setDescription('');
      setAmountStr('');
      setDate(getTodayString());
      setPaymentMethod('PIX');
      setEntityName('');
      setStatus(initialType === 'receita' ? 'recebido' : 'pago');
      setRecurrence('única');
      setNotes('');
      setAttachmentName(null);

      // Default category
      const firstMatchingCat = categories.find((c) => c.type === initialType);
      if (firstMatchingCat) {
        setCategoryId(firstMatchingCat.id);
      }
    }
  }, [transactionToEdit, initialType, isOpen, categories]);

  // When type changes, ensure valid default category and status
  const handleTypeChange = (newType: TransactionType) => {
    setType(newType);
    if (!transactionToEdit) {
      setStatus(newType === 'receita' ? 'recebido' : 'pago');
    }
    const matching = categories.find((c) => c.type === newType);
    if (matching) {
      setCategoryId(matching.id);
    }
  };

  const filteredCategories = categories.filter((c) => c.type === type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!description.trim()) return;

    const numAmount = parseFloat(amountStr.replace(',', '.'));
    if (isNaN(numAmount) || numAmount <= 0) return;

    const chosenCat = categoryId || filteredCategories[0]?.id || 'cat-rec-1';

    const payload = {
      type,
      description: description.trim(),
      amount: numAmount,
      date,
      categoryId: chosenCat,
      paymentMethod,
      entityName: entityName.trim(),
      status,
      recurrence,
      notes: notes.trim(),
      attachment: attachmentName
        ? {
            name: attachmentName,
            size: '345 KB',
            type: 'pdf',
            date: getTodayString(),
          }
        : undefined,
    };

    if (transactionToEdit) {
      updateTransaction(transactionToEdit.id, payload);
    } else {
      addTransaction(payload);
    }

    onClose();
  };

  const handleSimulateFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setAttachmentName(e.target.files[0].name);
    }
  };

  const isViewer = currentUser.role === 'visualizador';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        transactionToEdit
          ? `Editar ${transactionToEdit.type === 'receita' ? 'Entrada' : 'Saída'}`
          : `Nova Movimentação de Caixa`
      }
      subtitle="Preencha os detalhes da transação financeira"
      maxWidth="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type selector tabs */}
        {!transactionToEdit && (
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
            <button
              type="button"
              onClick={() => handleTypeChange('receita')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                type === 'receita'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowDownLeft className="h-4 w-4" />
              + Nova Entrada (Receita)
            </button>
            <button
              type="button"
              onClick={() => handleTypeChange('despesa')}
              className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-xs font-bold transition-all ${
                type === 'despesa'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <ArrowUpRight className="h-4 w-4" />
              - Nova Saída (Despesa)
            </button>
          </div>
        )}

        {/* Description & Amount */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Descrição da Transação *
            </label>
            <input
              type="text"
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={type === 'receita' ? 'Ex: Venda de mercadorias #1024' : 'Ex: Compra de materiais de escritório'}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          <div className="sm:col-span-4">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Valor (R$) *
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

        {/* Category & Date */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Categoria Financeira *
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {filteredCategories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Data da Movimentação *
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Payment Method & Client/Supplier */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Forma de Pagamento *
            </label>
            <select
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as PaymentMethod)}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            >
              {PAYMENT_METHODS.map((pm) => (
                <option key={pm} value={pm}>
                  {pm}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              {type === 'receita' ? 'Cliente / Pagador' : 'Fornecedor / Favorecido'}
            </label>
            <input
              type="text"
              value={entityName}
              onChange={(e) => setEntityName(e.target.value)}
              placeholder={type === 'receita' ? 'Ex: Cliente João Silva' : 'Ex: Fornecedor Papelaria Express'}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        </div>

        {/* Status & Recurrence */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Status da Operação *
            </label>
            <div className="flex gap-2">
              <label
                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  status !== 'pendente'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  className="hidden"
                  checked={status !== 'pendente'}
                  onChange={() => setStatus(type === 'receita' ? 'recebido' : 'pago')}
                />
                <Check className="h-3.5 w-3.5" />
                {type === 'receita' ? 'Recebido' : 'Pago'}
              </label>

              <label
                className={`flex-1 flex items-center justify-center gap-2 p-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors ${
                  status === 'pendente'
                    ? 'border-amber-500 bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                    : 'border-slate-200 bg-white text-slate-600 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400'
                }`}
              >
                <input
                  type="radio"
                  name="status"
                  className="hidden"
                  checked={status === 'pendente'}
                  onChange={() => setStatus('pendente')}
                />
                Pendente
              </label>
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
              <option value="única">Transação Única</option>
              <option value="semanal">Semanal</option>
              <option value="mensal">Mensal Recorrente</option>
              <option value="anual">Anual</option>
            </select>
          </div>
        </div>

        {/* Attachment Upload Simulator & Notes */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Comprovante / Recibo Anexo (Opcional)
          </label>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 px-3 py-2 border border-dashed border-slate-300 dark:border-slate-700 rounded-xl cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 text-xs font-medium text-slate-600 dark:text-slate-300 transition-colors">
              <UploadCloud className="h-4 w-4 text-emerald-600" />
              <span>{attachmentName ? 'Alterar Arquivo' : 'Carregar Comprovante / PDF'}</span>
              <input type="file" onChange={handleSimulateFile} className="hidden" accept=".pdf,.png,.jpg,.jpeg" />
            </label>
            {attachmentName && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                <FileText className="h-3.5 w-3.5" />
                {attachmentName}
                <button
                  type="button"
                  onClick={() => setAttachmentName(null)}
                  className="text-slate-400 hover:text-rose-500 ml-1 text-xs"
                >
                  ×
                </button>
              </span>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Observações Adicionais
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Informações adicionais sobre número de nota fiscal, parcelamento ou detalhes..."
            className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2 text-xs text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
          />
        </div>

        {/* Footer buttons */}
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
            className={`px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors ${
              type === 'receita'
                ? 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                : 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
            } ${isViewer ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {transactionToEdit ? 'Atualizar Movimentação' : 'Salvar no Caixa'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
