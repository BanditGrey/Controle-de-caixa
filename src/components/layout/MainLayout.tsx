import React, { useState, useEffect } from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { MobileNav } from './MobileNav';
import { ToastContainer } from '../common/ToastContainer';
import { QuickActionModal } from '../modals/QuickActionModal';
import { TransactionModal } from '../modals/TransactionModal';
import { BillPayableModal } from '../modals/BillPayableModal';
import { BillReceivableModal } from '../modals/BillReceivableModal';
import { CategoryModal } from '../modals/CategoryModal';
import { SettleModal } from '../modals/SettleModal';

// Pages
import { Dashboard } from '../../pages/Dashboard';
import { Entradas } from '../../pages/Entradas';
import { Saidas } from '../../pages/Saidas';
import { FluxoCaixa } from '../../pages/FluxoCaixa';
import { ContasPagar } from '../../pages/ContasPagar';
import { ContasReceber } from '../../pages/ContasReceber';
import { Categorias } from '../../pages/Categorias';
import { Historico } from '../../pages/Historico';
import { Relatorios } from '../../pages/Relatorios';
import { Configuracoes } from '../../pages/Configuracoes';
import { Usuarios } from '../../pages/Usuarios';
import { Perfil } from '../../pages/Perfil';
import { AccountPayable, TransactionType } from '../../types';

interface MainLayoutProps {
  onLogout: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ onLogout }) => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Global modals triggered from shortcuts or quick action bar
  const [isQuickActionOpen, setIsQuickActionOpen] = useState(false);
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [txModalType, setTxModalType] = useState<TransactionType>('receita');
  const [isPayableModalOpen, setIsPayableModalOpen] = useState(false);
  const [isReceivableModalOpen, setIsReceivableModalOpen] = useState(false);
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [settlePayableBill, setSettlePayableBill] = useState<AccountPayable | null>(null);

  // Keyboard shortcuts (Ctrl+N for new, Ctrl+K for search)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setIsQuickActionOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleOpenNewIncome = () => {
    setTxModalType('receita');
    setIsTxModalOpen(true);
  };

  const handleOpenNewExpense = () => {
    setTxModalType('despesa');
    setIsTxModalOpen(true);
  };

  return (
    <div className="flex h-screen w-full overflow-hidden bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100 antialiased font-sans">
      {/* Desktop Sidebar */}
      <Sidebar
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
        onLogout={onLogout}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header Top Bar */}
        <Header
          currentPage={currentPage}
          onNavigate={setCurrentPage}
          onOpenMobileMenu={() => setIsMobileMenuOpen(true)}
          onOpenQuickAction={() => setIsQuickActionOpen(true)}
        />

        {/* Scrollable Page View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 pb-20 md:pb-8">
          <div className="mx-auto max-w-7xl">
            {currentPage === 'dashboard' && (
              <Dashboard
                onNavigate={setCurrentPage}
                onOpenNewIncome={handleOpenNewIncome}
                onOpenNewExpense={handleOpenNewExpense}
                onOpenPayBill={(bill) => setSettlePayableBill(bill)}
              />
            )}
            {currentPage === 'entradas' && <Entradas />}
            {currentPage === 'saidas' && <Saidas />}
            {currentPage === 'fluxo-caixa' && <FluxoCaixa />}
            {currentPage === 'contas-pagar' && <ContasPagar />}
            {currentPage === 'contas-receber' && <ContasReceber />}
            {currentPage === 'categorias' && <Categorias />}
            {currentPage === 'historico' && <Historico />}
            {currentPage === 'relatorios' && <Relatorios />}
            {currentPage === 'configuracoes' && <Configuracoes />}
            {currentPage === 'usuarios' && <Usuarios />}
            {currentPage === 'perfil' && <Perfil />}
          </div>
        </main>
      </div>

      {/* Mobile Drawer & Bottom Navigation */}
      <MobileNav
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        onOpenQuickAction={() => setIsQuickActionOpen(true)}
      />

      {/* Speed Dial Quick Actions Modal */}
      <QuickActionModal
        isOpen={isQuickActionOpen}
        onClose={() => setIsQuickActionOpen(false)}
        onNewIncome={handleOpenNewIncome}
        onNewExpense={handleOpenNewExpense}
        onNewPayable={() => setIsPayableModalOpen(true)}
        onNewReceivable={() => setIsReceivableModalOpen(true)}
        onNewCategory={() => setIsCategoryModalOpen(true)}
        onGoToReports={() => setCurrentPage('relatorios')}
      />

      {/* Transaction Modal (Global Trigger) */}
      <TransactionModal
        isOpen={isTxModalOpen}
        onClose={() => setIsTxModalOpen(false)}
        initialType={txModalType}
      />

      {/* Bill Payable Modal (Global Trigger) */}
      <BillPayableModal
        isOpen={isPayableModalOpen}
        onClose={() => setIsPayableModalOpen(false)}
      />

      {/* Bill Receivable Modal (Global Trigger) */}
      <BillReceivableModal
        isOpen={isReceivableModalOpen}
        onClose={() => setIsReceivableModalOpen(false)}
      />

      {/* Category Modal (Global Trigger) */}
      <CategoryModal
        isOpen={isCategoryModalOpen}
        onClose={() => setIsCategoryModalOpen(false)}
      />

      {/* Settle Payable Bill Modal (Dashboard Shortcut) */}
      {settlePayableBill && (
        <SettleModal
          isOpen={!!settlePayableBill}
          onClose={() => setSettlePayableBill(null)}
          bill={settlePayableBill}
          type="pagar"
        />
      )}

      {/* Toast Notifications */}
      <ToastContainer />
    </div>
  );
};
