import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Category, CategoryType } from '../../core/models/category/category-module';
import { CategoryService } from '../../core/services/category';
@Component({
  selector: 'app-categories',
  imports: [CommonModule, FormsModule],
  standalone: true,
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories implements OnInit {
  categories: Category[] = [];

  name = '';
  color = '#3b82f6';
  type: CategoryType = 'SAIDA';
  favorite = true;

  palette = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#10b981', '#06b6d4', '#3b82f6', '#6366f1', '#a855f7', '#ec4899'];

  constructor(private categoryService: CategoryService) {}

  async ngOnInit(): Promise<void> {
    await this.categoryService.createDefaultsIfEmpty();
    await this.refresh();
  }

  async refresh(): Promise<void> {
    this.categories = await this.categoryService.listAll();
  }

  async add(): Promise<void> {
    const n = this.name.trim();
    if (!n) return;
    await this.categoryService.add(n, this.color, this.type, this.favorite);
    this.name = '';
    await this.refresh();
  }

  async toggleActive(c: Category): Promise<void> {
    await this.categoryService.toggleActive(c.id, !c.active);
    await this.refresh();
  }

  async toggleFavorite(c: Category): Promise<void> {
    await this.categoryService.save({ ...c, favorite: !c.favorite });
    await this.refresh();
  }

  async remove(c: Category): Promise<void> {
    if (!confirm(`Deseja realmente excluir a categoria "${c.name}"?`)) return;
    await this.categoryService.remove(c.id);
    await this.refresh();
  }

  pickColor(hex: string): void {
    this.color = hex;
  }
}
