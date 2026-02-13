import { Component, OnInit } from '@angular/core';
import { Card } from '../../../core/models/cards/card.model/card.model-module';
import { CardCalculatorService } from '../../../core/services/cars/card-calculator.service';
import { CardService } from '../../../core/services/cars/card.service';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cards.page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cards.page.html',
  styleUrl: './cards.page.scss',
})
export class CardsPage implements OnInit{

   cards: Card[] = [];
  transactions: any[] = []; // depois troca por TransactionService
  selectedCardId: string | null = null;

  constructor(
    private cardService: CardService,
    public calculator: CardCalculatorService,
    private router: Router
  ) {}

  async ngOnInit() {
    this.cards = await this.cardService.getAll();
    // futuramente:
    // this.transactions = await this.transactionService.getAll();
  }

  selectCard(card: Card) {
    this.selectedCardId =
      this.selectedCardId === card.id ? null : card.id;
  }

openDetails(card: Card) {
  this.router.navigate(['/cards', card.id]);
}


  getUsedLimit(card: Card): number {
    return this.calculator.calculateUsedLimit(
      card,
      this.transactions
    );
  }

  getAvailableLimit(card: Card): number {
    const used = this.getUsedLimit(card);
    return this.calculator.calculateAvailableLimit(card, used);
  }

  isSelected(card: Card): boolean {
    return this.selectedCardId === card.id;
  }
addCard() {
  this.router.navigate(['/add-edit-card']);
}

editCard() {
  if (!this.selectedCardId) return;
  this.router.navigate(['/add-edit-card', this.selectedCardId]);
}

async deleteCard() {
  if (!this.selectedCardId) return;

  const confirmDelete = confirm('Excluir este cartão?');
  if (!confirmDelete) return;

  await this.cardService.delete(this.selectedCardId);
  this.cards = await this.cardService.getAll();
  this.selectedCardId = null;
}

}
