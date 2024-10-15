import { Route } from '@angular/router';

import { JudgeAuthGuard } from '@core/services/common/guard/judgeAuth.guard';
import { JudgeLoginGuard } from '@core/services/common/guard/judgeLogin.guard';

import { DefaultComponent } from './default.component';
import {ClientsComponent} from "@app/pages/page/clients/clients.component";

export default [
  {
    path: '',
    component: DefaultComponent,
    data: { shouldDetach: 'no', preload: true },
    canActivateChild: [JudgeLoginGuard, JudgeAuthGuard],
    children: [
      { path: '', redirectTo: 'about', pathMatch: 'full' },
      {
        path: 'level',
        loadChildren: () => import('../../pages/level/level-routing')
      },
      {
        path: 'clients',
        title: '客户端',
        data: { key: 'clients' },
        loadComponent: () => import('../../pages/page/clients/clients.component').then(m => m.ClientsComponent)
      },
      {
        path: 'system',
        loadChildren: () => import('../../pages/system/system-routing')
      }
    ]
  }
] satisfies Route[];
