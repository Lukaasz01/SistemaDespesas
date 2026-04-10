import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

type TipoDespesa = 'fixa' | 'variavel' | 'essencial' | 'lazer';

type Categoria = {
  nome: string;
  tipoDespesa: TipoDespesa;
  orcamentoMensal: number | null;
  icone: string;
  cor: string;
};

@Component({
  selector: 'app-cadastro-categoria',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './cadastroCategoria.html',
  styleUrl: './cadastroCategoria.css',
})
export class CadastroCategoria {
  menuAberto = false;
  nome = '';
  tipoDespesa: TipoDespesa = 'fixa';
  orcamentoMensal: number | null = null;
  iconeSelecionado = 'bi-cart3';
  corSelecionada = '#0072ff';

  mensagem = '';
  erro = '';
  categoriasCriadas: Categoria[] = [];

  readonly opcoesIcones = [
    'bi-cart3',
    'bi-house-door',
    'bi-car-front',
    'bi-heart-pulse',
    'bi-mortarboard',
    'bi-controller',
    'bi-airplane',
    'bi-plug',
    'bi-shop',
    'bi-gift',
    'bi-wrench',
    'bi-phone',
  ];

  readonly opcoesCores = [
    '#0072ff',
    '#dc3545',
    '#198754',
    '#6f42c1',
    '#fd7e14',
    '#ffc107',
    '#20c997',
    '#e83e8c',
  ];

  toggleSidebar() {
    this.menuAberto = !this.menuAberto;
  }

  selecionarIcone(icone: string) {
    this.iconeSelecionado = icone;
  }

  selecionarCor(cor: string) {
    this.corSelecionada = cor;
  }

  get tituloPreview() {
    return this.nome.trim() || 'Nova Categoria';
  }

  get tipoPreview() {
    const tipos: Record<TipoDespesa, string> = {
      fixa: 'Despesa Fixa',
      variavel: 'Despesa Variavel',
      essencial: 'Essencial',
      lazer: 'Lazer / Estilo de Vida',
    };
    return tipos[this.tipoDespesa];
  }

  get corPreviewSuave() {
    return this.corSuave(this.corSelecionada);
  }

  corSuave(cor: string) {
    return this.hexToRgba(cor, 0.1);
  }

  formatarMoeda(valor: number | null) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor ?? 0);
  }

  salvarCategoria() {
    this.mensagem = '';
    this.erro = '';

    const nomeLimpo = this.nome.trim();
    if (!nomeLimpo) {
      this.erro = 'Informe o nome da categoria.';
      return;
    }

    if (this.orcamentoMensal !== null && this.orcamentoMensal < 0) {
      this.erro = 'O orcamento mensal nao pode ser negativo.';
      return;
    }

    const novaCategoria: Categoria = {
      nome: nomeLimpo,
      tipoDespesa: this.tipoDespesa,
      orcamentoMensal: this.orcamentoMensal,
      icone: this.iconeSelecionado,
      cor: this.corSelecionada,
    };

    this.categoriasCriadas.unshift(novaCategoria);
    this.mensagem = 'Categoria cadastrada com sucesso.';
    this.limparFormulario();

    // Proximo passo: trocar esta persistencia local por chamada ao endpoint do Spring.
  }

  private limparFormulario() {
    this.nome = '';
    this.tipoDespesa = 'fixa';
    this.orcamentoMensal = null;
    this.iconeSelecionado = 'bi-cart3';
    this.corSelecionada = '#0072ff';
  }

  private hexToRgba(hex: string, alpha: number) {
    const semHash = hex.replace('#', '');
    const valor = Number.parseInt(semHash, 16);
    const r = (valor >> 16) & 255;
    const g = (valor >> 8) & 255;
    const b = valor & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
