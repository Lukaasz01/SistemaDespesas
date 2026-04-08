import { Component, ChangeDetectionStrategy, signal } from '@angular/core';

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
  imports: [], // Se estiver usando Angular 17+, componentes já podem ser standalone
  templateUrl: './homeComponent.html',
  styleUrl: './homeComponent.css', // CORREÇÃO: Usar styleUrl (singular) para arquivos externos
  changeDetection: ChangeDetectionStrategy.OnPush, // Adicionado para otimizar os Signals
})
export class HomeComponent {

}
