import React, { useState } from 'react';
import {
  Building2,
  Database,
  Download,
  Upload,
  RotateCcw,
  Check,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { ConfirmDialog } from '../components/common/ConfirmDialog';
import { CompanySettings } from '../types';

export const Configuracoes: React.FC = () => {
  const {
    company,
    updateCompanySettings,
    exportDatabaseJSON,
    importDatabaseJSON,
    resetDatabaseToDefault,
    currentUser,
  } = useFinancial();

  const [form, setForm] = useState<CompanySettings>({ ...company });
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false);
  const [isSaveSuccess, setIsSaveSuccess] = useState(false);

  const handleSaveCompany = (e: React.FormEvent) => {
    e.preventDefault();
    updateCompanySettings(form);
    setIsSaveSuccess(true);
    setTimeout(() => setIsSaveSuccess(false), 3000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        if (text) {
          importDatabaseJSON(text);
        }
      };
      reader.readAsText(file);
    }
  };

  const isViewer = currentUser.role === 'visualizador';

  return (
    <div className="max-w-4xl space-y-6">
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Configurações do Sistema
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Personalize dados da empresa, regras de alerta de caixa e realize cópias de segurança
        </p>
      </div>

      {/* Company Details Form */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-950 dark:text-indigo-400">
            <Building2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Identificação da Empresa
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Esses dados serão exibidos no topo dos relatórios em PDF e cabeçalhos
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveCompany} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Razão Social *
              </label>
              <input
                type="text"
                required
                value={form.companyName}
                onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nome Fantasia
              </label>
              <input
                type="text"
                value={form.tradingName}
                onChange={(e) => setForm({ ...form, tradingName: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                CNPJ
              </label>
              <input
                type="text"
                value={form.cnpj}
                onChange={(e) => setForm({ ...form, cnpj: e.target.value })}
                placeholder="00.000.000/0001-00"
                className="w-full font-mono rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                E-mail Financeiro
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Telefone / WhatsApp
              </label>
              <input
                type="text"
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
                className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Endereço Completo
            </label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
            />
          </div>

          {/* Financial Parameters Section */}
          <div className="pt-5 border-t border-slate-100 dark:border-slate-800">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">
              Parâmetros & Regras Financeiras
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Saldo Inicial de Abertura (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.initialBalance}
                  onChange={(e) => setForm({ ...form, initialBalance: parseFloat(e.target.value) || 0 })}
                  className="w-full font-mono font-bold rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alerta de Saldo Baixo (R$)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={form.lowBalanceThreshold}
                  onChange={(e) => setForm({ ...form, lowBalanceThreshold: parseFloat(e.target.value) || 0 })}
                  className="w-full font-mono rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Alerta de Vencimento (Dias antes)
                </label>
                <select
                  value={form.dueAlertDays}
                  onChange={(e) => setForm({ ...form, dueAlertDays: Number(e.target.value) })}
                  className="w-full rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-xs text-slate-900 focus:border-indigo-500 focus:outline-hidden dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                >
                  <option value={1}>1 dia de antecedência</option>
                  <option value={3}>3 dias de antecedência</option>
                  <option value={5}>5 dias de antecedência</option>
                  <option value={7}>7 dias de antecedência</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            {isSaveSuccess && (
              <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1 animate-in fade-in">
                <Check className="h-4 w-4" /> Alterações salvas!
              </span>
            )}
            <button
              type="submit"
              disabled={isViewer}
              className={`px-5 py-2.5 text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 rounded-xl shadow-xs transition-colors ${
                isViewer ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Salvar Configurações
            </button>
          </div>
        </form>
      </div>

      {/* Backup & Database Management */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-6 shadow-xs dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center gap-3 pb-4 mb-5 border-b border-slate-100 dark:border-slate-800">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-400">
            <Database className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-white text-base">
              Backup, Restauração & Segurança
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Exporte seus dados em JSON para segurança ou restaure o estado original
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Export JSON */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                <Download className="h-4 w-4 text-emerald-600" />
                <span>Exportar Backup (JSON)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Baixe um arquivo seguro contendo todas as transações, categorias e contas cadastradas.
              </p>
            </div>
            <button
              type="button"
              onClick={exportDatabaseJSON}
              className="mt-4 w-full py-2 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs"
            >
              Baixar Backup Completo
            </button>
          </div>

          {/* Import JSON */}
          <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/60 dark:bg-slate-800/40 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white text-xs">
                <Upload className="h-4 w-4 text-indigo-600" />
                <span>Restaurar Backup (JSON)</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Carregue um arquivo JSON gerado anteriormente para restaurar todos os dados.
              </p>
            </div>
            <label
              className={`mt-4 w-full py-2 bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white rounded-xl text-xs font-bold transition-colors text-center cursor-pointer shadow-2xs ${
                isViewer ? 'opacity-50 pointer-events-none' : ''
              }`}
            >
              <span>Importar Arquivo JSON</span>
              <input type="file" accept=".json" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Reset Factory */}
          <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/40 dark:bg-rose-950/20 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 font-bold text-rose-700 dark:text-rose-400 text-xs">
                <RotateCcw className="h-4 w-4" />
                <span>Resetar Dados de Fábrica</span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 leading-snug">
                Recarrega todos os exemplos de demonstração iniciais e limpa customizações.
              </p>
            </div>
            <button
              type="button"
              disabled={isViewer}
              onClick={() => setIsResetConfirmOpen(true)}
              className={`mt-4 w-full py-2 bg-rose-600 hover:bg-rose-700 active:bg-rose-800 text-white rounded-xl text-xs font-bold transition-colors shadow-2xs ${
                isViewer ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Resetar para Padrão
            </button>
          </div>
        </div>
      </div>

      {/* Confirm Reset Dialog */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={resetDatabaseToDefault}
        title="Resetar Banco de Dados"
        message="Atenção! Esta ação restaurará todos os lançamentos, categorias e contas para os dados de demonstração originais. Deseja continuar?"
        confirmText="Sim, Restaurar Padrão"
        variant="danger"
      />
    </div>
  );
};
