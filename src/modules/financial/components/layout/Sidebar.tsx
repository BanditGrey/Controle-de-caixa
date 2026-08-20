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
  LogOut,
  ChevronLeft,
  ChevronRight,
  WalletCards,
  Building2,
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';

interface SidebarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPage,
  onNavigate,
  isCollapsed,
  onToggleCollapse,
  onLogout,
}) => {
  const { company, currentUser, overduePayablesCount, todayDueCount } = useFinancial();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, badge: null },
    { id: 'entradas', label: 'Entradas', icon: ArrowDownLeft, badge: null, color: 'text-emerald-500' },
    { id: 'saidas', label: 'Saídas', icon: ArrowUpRight, badge: null, color: 'text-rose-500' },
    { id: 'fluxo-caixa', label: 'Fluxo de Caixa', icon: TrendingUp, badge: null },
    {
      id: 'contas-pagar',
      label: 'Contas a Pagar',
      icon: Receipt,
      badge: overduePayablesCount > 0 ? overduePayablesCount : todayDueCount > 0 ? 'Hoje' : null,
      badgeType: overduePayablesCount > 0 ? 'danger' : 'warning',
    },
    { id: 'contas-receber', label: 'Contas a Receber', icon: FileCheck2, badge: null },
    { id: 'categorias', label: 'Categorias', icon: FolderTree, badge: null },
    { id: 'historico', label: 'Histórico & Extrato', icon: History, badge: null },
    { id: 'relatorios', label: 'Relatórios & DRE', icon: FileSpreadsheet, badge: null },
  ];

  const adminNavItems = [
    { id: 'usuarios', label: 'Equipe & Acessos', icon: Users, badge: null },
    { id: 'configuracoes', label: 'Configurações', icon: Settings, badge: null },
    { id: 'perfil', label: 'Meu Perfil', icon: UserCheck, badge: null },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col border-r border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 transition-all duration-300 z-30 shrink-0 select-none ${
        isCollapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-100 dark:border-slate-800">
        {!isCollapsed ? (
          <div className="flex items-center gap-3 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20">
              <WalletCards className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <h1 className="text-sm font-bold tracking-tight text-slate-900 dark:text-white truncate">
                FluxoPro
              </h1>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                {company.tradingName || 'Gestão Financeira'}
              </p>
            </div>
          </div>
        ) : (
          <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-emerald-500 to-teal-700 text-white shadow-md shadow-emerald-500/20">
            <WalletCards className="h-5 w-5" />
          </div>
        )}

        <button
          type="button"
          onClick={onToggleCollapse}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200 transition-colors"
          title={isCollapsed ? 'Expandir Menu' : 'Recolher Menu'}
        >
          {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6">
        <div>
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Gestão Financeira
            </span>
          )}
          <div className="mt-2 space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-2xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-emerald-600 dark:text-emerald-400' : item.color || 'text-slate-400'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                  {!isCollapsed && item.badge && (
                    <span
                      className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-full ${
                        item.badgeType === 'danger'
                          ? 'bg-rose-500 text-white'
                          : 'bg-amber-500 text-white'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          {!isCollapsed && (
            <span className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Sistema & Acessos
            </span>
          )}
          <div className="mt-2 space-y-1">
            {adminNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => onNavigate(item.id)}
                  title={isCollapsed ? item.label : undefined}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 shadow-2xs font-bold'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/60 dark:hover:text-white'
                  } ${isCollapsed ? 'justify-center' : ''}`}
                >
                  <Icon
                    className={`h-4 w-4 shrink-0 ${
                      isActive ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-400'
                    }`}
                  />
                  {!isCollapsed && <span className="truncate flex-1 text-left">{item.label}</span>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* User Footer Summary */}
      <div className="p-3 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40">
        {!isCollapsed ? (
          <div className="flex items-center justify-between gap-2">
            <div
              onClick={() => onNavigate('perfil')}
              className="flex items-center gap-2.5 min-w-0 cursor-pointer hover:opacity-80 transition-opacity"
            >
              <img
                src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={currentUser.name}
                className="h-8 w-8 rounded-xl object-cover ring-2 ring-emerald-500/30"
              />
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">
                  {currentUser.name.split(' ')[0]}
                </p>
                <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-mono uppercase font-semibold">
                  {currentUser.role}
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg transition-colors"
              title="Sair da Conta"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <img
              src={currentUser.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
              alt={currentUser.name}
              onClick={() => onNavigate('perfil')}
              className="h-8 w-8 rounded-xl object-cover ring-2 ring-emerald-500/30 cursor-pointer"
              title={currentUser.name}
            />
            <button
              type="button"
              onClick={onLogout}
              className="p-1 text-slate-400 hover:text-rose-500"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};
