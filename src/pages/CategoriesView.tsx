import React from 'react';
import { useAssets } from '../context/AssetContext';
import { Asset, AssetCategory } from '../types';
import { CATEGORY_DETAILS } from '../utils/formatters';
import { AssetIcon } from '../components/common/AssetIcon';
import { 
  ArrowRight, 
  Plus, 
  Flame, 
  ArrowUp
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const CategoriesView: React.FC = () => {
  const { 
    assets, 
    stats, 
    setActiveTab, 
    setFilters, 
    setIsCreateModalOpen,
    setActiveModalAsset 
  } = useAssets();

  const categories: AssetCategory[] = [
    'ITEM',
    'MONSTER',
    'MAP',
    'ANIMATION',
    'SOUND',
    'UI',
    'CHARACTER',
    'EFFECT'
  ];

  const handleViewCategory = (cat: AssetCategory) => {
    sounds.playClick();
    setFilters(prev => ({
      ...prev,
      categories: [cat],
      search: '',
      status: [],
      priority: [],
      origins: []
    }));
    setActiveTab('assets');
  };

  const handleAddInCategory = (cat: AssetCategory) => {
    sounds.playClick();
    setActiveModalAsset({
      id: '',
      name: '',
      category: cat,
      status: 'PENDING',
      priority: 'HIGH',
      origin: 'MU',
      tags: [],
      createdAt: '',
      updatedAt: ''
    } as any);
    setIsCreateModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#f0d98c] flex items-center gap-2">
            <span>CATEGORIAS DE ASSETS</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[#1c170f] text-[#c9a961] border border-[#c9a961]/30">
              8 Categorias Principais
            </span>
          </h2>
          <p className="text-xs text-[#8a7c5c] mt-0.5">
            Navegue pela estrutura completa do MMORPG por módulos especializados de desenvolvimento.
          </p>
        </div>
      </div>

      {/* Grid of 8 Category Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {categories.map(cat => {
          const details = CATEGORY_DETAILS[cat];
          const catStat = stats.byCategory[cat];
          const catAssets = assets.filter((a: Asset) => a.category === cat);
          
          const criticalCount = catAssets.filter((a: Asset) => a.status !== 'COMPLETED' && a.priority === 'CRITICAL').length;
          const highCount = catAssets.filter((a: Asset) => a.status !== 'COMPLETED' && a.priority === 'HIGH').length;

          // Unique subcategories in this category
          const subcats = Array.from(new Set(catAssets.map((a: Asset) => a.subcategory).filter(Boolean))) as string[];

          return (
            <div
              key={cat}
              className="relative p-5 rounded-2xl bg-[#141414] border border-[#3d2f1f] hover:border-[#c9a961] shadow-xl transition-all duration-300 flex flex-col justify-between medieval-frame group hover:-translate-y-1"
            >
              <div className="corner-ornament-tl" />
              <div className="corner-ornament-tr" />
              <div className="corner-ornament-bl" />
              <div className="corner-ornament-br" />

              <div>
                {/* Card Top: Icon + Title */}
                <div className="flex items-start justify-between gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <AssetIcon category={cat} size="lg" className="shadow-md" />
                    <div>
                      <h3 className="text-base font-cinzel font-bold text-[#e8d9b0] group-hover:text-[#f0d98c] transition-colors">
                        {details.label}
                      </h3>
                      <span className="text-xs text-[#8a7c5c] font-mono">
                        {catStat.total} assets totais
                      </span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-[#8a7c5c] leading-relaxed mb-4 min-h-[36px]">
                  {details.description}
                </p>

                {/* Progress Bar & Percentage */}
                <div className="space-y-1.5 mb-4 p-3 rounded-xl bg-[#0d0d0d] border border-[#3d2f1f]/60">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="text-[#8a7c5c] font-cinzel">Progresso:</span>
                    <span className="font-bold text-[#c9a961]">
                      {catStat.completed}/{catStat.total} ({catStat.pct}%)
                    </span>
                  </div>

                  <div className="w-full h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${catStat.pct}%`,
                        backgroundColor: catStat.pct >= 70 ? '#27ae60' : details.color
                      }}
                    />
                  </div>

                  {/* Status Breakdown Pills */}
                  <div className="flex items-center justify-between text-[10px] font-mono text-[#8a7c5c] pt-1">
                    <span className="text-[#2ecc71]">✓ {catStat.completed} prontos</span>
                    <span className="text-[#f1c40f]">🔄 {catStat.inProgress} ativos</span>
                    <span className="text-[#bdc3c7]">⏳ {catStat.pending} pendentes</span>
                  </div>
                </div>

                {/* Pending Priorities Indicator */}
                {(criticalCount > 0 || highCount > 0) && (
                  <div className="flex items-center gap-2 mb-4 text-xs">
                    {criticalCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#c0392b]/20 border border-[#c0392b]/40 text-[#e74c3c] text-[11px] font-mono">
                        <Flame size={12} className="animate-pulse" />
                        {criticalCount} crítica{criticalCount > 1 ? 's' : ''}
                      </span>
                    )}
                    {highCount > 0 && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#e67e22]/20 border border-[#e67e22]/40 text-[#f39c12] text-[11px] font-mono">
                        <ArrowUp size={12} />
                        {highCount} alta{highCount > 1 ? 's' : ''}
                      </span>
                    )}
                  </div>
                )}

                {/* Subcategories */}
                {subcats.length > 0 && (
                  <div className="mb-4">
                    <span className="text-[10px] font-cinzel text-[#8a7c5c] block mb-1.5 uppercase">
                      Subgrupos:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {subcats.slice(0, 4).map((sub: string) => (
                        <span
                          key={sub}
                          className="px-2 py-0.5 rounded bg-[#1c170f] border border-[#3d2f1f] text-[10px] font-mono text-[#e8d9b0]"
                        >
                          {sub}
                        </span>
                      ))}
                      {subcats.length > 4 && (
                        <span className="px-1.5 py-0.5 text-[10px] text-[#8a7c5c]">
                          +{subcats.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-[#3d2f1f] flex items-center justify-between gap-2 mt-2">
                <button
                  onClick={() => handleAddInCategory(cat)}
                  className="p-2 rounded-lg border border-[#3d2f1f] bg-[#0d0d0d] hover:border-[#c9a961] text-[#8a7c5c] hover:text-[#f0d98c] transition-colors"
                  title="Criar novo asset nesta categoria"
                >
                  <Plus size={15} />
                </button>

                <button
                  onClick={() => handleViewCategory(cat)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg font-cinzel font-bold text-xs bg-[#1c170f] border border-[#c9a961]/40 text-[#f0d98c] hover:bg-[#c9a961] hover:text-black transition-all"
                >
                  <span>Ver Assets</span>
                  <ArrowRight size={13} />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
