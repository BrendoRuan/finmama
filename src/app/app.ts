import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  template:  `
    <div class="app-shell">

      <router-outlet />

      <!-- MENU SECUNDÁRIO -->
      <div class="more-menu" *ngIf="isMoreOpen">
        <a routerLink="/categorias" (click)="closeMore()">Categorias</a>
        <a routerLink="/backup" (click)="closeMore()">Backup</a>
        <a routerLink="/updates" (click)="closeMore()">Atualizações</a>
        <a routerLink="/investment" (click)="closeMore()">Investimento</a>
        <a routerLink="/cards" (click)="closeMore()">Cartões</a>
      </div>

      <!-- BOTTOM NAV -->
      <nav class="bottom-nav" aria-label="Navegação principal">
        <a
          class="nav-item"
          routerLink="/"
          routerLinkActive="active"
          [routerLinkActiveOptions]="{ exact: true }"
        >
          <span class="nav-ico">✚</span>
          <span class="nav-txt">Registro</span>
        </a>

        <a class="nav-item" routerLink="/dashboard" routerLinkActive="active">
          <span class="nav-ico">📈</span>
          <span class="nav-txt">Dashboard</span>
        </a>

        <a class="nav-item" routerLink="/historico" routerLinkActive="active">
          <span class="nav-ico">📄</span>
          <span class="nav-txt">Histórico</span>
        </a>

        <button class="nav-item" (click)="toggleMore()">
          <span class="nav-ico">☰</span>
          <span class="nav-txt">Mais</span>
        </button>
      </nav>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected title = 'fin-mama';
    isMoreOpen = false;

  toggleMore() {
    this.isMoreOpen = !this.isMoreOpen;
  }

  closeMore() {
    this.isMoreOpen = false;
  }
}
