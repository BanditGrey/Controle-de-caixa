import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { AccountPayable, AccountReceivable, PaymentMethod } from '../../types';
import { useFinancial } from '../../context/FinancialContext';
import { formatCurrency, formatDate } from '../../utils/formatters';
import { CheckCircle2, DollarSign } from 'lucide-react';

interface SettleModalProps {
  isOpen: boolean;
  onClose: () => void;
  bill: AccountPayable | AccountReceivable | null;
  type: 'pagar' | 'receber';
}

const PAYMENT_METHODS: PaymentMethod[] = [
  'PIX',
  'Cartão de Crédito',
  'Cartão de Débito',
  'Boleto',
  'Dinheiro',
  'Transferência TED',
];

export const SettleModal: React.FC<SettleModalProps> = ({
  isOpen,
  onClose,
  bill,
  type,
}) => {
  const { settleAccountPayable, settleAccountReceivable, company, currentUser } = useFinancial();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('PIX');
  const [settleAmountStr, setSettleAmountStr] = useState('');
  const [isFullPayment, setIsFullPayment] = useState(true);

  const remainingAmount = bill
    ? bill.amount - ((type === 'pagar' ? (bill as AccountPayable).paidAmount : (bill as AccountReceivable).receivedAmount) || 0)
    : 0;

  useEffect(() => {
    if (bill) {
      setPaymentMethod(bill.paymentMethod || 'PIX');
      setSettleAmountStr(remainingAmount.toString());
      setIsFullPayment(true);
    }
  }, [bill, remainingAmount, isOpen]);

  if (!bill) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = isFullPayment ? remainingAmount : parseFloat(settleAmountStr.replace(',', '.'));
    if (isNaN(amount) || amount <= 0) return;

    if (type === 'pagar') {
      settleAccountPayable(bill.id, paymentMethod, amount);
    } else {
      settleAccountReceivable(bill.id, paymentMethod, amount);
    }

    onClose();
  };

  const isViewer = currentUser.role === 'visualizador';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={type === 'pagar' ? 'Baixar Conta a Pagar' : 'Confirmar Recebimento'}
      subtitle="Confirme a quitação total ou parcial para registrar no caixa"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Bill Summary */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950 text-xs space-y-2">
          <div className="flex justify-between">
            <span className="text-slate-500">Descrição:</span>
            <span className="font-semibold text-slate-900 dark:text-white">{bill.description}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">{type === 'pagar' ? 'Fornecedor:' : 'Cliente:'}</span>
            <span className="font-medium text-slate-800 dark:text-slate-200">
              {type === 'pagar' ? (bill as AccountPayable).supplier : (bill as AccountReceivable).client}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-500">Vencimento:</span>
            <span className="font-mono text-slate-700 dark:text-slate-300">{formatDate(bill.dueDate)}</span>
          </div>
          <div className="flex justify-between border-t border-slate-200 dark:border-slate-800 pt-2 font-mono">
            <span className="text-slate-500">Saldo Pendente:</span>
            <span className="font-bold text-sm text-slate-900 dark:text-white">
              {formatCurrency(remainingAmount, company.currencySymbol)}
            </span>
          </div>
        </div>

        {/* Payment mode toggle */}
        <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setIsFullPayment(true);
              setSettleAmountStr(remainingAmount.toString());
            }}
            className={`py-2 rounded-lg text-xs font-semibold transition-all ${
              isFullPayment
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Quitação Total ({formatCurrency(remainingAmount, company.currencySymbol)})
          </button>
          <button
            type="button"
            onClick={() => setIsFullPayment(false)}
            className={`py-2 rounded-lg text-xs font-semibold transition-all ${
              !isFullPayment
                ? 'bg-white text-slate-900 shadow-xs dark:bg-slate-700 dark:text-white'
                : 'text-slate-600 dark:text-slate-400'
            }`}
          >
            Pagamento Parcial
          </button>
        </div>

        {!isFullPayment && (
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Valor do Pagamento Parcial (R$) *
            </label>
            <input
              type="number"
              step="0.01"
              max={remainingAmount}
              min="0.01"
              required
              value={settleAmountStr}
              onChange={(e) => setSettleAmountStr(e.target.value)}
              placeholder="0,00"
              className="w-full font-mono font-bold rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-900 focus:border-emerald-500 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/20 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
            Forma de Liquidação / Pagamento *
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
            className={`px-5 py-2 text-xs font-semibold text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 ${
              type === 'pagar'
                ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
                : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
            } ${isViewer ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            <CheckCircle2 className="h-4 w-4" />
            {type === 'pagar' ? 'Confirmar Pagamento' : 'Confirmar Recebimento'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
