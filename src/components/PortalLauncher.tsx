import React from 'react';
import { 
  Wallet, 
  Sword, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles
} from 'lucide-react';
import { sounds } from '../modules/requiem/utils/soundEffects';

interface PortalLauncherProps {
  onSelectApp: (app: 'financial' | 'requiem') => void;
}

export const PortalLauncher: React.FC<PortalLauncherProps> = ({ onSelectApp }) => {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col justify-between p-4 sm:p-8 selection:bg-amber-500 selection:text-black">
      
      {/* Top Header */}
      <div className="max-w-6xl w-full mx-auto text-center pt-6 sm:pt-10">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-amber-400 font-mono mb-4 shadow-sm">
          <Sparkles size={14} className="text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>PORTAL DE DEMONSTRATIVOS — DANIEL SILVA</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-white to-emerald-300">
          Selecione o Sistema Demonstrativo
        </h1>

        <p className="text-sm sm:text-base text-slate-400 max-w-2xl mx-auto mt-3">
          Escolha qual aplicação deseja testar e visualizar. Você pode alternar livremente entre os sistemas a qualquer momento através da barra superior.
        </p>
      </div>

      {/* Main Choice Cards Grid */}
      <div className="max-w-5xl w-full mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 my-8">
        
        {/* Card 1: Controle de Caixa (FluxoPro) */}
        <div 
          onClick={() => {
            sounds.playClick();
            onSelectApp('financial');
          }}
          className="relative group rounded-2xl bg-gradient-to-b from-slate-900 via-slate-900/95 to-slate-950 border border-slate-800 hover:border-emerald-500 p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.2)] flex flex-col justify-between cursor-pointer hover:-translate-y-1"
        >
          {/* Badge */}
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400">
              💼 Gestão Empresarial
            </span>
            <span className="text-xs font-mono text-slate-500">v2.4 Pro</span>
          </div>

          {/* Hero Icon */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Wallet size={28} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white group-hover:text-emerald-400 transition-colors">
                Controle de Caixa
              </h2>
              <span className="text-xs text-slate-400 font-mono">FluxoPro & Financeiro</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-6">
            Sistema completo de controle de fluxo de caixa, entradas, saídas, contas a pagar e receber, relatórios gerenciais em PDF/Excel e gráficos para pequenas empresas.
          </p>

          {/* Features Highlights */}
          <div className="space-y-2 mb-8 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Fluxo de Caixa Diário, Mensal e Anual</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Contas a Pagar & Receber com Conciliação</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Relatórios e Exportação para PDF e Excel (.xlsx)</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 size={14} className="text-emerald-400 shrink-0" />
              <span>Gráficos de evolução de saldo e métodos de pagamento</span>
            </div>
          </div>

          {/* Action CTA */}
          <button
            type="button"
            className="w-full py-3.5 px-6 rounded-xl font-bold text-sm bg-gradient-to-r from-emerald-600 to-teal-600 text-white group-hover:from-emerald-500 group-hover:to-teal-500 shadow-lg shadow-emerald-950/50 transition-all flex items-center justify-center gap-2"
          >
            <span>Acessar Controle de Caixa</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Card 2: Requiem of Legends (Asset Manager) */}
        <div 
          onClick={() => {
            sounds.playBlessChime();
            onSelectApp('requiem');
          }}
          className="relative group rounded-2xl bg-gradient-to-b from-[#17120a] via-[#1c150b] to-[#0f0b06] border border-[#3d2f1f] hover:border-[#c9a961] p-6 sm:p-8 transition-all duration-300 hover:shadow-[0_0_45px_rgba(201,169,97,0.25)] flex flex-col justify-between cursor-pointer hover:-translate-y-1 medieval-frame"
        >
          <div className="corner-ornament-tl" />
          <div className="corner-ornament-tr" />
          <div className="corner-ornament-bl" />
          <div className="corner-ornament-br" />

          {/* Badge */}
          <div className="flex items-center justify-between mb-6">
            <span className="px-3 py-1 rounded-full text-xs font-cinzel font-bold bg-[#c9a961]/15 border border-[#c9a961]/30 text-[#f0d98c]">
              ⚔️ Dark Fantasy MMORPG
            </span>
            <span className="text-xs font-mono text-[#8a7c5c]">104 Assets</span>
          </div>

          {/* Hero Icon */}
          <div className="flex items-center gap-4 mb-5">
            <div className="w-14 h-14 rounded-2xl bg-[#1c170f] border border-[#c9a961] text-[#c9a961] flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
              <Sword size={28} className="transform -rotate-45 drop-shadow-[0_0_8px_#c9a961]" />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#f0d98c] group-hover:text-white transition-colors">
                Requiem Asset Manager
              </h2>
              <span className="text-xs text-[#8a7c5c] font-mono">MU Online × WYD (Kersef)</span>
            </div>
          </div>

          <p className="text-xs sm:text-sm text-[#e8d9b0] leading-relaxed mb-6">
            Painel do Game Director Daniel Silva para gerenciar a produção de itens, monstros, mapas, efeitos sonoros (Jewel of Bless), UI e animações do MMORPG Requiem of Legends.
          </p>

          {/* Features Highlights */}
          <div className="space-y-2 mb-8 bg-[#0a0a0a]/80 p-4 rounded-xl border border-[#3d2f1f] text-xs">
            <div className="flex items-center gap-2 text-[#e8d9b0]">
              <CheckCircle2 size={14} className="text-[#c9a961] shrink-0" />
              <span>104 Assets Iniciais Cadastrados (8 Módulos)</span>
            </div>
            <div className="flex items-center gap-2 text-[#e8d9b0]">
              <CheckCircle2 size={14} className="text-[#c9a961] shrink-0" />
              <span>3 Visualizações: Grade, Tabela e Kanban Board</span>
            </div>
            <div className="flex items-center gap-2 text-[#e8d9b0]">
              <CheckCircle2 size={14} className="text-[#c9a961] shrink-0" />
              <span>Efeitos Sonoros Web Audio (Bless Chime, Fanfarras)</span>
            </div>
            <div className="flex items-center gap-2 text-[#e8d9b0]">
              <CheckCircle2 size={14} className="text-[#c9a961] shrink-0" />
              <span>Biblioteca de Ferramentas de Extração MU/WYD e IAs</span>
            </div>
          </div>

          {/* Action CTA */}
          <button
            type="button"
            className="w-full py-3.5 px-6 rounded-xl font-cinzel font-bold text-sm bg-gradient-to-r from-[#c9a961] to-[#8b7c4f] text-black group-hover:brightness-110 shadow-lg shadow-amber-950/60 transition-all flex items-center justify-center gap-2"
          >
            <span>Acessar Requiem Manager</span>
            <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>

      {/* Footer info */}
      <div className="text-center text-xs text-slate-500 pb-4">
        <span>Desenvolvido por Daniel Silva • Ambos os demonstrativos integrados com persistência local independente.</span>
      </div>
    </div>
  );
};
