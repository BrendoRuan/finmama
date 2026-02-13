import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CardBill } from '../../models/cards/card-bill.model/card-bill.model-module';
import { Db } from '../../db/db';

@Injectable({
  providedIn: 'root',
})
export class CardBillService {
  private readonly storeName = 'card_bills';
  
  // Subject que notifica alterações nos bills
  private billsChangedSubject = new BehaviorSubject<void>(undefined);
  billsChanged$ = this.billsChangedSubject.asObservable();

  constructor(private db: Db) {}

  async getByCard(cardId: string): Promise<CardBill[]> {
    const bills = await this.db.getAll<CardBill>(this.storeName);
    return bills
      .filter(b => b.cardId === cardId)
      .sort((a, b) => a.year === b.year ? b.month - a.month : b.year - a.year);
  }

  async create(bill: Omit<CardBill, 'id' | 'createdAt'>): Promise<CardBill> {
    const newBill: CardBill = {
      ...bill,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await this.db.put(this.storeName, newBill);
    this.billsChangedSubject.next(); // 🚀 Notifica mudança
    return newBill;
  }

  async update(bill: CardBill): Promise<void> {
    await this.db.put(this.storeName, bill);
    this.billsChangedSubject.next(); // 🚀 Notifica mudança
  }

  async delete(id: string): Promise<void> {
    await this.db.delete(this.storeName, id);
    this.billsChangedSubject.next(); // 🚀 Notifica mudança
  }
}
