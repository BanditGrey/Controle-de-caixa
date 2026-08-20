import React from 'react';
import { 
  Sword, 
  Shield, 
  FlaskConical, 
  Sparkles, 
  Volume2, 
  Layout, 
  Compass, 
  Skull, 
  Gem, 
  Flame, 
  Zap, 
  Scroll, 
  Crown, 
  Crosshair, 
  Feather, 
  Music, 
  Boxes, 
  FileCode,
  Heart,
  Wand2,
  Bug,
  Ghost
} from 'lucide-react';
import { Asset, AssetCategory } from '../../types';

interface AssetIconProps {
  asset?: Asset;
  category?: AssetCategory;
  subcategory?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  className?: string;
}

export const AssetIcon: React.FC<AssetIconProps> = ({ 
  asset, 
  category: catProp, 
  subcategory: subProp, 
  id: idProp, 
  size = 'md',
  className = '' 
}) => {
  const category = asset?.category || catProp || 'ITEM';
  const subcategory = asset?.subcategory || subProp || '';
  const id = asset?.id || idProp || '';
  const previewUrl = asset?.previewUrl;

  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-11 h-11 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-2xl',
    hero: 'w-32 h-32 text-4xl'
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 28,
    xl: 40,
    hero: 56
  };

  const currentIconSize = iconSizes[size];

  // If asset has custom uploaded preview image
  if (previewUrl) {
    return (
      <div className={`relative flex items-center justify-center rounded-lg overflow-hidden border border-[#c9a961]/40 bg-[#141414] shadow-md ${sizeClasses[size]} ${className}`}>
        <img 
          src={previewUrl} 
          alt={asset?.name || 'Asset preview'} 
          className="w-full h-full object-cover"
        />
        <div className="corner-ornament-tl !w-1.5 !h-1.5" />
        <div className="corner-ornament-br !w-1.5 !h-1.5" />
      </div>
    );
  }

  // Specialized rendering for iconic items
  const renderIconContent = () => {
    // Jewels
    if (id === 'jewel-bless' || (category === 'ITEM' && subcategory === 'jewel' && id.includes('bless'))) {
      return (
        <div className="relative flex items-center justify-center text-[#f1c40f] bless-pulse">
          <Gem size={currentIconSize} className="drop-shadow-[0_0_8px_#f1c40f]" />
          <Sparkles size={currentIconSize * 0.5} className="absolute -top-1 -right-1 text-white animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      );
    }
    if (id === 'jewel-soul' || id.includes('soul')) {
      return (
        <div className="relative flex items-center justify-center text-[#e74c3c]">
          <Gem size={currentIconSize} className="drop-shadow-[0_0_8px_#e74c3c]" />
          <Sparkles size={currentIconSize * 0.4} className="absolute -bottom-1 -left-1 text-[#f39c12]" />
        </div>
      );
    }
    if (id === 'jewel-chaos' || id.includes('chaos')) {
      return (
        <div className="relative flex items-center justify-center text-[#9b59b6]">
          <Gem size={currentIconSize} className="drop-shadow-[0_0_8px_#9b59b6]" />
          <Flame size={currentIconSize * 0.5} className="absolute -top-2 text-[#e67e22]" />
        </div>
      );
    }

    // Potions
    if (subcategory === 'potion' || id.includes('potion')) {
      const isMana = id.includes('mana');
      return (
        <div className={`relative flex items-center justify-center ${isMana ? 'text-[#3498db]' : 'text-[#e74c3c]'}`}>
          <FlaskConical size={currentIconSize} />
          <div className={`absolute bottom-1 w-2 h-2 rounded-full ${isMana ? 'bg-[#2980b9]' : 'bg-[#c0392b]'} animate-ping opacity-75`} />
        </div>
      );
    }

    // Weapons & Armors
    if (subcategory.includes('sword')) return <Sword size={currentIconSize} className="text-[#c9a961]" />;
    if (subcategory.includes('bow')) return <Crosshair size={currentIconSize} className="text-[#2ecc71]" />;
    if (subcategory.includes('staff')) return <Wand2 size={currentIconSize} className="text-[#9b59b6]" />;
    if (subcategory.includes('shield')) return <Shield size={currentIconSize} className="text-[#c9a961]" />;
    if (subcategory.includes('ring') || subcategory.includes('necklace') || subcategory.includes('accessory')) return <Crown size={currentIconSize} className="text-[#f1c40f]" />;
    if (subcategory.includes('scroll') || subcategory.includes('quest')) return <Scroll size={currentIconSize} className="text-[#e8d9b0]" />;
    if (subcategory.includes('armor') || subcategory.includes('helm') || subcategory.includes('boots') || subcategory.includes('gloves')) {
      return <Shield size={currentIconSize} className="text-[#8b7c4f]" />;
    }

    // Monsters
    if (category === 'MONSTER') {
      if (id.includes('dragon')) return <Flame size={currentIconSize} className="text-[#e74c3c]" />;
      if (id.includes('spider')) return <Bug size={currentIconSize} className="text-[#e67e22]" />;
      if (id.includes('lich') || id.includes('skeleton')) return <Ghost size={currentIconSize} className="text-[#9b59b6]" />;
      return <Skull size={currentIconSize} className="text-[#c0392b]" />;
    }

    // Maps
    if (category === 'MAP') {
      return <Compass size={currentIconSize} className="text-[#27ae60]" />;
    }

    // Animations
    if (category === 'ANIMATION') {
      if (id.includes('damage') || id.includes('hit')) return <Zap size={currentIconSize} className="text-[#f39c12]" />;
      if (id.includes('heal')) return <Heart size={currentIconSize} className="text-[#2ecc71]" />;
      if (id.includes('level-up') || id.includes('glory')) return <Sparkles size={currentIconSize} className="text-[#f1c40f]" />;
      if (id.includes('wing')) return <Feather size={currentIconSize} className="text-[#3498db]" />;
      return <Sparkles size={currentIconSize} className="text-[#8e44ad]" />;
    }

    // Sounds
    if (category === 'SOUND') {
      if (id.includes('music') || id.includes('ambient')) return <Music size={currentIconSize} className="text-[#3498db]" />;
      return <Volume2 size={currentIconSize} className="text-[#2980b9]" />;
    }

    // UI
    if (category === 'UI') {
      if (id.includes('orbs')) return <Heart size={currentIconSize} className="text-[#e74c3c]" />;
      if (id.includes('grid') || id.includes('slot')) return <Boxes size={currentIconSize} className="text-[#e67e22]" />;
      return <Layout size={currentIconSize} className="text-[#d35400]" />;
    }

    // Characters
    if (category === 'CHARACTER') {
      return <Crown size={currentIconSize} className="text-[#1abc9c]" />;
    }

    // Effects
    if (category === 'EFFECT') {
      return <Flame size={currentIconSize} className="text-[#f39c12]" />;
    }

    return <FileCode size={currentIconSize} className="text-[#c9a961]" />;
  };

  // Border & background based on category
  const categoryBorderColors: Record<AssetCategory, string> = {
    ITEM: 'border-[#c9a961]/40 bg-[#1c170f]',
    MONSTER: 'border-[#c0392b]/40 bg-[#1c0e0e]',
    MAP: 'border-[#27ae60]/40 bg-[#0e1c12]',
    ANIMATION: 'border-[#8e44ad]/40 bg-[#170e1c]',
    SOUND: 'border-[#2980b9]/40 bg-[#0e161c]',
    UI: 'border-[#d35400]/40 bg-[#1c140e]',
    CHARACTER: 'border-[#16a085]/40 bg-[#0e1c19]',
    EFFECT: 'border-[#f39c12]/40 bg-[#1c190e]'
  };

  return (
    <div 
      className={`relative flex items-center justify-center rounded-lg border transition-all duration-300 shadow-inner group-hover:scale-105 ${categoryBorderColors[category]} ${sizeClasses[size]} ${className}`}
    >
      {renderIconContent()}
      <div className="corner-ornament-tl !w-1.5 !h-1.5 opacity-60" />
      <div className="corner-ornament-br !w-1.5 !h-1.5 opacity-60" />
    </div>
  );
};
