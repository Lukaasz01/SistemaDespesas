import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { SidebarMenu } from '../../sidebar-menu/sidebar-menu';
import { CategoriasService } from '../categorias.service';

type CategoriaCriada = {
  nome: string;
  descricao: string;
  orcamentoMensal: number | null;
  icone: string;
  cor: string;
};

const naoEspacosValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const valor = typeof control.value === 'string' ? control.value.trim() : '';
  return valor.length > 0 ? null : { whitespace: true };
};

@Component({
  selector: 'app-cadastro-categoria',
  imports: [CommonModule, ReactiveFormsModule, RouterLink, SidebarMenu],
  templateUrl: './cadastroCategoria.html',
  styleUrl: './cadastroCategoria.css',
})
export class CadastroCategoria {
  private readonly fb = inject(FormBuilder);
  private readonly categoriasService = inject(CategoriasService);
  private readonly router = inject(Router);

  nomeUsuario = sessionStorage.getItem('nomeUsuario') ?? 'Usuario';
  salvando = false;
  mensagem = '';
  erro = '';
  menuAberto = false;

  iconeSelecionado = 'bi-cart3';
  corSelecionada = '#0072ff';

  categoriasCriadas: CategoriaCriada[] = [];

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

  get categoriaControl(): AbstractControl {
    return this.categoriaForm.controls.categoria;
  }

  get descricaoControl(): AbstractControl {
    return this.categoriaForm.controls.descricao;
  }

  get valorControl(): AbstractControl {
    return this.categoriaForm.controls.valor;
  }

  get tituloPreview(): string {
    return this.textoLimpo(this.categoriaControl.value) || 'Nova Categoria';
  }

  get descricaoPreview(): string {
    return this.textoLimpo(this.descricaoControl.value) || 'Sem descricao cadastrada';
  }

  get corPreviewSuave(): string {
    return this.hexToRgba(this.corSelecionada, 0.1);
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

  corSuave(cor: string): string {
    return this.hexToRgba(cor, 0.1);
  }

  salvarCategoria(): void {
    if (this.salvando) {
      return;
    }

    this.mensagem = '';
    this.erro = '';

    if (this.categoriaForm.invalid) {
      this.categoriaForm.markAllAsTouched();
      this.erro = 'Corrija os campos destacados antes de salvar.';
      return;
    }

    const categoria = this.textoLimpo(this.categoriaControl.value);
    const descricao = this.textoLimpo(this.descricaoControl.value);
    const valor = this.normalizarValorMonetario(this.valorControl.value);

    if (!categoria || !descricao || valor === null) {
      this.erro = 'Preencha nome, descricao e valor da categoria.';
      return;
    }

    this.salvando = true;

    this.categoriasService.criarCategoria({
      categoria,
      descricao,
      valor,
    }).subscribe({
      next: () => {
        this.categoriasCriadas.unshift({
          nome: categoria,
          descricao,
          orcamentoMensal: valor,
          icone: this.iconeSelecionado,
          cor: this.corSelecionada,
        });
        this.mensagem = 'Categoria cadastrada com sucesso.';
        this.categoriaForm.reset({
          categoria: '',
          descricao: '',
          valor: null,
        });
        this.iconeSelecionado = 'bi-cart3';
        this.corSelecionada = '#0072ff';
        void this.router.navigate(['/categorias']);
      },
      error: (erro: { error?: { erro?: string } }) => {
        console.error('Erro ao cadastrar categoria:', erro);
        this.erro = erro?.error?.erro || 'Nao foi possivel cadastrar a categoria.';
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

  private hexToRgba(hex: string, alpha: number): string {
    const semHash = hex.replace('#', '');
    const valor = Number.parseInt(semHash, 16);
    const r = (valor >> 16) & 255;
    const g = (valor >> 8) & 255;
    const b = valor & 255;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
}
