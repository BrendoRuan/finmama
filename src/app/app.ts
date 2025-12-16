import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, CommonModule, RouterModule],
  template:  `
    <div class="app-shell">
      <router-outlet />
      <nav class="bottom-nav" aria-label="Navegação">
        <a class="nav-item" routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{ exact: true }">
          <span class="nav-ico">＋</span>
          <span class="nav-txt">Lançar</span>
        </a>
        <a class="nav-item" routerLink="/dashboard" routerLinkActive="active">
          <span class="nav-ico">📊</span>
          <span class="nav-txt">Resumo</span>
        </a>
        <a class="nav-item" routerLink="/historico" routerLinkActive="active">
          <span class="nav-ico">🧾</span>
          <span class="nav-txt">Histórico</span>
        </a>
        <a class="nav-item" routerLink="/categorias" routerLinkActive="active">
          <span class="nav-ico">🏷️</span>
          <span class="nav-txt">Categorias</span>
        </a>
        <a class="nav-item" routerLink="/backup" routerLinkActive="active">
          <span class="nav-ico">💾</span>
          <span class="nav-txt">Backup</span>
        </a>
      </nav>
    </div>
  `,
  styleUrl: './app.scss'
})
export class App {
  protected title = 'fin-mama';
}
