export type InvestmentType = 'cdi';

export type InvestmentTransactionType = 'entrada' | 'saida';

export interface InvestmentTransaction {
  id: string;
  type: InvestmentTransactionType;
  amount: number;
  date: string;
}

export interface InvestmentModel {
  id: string; // sempre 'cdi'
  type: InvestmentType;
  totalAmount: number;
  transactions: InvestmentTransaction[];
}
