import React from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface ConfirmDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  isDanger?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirmar',
  cancelLabel = 'Cancelar',
  isDanger = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-md bg-[#141414] border border-[#c9a961] rounded-xl p-6 shadow-[0_0_30px_rgba(0,0,0,0.9)] medieval-frame"
      >
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        <div className="flex items-start gap-4">
          <div className={`p-3 rounded-xl border shrink-0 ${
            isDanger ? 'bg-[#c0392b]/20 border-[#c0392b] text-[#e74c3c]' : 'bg-[#c9a961]/20 border-[#c9a961] text-[#f0d98c]'
          }`}>
            <AlertTriangle size={24} />
          </div>

          <div className="flex-1">
            <h3 className="text-lg font-cinzel font-bold text-[#e8d9b0] mb-2">
              {title}
            </h3>
            <p className="text-sm text-[#8a7c5c] leading-relaxed">
              {message}
            </p>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onCancel();
            }}
            className="text-[#8a7c5c] hover:text-[#e8d9b0] p-1 rounded transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={() => {
              sounds.playClick();
              onCancel();
            }}
            className="px-4 py-2 rounded-lg border border-[#3d2f1f] bg-[#1a1a1a] text-sm text-[#8a7c5c] hover:text-[#e8d9b0] hover:border-[#8a7c5c] transition-all"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
            }}
            className={`px-5 py-2 rounded-lg text-sm font-semibold transition-all shadow-md ${
              isDanger 
                ? 'bg-[#c0392b] text-white hover:bg-[#d9534f] shadow-red-950/50' 
                : 'bg-gradient-to-r from-[#c9a961] to-[#8b7c4f] text-black font-cinzel font-bold hover:brightness-110 shadow-amber-950/50'
            }`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
