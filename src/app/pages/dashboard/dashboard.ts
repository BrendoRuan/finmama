import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/models/category/category-module';
import { Transaction } from '../../core/models/trasaction/trasaction-module';
import { Analytics, CategorySpend } from '../../core/services/analytics';
import { CategoryService } from '../../core/services/category';
import { TransactionService } from '../../core/services/transaction';
import { monthKeyFromDate, formatMonthTitle } from '../../core/utils/dates';
import { formatBRL } from '../../core/utils/money';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {

    year!: number;
  month!: number;

  categories: Category[] = [];
  transactions: Transaction[] = [];

  entradas = 0;
  saidas = 0;
  saldo = 0;

  spends: CategorySpend[] = [];
  latest: Array<{ tx: Transaction; category?: Category }> = [];

  formatBRL = formatBRL;

  constructor(
    private categoryService: CategoryService,
    private txService: TransactionService,
    private analytics: Analytics
  ) {}

  async ngOnInit(): Promise<void> {
    const now = monthKeyFromDate(new Date());
    this.year = now.year;
    this.month = now.month;

    await this.refresh();
  }

  async refresh(): Promise<void> {
    this.categories = await this.categoryService.listAll();
    this.transactions = await this.txService.listAll();

    const s = this.analytics.summarizeMonth(this.transactions, this.year, this.month);
    this.entradas = s.entradas;
    this.saidas = s.saidas;
    this.saldo = s.saldo;

    this.spends = this.analytics.spendsByCategory(this.transactions, this.categories, this.year, this.month);

    const catMap = new Map(this.categories.map(c => [c.id, c]));
    this.latest = this.transactions.slice(0, 8).map(tx => ({ tx, category: catMap.get(tx.categoryId) }));
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

  barWidth(percent: number): string {
    const p = Math.max(0, Math.min(100, percent));
    return `${p}%`;
  }
}
