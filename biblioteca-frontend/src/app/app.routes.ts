import { Routes } from '@angular/router';
import { BookListComponent } from './components/book-list/book-list.component';
import { BookFormComponent } from './components/book-form/book-form.component';

export const routes: Routes = [
  { path: '', redirectTo: '/libros', pathMatch: 'full' },
  { path: 'libros', component: BookListComponent },
  { path: 'libros/nuevo', component: BookFormComponent },
  { path: 'libros/editar/:id', component: BookFormComponent },
  { path: '**', redirectTo: '/libros' }
];

