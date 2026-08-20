import React, { useState, useEffect, useCallback } from 'react';
import { useAssets } from '../../context/AssetContext';
import { Asset } from '../../types';
import { Dices, X, ArrowRight } from 'lucide-react';
import { AssetIcon } from '../common/AssetIcon';
import { CategoryBadge, PriorityBadge, OriginBadge } from '../common/Badge';
import { sounds } from '../../utils/soundEffects';

export const RandomAssetModal: React.FC = () => {
  const { 
    isRandomModalOpen, 
    setIsRandomModalOpen, 
    assets, 
    setActiveModalAsset, 
    setIsDetailModalOpen,
    updateAssetStatus 
  } = useAssets();
  
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = useCallback(() => {
    sounds.playBlessChime();
    setIsRolling(true);

    const candidates = assets.filter(a => a.status !== 'COMPLETED');
    const pool = candidates.length > 0 ? candidates : assets;

    let iterations = 0;
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * pool.length);
      setSelectedAsset(pool[randomIndex]);
      iterations++;

      if (iterations > 12) {
        clearInterval(interval);
        setIsRolling(false);
      }
    }, 60);
  }, [assets]);

  useEffect(() => {
    if (isRandomModalOpen) {
      rollDice();
    }
  }, [isRandomModalOpen, rollDice]);

  if (!isRandomModalOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-lg bg-[#141414] border border-[#c9a961] rounded-xl shadow-[0_0_50px_rgba(201,169,97,0.3)] overflow-hidden medieval-frame text-center p-6"
      >
        <div className="corner-ornament-tl" />
        <div className="corner-ornament-tr" />
        <div className="corner-ornament-bl" />
        <div className="corner-ornament-br" />

        <button
          onClick={() => {
            sounds.playClick();
            setIsRandomModalOpen(false);
          }}
          className="absolute top-4 right-4 text-[#8a7c5c] hover:text-[#e8d9b0] p-1.5 rounded-lg transition-colors"
        >
          <X size={20} />
        </button>

        <div className="inline-flex items-center justify-center p-3 rounded-full border border-[#c9a961] bg-[#1c170f] text-[#c9a961] mb-4">
          <Dices size={28} className={isRolling ? 'animate-spin' : ''} />
        </div>

        <h3 className="text-xl font-cinzel font-bold text-[#f0d98c] mb-1">
          Oráculo de Criação
        </h3>
        <p className="text-xs text-[#8a7c5c] mb-6">
          O próximo asset sugerido para o Game Director forjar no MMORPG:
        </p>

        {selectedAsset && (
          <div className={`p-5 rounded-xl border border-[#c9a961]/40 bg-[#0d0d0d] mb-6 transition-all ${isRolling ? 'opacity-50 scale-95' : 'scale-100 shadow-lg'}`}>
            <div className="flex flex-col items-center gap-3">
              <AssetIcon asset={selectedAsset} size="xl" className="shadow-lg ring-2 ring-[#c9a961]/30" />
              
              <div>
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <CategoryBadge category={selectedAsset.category} size="sm" />
                  <PriorityBadge priority={selectedAsset.priority} size="sm" />
                  <OriginBadge origin={selectedAsset.origin} size="sm" />
                </div>
                <h4 className="text-lg font-cinzel font-bold text-[#e8d9b0]">
                  {selectedAsset.name}
                </h4>
                {selectedAsset.notes && (
                  <p className="text-xs text-[#8a7c5c] mt-1 max-w-sm mx-auto line-clamp-2">
                    {selectedAsset.notes}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={rollDice}
            disabled={isRolling}
            className="w-full sm:w-auto px-4 py-2.5 rounded-lg border border-[#3d2f1f] bg-[#1a1a1a] text-xs font-semibold text-[#8a7c5c] hover:text-[#e8d9b0] hover:border-[#c9a961] transition-all flex items-center justify-center gap-2"
          >
            <Dices size={16} />
            <span>Rolar Outro Asset</span>
          </button>

          {selectedAsset && (
            <button
              onClick={() => {
                if (selectedAsset.status === 'PENDING') {
                  updateAssetStatus(selectedAsset.id, 'IN_PROGRESS');
                }
                setActiveModalAsset(selectedAsset);
                setIsRandomModalOpen(false);
                setIsDetailModalOpen(true);
              }}
              className="w-full sm:w-auto px-6 py-2.5 rounded-lg font-cinzel font-bold text-xs bg-gradient-to-r from-[#c9a961] to-[#8b7c4f] text-black hover:brightness-110 shadow-md shadow-[#c9a961]/20 transition-all flex items-center justify-center gap-2"
            >
              <span>Trabalhar Neste Asset</span>
              <ArrowRight size={14} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
