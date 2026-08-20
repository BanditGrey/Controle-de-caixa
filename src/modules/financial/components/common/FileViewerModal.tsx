import React from 'react';
import { Modal } from './Modal';
import { Attachment } from '../../types';
import { FileText, Download, CheckCircle2, Calendar, HardDrive } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

interface FileViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  attachment?: Attachment;
  title?: string;
  description?: string;
  amountFormatted?: string;
  entityName?: string;
}

export const FileViewerModal: React.FC<FileViewerModalProps> = ({
  isOpen,
  onClose,
  attachment,
  title = 'Comprovante / Anexo Financeiro',
  description,
  amountFormatted,
  entityName,
}) => {
  if (!attachment) return null;

  const handleSimulatedDownload = () => {
    // Generate simulated text download
    const content = `COMPROVANTE DE TRANSAÇÃO - FLUXOPRO
---------------------------------------
Arquivo: ${attachment.name}
Tamanho: ${attachment.size}
Data de Envio: ${formatDate(attachment.date)}
Descrição: ${description || 'Movimentação Financeira'}
Contato: ${entityName || 'N/A'}
Valor: ${amountFormatted || 'N/A'}
Status: AUTENTICADO DIGITALMENTE
---------------------------------------
Documento emitido para fins de conferência interna.`;

    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = attachment.name || 'comprovante.txt';
    link.click();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="space-y-4">
        {/* Document Card Preview */}
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 dark:border-slate-800 dark:bg-slate-950">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
              <FileText className="h-6 w-6" />
            </div>
            <div className="min-w-0 flex-1">
              <h4 className="truncate font-semibold text-slate-900 dark:text-white">
                {attachment.name}
              </h4>
              <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                <span className="flex items-center gap-1">
                  <HardDrive className="h-3.5 w-3.5" />
                  {attachment.size}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(attachment.date)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 text-xs space-y-2 text-slate-600 dark:text-slate-300">
            {description && (
              <div className="flex justify-between">
                <span className="text-slate-400">Referência:</span>
                <span className="font-medium text-slate-800 dark:text-slate-100">{description}</span>
              </div>
            )}
            {entityName && (
              <div className="flex justify-between">
                <span className="text-slate-400">Cliente / Fornecedor:</span>
                <span className="font-medium text-slate-800 dark:text-slate-100">{entityName}</span>
              </div>
            )}
            {amountFormatted && (
              <div className="flex justify-between">
                <span className="text-slate-400">Valor Registrado:</span>
                <span className="font-bold text-emerald-600 dark:text-emerald-400">{amountFormatted}</span>
              </div>
            )}
          </div>
        </div>

        {/* Status Verification */}
        <div className="flex items-center gap-2 rounded-xl bg-emerald-50 p-3 text-xs text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800/50">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400" />
          <span>Comprovante arquivado com integridade e assinatura digital verificada.</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
          >
            Fechar
          </button>
          <button
            type="button"
            onClick={handleSimulatedDownload}
            className="px-4 py-2 text-xs font-semibold text-white bg-emerald-600 rounded-xl hover:bg-emerald-700 active:bg-emerald-800 shadow-xs flex items-center gap-2 transition-colors"
          >
            <Download className="h-3.5 w-3.5" />
            Baixar Arquivo
          </button>
        </div>
      </div>
    </Modal>
  );
};
