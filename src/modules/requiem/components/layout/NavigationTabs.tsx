import React from 'react';
import { useAssets } from '../../context/AssetContext';
import { NavigationTab } from '../../types';
import { 
  LayoutDashboard, 
  Layers, 
  Grid, 
  BarChart3, 
  BookOpen, 
  Settings
} from 'lucide-react';
import { sounds } from '../../utils/soundEffects';

interface NavItem {
  id: NavigationTab;
  label: string;
  icon: React.ReactNode;
  badge?: number | string;
}

export const NavigationTabs: React.FC = () => {
  const { activeTab, setActiveTab, stats } = useAssets();

  const navItems: NavItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: <LayoutDashboard size={16} />
    },
    {
      id: 'assets',
      label: 'Assets',
      icon: <Layers size={16} />,
      badge: stats.total
    },
    {
      id: 'categories',
      label: 'Categorias',
      icon: <Grid size={16} />,
      badge: '8'
    },
    {
      id: 'progress',
      label: 'Progresso & Métricas',
      icon: <BarChart3 size={16} />
    },
    {
      id: 'references',
      label: 'Recursos & Docs',
      icon: <BookOpen size={16} />
    },
    {
      id: 'settings',
      label: 'Configurações',
      icon: <Settings size={16} />
    }
  ];

  const handleTabChange = (id: NavigationTab) => {
    if (id !== activeTab) {
      sounds.playWhoosh();
      setActiveTab(id);
    }
  };

  return (
    <nav className="bg-[#111111] border-b border-[#3d2f1f]/80 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex items-center gap-1 sm:gap-2 overflow-x-auto no-scrollbar py-2">
        {navItems.map(item => {
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => handleTabChange(item.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg font-cinzel text-xs sm:text-sm font-semibold transition-all whitespace-nowrap cursor-pointer relative ${
                isActive
                  ? 'bg-gradient-to-r from-[#211a11] to-[#17130b] text-[#f0d98c] border border-[#c9a961] shadow-[0_0_12px_rgba(201,169,97,0.2)]'
                  : 'text-[#8a7c5c] hover:text-[#e8d9b0] hover:bg-[#1a1a1a] border border-transparent'
              }`}
            >
              {isActive && (
                <div className="corner-ornament-tl !w-1.5 !h-1.5" />
              )}
              {item.icon}
              <span>{item.label}</span>
              {item.badge !== undefined && (
                <span className={`px-1.5 py-0.2 text-[10px] font-mono rounded ${
                  isActive
                    ? 'bg-[#c9a961] text-black font-bold'
                    : 'bg-[#1a1a1a] text-[#8a7c5c] border border-[#3d2f1f]'
                }`}>
                  {item.badge}
                </span>
              )}
              {isActive && (
                <div className="corner-ornament-br !w-1.5 !h-1.5" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
};
