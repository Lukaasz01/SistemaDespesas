import { Component, ChangeDetectionStrategy, signal, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

import { SidebarMenu } from '../sidebar-menu/sidebar-menu';

interface Transaction {
  id: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

interface CategorySummary {
  name: string;
  amount: number;
  color: string;
  percentage: number;
}

@Component({
  selector: 'app-home',
  imports: [RouterLink, RouterLinkActive, SidebarMenu],
  templateUrl: './homeComponent.html',
  styleUrl: './homeComponent.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class HomeComponent implements OnInit {
  menuAberto: boolean = false;

  nomeUsuario = signal<string | null>('Carregando...');

  ngOnInit(): void {
    const nomeSalvo = sessionStorage.getItem('nomeUsuario');
    this.nomeUsuario.set(nomeSalvo);
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }
}
