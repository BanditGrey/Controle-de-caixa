import React from 'react';
import { AlertTriangle, Trash2, CheckCircle2 } from 'lucide-react';
import { Modal } from './Modal';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  variant?: 'danger' | 'warning' | 'info' | 'success';
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  variant = 'danger',
}) => {
  const isDanger = variant === 'danger';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} maxWidth="md">
      <div className="flex items-start gap-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
            isDanger
              ? 'bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400'
              : 'bg-amber-100 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
          }`}
        >
          {isDanger ? <Trash2 className="h-6 w-6" /> : <AlertTriangle className="h-6 w-6" />}
        </div>
        <div>
          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-xl hover:bg-slate-200 dark:text-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 transition-colors"
        >
          {cancelText}
        </button>
        <button
          type="button"
          onClick={() => {
            onConfirm();
            onClose();
          }}
          className={`px-4 py-2 text-sm font-semibold text-white rounded-xl shadow-xs transition-colors flex items-center gap-2 ${
            isDanger
              ? 'bg-rose-600 hover:bg-rose-700 active:bg-rose-800'
              : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
          }`}
        >
          <CheckCircle2 className="h-4 w-4" />
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
