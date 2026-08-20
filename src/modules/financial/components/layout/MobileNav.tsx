import React from 'react';
import {
  LayoutDashboard,
  ArrowDownLeft,
  ArrowUpRight,
  TrendingUp,
  Receipt,
  FileCheck2,
  FolderTree,
  History,
  FileSpreadsheet,
  Settings,
  Users,
  UserCheck,
  X,
  WalletCards,
  Plus,
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';

interface MobileNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isOpen: boolean;
  onClose: () => void;
  onOpenQuickAction: () => void;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  currentPage,
  onNavigate,
  isOpen,
  onClose,
  onOpenQuickAction,
}) => {
  const { company, currentUser, overduePayablesCount } = useFinancial();

  const primaryBottomNav = [
    { id: 'dashboard', label: 'Início', icon: LayoutDashboard },
    { id: 'entradas', label: 'Entradas', icon: ArrowDownLeft },
    { id: 'saidas', label: 'Saídas', icon: ArrowUpRight },
    { id: 'fluxo-caixa', label: 'Fluxo', icon: TrendingUp },
  ];

  const fullNav = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'entradas', label: 'Entradas (Receitas)', icon: ArrowDownLeft },
    { id: 'saidas', label: 'Saídas (Despesas)', icon: ArrowUpRight },
    { id: 'fluxo-caixa', label: 'Fluxo de Caixa Consolidado', icon: TrendingUp },
    { id: 'contas-pagar', label: 'Contas a Pagar', icon: Receipt, badge: overduePayablesCount > 0 ? `${overduePayablesCount} vencidas` : null },
    { id: 'contas-receber', label: 'Contas a Receber', icon: FileCheck2 },
    { id: 'categorias', label: 'Categorias Financeiras', icon: FolderTree },
    { id: 'historico', label: 'Histórico & Extrato', icon: History },
    { id: 'relatorios', label: 'Relatórios & DRE', icon: FileSpreadsheet },
    { id: 'usuarios', label: 'Equipe & Acessos', icon: Users },
    { id: 'configuracoes', label: 'Configurações & Backup', icon: Settings },
    { id: 'perfil', label: 'Meu Perfil', icon: UserCheck },
  ];

  return (
    <>
      {/* Mobile Bottom Navigation Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex h-16 items-center justify-around border-t border-slate-200 bg-white/95 px-2 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95 md:hidden">
        {primaryBottomNav.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onNavigate(item.id)}
              className={`flex flex-col items-center justify-center gap-1 py-1 px-3 rounded-xl transition-colors ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-bold'
                  : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
              }`}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px]">{item.label}</span>
            </button>
          );
        })}

        {/* Center Quick Action Float */}
        <button
          type="button"
          onClick={onOpenQuickAction}
          className="flex h-11 w-11 -mt-5 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg shadow-emerald-600/30 active:scale-95 transition-transform"
        >
          <Plus className="h-6 w-6" />
        </button>
      </div>

      {/* Slide-over Drawer for full navigation */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs" onClick={onClose} />

          {/* Drawer content */}
          <div className="relative flex w-4/5 max-w-xs flex-col bg-white p-5 shadow-2xl dark:bg-slate-900 z-10 animate-in slide-in-from-left">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-600 text-white">
                  <WalletCards className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">FluxoPro</h3>
                  <p className="text-[10px] text-slate-400">{company.tradingName}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="p-1 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto py-4 space-y-1">
              {fullNav.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      onNavigate(item.id);
                      onClose();
                    }}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{item.label}</span>
                    </div>
                    {item.badge && (
                      <span className="text-[9px] bg-rose-500 text-white px-1.5 py-0.5 rounded-full font-bold">
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
              <img
                src={currentUser.avatar}
                alt={currentUser.name}
                className="h-9 w-9 rounded-xl object-cover ring-2 ring-emerald-500"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                  {currentUser.name}
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono uppercase font-bold">
                  {currentUser.role}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
