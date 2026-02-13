import { Injectable } from '@angular/core';
import { Card } from '../../models/cards/card.model/card.model-module';

export interface Transaction {
  id: string;
  type: 'entrada' | 'saida';
  value: number;
  date: string; // ISO
  cardId?: string;
  createdAt: string;
}

export interface Invoice {
  id: string; // ex: 2026-01
  month: number;
  year: number;
  total: number;
  startDate: Date;
  endDate: Date;
}

@Injectable({
  providedIn: 'root',
})
export class CardCalculatorService {
  getCurrentInvoicePeriod(card: Card, today = new Date()) {
  const year = today.getFullYear();
  const month = today.getMonth();

  let start: Date;
  let end: Date;

  if (today.getDate() > card.closingDay) {
    start = new Date(year, month, card.closingDay + 1);
    end = new Date(year, month + 1, card.closingDay);
  } else {
    start = new Date(year, month - 1, card.closingDay + 1);
    end = new Date(year, month, card.closingDay);
  }

  return { start, end };
}

calculateUsedLimit(
  card: Card,
  transactions: Transaction[],
  today = new Date()
): number {
  const { start, end } = this.getCurrentInvoicePeriod(card, today);

  return transactions
    .filter(t =>
      t.type === 'saida' &&
      t.cardId === card.id &&
      new Date(t.date) >= start &&
      new Date(t.date) <= end
    )
    .reduce((sum, t) => sum + t.value, 0);
}

calculateAvailableLimit(
  card: Card,
  usedLimit: number
): number {
  return Math.max(card.limitTotal - usedLimit, 0);
}

calculateUsagePercent(
  card: Card,
  usedLimit: number
): number {
  if (card.limitTotal === 0) return 0;
  return Math.min((usedLimit / card.limitTotal) * 100, 100);
}

generateInvoices(
  card: Card,
  transactions: Transaction[]
): Invoice[] {
  const cardTransactions = transactions
    .filter(t => t.type === 'saida' && t.cardId === card.id)
    .map(t => ({ ...t, dateObj: new Date(t.date) }))
    .sort((a, b) => a.dateObj.getTime() - b.dateObj.getTime());

  const invoicesMap = new Map<string, Invoice>();

  for (const tx of cardTransactions) {
    const invoiceDate =
      tx.dateObj.getDate() > card.closingDay
        ? new Date(tx.dateObj.getFullYear(), tx.dateObj.getMonth() + 1, 1)
        : new Date(tx.dateObj.getFullYear(), tx.dateObj.getMonth(), 1);

    const month = invoiceDate.getMonth();
    const year = invoiceDate.getFullYear();
    const id = `${year}-${month + 1}`;

    if (!invoicesMap.has(id)) {
      const start =
        tx.dateObj.getDate() > card.closingDay
          ? new Date(year, month - 1, card.closingDay + 1)
          : new Date(year, month - 2, card.closingDay + 1);

      const end = new Date(year, month - 1, card.closingDay);

      invoicesMap.set(id, {
        id,
        month: month + 1,
        year,
        total: 0,
        startDate: start,
        endDate: end,
      });
    }

    invoicesMap.get(id)!.total += tx.value;
  }

  return Array.from(invoicesMap.values()).reverse();
}


}
