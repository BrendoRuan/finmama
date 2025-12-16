import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/models/category/category-module';
import { TransactionType } from '../../core/models/trasaction/trasaction-module';
import { CategoryService } from '../../core/services/category';
import { TransactionService } from '../../core/services/transaction';
import { toISODateInput } from '../../core/utils/dates';
import { formatBRL } from '../../core/utils/money';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-quick-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-add.html',
  styleUrl: './quick-add.scss',
})
export class QuickAdd implements OnInit  {
  type: TransactionType = 'SAIDA';
  amountText = '';
  dateInput = toISODateInput(new Date());
  note = '';

  categories: Category[] = [];
  selectedCategoryId: string | null = null;

  saving = false;
  toast: { show: boolean; text: string } = { show: false, text: '' };
  lastCreatedId: string | null = null;

  constructor(
    private categoryService: CategoryService,
    private txService: TransactionService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.categoryService.createDefaultsIfEmpty();
    await this.loadCategories();
  }

  async loadCategories(): Promise<void> {
    const active = await this.categoryService.listActive();
    // favoritas primeiro
    this.categories = active.sort((a, b) => Number(b.favorite) - Number(a.favorite) || a.name.localeCompare(b.name));
    // auto selecionar primeira compatível
    if (!this.selectedCategoryId) {
      const first = this.categories.find(c => c.type === 'AMBOS' || c.type === this.type);
      this.selectedCategoryId = first?.id ?? null;
    }
  }

  setType(t: TransactionType): void {
    this.type = t;
    // ajustar categoria selecionada se não compatível
    const selected = this.categories.find(c => c.id === this.selectedCategoryId);
    if (selected && !(selected.type === 'AMBOS' || selected.type === t)) {
      const first = this.categories.find(c => c.type === 'AMBOS' || c.type === t);
      this.selectedCategoryId = first?.id ?? null;
    }
  }

  pickCategory(id: string): void {
    this.selectedCategoryId = id;
  }

  parseAmount(): number {
    // aceita "12,50" ou "12.50" ou "12"
    const cleaned = (this.amountText ?? '').trim().replace(/\./g, '').replace(',', '.');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

  async save(): Promise<void> {
    if (this.saving) return;

    const amount = this.parseAmount();
    if (!amount || amount <= 0) return this.showToast('Digite um valor válido.');
    if (!this.selectedCategoryId) return this.showToast('Selecione uma categoria.');

    this.saving = true;
    try {
      const dateISO = new Date(`${this.dateInput}T12:00:00`).toISOString();
      const created = await this.txService.add({
        type: this.type,
        amount,
        dateISO,
        categoryId: this.selectedCategoryId,
        note: this.note,
      });

      this.lastCreatedId = created.id;
      this.amountText = '';
      this.note = '';
      this.showToast(`Salvo ✅ (${formatBRL(created.amount)})`);
    } catch {
      this.showToast('Erro ao salvar.');
    } finally {
      this.saving = false;
    }
  }

  async undo(): Promise<void> {
    if (!this.lastCreatedId) return;
    await this.txService.remove(this.lastCreatedId);
    this.lastCreatedId = null;
    this.showToast('Desfeito.');
  }

  showToast(text: string): void {
    this.toast = { show: true, text };
    setTimeout(() => (this.toast.show = false), 1800);
  }

  isCategoryAllowed(c: Category): boolean {
    return c.type === 'AMBOS' || c.type === this.type;
  }
}
