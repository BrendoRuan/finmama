import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { InvestmentService } from '../../core/services/investment';
import { InvestmentModel } from '../../core/models/investment/investment/investment-module';
import { formatBRL } from '../../core/utils/money';

@Component({
  selector: 'app-investment-page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './investment-page.html',
  styleUrl: './investment-page.scss',
})
export class InvestmentPage implements OnInit {

  investment: InvestmentModel | null = null;

  type: 'entrada' | 'saida' = 'entrada';
  amountText = '';

  saving = false;
  toast: { show: boolean; text: string } = { show: false, text: '' };

  constructor(private service: InvestmentService) {}

  async ngOnInit() {
    await this.load();
  }

  async load() {
    this.investment = await this.service.getInvestment();
  }

  setType(t: 'entrada' | 'saida') {
    this.type = t;
  }

  parseAmount(): number {
    const cleaned = (this.amountText ?? '')
      .trim()
      .replace(/\./g, '')
      .replace(',', '.');

    const n = Number(cleaned);
    return Number.isFinite(n) ? n : 0;
  }

  async save() {
    if (this.saving) return;

    const amount = this.parseAmount();
    if (!amount || amount <= 0) {
      return this.showToast('Digite um valor válido.');
    }

    this.saving = true;

    try {
      await this.service.addTransaction(this.type, amount);
      this.amountText = '';
      await this.load();

      this.showToast(
        `${this.type === 'entrada' ? 'Aplicado' : 'Resgatado'} ✅ (${formatBRL(amount)})`
      );
    } catch {
      this.showToast('Erro ao salvar.');
    } finally {
      this.saving = false;
    }
  }

  showToast(text: string) {
    this.toast = { show: true, text };
    setTimeout(() => (this.toast.show = false), 1800);
  }
}
