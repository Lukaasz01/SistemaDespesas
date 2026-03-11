import { Routes } from '@angular/router';
import { Login } from './login/login';
import { HomeComponent } from './homeComponent/homeComponent';
import { Categorias } from './categorias/categorias';
import { CreateUser } from './create-user/create-user';

export const routes: Routes = [
    {path : 'login', component : Login},
    {path : 'home', component : HomeComponent},
    {path : 'categorias', component : Categorias},
    {path : 'create-user', component : CreateUser},
];
