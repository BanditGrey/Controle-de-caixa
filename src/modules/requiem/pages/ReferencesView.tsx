import React, { useState } from 'react';
import { useAssets } from '../context/AssetContext';
import { ReferenceTool } from '../types';
import { 
  BookOpen, 
  ExternalLink, 
  Plus, 
  Search, 
  Wrench, 
  Gift, 
  ShoppingBag, 
  Bot, 
  Trash2, 
  Star 
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';

export const ReferencesView: React.FC = () => {
  const { references, addReference, deleteReference } = useAssets();
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New reference form state
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ReferenceTool['category']>('EXTRACTOR');
  const [description, setDescription] = useState('');
  const [url, setUrl] = useState('');
  const [cost, setCost] = useState('Grátis');
  const [tagInput, setTagInput] = useState('');

  const sections: { id: string; label: string; icon: React.ReactNode; categoryKey?: ReferenceTool['category'] }[] = [
    { id: 'ALL', label: 'Todos os Recursos', icon: <BookOpen size={16} /> },
    { id: 'EXTRACTOR', label: '🛠️ Extração & 3D', icon: <Wrench size={16} />, categoryKey: 'EXTRACTOR' },
    { id: 'FREE_RESOURCE', label: '🎁 Assets Grátis (CC0)', icon: <Gift size={16} />, categoryKey: 'FREE_RESOURCE' },
    { id: 'MARKETPLACE', label: '💎 Marketplaces Pagos', icon: <ShoppingBag size={16} />, categoryKey: 'MARKETPLACE' },
    { id: 'AI_TOOL', label: '🤖 Geradores de IA', icon: <Bot size={16} />, categoryKey: 'AI_TOOL' }
  ];

  const filteredReferences = references.filter((ref: ReferenceTool) => {
    if (activeCategory !== 'ALL' && ref.category !== activeCategory) {
      return false;
    }
    if (search.trim()) {
      const q = search.toLowerCase().trim();
      return (
        ref.name.toLowerCase().includes(q) ||
        ref.description.toLowerCase().includes(q) ||
        ref.tags.some((t: string) => t.toLowerCase().includes(q))
      );
    }
    return true;
  });

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;

    const tags = tagInput.split(',').map(t => t.trim()).filter(Boolean);

    addReference({
      name: name.trim(),
      category,
      description: description.trim(),
      url: url.trim(),
      cost: cost.trim(),
      tags
    });

    setName('');
    setDescription('');
    setUrl('');
    setCost('Grátis');
    setTagInput('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#f0d98c] flex items-center gap-2">
            <span>BIBLIOTECA DE RECURSOS & FERRAMENTAS</span>
          </h2>
          <p className="text-xs text-[#8a7c5c] mt-0.5">
            Ferramentas essenciais para converter arquivos de MU e WYD, repositórios de áudio CC0 e marketplaces 3D.
          </p>
        </div>

        <button
          onClick={() => {
            sounds.playClick();
            setIsAddModalOpen(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl font-cinzel font-bold text-xs bg-gradient-to-r from-[#c9a961] to-[#8b7c4f] text-black hover:brightness-110 shadow-md shadow-[#c9a961]/20 transition-all cursor-pointer"
        >
          <Plus size={16} className="stroke-[3]" />
          <span>Adicionar Recurso</span>
        </button>
      </div>

      {/* Filter Tabs & Search */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-[#141414] border border-[#3d2f1f] medieval-frame">
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar w-full md:w-auto">
          {sections.map(sec => (
            <button
              key={sec.id}
              onClick={() => {
                sounds.playClick();
                setActiveCategory(sec.id);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-cinzel font-semibold transition-all whitespace-nowrap ${
                activeCategory === sec.id
                  ? 'bg-[#1c170f] border border-[#c9a961] text-[#f0d98c]'
                  : 'text-[#8a7c5c] hover:text-[#e8d9b0] hover:bg-[#1a1a1a]'
              }`}
            >
              {sec.label}
            </button>
          ))}
        </div>

        <div className="relative w-full md:w-64">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8a7c5c]" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar ferramenta..."
            className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#0a0a0a] border border-[#3d2f1f] text-xs text-[#e8d9b0] placeholder-[#8a7c5c] focus:outline-none focus:border-[#c9a961]"
          />
        </div>
      </div>

      {/* Resource Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredReferences.map((tool: ReferenceTool) => (
          <div
            key={tool.id}
            className="relative p-5 rounded-2xl bg-[#141414] border border-[#3d2f1f] hover:border-[#c9a961]/70 shadow-lg hover:shadow-[0_0_25px_rgba(201,169,97,0.15)] transition-all flex flex-col justify-between medieval-frame group"
          >
            <div className="corner-ornament-tl" />
            <div className="corner-ornament-tr" />
            <div className="corner-ornament-bl" />
            <div className="corner-ornament-br" />

            <div>
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-2">
                  {tool.featured && (
                    <span className="p-1 rounded bg-[#c9a961]/20 text-[#f0d98c]" title="Recurso Essencial">
                      <Star size={14} className="fill-[#f0d98c]" />
                    </span>
                  )}
                  <h3 className="text-base font-cinzel font-bold text-[#e8d9b0] group-hover:text-[#f0d98c] transition-colors">
                    {tool.name}
                  </h3>
                </div>

                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#0d0d0d] border border-[#3d2f1f] text-[#c9a961] shrink-0">
                  {tool.cost}
                </span>
              </div>

              {/* Description */}
              <p className="text-xs text-[#8a7c5c] leading-relaxed mb-4 min-h-[48px]">
                {tool.description}
              </p>

              {/* Tags */}
              <div className="flex flex-wrap gap-1 mb-4">
                {tool.tags.map((t: string) => (
                  <span
                    key={t}
                    className="px-2 py-0.5 rounded bg-[#0d0d0d] border border-[#3d2f1f]/50 text-[10px] font-mono text-[#8a7c5c]"
                  >
                    #{t}
                  </span>
                ))}
              </div>
            </div>

            {/* Bottom Link Action */}
            <div className="pt-3 border-t border-[#3d2f1f] flex items-center justify-between gap-2">
              <span className="text-[10px] font-mono text-[#8a7c5c] truncate max-w-[160px]">
                {tool.url.replace(/^https?:\/\//, '')}
              </span>

              <div className="flex items-center gap-1.5">
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => sounds.playClick()}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-cinzel font-bold text-xs bg-[#1c170f] border border-[#c9a961]/40 text-[#f0d98c] hover:bg-[#c9a961] hover:text-black transition-all"
                >
                  <span>Abrir Link</span>
                  <ExternalLink size={12} />
                </a>

                {tool.id.startsWith('ref-') && (
                  <button
                    onClick={() => deleteReference(tool.id)}
                    className="p-1.5 rounded text-[#8a7c5c] hover:text-[#c0392b] transition-colors"
                    title="Excluir recurso"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Resource Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg bg-[#141414] border border-[#c9a961] rounded-xl p-6 shadow-2xl medieval-frame">
            <div className="corner-ornament-tl" />
            <div className="corner-ornament-tr" />
            <div className="corner-ornament-bl" />
            <div className="corner-ornament-br" />

            <h3 className="text-lg font-cinzel font-bold text-[#f0d98c] mb-4">
              Registrar Novo Recurso
            </h3>

            <form onSubmit={handleAddSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#e8d9b0] mb-1">Nome da Ferramenta / Site *</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="Ex: Kenney Assets, Tripo3D"
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#e8d9b0] mb-1">Categoria *</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                  >
                    <option value="EXTRACTOR">🛠️ Extração & 3D</option>
                    <option value="FREE_RESOURCE">🎁 Assets Grátis</option>
                    <option value="MARKETPLACE">💎 Marketplace</option>
                    <option value="AI_TOOL">🤖 Ferramenta IA</option>
                    <option value="DOCS">📖 Documentação</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[#e8d9b0] mb-1">Custo / Licença</label>
                  <input
                    type="text"
                    value={cost}
                    onChange={e => setCost(e.target.value)}
                    placeholder="Grátis, CC0, Pago"
                    className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#e8d9b0] mb-1">URL / Link Direto *</label>
                <input
                  type="url"
                  required
                  value={url}
                  onChange={e => setUrl(e.target.value)}
                  placeholder="https://exemplo.com"
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                />
              </div>

              <div>
                <label className="block text-[#e8d9b0] mb-1">Descrição Curta</label>
                <textarea
                  rows={2}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Para que serve este recurso..."
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-[#e8d9b0] focus:outline-none focus:border-[#c9a961] resize-none"
                />
              </div>

              <div>
                <label className="block text-[#e8d9b0] mb-1">Tags (separadas por vírgula)</label>
                <input
                  type="text"
                  value={tagInput}
                  onChange={e => setTagInput(e.target.value)}
                  placeholder="3d, modelos, lorencia, sfx"
                  className="w-full px-3 py-2 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
                />
              </div>

              <div className="mt-6 pt-4 border-t border-[#3d2f1f] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-lg border border-[#3d2f1f] text-[#8a7c5c] hover:text-[#e8d9b0]"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-lg font-cinzel font-bold text-xs bg-[#c9a961] text-black hover:brightness-110"
                >
                  Salvar Recurso
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
