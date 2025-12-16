import { Injectable } from '@angular/core';
import { Db } from '../db/db';
import { Category,CategoryType } from '../models/category/category-module';

function uuid(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  name: any;
  active: unknown;
    constructor(private db: Db) {}

  async listAll(): Promise<Category[]> {
    const items = await this.db.getAll<Category>('categories');
    return items
      .slice()
      .sort((a, b) => Number(b.favorite) - Number(a.favorite) || a.name.localeCompare(b.name));
  }
  favorite(favorite: any) {
    throw new Error('Method not implemented.');
  }

  async listActive(): Promise<Category[]> {
    const all = await this.listAll();
    return all.filter(c => c.active);
  }

  async createDefaultsIfEmpty(): Promise<void> {
    const all = await this.db.getAll<Category>('categories');
    if (all.length > 0) return;

    const now = new Date().toISOString();
    const defaults: Array<Pick<Category, 'name' | 'color' | 'type' | 'favorite'>> = [
      { name: 'Alimentação', color: '#ef4444', type: 'SAIDA', favorite: true },
      { name: 'Feira', color: '#f97316', type: 'SAIDA', favorite: true },
      { name: 'Farmácia', color: '#a855f7', type: 'SAIDA', favorite: true },
      { name: 'Transporte', color: '#3b82f6', type: 'SAIDA', favorite: true },
      { name: 'Casa', color: '#22c55e', type: 'SAIDA', favorite: false },
      { name: 'Salário', color: '#10b981', type: 'ENTRADA', favorite: true },
    ];

    for (const d of defaults) {
      const cat: Category = {
        id: uuid(),
        name: d.name,
        color: d.color,
        type: d.type as CategoryType,
        active: true,
        favorite: d.favorite,
        createdAt: now,
      };
      await this.db.put('categories', cat);
    }
  }

  async save(category: Category): Promise<void> {
    await this.db.put('categories', category);
  }

  async add(name: string, color: string, type: CategoryType, favorite: boolean): Promise<void> {
    const now = new Date().toISOString();
    const cat: Category = {
      id: uuid(),
      name: name.trim(),
      color,
      type,
      active: true,
      favorite,
      createdAt: now,
    };
    await this.db.put('categories', cat);
  }

  async toggleActive(id: string, active: boolean): Promise<void> {
    const cat = await this.db.getById<Category>('categories', id);
    if (!cat) return;
    await this.db.put('categories', { ...cat, active });
  }

  async remove(id: string): Promise<void> {
    await this.db.delete('categories', id);
  }
}
