import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';

import { SidebarMenu } from '../sidebar-menu/sidebar-menu';
import { CategoriaApi, CategoriasService } from './categorias.service';

type CategoriaCard = {
  id: number;
  nome: string;
  descricao: string;
  valor: number | null;
};

@Component({
  selector: 'app-categorias',
  imports: [RouterLink, SidebarMenu],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css'
})
export class Categorias implements OnInit {
  private readonly categoriasService = inject(CategoriasService);

  menuAberto = false;
  carregando = signal(true);
  erroCarregamento = signal('');
  categorias = signal<CategoriaCard[]>([]);

  private readonly coresCategoria = [
    '#dc3545',
    '#0d6efd',
    '#198754',
    '#6f42c1',
    '#fd7e14',
    '#20c997',
  ];

  ngOnInit(): void {
    this.carregarCategorias();
  }

  toggleMenu() {
    this.menuAberto = !this.menuAberto;
  }

  formatarMoeda(valor: number | null): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor ?? 0);
  }

  get totalCategorias(): number {
    return this.categorias().length;
  }

  get maiorCategoria(): CategoriaCard | null {
    if (!this.categorias().length) {
      return null;
    }

    return this.categorias().reduce((maior, categoria) => {
      const valorMaior = maior.valor ?? 0;
      const valorAtual = categoria.valor ?? 0;
      return valorAtual > valorMaior ? categoria : maior;
    });
  }

  get nomeMaiorCategoria(): string {
    return this.maiorCategoria?.nome ?? 'Sem categorias';
  }

  get valorMaiorCategoria(): string {
    return this.formatarMoeda(this.maiorCategoria?.valor ?? 0);
  }

  removerCategoria(id: number): void {
    const confirmou = window.confirm('Deseja excluir esta categoria?');

    if (!confirmou) {
      return;
    }

    this.categoriasService.removerCategoria(id).subscribe({
      next: () => {
        this.categorias.update((categorias) => categorias.filter((categoria) => categoria.id !== id));
      },
      error: (erro) => {
        console.error('Erro ao excluir categoria:', erro);
        alert('Nao foi possivel excluir a categoria.');
      },
    });
  }

  obterCorCategoria(indice: number): string {
    return this.coresCategoria[indice % this.coresCategoria.length];
  }

  obterCorSuave(indice: number): string {
    return this.hexParaRgba(this.obterCorCategoria(indice), 0.1);
  }

  obterIconeCategoria(nome: string): string {
    const textoNormalizado = this.normalizarTexto(nome);

    if (textoNormalizado.includes('aliment') || textoNormalizado.includes('mercad') || textoNormalizado.includes('comid')) {
      return 'bi bi-cart3';
    }

    if (textoNormalizado.includes('transp') || textoNormalizado.includes('carro') || textoNormalizado.includes('uber')) {
      return 'bi bi-car-front';
    }

    if (textoNormalizado.includes('morad') || textoNormalizado.includes('casa') || textoNormalizado.includes('aluguel')) {
      return 'bi bi-house-door';
    }

    if (textoNormalizado.includes('lazer') || textoNormalizado.includes('game') || textoNormalizado.includes('cinem')) {
      return 'bi bi-controller';
    }

    if (textoNormalizado.includes('saud') || textoNormalizado.includes('medic') || textoNormalizado.includes('farm')) {
      return 'bi bi-heart-pulse';
    }

    if (textoNormalizado.includes('educ') || textoNormalizado.includes('curso') || textoNormalizado.includes('escol')) {
      return 'bi bi-mortarboard';
    }

    return 'bi bi-tag';
  }

  private carregarCategorias(): void {
    this.carregando.set(true);
    this.erroCarregamento.set('');

    this.categoriasService.listarCategorias().subscribe({
      next: (categorias) => {
        const lista = Array.isArray(categorias) ? categorias : [];
        this.categorias.set(lista.map((categoria: CategoriaApi) => this.mapearCategoria(categoria)));
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar categorias:', erro);
        this.categorias.set([]);
        this.erroCarregamento.set(erro?.status === 0
          ? 'Nao foi possivel comunicar com a API de categorias.'
          : 'Nao foi possivel carregar suas categorias no momento.');
        this.carregando.set(false);
      },
    });
  }

  private mapearCategoria(categoria: CategoriaApi): CategoriaCard {
    const nomeCategoria = categoria.categoria?.trim() || 'Categoria sem nome';

    return {
      id: categoria.id,
      nome: nomeCategoria,
      descricao: categoria.descricao?.trim() || 'Sem descricao cadastrada',
      valor: categoria.valor,
    };
  }

  private normalizarTexto(texto: string | null | undefined): string {
    return (texto ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private hexParaRgba(hex: string, alpha: number): string {
    const semHash = hex.replace('#', '');
    const valor = Number.parseInt(semHash, 16);
    const r = (valor >> 16) & 255;
    const g = (valor >> 8) & 255;
    const b = valor & 255;

    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
