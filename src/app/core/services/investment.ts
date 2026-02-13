import { Injectable } from '@angular/core';
import { Db } from '../db/db';
import { InvestmentModel, InvestmentTransaction } from '../models/investment/investment/investment-module';



@Injectable({
  providedIn: 'root',
})
export class InvestmentService {

  private readonly STORE = 'emergency_reserve';
  private readonly ID = 'cdi';

  constructor(private db: Db) {}

  async getInvestment(): Promise<InvestmentModel> {
    const existing = await this.db.getById<InvestmentModel>(this.STORE, this.ID);

    if (existing) {
      return existing;
    }

    const newInvestment: InvestmentModel = {
      id: this.ID,
      type: 'cdi',
      totalAmount: 0,
      transactions: [],
    };

    await this.db.put(this.STORE, newInvestment);

    return newInvestment;
  }

  async addTransaction(type: 'entrada' | 'saida', amount: number) {
    const investment = await this.getInvestment();

    const transaction: InvestmentTransaction = {
      id: crypto.randomUUID(),
      type,
      amount,
      date: new Date().toISOString(),
    };

    if (type === 'entrada') {
      investment.totalAmount += amount;
    } else {
      investment.totalAmount -= amount;
    }

    investment.transactions.unshift(transaction);

    await this.db.put(this.STORE, investment);
  }
}
