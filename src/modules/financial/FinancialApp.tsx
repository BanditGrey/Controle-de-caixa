import React, { useState } from 'react';
import { FinancialProvider } from './context/FinancialContext';
import { MainLayout } from './components/layout/MainLayout';
import { Login } from './pages/Login';

interface FinancialAppProps {
  onSwitchApp?: () => void;
}

export const FinancialApp: React.FC<FinancialAppProps> = ({ onSwitchApp }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  return (
    <FinancialProvider>
      {/* Top Demonstrative Switcher Ribbon */}
      <div className="bg-slate-900 text-slate-200 border-b border-slate-800 px-4 py-1.5 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-slate-400">Demonstrativo Ativo:</span>
          <span className="font-bold text-emerald-400">💼 FluxoPro — Controle de Caixa & Gestão Financeira</span>
        </div>
        {onSwitchApp && (
          <button
            onClick={onSwitchApp}
            className="flex items-center gap-1.5 px-3 py-1 rounded bg-amber-950/60 border border-amber-500/50 text-amber-300 hover:bg-amber-500 hover:text-black font-semibold text-xs transition-all cursor-pointer shadow-sm"
          >
            <span>⚔️ Alternar para Requiem Asset Manager</span>
          </button>
        )}
      </div>

      {isAuthenticated ? (
        <MainLayout onLogout={() => setIsAuthenticated(false)} />
      ) : (
        <Login onLoginSuccess={() => setIsAuthenticated(true)} />
      )}
    </FinancialProvider>
  );
};

export default FinancialApp;
