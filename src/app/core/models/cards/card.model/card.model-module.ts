export interface Card {
  id: string;
  name: string;
  brand: 'visa' | 'master' | 'elo' | 'amex' | 'outro'; // não precisa exportar CardBrand separado
  limitTotal: number;      // limite total do cartão
  limiteAtual: number;     // limite atual disponível

  closingDay: number;      // dia de fechamento (1–28)
  dueDay: number;          // dia de vencimento (1–28)

  color: string;           // cor do cartão (UI)
  createdAt: string;
  active?: boolean;
  updatedAt?: string;
}
