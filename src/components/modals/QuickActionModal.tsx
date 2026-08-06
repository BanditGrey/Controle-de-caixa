import React from 'react';
import { Modal } from '../common/Modal';
import {
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
  FileCheck2,
  FolderPlus,
  FileSpreadsheet,
  Layers,
} from 'lucide-react';

interface QuickActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewIncome: () => void;
  onNewExpense: () => void;
  onNewPayable: () => void;
  onNewReceivable: () => void;
  onNewCategory: () => void;
  onGoToReports: () => void;
}

export const QuickActionModal: React.FC<QuickActionModalProps> = ({
  isOpen,
  onClose,
  onNewIncome,
  onNewExpense,
  onNewPayable,
  onNewReceivable,
  onNewCategory,
  onGoToReports,
}) => {
  const actions = [
    {
      title: 'Nova Entrada de Caixa',
      description: 'Lançar recebimento de venda ou serviço à vista',
      icon: ArrowDownLeft,
      color: 'bg-emerald-500 text-white',
      badge: 'Receita',
      onClick: () => {
        onClose();
        onNewIncome();
      },
    },
    {
      title: 'Nova Saída de Caixa',
      description: 'Registrar pagamento de despesa operacional ou fornecedor',
      icon: ArrowUpRight,
      color: 'bg-rose-500 text-white',
      badge: 'Despesa',
      onClick: () => {
        onClose();
        onNewExpense();
      },
    },
    {
      title: 'Cadastrar Conta a Pagar',
      description: 'Agendar boleto ou obrigação futura com vencimento',
      icon: Receipt,
      color: 'bg-amber-500 text-white',
      badge: 'A Pagar',
      onClick: () => {
        onClose();
        onNewPayable();
      },
    },
    {
      title: 'Cadastrar Conta a Receber',
      description: 'Registrar contrato ou fatura a ser recebida',
      icon: FileCheck2,
      color: 'bg-cyan-500 text-white',
      badge: 'A Receber',
      onClick: () => {
        onClose();
        onNewReceivable();
      },
    },
    {
      title: 'Criar Nova Categoria',
      description: 'Adicionar nova classificação de centro de custo',
      icon: FolderPlus,
      color: 'bg-indigo-500 text-white',
      badge: 'Configuração',
      onClick: () => {
        onClose();
        onNewCategory();
      },
    },
    {
      title: 'Gerar Relatório & DRE',
      description: 'Exportar demonstrativo financeiro em PDF ou Excel',
      icon: FileSpreadsheet,
      color: 'bg-purple-500 text-white',
      badge: 'Exportação',
      onClick: () => {
        onClose();
        onGoToReports();
      },
    },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Central de Ações Rápidas"
      subtitle="Escolha a operação que deseja realizar instantaneamente"
      maxWidth="lg"
    >
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 py-2">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.title}
              type="button"
              onClick={act.onClick}
              className="flex items-start gap-3.5 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 hover:bg-slate-50 dark:hover:bg-slate-800/80 transition-all text-left group hover:border-slate-400 dark:hover:border-slate-700 shadow-2xs hover:shadow-xs hover:-translate-y-0.5"
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-transform group-hover:scale-105 ${act.color}`}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                    {act.title}
                  </h4>
                  <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                    {act.badge}
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                  {act.description}
                </p>
              </div>
            </button>
          );
        })}
      </div>
    </Modal>
  );
};
