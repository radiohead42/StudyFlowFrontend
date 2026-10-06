import { Routes } from '@angular/router';
import { Register } from './features/auth/register/register.component';
import { Login } from './features/auth/login/login.component';
import { SubjectsList } from './features/subjects/subjects-list/subjects-list.component';
import { SubjectCreate } from './features/subjects/subject-create/subject-create.component';
import { SubjectEdit } from './features/subjects/subject-edit/subject-edit.component';
import { authGuard } from './core/auth/auth.guard';
import { TasksList } from './features/tasks/tasks-list/tasks-list.component';
import { TaskCreate } from './features/tasks/task-create/task-create.component';
import { Layout } from './shared/layout/layout.component';
import { TaskEdit } from './features/tasks/task-edit/task-edit.component';

export const routes: Routes = [

  {path: 'register', component: Register},
  {path: 'login', component: Login},
  {path: '', component: Layout, canActivate: [authGuard], children: [
    {path: 'subjects', component: SubjectsList},
    {path: 'subjects/new', component: SubjectCreate},
    {path: 'subjects/:id/edit', component: SubjectEdit},
    {path: 'tasks', component: TasksList},
    {path: 'tasks/new', component: TaskCreate},
    {path: 'tasks/:id/edit', component: TaskEdit},
    {path: '', pathMatch: 'full', redirectTo: 'register'},
    {path: '**', redirectTo: 'register'}
  ]
  }
];
