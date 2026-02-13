import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CardBillService } from '../../../core/services/cars/card-bill.service';
import { CardService } from '../../../core/services/cars/card.service';
import { Card } from '../../../core/models/cards/card.model/card.model-module';
import { CardBill } from '../../../core/models/cards/card-bill.model/card-bill.model-module';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-card-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './card-details.html',
  styleUrl: './card-details.scss',
})
export class CardDetails implements OnInit, OnDestroy {
  card!: Card;
  bills: CardBill[] = [];

  limitUsed = 0;
  limitAvailable = 0;
  limitPercent = 0;

  loading = true;
  private subscription!: Subscription;

  constructor(
    private route: ActivatedRoute,
    private cardService: CardService,
    private billService: CardBillService
  ) {}

  async ngOnInit() {
    const cardId = this.route.snapshot.paramMap.get('id');
    if (!cardId) return;

    this.card = await this.cardService.getById(cardId) as Card;
    await this.loadBills();

    // 🔔 Inscreve para mudanças
    this.subscription = this.billService.billsChanged$.subscribe(() => {
      this.loadBills(); // Recarrega faturas e recalcula limites
    });
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  private async loadBills() {
    this.bills = await this.billService.getByCard(this.card.id);
    this.calculateLimits();
    this.loading = false;
  }

  private calculateLimits() {
    this.limitUsed = this.bills.reduce((sum, bill) => sum + bill.totalAmount, 0);
    this.limitAvailable = this.card.limitTotal - this.limitUsed;
    this.limitPercent = this.card.limitTotal > 0 ? Math.min((this.limitUsed / this.card.limitTotal) * 100, 100) : 0;
  }
}
