import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Categories } from './pages/categories/categories';
import { QuickAdd } from './pages/quick-add/quick-add';
import { Backup } from './pages/backup/backup';
import { HistoryPage } from './pages/history/history';
import { Updates } from './pages/updates/updates';

import { InvestmentPage } from './pages/investment-page/investment-page';
import { CardsPage } from './pages/cards/cards.page/cards.page';
import { CardDetails } from './pages/cards/card-details/card-details';
import { AddEditCardPage } from './pages/cards/add-edit-card.page/add-edit-card.page';

export const routes: Routes = [
    { path: '', component: QuickAdd, pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'updates', component: Updates},
  { path: 'historico', component: HistoryPage },
  { path: 'categorias', component: Categories },
  { path: 'backup', component: Backup },
  { path: 'investment', component: InvestmentPage},
  { path:'cards', component: CardsPage},
  { path: 'cards/:id', component: CardDetails},
 { path: 'add-edit-card', component: AddEditCardPage },
{ path: 'add-edit-card/:id', component: AddEditCardPage },

  { path: '**', redirectTo: '' },

];
