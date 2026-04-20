import { Routes } from '@angular/router';
import { Login } from './login/login';
import { HomeComponent } from './homeComponent/homeComponent';
import { Categorias } from './categorias/categorias';
import { CadastroCategoria } from './categorias/cadastroCategoria/cadastroCategoria';
import { EditarCategoria } from './categorias/editar-categoria/editar-categoria';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: HomeComponent },

  { path: 'categorias', component: Categorias },
  { path: 'categorias/cadastro', component: CadastroCategoria },
  { path: 'categorias/editar/:id', component: EditarCategoria },

  { path: 'relatorios', component: relatorios },
];
