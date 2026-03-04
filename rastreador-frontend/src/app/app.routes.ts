import { Routes } from '@angular/router';
import { Login } from './login/login';
import { Home } from './home/home';
import { Categorias } from './categorias/categorias';

export const routes: Routes = [
    {path : 'login', component : Login},
    {path : 'home', component : Home},
    {path : 'categorias', component : Categorias},
];
