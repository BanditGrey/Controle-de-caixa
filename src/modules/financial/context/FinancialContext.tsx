import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import {
  Transaction,
  Category,
  AccountPayable,
  AccountReceivable,
  User,
  CompanySettings,
  NotificationItem,
  UserRole,
} from '../types';
import {
  initialCategories,
  initialCompany,
  initialUsers,
  initialTransactions,
  initialAccountsPayable,
  initialAccountsReceivable,
  initialNotifications,
} from '../data/seedData';
import { getTodayString } from '../utils/formatters';

export interface ToastMessage {
  id: string;
  title?: string;
  message: string;
  type: 'success' | 'error' | 'warning' | 'info';
}

interface FinancialContextType {
  // Data
  transactions: Transaction[];
  categories: Category[];
  accountsPayable: AccountPayable[];
  accountsReceivable: AccountReceivable[];
  users: User[];
  currentUser: User;
  company: CompanySettings;
  notifications: NotificationItem[];
  darkMode: boolean;
  toasts: ToastMessage[];

  // Data helpers
  categoriesMap: Map<string, Category>;

  // Calculated KPI metrics
  currentBalance: number;
  totalIncome: number;
  totalExpense: number;
  monthIncome: number;
  monthExpense: number;
  monthNet: number;
  pendingPayablesTotal: number;
  pendingReceivablesTotal: number;
  overduePayablesCount: number;
  overdueReceivablesCount: number;
  todayDueCount: number;

  // Actions - Transactions
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (id: string, tx: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
  duplicateTransaction: (id: string) => void;
  toggleTransactionStatus: (id: string) => void;

  // Actions - Categories
  addCategory: (cat: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, cat: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Actions - Accounts Payable
  addAccountPayable: (bill: Omit<AccountPayable, 'id' | 'createdAt'>) => void;
  updateAccountPayable: (id: string, bill: Partial<AccountPayable>) => void;
  deleteAccountPayable: (id: string) => void;
  settleAccountPayable: (id: string, paymentMethod?: string, amount?: number) => void;

  // Actions - Accounts Receivable
  addAccountReceivable: (bill: Omit<AccountReceivable, 'id' | 'createdAt'>) => void;
  updateAccountReceivable: (id: string, bill: Partial<AccountReceivable>) => void;
  deleteAccountReceivable: (id: string) => void;
  settleAccountReceivable: (id: string, paymentMethod?: string, amount?: number) => void;

  // Actions - Users & Auth
  setCurrentUser: (user: User) => void;
  switchUserRole: (role: UserRole) => void;
  addUser: (user: Omit<User, 'id'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Actions - Settings & System
  updateCompanySettings: (settings: Partial<CompanySettings>) => void;
  toggleDarkMode: () => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  clearNotification: (id: string) => void;
  
  // Toast & Notifications
  showToast: (message: string, type?: 'success' | 'error' | 'warning' | 'info', title?: string) => void;
  removeToast: (id: string) => void;

  // Backup & Restore
  exportDatabaseJSON: () => void;
  importDatabaseJSON: (jsonString: string) => boolean;
  resetDatabaseToDefault: () => void;
}

const FinancialContext = createContext<FinancialContextType | undefined>(undefined);

const STORAGE_KEYS = {
  TRANSACTIONS: 'fluxopro_transactions_v1',
  CATEGORIES: 'fluxopro_categories_v1',
  PAYABLES: 'fluxopro_payables_v1',
  RECEIVABLES: 'fluxopro_receivables_v1',
  USERS: 'fluxopro_users_v1',
  CURRENT_USER: 'fluxopro_current_user_v1',
  COMPANY: 'fluxopro_company_v1',
  NOTIFICATIONS: 'fluxopro_notifications_v1',
  DARK_MODE: 'fluxopro_darkmode_v1',
};

export const FinancialProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize from LocalStorage or seed data
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
    return saved ? JSON.parse(saved) : initialTransactions;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    return saved ? JSON.parse(saved) : initialCategories;
  });

  const [accountsPayable, setAccountsPayable] = useState<AccountPayable[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.PAYABLES);
    return saved ? JSON.parse(saved) : initialAccountsPayable;
  });

  const [accountsReceivable, setAccountsReceivable] = useState<AccountReceivable[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.RECEIVABLES);
    return saved ? JSON.parse(saved) : initialAccountsReceivable;
  });

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.USERS);
    if (saved) {
      const parsed = JSON.parse(saved);
      return parsed.map((u: User) =>
        u.role === 'admin' ? { ...u, name: 'Daniel Silva', email: 'daniel.silva@alfastore.com.br' } : u
      );
    }
    return initialUsers;
  });

  const [currentUser, setCurrentUser] = useState<User>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
    if (saved) {
      const parsed = JSON.parse(saved);
      if (parsed.role === 'admin') {
        return { ...parsed, name: 'Daniel Silva', email: 'daniel.silva@alfastore.com.br' };
      }
      return parsed;
    }
    return initialUsers[0];
  });

  const [company, setCompany] = useState<CompanySettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.COMPANY);
    return saved ? JSON.parse(saved) : initialCompany;
  });

  const [notifications, setNotifications] = useState<NotificationItem[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.NOTIFICATIONS);
    return saved ? JSON.parse(saved) : initialNotifications;
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(STORAGE_KEYS.DARK_MODE);
    if (saved !== null) return JSON.parse(saved);
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Apply dark mode class to HTML root
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem(STORAGE_KEYS.DARK_MODE, JSON.stringify(darkMode));
  }, [darkMode]);

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.PAYABLES, JSON.stringify(accountsPayable));
  }, [accountsPayable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.RECEIVABLES, JSON.stringify(accountsReceivable));
  }, [accountsReceivable]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(currentUser));
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.COMPANY, JSON.stringify(company));
  }, [company]);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEYS.NOTIFICATIONS, JSON.stringify(notifications));
  }, [notifications]);

  // Toast manager
  const showToast = (message: string, type: 'success' | 'error' | 'warning' | 'info' = 'success', title?: string) => {
    const id = 'toast-' + Math.random().toString(36).substring(2, 9);
    setToasts((prev) => [...prev, { id, message, type, title }]);
    setTimeout(() => {
      removeToast(id);
    }, 4000);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  // Categories fast lookup map
  const categoriesMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((cat) => map.set(cat.id, cat));
    return map;
  }, [categories]);

  // Calculations
  const currentBalance = useMemo(() => {
    let balance = company.initialBalance || 0;
    transactions.forEach((tx) => {
      if (tx.status === 'recebido' || tx.status === 'pago') {
        if (tx.type === 'receita') balance += tx.amount;
        else if (tx.type === 'despesa') balance -= tx.amount;
      }
    });
    return balance;
  }, [company.initialBalance, transactions]);

  const { totalIncome, totalExpense, monthIncome, monthExpense, monthNet } = useMemo(() => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();

    let incTotal = 0;
    let expTotal = 0;
    let mInc = 0;
    let mExp = 0;

    transactions.forEach((tx) => {
      if (tx.status === 'recebido' || tx.status === 'pago') {
        if (tx.type === 'receita') incTotal += tx.amount;
        if (tx.type === 'despesa') expTotal += tx.amount;

        const txDate = new Date(tx.date + 'T00:00:00');
        if (txDate.getMonth() === currentMonth && txDate.getFullYear() === currentYear) {
          if (tx.type === 'receita') mInc += tx.amount;
          if (tx.type === 'despesa') mExp += tx.amount;
        }
      }
    });

    return {
      totalIncome: incTotal,
      totalExpense: expTotal,
      monthIncome: mInc,
      monthExpense: mExp,
      monthNet: mInc - mExp,
    };
  }, [transactions]);

  const { pendingPayablesTotal, overduePayablesCount, todayDueCount } = useMemo(() => {
    const todayStr = getTodayString();
    let total = 0;
    let overdue = 0;
    let todayCount = 0;

    accountsPayable.forEach((ap) => {
      if (ap.status === 'pendente' || ap.status === 'vencido' || ap.status === 'parcial') {
        const remaining = ap.amount - (ap.paidAmount || 0);
        total += remaining;
        if (ap.dueDate < todayStr) overdue++;
        if (ap.dueDate === todayStr) todayCount++;
      }
    });

    return {
      pendingPayablesTotal: total,
      overduePayablesCount: overdue,
      todayDueCount: todayCount,
    };
  }, [accountsPayable]);

  const { pendingReceivablesTotal, overdueReceivablesCount } = useMemo(() => {
    const todayStr = getTodayString();
    let total = 0;
    let overdue = 0;

    accountsReceivable.forEach((ar) => {
      if (ar.status === 'pendente' || ar.status === 'vencido' || ar.status === 'parcial') {
        const remaining = ar.amount - (ar.receivedAmount || 0);
        total += remaining;
        if (ar.dueDate < todayStr) overdue++;
      }
    });

    return {
      pendingReceivablesTotal: total,
      overdueReceivablesCount: overdue,
    };
  }, [accountsReceivable]);

  // Transaction CRUD
  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: 'tx-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);
    showToast(
      `${tx.type === 'receita' ? 'Entrada' : 'Saída'} cadastrada com sucesso!`,
      'success',
      'Movimentação Salva'
    );
  };

  const updateTransaction = (id: string, updated: Partial<Transaction>) => {
    setTransactions((prev) =>
      prev.map((t) => (t.id === id ? { ...t, ...updated, updatedAt: new Date().toISOString() } : t))
    );
    showToast('Movimentação atualizada com sucesso!', 'info');
  };

  const deleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    showToast('Movimentação removida do caixa.', 'warning');
  };

  const duplicateTransaction = (id: string) => {
    const target = transactions.find((t) => t.id === id);
    if (!target) return;
    const duplicated: Transaction = {
      ...target,
      id: 'tx-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      description: `${target.description} (Cópia)`,
      date: getTodayString(),
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [duplicated, ...prev]);
    showToast('Movimentação duplicada com sucesso!', 'success');
  };

  const toggleTransactionStatus = (id: string) => {
    setTransactions((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const newStatus = t.status === 'pendente' ? (t.type === 'receita' ? 'recebido' : 'pago') : 'pendente';
          return { ...t, status: newStatus as any };
        }
        return t;
      })
    );
    showToast('Status da movimentação alterado.', 'info');
  };

  // Category CRUD
  const addCategory = (cat: Omit<Category, 'id'>) => {
    const newCat: Category = {
      ...cat,
      id: 'cat-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
    };
    setCategories((prev) => [...prev, newCat]);
    showToast(`Categoria "${cat.name}" criada com sucesso!`, 'success');
  };

  const updateCategory = (id: string, updated: Partial<Category>) => {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
    showToast('Categoria atualizada com sucesso!', 'info');
  };

  const deleteCategory = (id: string) => {
    // Check if category is used
    const inUse = transactions.some((t) => t.categoryId === id);
    if (inUse) {
      showToast('Esta categoria possui movimentações vinculadas e não pode ser excluída.', 'error', 'Atenção');
      return;
    }
    setCategories((prev) => prev.filter((c) => c.id !== id));
    showToast('Categoria excluída.', 'warning');
  };

  // Accounts Payable Actions
  const addAccountPayable = (bill: Omit<AccountPayable, 'id' | 'createdAt'>) => {
    const newBill: AccountPayable = {
      ...bill,
      id: 'ap-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    setAccountsPayable((prev) => [newBill, ...prev]);
    showToast(`Conta a pagar "${bill.description}" adicionada!`, 'success');
  };

  const updateAccountPayable = (id: string, updated: Partial<AccountPayable>) => {
    setAccountsPayable((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    showToast('Conta a pagar atualizada!', 'info');
  };

  const deleteAccountPayable = (id: string) => {
    setAccountsPayable((prev) => prev.filter((b) => b.id !== id));
    showToast('Conta a pagar removida.', 'warning');
  };

  const settleAccountPayable = (id: string, paymentMethod?: string, amount?: number) => {
    const bill = accountsPayable.find((b) => b.id === id);
    if (!bill) return;

    const payAmount = amount || bill.amount;
    const isFull = payAmount >= bill.amount;

    // Update bill
    setAccountsPayable((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            status: isFull ? 'pago' : 'parcial',
            paidAmount: (b.paidAmount || 0) + payAmount,
            paymentDate: getTodayString(),
            paymentMethod: (paymentMethod || b.paymentMethod || 'PIX') as any,
          };
        }
        return b;
      })
    );

    // Register into cash flow transactions
    const newTx: Transaction = {
      id: 'tx-ap-' + Date.now().toString(36),
      type: 'despesa',
      description: `Pagamento: ${bill.description}`,
      amount: payAmount,
      date: getTodayString(),
      categoryId: bill.categoryId,
      paymentMethod: (paymentMethod || bill.paymentMethod || 'PIX') as any,
      entityName: bill.supplier,
      status: 'pago',
      notes: `Quitação da conta a pagar #${bill.id}`,
      referenceId: bill.id,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(`Conta "${bill.description}" baixada com sucesso no caixa!`, 'success', 'Pagamento Efetuado');
  };

  // Accounts Receivable Actions
  const addAccountReceivable = (bill: Omit<AccountReceivable, 'id' | 'createdAt'>) => {
    const newBill: AccountReceivable = {
      ...bill,
      id: 'ar-' + Date.now().toString(36) + Math.random().toString(36).substring(2, 5),
      createdAt: new Date().toISOString(),
    };
    setAccountsReceivable((prev) => [newBill, ...prev]);
    showToast(`Conta a receber "${bill.description}" adicionada!`, 'success');
  };

  const updateAccountReceivable = (id: string, updated: Partial<AccountReceivable>) => {
    setAccountsReceivable((prev) => prev.map((b) => (b.id === id ? { ...b, ...updated } : b)));
    showToast('Conta a receber atualizada!', 'info');
  };

  const deleteAccountReceivable = (id: string) => {
    setAccountsReceivable((prev) => prev.filter((b) => b.id !== id));
    showToast('Conta a receber removida.', 'warning');
  };

  const settleAccountReceivable = (id: string, paymentMethod?: string, amount?: number) => {
    const bill = accountsReceivable.find((b) => b.id === id);
    if (!bill) return;

    const recAmount = amount || bill.amount;
    const isFull = recAmount >= bill.amount;

    // Update receivable
    setAccountsReceivable((prev) =>
      prev.map((b) => {
        if (b.id === id) {
          return {
            ...b,
            status: isFull ? 'recebido' : 'parcial',
            receivedAmount: (b.receivedAmount || 0) + recAmount,
            receivedDate: getTodayString(),
            paymentMethod: (paymentMethod || b.paymentMethod || 'PIX') as any,
          };
        }
        return b;
      })
    );

    // Register into cash flow transactions
    const newTx: Transaction = {
      id: 'tx-ar-' + Date.now().toString(36),
      type: 'receita',
      description: `Recebimento: ${bill.description}`,
      amount: recAmount,
      date: getTodayString(),
      categoryId: bill.categoryId,
      paymentMethod: (paymentMethod || bill.paymentMethod || 'PIX') as any,
      entityName: bill.client,
      status: 'recebido',
      notes: `Recebimento da conta a receber #${bill.id}`,
      referenceId: bill.id,
      createdAt: new Date().toISOString(),
    };
    setTransactions((prev) => [newTx, ...prev]);

    showToast(`Recebimento de "${bill.description}" lançado no caixa!`, 'success', 'Recebimento Concluído');
  };

  // User Management
  const switchUserRole = (role: UserRole) => {
    const found = users.find((u) => u.role === role);
    if (found) {
      setCurrentUser(found);
      showToast(`Você agora está visualizando como: ${found.name} (${role.toUpperCase()})`, 'info', 'Perfil Alternado');
    } else {
      const updatedUser = { ...currentUser, role };
      setCurrentUser(updatedUser);
      showToast(`Perfil alternado para nível: ${role.toUpperCase()}`, 'info');
    }
  };

  const addUser = (user: Omit<User, 'id'>) => {
    const newUser: User = {
      ...user,
      id: 'usr-' + Date.now().toString(36),
    };
    setUsers((prev) => [...prev, newUser]);
    showToast(`Usuário "${user.name}" adicionado à equipe!`, 'success');
  };

  const updateUser = (id: string, updated: Partial<User>) => {
    setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, ...updated } : u)));
    if (currentUser.id === id) {
      setCurrentUser((prev) => ({ ...prev, ...updated }));
    }
    showToast('Usuário atualizado com sucesso!', 'info');
  };

  const deleteUser = (id: string) => {
    if (users.length <= 1) {
      showToast('O sistema precisa de pelo menos 1 usuário cadastrado.', 'error');
      return;
    }
    if (currentUser.id === id) {
      showToast('Você não pode excluir o usuário conectado atualmente.', 'error');
      return;
    }
    setUsers((prev) => prev.filter((u) => u.id !== id));
    showToast('Usuário removido da equipe.', 'warning');
  };

  // Settings
  const updateCompanySettings = (updated: Partial<CompanySettings>) => {
    setCompany((prev) => ({ ...prev, ...updated }));
    showToast('Configurações salvas com sucesso!', 'success');
  };

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  // Notifications
  const markNotificationRead = (id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const markAllNotificationsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    showToast('Todas as notificações foram marcadas como lidas.', 'info');
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Backup & Restore
  const exportDatabaseJSON = () => {
    const backupData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      company,
      categories,
      transactions,
      accountsPayable,
      accountsReceivable,
      users,
      notifications,
    };
    const jsonStr = JSON.stringify(backupData, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `backup-fluxopro-${getTodayString()}.json`;
    link.click();
    showToast('Backup completo exportado com sucesso!', 'success', 'Backup Realizado');
  };

  const importDatabaseJSON = (jsonString: string): boolean => {
    try {
      const data = JSON.parse(jsonString);
      if (!data.transactions || !data.categories) {
        showToast('Formato de arquivo inválido. Certifique-se de que é um backup do FluxoPro.', 'error', 'Erro no Backup');
        return false;
      }
      if (data.transactions) setTransactions(data.transactions);
      if (data.categories) setCategories(data.categories);
      if (data.accountsPayable) setAccountsPayable(data.accountsPayable);
      if (data.accountsReceivable) setAccountsReceivable(data.accountsReceivable);
      if (data.company) setCompany(data.company);
      if (data.users) setUsers(data.users);
      if (data.notifications) setNotifications(data.notifications);

      showToast('Dados restaurados com sucesso a partir do backup!', 'success', 'Restauração Completa');
      return true;
    } catch (e) {
      showToast('Erro ao ler arquivo JSON de backup.', 'error');
      return false;
    }
  };

  const resetDatabaseToDefault = () => {
    setTransactions(initialTransactions);
    setCategories(initialCategories);
    setAccountsPayable(initialAccountsPayable);
    setAccountsReceivable(initialAccountsReceivable);
    setCompany(initialCompany);
    setUsers(initialUsers);
    setCurrentUser(initialUsers[0]);
    setNotifications(initialNotifications);
    showToast('Banco de dados restaurado para os dados originais de demonstração!', 'warning', 'Reset de Fábrica');
  };

  return (
    <FinancialContext.Provider
      value={{
        transactions,
        categories,
        accountsPayable,
        accountsReceivable,
        users,
        currentUser,
        company,
        notifications,
        darkMode,
        toasts,
        categoriesMap,
        currentBalance,
        totalIncome,
        totalExpense,
        monthIncome,
        monthExpense,
        monthNet,
        pendingPayablesTotal,
        pendingReceivablesTotal,
        overduePayablesCount,
        overdueReceivablesCount,
        todayDueCount,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        duplicateTransaction,
        toggleTransactionStatus,
        addCategory,
        updateCategory,
        deleteCategory,
        addAccountPayable,
        updateAccountPayable,
        deleteAccountPayable,
        settleAccountPayable,
        addAccountReceivable,
        updateAccountReceivable,
        deleteAccountReceivable,
        settleAccountReceivable,
        setCurrentUser,
        switchUserRole,
        addUser,
        updateUser,
        deleteUser,
        updateCompanySettings,
        toggleDarkMode,
        markNotificationRead,
        markAllNotificationsRead,
        clearNotification,
        showToast,
        removeToast,
        exportDatabaseJSON,
        importDatabaseJSON,
        resetDatabaseToDefault,
      }}
    >
      {children}
    </FinancialContext.Provider>
  );
};

export const useFinancial = () => {
  const context = useContext(FinancialContext);
  if (!context) {
    throw new Error('useFinancial must be used within a FinancialProvider');
  }
  return context;
};
