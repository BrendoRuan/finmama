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

  formatDescription(desc: string): string {
  // transforma • em <li> e quebra de linha em <br>
  const lines = desc.split('\n').map(line => {
    if (line.startsWith('• ')) {
      return `<li>${line.substring(2)}</li>`;
    } else {
      return `<p>${line}</p>`;
    }
  });
  return `<ul>${lines.join('')}</ul>`;
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
},
  {
    date: '12/02/2026',
    title: 'Atualização do TransactionService',
    description:
      '• Organização do código do TransactionService\nO serviço de transações foi reorganizado, mantendo toda a funcionalidade de cálculo de saldo, saldo mensal e carry-over, mas com código mais limpo e fácil de manter.\n\n• Removido código redundante\nFunções antigas e duplicadas foram removidas para simplificar a leitura e manutenção.'
  },
  {
    date: '12/02/2026',
    title: 'Atualização da tela de Categorias',
    description:
      '• Botão de excluir categoria\nFoi adicionado um botão "Excluir" para cada categoria, permitindo remover categorias diretamente da lista.\n\n• Confirmação antes de excluir\nAo clicar em "Excluir", o usuário recebe uma confirmação para evitar remoções acidentais.\n\n• Reorganização do componente Categories\nO código do componente foi limpo e padronizado, mantendo a lista de categorias, a adição de novas categorias, e os botões de ações (Favorita, Ativar/Desativar, Excluir) de forma consistente.'
  },
  {
  date: '12/02/2026',
  title: 'Nova Tela de Investimentos',
  description:
    '• Adição da tela de Investimentos\nOs usuários agora podem visualizar e acompanhar seus investimentos de forma clara e organizada.\n\n• Resumo dos investimentos\nExibe valores atuais, histórico de rendimentos.\n\n• Detalhes individuais\nCada investimento possui informações detalhadas como tipo, data de aplicação e situação atual.'
},
{
  date: '12/02/2026',
  title: 'Nova Tela de Cartões',
  description:
    '• Adição da tela de Cartões\nPermite controlar todos os cartões do usuário em um único local.\n\n• Cadastro e gerenciamento\nOs usuários podem adicionar novos cartões, editar informações existentes ou remover cartões cadastrados.\n\n• Integração com lançamentos\nAo registrar despesas ou receitas, é possível associar cada lançamento a um cartão específico, atualizando limites e disponibilidades automaticamente.\n\n• Fluxo intuitivo\nA tela mantém navegação clara, cards interativos com hover e destaque de informações importantes como limite e data de vencimento.'
},
{
  date: '12/02/2026',
  title: 'Atualização da Tela de Registro',
  description:
    '• Associação de lançamentos a investimentos\nAgora cada lançamento pode ser vinculado a um investimento específico, atualizando automaticamente o saldo do mesmo.\n\n• Associação de lançamentos a cartões\nLançamentos podem ser atribuídos a cartões cadastrados, ajustando automaticamente o limite disponível.\n\n• Mais controle financeiro\nEssa atualização garante que cada registro reflita corretamente nas finanças do usuário, oferecendo maior precisão e organização no planejamento.'
},
  {
    date: '12/02/2026',
    title: 'Novo Estilo da Tela de Atualizações',
    description:
      '• Visual renovado\nA tela de atualizações recebeu um novo estilo totalmente branco, com cards destacados e hover suave em roxo claro.\n\n• Layout mais limpo\nCards organizados em coluna central, com títulos em roxo forte e textos claros, melhorando a leitura e a navegação.\n\n• Interatividade aprimorada\nHover com elevação e leve escala nos cards, dando feedback visual ao usuário e tornando a experiência mais moderna e agradável.'
  }


    ];
  }
  
}
