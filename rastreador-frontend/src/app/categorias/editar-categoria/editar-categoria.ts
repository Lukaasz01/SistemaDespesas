import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { timeout } from 'rxjs';

import { SidebarMenu } from '../../sidebar-menu/sidebar-menu';
import { CategoriasService } from '../categorias.service';

const naoEspacosValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = typeof control.value === 'string' ? control.value.trim() : '';
  return valor.length > 0 ? null : { whitespace: true };
};

@Component({
  selector: 'app-editar-categoria',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarMenu],
  templateUrl: './editar-categoria.html',
  styleUrl: './editar-categoria.css',
})
export class EditarCategoria implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);
  private readonly categoriasService = inject(CategoriasService);

  menuAberto = false;
  carregando = true;
  categoriaId: number | null = null;
  mensagem = '';
  erro = '';
  erroCarregamento = '';
  salvando = false;

  iconeSelecionado = 'bi-cart3';
  corSelecionada = '#0072ff';
  nomeUsuario = sessionStorage.getItem('nomeUsuario') ?? 'Usuario';

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

  readonly categoriaForm = this.fb.group({
    categoria: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(60), naoEspacosValidator]],
    descricao: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(120), naoEspacosValidator]],
    valor: [null as number | null, [Validators.required, Validators.min(0), Validators.max(999999999)]],
  });

  get tituloPreview(): string {
    return this.textoLimpo(this.categoriaForm.controls.categoria.value) || 'Categoria sem nome';
  }

  get descricaoPreview(): string {
    return this.textoLimpo(this.categoriaForm.controls.descricao.value) || 'Sem descricao cadastrada';
  }

  get corPreviewSuave(): string {
    return this.hexToRgba(this.corSelecionada, 0.1);
  }

  ngOnInit(): void {
    this.carregarCategoria();
  }

  toggleSidebar(): void {
    this.menuAberto = !this.menuAberto;
  }

  selecionarIcone(icone: string): void {
    this.iconeSelecionado = icone;
  }

  selecionarCor(cor: string): void {
    this.corSelecionada = cor;
  }

  formatarMoeda(valor: number | null): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor ?? 0);
  }

  salvarAlteracoes(): void {
    this.mensagem = '';
    this.erro = '';

    if (this.categoriaForm.invalid || !this.categoriaId) {
      this.categoriaForm.markAllAsTouched();
      this.erro = this.categoriaId ? 'Corrija os campos antes de salvar.' : 'Categoria invalida para edicao.';
      return;
    }

    const categoria = this.textoLimpo(this.categoriaForm.controls.categoria.value);
    const descricao = this.textoLimpo(this.categoriaForm.controls.descricao.value);
    const valor = this.normalizarValorMonetario(this.categoriaForm.controls.valor.value);

    if (!categoria || !descricao || valor === null) {
      this.erro = 'Preencha nome, descricao e valor da categoria.';
      return;
    }

    this.salvando = true;

    this.categoriasService.atualizarCategoria(this.categoriaId, {
      categoria,
      descricao,
      valor,
    }).subscribe({
      next: () => {
        this.mensagem = 'Alteracoes salvas com sucesso.';
        void this.router.navigate(['/categorias']);
      },
      error: (erro: { error?: { erro?: string } }) => {
        console.error('Erro ao atualizar categoria:', erro);
        this.erro = erro?.error?.erro || 'Nao foi possivel salvar as alteracoes.';
        this.salvando = false;
      },
      complete: () => {
        this.salvando = false;
      },
    });
  }

  getMensagemErro(campo: 'categoria' | 'descricao' | 'valor'): string {
    const control = this.categoriaForm.controls[campo];

    if (!control.touched && !control.dirty) {
      return '';
    }

    if (control.hasError('required')) {
      return campo === 'valor'
        ? 'Informe o valor da categoria.'
        : `Informe ${campo === 'categoria' ? 'o nome' : 'a descricao'} da categoria.`;
    }

    if (control.hasError('whitespace')) {
      return campo === 'categoria'
        ? 'O nome da categoria nao pode conter apenas espacos.'
        : 'A descricao da categoria nao pode conter apenas espacos.';
    }

    if (control.hasError('minlength')) {
      return campo === 'categoria'
        ? 'O nome deve ter pelo menos 3 caracteres.'
        : 'A descricao deve ter pelo menos 3 caracteres.';
    }

    if (control.hasError('maxlength')) {
      return campo === 'categoria'
        ? 'O nome deve ter no maximo 60 caracteres.'
        : 'A descricao deve ter no maximo 120 caracteres.';
    }

    if (campo === 'valor' && control.hasError('min')) {
      return 'O valor nao pode ser negativo.';
    }

    return '';
  }

  private carregarCategoria(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!Number.isFinite(id)) {
      this.erroCarregamento = 'ID de categoria invalido.';
      this.carregando = false;
      return;
    }

    this.categoriaId = id;

    const categoriaCache = this.lerCacheCategoria(id);
    if (categoriaCache) {
      this.preencherFormulario(categoriaCache.nome, categoriaCache.descricao, categoriaCache.valor);
      this.corSelecionada = '#0072ff';
      this.iconeSelecionado = this.obterIconeCategoria(categoriaCache.nome);
      this.carregando = false;
    }

    this.categoriasService.buscarCategoriaPorId(id).pipe(timeout(10000)).subscribe({
      next: (categoria) => {
        this.categoriaId = categoria.id;
        this.preencherFormulario(categoria.categoria ?? '', categoria.descricao ?? '', categoria.valor ?? null);
        this.corSelecionada = '#0072ff';
        this.iconeSelecionado = this.obterIconeCategoria(categoria.categoria ?? '');
        this.carregando = false;
        sessionStorage.removeItem('categoria_edicao_cache');
      },
      error: (erro: { error?: { erro?: string } }) => {
        console.error('Erro ao carregar categoria:', erro);
        if (!categoriaCache) {
          this.erroCarregamento = erro?.error?.erro || 'Categoria nao encontrada para edicao.';
          this.carregando = false;
        }
      },
    });
  }

  private preencherFormulario(categoria: string, descricao: string, valor: number | null): void {
    this.categoriaForm.patchValue({
      categoria,
      descricao,
      valor,
    });
  }

  private lerCacheCategoria(id: number): { id: number; nome: string; descricao: string; valor: number | null } | null {
    const bruto = sessionStorage.getItem('categoria_edicao_cache');

    if (!bruto) {
      return null;
    }

    try {
      const cache = JSON.parse(bruto) as {
        id?: unknown;
        nome?: unknown;
        descricao?: unknown;
        valor?: unknown;
      };

      if (Number(cache.id) !== id) {
        return null;
      }

      const nome = typeof cache.nome === 'string' ? cache.nome.trim() : '';
      const descricao = typeof cache.descricao === 'string' ? cache.descricao.trim() : '';
      const valorNumero = typeof cache.valor === 'number' ? cache.valor : Number(cache.valor);

      return {
        id,
        nome,
        descricao,
        valor: Number.isFinite(valorNumero) ? valorNumero : null,
      };
    } catch {
      return null;
    }
  }

  private textoLimpo(valor: unknown): string {
    return typeof valor === 'string' ? valor.trim() : '';
  }

  private normalizarValorMonetario(valor: unknown): number | null {
    if (typeof valor === 'number') {
      return Number.isFinite(valor) ? Number(valor.toFixed(2)) : null;
    }

    if (typeof valor === 'string') {
      const normalizado = valor.trim().replace(/\./g, '').replace(',', '.');
      const numero = Number(normalizado);
      return Number.isFinite(numero) ? Number(numero.toFixed(2)) : null;
    }

    return null;
  }

  private obterIconeCategoria(nome: string): string {
    const texto = (nome ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();

    if (texto.includes('aliment') || texto.includes('mercad') || texto.includes('comid')) {
      return 'bi bi-cart3';
    }

    if (texto.includes('transp') || texto.includes('carro') || texto.includes('uber')) {
      return 'bi bi-car-front';
    }

    if (texto.includes('morad') || texto.includes('casa') || texto.includes('aluguel')) {
      return 'bi bi-house-door';
    }

    if (texto.includes('saud') || texto.includes('medic') || texto.includes('farm')) {
      return 'bi bi-heart-pulse';
    }

    if (texto.includes('educ') || texto.includes('curso') || texto.includes('escol')) {
      return 'bi bi-mortarboard';
    }

    if (texto.includes('lazer') || texto.includes('game') || texto.includes('cinem')) {
      return 'bi bi-controller';
    }

    return 'bi bi-tag';
  }

  private hexToRgba(hex: string, alpha: number): string {
    const semHash = hex.replace('#', '');
    const valor = Number.parseInt(semHash, 16);
    const r = (valor >> 16) & 255;
    const g = (valor >> 8) & 255;
    const b = valor & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
