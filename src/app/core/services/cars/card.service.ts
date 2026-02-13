import { Injectable } from '@angular/core';
import { Db } from '../../db/db';
import { Card } from '../../models/cards/card.model/card.model-module';
import { CardBillService } from './card-bill.service';

@Injectable({
  providedIn: 'root',
})
export class CardService {
  private readonly storeName = 'cards';

  constructor(private db: Db) {}

  getAll(): Promise<Card[]> {
    return this.db.getAll<Card>(this.storeName);
  }

  getById(id: string): Promise<Card | null> {
    return this.db.getById<Card>(this.storeName, id);
  }

async create(card: Omit<Card, 'id' | 'createdAt' | 'limiteAtual'>): Promise<Card> {
  const newCard: Card = {
    ...card,
    id: crypto.randomUUID(),
    createdAt: new Date().toISOString(),
    limiteAtual: card.limitTotal // inicializa limite atual
  };

  await this.db.put(this.storeName, newCard);
  return newCard;
}



  async update(card: Card): Promise<void> {
    await this.db.put(this.storeName, card);
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(this.storeName, id);
  }

async addToCardSpent(cardId: string, amount: number): Promise<void> {
  const card = await this.getById(cardId);
  if (!card) return;

  card.limiteAtual += amount; // ✅ sem TS2339 agora
  await this.update(card);
}

async decreaseLimit(cardId: string, amount: number): Promise<void> {
  const card = await this.getById(cardId);
  if (!card) throw new Error('Cartão não encontrado');

  card.limiteAtual = (card.limiteAtual ?? card.limitTotal) - amount;
  card.updatedAt = new Date().toISOString();

  await this.update(card);
}

async recalculateLimit(cardId: string, billService: CardBillService): Promise<void> {
  const card = await this.getById(cardId);
  if (!card) return;

  const bills = await billService.getByCard(cardId);
  const totalSpent = bills.reduce((sum, b) => sum + b.totalAmount, 0);

  card.limiteAtual = Math.max(card.limitTotal - totalSpent, 0);
  card.updatedAt = new Date().toISOString();

  await this.update(card);
}


}
