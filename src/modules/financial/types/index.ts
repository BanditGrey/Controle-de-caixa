export type TransactionType = 'receita' | 'despesa';

export type PaymentMethod = 
  | 'PIX'
  | 'Cartão de Crédito'
  | 'Cartão de Débito'
  | 'Boleto'
  | 'Dinheiro'
  | 'Transferência TED';

export type TransactionStatus = 'recebido' | 'pago' | 'pendente';

export type AccountStatus = 'pendente' | 'pago' | 'recebido' | 'vencido' | 'parcial';

export type RecurrenceType = 'única' | 'mensal' | 'anual' | 'semanal';

export type UserRole = 'admin' | 'financeiro' | 'visualizador';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  color: string;
  icon: string;
  budgetLimit?: number; // Limite mensal orçado
  description?: string;
}

export interface Attachment {
  name: string;
  size: string;
  type: string;
  url?: string;
  date: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  description: string;
  amount: number;
  date: string; // YYYY-MM-DD
  categoryId: string;
  paymentMethod: PaymentMethod;
  entityName: string; // Cliente para receita, Fornecedor para despesa
  status: 'recebido' | 'pago' | 'pendente';
  notes?: string;
  attachment?: Attachment;
  recurrence?: RecurrenceType;
  referenceId?: string; // Link to account payable/receivable
  createdAt: string;
  updatedAt?: string;
}

export interface AccountPayable {
  id: string;
  description: string;
  supplier: string;
  categoryId: string;
  amount: number;
  paidAmount?: number;
  dueDate: string; // YYYY-MM-DD
  paymentDate?: string;
  status: 'pendente' | 'pago' | 'vencido' | 'parcial';
  paymentMethod?: PaymentMethod;
  recurrence: RecurrenceType;
  notes?: string;
  barcode?: string;
  alertDays: number;
  attachment?: Attachment;
  createdAt: string;
}

export interface AccountReceivable {
  id: string;
  description: string;
  client: string;
  categoryId: string;
  amount: number;
  receivedAmount?: number;
  dueDate: string; // YYYY-MM-DD
  receivedDate?: string;
  status: 'pendente' | 'recebido' | 'vencido' | 'parcial';
  paymentMethod?: PaymentMethod;
  recurrence: RecurrenceType;
  notes?: string;
  attachment?: Attachment;
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  department?: string;
  lastLogin?: string;
  active: boolean;
}

export interface CompanySettings {
  companyName: string;
  tradingName: string; // Nome fantasia
  cnpj: string;
  email: string;
  phone: string;
  address: string;
  currency: string; // 'BRL'
  currencySymbol: string; // 'R$'
  initialBalance: number;
  lowBalanceThreshold: number;
  dueAlertDays: number;
  darkMode: boolean;
  enableSound: boolean;
  enableAlerts: boolean;
  monthlyRevenueGoal: number;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'danger' | 'warning' | 'info' | 'success';
  date: string;
  read: boolean;
  linkTo?: string;
}

export type PeriodFilter = 
  | 'hoje'
  | '7dias'
  | '30dias'
  | 'este_mes'
  | 'mes_anterior'
  | 'este_ano'
  | 'ano_anterior'
  | 'personalizado';
