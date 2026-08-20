import React, { useState, useEffect, useRef } from 'react';
import { useAssets } from '../../context/AssetContext';
import { Search, X, Layers, ArrowRight } from 'lucide-react';
import { AssetIcon } from '../common/AssetIcon';
import { StatusBadge, PriorityBadge } from '../common/Badge';
import { Asset } from '../../types';
import { sounds } from '../../utils/soundEffects';

export const QuickSearchModal: React.FC = () => {
  const { isSearchModalOpen, setIsSearchModalOpen, assets, setActiveModalAsset, setIsDetailModalOpen } = useAssets();
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchModalOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isSearchModalOpen]);

  if (!isSearchModalOpen) return null;

  const filtered = assets.filter((a: Asset) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      a.name.toLowerCase().includes(q) ||
      a.category.toLowerCase().includes(q) ||
      (a.subcategory && a.subcategory.toLowerCase().includes(q)) ||
      (a.originalReference && a.originalReference.toLowerCase().includes(q)) ||
      (a.targetPath && a.targetPath.toLowerCase().includes(q)) ||
      a.tags.some((t: string) => t.toLowerCase().includes(q))
    );
  }).slice(0, 8);

  const handleSelect = (asset: Asset) => {
    sounds.playClick();
    setActiveModalAsset(asset);
    setIsSearchModalOpen(false);
    setIsDetailModalOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < filtered.length - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : 0));
    } else if (e.key === 'Enter' && filtered[selectedIndex]) {
      e.preventDefault();
      handleSelect(filtered[selectedIndex]);
    } else if (e.key === 'Escape') {
      setIsSearchModalOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-150">
      <div 
        className="relative w-full max-w-2xl bg-[#141414] border border-[#c9a961] rounded-xl shadow-[0_0_50px_rgba(0,0,0,0.95)] overflow-hidden medieval-frame"
      >
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Search Input */}
        <div className="flex items-center gap-3 px-4 py-3.5 border-b border-[#3d2f1f] bg-[#0d0d0d]">
          <Search size={18} className="text-[#c9a961] shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="Buscar por nome, tag, categoria ou caminho (ex: bless, poção, espada)..."
            className="flex-1 bg-transparent text-sm text-[#e8d9b0] placeholder-[#8a7c5c] focus:outline-none"
          />
          {query && (
            <button 
              onClick={() => setQuery('')}
              className="text-[#8a7c5c] hover:text-[#e8d9b0] p-1"
            >
              <X size={16} />
            </button>
          )}
          <kbd className="px-2 py-0.5 rounded bg-[#1f1f1f] border border-[#3d2f1f] text-[10px] font-mono text-[#8a7c5c]">
            ESC
          </kbd>
        </div>

        {/* Search Results */}
        <div className="max-h-[360px] overflow-y-auto p-2 divide-y divide-[#3d2f1f]/40">
          {filtered.length > 0 ? (
            filtered.map((asset: Asset, idx: number) => {
              const isSelected = idx === selectedIndex;
              return (
                <div
                  key={asset.id}
                  onClick={() => handleSelect(asset)}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`flex items-center justify-between gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected 
                      ? 'bg-[#1c170f] border border-[#c9a961]/40' 
                      : 'hover:bg-[#1a1a1a] border border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <AssetIcon asset={asset} size="sm" />
                    <div className="min-w-0">
                      <h4 className="text-sm font-semibold font-cinzel text-[#e8d9b0] truncate">
                        {asset.name}
                      </h4>
                      <div className="flex items-center gap-2 text-[11px] text-[#8a7c5c] font-mono">
                        <span>{asset.category}</span>
                        {asset.subcategory && <span>• {asset.subcategory}</span>}
                        {asset.tags.length > 0 && (
                          <span className="truncate hidden sm:inline">• #{asset.tags.slice(0, 2).join(' #')}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <StatusBadge status={asset.status} size="sm" />
                    <PriorityBadge priority={asset.priority} size="sm" showLabel={false} />
                    <ArrowRight size={14} className={`transition-transform ${isSelected ? 'text-[#c9a961] translate-x-1' : 'text-transparent'}`} />
                  </div>
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-[#8a7c5c]">
              <Layers size={32} className="mx-auto mb-2 opacity-40 text-[#c9a961]" />
              <p className="text-sm font-cinzel">Nenhum asset encontrado para "{query}"</p>
              <p className="text-xs text-[#8a7c5c] mt-1">Tente pesquisar por categorias como ITEM, MONSTER ou tags.</p>
            </div>
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 border-t border-[#3d2f1f] bg-[#0d0d0d] flex items-center justify-between text-[11px] text-[#8a7c5c] font-mono">
          <span>{filtered.length} de {assets.length} assets</span>
          <div className="flex items-center gap-3">
            <span>↑↓ navegar</span>
            <span>↵ selecionar</span>
          </div>
        </div>
      </div>
    </div>
  );
};
