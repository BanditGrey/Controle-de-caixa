import { ReferenceTool } from '../types';

export const INITIAL_REFERENCES: ReferenceTool[] = [
  // ==========================================
  // FERRAMENTAS DE EXTRAÇÃO & MODELAGEM
  // ==========================================
  {
    id: 'mu-model-viewer',
    name: 'MU Model Viewer / BMD Tools',
    category: 'EXTRACTOR',
    description: 'Visualizador e extrator de modelos 3D, texturas e animações dos arquivos clássicos .BMD e .ATT do MU Online.',
    url: 'https://github.com/search?q=mu+online+bmd+viewer',
    cost: 'Open Source',
    tags: ['MU Online', 'BMD', '3D Viewer', 'Texturas', 'Extrator'],
    featured: true
  },
  {
    id: 'wyd-studio',
    name: 'WYD Studio & WYT Tools',
    category: 'EXTRACTOR',
    description: 'Ferramentas de extração de meshes, mapas .wyt, efeitos visuais e dados de criaturas do motor original de With Your Destiny.',
    url: 'https://github.com/search?q=wyd+tools',
    cost: 'Open Source',
    tags: ['WYD', 'Kersef', 'WYT', 'Mapas', 'Modelos']
  },
  {
    id: 'blender',
    name: 'Blender 3D',
    category: 'EXTRACTOR',
    description: 'A suíte 3D open-source padrão para modelagem, rigging de personagens, texturização, exportação GLTF/GLB e animação.',
    url: 'https://www.blender.org/',
    cost: 'Open Source (Grátis)',
    tags: ['Modelagem 3D', 'GLB', 'Rigging', 'Animação', 'Indispensável'],
    featured: true
  },
  {
    id: 'ozj-converter',
    name: 'OZJ / OZT Converter',
    category: 'EXTRACTOR',
    description: 'Utilitário de conversão para decodificar arquivos de textura proprietários de MMORPGs dos anos 2000 em formato PNG/TGA puro.',
    url: 'https://github.com/search?q=ozj+ozt+converter',
    cost: 'Open Source',
    tags: ['Texturas', 'Conversor', 'OZJ', 'OZT', 'PNG']
  },

  // ==========================================
  // FONTES DE ASSETS GRÁTIS
  // ==========================================
  {
    id: 'game-icons',
    name: 'Game-Icons.net',
    category: 'FREE_RESOURCE',
    description: 'Mais de 4.000 ícones vetoriais personalizáveis com temática RPG medieval, fantasias, magias e equipamentos sob licença CC-BY.',
    url: 'https://game-icons.net/',
    cost: '100% Grátis (CC-BY)',
    tags: ['Ícones', 'SVG', 'RPG', 'Itens', 'Skills'],
    featured: true
  },
  {
    id: 'kenney-nl',
    name: 'Kenney.nl (Asset Jesus)',
    category: 'FREE_RESOURCE',
    description: 'Milhares de assets de jogos 2D, 3D, efeitos sonoros e UI em domínio público (CC0). Perfeito para prototipagem rápida e UI.',
    url: 'https://kenney.nl/assets',
    cost: 'Domínio Público (CC0)',
    tags: ['CC0', 'UI', 'Áudio', '3D Models', 'Grátis']
  },
  {
    id: 'opengameart',
    name: 'OpenGameArt.org',
    category: 'FREE_RESOURCE',
    description: 'O maior repositório comunitário de arte 2D, modelos 3D, música medieval e efeitos sonoros gratuitos para jogos independentes.',
    url: 'https://opengameart.org/',
    cost: 'Grátis (Várias Licenças)',
    tags: ['Comunidade', 'Sprites', 'Música', 'VFX', 'Open Source']
  },
  {
    id: 'freesound',
    name: 'FreeSound.org',
    category: 'FREE_RESOURCE',
    description: 'Base de dados colaborativa colossal de efeitos sonoros, sons de passos, lâminas, magias e ambientes da natureza para mixagem.',
    url: 'https://freesound.org/',
    cost: 'Grátis (CC)',
    tags: ['SFX', 'Áudio', 'Espadas', 'Passos', 'Ambiente'],
    featured: true
  },
  {
    id: 'lottiefiles',
    name: 'LottieFiles',
    category: 'FREE_RESOURCE',
    description: 'Animações vetoriais leves baseadas em JSON perfeitas para efeitos de level up, popups de recompensas e celebrações na interface web.',
    url: 'https://lottiefiles.com/',
    cost: 'Freemium',
    tags: ['Animação', 'JSON', 'Level Up', 'UI FX', 'Leve']
  },
  {
    id: 'mixamo',
    name: 'Adobe Mixamo',
    category: 'FREE_RESOURCE',
    description: 'Auto-rigging instantâneo de humanóides 3D e biblioteca com centenas de animações gratuitas de combate, corrida, magias e morte.',
    url: 'https://www.mixamo.com/',
    cost: 'Grátis (Conta Adobe)',
    tags: ['Auto-Rig', 'Animação 3D', 'Combate', 'Guerreiros', 'FBX'],
    featured: true
  },

  // ==========================================
  // MARKETPLACES PAGOS
  // ==========================================
  {
    id: 'synty-studios',
    name: 'Synty Studios',
    category: 'MARKETPLACE',
    description: 'Pacotes low-poly modulares de altíssima qualidade (Dungeon, Fantasy Kingdom, Dark Fantasy) ideais para MMORPGs leves e performáticos.',
    url: 'https://syntystore.com/',
    cost: 'Pago (Pacotes)',
    tags: ['Low Poly', 'Modular', 'Dungeons', 'Reinos', 'Dark Fantasy']
  },
  {
    id: 'unity-asset-store',
    name: 'Unity Asset Store',
    category: 'MARKETPLACE',
    description: 'Extenso catálogo com pacotes de shaders dark fantasy, monstros medievais, armaduras, sistemas de partículas e sons de feitiços.',
    url: 'https://assetstore.unity.com/',
    cost: 'Pago / Grátis',
    tags: ['VFX', 'Monstros', 'Shaders', 'Assets']
  },
  {
    id: 'sketchfab',
    name: 'Sketchfab Store & 3D Hub',
    category: 'MARKETPLACE',
    description: 'Milhões de modelos 3D inspecionáveis no navegador com renderização PBR de ponta e modelos dark fantasy prontos para download.',
    url: 'https://sketchfab.com/feed',
    cost: 'Freemium',
    tags: ['PBR', 'GLTF', 'Dark Souls Style', 'Personagens']
  },
  {
    id: 'meshy-ai',
    name: 'Meshy AI',
    category: 'MARKETPLACE',
    description: 'Geração rápida de malhas 3D e texturas completas a partir de prompts de texto ou imagens 2D usando Inteligência Artificial.',
    url: 'https://www.meshy.ai/',
    cost: 'Freemium',
    tags: ['IA 3D', 'Texturização PBR', 'Prompt para 3D', 'Inovador']
  },

  // ==========================================
  // FERRAMENTAS DE IA
  // ==========================================
  {
    id: 'midjourney',
    name: 'Midjourney',
    category: 'AI_TOOL',
    description: 'A IA de geração de imagem mais avançada para concept art dark fantasy, ícones de itens ornamentados, retratos de NPCs e mapas.',
    url: 'https://www.midjourney.com/',
    cost: 'Pago (Assinatura)',
    tags: ['Concept Art', 'Ícones', 'Dark Fantasy', 'Ilustrações'],
    featured: true
  },
  {
    id: 'dall-e-3',
    name: 'DALL-E 3 (OpenAI)',
    category: 'AI_TOOL',
    description: 'Excelente para geração precisa de ícones de itens medievais isolados com fundo transparente e consistência de prompts.',
    url: 'https://openai.com/dall-e-3',
    cost: 'Freemium / ChatGPT Plus',
    tags: ['Ícones', 'Transparência', 'Equipamentos', 'Itens']
  },
  {
    id: 'stable-diffusion',
    name: 'Stable Diffusion / ComfyUI',
    category: 'AI_TOOL',
    description: 'Geração local e ilimitada com controle absoluto via ControlNet para gerar variações exatas de conjuntos de armaduras e armas.',
    url: 'https://stability.ai/',
    cost: 'Open Source / Grátis',
    tags: ['Local', 'ControlNet', 'Armaduras', 'Texturas', 'Sem Limites']
  },
  {
    id: 'leonardo-ai',
    name: 'Leonardo.ai',
    category: 'AI_TOOL',
    description: 'Plataforma focada em game assets com modelos treinados especificamente para itens de RPG, texturas perfeitas e mapas isométricos.',
    url: 'https://leonardo.ai/',
    cost: 'Freemium (Créditos Diários)',
    tags: ['Game Assets', 'RPG Items', 'Texturas Sem Costura', 'Fácil de Usar'],
    featured: true
  }
];
