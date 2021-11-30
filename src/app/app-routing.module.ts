import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TodoComponent } from './todo/todo.component';
import { TodoAddComponent } from './todo-add/todo-add.component';
import { TodoEditComponent } from './todo-edit/todo-edit.component';
import { TodoRegistroComponent } from './todo-registro/todo-registro.component';
import { ReporteComponent } from './reporte/reporte.component';

const routes: Routes = [
  {
    path: '',
    component: TodoComponent,
    data: { title: 'List of todos' }
  },
  {
    path: 'todo/add',
    component: TodoAddComponent,
    data: { title: 'Add todo' }
  },
  {
    path: 'todo/edit/:id',
    component: TodoEditComponent,
    data: { title: 'Edit todo' }
  },
  {
    path: 'todo/registro/:profesorId',
    component: TodoRegistroComponent,
    data: { title: 'Registro' }
  },
  { path: 'reporte', 
    component: ReporteComponent 
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
