export type TransactionType = 'ENTRADA' | 'SAIDA';

export interface Transaction {
  id: string;
  type: TransactionType;
  amount: number; // sempre positivo
  date: string; // ISO
  categoryId: string;
  note?: string;
  createdAt: string; // ISO
}
