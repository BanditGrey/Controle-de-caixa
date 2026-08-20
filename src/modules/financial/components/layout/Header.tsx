import React, { useState, useRef, useEffect } from 'react';
import {
  Bell,
  Sun,
  Moon,
  Plus,
  Menu,
  Shield,
  ShieldCheck,
  Eye,
  Check,
  CheckCheck,
  ChevronDown,
} from 'lucide-react';
import { useFinancial } from '../../context/FinancialContext';
import { UserRole } from '../../types';
import { formatCurrency } from '../../utils/formatters';

interface HeaderProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenMobileMenu: () => void;
  onOpenQuickAction: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onOpenMobileMenu,
  onOpenQuickAction,
}) => {
  const {
    company,
    currentUser,
    switchUserRole,
    darkMode,
    toggleDarkMode,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    currentBalance,
  } = useFinancial();

  const [showNotifications, setShowNotifications] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const roleRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const pageTitles: Record<string, { title: string; subtitle: string }> = {
    dashboard: { title: 'Painel Financeiro', subtitle: 'Visão geral do caixa e indicadores chave' },
    entradas: { title: 'Controle de Entradas', subtitle: 'Receitas, vendas, serviços e recebimentos' },
    saidas: { title: 'Controle de Saídas', subtitle: 'Despesas operacionais, fornecedores e custos' },
    'fluxo-caixa': { title: 'Fluxo de Caixa', subtitle: 'Demonstrativo e extrato consolidado' },
    'contas-pagar': { title: 'Contas a Pagar', subtitle: 'Gestão de boletos, compromissos e vencimentos' },
    'contas-receber': { title: 'Contas a Receber', subtitle: 'Cobranças, faturas e contratos a receber' },
    categorias: { title: 'Categorias Financeiras', subtitle: 'Centros de custo e limites orçamentários' },
    historico: { title: 'Histórico & Extrato', subtitle: 'Consulta avançada e pesquisa de transações' },
    relatorios: { title: 'Relatórios & DRE', subtitle: 'Análise de desempenho e exportação de dados' },
    usuarios: { title: 'Controle de Equipe', subtitle: 'Gestão de permissões e colaboradores' },
    configuracoes: { title: 'Configurações do Sistema', subtitle: 'Dados da empresa, regras e backups' },
    perfil: { title: 'Perfil do Usuário', subtitle: 'Minha conta e preferências' },
  };

  const pageInfo = pageTitles[currentPage] || {
    title: 'Controle de Caixa',
    subtitle: 'Gestão Financeira Inteligente',
  };

  // Close popovers on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setShowNotifications(false);
      }
      if (roleRef.current && !roleRef.current.contains(e.target as Node)) {
        setShowRoleMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/95 px-3 sm:px-6 backdrop-blur-md dark:border-slate-800 dark:bg-slate-900/95">
      {/* Left: Mobile Menu & Page title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="rounded-xl p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 md:hidden shrink-0"
          aria-label="Abrir Menu Lateral"
        >
          <Menu className="h-5 w-5" />
        </button>

        <div className="min-w-0">
          <h2 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
            {pageInfo.title}
          </h2>
          <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 leading-none truncate">
            {pageInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
        {/* Balance Badge Pill (Desktop) */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-200/80 bg-emerald-50/70 text-emerald-800 dark:border-emerald-800/60 dark:bg-emerald-950/40 dark:text-emerald-300">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-medium">Saldo Atual:</span>
          <span className="text-xs font-bold font-mono">
            {formatCurrency(currentBalance, company.currencySymbol)}
          </span>
        </div>

        {/* Role Quick Selector */}
        <div className="relative" ref={roleRef}>
          <button
            type="button"
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            className="flex items-center gap-1 sm:gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-2 sm:px-2.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800/80 dark:text-slate-200 dark:hover:bg-slate-800 transition-colors"
            title="Alternar Perfil"
          >
            {currentUser.role === 'admin' && <ShieldCheck className="h-3.5 w-3.5 text-purple-600 dark:text-purple-400" />}
            {currentUser.role === 'financeiro' && <Shield className="h-3.5 w-3.5 text-cyan-600 dark:text-cyan-400" />}
            {currentUser.role === 'visualizador' && <Eye className="h-3.5 w-3.5 text-slate-500" />}
            <span className="hidden sm:inline capitalize font-mono text-[11px]">
              {currentUser.name.split(' ')[0]}
            </span>
            <ChevronDown className="h-3 w-3 text-slate-400" />
          </button>

          {showRoleMenu && (
            <div className="absolute right-0 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95">
              <div className="px-2 py-1.5 border-b border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Nível de Acesso
                </span>
              </div>
              <div className="mt-1 space-y-1">
                {(['admin', 'financeiro', 'visualizador'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => {
                      switchUserRole(r);
                      setShowRoleMenu(false);
                    }}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-medium transition-colors ${
                      currentUser.role === r
                        ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {r === 'admin' && <ShieldCheck className="h-4 w-4 text-purple-500" />}
                      {r === 'financeiro' && <Shield className="h-4 w-4 text-cyan-500" />}
                      {r === 'visualizador' && <Eye className="h-4 w-4 text-slate-400" />}
                      <span className="capitalize">{r}</span>
                    </div>
                    {currentUser.role === r && <Check className="h-3.5 w-3.5 text-emerald-600" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Notifications Bell */}
        <div className="relative" ref={notifRef}>
          <button
            type="button"
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            title="Notificações"
          >
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-rose-500 px-1 text-[10px] font-bold text-white shadow-xs">
                {unreadCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="fixed sm:absolute inset-x-4 top-16 sm:inset-x-auto sm:right-0 sm:top-auto sm:mt-2 w-auto sm:w-96 rounded-2xl border border-slate-200 bg-white p-3.5 shadow-2xl dark:border-slate-800 dark:bg-slate-900 z-50 animate-in fade-in zoom-in-95 max-h-[80vh] flex flex-col">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <div className="flex items-center gap-2">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                    Notificações & Alertas
                  </h4>
                  {unreadCount > 0 && (
                    <span className="rounded-full bg-rose-100 px-1.5 py-0.2 text-[10px] font-bold text-rose-600 dark:bg-rose-950 dark:text-rose-400">
                      {unreadCount} novas
                    </span>
                  )}
                </div>
                {unreadCount > 0 && (
                  <button
                    type="button"
                    onClick={markAllNotificationsRead}
                    className="text-[11px] font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center gap-1"
                  >
                    <CheckCheck className="h-3 w-3" />
                    Ler todas
                  </button>
                )}
              </div>

              <div className="mt-2 overflow-y-auto space-y-2 pr-1 flex-1">
                {notifications.length === 0 ? (
                  <p className="text-center py-6 text-xs text-slate-400">
                    Nenhuma notificação no momento.
                  </p>
                ) : (
                  notifications.map((notif) => {
                    const isDanger = notif.type === 'danger';
                    const isWarning = notif.type === 'warning';
                    return (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.linkTo) {
                            onNavigate(notif.linkTo);
                            setShowNotifications(false);
                          }
                        }}
                        className={`cursor-pointer rounded-xl p-2.5 text-xs transition-colors border ${
                          notif.read
                            ? 'border-transparent bg-slate-50/50 dark:bg-slate-800/30 opacity-70'
                            : isDanger
                            ? 'border-rose-200 bg-rose-50/60 dark:border-rose-900/40 dark:bg-rose-950/30'
                            : isWarning
                            ? 'border-amber-200 bg-amber-50/60 dark:border-amber-900/40 dark:bg-amber-950/30'
                            : 'border-blue-200 bg-blue-50/60 dark:border-blue-900/40 dark:bg-blue-950/30'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <h5 className="font-bold text-slate-800 dark:text-slate-200">
                            {notif.title}
                          </h5>
                          <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                            {notif.date}
                          </span>
                        </div>
                        <p className="mt-1 text-slate-600 dark:text-slate-300 leading-snug">
                          {notif.message}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          )}
        </div>

        {/* Dark Mode Toggle */}
        <button
          type="button"
          onClick={toggleDarkMode}
          className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
          title={darkMode ? 'Modo Claro' : 'Modo Escuro'}
        >
          {darkMode ? <Sun className="h-4 w-4 text-amber-400" /> : <Moon className="h-4 w-4" />}
        </button>

        {/* Action Button */}
        <button
          type="button"
          onClick={onOpenQuickAction}
          className="flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3 sm:px-3.5 py-2 text-xs font-bold text-white shadow-xs hover:bg-emerald-700 active:bg-emerald-800 transition-all hover:shadow-md shrink-0"
        >
          <Plus className="h-4 w-4" />
          <span className="hidden sm:inline">Nova Operação</span>
        </button>
      </div>
    </header>
  );
};
