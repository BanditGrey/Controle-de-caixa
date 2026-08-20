import React, { useState } from 'react';
import { useAssets } from '../context/AssetContext';
import { 
  Layers, 
  CheckCircle2, 
  Loader2, 
  Clock, 
  Plus, 
  ArrowRight, 
  Sparkles, 
  Flame, 
  Compass, 
  Quote, 
  RefreshCw,
  TrendingUp,
  Dices
} from 'lucide-react';
import { AssetIcon } from '../components/common/AssetIcon';
import { StatusBadge, PriorityBadge } from '../components/common/Badge';
import { LORE_QUOTES } from '../data/quotes';
import { CATEGORY_DETAILS, formatRelativeTime } from '../utils/formatters';
import { Asset, AssetCategory } from '../types';
import { sounds } from '../utils/soundEffects';

export const Dashboard: React.FC = () => {
  const { 
    assets, 
    stats, 
    projectSettings, 
    setActiveTab, 
    setFilters, 
    setIsCreateModalOpen, 
    setIsRandomModalOpen,
    setActiveModalAsset,
    setIsDetailModalOpen 
  } = useAssets();

  const [quoteIndex, setQuoteIndex] = useState(0);

  const currentQuote = LORE_QUOTES[quoteIndex % LORE_QUOTES.length];

  const handleNextQuote = () => {
    sounds.playClick();
    setQuoteIndex(prev => prev + 1);
  };

  // Recent 5 modified assets
  const recentAssets = [...assets]
    .sort((a: Asset, b: Asset) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, 5);

  // Critical pending assets
  const criticalPendingAssets = assets
    .filter(a => a.status !== 'COMPLETED' && (a.priority === 'CRITICAL' || a.priority === 'HIGH'))
    .slice(0, 4);

  const categories: AssetCategory[] = ['ITEM', 'MONSTER', 'MAP', 'ANIMATION', 'SOUND', 'UI', 'CHARACTER', 'EFFECT'];

  // Color determination for main progress bar
  const getProgressColor = (pct: number) => {
    if (pct >= 70) return 'from-[#27ae60] to-[#2ecc71]';
    if (pct >= 30) return 'from-[#c9a961] to-[#f0d98c]';
    return 'from-[#c0392b] to-[#e74c3c]';
  };

  const handleCategoryClick = (cat: AssetCategory) => {
    sounds.playClick();
    setFilters(prev => ({ ...prev, categories: [cat] }));
    setActiveTab('assets');
  };

  const handleAssetClick = (asset: Asset) => {
    sounds.playClick();
    setActiveModalAsset(asset);
    setIsDetailModalOpen(true);
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Epic Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl border border-[#c9a961]/40 bg-gradient-to-r from-[#17120a] via-[#1f180d] to-[#120e08] p-6 sm:p-8 shadow-[0_0_30px_rgba(0,0,0,0.8)] medieval-frame">
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        {/* Subtle background rune glow */}
        <div className="absolute -right-16 -top-16 w-64 h-64 bg-[#c9a961]/5 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#c9a961]/15 border border-[#c9a961]/30 text-xs font-mono text-[#f0d98c]">
              <Sparkles size={13} className="text-[#c9a961] animate-spin" style={{ animationDuration: '6s' }} />
              <span>PAINEL DO GAME DIRECTOR</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-cinzel font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-[#f0d98c] via-[#c9a961] to-[#8b7c4f]">
              {projectSettings.name}
            </h2>

            <p className="text-xs sm:text-sm text-[#8a7c5c] max-w-2xl leading-relaxed">
              Bem-vindo, <strong className="text-[#e8d9b0]">{projectSettings.director}</strong>. Gerencie o desenvolvimento de todos os assets 2D, 3D, áudio e animações do MMORPG que unirá as lendas de MU Online e WYD.
            </p>
          </div>

          {/* Action CTAs */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => {
                sounds.playClick();
                setIsCreateModalOpen(true);
              }}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-cinzel font-bold text-sm bg-gradient-to-r from-[#c9a961] to-[#8b7c4f] text-black hover:brightness-110 shadow-lg shadow-[#c9a961]/25 transition-all cursor-pointer"
            >
              <Plus size={18} className="stroke-[3]" />
              <span>Forjar Novo Asset</span>
            </button>
            <button
              onClick={() => {
                sounds.playBlessChime();
                setIsRandomModalOpen(true);
              }}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-[#c9a961]/40 bg-[#1c170f] hover:bg-[#2a2214] text-xs font-semibold text-[#f0d98c] transition-all cursor-pointer"
            >
              <Dices size={16} />
              <span>O Que Fazer Agora?</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Total Assets */}
        <div className="relative p-5 rounded-xl bg-[#141414] border border-[#3d2f1f] shadow-md hover:border-[#c9a961]/60 transition-all medieval-frame group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-cinzel text-[#8a7c5c] tracking-wider uppercase">
              Total de Assets
            </span>
            <div className="p-2 rounded-lg bg-[#1c170f] border border-[#c9a961]/30 text-[#c9a961] group-hover:scale-110 transition-transform">
              <Layers size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#e8d9b0]">
              {stats.total}
            </span>
            <span className="text-xs text-[#8a7c5c] font-mono">cadastrados</span>
          </div>
          <div className="mt-3 text-[11px] text-[#8a7c5c] flex items-center justify-between border-t border-[#3d2f1f]/50 pt-2">
            <span>8 categorias</span>
            <span className="text-[#c9a961] font-mono">100% catalogado</span>
          </div>
        </div>

        {/* Concluídos */}
        <div className="relative p-5 rounded-xl bg-[#141414] border border-[#27ae60]/40 shadow-md hover:border-[#27ae60] transition-all medieval-frame group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-cinzel text-[#2ecc71] tracking-wider uppercase font-semibold">
              Concluídos
            </span>
            <div className="p-2 rounded-lg bg-[#0e2417] border border-[#27ae60]/40 text-[#2ecc71] group-hover:scale-110 transition-transform">
              <CheckCircle2 size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#2ecc71]">
              {stats.completed}
            </span>
            <span className="text-xs text-[#2ecc71]/80 font-mono font-semibold">
              ({stats.completionPercentage}%)
            </span>
          </div>
          <div className="mt-3 text-[11px] text-[#8a7c5c] flex items-center justify-between border-t border-[#3d2f1f]/50 pt-2">
            <span>Prontos para o jogo</span>
            <span className="text-[#2ecc71] font-mono font-bold">✓ Aprovados</span>
          </div>
        </div>

        {/* Em Progresso */}
        <div className="relative p-5 rounded-xl bg-[#141414] border border-[#f39c12]/40 shadow-md hover:border-[#f39c12] transition-all medieval-frame group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-cinzel text-[#f1c40f] tracking-wider uppercase font-semibold">
              Em Progresso
            </span>
            <div className="p-2 rounded-lg bg-[#291f0e] border border-[#f39c12]/40 text-[#f1c40f] group-hover:scale-110 transition-transform">
              <Loader2 size={18} className="animate-spin" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#f1c40f]">
              {stats.inProgress}
            </span>
            <span className="text-xs text-[#f1c40f]/80 font-mono">
              ({stats.total > 0 ? Math.round((stats.inProgress / stats.total) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-3 text-[11px] text-[#8a7c5c] flex items-center justify-between border-t border-[#3d2f1f]/50 pt-2">
            <span>Em modelagem / arte</span>
            <span className="text-[#f1c40f] font-mono">Em forja ativa</span>
          </div>
        </div>

        {/* Pendentes */}
        <div className="relative p-5 rounded-xl bg-[#141414] border border-[#3d2f1f] shadow-md hover:border-[#7f8c8d] transition-all medieval-frame group">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-cinzel text-[#8a7c5c] tracking-wider uppercase">
              Pendentes
            </span>
            <div className="p-2 rounded-lg bg-[#1a1a1a] border border-[#3d2f1f] text-[#bdc3c7] group-hover:scale-110 transition-transform">
              <Clock size={18} />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#bdc3c7]">
              {stats.pending}
            </span>
            <span className="text-xs text-[#8a7c5c] font-mono">
              ({stats.total > 0 ? Math.round((stats.pending / stats.total) * 100) : 0}%)
            </span>
          </div>
          <div className="mt-3 text-[11px] text-[#8a7c5c] flex items-center justify-between border-t border-[#3d2f1f]/50 pt-2">
            <span>No backlog</span>
            <span className="text-[#e74c3c] font-mono">{stats.criticalPending} críticos</span>
          </div>
        </div>
      </div>

      {/* Main Golden Progress Bar Card */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#c9a961]/50 shadow-xl medieval-frame">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <div>
            <span className="text-xs font-cinzel font-bold text-[#c9a961] uppercase tracking-wider block">
              Progresso Geral de Criação
            </span>
            <h3 className="text-lg sm:text-xl font-cinzel font-bold text-[#e8d9b0] mt-0.5">
              {stats.completed} de {stats.total} assets concluídos ({stats.completionPercentage}%)
            </h3>
          </div>

          <div className="flex items-center gap-3">
            <span className={`text-xs font-mono px-3 py-1 rounded-full border ${
              stats.completionPercentage >= 70
                ? 'border-[#27ae60] bg-[#0e2417] text-[#2ecc71]'
                : stats.completionPercentage >= 30
                ? 'border-[#c9a961] bg-[#1c170f] text-[#f0d98c]'
                : 'border-[#c0392b] bg-[#240e0e] text-[#e74c3c]'
            }`}>
              {stats.completionPercentage >= 70 ? '🚀 Quase Pronto!' : stats.completionPercentage >= 30 ? '⚔️ A Todo Vapor' : '🔥 Início de Jornada'}
            </span>
          </div>
        </div>

        {/* Large Animated Bar */}
        <div className="relative w-full h-5 rounded-full bg-[#0a0a0a] border border-[#3d2f1f] p-0.5 overflow-hidden shadow-inner">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getProgressColor(stats.completionPercentage)} transition-all duration-1000 relative`}
            style={{ width: `${Math.max(stats.completionPercentage, 2)}%` }}
          >
            {/* Shimmer overlay */}
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>

        {/* Breakdown ticks */}
        <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-[#8a7c5c]">
          <span>0% (Início)</span>
          <span>30% (MVP Básico)</span>
          <span>70% (Alpha Fechado)</span>
          <span>100% (Lançamento MMORPG)</span>
        </div>
      </div>

      {/* Main Grid: Category Progress + Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Category Progress Breakdown */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-cinzel font-bold text-[#f0d98c] flex items-center gap-2">
              <Compass size={18} className="text-[#c9a961]" />
              <span>Progresso por Categoria de Assets</span>
            </h3>
            <button
              onClick={() => setActiveTab('categories')}
              className="text-xs font-cinzel text-[#c9a961] hover:text-[#f0d98c] flex items-center gap-1 transition-colors"
            >
              <span>Ver todas (8)</span>
              <ArrowRight size={13} />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categories.map(cat => {
              const catStat = stats.byCategory[cat];
              const details = CATEGORY_DETAILS[cat];

              return (
                <div
                  key={cat}
                  onClick={() => handleCategoryClick(cat)}
                  className="p-4 rounded-xl bg-[#141414] border border-[#3d2f1f] hover:border-[#c9a961]/60 transition-all cursor-pointer medieval-frame group hover:shadow-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <AssetIcon category={cat} size="sm" />
                      <div className="min-w-0">
                        <h4 className="text-xs font-cinzel font-bold text-[#e8d9b0] group-hover:text-[#f0d98c] truncate transition-colors">
                          {details.label}
                        </h4>
                        <span className="text-[10px] text-[#8a7c5c] font-mono">
                          {catStat.completed}/{catStat.total} concluídos
                        </span>
                      </div>
                    </div>

                    <span className="text-xs font-mono font-bold text-[#c9a961] shrink-0">
                      {catStat.pct}%
                    </span>
                  </div>

                  {/* Horizontal Bar */}
                  <div className="w-full h-2 rounded-full bg-[#0a0a0a] border border-[#3d2f1f] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${catStat.pct}%`,
                        backgroundColor: catStat.pct >= 50 ? details.color : '#8a7c5c'
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Recent Activities & Motivational Lore */}
        <div className="space-y-6">
          
          {/* Motivational Quote Widget */}
          <div className="relative p-5 rounded-xl bg-gradient-to-b from-[#1c170f] to-[#141414] border border-[#c9a961]/40 shadow-md medieval-frame">
            <div className="flex items-center justify-between mb-3 text-[#c9a961]">
              <div className="flex items-center gap-1.5 text-xs font-cinzel font-bold uppercase tracking-wider">
                <Quote size={14} />
                <span>Sabedoria de Requiem</span>
              </div>
              <button
                onClick={handleNextQuote}
                className="p-1 rounded text-[#8a7c5c] hover:text-[#f0d98c] transition-colors"
                title="Próxima frase"
              >
                <RefreshCw size={14} />
              </button>
            </div>

            <blockquote className="text-xs sm:text-sm italic text-[#e8d9b0] leading-relaxed mb-3">
              "{currentQuote.quote}"
            </blockquote>

            <div className="text-right border-t border-[#3d2f1f]/60 pt-2 text-[11px]">
              <span className="font-semibold text-[#f0d98c]">{currentQuote.author}</span>
              <span className="text-[#8a7c5c] block text-[10px]">{currentQuote.source}</span>
            </div>
          </div>

          {/* Últimas Atividades */}
          <div className="p-5 rounded-xl bg-[#141414] border border-[#3d2f1f] shadow-md medieval-frame space-y-3">
            <div className="flex items-center justify-between border-b border-[#3d2f1f] pb-2">
              <h3 className="text-xs font-cinzel font-bold text-[#c9a961] uppercase tracking-wider flex items-center gap-1.5">
                <TrendingUp size={14} />
                <span>Últimas Modificações</span>
              </h3>
              <button
                onClick={() => setActiveTab('assets')}
                className="text-[11px] text-[#8a7c5c] hover:text-[#e8d9b0]"
              >
                Ver todos
              </button>
            </div>

            <div className="space-y-2.5">
              {recentAssets.map((asset: Asset) => (
                <div
                  key={asset.id}
                  onClick={() => handleAssetClick(asset)}
                  className="flex items-center justify-between gap-3 p-2 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f]/50 hover:border-[#c9a961]/40 cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <AssetIcon asset={asset} size="sm" />
                    <div className="min-w-0">
                      <h4 className="text-xs font-cinzel font-semibold text-[#e8d9b0] group-hover:text-[#f0d98c] truncate transition-colors">
                        {asset.name}
                      </h4>
                      <span className="text-[10px] text-[#8a7c5c] font-mono block">
                        {formatRelativeTime(asset.updatedAt)}
                      </span>
                    </div>
                  </div>

                  <StatusBadge status={asset.status} size="sm" />
                </div>
              ))}
            </div>
          </div>

          {/* Critical Watchlist */}
          {criticalPendingAssets.length > 0 && (
            <div className="p-4 rounded-xl bg-[#1f1111]/80 border border-[#c0392b]/40 shadow-md">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-cinzel font-bold text-[#e74c3c] flex items-center gap-1.5">
                  <Flame size={14} className="animate-pulse" />
                  <span>Prioridade Crítica Pendente</span>
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-[#c0392b]/20 text-[#e74c3c] border border-[#c0392b]/40">
                  {criticalPendingAssets.length}
                </span>
              </div>

              <div className="space-y-1.5">
                {criticalPendingAssets.map((item: Asset) => (
                  <div
                    key={item.id}
                    onClick={() => handleAssetClick(item)}
                    className="flex items-center justify-between p-2 rounded bg-[#0d0d0d] border border-[#3d2f1f] hover:border-[#c0392b] cursor-pointer text-xs"
                  >
                    <span className="font-cinzel text-[#e8d9b0] truncate">{item.name}</span>
                    <PriorityBadge priority={item.priority} size="sm" showLabel={false} />
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
