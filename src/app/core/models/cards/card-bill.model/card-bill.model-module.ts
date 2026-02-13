export interface CardBill {
  id: string;
  cardId: string;

  year: number;
  month: number; // 1-12

  totalAmount: number;
  paidAmount: number;

  isPaid: boolean;
  createdAt: string;
}
