import { Injectable } from '@angular/core';
import { Db } from '../db/db';
import { Transaction, TransactionType } from '../models/trasaction/trasaction-module';

function uuid(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

@Injectable({
  providedIn: 'root',
})
export class TransactionService {
  constructor(private db: Db) {}

  // ==============================
  // LISTAGEM DE TRANSAÇÕES
  // ==============================
  async listAll(): Promise<Transaction[]> {
    const items = await this.db.getAll<Transaction>('transactions');
    return items.slice().sort((a, b) => b.date.localeCompare(a.date));
  }

  // ==============================
  // BALANCE GERAL
  // ==============================
  async getBalance(): Promise<number> {
    const transactions = await this.listAll();
    return transactions.reduce((total, tx) => tx.type === 'ENTRADA' ? total + tx.amount : total - tx.amount, 0);
  }

  async getBalanceForMonth(year: number, month: number): Promise<number> {
    const allTx = await this.listAll();

    // Saldo do mês anterior
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;

    const previousTx = allTx.filter(tx => {
      const d = new Date(tx.date);
      return d.getFullYear() === previousYear && d.getMonth() + 1 === previousMonth;
    });

    const initialBalance = previousTx.reduce((total, tx) => tx.type === 'ENTRADA' ? total + tx.amount : total - tx.amount, 0);

    // Transações do mês atual
    const currentTx = allTx.filter(tx => {
      const d = new Date(tx.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month;
    });

    const currentBalance = currentTx.reduce((total, tx) => tx.type === 'ENTRADA' ? total + tx.amount : total - tx.amount, 0);

    return initialBalance + currentBalance;
  }

  // ==============================
  // CRUD DE TRANSAÇÕES
  // ==============================
  async add(input: { type: TransactionType; amount: number; date: string; categoryId: string; note?: string; cardId?: string }): Promise<Transaction> {
    const now = new Date().toISOString();
    const tx: Transaction = {
      id: uuid(),
      type: input.type,
      amount: Math.abs(input.amount),
      date: input.date,
      categoryId: input.categoryId,
      note: input.note?.trim() || undefined,
      cardId: input.cardId,
      createdAt: now,
    };
    await this.db.put('transactions', tx);
    return tx;
  }

  async update(tx: Transaction): Promise<void> {
    await this.db.put('transactions', tx);
  }

  async remove(id: string): Promise<void> {
    await this.db.delete('transactions', id);
  }

  // ==============================
  // SALDO INICIAL MENSAL
  // ==============================
  async createMonthlyInitialBalance(year: number, month: number): Promise<void> {
    const allTx = await this.listAll();

    const monthTxExists = allTx.some(tx => {
      const d = new Date(tx.date);
      return d.getFullYear() === year && d.getMonth() + 1 === month && tx.note === 'Saldo inicial do mês';
    });
    if (monthTxExists) return;

    // Saldo do mês anterior
    const previousMonth = month === 1 ? 12 : month - 1;
    const previousYear = month === 1 ? year - 1 : year;

    const balance = await this.getBalanceForMonth(previousYear, previousMonth);
    if (balance === 0) return;

    // Cria a transação de saldo inicial
    const date = new Date(year, month - 1, 1, 12, 0, 0).toISOString();
    await this.add({
      type: 'ENTRADA',
      amount: balance,
      date,
      categoryId: '',
      note: 'Saldo inicial do mês',
    });
  }

  async carryOverBalance(year: number, month: number): Promise<void> {
    const balance = await this.getBalanceForMonth(year, month);
    if (balance === 0) return;

    const nextMonth = month === 12 ? 1 : month + 1;
    const nextYear = month === 12 ? year + 1 : year;

    const allTx = await this.listAll();
    const existingCarry = allTx.find(tx => {
      const d = new Date(tx.date);
      return d.getFullYear() === nextYear && d.getMonth() + 1 === nextMonth && tx.note === 'Saldo do mês anterior';
    });
    if (existingCarry) return;

    const carryTxDate = new Date(nextYear, nextMonth - 1, 1, 12, 0, 0).toISOString();
    await this.add({
      type: 'ENTRADA',
      amount: balance,
      date: carryTxDate,
      categoryId: '',
      note: 'Saldo do mês anterior',
    });
  }
}
