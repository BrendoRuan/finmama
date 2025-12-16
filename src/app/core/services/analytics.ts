import { Injectable } from '@angular/core';
import { Category } from '../models/category/category-module';
import { Transaction } from '../models/trasaction/trasaction-module';
import { startEndOfMonth, inRangeISO } from '../utils/dates';

export interface MonthlySummary {
  entradas: number;
  saidas: number;
  saldo: number;
}

export interface CategorySpend {
  categoryId: string;
  categoryName: string;
  color: string;
  total: number;
  percent: number; // 0..100
}

@Injectable({
  providedIn: 'root',
})
export class Analytics {
    summarizeMonth(transactions: Transaction[], year: number, month: number): MonthlySummary {
    const { start, end } = startEndOfMonth(year, month);

    let entradas = 0;
    let saidas = 0;

    for (const t of transactions) {
      if (!inRangeISO(t.date, start, end)) continue;
      if (t.type === 'ENTRADA') entradas += t.amount;
      if (t.type === 'SAIDA') saidas += t.amount;
    }

    return { entradas, saidas, saldo: entradas - saidas };
  }

  spendsByCategory(transactions: Transaction[], categories: Category[], year: number, month: number): CategorySpend[] {
    const { start, end } = startEndOfMonth(year, month);
    const catMap = new Map(categories.map(c => [c.id, c]));
    const totals = new Map<string, number>();

    let totalSaidas = 0;

    for (const t of transactions) {
      if (t.type !== 'SAIDA') continue;
      if (!inRangeISO(t.date, start, end)) continue;

      totalSaidas += t.amount;
      totals.set(t.categoryId, (totals.get(t.categoryId) ?? 0) + t.amount);
    }

    const result: CategorySpend[] = [];
    for (const [catId, total] of totals.entries()) {
      const c = catMap.get(catId);
      result.push({
        categoryId: catId,
        categoryName: c?.name ?? 'Sem categoria',
        color: c?.color ?? '#64748b',
        total,
        percent: totalSaidas > 0 ? (total / totalSaidas) * 100 : 0,
      });
    }

    return result.sort((a, b) => b.total - a.total);
  }
}
