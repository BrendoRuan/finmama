import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';



interface UpdateNote {
  date: string;
  title: string;
  description: string;
}


@Component({
  selector: 'app-updates',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './updates.html',
  styleUrl: './updates.scss',
})
export class Updates implements OnInit{
  updates: UpdateNote[] = [];

  ngOnInit(): void {
    this.loadUpdates();
  }

  private loadUpdates() {
    this.updates = [
      {
        date: '31/01/2026',
        title: 'Novo estilo do menu',
        description:
          'O menu inferior recebeu um novo visual mais formal, com botões organizados e efeito de hover.'
      },
      {
  "date": "31/01/2026",
  "title": "Nova tela de Atualizações e melhorias no menu",
  "description": "• Nova tela de Atualizações\nFoi criada uma tela dedicada para exibir todas as mudanças do sistema, permitindo que os usuários acompanhem novidades e melhorias de forma clara e organizada.\n\n• Novo visual do menu inferior\nO menu foi reformulado com um design mais formal e moderno, deixando a navegação mais intuitiva e agradável.\n\n• Feedback visual nos botões\nAgora os botões do menu possuem efeito de hover, mudando levemente de cor ao passar o mouse, trazendo mais clareza e sensação de interação."
}

    ];
  }
}
