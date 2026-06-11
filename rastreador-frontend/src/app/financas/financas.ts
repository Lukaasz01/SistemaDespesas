import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { forkJoin } from 'rxjs';

import { SidebarMenu } from '../sidebar-menu/sidebar-menu';
import { CategoriaApi, DespesaApi, FinancasService } from './financas.service';

type DespesaResumo = {
  id: number;
  nome: string;
  categoria: string;
  descricao: string;
  data: string;
  valor: number;
  icone: string;
};

type CategoriaGasto = {
  id: number;
  nome: string;
  limite: number;
  gasto: number;
  quantidade: number;
  percentual: number;
  restante: number;
  cor: string;
};

@Component({
  selector: 'app-financas',
  imports: [CommonModule, SidebarMenu],
  templateUrl: './financas.html',
  styleUrl: './financas.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class Financas implements OnInit {
  private readonly financasService = inject(FinancasService);

  menuAberto = false;
  carregando = signal(true);
  erroCarregamento = signal('');
  periodoSelecionado = signal(this.iniciarMesAtual());
  periodoAtual = signal('');
  despesas = signal<DespesaResumo[]>([]);
  categoriasGasto = signal<CategoriaGasto[]>([]);
  totalGasto = signal(0);
  quantidadeLancamentos = signal(0);
  mediaDespesa = signal(0);
  maiorDespesa = signal<DespesaResumo | null>(null);

  private despesasBase: DespesaApi[] = [];
  private categoriasBase: CategoriaApi[] = [];

  private readonly coresCategoria = [
    '#0d6efd',
    '#198754',
    '#fd7e14',
    '#6f42c1',
    '#dc3545',
    '#20c997',
  ];

  ngOnInit(): void {
    this.periodoAtual.set(this.formatarPeriodo(this.periodoSelecionado()));
    this.carregarDados();
  }

  toggleMenu(): void {
    this.menuAberto = !this.menuAberto;
  }

  mesAnterior(): void {
    this.navegarMes(-1);
  }

  mesSeguinte(): void {
    this.navegarMes(1);
  }

  formatarMoeda(valor: number): string {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(valor);
  }

  private carregarDados(): void {
    this.carregando.set(true);
    this.erroCarregamento.set('');

    forkJoin({
      despesas: this.financasService.listarDespesas(),
      categorias: this.financasService.listarCategorias(),
    }).subscribe({
      next: ({ despesas, categorias }) => {
        this.despesasBase = Array.isArray(despesas) ? despesas : [];
        this.categoriasBase = Array.isArray(categorias) ? categorias : [];
        this.atualizarVisao();
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar finanças:', erro);
        this.erroCarregamento.set('Nao foi possivel carregar os gastos reais do banco.');
        this.carregando.set(false);
      },
    });
  }

  private atualizarVisao(): void {
    const referencia = this.periodoSelecionado();
    const despesasDoPeriodo = this.despesasBase.filter((despesa) => this.ehDoPeriodo(despesa.data, referencia));
    const despesasResumo = despesasDoPeriodo
      .slice()
      .sort((a, b) => this.compararDatas(b.data, a.data))
      .map((despesa) => ({
        id: despesa.id,
        nome: this.removerTextoVazio(despesa.nome, 'Despesa sem nome'),
        categoria: this.removerTextoVazio(despesa.categoria, 'Sem categoria'),
        descricao: this.removerTextoVazio(despesa.descricao, 'Sem descricao cadastrada'),
        data: this.formatarDataResumo(despesa.data),
        valor: this.comoNumero(despesa.valor),
        icone: this.obterIconeCategoria(despesa.categoria ?? despesa.nome ?? despesa.descricao ?? ''),
      }));

    const categoriasAgrupadas = this.agruparGastosPorCategoria(despesasDoPeriodo);
    const despesasTotal = despesasDoPeriodo.reduce((total, despesa) => total + this.comoNumero(despesa.valor), 0);
    const quantidadeLancamentos = despesasDoPeriodo.length;
    const mediaDespesa = quantidadeLancamentos > 0 ? despesasTotal / quantidadeLancamentos : 0;
    const maiorDespesa = despesasResumo.reduce<DespesaResumo | null>((maior, despesa) => {
      if (!maior) {
        return despesa;
      }

      return despesa.valor > maior.valor ? despesa : maior;
    }, null);

    this.despesas.set(despesasResumo);
    this.categoriasGasto.set(categoriasAgrupadas);
    this.totalGasto.set(despesasTotal);
    this.quantidadeLancamentos.set(quantidadeLancamentos);
    this.mediaDespesa.set(mediaDespesa);
    this.maiorDespesa.set(maiorDespesa);
    this.periodoAtual.set(this.formatarPeriodo(referencia));
  }

  private navegarMes(delta: number): void {
    const atual = this.periodoSelecionado();
    const proximo = new Date(atual.getFullYear(), atual.getMonth() + delta, 1);
    this.periodoSelecionado.set(proximo);
    this.atualizarVisao();
  }

  private agruparGastosPorCategoria(despesas: DespesaApi[]): CategoriaGasto[] {
    const grupos = new Map<string, CategoriaGasto>();

    despesas.forEach((despesa, indice) => {
      const nome = this.removerTextoVazio(despesa.categoria, 'Sem categoria');
      const chave = this.normalizarTexto(nome);
      const valor = this.comoNumero(despesa.valor);
      const categoriaBase = this.categoriasBase.find((categoria) => this.normalizarTexto(categoria.categoria) === chave);
      const limite = this.comoNumero(categoriaBase?.valor ?? 0);
      const existente = grupos.get(chave);

      if (existente) {
        existente.gasto += valor;
        existente.quantidade += 1;
        existente.percentual = existente.limite > 0 ? Math.min(100, (existente.gasto / existente.limite) * 100) : 0;
        existente.restante = Math.max(0, existente.limite - existente.gasto);
        return;
      }

      const gastoInicial = valor;
      const limiteInicial = limite;

      grupos.set(chave, {
        id: categoriaBase?.id ?? indice + 1,
        nome,
        limite: limiteInicial,
        gasto: gastoInicial,
        quantidade: 1,
        percentual: limiteInicial > 0 ? Math.min(100, (gastoInicial / limiteInicial) * 100) : 0,
        restante: Math.max(0, limiteInicial - gastoInicial),
        cor: this.obterCorCategoria(indice),
      });
    });

    return Array.from(grupos.values()).sort((a, b) => b.gasto - a.gasto);
  }

  private comoNumero(valor: number | string | null): number {
    if (typeof valor === 'number') {
      return valor;
    }

    if (typeof valor === 'string') {
      const normalizado = valor.replace(/\./g, '').replace(',', '.');
      const numero = Number(normalizado);
      return Number.isFinite(numero) ? numero : 0;
    }

    return 0;
  }

  private ehDoPeriodo(data: string | null, referencia: Date): boolean {
    if (!data) {
      return false;
    }

    const dataDespesa = new Date(`${data}T12:00:00`);
    if (Number.isNaN(dataDespesa.getTime())) {
      return false;
    }

    return dataDespesa.getFullYear() === referencia.getFullYear() && dataDespesa.getMonth() === referencia.getMonth();
  }

  private compararDatas(dataA: string | null, dataB: string | null): number {
    const data1 = dataA ? new Date(`${dataA}T12:00:00`).getTime() : 0;
    const data2 = dataB ? new Date(`${dataB}T12:00:00`).getTime() : 0;
    return data1 - data2;
  }

  private formatarDataResumo(data: string | null): string {
    if (!data) {
      return 'Sem data';
    }

    const dataDespesa = new Date(`${data}T12:00:00`);
    if (Number.isNaN(dataDespesa.getTime())) {
      return 'Sem data';
    }

    const hoje = new Date();
    const ontem = new Date();
    ontem.setDate(ontem.getDate() - 1);

    if (this.ehMesmaData(dataDespesa, hoje)) {
      return 'Hoje';
    }

    if (this.ehMesmaData(dataDespesa, ontem)) {
      return 'Ontem';
    }

    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
    }).format(dataDespesa);
  }

  private ehMesmaData(a: Date, b: Date): boolean {
    return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
  }

  private iniciarMesAtual(): Date {
    const hoje = new Date();
    return new Date(hoje.getFullYear(), hoje.getMonth(), 1);
  }

  private formatarPeriodo(data: Date): string {
    return new Intl.DateTimeFormat('pt-BR', {
      month: 'long',
      year: 'numeric',
    }).format(data);
  }

  private removerTextoVazio(valor: string | null | undefined, fallback: string): string {
    const texto = valor?.trim();
    return texto ? texto : fallback;
  }

  private normalizarTexto(texto: string | null | undefined): string {
    return (texto ?? '')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toLowerCase();
  }

  private obterCorCategoria(indice: number): string {
    return this.coresCategoria[indice % this.coresCategoria.length];
  }

  private obterIconeCategoria(nome: string): string {
    const texto = this.normalizarTexto(nome);

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

    if (texto.includes('assin') || texto.includes('stream') || texto.includes('servic')) {
      return 'bi bi-tv';
    }

    return 'bi bi-tag';
  }
}
