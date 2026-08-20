export type AssetCategory = 
  | 'ITEM'
  | 'MONSTER'
  | 'MAP'
  | 'ANIMATION'
  | 'SOUND'
  | 'UI'
  | 'CHARACTER'
  | 'EFFECT';

export type AssetStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export type Priority = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';

export type AssetOrigin = 
  | 'MU' 
  | 'WYD' 
  | 'CUSTOM' 
  | 'AI_GENERATED' 
  | 'PURCHASED' 
  | 'FREE_LICENSE';

export interface AssetMetadata {
  dimensions?: string;           // Ex: "64x64", "512x512"
  fileSize?: string;             // Ex: "12KB", "2.4MB"
  format?: string;               // Ex: "png", "glb", "ogg", "json", "svg"
  duration?: number;             // Segundos (para animações/sons)
  color?: string;                // Cor predominante (#c9a961)
  version?: string;              // Ex: "v1.2"
  [key: string]: any;
}

export interface AssetActivity {
  id: string;
  timestamp: string;             // ISO date string
  action: string;                // Ex: "Criado", "Status alterado para Concluído"
  note?: string;
  previousStatus?: AssetStatus;
  newStatus?: AssetStatus;
}

export interface Asset {
  id: string;
  name: string;                    // Nome PT-BR
  category: AssetCategory;
  subcategory?: string;            // Ex: "weapon-sword", "potion", "beast"
  status: AssetStatus;
  priority: Priority;
  origin: AssetOrigin;
  originalReference?: string;      // Ex: "MU/Item/Sword01.bmd"
  targetPath?: string;             // Ex: "assets/icons/items/short-sword.png"
  fileUrl?: string;                // URL do arquivo (quando pronto)
  previewUrl?: string;             // URL de imagem / base64 preview
  iconType?: string;               // Identificador do ícone decorativo
  notes?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  completedAt?: string;
  metadata?: AssetMetadata;
  activities?: AssetActivity[];
}

export interface ProjectSettings {
  name: string;
  director: string;
  description: string;
  startDate: string;
  targetDate?: string;
  githubUrl?: string;
  discordUrl?: string;
  soundEnabled: boolean;
  particlesEnabled: boolean;
  theme: 'dark-gold' | 'obsidian-crimson' | 'ethereal-azure' | 'emerald-forest';
  density: 'compact' | 'normal' | 'spacious';
}

export interface ReferenceTool {
  id: string;
  name: string;
  category: 'EXTRACTOR' | 'FREE_RESOURCE' | 'MARKETPLACE' | 'AI_TOOL' | 'DOCS';
  description: string;
  url: string;
  cost: string;                   // 'Grátis', 'Freemium', 'Pago', 'Open Source'
  tags: string[];
  iconName?: string;
  featured?: boolean;
}

export interface FilterState {
  search: string;
  categories: AssetCategory[];
  status: AssetStatus[];
  priority: Priority[];
  origins: AssetOrigin[];
  sortBy: 'name-asc' | 'name-desc' | 'priority' | 'status' | 'category' | 'date-newest' | 'date-oldest' | 'updated';
  viewMode: 'grid' | 'list' | 'kanban';
}

export type NavigationTab = 
  | 'dashboard'
  | 'assets'
  | 'categories'
  | 'progress'
  | 'references'
  | 'settings';
