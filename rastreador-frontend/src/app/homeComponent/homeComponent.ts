import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

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
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './homeComponent.html',
  styleUrl: './homeComponent.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  menuAberto: boolean = false;

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

}
