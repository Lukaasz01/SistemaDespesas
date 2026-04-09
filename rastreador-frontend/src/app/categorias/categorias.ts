import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-categorias',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})

export class Categorias {
  menuAberto: boolean = false;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }
}
