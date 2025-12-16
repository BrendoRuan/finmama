import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category } from '../../core/models/category/category-module';
import { Transaction } from '../../core/models/trasaction/trasaction-module';
import { CategoryService } from '../../core/services/category';
import { TransactionService } from '../../core/services/transaction';
import { formatShortDate, monthKeyFromDate, formatMonthTitle, startEndOfMonth, inRangeISO } from '../../core/utils/dates';
import { formatBRL } from '../../core/utils/money';

type FilterType = 'TODOS' | 'ENTRADA' | 'SAIDA';

@Component({
  selector: 'app-history',
  imports: [CommonModule, FormsModule],
  standalone:true,
  templateUrl: './history.html',
  styleUrl: './history.scss',
})
export class HistoryPage implements OnInit {
  year!: number;
  month!: number;

  categories: Category[] = [];
  transactions: Transaction[] = [];

  filterType: FilterType = 'TODOS';
  filterCategoryId: string = 'TODAS';

  grouped: Array<{ dayLabel: string; items: Array<{ tx: Transaction; category?: Category }> }> = [];

  formatBRL = formatBRL;
  formatShortDate = formatShortDate;

  constructor(
    private categoryService: CategoryService,
    private txService: TransactionService
  ) {}

  async ngOnInit(): Promise<void> {
    const now = monthKeyFromDate(new Date());
    this.year = now.year;
    this.month = now.month;
    await this.refresh();
  }

  title(): string {
    return formatMonthTitle(this.year, this.month);
  }

  prevMonth(): void {
    if (this.month === 1) { this.month = 12; this.year -= 1; }
    else this.month -= 1;
    void this.refresh();
  }

  nextMonth(): void {
    if (this.month === 12) { this.month = 1; this.year += 1; }
    else this.month += 1;
    void this.refresh();
  }

  async refresh(): Promise<void> {
    this.categories = await this.categoryService.listAll();
    this.transactions = await this.txService.listAll();
    this.rebuild();
  }

  rebuild(): void {
    const { start, end } = startEndOfMonth(this.year, this.month);
    const catMap = new Map(this.categories.map(c => [c.id, c]));

    let list = this.transactions.filter(t => inRangeISO(t.date, start, end));

    if (this.filterType !== 'TODOS') list = list.filter(t => t.type === this.filterType);
    if (this.filterCategoryId !== 'TODAS') list = list.filter(t => t.categoryId === this.filterCategoryId);

    // agrupar por dia
    const map = new Map<string, Array<{ tx: Transaction; category?: Category }>>();
    for (const tx of list) {
      const dayKey = new Date(tx.date).toISOString().slice(0, 10); // yyyy-mm-dd
      const arr = map.get(dayKey) ?? [];
      arr.push({ tx, category: catMap.get(tx.categoryId) });
      map.set(dayKey, arr);
    }

    const sortedKeys = Array.from(map.keys()).sort((a, b) => b.localeCompare(a));
    this.grouped = sortedKeys.map(k => {
      const iso = `${k}T12:00:00.000Z`;
      const items = (map.get(k) ?? []).sort((a, b) => b.tx.date.localeCompare(a.tx.date));
      return { dayLabel: formatShortDate(iso), items };
    });
  }

  async remove(id: string): Promise<void> {
    if (!confirm('Excluir este lançamento?')) return;
    await this.txService.remove(id);
    await this.refresh();
  }
}
