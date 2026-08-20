import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';
import { Transaction, Category, CompanySettings } from '../types';

/**
 * Format currency to Brazilian Real (R$) or custom symbol
 */
export const formatCurrency = (value: number, symbol: string = 'R$'): string => {
  if (isNaN(value)) return `${symbol} 0,00`;
  const formatted = new Intl.NumberFormat('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
  return `${symbol} ${formatted}`;
};

/**
 * Format date from YYYY-MM-DD to DD/MM/YYYY
 */
export const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const parts = dateStr.split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateStr;
};

/**
 * Get current date string YYYY-MM-DD
 */
export const getTodayString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Calculate difference in days between target date and today
 */
export const getDaysDiff = (targetDateStr: string): number => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(targetDateStr + 'T00:00:00');
  const diffTime = target.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};

/**
 * Parse currency input string to number (e.g. "1.250,50" or "1250.5" -> 1250.50)
 */
export const parseCurrencyInput = (val: string | number): number => {
  if (typeof val === 'number') return val;
  if (!val) return 0;
  const clean = val.replace(/[^\d,-]/g, '').replace(',', '.');
  const num = parseFloat(clean);
  return isNaN(num) ? 0 : num;
};

/**
 * Export transactions to CSV
 */
export const exportToCSV = (
  transactions: Transaction[],
  categoriesMap: Map<string, Category>,
  filename: string = 'controle-de-caixa-extrato.csv'
) => {
  const headers = ['Data', 'Tipo', 'Descrição', 'Categoria', 'Entidade (Cliente/Fornecedor)', 'Forma de Pagamento', 'Status', 'Valor (R$)'];
  const rows = transactions.map((t) => {
    const cat = categoriesMap.get(t.categoryId)?.name || 'Sem Categoria';
    return [
      formatDate(t.date),
      t.type === 'receita' ? 'Entrada (Receita)' : 'Saída (Despesa)',
      `"${t.description.replace(/"/g, '""')}"`,
      `"${cat}"`,
      `"${(t.entityName || '').replace(/"/g, '""')}"`,
      t.paymentMethod,
      t.status.toUpperCase(),
      t.amount.toFixed(2).replace('.', ','),
    ];
  });

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/**
 * Export transactions to Excel (.xlsx)
 */
export const exportToExcel = (
  transactions: Transaction[],
  categoriesMap: Map<string, Category>,
  company: CompanySettings,
  filename: string = 'controle-de-caixa.xlsx'
) => {
  const data = transactions.map((t) => {
    const cat = categoriesMap.get(t.categoryId)?.name || 'Sem Categoria';
    return {
      'Data': formatDate(t.date),
      'Tipo': t.type === 'receita' ? 'Entrada' : 'Saída',
      'Descrição': t.description,
      'Categoria': cat,
      'Cliente / Fornecedor': t.entityName || '-',
      'Forma de Pagamento': t.paymentMethod,
      'Status': t.status.toUpperCase(),
      'Valor (R$)': t.amount,
      'Observações': t.notes || '',
    };
  });

  const wb = XLSX.utils.book_new();
  const ws = XLSX.utils.json_to_sheet(data);

  // Add column widths
  ws['!cols'] = [
    { wch: 12 }, // Data
    { wch: 10 }, // Tipo
    { wch: 30 }, // Descrição
    { wch: 20 }, // Categoria
    { wch: 25 }, // Cliente / Fornecedor
    { wch: 18 }, // Forma de Pagamento
    { wch: 12 }, // Status
    { wch: 15 }, // Valor
    { wch: 30 }, // Observações
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'Movimentações');
  XLSX.writeFile(wb, filename);
};

/**
 * Generate and download formatted PDF report
 */
export const exportToPDF = (
  transactions: Transaction[],
  categoriesMap: Map<string, Category>,
  company: CompanySettings,
  title: string = 'Relatório Financeiro de Caixa',
  periodDescription: string = 'Período Completo'
) => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  // Calculate totals
  let totalEntradas = 0;
  let totalSaidas = 0;
  transactions.forEach((t) => {
    if (t.status === 'recebido' || t.status === 'pago') {
      if (t.type === 'receita') totalEntradas += t.amount;
      else totalSaidas += t.amount;
    }
  });
  const saldoFinal = totalEntradas - totalSaidas;

  // Header styling
  doc.setFillColor(15, 23, 42); // slate-900
  doc.rect(0, 0, 210, 32, 'F');

  // Title & Company
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(company.tradingName || company.companyName || 'FluxoPro Gestão Financeira', 14, 14);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(203, 213, 225); // slate-300
  doc.text(`CNPJ: ${company.cnpj || '00.000.000/0001-00'} | Emissão: ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}`, 14, 22);

  // Subheader title
  doc.setFontSize(13);
  doc.setTextColor(30, 41, 59); // slate-800
  doc.setFont('helvetica', 'bold');
  doc.text(title, 14, 42);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 116, 139);
  doc.text(`Filtro aplicado: ${periodDescription} • Total de registros: ${transactions.length}`, 14, 48);

  // Summary KPI Boxes
  const boxY = 53;
  const boxHeight = 16;

  // Box 1: Entradas
  doc.setFillColor(240, 253, 244); // green-50
  doc.setDrawColor(187, 247, 208); // green-200
  doc.roundedRect(14, boxY, 56, boxHeight, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setTextColor(22, 101, 52); // green-800
  doc.text('TOTAL ENTRADAS', 18, boxY + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(totalEntradas, company.currencySymbol), 18, boxY + 13);

  // Box 2: Saídas
  doc.setFillColor(254, 242, 242); // red-50
  doc.setDrawColor(254, 202, 202); // red-200
  doc.roundedRect(77, boxY, 56, boxHeight, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(153, 27, 27); // red-800
  doc.text('TOTAL SAÍDAS', 81, boxY + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(totalSaidas, company.currencySymbol), 81, boxY + 13);

  // Box 3: Saldo
  if (saldoFinal >= 0) {
    doc.setFillColor(240, 249, 255);
    doc.setDrawColor(186, 230, 253);
  } else {
    doc.setFillColor(254, 242, 242);
    doc.setDrawColor(254, 202, 202);
  }
  doc.roundedRect(140, boxY, 56, boxHeight, 2, 2, 'FD');
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  if (saldoFinal >= 0) {
    doc.setTextColor(7, 89, 133);
  } else {
    doc.setTextColor(153, 27, 27);
  }
  doc.text('RESULTADO LÍQUIDO', 144, boxY + 6);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(formatCurrency(saldoFinal, company.currencySymbol), 144, boxY + 13);

  // Table
  const tableData = transactions.slice(0, 300).map((t) => {
    const cat = categoriesMap.get(t.categoryId)?.name || 'Geral';
    return [
      formatDate(t.date),
      t.type === 'receita' ? 'Entrada' : 'Saída',
      t.description.length > 25 ? t.description.slice(0, 23) + '...' : t.description,
      cat.length > 18 ? cat.slice(0, 16) + '...' : cat,
      t.entityName ? (t.entityName.length > 16 ? t.entityName.slice(0, 14) + '...' : t.entityName) : '-',
      t.paymentMethod,
      t.status.toUpperCase(),
      (t.type === 'receita' ? '+ ' : '- ') + formatCurrency(t.amount, company.currencySymbol),
    ];
  });

  autoTable(doc, {
    startY: 74,
    head: [['Data', 'Tipo', 'Descrição', 'Categoria', 'Contato', 'Pagamento', 'Status', 'Valor']],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 41, 59],
      textColor: [255, 255, 255],
      fontSize: 8,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      fontSize: 7.5,
      textColor: [51, 65, 85],
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    columnStyles: {
      0: { cellWidth: 18 },
      1: { cellWidth: 15 },
      2: { cellWidth: 38 },
      3: { cellWidth: 26 },
      4: { cellWidth: 26 },
      5: { cellWidth: 22 },
      6: { cellWidth: 18 },
      7: { cellWidth: 23, halign: 'right', fontStyle: 'bold' },
    },
    margin: { left: 14, right: 14, bottom: 18 },
    didDrawPage: (data: any) => {
      // Footer page number
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text(
        `Página ${data.pageNumber} de ${doc.getNumberOfPages()} • Gerado automaticamente por FluxoPro`,
        14,
        290
      );
    },
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${getTodayString()}.pdf`);
};
