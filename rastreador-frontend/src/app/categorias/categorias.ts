import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SidebarMenu } from '../sidebar-menu/sidebar-menu';

@Component({
  selector: 'app-categorias',
  imports: [RouterLink, RouterLinkActive, SidebarMenu],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias {
  menuAberto: boolean = false;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }
}
