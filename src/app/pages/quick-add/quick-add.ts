import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Category } from '../../core/models/category/category-module';
import { TransactionType } from '../../core/models/trasaction/trasaction-module';
import { CategoryService } from '../../core/services/category';
import { TransactionService } from '../../core/services/transaction';
import { InvestmentService } from '../../core/services/investment';
import { CardService } from '../../core/services/cars/card.service';
import { toISODateInput } from '../../core/utils/dates';
import { formatBRL } from '../../core/utils/money';
import { FormsModule } from '@angular/forms';
import { CardBillService } from '../../core/services/cars/card-bill.service';

@Component({
  selector: 'app-quick-add',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './quick-add.html',
  styleUrl: './quick-add.scss',
})
export class QuickAdd implements OnInit {

  // =============================
  // REGISTRO NORMAL
  // =============================
  type: TransactionType = 'SAIDA';
  amountText = '';
  dateInput = toISODateInput(new Date());
  note = '';

  categories: Category[] = [];
  selectedCategoryId: string | null = null;

  saving = false;
  toast: { show: boolean; text: string } = { show: false, text: '' };
  lastCreatedId: string | null = null;

  // =============================
  // INVESTIMENTO
  // =============================
  investmentAmountText = '';
  investing = false;

  // =============================
  // CARTÕES
  // =============================
  cards: any[] = [];
  selectedCardId: string | null = null;


  constructor(
    private categoryService: CategoryService,
    private txService: TransactionService,
    private investmentService: InvestmentService,
    private cardService: CardService, // ✅ corrigido o nom
  private billService: CardBillService
  ) {}

async ngOnInit(): Promise<void> {
  await this.categoryService.createDefaultsIfEmpty();
  await this.loadCategories();
  await this.loadCards();

  // 🔹 Cria saldo inicial do mês atual
  const now = new Date();
  await this.txService.createMonthlyInitialBalance(now.getFullYear(), now.getMonth() + 1);
}

  // =============================
  // CATEGORIAS
  // =============================
  async loadCategories(): Promise<void> {
    const active = await this.categoryService.listActive();
    this.categories = active.sort(
      (a, b) =>
        Number(b.favorite) - Number(a.favorite) ||
        a.name.localeCompare(b.name)
    );

    if (!this.selectedCategoryId) {
      const first = this.categories.find(
        c => c.type === 'AMBOS' || c.type === this.type
      );
      this.selectedCategoryId = first?.id ?? null;
    }
  }

  setType(t: TransactionType): void {
    this.type = t;

    const selected = this.categories.find(
      c => c.id === this.selectedCategoryId
    );

    if (selected && !(selected.type === 'AMBOS' || selected.type === t)) {
      const first = this.categories.find(
        c => c.type === 'AMBOS' || c.type === t
      );
      this.selectedCategoryId = first?.id ?? null;
    }
  }

  pickCategory(id: string): void {
    this.selectedCategoryId = id;
  }

  parseAmount(): number {
    const cleaned = (this.amountText ?? '').trim().replace(/\./g, '').replace(',', '.');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

  // =============================
  // SALVAR REGISTRO
  // =============================
  async save(): Promise<void> {
    if (this.saving) return;

    const amount = this.parseAmount();
    if (!amount || amount <= 0) return this.showToast('Digite um valor válido.');
    if (!this.selectedCategoryId) return this.showToast('Selecione uma categoria.');

    this.saving = true;

    try {
      const date = new Date(`${this.dateInput}T12:00:00`).toISOString();

      const created = await this.txService.add({
        type: this.type,
        amount,
        date,
        categoryId: this.selectedCategoryId,
        note: this.note,
        cardId: this.selectedCardId ?? undefined // ✅ cartão opcional
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

  

  // =============================
  // CARTÕES
  // =============================
  async loadCards(): Promise<void> {
    this.cards = await this.cardService.getAll();
    if (this.cards.length > 0) this.selectedCardId = this.cards[0].id;
  }

  pickCard(id: string): void {
    this.selectedCardId = id;
  }

  // =============================
  // DESFAZER
  // =============================
  async undo(): Promise<void> {
    if (!this.lastCreatedId) return;

    await this.txService.remove(this.lastCreatedId);
    this.lastCreatedId = null;
    this.showToast('Desfeito.');
  }

  // =============================
  // INVESTIMENTO
  // =============================
  parseInvestmentAmount(): number {
    const cleaned = (this.investmentAmountText ?? '').trim().replace(/\./g, '').replace(',', '.');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

  async addInvestment(): Promise<void> {
    if (this.investing) return;

    const amount = this.parseInvestmentAmount();
    if (!amount || amount <= 0) return this.showToast('Digite um valor válido para investir.');

    this.investing = true;

    try {
      const balance = await this.txService.getBalance();
      if (amount > balance) return this.showToast('Saldo insuficiente para investir.');

      const investmentCategory = this.categories.find(c =>
        c.name.toLowerCase().includes('invest')
      );
      if (!investmentCategory) return this.showToast('Categoria "Investimento" não encontrada.');

      const date = new Date(`${this.dateInput}T12:00:00`).toISOString();

      await this.investmentService.addTransaction('entrada', amount);

      await this.txService.add({
        type: 'SAIDA',
        amount,
        date,
        categoryId: investmentCategory.id,
        note: 'Investimento'
      });

      this.investmentAmountText = '';
      this.showToast(`Investido 💰 (${formatBRL(amount)})`);

    } catch {
      this.showToast('Erro ao investir.');
    } finally {
      this.investing = false;
    }
  }

  // =============================
  // UTIL
  // =============================
  showToast(text: string): void {
    this.toast = { show: true, text };
    setTimeout(() => (this.toast.show = false), 1800);
  }

  isCategoryAllowed(c: Category): boolean {
    return c.type === 'AMBOS' || c.type === this.type;
  }

  // =============================
  // FATURA DO CARTÃO
  // =============================
  faturaAmountText = '';
  faturaQuantity = 1;

  parseFaturaAmount(): number {
    const cleaned = (this.faturaAmountText ?? '').trim().replace(/\./g, '').replace(',', '.');
    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

async saveCardBill(): Promise<void> {
  if (!this.selectedCardId) return this.showToast('Selecione um cartão.');

  const amount = this.parseFaturaAmount();
  if (!amount || this.faturaQuantity <= 0) return this.showToast('Digite valor e parcelas válidas.');

  this.saving = true;

  try {
    const baseDate = new Date(`${this.dateInput}T12:00:00`);
    const card = await this.cardService.getById(this.selectedCardId);
    if (!card) throw new Error('Cartão não encontrado');

    for (let i = 0; i < this.faturaQuantity; i++) {
      const installmentDate = new Date(baseDate);
      installmentDate.setMonth(installmentDate.getMonth() + i);

      const year = installmentDate.getFullYear();
      const month = installmentDate.getMonth() + 1;

      // 🔹 1️⃣ Cria ou atualiza o CardBill usando o service
      let bills = await this.billService.getByCard(card.id);
      let bill = bills.find(b => b.year === year && b.month === month);

      if (!bill) {
        bill = await this.billService.create({
          cardId: card.id,
          year,
          month,
          totalAmount: 0,
          paidAmount: 0,
          isPaid: false
        });
      }

      bill.totalAmount += amount;
      await this.billService.update(bill); // ✅ isso dispara billsChanged$ automaticamente

      // 🔹 2️⃣ Registra a transação no TransactionService
      await this.txService.add({
        type: 'SAIDA',
        amount,
        date: installmentDate.toISOString(),
        categoryId: this.selectedCategoryId ?? '',
        note: `Fatura cartão ${i + 1}/${this.faturaQuantity} - ${this.note}`,
        cardId: card.id
      });

      // 🔹 3️⃣ Atualiza o limite atual do cartão
      card.limiteAtual = Math.max((card.limiteAtual ?? card.limitTotal) - amount, 0);
      await this.cardService.update(card);
    }

    this.showToast(`Fatura salva ✅ (${this.faturaQuantity}x de ${formatBRL(amount)})`);
    this.faturaAmountText = '';
    this.faturaQuantity = 1;
    this.note = '';

  } catch (err) {
    console.error(err);
    this.showToast('Erro ao salvar a fatura.');
  } finally {
    this.saving = false;
  }
}


}
