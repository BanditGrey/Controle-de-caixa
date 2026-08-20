import React from 'react';
import { useAssets } from '../../context/AssetContext';
import { 
  Search, 
  Plus, 
  Volume2, 
  VolumeX, 
  Dices, 
  Layers, 
  User, 
  Calendar,
  Sword
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

export const Header: React.FC = () => {
  const { 
    projectSettings, 
    updateProjectSettings, 
    stats, 
    setIsCreateModalOpen, 
    setIsSearchModalOpen,
    setIsRandomModalOpen 
  } = useAssets();

  const toggleSound = () => {
    const nextState = !projectSettings.soundEnabled;
    updateProjectSettings({ soundEnabled: nextState });
    if (nextState) {
      sounds.playBlessChime();
    }
  };

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });

  return (
    <header className="sticky top-0 z-40 bg-[#0d0d0d]/95 backdrop-blur-md border-b border-[#3d2f1f] shadow-lg">
      {/* Top golden accent bar */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-[#c9a961] to-transparent w-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Left: Branding & Director */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="relative flex items-center justify-center w-11 h-11 rounded-lg border border-[#c9a961] bg-gradient-to-b from-[#1f1911] to-[#0a0a0a] shadow-inner text-[#c9a961]">
            <Sword size={22} className="transform -rotate-45 drop-shadow-[0_0_8px_#c9a961]" />
            <div className="corner-ornament-tl !w-1.5 !h-1.5" />
            <div className="corner-ornament-br !w-1.5 !h-1.5" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base sm:text-lg font-bold font-cinzel tracking-wider text-[#f0d98c] flex items-center gap-1.5">
                <span>REQUIEM OF LEGENDS</span>
                <span className="hidden sm:inline text-xs font-mono px-2 py-0.5 rounded bg-[#c9a961]/15 text-[#c9a961] border border-[#c9a961]/30">
                  ASSET MANAGER
                </span>
              </h1>
            </div>

            <div className="flex items-center gap-3 text-xs text-[#8a7c5c] mt-0.5">
              <div className="flex items-center gap-1">
                <User size={12} className="text-[#c9a961]" />
                <span className="text-[#e8d9b0] font-medium">{projectSettings.director}</span>
                <span className="hidden md:inline text-[10px] text-[#8a7c5c]">(Game Director)</span>
              </div>
              <span className="text-[#3d2f1f] hidden sm:inline">•</span>
              <div className="hidden sm:flex items-center gap-1 font-mono">
                <Calendar size={12} />
                <span>{currentDate}</span>
              </div>
              <span className="text-[#3d2f1f] hidden md:inline">•</span>
              <div className="hidden md:flex items-center gap-1.5 font-mono text-[#c9a961]">
                <Layers size={12} />
                <span>{stats.total} assets</span>
                <span className="text-[#8a7c5c]">|</span>
                <span className="text-[#2ecc71] font-bold">{stats.completionPercentage}% concluído</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Quick Tools & Actions */}
        <div className="flex items-center gap-2 sm:gap-3 ml-auto">
          
          {/* Quick Search Ctrl+K */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsSearchModalOpen(true);
            }}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-[#3d2f1f] bg-[#141414] hover:border-[#c9a961]/60 text-[#8a7c5c] hover:text-[#e8d9b0] transition-all text-xs group"
            title="Busca rápida de assets (Ctrl + K)"
          >
            <Search size={14} className="group-hover:text-[#c9a961] transition-colors" />
            <span className="hidden lg:inline">Buscar asset...</span>
            <kbd className="hidden sm:inline-block px-1.5 py-0.5 rounded bg-[#1f1f1f] border border-[#3d2f1f] text-[10px] font-mono text-[#8a7c5c]">
              ⌘K
            </kbd>
          </button>

          {/* Random Suggestion / Next Task */}
          <button
            onClick={() => {
              sounds.playBlessChime();
              setIsRandomModalOpen(true);
            }}
            className="p-2 rounded-lg border border-[#3d2f1f] bg-[#141414] hover:border-[#c9a961]/60 text-[#8a7c5c] hover:text-[#f0d98c] transition-all"
            title="Sugerir próximo asset a forjar"
          >
            <Dices size={16} />
          </button>

          {/* Sound FX Toggle */}
          <button
            onClick={toggleSound}
            className={`p-2 rounded-lg border transition-all ${
              projectSettings.soundEnabled
                ? 'border-[#c9a961]/40 bg-[#1c170f] text-[#f0d98c]'
                : 'border-[#3d2f1f] bg-[#141414] text-[#8a7c5c]'
            }`}
            title={projectSettings.soundEnabled ? 'Efeitos sonoros ativados' : 'Efeitos sonoros desativados'}
          >
            {projectSettings.soundEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
          </button>

          {/* New Asset Button */}
          <button
            onClick={() => {
              sounds.playClick();
              setIsCreateModalOpen(true);
            }}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg font-cinzel font-bold text-xs sm:text-sm bg-gradient-to-r from-[#c9a961] to-[#8b7c4f] text-black hover:brightness-110 shadow-md shadow-[#c9a961]/20 transition-all cursor-pointer"
          >
            <Plus size={16} className="stroke-[3]" />
            <span>Novo Asset</span>
          </button>
        </div>
      </div>
    </header>
  );
};
