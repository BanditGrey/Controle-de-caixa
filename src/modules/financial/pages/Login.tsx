import React, { useState } from 'react';
import {
  WalletCards,
  ShieldCheck,
  Shield,
  Eye,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';
import { useFinancial } from '../context/FinancialContext';
import { UserRole } from '../types';

interface LoginProps {
  onLoginSuccess: () => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const { switchUserRole, users, showToast } = useFinancial();

  const [email, setEmail] = useState('daniel.silva@alfastore.com.br');
  const [password, setPassword] = useState('••••••••');

  const handleManualLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Check if user exists in list
    const found = users.find((u: any) => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      switchUserRole(found.role);
    } else {
      switchUserRole('admin');
    }

    showToast('Acesso autorizado! Bem-vindo, Daniel Silva.', 'success', 'Login Realizado');
    onLoginSuccess();
  };

  const handleQuickDemoLogin = (role: UserRole) => {
    switchUserRole(role);
    showToast(
      `Conectado com perfil: ${role.toUpperCase()}`,
      'success',
      'Demonstração Ativada'
    );
    onLoginSuccess();
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden selection:bg-emerald-500 selection:text-white">
      {/* Background Decorative Gradient Blobs */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center z-10 px-4">
        {/* Brand Logo */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-xl shadow-emerald-500/20 mb-4">
          <WalletCards className="h-8 w-8" />
        </div>

        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-sans">
          FluxoPro
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Sistema de Controle de Caixa & Gestão Financeira
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 z-10">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6">
          {/* Quick Demo Login Preset Buttons */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                Acesso Rápido para Demonstração:
              </span>
            </div>

            <div className="space-y-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-purple-500/30 bg-purple-950/20 hover:bg-purple-950/40 text-purple-200 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-purple-600 text-white">
                    <ShieldCheck className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-purple-300">
                      Administrador (Acesso Total)
                    </h5>
                    <p className="text-[10px] text-purple-300/70">Daniel Silva</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-purple-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('financeiro')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-cyan-500/30 bg-cyan-950/20 hover:bg-cyan-950/40 text-cyan-200 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-cyan-600 text-white">
                    <Shield className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-cyan-300">
                      Operador Financeiro
                    </h5>
                    <p className="text-[10px] text-cyan-300/70">Mariana Duarte Souza</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('visualizador')}
                className="w-full flex items-center justify-between p-3 rounded-2xl border border-slate-700 bg-slate-800/40 hover:bg-slate-800/80 text-slate-300 transition-all text-left group"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-700 text-white">
                    <Eye className="h-4 w-4" />
                  </div>
                  <div>
                    <h5 className="text-xs font-bold text-white group-hover:text-slate-200">
                      Visualizador (Auditoria / Relatórios)
                    </h5>
                    <p className="text-[10px] text-slate-400">Lucas Martins Ferreira</p>
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-800 w-full" />
            <span className="bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              ou acesse com sua conta
            </span>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleManualLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                E-mail ou Usuário
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-3 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                  placeholder="daniel.silva@alfastore.com.br"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-300">
                  Senha de Acesso
                </label>
                <button
                  type="button"
                  onClick={() =>
                    showToast('Link de recuperação enviado para o e-mail cadastrado.', 'info')
                  }
                  className="text-[11px] text-emerald-400 hover:underline"
                >
                  Esqueci minha senha
                </button>
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-slate-700 bg-slate-800/80 py-2.5 pl-10 pr-3 text-xs text-white focus:border-emerald-500 focus:outline-hidden"
                  placeholder="••••••••"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/30 transition-all flex items-center justify-center gap-2"
            >
              <span>Entrar como Daniel Silva (Admin)</span>
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>
        </div>

        {/* Security badge footer */}
        <div className="mt-6 text-center text-xs text-slate-500 flex items-center justify-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          <span>Ambiente Seguro • Criptografia de Ponta a Ponta</span>
        </div>
      </div>
    </div>
  );
};
