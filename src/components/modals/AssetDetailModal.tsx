import React, { useState } from 'react';
import { useAssets } from '../../context/AssetContext';
import { Asset, AssetStatus } from '../../types';
import { 
  X, 
  Edit, 
  Copy, 
  Trash2, 
  Clock, 
  CheckCircle2, 
  Loader2, 
  FileText, 
  Calendar 
} from 'lucide-react';
import { AssetIcon } from '../common/AssetIcon';
import { CategoryBadge, StatusBadge, PriorityBadge, OriginBadge } from '../common/Badge';
import { formatDateTime, formatRelativeTime, ORIGIN_DETAILS } from '../../utils/formatters';
import { sounds } from '../../utils/soundEffects';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface AssetDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  asset: Asset | null;
  onEdit: (asset: Asset) => void;
}

export const AssetDetailModal: React.FC<AssetDetailModalProps> = ({
  isOpen,
  onClose,
  asset,
  onEdit
}) => {
  const { updateAssetStatus, duplicateAsset, deleteAsset, showToast } = useAssets();
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);

  if (!isOpen || !asset) return null;

  const originDetails = ORIGIN_DETAILS[asset.origin];

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    sounds.playClick();
    showToast('Copiado para Área de Transferência', text, 'info');
  };

  const handleStatusChange = (newStatus: AssetStatus) => {
    if (newStatus !== asset.status) {
      updateAssetStatus(asset.id, newStatus);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-3xl my-8 bg-[#141414] border border-[#c9a961] rounded-xl shadow-[0_0_45px_rgba(0,0,0,0.9)] overflow-hidden medieval-frame">
          <div className="corner-ornament-tl" />
          <div className="corner-ornament-tr" />
          <div className="corner-ornament-bl" />
          <div className="corner-ornament-br" />

          {/* Modal Header */}
          <div className="relative px-6 pt-6 pb-5 border-b border-[#3d2f1f] bg-gradient-to-b from-[#1c170f]/80 to-[#141414]">
            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="absolute top-4 right-4 text-[#8a7c5c] hover:text-[#e8d9b0] p-1.5 rounded-lg border border-transparent hover:border-[#3d2f1f] transition-all"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 pr-8">
              {/* Asset Hero Icon */}
              <div className="relative shrink-0">
                <AssetIcon asset={asset} size="xl" className="shadow-lg ring-2 ring-[#c9a961]/40" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1.5">
                  <CategoryBadge category={asset.category} size="sm" />
                  <StatusBadge status={asset.status} size="sm" />
                  <PriorityBadge priority={asset.priority} size="sm" />
                  <OriginBadge origin={asset.origin} size="sm" />
                </div>

                <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#f0d98c] truncate">
                  {asset.name}
                </h2>

                {asset.subcategory && (
                  <p className="text-xs text-[#8a7c5c] font-mono mt-0.5">
                    Subtipo: <span className="text-[#e8d9b0]">{asset.subcategory}</span>
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Content Body */}
          <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
            
            {/* Technical Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              
              {/* Origem */}
              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f]">
                <span className="text-[10px] font-cinzel text-[#8a7c5c] uppercase tracking-wider block mb-1">
                  Origem do Asset
                </span>
                <span className="text-xs font-semibold text-[#e8d9b0] block truncate" title={originDetails.label}>
                  {originDetails.label}
                </span>
              </div>

              {/* Formato */}
              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f]">
                <span className="text-[10px] font-cinzel text-[#8a7c5c] uppercase tracking-wider block mb-1">
                  Formato de Arquivo
                </span>
                <span className="text-xs font-mono font-bold text-[#c9a961] uppercase block">
                  {asset.metadata?.format || 'PNG'}
                </span>
              </div>

              {/* Dimensões / Duração */}
              <div className="p-3 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f]">
                <span className="text-[10px] font-cinzel text-[#8a7c5c] uppercase tracking-wider block mb-1">
                  {asset.metadata?.duration ? 'Duração' : 'Dimensões'}
                </span>
                <span className="text-xs font-mono text-[#e8d9b0] block">
                  {asset.metadata?.duration 
                    ? `${asset.metadata.duration}s` 
                    : asset.metadata?.dimensions || '64x64 px'}
                </span>
              </div>

              {/* Referência Original */}
              <div className="col-span-2 sm:col-span-3 p-3 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-cinzel text-[#8a7c5c] uppercase tracking-wider block mb-0.5">
                    Referência Original (Fonte)
                  </span>
                  <span className="text-xs font-mono text-[#e8d9b0] block truncate">
                    {asset.originalReference || 'Não informada (Asset original)'}
                  </span>
                </div>
                {asset.originalReference && (
                  <button
                    onClick={() => handleCopy(asset.originalReference!)}
                    className="p-1.5 rounded border border-[#3d2f1f] hover:border-[#c9a961] text-[#8a7c5c] hover:text-[#e8d9b0] text-xs transition-colors shrink-0"
                    title="Copiar referência"
                  >
                    <Copy size={13} />
                  </button>
                )}
              </div>

              {/* Caminho de Destino */}
              <div className="col-span-2 sm:col-span-3 p-3 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] flex items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-cinzel text-[#8a7c5c] uppercase tracking-wider block mb-0.5">
                    Caminho de Destino no MMORPG
                  </span>
                  <span className="text-xs font-mono text-[#c9a961] block truncate">
                    {asset.targetPath || `assets/${asset.category.toLowerCase()}s/${asset.id}.png`}
                  </span>
                </div>
                <button
                  onClick={() => handleCopy(asset.targetPath || `assets/${asset.category.toLowerCase()}s/${asset.id}.png`)}
                  className="p-1.5 rounded border border-[#3d2f1f] hover:border-[#c9a961] text-[#8a7c5c] hover:text-[#e8d9b0] text-xs transition-colors shrink-0"
                  title="Copiar caminho de destino"
                >
                  <Copy size={13} />
                </button>
              </div>
            </div>

            {/* Notes / Diretrizes */}
            {asset.notes && (
              <div className="p-4 rounded-lg bg-[#1a140d]/60 border border-[#c9a961]/30">
                <h4 className="text-xs font-cinzel font-bold text-[#f0d98c] flex items-center gap-1.5 mb-2">
                  <FileText size={14} className="text-[#c9a961]" />
                  <span>Notas & Instruções de Arte</span>
                </h4>
                <p className="text-sm text-[#e8d9b0] leading-relaxed whitespace-pre-wrap">
                  {asset.notes}
                </p>
              </div>
            )}

            {/* Tags */}
            {asset.tags && asset.tags.length > 0 && (
              <div>
                <span className="text-xs font-cinzel text-[#8a7c5c] block mb-2">
                  Tags & Marcadores:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags.map(tag => (
                    <span 
                      key={tag}
                      className="px-2.5 py-0.5 rounded-full bg-[#1c170f] border border-[#c9a961]/30 text-xs font-mono text-[#f0d98c]"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Timeline / Histórico */}
            <div className="border-t border-[#3d2f1f] pt-4">
              <h4 className="text-xs font-cinzel font-bold text-[#c9a961] uppercase tracking-wider mb-3 flex items-center gap-1.5">
                <Calendar size={14} />
                <span>Linha do Tempo & Atividades</span>
              </h4>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-[#8a7c5c] bg-[#0d0d0d] px-3 py-2 rounded-lg border border-[#3d2f1f]">
                  <span>Criado no sistema:</span>
                  <span className="font-mono text-[#e8d9b0]">{formatDateTime(asset.createdAt)}</span>
                </div>

                <div className="flex items-center justify-between text-[#8a7c5c] bg-[#0d0d0d] px-3 py-2 rounded-lg border border-[#3d2f1f]">
                  <span>Última modificação:</span>
                  <span className="font-mono text-[#e8d9b0]">{formatDateTime(asset.updatedAt)} ({formatRelativeTime(asset.updatedAt)})</span>
                </div>

                {asset.completedAt && (
                  <div className="flex items-center justify-between text-[#2ecc71] bg-[#0e2417]/40 px-3 py-2 rounded-lg border border-[#27ae60]/40">
                    <span className="flex items-center gap-1">
                      <CheckCircle2 size={13} />
                      Concluído em:
                    </span>
                    <span className="font-mono text-[#2ecc71] font-bold">{formatDateTime(asset.completedAt)}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Action Footer */}
          <div className="px-6 py-4 border-t border-[#3d2f1f] bg-[#0d0d0d] flex flex-wrap items-center justify-between gap-4">
            
            {/* Status Change Fast Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              <span className="text-xs font-cinzel text-[#8a7c5c] mr-1 hidden sm:inline">
                Status:
              </span>
              
              <button
                onClick={() => handleStatusChange('PENDING')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  asset.status === 'PENDING'
                    ? 'border-[#7f8c8d] bg-[#2a2a2a] text-[#bdc3c7] font-bold shadow-inner'
                    : 'border-[#3d2f1f] bg-[#141414] text-[#8a7c5c] hover:text-[#e8d9b0]'
                }`}
              >
                <Clock size={13} />
                <span>Pendente</span>
              </button>

              <button
                onClick={() => handleStatusChange('IN_PROGRESS')}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  asset.status === 'IN_PROGRESS'
                    ? 'border-[#f39c12] bg-[#291f0e] text-[#f1c40f] font-bold shadow-inner'
                    : 'border-[#3d2f1f] bg-[#141414] text-[#8a7c5c] hover:text-[#f1c40f]'
                }`}
              >
                <Loader2 size={13} className={asset.status === 'IN_PROGRESS' ? 'animate-spin' : ''} />
                <span>Em Progresso</span>
              </button>

              <button
                onClick={() => handleStatusChange('COMPLETED')}
                className={`flex items-center gap-1 px-3.5 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                  asset.status === 'COMPLETED'
                    ? 'border-[#27ae60] bg-[#0e2417] text-[#2ecc71] font-bold shadow-inner'
                    : 'border-[#3d2f1f] bg-[#141414] text-[#8a7c5c] hover:text-[#2ecc71]'
                }`}
              >
                <CheckCircle2 size={13} />
                <span>Concluído</span>
              </button>
            </div>

            {/* Extra actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  duplicateAsset(asset.id);
                  onClose();
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#3d2f1f] bg-[#141414] hover:border-[#c9a961] text-xs text-[#8a7c5c] hover:text-[#e8d9b0] transition-all"
                title="Duplicar asset"
              >
                <Copy size={13} />
                <span className="hidden sm:inline">Duplicar</span>
              </button>

              <button
                onClick={() => {
                  onEdit(asset);
                  onClose();
                }}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-cinzel font-bold text-xs bg-gradient-to-r from-[#c9a961] to-[#8b7c4f] text-black hover:brightness-110 shadow transition-all"
              >
                <Edit size={13} />
                <span>Editar</span>
              </button>

              <button
                onClick={() => setIsConfirmDeleteOpen(true)}
                className="p-1.5 rounded-lg border border-[#c0392b]/40 text-[#c0392b] hover:bg-[#c0392b]/20 transition-all"
                title="Deletar asset"
              >
                <Trash2 size={15} />
              </button>
            </div>
          </div>
        </div>
      </div>

      <ConfirmDialog
        isOpen={isConfirmDeleteOpen}
        title="Destruir Asset?"
        message={`Deseja realmente remover o asset "${asset.name}"?`}
        confirmLabel="Sim, Destruir"
        isDanger={true}
        onConfirm={() => {
          deleteAsset(asset.id);
          setIsConfirmDeleteOpen(false);
          onClose();
        }}
        onCancel={() => setIsConfirmDeleteOpen(false)}
      />
    </>
  );
};
