export type CategoryType = 'ENTRADA' | 'SAIDA' | 'AMBOS';

export interface Category {
  id: string;
  name: string;
  type: CategoryType;
  color: string; // hex (ex: #ef4444)
  active: boolean;
  favorite: boolean;
  createdAt: string; // ISO
}
