import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import { Categories } from './pages/categories/categories';
import { QuickAdd } from './pages/quick-add/quick-add';
import { Backup } from './pages/backup/backup';
import { HistoryPage } from './pages/history/history';
import { Updates } from './pages/updates/updates';

export const routes: Routes = [
    { path: '', component: QuickAdd, pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'updates', component: Updates},
  { path: 'historico', component: HistoryPage },
  { path: 'categorias', component: Categories },
  { path: 'backup', component: Backup },
  { path: '**', redirectTo: '' },
];
