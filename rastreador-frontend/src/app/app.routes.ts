import { Routes } from '@angular/router';

import { CadastroCategoria } from './categorias/cadastroCategoria/cadastroCategoria';
import { Categorias } from './categorias/categorias';
import { Configuracoes } from './configuracoes/configuracoes';
import { Financas } from './financas/financas';
import { HomeComponent } from './homeComponent/homeComponent';
import { Login } from './login/login';
import { PaginaUsuario } from './pagina-usuario/pagina-usuario';
import { Relatorios } from './relatorios/relatorios';
import { EditarCategoria } from './categorias/editar-categoria/editar-categoria';
import { authGuard, loginGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login, canActivate: [loginGuard] },
  { path: 'home', component: HomeComponent, canActivate: [authGuard] },
  { path: 'categorias', component: Categorias, canActivate: [authGuard] },
  { path: 'categorias/cadastro', component: CadastroCategoria, canActivate: [authGuard] },
  { path: 'categorias/editar/:id', component: EditarCategoria, canActivate: [authGuard] },
  { path: 'relatorios', component: Relatorios, canActivate: [authGuard] },
  { path: 'financas', component: Financas, canActivate: [authGuard] },
  { path: 'configuracoes', component: Configuracoes, canActivate: [authGuard] },
  { path: 'pagina-usuario', component: PaginaUsuario, canActivate: [authGuard] },
];
