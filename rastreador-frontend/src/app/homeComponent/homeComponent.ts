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
export class HomeComponent { // Sugestão: renomear de App para HomeComponent
  // Gerenciamento de estado otimizado com Signals do Angular 17+
  currentMonth = signal('Março 2026');
  balance = signal(4250.00);
  income = signal(7500.00);
  expenses = signal(3250.00);

  // Mock de transações vindas da sua API Spring Boot (Page<Transaction>)
  transactions = signal<Transaction[]>([
    { id: '1', description: 'Supermercado Extra', amount: 450.50, type: 'expense', date: '10 Mar 2026', category: 'Alimentação' },
    { id: '2', description: 'Salário Tech Lead', amount: 7500.00, type: 'income', date: '05 Mar 2026', category: 'Salário' },
    { id: '3', description: 'Conta de Luz (Enel)', amount: 180.00, type: 'expense', date: '04 Mar 2026', category: 'Moradia' },
    { id: '4', description: 'Restaurante Outback', amount: 120.00, type: 'expense', date: '02 Mar 2026', category: 'Alimentação' },
    { id: '5', description: 'Uber Airport', amount: 85.50, type: 'expense', date: '01 Mar 2026', category: 'Transporte' },
  ]);

  // Agrupamentos que podem ser providos por uma query @Query no Spring Data JPA
  categories = signal<CategorySummary[]>([
    { name: 'Alimentação', amount: 570.50, color: 'bg-orange-500', percentage: 45 },
    { name: 'Moradia', amount: 180.00, color: 'bg-blue-500', percentage: 25 },
    { name: 'Transporte', amount: 85.50, color: 'bg-purple-500', percentage: 10 },
    { name: 'Assinaturas', amount: 100.00, color: 'bg-slate-400', percentage: 20 },
  ]);

  // Função utilitária para formatar o número como moeda brasileira (BRL)
  formatCurrency(value: number): string {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  }
}