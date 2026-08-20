import React, { useState, useEffect } from 'react';
import { useAssets } from '../../context/AssetContext';
import { 
  Asset, 
  AssetCategory, 
  AssetOrigin, 
  AssetStatus, 
  Priority 
} from '../../types';
import { 
  X, 
  Save, 
  Trash2, 
  Plus, 
  Upload, 
  Sparkles, 
  Flame, 
  ArrowUp, 
  ArrowRight, 
  ArrowDown, 
  Clock, 
  Loader2, 
  CheckCircle2
} from 'lucide-react';
import { AssetIcon } from '../common/AssetIcon';
import { sounds } from '../../utils/soundEffects';
import { ConfirmDialog } from '../common/ConfirmDialog';

interface AssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  assetToEdit?: Asset | null;
}

export const AssetModal: React.FC<AssetModalProps> = ({
  isOpen,
  onClose,
  assetToEdit
}) => {
  const { addAsset, updateAsset, deleteAsset } = useAssets();

  const [name, setName] = useState('');
  const [category, setCategory] = useState<AssetCategory>('ITEM');
  const [subcategory, setSubcategory] = useState('');
  const [status, setStatus] = useState<AssetStatus>('PENDING');
  const [priority, setPriority] = useState<Priority>('MEDIUM');
  const [origin, setOrigin] = useState<AssetOrigin>('MU');
  const [originalReference, setOriginalReference] = useState('');
  const [targetPath, setTargetPath] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [dimensions, setDimensions] = useState('64x64');
  const [format, setFormat] = useState('png');
  const [duration, setDuration] = useState<number | undefined>(undefined);
  const [tagInput, setTagInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [isConfirmDeleteOpen, setIsConfirmDeleteOpen] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (assetToEdit) {
      setName(assetToEdit.name);
      setCategory(assetToEdit.category);
      setSubcategory(assetToEdit.subcategory || '');
      setStatus(assetToEdit.status);
      setPriority(assetToEdit.priority);
      setOrigin(assetToEdit.origin);
      setOriginalReference(assetToEdit.originalReference || '');
      setTargetPath(assetToEdit.targetPath || '');
      setPreviewUrl(assetToEdit.previewUrl || '');
      setNotes(assetToEdit.notes || '');
      setDimensions(assetToEdit.metadata?.dimensions || (assetToEdit.category === 'ITEM' ? '64x64' : ''));
      setFormat(assetToEdit.metadata?.format || (assetToEdit.category === 'MONSTER' || assetToEdit.category === 'CHARACTER' ? 'glb' : assetToEdit.category === 'SOUND' ? 'ogg' : 'png'));
      setDuration(assetToEdit.metadata?.duration);
      setTags(assetToEdit.tags || []);
    } else {
      setName('');
      setCategory('ITEM');
      setSubcategory('');
      setStatus('PENDING');
      setPriority('HIGH');
      setOrigin('MU');
      setOriginalReference('');
      setTargetPath('');
      setPreviewUrl('');
      setNotes('');
      setDimensions('64x64');
      setFormat('png');
      setDuration(undefined);
      setTags([]);
    }
    setErrors({});
  }, [assetToEdit, isOpen]);

  if (!isOpen) return null;

  const handleAddTag = (e?: React.KeyboardEvent) => {
    if (e && e.key !== 'Enter' && e.key !== ',') return;
    if (e) e.preventDefault();

    const clean = tagInput.trim().toLowerCase().replace(/,/g, '');
    if (clean && !tags.includes(clean)) {
      setTags(prev => [...prev, clean]);
      setTagInput('');
      sounds.playClick();
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(prev => prev.filter(t => t !== tagToRemove));
    sounds.playClick();
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        setPreviewUrl(reader.result);
        sounds.playBlessChime();
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) {
      newErrors.name = 'O nome do asset é obrigatório.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      sounds.playClick();
      return;
    }

    const metadata = {
      ...(dimensions ? { dimensions } : {}),
      ...(format ? { format } : {}),
      ...(duration !== undefined ? { duration: Number(duration) } : {})
    };

    if (assetToEdit) {
      updateAsset(assetToEdit.id, {
        name: name.trim(),
        category,
        subcategory: subcategory.trim() || undefined,
        status,
        priority,
        origin,
        originalReference: originalReference.trim() || undefined,
        targetPath: targetPath.trim() || undefined,
        previewUrl: previewUrl.trim() || undefined,
        notes: notes.trim() || undefined,
        tags,
        metadata
      });
    } else {
      addAsset({
        name: name.trim(),
        category,
        subcategory: subcategory.trim() || undefined,
        status,
        priority,
        origin,
        originalReference: originalReference.trim() || undefined,
        targetPath: targetPath.trim() || undefined,
        previewUrl: previewUrl.trim() || undefined,
        notes: notes.trim() || undefined,
        tags,
        metadata
      });
    }

    onClose();
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
        <div className="relative w-full max-w-4xl my-8 bg-[#141414] border border-[#c9a961] rounded-xl shadow-[0_0_40px_rgba(0,0,0,0.9)] overflow-hidden medieval-frame">
          <div className="corner-ornament-tl" />
          <div className="corner-ornament-tr" />
          <div className="corner-ornament-bl" />
          <div className="corner-ornament-br" />

          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-[#3d2f1f] bg-[#0d0d0d]">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg border border-[#c9a961]/40 bg-[#1c170f] text-[#c9a961]">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-cinzel font-bold text-[#f0d98c]">
                  {assetToEdit ? 'Editar Asset' : 'Forjar Novo Asset'}
                </h3>
                <p className="text-xs text-[#8a7c5c]">
                  Requiem of Legends — MMORPG Database
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                sounds.playClick();
                onClose();
              }}
              className="text-[#8a7c5c] hover:text-[#e8d9b0] p-1.5 rounded-lg border border-transparent hover:border-[#3d2f1f] transition-all"
            >
              <X size={20} />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              
              {/* Coluna Esquerda: Informações Básicas */}
              <div className="space-y-4">
                <div className="border-b border-[#3d2f1f] pb-2 mb-3">
                  <h4 className="text-xs font-cinzel font-bold text-[#c9a961] uppercase tracking-wider">
                    Informações Básicas
                  </h4>
                </div>

                {/* Nome */}
                <div>
                  <label className="block text-xs font-medium text-[#e8d9b0] mb-1.5">
                    Nome do Asset (PT-BR) <span className="text-[#c0392b]">*</span>
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={e => {
                      setName(e.target.value);
                      if (errors.name) setErrors(prev => ({ ...prev, name: '' }));
                    }}
                    placeholder="Ex: Jewel of Bless, Espada de Mithril, Dragão Vermelho"
                    className={`w-full px-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border text-sm text-[#e8d9b0] focus:outline-none focus:border-[#c9a961] focus:ring-1 focus:ring-[#c9a961] transition-all ${
                      errors.name ? 'border-[#c0392b]' : 'border-[#3d2f1f]'
                    }`}
                  />
                  {errors.name && <p className="text-xs text-[#c0392b] mt-1">{errors.name}</p>}
                </div>

                {/* Categoria & Subcategoria */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-[#e8d9b0] mb-1.5">
                      Categoria <span className="text-[#c0392b]">*</span>
                    </label>
                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value as AssetCategory)}
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                    >
                      <option value="ITEM">🎨 ITEM (Equipamentos/Joias)</option>
                      <option value="MONSTER">👹 MONSTER (Monstros/Bosses)</option>
                      <option value="MAP">🗺️ MAP (Mapas/Cenários)</option>
                      <option value="ANIMATION">🎬 ANIMATION (Animações/Combate)</option>
                      <option value="SOUND">🔊 SOUND (Sons/Trilhas)</option>
                      <option value="UI">🎨 UI (Interface/HUD)</option>
                      <option value="CHARACTER">🧙 CHARACTER (Classes/NPCs)</option>
                      <option value="EFFECT">✨ EFFECT (Efeitos VFX/Auras)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#e8d9b0] mb-1.5">
                      Subcategoria
                    </label>
                    <input
                      type="text"
                      value={subcategory}
                      onChange={e => setSubcategory(e.target.value)}
                      placeholder="Ex: weapon-sword, potion, boss"
                      className="w-full px-3 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                    />
                  </div>
                </div>

                {/* Status (Visual Radio Group) */}
                <div>
                  <label className="block text-xs font-medium text-[#e8d9b0] mb-2">
                    Status de Desenvolvimento <span className="text-[#c0392b]">*</span>
                  </label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'PENDING', label: 'Pendente', icon: Clock, color: '#bdc3c7', activeBg: 'bg-[#1f1f1f] border-[#7f8c8d]' },
                      { id: 'IN_PROGRESS', label: 'Em Progresso', icon: Loader2, color: '#f1c40f', activeBg: 'bg-[#261f0e] border-[#f39c12]' },
                      { id: 'COMPLETED', label: 'Concluído', icon: CheckCircle2, color: '#2ecc71', activeBg: 'bg-[#0e2417] border-[#27ae60]' }
                    ].map(st => {
                      const Icon = st.icon;
                      const isSelected = status === st.id;
                      return (
                        <button
                          key={st.id}
                          type="button"
                          onClick={() => {
                            setStatus(st.id as AssetStatus);
                            sounds.playClick();
                          }}
                          className={`flex items-center justify-center gap-1.5 py-2.5 px-2 rounded-lg border text-xs font-medium transition-all ${
                            isSelected 
                              ? `${st.activeBg} text-[#e8d9b0] font-bold shadow-sm` 
                              : 'border-[#3d2f1f] bg-[#0d0d0d] text-[#8a7c5c] hover:border-[#8a7c5c]'
                          }`}
                        >
                          <Icon size={14} style={{ color: st.color }} className={st.id === 'IN_PROGRESS' && isSelected ? 'animate-spin' : ''} />
                          <span>{st.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Prioridade (Visual Radio Group) */}
                <div>
                  <label className="block text-xs font-medium text-[#e8d9b0] mb-2">
                    Nível de Prioridade <span className="text-[#c0392b]">*</span>
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {[
                      { id: 'CRITICAL', label: 'Crítica', icon: Flame, color: '#e74c3c', activeBorder: 'border-[#c0392b] bg-[#291010]' },
                      { id: 'HIGH', label: 'Alta', icon: ArrowUp, color: '#f39c12', activeBorder: 'border-[#e67e22] bg-[#291c10]' },
                      { id: 'MEDIUM', label: 'Média', icon: ArrowRight, color: '#f0d98c', activeBorder: 'border-[#f1c40f] bg-[#292410]' },
                      { id: 'LOW', label: 'Baixa', icon: ArrowDown, color: '#95a5a6', activeBorder: 'border-[#7f8c8d] bg-[#1a1a1a]' }
                    ].map(p => {
                      const Icon = p.icon;
                      const isSelected = priority === p.id;
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => {
                            setPriority(p.id as Priority);
                            sounds.playClick();
                          }}
                          className={`flex flex-col items-center justify-center py-2 rounded-lg border text-xs font-medium transition-all ${
                            isSelected 
                              ? `${p.activeBorder} text-[#e8d9b0] font-bold shadow-sm` 
                              : 'border-[#3d2f1f] bg-[#0d0d0d] text-[#8a7c5c] hover:border-[#8a7c5c]'
                          }`}
                        >
                          <Icon size={14} style={{ color: p.color }} />
                          <span className="mt-0.5 text-[11px]">{p.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Origem */}
                <div>
                  <label className="block text-xs font-medium text-[#e8d9b0] mb-1.5">
                    Origem do Asset <span className="text-[#c0392b]">*</span>
                  </label>
                  <select
                    value={origin}
                    onChange={e => setOrigin(e.target.value as AssetOrigin)}
                    className="w-full px-3 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                  >
                    <option value="MU">MU Online (Referência Clássica)</option>
                    <option value="WYD">With Your Destiny / WYD (Kersef)</option>
                    <option value="CUSTOM">Original Requiem of Legends</option>
                    <option value="AI_GENERATED">Gerado via IA (Midjourney/Stable Diffusion)</option>
                    <option value="PURCHASED">Comprado em Marketplace (Synty/Unity)</option>
                    <option value="FREE_LICENSE">Creative Commons / Domínio Público</option>
                  </select>
                </div>

                {/* Tags */}
                <div>
                  <label className="block text-xs font-medium text-[#e8d9b0] mb-1.5">
                    Tags (Pressione Enter para adicionar)
                  </label>
                  <div className="flex gap-2 mb-2">
                    <input
                      type="text"
                      value={tagInput}
                      onChange={e => setTagInput(e.target.value)}
                      onKeyDown={handleAddTag}
                      placeholder="Ex: icone, 64x64, espada, dark-knight"
                      className="flex-1 px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                    />
                    <button
                      type="button"
                      onClick={() => handleAddTag()}
                      className="px-3 py-2 rounded-lg border border-[#c9a961]/40 bg-[#1c170f] text-[#c9a961] hover:bg-[#c9a961]/20 transition-all text-xs font-medium"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                  {tags.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {tags.map(t => (
                        <span
                          key={t}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#1c170f] border border-[#c9a961]/30 text-xs text-[#f0d98c]"
                        >
                          <span>#{t}</span>
                          <button
                            type="button"
                            onClick={() => handleRemoveTag(t)}
                            className="hover:text-[#c0392b] transition-colors"
                          >
                            <X size={12} />
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Coluna Direita: Detalhes Técnicos & Arquivos */}
              <div className="space-y-4">
                <div className="border-b border-[#3d2f1f] pb-2 mb-3 flex items-center justify-between">
                  <h4 className="text-xs font-cinzel font-bold text-[#c9a961] uppercase tracking-wider">
                    Detalhes Técnicos & Arquivos
                  </h4>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-[#8a7c5c]">Preview:</span>
                    <AssetIcon 
                      category={category} 
                      subcategory={subcategory} 
                      id={assetToEdit?.id || 'preview'} 
                      size="sm" 
                    />
                  </div>
                </div>

                {/* Referência Original */}
                <div>
                  <label className="block text-xs font-medium text-[#e8d9b0] mb-1.5">
                    Referência Original (Path/Arquivo fonte)
                  </label>
                  <input
                    type="text"
                    value={originalReference}
                    onChange={e => setOriginalReference(e.target.value)}
                    placeholder="Ex: MU/Item/JewelOfBless.bmd ou WYD/Char/TransKnight.wya"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm font-mono text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                  />
                </div>

                {/* Caminho de Destino */}
                <div>
                  <label className="block text-xs font-medium text-[#e8d9b0] mb-1.5">
                    Caminho de Destino no Projeto
                  </label>
                  <input
                    type="text"
                    value={targetPath}
                    onChange={e => setTargetPath(e.target.value)}
                    placeholder="Ex: assets/icons/items/jewel-bless.png"
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm font-mono text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                  />
                </div>

                {/* Preview Image / Upload */}
                <div>
                  <label className="block text-xs font-medium text-[#e8d9b0] mb-1.5">
                    Imagem / Preview do Asset
                  </label>
                  <div className="flex items-center gap-3">
                    <label className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-dashed border-[#c9a961]/40 bg-[#0d0d0d] hover:bg-[#1c170f] text-xs text-[#c9a961] cursor-pointer transition-all">
                      <Upload size={16} />
                      <span>{previewUrl ? 'Trocar imagem...' : 'Carregar arquivo de imagem'}</span>
                      <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="hidden" 
                      />
                    </label>
                    {previewUrl && (
                      <button
                        type="button"
                        onClick={() => setPreviewUrl('')}
                        className="px-2.5 py-2 rounded-lg border border-[#c0392b]/40 text-[#c0392b] hover:bg-[#c0392b]/10 text-xs transition-all"
                        title="Remover imagem personalizada"
                      >
                        Limpar
                      </button>
                    )}
                  </div>
                  <input
                    type="text"
                    value={previewUrl}
                    onChange={e => setPreviewUrl(e.target.value)}
                    placeholder="Ou cole a URL direta da imagem..."
                    className="w-full mt-2 px-3 py-1.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-xs text-[#8a7c5c] focus:outline-none focus:border-[#c9a961]"
                  />
                </div>

                {/* Formato, Dimensões e Duração */}
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-medium text-[#e8d9b0] mb-1.5">
                      Dimensões
                    </label>
                    <input
                      type="text"
                      value={dimensions}
                      onChange={e => setDimensions(e.target.value)}
                      placeholder="64x64"
                      className="w-full px-2.5 py-2 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-xs font-mono text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#e8d9b0] mb-1.5">
                      Formato
                    </label>
                    <select
                      value={format}
                      onChange={e => setFormat(e.target.value)}
                      className="w-full px-2.5 py-2 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-xs text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                    >
                      <option value="png">PNG</option>
                      <option value="webp">WEBP</option>
                      <option value="jpg">JPG</option>
                      <option value="glb">GLB (3D)</option>
                      <option value="svg">SVG</option>
                      <option value="ogg">OGG (Áudio)</option>
                      <option value="mp3">MP3</option>
                      <option value="json">JSON (VFX)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#e8d9b0] mb-1.5">
                      Duração (s)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={duration !== undefined ? duration : ''}
                      onChange={e => setDuration(e.target.value ? parseFloat(e.target.value) : undefined)}
                      placeholder="1.5"
                      className="w-full px-2.5 py-2 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-xs font-mono text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                    />
                  </div>
                </div>

                {/* Notas / Diretrizes de Design */}
                <div>
                  <label className="block text-xs font-medium text-[#e8d9b0] mb-1.5">
                    Notas & Diretrizes de Design
                  </label>
                  <textarea
                    rows={4}
                    value={notes}
                    onChange={e => setNotes(e.target.value)}
                    placeholder="Instruções para a equipe de arte, efeitos de brilho necessários, inspiração de som..."
                    className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm text-[#e8d9b0] focus:outline-none focus:border-[#c9a961] resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="mt-8 pt-4 border-t border-[#3d2f1f] flex items-center justify-between gap-4">
              <div>
                {assetToEdit && (
                  <button
                    type="button"
                    onClick={() => setIsConfirmDeleteOpen(true)}
                    className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-[#c0392b]/40 text-[#e74c3c] hover:bg-[#c0392b]/20 text-xs font-medium transition-all"
                  >
                    <Trash2 size={14} />
                    <span>Deletar Asset</span>
                  </button>
                )}
              </div>

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => {
                    sounds.playClick();
                    onClose();
                  }}
                  className="px-4 py-2 rounded-lg border border-[#3d2f1f] bg-[#1a1a1a] text-sm text-[#8a7c5c] hover:text-[#e8d9b0] hover:border-[#8a7c5c] transition-all"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-2 rounded-lg font-cinzel font-bold text-sm bg-gradient-to-r from-[#c9a961] to-[#8b7c4f] text-black hover:brightness-110 shadow-md shadow-[#c9a961]/30 transition-all cursor-pointer"
                >
                  <Save size={16} />
                  <span>{assetToEdit ? 'Salvar Alterações' : 'Forjar Asset'}</span>
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {assetToEdit && (
        <ConfirmDialog
          isOpen={isConfirmDeleteOpen}
          title="Destruir Asset?"
          message={`Tem certeza que deseja excluir o asset "${assetToEdit.name}"? Esta ação removerá o registro permanentemente.`}
          confirmLabel="Sim, Destruir"
          cancelLabel="Cancelar"
          isDanger={true}
          onConfirm={() => {
            deleteAsset(assetToEdit.id);
            setIsConfirmDeleteOpen(false);
            onClose();
          }}
          onCancel={() => setIsConfirmDeleteOpen(false)}
        />
      )}
    </>
  );
};
