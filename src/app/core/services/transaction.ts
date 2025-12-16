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

  async listAll(): Promise<Transaction[]> {
    const items = await this.db.getAll<Transaction>('transactions');
    return items.slice().sort((a, b) => b.date.localeCompare(a.date));
  }

  async add(input: { type: TransactionType; amount: number; dateISO: string; categoryId: string; note?: string }): Promise<Transaction> {
    const now = new Date().toISOString();
    const tx: Transaction = {
      id: uuid(),
      type: input.type,
      amount: Math.abs(input.amount),
      date: input.dateISO,
      categoryId: input.categoryId,
      note: input.note?.trim() || undefined,
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
}
