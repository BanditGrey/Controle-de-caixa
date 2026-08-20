import React from 'react';
import { useAssets } from '../../context/AssetContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useAssets();

  if (toasts.length === 0) return null;

  const icons: Record<'success' | 'warning' | 'error' | 'info', React.ReactNode> = {
    success: <CheckCircle2 className="w-5 h-5 text-[#2ecc71] shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-[#f39c12] shrink-0" />,
    error: <XCircle className="w-5 h-5 text-[#c0392b] shrink-0" />,
    info: <Info className="w-5 h-5 text-[#c9a961] shrink-0" />
  };

  const borderColors: Record<'success' | 'warning' | 'error' | 'info', string> = {
    success: 'border-[#27ae60]',
    warning: 'border-[#f39c12]',
    error: 'border-[#c0392b]',
    info: 'border-[#c9a961]'
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        return (
          <div
            key={toast.id}
            className={`pointer-events-auto relative flex items-start gap-3 p-3.5 rounded-lg bg-[#141414] border shadow-2xl transition-all duration-300 transform translate-y-0 ${borderColors[toast.type]} medieval-frame`}
          >
            <div className="corner-ornament-tl !w-1.5 !h-1.5" />
            <div className="corner-ornament-br !w-1.5 !h-1.5" />
            {icons[toast.type]}
            <div className="flex-1 min-w-0 pr-2">
              <h4 className="text-sm font-semibold font-cinzel text-[#e8d9b0] leading-tight">
                {toast.title}
              </h4>
              {toast.description && (
                <p className="text-xs text-[#8a7c5c] mt-0.5 leading-snug">
                  {toast.description}
                </p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="text-[#8a7c5c] hover:text-[#e8d9b0] p-1 -mr-1 -mt-1 rounded transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        );
      })}
    </div>
  );
};
