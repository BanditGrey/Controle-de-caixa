import React from 'react';
import { useAssets } from '../context/AssetContext';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend 
} from 'recharts';
import { 
  Zap, 
  Calendar, 
  Sparkles, 
  Flame, 
  Trophy, 
  Target
} from 'lucide-react';
import { Asset, AssetCategory } from '../types';
import { CATEGORY_DETAILS } from '../utils/formatters';
import { AssetIcon } from '../components/common/AssetIcon';
import { sounds } from '../utils/soundEffects';

export const ProgressAnalytics: React.FC = () => {
  const { assets, stats, triggerCelebration } = useAssets();

  // Status chart data
  const statusData = [
    { name: 'Concluído', value: stats.completed, color: '#27ae60' },
    { name: 'Em Progresso', value: stats.inProgress, color: '#f39c12' },
    { name: 'Pendente', value: stats.pending, color: '#7f8c8d' }
  ];

  // Category completion data for bar chart
  const categories: AssetCategory[] = ['ITEM', 'MONSTER', 'MAP', 'ANIMATION', 'SOUND', 'UI', 'CHARACTER', 'EFFECT'];
  const categoryChartData = categories.map(cat => {
    const s = stats.byCategory[cat];
    return {
      name: CATEGORY_DETAILS[cat].singular,
      concluido: s.completed,
      progresso: s.inProgress,
      pendente: s.pending,
      total: s.total
    };
  });

  // Origin distribution data
  const originCounts = assets.reduce((acc: Record<string, number>, a: Asset) => {
    acc[a.origin] = (acc[a.origin] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const originData = [
    { name: 'MU Online', value: originCounts['MU'] || 0, color: '#c9a961' },
    { name: 'WYD (Kersef)', value: originCounts['WYD'] || 0, color: '#3498db' },
    { name: 'Original Requiem', value: originCounts['CUSTOM'] || 0, color: '#9b59b6' },
    { name: 'Gerado via IA', value: originCounts['AI_GENERATED'] || 0, color: '#1abc9c' },
    { name: 'Marketplace', value: originCounts['PURCHASED'] || 0, color: '#e67e22' },
    { name: 'Free / CC', value: originCounts['FREE_LICENSE'] || 0, color: '#2ecc71' }
  ].filter(d => d.value > 0);

  // Leaderboard ranking by completion percentage
  const categoryRanking = [...categories].sort((a, b) => {
    return stats.byCategory[b].pct - stats.byCategory[a].pct;
  });

  // Estimated days remaining (simple velocity calculation)
  const remainingAssets = stats.total - stats.completed;
  const estimatedDays = Math.max(1, Math.ceil(remainingAssets / 1.8));

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#f0d98c] flex items-center gap-2">
            <span>MÉTRICAS & ANÁLISE DE PROGRESSO</span>
          </h2>
          <p className="text-xs text-[#8a7c5c] mt-0.5">
            Estatísticas detalhadas de desenvolvimento, velocidade de entrega e estimativas para o MMORPG.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playLevelUp();
            triggerCelebration();
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-cinzel font-bold text-xs bg-gradient-to-r from-[#c9a961] to-[#8b7c4f] text-black hover:brightness-110 shadow-md shadow-[#c9a961]/25 transition-all cursor-pointer"
        >
          <Sparkles size={16} />
          <span>Celebrar Conquistas</span>
        </button>
      </div>

      {/* Velocity & Estimates Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Velocidade Média */}
        <div className="p-5 rounded-xl bg-[#141414] border border-[#3d2f1f] shadow-md medieval-frame">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-cinzel text-[#8a7c5c] uppercase">Velocidade Média</span>
            <Zap size={18} className="text-[#f1c40f]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#f0d98c]">1.8</span>
            <span className="text-xs text-[#8a7c5c]">assets / dia</span>
          </div>
          <p className="text-[11px] text-[#8a7c5c] mt-2">Ritmo constante de desenvolvimento</p>
        </div>

        {/* Previsão de Conclusão */}
        <div className="p-5 rounded-xl bg-[#141414] border border-[#3d2f1f] shadow-md medieval-frame">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-cinzel text-[#8a7c5c] uppercase">Estimativa de Entrega</span>
            <Calendar size={18} className="text-[#3498db]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#3498db]">~{estimatedDays}</span>
            <span className="text-xs text-[#8a7c5c]">dias restantes</span>
          </div>
          <p className="text-[11px] text-[#8a7c5c] mt-2">Para fechar os 104 assets do MVP</p>
        </div>

        {/* Taxa de Conclusão */}
        <div className="p-5 rounded-xl bg-[#141414] border border-[#3d2f1f] shadow-md medieval-frame">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-cinzel text-[#8a7c5c] uppercase">Eficiência Geral</span>
            <Target size={18} className="text-[#2ecc71]" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#2ecc71]">{stats.completionPercentage}%</span>
            <span className="text-xs text-[#8a7c5c]">concluído</span>
          </div>
          <p className="text-[11px] text-[#8a7c5c] mt-2">{stats.completed} de {stats.total} finalizados</p>
        </div>

        {/* Assets Críticos */}
        <div className="p-5 rounded-xl bg-[#141414] border border-[#3d2f1f] shadow-md medieval-frame">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-cinzel text-[#8a7c5c] uppercase">Prioridade Máxima</span>
            <Flame size={18} className="text-[#e74c3c] animate-pulse" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-mono font-bold text-[#e74c3c]">{stats.criticalPending}</span>
            <span className="text-xs text-[#8a7c5c]">críticos pendentes</span>
          </div>
          <p className="text-[11px] text-[#8a7c5c] mt-2">Exigem atenção prioritária</p>
        </div>
      </div>

      {/* Interactive Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Gráfico de Pizza: Distribuição por Status */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#3d2f1f] shadow-xl medieval-frame">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-cinzel font-bold text-[#f0d98c] uppercase tracking-wider">
              Distribuição por Status de Criação
            </h3>
            <span className="text-xs font-mono text-[#8a7c5c]">Total: {stats.total}</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={95}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="#0a0a0a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141414',
                    borderColor: '#c9a961',
                    borderRadius: '8px',
                    color: '#e8d9b0',
                    fontSize: '12px',
                    fontFamily: 'Roboto Mono'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-center gap-6 mt-4 text-xs font-mono">
            {statusData.map(item => (
              <div key={item.name} className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#8a7c5c]">{item.name}:</span>
                <span className="font-bold text-[#e8d9b0]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Gráfico: Origem dos Assets (MU vs WYD vs Custom) */}
        <div className="p-6 rounded-2xl bg-[#141414] border border-[#3d2f1f] shadow-xl medieval-frame">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-cinzel font-bold text-[#f0d98c] uppercase tracking-wider">
              Distribuição por Fonte / Origem
            </h3>
            <span className="text-xs font-mono text-[#8a7c5c]">Inspiração Clássica</span>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={originData}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="value"
                >
                  {originData.map((entry, index) => (
                    <Cell key={`origin-cell-${index}`} fill={entry.color} stroke="#0a0a0a" strokeWidth={2} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#141414',
                    borderColor: '#c9a961',
                    borderRadius: '8px',
                    color: '#e8d9b0',
                    fontSize: '12px'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-4 text-xs font-mono">
            {originData.map(item => (
              <div key={item.name} className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-[#8a7c5c]">{item.name}:</span>
                <span className="font-bold text-[#e8d9b0]">{item.value}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Progress Bars Chart */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#3d2f1f] shadow-xl medieval-frame">
        <h3 className="text-sm font-cinzel font-bold text-[#f0d98c] uppercase tracking-wider mb-6">
          Volume de Assets por Categoria
        </h3>

        <div className="h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
              <XAxis dataKey="name" stroke="#8a7c5c" fontSize={11} tickLine={false} />
              <YAxis stroke="#8a7c5c" fontSize={11} tickLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#141414',
                  borderColor: '#c9a961',
                  borderRadius: '8px',
                  color: '#e8d9b0',
                  fontSize: '12px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#8a7c5c' }} />
              <Bar dataKey="concluido" name="Concluído" fill="#27ae60" radius={[4, 4, 0, 0]} />
              <Bar dataKey="progresso" name="Em Progresso" fill="#f39c12" radius={[4, 4, 0, 0]} />
              <Bar dataKey="pendente" name="Pendente" fill="#3d2f1f" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Leaderboard Ranking */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#c9a961]/40 shadow-xl medieval-frame">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={20} className="text-[#f1c40f]" />
            <h3 className="text-base font-cinzel font-bold text-[#f0d98c]">
              Ranking de Conclusão por Módulo
            </h3>
          </div>
          <span className="text-xs text-[#8a7c5c]">Mais completos primeiro</span>
        </div>

        <div className="space-y-3">
          {categoryRanking.map((cat, idx) => {
            const details = CATEGORY_DETAILS[cat];
            const s = stats.byCategory[cat];

            return (
              <div
                key={cat}
                className="flex items-center justify-between gap-4 p-3.5 rounded-xl bg-[#0d0d0d] border border-[#3d2f1f] hover:border-[#c9a961]/40 transition-colors"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-6 text-center font-cinzel font-bold text-sm ${
                    idx === 0 ? 'text-[#f1c40f]' : idx === 1 ? 'text-[#bdc3c7]' : idx === 2 ? 'text-[#cd7f32]' : 'text-[#8a7c5c]'
                  }`}>
                    {idx + 1}º
                  </span>
                  <AssetIcon category={cat} size="sm" />
                  <div className="min-w-0">
                    <h4 className="text-xs sm:text-sm font-cinzel font-bold text-[#e8d9b0] truncate">
                      {details.label}
                    </h4>
                    <span className="text-[10px] text-[#8a7c5c] font-mono">
                      {s.completed} de {s.total} finalizados
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 shrink-0">
                  <div className="hidden sm:block w-32 h-2 rounded-full bg-[#1a1a1a] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${s.pct}%`,
                        backgroundColor: s.pct >= 70 ? '#27ae60' : details.color
                      }}
                    />
                  </div>

                  <span className="text-sm font-mono font-bold text-[#c9a961] w-12 text-right">
                    {s.pct}%
                  </span>

                  {s.pct >= 70 && (
                    <span className="hidden md:inline text-xs text-[#2ecc71] font-semibold">
                      🎉 Quase lá!
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
