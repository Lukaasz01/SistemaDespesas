import { Routes } from '@angular/router';
import { Login } from './login/login';
import { HomeComponent } from './homeComponent/homeComponent';
import { Categorias } from './categorias/categorias';
import { CadastroCategoria } from './categorias/cadastroCategoria/cadastroCategoria';
import { EditarCategoria } from './categorias/editar-categoria/editar-categoria';
import { Relatorios } from './relatorios/relatorios';
import { Financas } from './financas/financas';
import { Configuracoes } from './configuracoes/configuracoes';
import { PaginaUsuario } from './pagina-usuario/pagina-usuario';

export const routes: Routes = [
// Rotas Genéricas
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: Login },
  { path: 'home', component: HomeComponent },

// Rotas de Categorias
  { path: 'categorias', component: Categorias },
  { path: 'categorias/cadastro', component: CadastroCategoria },
  { path: 'categorias/editar/:id', component: EditarCategoria },

// Rotas de Relatorios
  { path: 'relatorios', component: Relatorios },

// Rotas de Finanças
  { path: 'financas', component: Financas },

// Rotas para Configurações
  { path: 'configuracoes', component: Configuracoes },

// Rotas para página de usuário
  { path: 'pagina-usuario', component: PaginaUsuario },
];
