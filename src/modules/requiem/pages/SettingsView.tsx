import React, { useState } from 'react';
import { useAssets } from '../context/AssetContext';
import { 
  Settings, 
  Save, 
  Download, 
  Upload, 
  RotateCcw, 
  Trash2, 
  FileSpreadsheet, 
  FileJson, 
  Volume2, 
  VolumeX, 
  Palette, 
  Sparkles
} from 'lucide-react';
import { sounds } from '../utils/soundEffects';
import { ConfirmDialog } from '../components/common/ConfirmDialog';

export const SettingsView: React.FC = () => {
  const { 
    projectSettings, 
    updateProjectSettings, 
    exportJSON, 
    importJSON, 
    exportExcel, 
    resetToInitialSeed, 
    clearAllAssets 
  } = useAssets();

  const [name, setName] = useState(projectSettings.name);
  const [director, setDirector] = useState(projectSettings.director);
  const [description, setDescription] = useState(projectSettings.description);
  const [startDate, setStartDate] = useState(projectSettings.startDate);
  const [targetDate, setTargetDate] = useState(projectSettings.targetDate || '2026-12-31');
  const [githubUrl, setGithubUrl] = useState(projectSettings.githubUrl || '');
  const [discordUrl, setDiscordUrl] = useState(projectSettings.discordUrl || '');
  const [soundEnabled, setSoundEnabled] = useState(projectSettings.soundEnabled);
  const [particlesEnabled, setParticlesEnabled] = useState(projectSettings.particlesEnabled);
  const [density, setDensity] = useState(projectSettings.density);

  // Modals
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isClearConfirmOpen, setIsClearConfirmOpen] = useState(false);

  const handleSaveProjectInfo = (e: React.FormEvent) => {
    e.preventDefault();
    updateProjectSettings({
      name,
      director,
      description,
      startDate,
      targetDate,
      githubUrl,
      discordUrl,
      soundEnabled,
      particlesEnabled,
      density
    });
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        importJSON(content);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-8 pb-16 max-w-5xl mx-auto">
      
      {/* Header */}
      <div>
        <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-[#f0d98c] flex items-center gap-2">
          <span>CONFIGURAÇÕES DO PROJETO & DADOS</span>
        </h2>
        <p className="text-xs text-[#8a7c5c] mt-0.5">
          Gerencie os metadados do MMORPG, tema visual, exportações para backup e relatórios em Excel.
        </p>
      </div>

      {/* Form: Project Information */}
      <form onSubmit={handleSaveProjectInfo} className="p-6 rounded-2xl bg-[#141414] border border-[#3d2f1f] shadow-xl medieval-frame space-y-6">
        <div className="border-b border-[#3d2f1f] pb-3 flex items-center justify-between">
          <h3 className="text-sm font-cinzel font-bold text-[#c9a961] uppercase tracking-wider flex items-center gap-2">
            <Settings size={16} />
            <span>Informações de Requiem of Legends</span>
          </h3>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg font-cinzel font-bold text-xs bg-gradient-to-r from-[#c9a961] to-[#8b7c4f] text-black hover:brightness-110 shadow transition-all cursor-pointer"
          >
            <Save size={14} />
            <span>Salvar Alterações</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="block text-[#e8d9b0] mb-1.5 font-medium">Nome do Jogo MMORPG</label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
            />
          </div>

          <div>
            <label className="block text-[#e8d9b0] mb-1.5 font-medium">Game Director Responsável</label>
            <input
              type="text"
              value={director}
              onChange={e => setDirector(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm font-bold text-[#f0d98c] focus:outline-none focus:border-[#c9a961]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-[#e8d9b0] mb-1.5 font-medium">Descrição da Visão do Jogo</label>
            <textarea
              rows={3}
              value={description}
              onChange={e => setDescription(e.target.value)}
              className="w-full px-3.5 py-2 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm text-[#e8d9b0] focus:outline-none focus:border-[#c9a961] resize-none"
            />
          </div>

          <div>
            <label className="block text-[#e8d9b0] mb-1.5 font-medium">Data de Início do Desenvolvimento</label>
            <input
              type="date"
              value={startDate}
              onChange={e => setStartDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm font-mono text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
            />
          </div>

          <div>
            <label className="block text-[#e8d9b0] mb-1.5 font-medium">Data Alvo para o MVP Jogável</label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm font-mono text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
            />
          </div>

          <div>
            <label className="block text-[#e8d9b0] mb-1.5 font-medium">Repositório GitHub</label>
            <input
              type="url"
              value={githubUrl}
              onChange={e => setGithubUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm font-mono text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
            />
          </div>

          <div>
            <label className="block text-[#e8d9b0] mb-1.5 font-medium">Comunidade Discord</label>
            <input
              type="url"
              value={discordUrl}
              onChange={e => setDiscordUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#0d0d0d] border border-[#3d2f1f] text-sm font-mono text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
            />
          </div>
        </div>
      </form>

      {/* Appearance & Sound Settings */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#3d2f1f] shadow-xl medieval-frame space-y-6">
        <div className="border-b border-[#3d2f1f] pb-3">
          <h3 className="text-sm font-cinzel font-bold text-[#c9a961] uppercase tracking-wider flex items-center gap-2">
            <Palette size={16} />
            <span>Aparência & Experiência Imersiva</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          
          {/* Audio toggle */}
          <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#3d2f1f] flex items-center justify-between">
            <div>
              <span className="text-sm font-cinzel font-bold text-[#e8d9b0] block">Efeitos Sonoros</span>
              <span className="text-[11px] text-[#8a7c5c]">Sons clássicos de cliques e itens</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !soundEnabled;
                setSoundEnabled(next);
                updateProjectSettings({ soundEnabled: next });
                if (next) sounds.playBlessChime();
              }}
              className={`p-2.5 rounded-lg border transition-all ${
                soundEnabled
                  ? 'border-[#c9a961] bg-[#1c170f] text-[#f0d98c]'
                  : 'border-[#3d2f1f] bg-[#1a1a1a] text-[#8a7c5c]'
              }`}
            >
              {soundEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
            </button>
          </div>

          {/* Particles toggle */}
          <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#3d2f1f] flex items-center justify-between">
            <div>
              <span className="text-sm font-cinzel font-bold text-[#e8d9b0] block">Partículas & Confetti</span>
              <span className="text-[11px] text-[#8a7c5c]">Efeitos visuais ao concluir assets</span>
            </div>
            <button
              type="button"
              onClick={() => {
                const next = !particlesEnabled;
                setParticlesEnabled(next);
                updateProjectSettings({ particlesEnabled: next });
              }}
              className={`p-2.5 rounded-lg border transition-all ${
                particlesEnabled
                  ? 'border-[#27ae60] bg-[#0e2417] text-[#2ecc71]'
                  : 'border-[#3d2f1f] bg-[#1a1a1a] text-[#8a7c5c]'
              }`}
            >
              <Sparkles size={18} />
            </button>
          </div>

          {/* Density toggle */}
          <div className="p-4 rounded-xl bg-[#0d0d0d] border border-[#3d2f1f] flex items-center justify-between">
            <div>
              <span className="text-sm font-cinzel font-bold text-[#e8d9b0] block">Densidade da UI</span>
              <span className="text-[11px] text-[#8a7c5c]">Espaçamento dos painéis</span>
            </div>
            <select
              value={density}
              onChange={e => {
                setDensity(e.target.value as any);
                updateProjectSettings({ density: e.target.value as any });
              }}
              className="px-2.5 py-1.5 rounded-lg bg-[#141414] border border-[#3d2f1f] text-xs text-[#e8d9b0] focus:outline-none focus:border-[#c9a961]"
            >
              <option value="compact">Compacta</option>
              <option value="normal">Normal</option>
              <option value="spacious">Espaçosa</option>
            </select>
          </div>
        </div>
      </div>

      {/* Data Management & Backups */}
      <div className="p-6 rounded-2xl bg-[#141414] border border-[#3d2f1f] shadow-xl medieval-frame space-y-6">
        <div className="border-b border-[#3d2f1f] pb-3">
          <h3 className="text-sm font-cinzel font-bold text-[#c9a961] uppercase tracking-wider flex items-center gap-2">
            <Download size={16} />
            <span>Gerenciamento de Dados & Backups</span>
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Export JSON */}
          <button
            onClick={exportJSON}
            className="p-4 rounded-xl bg-[#0d0d0d] border border-[#3d2f1f] hover:border-[#c9a961] text-left transition-all group"
          >
            <FileJson size={24} className="text-[#c9a961] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-cinzel font-bold text-[#e8d9b0]">Exportar JSON</h4>
            <p className="text-[11px] text-[#8a7c5c] mt-1">Backup completo de todos os assets e configurações.</p>
          </button>

          {/* Export Excel */}
          <button
            onClick={exportExcel}
            className="p-4 rounded-xl bg-[#0d0d0d] border border-[#3d2f1f] hover:border-[#27ae60] text-left transition-all group"
          >
            <FileSpreadsheet size={24} className="text-[#2ecc71] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-cinzel font-bold text-[#e8d9b0]">Planilha Excel (.xlsx)</h4>
            <p className="text-[11px] text-[#8a7c5c] mt-1">Exportar tabela com abas por categoria.</p>
          </button>

          {/* Import JSON */}
          <label className="p-4 rounded-xl bg-[#0d0d0d] border border-[#3d2f1f] hover:border-[#3498db] text-left transition-all cursor-pointer group">
            <Upload size={24} className="text-[#3498db] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-cinzel font-bold text-[#e8d9b0]">Importar JSON</h4>
            <p className="text-[11px] text-[#8a7c5c] mt-1">Restaurar backup a partir de arquivo local.</p>
            <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
          </label>

          {/* Reset to Seed 104 */}
          <button
            onClick={() => setIsResetConfirmOpen(true)}
            className="p-4 rounded-xl bg-[#0d0d0d] border border-[#3d2f1f] hover:border-[#f39c12] text-left transition-all group"
          >
            <RotateCcw size={24} className="text-[#f39c12] mb-2 group-hover:scale-110 transition-transform" />
            <h4 className="text-xs font-cinzel font-bold text-[#e8d9b0]">Restaurar 104 Assets</h4>
            <p className="text-[11px] text-[#8a7c5c] mt-1">Recarregar os 104 assets originais de Requiem.</p>
          </button>
        </div>

        {/* Danger Zone */}
        <div className="pt-4 border-t border-[#3d2f1f]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-cinzel font-bold text-[#c0392b] block">Zona de Perigo</span>
            <span className="text-[11px] text-[#8a7c5c]">Esvaziar todos os registros locais salvos no navegador.</span>
          </div>

          <button
            onClick={() => setIsClearConfirmOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-[#c0392b]/50 text-[#e74c3c] hover:bg-[#c0392b]/20 text-xs font-semibold transition-all"
          >
            <Trash2 size={14} />
            <span>Limpar Todos os Dados</span>
          </button>
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        title="Restaurar Dados Iniciais?"
        message="Esta ação restaurará a base com todos os 104 assets originais de Requiem of Legends. Alterações customizadas serão substituídas."
        confirmLabel="Sim, Restaurar 104 Assets"
        onConfirm={() => {
          resetToInitialSeed();
          setIsResetConfirmOpen(false);
        }}
        onCancel={() => setIsResetConfirmOpen(false)}
      />

      <ConfirmDialog
        isOpen={isClearConfirmOpen}
        title="Apagar Absolutamente Tudo?"
        message="Atenção: todos os assets e notas serão permanentemente removidos. Recomendamos exportar um backup JSON antes de prosseguir."
        confirmLabel="Sim, Apagar Tudo"
        isDanger={true}
        onConfirm={() => {
          clearAllAssets();
          setIsClearConfirmOpen(false);
        }}
        onCancel={() => setIsClearConfirmOpen(false)}
      />
    </div>
  );
};
