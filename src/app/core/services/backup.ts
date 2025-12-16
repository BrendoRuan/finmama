import { Injectable } from '@angular/core';
import { Category } from '../models/category/category-module';
import { Transaction } from '../models/trasaction/trasaction-module';
import { Db } from '../db/db';

export interface BackupPayload {
  version: number;
  exportedAt: string;
  categories: Category[];
  transactions: Transaction[];
}

@Injectable({
  providedIn: 'root',
})
export class BackupService {
    constructor(private db: Db) {}

  async export(): Promise<BackupPayload> {
    const categories = await this.db.getAll<Category>('categories');
    const transactions = await this.db.getAll<Transaction>('transactions');

    return {
      version: 1,
      exportedAt: new Date().toISOString(),
      categories,
      transactions,
    };
  }

  async restore(payload: BackupPayload): Promise<void> {
    if (!payload || payload.version !== 1) {
      throw new Error('Backup inválido ou versão não suportada.');
    }

    // estratégia simples: limpa e restaura
    await this.db.clear('categories');
    await this.db.clear('transactions');

    for (const c of payload.categories ?? []) {
      await this.db.put('categories', c);
    }
    for (const t of payload.transactions ?? []) {
      await this.db.put('transactions', t);
    }
  }
}
