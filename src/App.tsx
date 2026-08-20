import React from 'react';
import { AssetProvider, useAssets } from './context/AssetContext';
import { Header } from './components/layout/Header';
import { NavigationTabs } from './components/layout/NavigationTabs';
import { Dashboard } from './pages/Dashboard';
import { AssetsList } from './pages/AssetsList';
import { CategoriesView } from './pages/CategoriesView';
import { ProgressAnalytics } from './pages/ProgressAnalytics';
import { ReferencesView } from './pages/ReferencesView';
import { SettingsView } from './pages/SettingsView';
import { AssetModal } from './components/modals/AssetModal';
import { AssetDetailModal } from './components/modals/AssetDetailModal';
import { QuickSearchModal } from './components/modals/QuickSearchModal';
import { RandomAssetModal } from './components/modals/RandomAssetModal';
import { ToastContainer } from './components/common/ToastContainer';
import { Sword } from 'lucide-react';

const AppContent: React.FC = () => {
  const { 
    activeTab, 
    isCreateModalOpen, 
    setIsCreateModalOpen, 
    isDetailModalOpen, 
    setIsDetailModalOpen, 
    activeModalAsset, 
    setActiveModalAsset,
    projectSettings 
  } = useAssets();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'assets':
        return <AssetsList />;
      case 'categories':
        return <CategoriesView />;
      case 'progress':
        return <ProgressAnalytics />;
      case 'references':
        return <ReferencesView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-[#e8d9b0] flex flex-col selection:bg-[#c9a961] selection:text-black">
      
      {/* Ornate Header */}
      <Header />

      {/* Navigation Tabs */}
      <NavigationTabs />

      {/* Main App Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {renderActiveView()}
      </main>

      {/* Footer */}
      <footer className="mt-auto border-t border-[#3d2f1f]/80 bg-[#0d0d0d] py-6 px-4 text-center text-xs text-[#8a7c5c]">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sword size={14} className="text-[#c9a961]" />
            <span className="font-cinzel font-bold text-[#f0d98c]">
              {projectSettings.name}
            </span>
            <span className="text-[#3d2f1f]">•</span>
            <span>MMORPG Dark Fantasy Asset Manager</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Direção: <strong className="text-[#e8d9b0]">{projectSettings.director}</strong></span>
            <span className="text-[#3d2f1f]">•</span>
            <span>MU Online × With Your Destiny</span>
          </div>
        </div>
      </footer>

      {/* Modals & Dialogs */}
      <AssetModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        assetToEdit={activeModalAsset}
      />

      <AssetDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        asset={activeModalAsset}
        onEdit={(asset) => {
          setActiveModalAsset(asset);
          setIsCreateModalOpen(true);
        }}
      />

      <QuickSearchModal />
      <RandomAssetModal />
      <ToastContainer />
    </div>
  );
};

export function App() {
  return (
    <AssetProvider>
      <AppContent />
    </AssetProvider>
  );
}

export default App;
