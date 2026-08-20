import React, { useState, useMemo } from 'react';
import { useAssets } from '../context/AssetContext';
import { 
  Plus, 
  Search, 
  Grid, 
  List, 
  Kanban, 
  Trash2, 
  CheckCircle2, 
  Loader2, 
  MoreVertical, 
  Copy, 
  Edit, 
  X, 
  RotateCcw,
  ArrowUpDown
} from 'lucide-react';
import { AssetIcon } from '../components/common/AssetIcon';
import { StatusBadge, PriorityBadge, CategoryBadge, OriginBadge } from '../components/common/Badge';
import { Asset, AssetCategory, AssetStatus, Priority } from '../types';
import { CATEGORY_DETAILS, PRIORITY_DETAILS } from '../utils/formatters';
import { sounds } from '../utils/soundEffects';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const AssetsList: React.FC = () => {
  const { 
    assets, 
    filters, 
    setFilters, 
    resetFilters, 
    selectedAssetIds, 
    toggleSelectAsset, 
    selectAllAssets, 
    clearSelection,
    bulkUpdateStatus,
    deleteMultipleAssets,
    updateAssetStatus,
    duplicateAsset,
    deleteAsset,
    setIsCreateModalOpen,
    setActiveModalAsset,
    setIsDetailModalOpen 
  } = useAssets();

  const [activeMenuAssetId, setActiveMenuAssetId] = useState<string | null>(null);
  const [assetToDelete, setAssetToDelete] = useState<Asset | null>(null);
  const [isConfirmBulkDeleteOpen, setIsConfirmBulkDeleteOpen] = useState(false);

  // Filter and sort logic
  const filteredAssets = useMemo(() => {
    return assets.filter((item: Asset) => {
      // Search
      if (filters.search.trim()) {
        const q = filters.search.toLowerCase().trim();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCat = item.category.toLowerCase().includes(q);
        const matchesSub = item.subcategory?.toLowerCase().includes(q);
        const matchesRef = item.originalReference?.toLowerCase().includes(q);
        const matchesPath = item.targetPath?.toLowerCase().includes(q);
        const matchesTags = item.tags.some((t: string) => t.toLowerCase().includes(q));
        if (!matchesName && !matchesCat && !matchesSub && !matchesRef && !matchesPath && !matchesTags) {
          return false;
        }
      }

      // Categories
      if (filters.categories.length > 0 && !filters.categories.includes(item.category)) {
        return false;
      }

      // Status
      if (filters.status.length > 0 && !filters.status.includes(item.status)) {
        return false;
      }

      // Priority
      if (filters.priority.length > 0 && !filters.priority.includes(item.priority)) {
        return false;
      }

      // Origins
      if (filters.origins.length > 0 && !filters.origins.includes(item.origin)) {
        return false;
      }

      return true;
    }).sort((a: Asset, b: Asset) => {
      switch (filters.sortBy) {
        case 'name-asc':
          return a.name.localeCompare(b.name, 'pt-BR');
        case 'name-desc':
          return b.name.localeCompare(a.name, 'pt-BR');
        case 'priority': {
          const rankA = PRIORITY_DETAILS[a.priority]?.rank || 0;
          const rankB = PRIORITY_DETAILS[b.priority]?.rank || 0;
          return rankB - rankA;
        }
        case 'status':
          return a.status.localeCompare(b.status);
        case 'category':
          return a.category.localeCompare(b.category);
        case 'date-oldest':
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        case 'updated':
          return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
        case 'date-newest':
        default:
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
    });
  }, [assets, filters]);

  // Helpers for category filters
  const toggleCategoryFilter = (cat: AssetCategory) => {
    sounds.playClick();
    setFilters(prev => ({
      ...prev,
      categories: prev.categories.includes(cat)
        ? prev.categories.filter((c: AssetCategory) => c !== cat)
        : [...prev.categories, cat]
    }));
  };

  const toggleStatusFilter = (st: AssetStatus) => {
    sounds.playClick();
    setFilters(prev => ({
      ...prev,
      status: prev.status.includes(st)
        ? prev.status.filter((s: AssetStatus) => s !== st)
        : [...prev.status, st]
    }));
  };

  const togglePriorityFilter = (p: Priority) => {
    sounds.playClick();
    setFilters(prev => ({
      ...prev,
      priority: prev.priority.includes(p)
        ? prev.priority.filter((item: Priority) => item !== p)
        : [...prev.priority, p]
    }));
  };

  const handleAssetClick = (asset: Asset, e: React.MouseEvent) => {
    // Ignore if clicking checkbox, action button, or menu
    if ((e.target as HTMLElement).closest('.ignore-card-click')) return;
    sounds.playClick();
    setActiveModalAsset(asset);
    setIsDetailModalOpen(true);
  };

  const hasActiveFilters = 
    Boolean(filters.search) || 
    filters.categories.length > 0 || 
    filters.status.length > 0 || 
    filters.priority.length > 0 || 
    filters.origins.length > 0;

  const categories: AssetCategory[] = ['ITEM', 'MONSTER', 'MAP', 'ANIMATION', 'SOUND', 'UI', 'CHARACTER', 'EFFECT'];

  return (
    <div className="space-y-6 pb-24">
      
      {/* Top Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#f0d98c] flex items-center gap-2">
            <span>GERENCIAR ASSETS</span>
            <span className="text-xs font-mono font-normal px-2.5 py-0.5 rounded-full bg-[#1c170f] text-[#c9a961] border border-[#c9a961]/30">
              {filteredAssets.length} de {assets.length} assets
            </span>
          </h2>
          <p className="text-xs text-[#8a7c5c] mt-0.5">
            Organize, filtre e acompanhe o estado de criação de todos os elementos do jogo.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          {/* View mode toggle */}
          <div className="flex items-center p-1 rounded-lg bg-[#141414] border border-[#3d2f1f]">
            <button
              onClick={() => {
                sounds.playClick();
                setFilters(prev => ({ ...prev, viewMode: 'grid' }));
              }}
              className={`p-1.5 rounded text-xs font-medium transition-all ${
                filters.viewMode === 'grid'
                  ? 'bg-[#c9a961] text-black shadow-sm'
                  : 'text-[#8a7c5c] hover:text-[#e8d9b0]'
              }`}
              title="Modo Grade"
            >
              <Grid size={16} />
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setFilters(prev => ({ ...prev, viewMode: 'list' }));
              }}
              className={`p-1.5 rounded text-xs font-medium transition-all ${
                filters.viewMode === 'list'
                  ? 'bg-[#c9a961] text-black shadow-sm'
                  : 'text-[#8a7c5c] hover:text-[#e8d9b0]'
              }`}
              title="Modo Tabela / Lista"
            >
              <List size={16} />
            </button>
            <button
              onClick={() => {
                sounds.playClick();
                setFilters(prev => ({ ...prev, viewMode: 'kanban' }));
              }}
              className={`p-1.5 rounded text-xs font-medium transition-all ${
                filters.viewMode === 'kanban'
                  ? 'bg-[#c9a961] text-black shadow-sm'
                  : 'text-[#8a7c5c] hover:text-[#e8d9b0]'
              }`}
              title="Modo Quadro Kanban"
            >
              <Kanban size={16} />
            </button>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              setActiveModalAsset(null);
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg font-cinzel font-bold text-xs sm:text-sm bg-gradient-to-r from-[#c9a961] to-[#8b7c4f] text-black hover:brightness-110 shadow-md shadow-[#c9a961]/25 transition-all cursor-pointer"
          >
            <Plus size={16} className="stroke-[3]" />
            <span>Novo Asset</span>
          </button>
        </div>
      </div>

      {/* Sticky Filter Bar */}
      <div className="sticky top-[69px] z-30 p-4 rounded-xl bg-[#141414]/95 backdrop-blur-md border border-[#3d2f1f] shadow-xl medieval-frame space-y-3.5">
        
        {/* Row 1: Search + Quick Sort */}
        <div className="flex flex-col md:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#8a7c5c]" />
            <input
              type="text"
              value={filters.search}
              onChange={e => setFilters(prev => ({ ...prev, search: e.target.value }))}
              placeholder="Buscar por nome, tag, subcategoria ou referência original (ex: bless, lorencia, espada)..."
              className="w-full pl-10 pr-10 py-2 rounded-lg bg-[#0a0a0a] border border-[#3d2f1f] text-xs sm:text-sm text-[#e8d9b0] placeholder-[#8a7c5c] focus:outline-none focus:border-[#c9a961]"
            />
            {filters.search && (
              <button
                onClick={() => setFilters(prev => ({ ...prev, search: '' }))}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8a7c5c] hover:text-[#e8d9b0]"
              >
                <X size={14} />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto">
            {/* Sort Dropdown */}
            <div className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-[#0a0a0a] border border-[#3d2f1f] text-xs text-[#e8d9b0] w-full md:w-auto">
              <ArrowUpDown size={14} className="text-[#c9a961] shrink-0" />
              <select
                value={filters.sortBy}
                onChange={e => setFilters(prev => ({ ...prev, sortBy: e.target.value as any }))}
                className="bg-transparent text-xs text-[#e8d9b0] focus:outline-none cursor-pointer w-full"
              >
                <option value="date-newest">Data: Mais Recentes</option>
                <option value="date-oldest">Data: Mais Antigos</option>
                <option value="name-asc">Nome: A → Z</option>
                <option value="name-desc">Nome: Z → A</option>
                <option value="priority">Prioridade: Maior → Menor</option>
                <option value="status">Status</option>
                <option value="category">Categoria</option>
                <option value="updated">Última Modificação</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1 px-3 py-2 rounded-lg border border-[#c0392b]/40 text-xs text-[#e74c3c] hover:bg-[#c0392b]/10 transition-colors whitespace-nowrap"
                title="Limpar todos os filtros"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Limpar</span>
              </button>
            )}
          </div>
        </div>

        {/* Row 2: Status & Priority Chips */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#3d2f1f]/60 text-xs">
          
          {/* Status chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#8a7c5c] font-cinzel mr-1">Status:</span>
            {[
              { id: 'PENDING', label: '⏳ Pendente' },
              { id: 'IN_PROGRESS', label: '🔄 Em Progresso' },
              { id: 'COMPLETED', label: '✅ Concluído' }
            ].map(st => {
              const isSelected = filters.status.includes(st.id as AssetStatus);
              return (
                <button
                  key={st.id}
                  onClick={() => toggleStatusFilter(st.id as AssetStatus)}
                  className={`px-2.5 py-1 rounded-md border text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-[#c9a961] bg-[#1c170f] text-[#f0d98c] font-bold shadow-sm'
                      : 'border-[#3d2f1f] bg-[#0a0a0a] text-[#8a7c5c] hover:border-[#8a7c5c]'
                  }`}
                >
                  {st.label}
                </button>
              );
            })}
          </div>

          {/* Priority chips */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[#8a7c5c] font-cinzel mr-1">Prioridade:</span>
            {[
              { id: 'CRITICAL', label: '🔥 Crítica' },
              { id: 'HIGH', label: '⬆️ Alta' },
              { id: 'MEDIUM', label: '➡️ Média' },
              { id: 'LOW', label: '⬇️ Baixa' }
            ].map(p => {
              const isSelected = filters.priority.includes(p.id as Priority);
              return (
                <button
                  key={p.id}
                  onClick={() => togglePriorityFilter(p.id as Priority)}
                  className={`px-2 py-1 rounded-md border text-xs font-medium transition-all ${
                    isSelected
                      ? 'border-[#c9a961] bg-[#1c170f] text-[#f0d98c] font-bold shadow-sm'
                      : 'border-[#3d2f1f] bg-[#0a0a0a] text-[#8a7c5c] hover:border-[#8a7c5c]'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Row 3: Category filter pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
          <span className="text-[#8a7c5c] text-xs font-cinzel mr-1 shrink-0">Categorias:</span>
          {categories.map(cat => {
            const isSelected = filters.categories.includes(cat);
            const details = CATEGORY_DETAILS[cat];
            return (
              <button
                key={cat}
                onClick={() => toggleCategoryFilter(cat)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium transition-all shrink-0 border ${
                  isSelected
                    ? 'border-[#c9a961] bg-[#1c170f] text-[#f0d98c] font-bold'
                    : 'border-[#3d2f1f] bg-[#0a0a0a] text-[#8a7c5c] hover:border-[#8a7c5c]'
                }`}
              >
                {details.singular}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      {filteredAssets.length === 0 ? (
        <div className="py-16 text-center rounded-2xl bg-[#141414] border border-[#3d2f1f] p-8 medieval-frame">
          <div className="w-16 h-16 mx-auto mb-3 text-[#c9a961]/40 flex items-center justify-center">
            ⚔️
          </div>
          <h3 className="text-lg font-cinzel font-bold text-[#e8d9b0]">
            Nenhum Asset Encontrado
          </h3>
          <p className="text-xs text-[#8a7c5c] max-w-md mx-auto mt-1 mb-6">
            Nenhum item corresponde aos filtros selecionados. Tente ajustar os parâmetros de busca ou crie um novo asset.
          </p>
          <div className="flex items-center justify-center gap-3">
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-4 py-2 rounded-lg border border-[#3d2f1f] bg-[#1a1a1a] text-xs text-[#8a7c5c] hover:text-[#e8d9b0]"
              >
                Limpar Filtros
              </button>
            )}
            <button
              onClick={() => {
                sounds.playClick();
                setIsCreateModalOpen(true);
              }}
              className="px-5 py-2 rounded-lg font-cinzel font-bold text-xs bg-[#c9a961] text-black"
            >
              ➕ Criar Novo Asset
            </button>
          </div>
        </div>
      ) : filters.viewMode === 'grid' ? (
        
        // ==========================================
        // 1. MODO GRID (CARDS RESPONSIVOS)
        // ==========================================
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredAssets.map((asset: Asset) => {
            const isSelected = selectedAssetIds.includes(asset.id);

            return (
              <div
                key={asset.id}
                onClick={e => handleAssetClick(asset, e)}
                className={`relative group rounded-xl p-4 transition-all duration-300 cursor-pointer medieval-frame ${
                  isSelected
                    ? 'border-[#c9a961] bg-[#1c170f] shadow-[0_0_15px_rgba(201,169,97,0.2)]'
                    : 'bg-[#141414] border-[#3d2f1f] hover:border-[#c9a961]/60 hover:shadow-[0_0_20px_rgba(201,169,97,0.15)] hover:-translate-y-1'
                }`}
              >
                <div className="corner-ornament-tl" />
                <div className="corner-ornament-tr" />
                <div className="corner-ornament-bl" />
                <div className="corner-ornament-br" />

                {/* Top bar with checkbox + actions */}
                <div className="flex items-center justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => toggleSelectAsset(asset.id)}
                      onClick={e => e.stopPropagation()}
                      className="ignore-card-click rounded border-[#3d2f1f] text-[#c9a961] focus:ring-0 focus:ring-offset-0 bg-[#0a0a0a] cursor-pointer w-4 h-4"
                    />
                    <OriginBadge origin={asset.origin} size="sm" />
                  </div>

                  <div className="flex items-center gap-1 ignore-card-click">
                    <PriorityBadge priority={asset.priority} size="sm" showLabel={false} />
                    
                    {/* Quick 3-dots actions menu */}
                    <div className="relative">
                      <button
                        onClick={e => {
                          e.stopPropagation();
                          sounds.playClick();
                          setActiveMenuAssetId(activeMenuAssetId === asset.id ? null : asset.id);
                        }}
                        className="p-1 rounded text-[#8a7c5c] hover:text-[#e8d9b0] hover:bg-[#1f1f1f] transition-colors"
                      >
                        <MoreVertical size={14} />
                      </button>

                      {activeMenuAssetId === asset.id && (
                        <div 
                          className="absolute right-0 top-full mt-1 w-36 bg-[#141414] border border-[#c9a961] rounded-lg shadow-xl z-20 py-1 text-xs medieval-frame divide-y divide-[#3d2f1f]"
                          onClick={e => e.stopPropagation()}
                        >
                          <button
                            onClick={() => {
                              setActiveModalAsset(asset);
                              setIsDetailModalOpen(true);
                              setActiveMenuAssetId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[#e8d9b0] hover:bg-[#1c170f] flex items-center gap-2"
                          >
                            <Edit size={12} className="text-[#c9a961]" />
                            <span>Ver Detalhes</span>
                          </button>
                          <button
                            onClick={() => {
                              duplicateAsset(asset.id);
                              setActiveMenuAssetId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[#e8d9b0] hover:bg-[#1c170f] flex items-center gap-2"
                          >
                            <Copy size={12} className="text-[#3498db]" />
                            <span>Duplicar</span>
                          </button>
                          <button
                            onClick={() => {
                              setAssetToDelete(asset);
                              setActiveMenuAssetId(null);
                            }}
                            className="w-full text-left px-3 py-1.5 text-[#e74c3c] hover:bg-[#240e0e] flex items-center gap-2"
                          >
                            <Trash2 size={12} className="text-[#e74c3c]" />
                            <span>Deletar</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Preview Image / Large Icon */}
                <div className="flex items-center justify-center my-3 py-2">
                  <AssetIcon asset={asset} size="lg" />
                </div>

                {/* Info & Badges */}
                <div className="space-y-2">
                  <h4 className="text-sm font-cinzel font-bold text-[#e8d9b0] group-hover:text-[#f0d98c] transition-colors truncate">
                    {asset.name}
                  </h4>

                  <div className="flex items-center justify-between gap-2 text-xs">
                    <CategoryBadge category={asset.category} size="sm" />
                    <StatusBadge status={asset.status} size="sm" />
                  </div>

                  {asset.originalReference && (
                    <p className="text-[10px] text-[#8a7c5c] font-mono truncate">
                      Ref: {asset.originalReference}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : filters.viewMode === 'list' ? (

        // ==========================================
        // 2. MODO LISTA / TABELA CLEAN
        // ==========================================
        <div className="rounded-xl border border-[#3d2f1f] bg-[#141414] overflow-hidden medieval-frame shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#3d2f1f] bg-[#0d0d0d] text-[#8a7c5c] font-cinzel">
                  <th className="p-3 w-10">
                    <input
                      type="checkbox"
                      checked={selectedAssetIds.length === filteredAssets.length && filteredAssets.length > 0}
                      onChange={() => {
                        if (selectedAssetIds.length === filteredAssets.length) {
                          clearSelection();
                        } else {
                          selectAllAssets();
                        }
                      }}
                      className="rounded border-[#3d2f1f] text-[#c9a961] focus:ring-0 bg-[#0a0a0a] cursor-pointer"
                    />
                  </th>
                  <th className="p-3 w-12 text-center">Ícone</th>
                  <th className="p-3">Nome do Asset</th>
                  <th className="p-3">Categoria</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Prioridade</th>
                  <th className="p-3">Origem</th>
                  <th className="p-3">Ref. Original / Path</th>
                  <th className="p-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#3d2f1f]/50">
                {filteredAssets.map((asset: Asset, idx: number) => {
                  const isSelected = selectedAssetIds.includes(asset.id);
                  return (
                    <tr
                      key={asset.id}
                      onClick={e => handleAssetClick(asset, e)}
                      className={`transition-colors cursor-pointer ${
                        isSelected 
                          ? 'bg-[#1c170f]/90' 
                          : idx % 2 === 0 ? 'bg-[#141414] hover:bg-[#1a1a1a]' : 'bg-[#0f0f0f] hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <td className="p-3 ignore-card-click" onClick={e => e.stopPropagation()}>
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => toggleSelectAsset(asset.id)}
                          className="rounded border-[#3d2f1f] text-[#c9a961] focus:ring-0 bg-[#0a0a0a] cursor-pointer"
                        />
                      </td>

                      <td className="p-3 text-center">
                        <AssetIcon asset={asset} size="sm" className="mx-auto" />
                      </td>

                      <td className="p-3">
                        <span className="font-cinzel font-bold text-[#e8d9b0] hover:text-[#f0d98c] block truncate max-w-xs">
                          {asset.name}
                        </span>
                        {asset.subcategory && (
                          <span className="text-[10px] text-[#8a7c5c] font-mono block">
                            {asset.subcategory}
                          </span>
                        )}
                      </td>

                      <td className="p-3">
                        <CategoryBadge category={asset.category} size="sm" />
                      </td>

                      <td className="p-3">
                        <StatusBadge status={asset.status} size="sm" />
                      </td>

                      <td className="p-3">
                        <PriorityBadge priority={asset.priority} size="sm" />
                      </td>

                      <td className="p-3">
                        <OriginBadge origin={asset.origin} size="sm" />
                      </td>

                      <td className="p-3 font-mono text-[11px] text-[#8a7c5c] truncate max-w-xs">
                        {asset.originalReference || asset.targetPath || '—'}
                      </td>

                      <td className="p-3 text-right ignore-card-click" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              duplicateAsset(asset.id);
                            }}
                            className="p-1 rounded text-[#8a7c5c] hover:text-[#3498db] transition-colors"
                            title="Duplicar"
                          >
                            <Copy size={13} />
                          </button>
                          <button
                            onClick={() => {
                              setActiveModalAsset(asset);
                              setIsDetailModalOpen(true);
                            }}
                            className="p-1 rounded text-[#8a7c5c] hover:text-[#c9a961] transition-colors"
                            title="Editar / Ver"
                          >
                            <Edit size={13} />
                          </button>
                          <button
                            onClick={() => setAssetToDelete(asset)}
                            className="p-1 rounded text-[#8a7c5c] hover:text-[#e74c3c] transition-colors"
                            title="Deletar"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (

        // ==========================================
        // 3. MODO KANBAN BOARD (DRAG / MOVE)
        // ==========================================
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {(['PENDING', 'IN_PROGRESS', 'COMPLETED'] as AssetStatus[]).map(columnStatus => {
            const colAssets = filteredAssets.filter((a: Asset) => a.status === columnStatus);
            const colConfig = {
              PENDING: { label: '⏳ Pendente', color: '#bdc3c7', border: 'border-[#7f8c8d]/40', bg: 'bg-[#141414]' },
              IN_PROGRESS: { label: '🔄 Em Progresso', color: '#f1c40f', border: 'border-[#f39c12]/40', bg: 'bg-[#141414]' },
              COMPLETED: { label: '✅ Concluído', color: '#2ecc71', border: 'border-[#27ae60]/40', bg: 'bg-[#141414]' }
            }[columnStatus];

            return (
              <div
                key={columnStatus}
                className={`p-4 rounded-xl border ${colConfig.border} ${colConfig.bg} shadow-lg flex flex-col min-h-[500px] medieval-frame`}
              >
                {/* Column Header */}
                <div className="flex items-center justify-between pb-3 mb-4 border-b border-[#3d2f1f]">
                  <h3 className="text-sm font-cinzel font-bold text-[#e8d9b0] flex items-center gap-2">
                    <span>{colConfig.label}</span>
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-[#0a0a0a] border border-[#3d2f1f] text-xs font-mono text-[#c9a961] font-bold">
                    {colAssets.length}
                  </span>
                </div>

                {/* Column Asset Cards */}
                <div className="space-y-3 flex-1 overflow-y-auto max-h-[650px] pr-1">
                  {colAssets.map((asset: Asset) => (
                    <div
                      key={asset.id}
                      onClick={e => handleAssetClick(asset, e)}
                      className="p-3 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] hover:border-[#c9a961]/60 cursor-pointer transition-all hover:-translate-y-0.5 shadow-sm group"
                    >
                      <div className="flex items-start gap-3">
                        <AssetIcon asset={asset} size="sm" className="shrink-0 mt-0.5" />
                        <div className="min-w-0 flex-1">
                          <h4 className="text-xs font-cinzel font-bold text-[#e8d9b0] group-hover:text-[#f0d98c] transition-colors truncate">
                            {asset.name}
                          </h4>
                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <CategoryBadge category={asset.category} size="sm" />
                            <PriorityBadge priority={asset.priority} size="sm" showLabel={false} />
                          </div>
                        </div>
                      </div>

                      {/* Quick Move Buttons */}
                      <div className="mt-3 pt-2 border-t border-[#3d2f1f]/50 flex items-center justify-between text-[10px] ignore-card-click">
                        <span className="text-[#8a7c5c]">Mover para:</span>
                        <div className="flex items-center gap-1">
                          {columnStatus !== 'PENDING' && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                updateAssetStatus(asset.id, 'PENDING');
                              }}
                              className="px-1.5 py-0.5 rounded bg-[#1a1a1a] hover:bg-[#2a2a2a] text-[#bdc3c7]"
                              title="Mover para Pendente"
                            >
                              ⏳ Pendente
                            </button>
                          )}
                          {columnStatus !== 'IN_PROGRESS' && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                updateAssetStatus(asset.id, 'IN_PROGRESS');
                              }}
                              className="px-1.5 py-0.5 rounded bg-[#291f0e] hover:bg-[#3d2f1f] text-[#f1c40f]"
                              title="Mover para Em Progresso"
                            >
                              🔄 Em Progresso
                            </button>
                          )}
                          {columnStatus !== 'COMPLETED' && (
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                updateAssetStatus(asset.id, 'COMPLETED');
                              }}
                              className="px-1.5 py-0.5 rounded bg-[#0e2417] hover:bg-[#1a3826] text-[#2ecc71]"
                              title="Mover para Concluído"
                            >
                              ✅ Concluído
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}

                  {colAssets.length === 0 && (
                    <div className="py-8 text-center text-[#8a7c5c] text-xs">
                      Nenhum asset nesta coluna
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Floating Bulk Actions Bar (When items selected) */}
      {selectedAssetIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 w-11/12 max-w-2xl bg-[#141414] border border-[#c9a961] rounded-2xl shadow-[0_0_40px_rgba(201,169,97,0.35)] p-3.5 flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-bottom-5 medieval-frame">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-[#c9a961] text-black font-mono font-bold text-xs">
              {selectedAssetIds.length}
            </span>
            <span className="text-xs font-cinzel font-semibold text-[#e8d9b0]">
              Assets Selecionados
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => bulkUpdateStatus('COMPLETED')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#0e2417] border border-[#27ae60] text-xs text-[#2ecc71] hover:brightness-125 transition-all"
            >
              <CheckCircle2 size={13} />
              <span>Concluir</span>
            </button>

            <button
              onClick={() => bulkUpdateStatus('IN_PROGRESS')}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#291f0e] border border-[#f39c12] text-xs text-[#f1c40f] hover:brightness-125 transition-all"
            >
              <Loader2 size={13} />
              <span>Em Progresso</span>
            </button>

            <button
              onClick={() => setIsConfirmBulkDeleteOpen(true)}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-[#240e0e] border border-[#c0392b] text-xs text-[#e74c3c] hover:brightness-125 transition-all"
            >
              <Trash2 size={13} />
              <span>Deletar</span>
            </button>

            <button
              onClick={clearSelection}
              className="p-1.5 text-[#8a7c5c] hover:text-[#e8d9b0] ml-1"
              title="Desmarcar todos"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Delete Confirmation Single */}
      {assetToDelete && (
        <ConfirmDialog
          isOpen={Boolean(assetToDelete)}
          title="Destruir Asset?"
          message={`Tem certeza que deseja excluir "${assetToDelete.name}" do MMORPG?`}
          confirmLabel="Excluir"
          isDanger={true}
          onConfirm={() => {
            deleteAsset(assetToDelete.id);
            setAssetToDelete(null);
          }}
          onCancel={() => setAssetToDelete(null)}
        />
      )}

      {/* Delete Confirmation Bulk */}
      <ConfirmDialog
        isOpen={isConfirmBulkDeleteOpen}
        title="Excluir Múltiplos Assets?"
        message={`Deseja realmente remover os ${selectedAssetIds.length} assets selecionados permanentemente?`}
        confirmLabel="Sim, Excluir Todos"
        isDanger={true}
        onConfirm={() => {
          deleteMultipleAssets(selectedAssetIds);
          setIsConfirmBulkDeleteOpen(false);
        }}
        onCancel={() => setIsConfirmBulkDeleteOpen(false)}
      />
    </div>
  );
};
