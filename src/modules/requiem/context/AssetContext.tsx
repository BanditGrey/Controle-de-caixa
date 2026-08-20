import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as XLSX from 'xlsx';
import confetti from 'canvas-confetti';
import { 
  Asset, 
  AssetCategory, 
  AssetStatus, 
  Priority, 
  ProjectSettings, 
  FilterState, 
  NavigationTab, 
  ReferenceTool 
} from '../types';
import { INITIAL_ASSETS } from '../data/initialAssets';
import { INITIAL_REFERENCES } from '../data/references';
import { sounds } from '../utils/soundEffects';

export interface ToastMessage {
  id: string;
  title: string;
  description?: string;
  type: 'success' | 'warning' | 'info' | 'error';
}

export interface AssetContextType {
  assets: Asset[];
  projectSettings: ProjectSettings;
  references: ReferenceTool[];
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  filters: FilterState;
  setFilters: React.Dispatch<React.SetStateAction<FilterState>>;
  resetFilters: () => void;
  selectedAssetIds: string[];
  setSelectedAssetIds: React.Dispatch<React.SetStateAction<string[]>>;
  toggleSelectAsset: (id: string) => void;
  selectAllAssets: () => void;
  clearSelection: () => void;
  
  // CRUD & Operations
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => Asset;
  updateAsset: (id: string, updates: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  deleteMultipleAssets: (ids: string[]) => void;
  updateAssetStatus: (id: string, status: AssetStatus) => void;
  bulkUpdateStatus: (status: AssetStatus) => void;
  bulkUpdatePriority: (priority: Priority) => void;
  duplicateAsset: (id: string) => Asset | null;
  
  // References
  addReference: (ref: Omit<ReferenceTool, 'id'>) => void;
  deleteReference: (id: string) => void;
  
  // Data Management
  resetToInitialSeed: () => void;
  clearAllAssets: () => void;
  exportJSON: () => void;
  importJSON: (jsonString: string) => boolean;
  exportExcel: () => void;
  
  // Settings
  updateProjectSettings: (newSettings: Partial<ProjectSettings>) => void;
  
  // Modals & Triggers
  activeModalAsset: Asset | null;
  setActiveModalAsset: (asset: Asset | null) => void;
  isCreateModalOpen: boolean;
  setIsCreateModalOpen: (open: boolean) => void;
  isDetailModalOpen: boolean;
  setIsDetailModalOpen: (open: boolean) => void;
  isSearchModalOpen: boolean;
  setIsSearchModalOpen: (open: boolean) => void;
  isRandomModalOpen: boolean;
  setIsRandomModalOpen: (open: boolean) => void;
  
  // UI Helpers
  toasts: ToastMessage[];
  showToast: (title: string, description?: string, type?: 'success' | 'warning' | 'info' | 'error') => void;
  removeToast: (id: string) => void;
  triggerCelebration: () => void;
  
  // Stats
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    pending: number;
    completionPercentage: number;
    criticalPending: number;
    highPending: number;
    byCategory: Record<AssetCategory, { total: number; completed: number; inProgress: number; pending: number; pct: number }>;
  };
}

const DEFAULT_SETTINGS: ProjectSettings = {
  name: 'Requiem of Legends',
  director: 'Daniel Silva',
  description: 'MMORPG Dark Fantasy épico unindo a atmosfera e sistemas lendários de MU Online e WYD (With Your Destiny).',
  startDate: '2026-08-01',
  targetDate: '2026-12-31',
  githubUrl: 'https://github.com/BanditGrey/Controle-de-caixa',
  discordUrl: 'https://discord.gg/requiem-of-legends',
  soundEnabled: true,
  particlesEnabled: true,
  theme: 'dark-gold',
  density: 'normal'
};

const DEFAULT_FILTERS: FilterState = {
  search: '',
  categories: [],
  status: [],
  priority: [],
  origins: [],
  sortBy: 'date-newest',
  viewMode: 'grid'
};

const STORAGE_KEYS = {
  ASSETS: 'requiem_assets_v2',
  SETTINGS: 'requiem_project_settings_v2',
  REFERENCES: 'requiem_references_v2'
};

const AssetContext = createContext<AssetContextType | undefined>(undefined);

export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Initialize state with localStorage fallback
  const [assets, setAssets] = useState<Asset[]>(() => {
    if (typeof window === 'undefined') return INITIAL_ASSETS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.ASSETS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_ASSETS;
  });

  const [projectSettings, setProjectSettings] = useState<ProjectSettings>(() => {
    if (typeof window === 'undefined') return DEFAULT_SETTINGS;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(saved) };
      }
    } catch {
      // fallback
    }
    return DEFAULT_SETTINGS;
  });

  const [references, setReferences] = useState<ReferenceTool[]>(() => {
    if (typeof window === 'undefined') return INITIAL_REFERENCES;
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REFERENCES);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {
      // fallback
    }
    return INITIAL_REFERENCES;
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('dashboard');
  const [filters, setFilters] = useState<FilterState>(DEFAULT_FILTERS);
  const [selectedAssetIds, setSelectedAssetIds] = useState<string[]>([]);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Modals state
  const [activeModalAsset, setActiveModalAsset] = useState<Asset | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [isSearchModalOpen, setIsSearchModalOpen] = useState<boolean>(false);
  const [isRandomModalOpen, setIsRandomModalOpen] = useState<boolean>(false);

  // Sync sounds state with project settings
  useEffect(() => {
    sounds.setEnabled(projectSettings.soundEnabled);
  }, [projectSettings.soundEnabled]);

  // Persist assets
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.ASSETS, JSON.stringify(assets));
    } catch {
      // fallback
    }
  }, [assets]);

  // Persist settings
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(projectSettings));
    } catch {
      // fallback
    }
  }, [projectSettings]);

  // Persist references
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REFERENCES, JSON.stringify(references));
    } catch {
      // fallback
    }
  }, [references]);

  // Keyboard shortcut Ctrl+K / Cmd+K for quick search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchModalOpen(prev => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showToast = useCallback((title: string, description?: string, type: 'success' | 'warning' | 'info' | 'error' = 'info') => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    setToasts(prev => [...prev.slice(-4), { id, title, description, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4500);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const triggerCelebration = useCallback(() => {
    if (!projectSettings.particlesEnabled) return;
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#c9a961', '#f0d98c', '#ffffff', '#27ae60', '#e74c3c']
      });
    } catch {
      // fallback
    }
  }, [projectSettings.particlesEnabled]);

  const resetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
    sounds.playClick();
  }, []);

  const toggleSelectAsset = useCallback((id: string) => {
    setSelectedAssetIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
    sounds.playClick();
  }, []);

  const selectAllAssets = useCallback(() => {
    setSelectedAssetIds(assets.map(a => a.id));
    sounds.playClick();
  }, [assets]);

  const clearSelection = useCallback(() => {
    setSelectedAssetIds([]);
    sounds.playClick();
  }, []);

  // CRUD
  const addAsset = useCallback((assetData: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>): Asset => {
    const now = new Date().toISOString();
    const id = assetData.name.toLowerCase().replace(/[^a-z0-9]/g, '-') + '-' + Date.now().toString().slice(-4);
    
    const newAsset: Asset = {
      ...assetData,
      id,
      createdAt: now,
      updatedAt: now,
      activities: [
        {
          id: 'act-' + Date.now(),
          timestamp: now,
          action: 'Asset criado pelo Game Director'
        }
      ]
    };

    setAssets(prev => [newAsset, ...prev]);
    sounds.playSuccess();
    showToast('Asset Forjado!', `"${newAsset.name}" foi adicionado ao MMORPG.`, 'success');
    return newAsset;
  }, [showToast]);

  const updateAsset = useCallback((id: string, updates: Partial<Asset>) => {
    const now = new Date().toISOString();
    setAssets(prev => prev.map(item => {
      if (item.id !== id) return item;

      const wasCompleted = item.status === 'COMPLETED';
      const isNowCompleted = updates.status === 'COMPLETED';
      
      const newActivity = updates.status && updates.status !== item.status ? {
        id: 'act-' + Date.now(),
        timestamp: now,
        action: `Status alterado de "${item.status}" para "${updates.status}"`,
        previousStatus: item.status,
        newStatus: updates.status
      } : undefined;

      const activities = item.activities ? [...item.activities] : [];
      if (newActivity) activities.push(newActivity);

      if (!wasCompleted && isNowCompleted) {
        sounds.playBlessChime();
        triggerCelebration();
      } else {
        sounds.playSuccess();
      }

      return {
        ...item,
        ...updates,
        updatedAt: now,
        completedAt: isNowCompleted ? (item.completedAt || now) : (updates.status ? undefined : item.completedAt),
        activities
      };
    }));

    // Update modal asset if open
    setActiveModalAsset(prev => prev && prev.id === id ? { ...prev, ...updates, updatedAt: now } : prev);
    showToast('Asset Atualizado', 'As alterações foram salvas.', 'success');
  }, [showToast, triggerCelebration]);

  const deleteAsset = useCallback((id: string) => {
    const assetToDelete = assets.find(a => a.id === id);
    setAssets(prev => prev.filter(item => item.id !== id));
    setSelectedAssetIds(prev => prev.filter(item => item !== id));
    if (activeModalAsset?.id === id) {
      setActiveModalAsset(null);
      setIsDetailModalOpen(false);
    }
    sounds.playDelete();
    showToast('Asset Removido', assetToDelete ? `"${assetToDelete.name}" foi excluído.` : 'Asset excluído.', 'warning');
  }, [assets, activeModalAsset, showToast]);

  const deleteMultipleAssets = useCallback((ids: string[]) => {
    setAssets(prev => prev.filter(item => !ids.includes(item.id)));
    setSelectedAssetIds([]);
    sounds.playDelete();
    showToast('Assets Excluídos', `${ids.length} assets foram removidos.`, 'warning');
  }, [showToast]);

  const updateAssetStatus = useCallback((id: string, status: AssetStatus) => {
    updateAsset(id, { status });
  }, [updateAsset]);

  const bulkUpdateStatus = useCallback((status: AssetStatus) => {
    if (selectedAssetIds.length === 0) return;
    const now = new Date().toISOString();
    
    setAssets(prev => prev.map(item => {
      if (!selectedAssetIds.includes(item.id)) return item;
      return {
        ...item,
        status,
        updatedAt: now,
        completedAt: status === 'COMPLETED' ? now : undefined,
        activities: [
          ...(item.activities || []),
          {
            id: 'act-' + Date.now() + Math.random().toString().slice(2, 5),
            timestamp: now,
            action: `Alteração em massa: Status definido como "${status}"`,
            newStatus: status
          }
        ]
      };
    }));

    if (status === 'COMPLETED') {
      sounds.playBlessChime();
      triggerCelebration();
    } else {
      sounds.playSuccess();
    }

    showToast('Ação em Massa Concluída', `${selectedAssetIds.length} assets atualizados para "${status}".`, 'success');
    setSelectedAssetIds([]);
  }, [selectedAssetIds, showToast, triggerCelebration]);

  const bulkUpdatePriority = useCallback((priority: Priority) => {
    if (selectedAssetIds.length === 0) return;
    const now = new Date().toISOString();

    setAssets(prev => prev.map(item => {
      if (!selectedAssetIds.includes(item.id)) return item;
      return {
        ...item,
        priority,
        updatedAt: now,
        activities: [
          ...(item.activities || []),
          {
            id: 'act-' + Date.now() + Math.random().toString().slice(2, 5),
            timestamp: now,
            action: `Prioridade alterada em massa para "${priority}"`
          }
        ]
      };
    }));

    sounds.playSuccess();
    showToast('Prioridade Alterada', `${selectedAssetIds.length} assets tiveram a prioridade definida para "${priority}".`, 'success');
    setSelectedAssetIds([]);
  }, [selectedAssetIds, showToast]);

  const duplicateAsset = useCallback((id: string): Asset | null => {
    const original = assets.find(a => a.id === id);
    if (!original) return null;

    const now = new Date().toISOString();
    const duplicated: Asset = {
      ...original,
      id: original.id + '-copy-' + Date.now().toString().slice(-4),
      name: `${original.name} (Cópia)`,
      status: 'PENDING',
      createdAt: now,
      updatedAt: now,
      completedAt: undefined,
      activities: [
        {
          id: 'act-' + Date.now(),
          timestamp: now,
          action: `Duplicado a partir de "${original.name}"`
        }
      ]
    };

    setAssets(prev => [duplicated, ...prev]);
    sounds.playSuccess();
    showToast('Asset Duplicado', `"${duplicated.name}" foi criado.`, 'success');
    return duplicated;
  }, [assets, showToast]);

  // References
  const addReference = useCallback((refData: Omit<ReferenceTool, 'id'>) => {
    const newRef: ReferenceTool = {
      ...refData,
      id: 'ref-' + Date.now()
    };
    setReferences(prev => [newRef, ...prev]);
    sounds.playSuccess();
    showToast('Recurso Adicionado', `"${newRef.name}" foi registrado na biblioteca.`, 'success');
  }, [showToast]);

  const deleteReference = useCallback((id: string) => {
    setReferences(prev => prev.filter(r => r.id !== id));
    sounds.playDelete();
    showToast('Recurso Removido', 'O link foi retirado da lista.', 'info');
  }, [showToast]);

  // Reset & Clear
  const resetToInitialSeed = useCallback(() => {
    setAssets(INITIAL_ASSETS);
    setReferences(INITIAL_REFERENCES);
    setSelectedAssetIds([]);
    sounds.playBlessChime();
    showToast('Restaurado com Sucesso', 'Os 104 assets iniciais de Requiem of Legends foram restaurados!', 'success');
  }, [showToast]);

  const clearAllAssets = useCallback(() => {
    setAssets([]);
    setSelectedAssetIds([]);
    sounds.playDelete();
    showToast('Todos os Assets Limpos', 'A base de dados foi esvaziada.', 'warning');
  }, [showToast]);

  // Export / Import
  const exportJSON = useCallback(() => {
    try {
      const data = {
        project: projectSettings,
        exportDate: new Date().toISOString(),
        totalAssets: assets.length,
        assets,
        references
      };
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `requiem-assets-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
      sounds.playBlessChime();
      showToast('Backup JSON Exportado', 'O arquivo de dados foi baixado com sucesso.', 'success');
    } catch {
      showToast('Erro ao Exportar', 'Não foi possível gerar o arquivo JSON.', 'error');
    }
  }, [projectSettings, assets, references, showToast]);

  const importJSON = useCallback((jsonString: string): boolean => {
    try {
      const parsed = JSON.parse(jsonString);
      if (parsed.assets && Array.isArray(parsed.assets)) {
        setAssets(parsed.assets);
        if (parsed.project) setProjectSettings(prev => ({ ...prev, ...parsed.project }));
        if (parsed.references && Array.isArray(parsed.references)) setReferences(parsed.references);
        sounds.playBlessChime();
        triggerCelebration();
        showToast('Dados Importados!', `${parsed.assets.length} assets carregados do arquivo.`, 'success');
        return true;
      } else if (Array.isArray(parsed)) {
        setAssets(parsed);
        sounds.playBlessChime();
        showToast('Dados Importados!', `${parsed.length} assets carregados.`, 'success');
        return true;
      }
      throw new Error('Formato inválido');
    } catch {
      showToast('Erro na Importação', 'Arquivo JSON com estrutura incompatível.', 'error');
      return false;
    }
  }, [showToast, triggerCelebration]);

  const exportExcel = useCallback(() => {
    try {
      const wb = XLSX.utils.book_new();

      // Main sheet with all assets
      const mainData = assets.map(a => ({
        ID: a.id,
        Nome: a.name,
        Categoria: a.category,
        Subcategoria: a.subcategory || '',
        Status: a.status === 'COMPLETED' ? 'Concluído' : a.status === 'IN_PROGRESS' ? 'Em Progresso' : 'Pendente',
        Prioridade: a.priority,
        Origem: a.origin,
        'Referência Original': a.originalReference || '',
        'Caminho Destino': a.targetPath || '',
        Tags: a.tags.join(', '),
        Dimensões: a.metadata?.dimensions || '',
        Formato: a.metadata?.format || '',
        Duração: a.metadata?.duration || '',
        'Criado Em': a.createdAt,
        'Concluído Em': a.completedAt || '',
        Notas: a.notes || ''
      }));

      const wsAll = XLSX.utils.json_to_sheet(mainData);
      XLSX.utils.book_append_sheet(wb, wsAll, 'Todos os Assets');

      // Category specific sheets
      const categories: AssetCategory[] = ['ITEM', 'MONSTER', 'MAP', 'ANIMATION', 'SOUND', 'UI', 'CHARACTER', 'EFFECT'];
      categories.forEach(cat => {
        const catAssets = assets.filter(a => a.category === cat);
        if (catAssets.length > 0) {
          const catData = catAssets.map(a => ({
            Nome: a.name,
            Subcategoria: a.subcategory || '',
            Status: a.status,
            Prioridade: a.priority,
            Origem: a.origin,
            'Ref. Original': a.originalReference || '',
            'Caminho Destino': a.targetPath || '',
            Formato: a.metadata?.format || '',
            Notas: a.notes || ''
          }));
          const wsCat = XLSX.utils.json_to_sheet(catData);
          XLSX.utils.book_append_sheet(wb, wsCat, cat);
        }
      });

      XLSX.writeFile(wb, `requiem-of-legends-assets-${new Date().toISOString().slice(0, 10)}.xlsx`);
      sounds.playBlessChime();
      showToast('Planilha Excel Gerada!', 'O relatório completo em .xlsx foi baixado.', 'success');
    } catch {
      showToast('Erro ao Exportar Excel', 'Falha ao processar a planilha.', 'error');
    }
  }, [assets, showToast]);

  const updateProjectSettings = useCallback((newSettings: Partial<ProjectSettings>) => {
    setProjectSettings(prev => ({ ...prev, ...newSettings }));
    sounds.playSuccess();
    showToast('Configurações Salvas', 'As preferências do projeto foram atualizadas.', 'success');
  }, [showToast]);

  // Statistics calculation
  const total = assets.length;
  const completed = assets.filter(a => a.status === 'COMPLETED').length;
  const inProgress = assets.filter(a => a.status === 'IN_PROGRESS').length;
  const pending = assets.filter(a => a.status === 'PENDING').length;
  const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

  const criticalPending = assets.filter(a => a.status !== 'COMPLETED' && a.priority === 'CRITICAL').length;
  const highPending = assets.filter(a => a.status !== 'COMPLETED' && a.priority === 'HIGH').length;

  const categoryList: AssetCategory[] = ['ITEM', 'MONSTER', 'MAP', 'ANIMATION', 'SOUND', 'UI', 'CHARACTER', 'EFFECT'];
  const byCategory = categoryList.reduce((acc, cat) => {
    const catAssets = assets.filter(a => a.category === cat);
    const catTotal = catAssets.length;
    const catCompleted = catAssets.filter(a => a.status === 'COMPLETED').length;
    const catInProgress = catAssets.filter(a => a.status === 'IN_PROGRESS').length;
    const catPending = catAssets.filter(a => a.status === 'PENDING').length;
    const pct = catTotal > 0 ? Math.round((catCompleted / catTotal) * 100) : 0;
    acc[cat] = { total: catTotal, completed: catCompleted, inProgress: catInProgress, pending: catPending, pct };
    return acc;
  }, {} as Record<AssetCategory, { total: number; completed: number; inProgress: number; pending: number; pct: number }>);

  const stats = {
    total,
    completed,
    inProgress,
    pending,
    completionPercentage,
    criticalPending,
    highPending,
    byCategory
  };

  return (
    <AssetContext.Provider
      value={{
        assets,
        projectSettings,
        references,
        activeTab,
        setActiveTab,
        filters,
        setFilters,
        resetFilters,
        selectedAssetIds,
        setSelectedAssetIds,
        toggleSelectAsset,
        selectAllAssets,
        clearSelection,
        addAsset,
        updateAsset,
        deleteAsset,
        deleteMultipleAssets,
        updateAssetStatus,
        bulkUpdateStatus,
        bulkUpdatePriority,
        duplicateAsset,
        addReference,
        deleteReference,
        resetToInitialSeed,
        clearAllAssets,
        exportJSON,
        importJSON,
        exportExcel,
        updateProjectSettings,
        activeModalAsset,
        setActiveModalAsset,
        isCreateModalOpen,
        setIsCreateModalOpen,
        isDetailModalOpen,
        setIsDetailModalOpen,
        isSearchModalOpen,
        setIsSearchModalOpen,
        isRandomModalOpen,
        setIsRandomModalOpen,
        toasts,
        showToast,
        removeToast,
        triggerCelebration,
        stats
      }}
    >
      {children}
    </AssetContext.Provider>
  );
};

export const useAssets = (): AssetContextType => {
  const context = useContext(AssetContext);
  if (!context) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
};
