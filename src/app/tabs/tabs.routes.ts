import { Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

export const routes: Routes = [
  {
    path: 'tabs',
    component: TabsPage,
    children: [
      {
        path: 'clientes',
        loadComponent: () =>
          import('../pages/clientes/clientes.page').then((m) => m.ClientesPage),
      },
      {
        path: 'equipamentos',
        loadComponent: () =>
          import('../pages/equipamentos/equipamentos.page').then(
            (m) => m.EquipamentosPage
          ),
      },
      {
        path: 'os',
        loadComponent: () => import('../pages/os/os.page').then((m) => m.OSPage),
      },
      {
        path: 'conta',
        loadComponent: () =>
          import('../pages/conta/conta.page').then((m) => m.ContaPage),
      },
      {
        path: '',
        redirectTo: '/tabs/clientes',
        pathMatch: 'full',
      },
    ],
  },
  {
    path: '',
    redirectTo: '/tabs/clientes',
    pathMatch: 'full',
  },
];
