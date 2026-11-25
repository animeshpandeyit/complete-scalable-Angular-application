import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./features/tasks/pages/task-list/task-list.component').then(
        (m) => m.TaskListComponent,
      ),
  },
  {
    path: 'taskplayground',
    loadComponent: () =>
      import('./features/tasks/pages/task-playground/task-playground.component').then(
        (m) => m.TaskPlaygroundComponent,
      ),
  },

  {
    path: 'task-monitor',
    loadComponent: () =>
      import('./features/tasks/components/task-monitor/task-monitor.component').then(
        (m) => m.TaskMonitorComponent,
      ),
  },
];
