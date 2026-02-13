import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CardService } from '../../../core/services/cars/card.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Card } from '../../../core/models/cards/card.model/card.model-module';

@Component({
  selector: 'app-add-edit-card.page',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-card.page.html',
  styleUrls: ['./add-edit-card.page.scss'],
})
export class AddEditCardPage implements OnInit {
  cardId: string | null = null;
  isEdit = false;

  // Disponíveis para seleção no formulário
  availableBrands: ('visa' | 'master' | 'elo' | 'amex' | 'outro')[] = [
    'visa',
    'master',
    'elo',
    'amex',
    'outro',
  ];

  // Objeto de cartão a ser editado/criado
  card: Partial<Card> = {
    name: '',
    brand: 'visa',
    limitTotal: 0,
    limiteAtual: 0, // novo campo para controle do limite atual
    closingDay: 1,
    dueDay: 1,
    color: '#7b3fe4',
    active: true,
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private cardService: CardService
  ) {}

  async ngOnInit() {
    this.cardId = this.route.snapshot.paramMap.get('id');

    if (this.cardId) {
      const existing = await this.cardService.getById(this.cardId);
      if (existing) {
        this.card = { ...existing };
        this.isEdit = true;
      }
    }
  }

  async save() {
    if (!this.card.name || this.card.limitTotal == null || !this.card.brand) {
      alert('Preencha os campos obrigatórios: nome, limite e bandeira.');
      return;
    }

    // Garantir que limiteAtual esteja definido na criação
    if (!this.isEdit && (this.card.limiteAtual == null || this.card.limiteAtual === undefined)) {
      this.card.limiteAtual = this.card.limitTotal;
    }

    if (this.isEdit) {
      await this.cardService.update(this.card as Card);
    } else {
      await this.cardService.create(this.card as Card);
    }

    this.router.navigate(['/cards']);
  }

  cancel() {
    this.router.navigate(['/cards']);
  }
}
