import { AssetCategory, AssetOrigin, AssetStatus, Priority } from '../types';

export const CATEGORY_DETAILS: Record<AssetCategory, {
  label: string;
  singular: string;
  icon: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  badgeText: string;
  description: string;
}> = {
  ITEM: {
    label: 'Itens & Equipamentos',
    singular: 'Item',
    icon: 'Sword',
    color: '#c9a961',
    badgeBg: 'rgba(201, 169, 97, 0.15)',
    badgeBorder: '#c9a961',
    badgeText: '#f0d98c',
    description: 'Armas, armaduras, joias de refino (Bless/Soul/Chaos), poções e pergaminhos.'
  },
  MONSTER: {
    label: 'Monstros & Bosses',
    singular: 'Monstro',
    icon: 'Skull',
    color: '#c0392b',
    badgeBg: 'rgba(192, 57, 43, 0.15)',
    badgeBorder: '#c0392b',
    badgeText: '#e74c3c',
    description: 'Criaturas hostis, elites e chefes de masmorra de Lorencia, Devias e além.'
  },
  MAP: {
    label: 'Mapas & Ambientes',
    singular: 'Mapa',
    icon: 'Compass',
    color: '#27ae60',
    badgeBg: 'rgba(39, 174, 96, 0.15)',
    badgeBorder: '#27ae60',
    badgeText: '#2ecc71',
    description: 'Cenários 3D, cidades hub, dungeons e terrenos de MU e WYD.'
  },
  ANIMATION: {
    label: 'Animações & VFX',
    singular: 'Animação',
    icon: 'Sparkles',
    color: '#8e44ad',
    badgeBg: 'rgba(142, 68, 173, 0.15)',
    badgeBorder: '#8e44ad',
    badgeText: '#9b59b6',
    description: 'Ciclos de ataque, números flutuantes de dano, partículas de feitiços e celebrações.'
  },
  SOUND: {
    label: 'Sons & Trilhas',
    singular: 'Som',
    icon: 'Volume2',
    color: '#2980b9',
    badgeBg: 'rgba(41, 128, 185, 0.15)',
    badgeBorder: '#2980b9',
    badgeText: '#3498db',
    description: 'Efeitos sonoros (SFX), trilhas sonoras orquestradas e alertas de combate.'
  },
  UI: {
    label: 'Interface de Usuário (UI)',
    singular: 'UI',
    icon: 'Layout',
    color: '#d35400',
    badgeBg: 'rgba(211, 84, 0, 0.15)',
    badgeBorder: '#d35400',
    badgeText: '#e67e22',
    description: 'Orbes de vida/mana, molduras de mini-mapa, slots de inventário e diálogos.'
  },
  CHARACTER: {
    label: 'Personagens & Classes',
    singular: 'Personagem',
    icon: 'Shield',
    color: '#16a085',
    badgeBg: 'rgba(22, 160, 133, 0.15)',
    badgeBorder: '#16a085',
    badgeText: '#1abc9c',
    description: 'Classes jogáveis (Dark Knight, Dark Wizard, Fairy Elf, TransKnight, Foema) e NPCs.'
  },
  EFFECT: {
    label: 'Efeitos Especiais (FX)',
    singular: 'Efeito FX',
    icon: 'Flame',
    color: '#f39c12',
    badgeBg: 'rgba(243, 156, 18, 0.15)',
    badgeBorder: '#f39c12',
    badgeText: '#f1c40f',
    description: 'Auras sagradas da Bless, fogo da Chaos Machine e ondas de impacto elementais.'
  }
};

export const STATUS_DETAILS: Record<AssetStatus, {
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  textColor: string;
}> = {
  PENDING: {
    label: 'Pendente',
    icon: 'Clock',
    color: '#7f8c8d',
    bg: 'rgba(127, 140, 141, 0.15)',
    border: '#7f8c8d',
    textColor: '#bdc3c7'
  },
  IN_PROGRESS: {
    label: 'Em Progresso',
    icon: 'Loader2',
    color: '#f39c12',
    bg: 'rgba(243, 156, 18, 0.15)',
    border: '#f39c12',
    textColor: '#f1c40f'
  },
  COMPLETED: {
    label: 'Concluído',
    icon: 'CheckCircle2',
    color: '#27ae60',
    bg: 'rgba(39, 174, 96, 0.15)',
    border: '#27ae60',
    textColor: '#2ecc71'
  }
};

export const PRIORITY_DETAILS: Record<Priority, {
  label: string;
  icon: string;
  color: string;
  bg: string;
  border: string;
  textColor: string;
  rank: number;
}> = {
  CRITICAL: {
    label: 'Crítica',
    icon: 'Flame',
    color: '#c0392b',
    bg: 'rgba(192, 57, 43, 0.2)',
    border: '#c0392b',
    textColor: '#e74c3c',
    rank: 4
  },
  HIGH: {
    label: 'Alta',
    icon: 'ArrowUp',
    color: '#e67e22',
    bg: 'rgba(230, 126, 34, 0.2)',
    border: '#e67e22',
    textColor: '#f39c12',
    rank: 3
  },
  MEDIUM: {
    label: 'Média',
    icon: 'ArrowRight',
    color: '#f1c40f',
    bg: 'rgba(241, 196, 15, 0.15)',
    border: '#f1c40f',
    textColor: '#f0d98c',
    rank: 2
  },
  LOW: {
    label: 'Baixa',
    icon: 'ArrowDown',
    color: '#7f8c8d',
    bg: 'rgba(127, 140, 141, 0.15)',
    border: '#7f8c8d',
    textColor: '#95a5a6',
    rank: 1
  }
};

export const ORIGIN_DETAILS: Record<AssetOrigin, {
  label: string;
  badge: string;
  color: string;
}> = {
  MU: { label: 'MU Online', badge: 'MU', color: '#c9a961' },
  WYD: { label: 'With Your Destiny (WYD)', badge: 'WYD', color: '#3498db' },
  CUSTOM: { label: 'Original Requiem', badge: 'CUSTOM', color: '#9b59b6' },
  AI_GENERATED: { label: 'Gerado com IA', badge: 'AI', color: '#1abc9c' },
  PURCHASED: { label: 'Comprado / Marketplace', badge: 'STORE', color: '#e67e22' },
  FREE_LICENSE: { label: 'Creative Commons / Grátis', badge: 'FREE', color: '#27ae60' }
};

export function formatDate(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch {
    return dateString;
  }
}

export function formatRelativeTime(dateString?: string): string {
  if (!dateString) return '—';
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'agora mesmo';
    if (diffInSeconds < 3600) return `há ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `há ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `há ${Math.floor(diffInSeconds / 86400)} d`;
    
    return formatDate(dateString);
  } catch {
    return 'recentemente';
  }
}
