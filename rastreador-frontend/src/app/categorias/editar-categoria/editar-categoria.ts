import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';

type TipoDespesa = 'fixa' | 'variavel' | 'essencial' | 'lazer';

type CategoriaEdicao = {
  id: number;
  nome: string;
  tipoDespesa: TipoDespesa;
  orcamentoMensal: number | null;
  icone: string;
  cor: string;
};

@Component({
  selector: 'app-editar-categoria',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './editar-categoria.html',
  styleUrl: './editar-categoria.css',
})
export class EditarCategoria implements OnInit {
  private readonly route = inject(ActivatedRoute);

  menuAberto = false;
  categoriaId: number | null = null;

  nome = '';
  tipoDespesa: TipoDespesa = 'fixa';
  orcamentoMensal: number | null = null;
  iconeSelecionado = 'bi-cart3';
  corSelecionada = '#0072ff';

  mensagem = '';
  erro = '';
  erroCarregamento = '';

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

  private readonly categoriasMock: Record<number, CategoriaEdicao> = {
    1: { id: 1, nome: 'Alimentacao', tipoDespesa: 'fixa', orcamentoMensal: 1000, icone: 'bi-cart3', cor: '#dc3545' },
    2: { id: 2, nome: 'Transporte', tipoDespesa: 'variavel', orcamentoMensal: 400, icone: 'bi-car-front', cor: '#0d6efd' },
    3: { id: 3, nome: 'Moradia', tipoDespesa: 'fixa', orcamentoMensal: null, icone: 'bi-house-door', cor: '#198754' },
    4: { id: 4, nome: 'Lazer', tipoDespesa: 'lazer', orcamentoMensal: 500, icone: 'bi-controller', cor: '#6f42c1' },
  };

  ngOnInit() {
    this.carregarCategoria();
  }

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
    return this.nome.trim() || 'Categoria sem nome';
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

  salvarAlteracoes() {
    this.mensagem = '';
    this.erro = '';

    if (this.erroCarregamento) {
      return;
    }

    const nomeLimpo = this.nome.trim();
    if (!nomeLimpo) {
      this.erro = 'Informe o nome da categoria.';
      return;
    }

    if (this.orcamentoMensal !== null && this.orcamentoMensal < 0) {
      this.erro = 'O orcamento mensal nao pode ser negativo.';
      return;
    }

    if (!this.categoriaId) {
      this.erro = 'Categoria invalida para edicao.';
      return;
    }

    this.categoriasMock[this.categoriaId] = {
      id: this.categoriaId,
      nome: nomeLimpo,
      tipoDespesa: this.tipoDespesa,
      orcamentoMensal: this.orcamentoMensal,
      icone: this.iconeSelecionado,
      cor: this.corSelecionada,
    };

    this.mensagem = 'Alteracoes salvas com sucesso.';

    // Proximo passo: substituir este mock por chamada PUT ao endpoint Spring.
  }

  private carregarCategoria() {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!Number.isFinite(id)) {
      this.erroCarregamento = 'ID de categoria invalido.';
      return;
    }

    const categoria = this.categoriasMock[id];

    if (!categoria) {
      this.erroCarregamento = 'Categoria nao encontrada para edicao.';
      return;
    }

    this.categoriaId = categoria.id;
    this.nome = categoria.nome;
    this.tipoDespesa = categoria.tipoDespesa;
    this.orcamentoMensal = categoria.orcamentoMensal;
    this.iconeSelecionado = categoria.icone;
    this.corSelecionada = categoria.cor;
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
