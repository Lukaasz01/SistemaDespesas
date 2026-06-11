import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';

import { SidebarMenu } from '../sidebar-menu/sidebar-menu';

interface CategoriaApi {
  id: number;
  categoria: string | null;
  descricao: string | null;
  valor: number | string | null;
}

interface DespesaApi {
  id: number;
  categoria: string | null;
  descricao: string | null;
  valor: number | string | null;
  data: string | null;
  nome: string | null;
}

interface CategoriaResumo {
  id: number;
  nome: string;
  descricao: string;
  orcamento: number;
  quantidade: number;
  lancamentos: number;
  gasto: number;
  restante: number;
  percentual: number;
  cor: string;
  icone: string;
}

interface DespesaRecente {
  id: number;
  descricao: string;
  categoria: string;
  data: string;
  valor: number;
  icone: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, SidebarMenu],
  templateUrl: './homeComponent.html',
  styleUrl: './homeComponent.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent implements OnInit {
  private readonly http = inject(HttpClient);

  menuAberto = false;
  nomeUsuario = signal('Usuário');
  carregando = signal(true);
  erroCarregamento = signal('');
  periodoAtual = signal('');
  periodoSelecionado = signal(this.iniciarMesAtual());
  totalGasto = signal(0);
  limiteTotal = signal(0);
  restanteTotal = signal(0);
  percentualUso = signal(0);
  diasDoPeriodo = signal(0);
  gastoIdealDia = signal(0);
  categoriasResumo = signal<CategoriaResumo[]>([]);
  despesasRecentes = signal<DespesaRecente[]>([]);

  private categoriasBase: CategoriaApi[] = [];
  private despesasBase: DespesaApi[] = [];

  private readonly coresCategoria = [
    '#0d6efd',
    '#198754',
    '#fd7e14',
    '#6f42c1',
    '#dc3545',
    '#20c997',
  ];

  ngOnInit(): void {
    this.nomeUsuario.set(sessionStorage.getItem('nomeUsuario') ?? 'Usuário');
    this.periodoAtual.set(this.formatarPeriodo(this.periodoSelecionado()));
    this.carregarDashboard();
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

  get resumoDestaque(): string {
    const categorias = this.categoriasResumo();
    if (!categorias.length) {
      return 'Sem categorias cadastradas';
    }

    const emRisco = categorias.filter((categoria) => categoria.percentual >= 80);
    if (!emRisco.length) {
      return 'Nenhuma categoria perto do limite';
    }

    const nomes = emRisco.slice(0, 2).map((categoria) => categoria.nome).join(', ');
    return `Atenção em ${nomes}`;
  }

  private carregarDashboard(): void {
    this.carregando.set(true);
    this.erroCarregamento.set('');

    forkJoin({
      categorias: this.http.get<CategoriaApi[]>('http://localhost:9000/categorias'),
      despesas: this.http.get<DespesaApi[]>('http://localhost:9000/despesas'),
    }).subscribe({
      next: ({ categorias, despesas }) => {
        this.categoriasBase = Array.isArray(categorias) ? categorias : [];
        this.despesasBase = Array.isArray(despesas) ? despesas : [];
        this.atualizarDashboard();
        this.carregando.set(false);
      },
      error: (erro) => {
        console.error('Erro ao carregar dashboard:', erro);
        this.erroCarregamento.set('Nao foi possivel carregar os dados reais do painel.');
        this.carregando.set(false);
      },
    });
  }

  private atualizarDashboard(): void {
    const referencia = this.periodoSelecionado();
    const despesasDoPeriodo = this.despesasBase.filter((despesa) => this.ehDoPeriodo(despesa.data, referencia));
    const categoriasAgrupadas = this.agruparCategorias(this.categoriasBase);

    const categoriasResumo = categoriasAgrupadas
      .map((categoria, indice) => {
        const gasto = despesasDoPeriodo
          .filter((despesa) => this.normalizarTexto(despesa.categoria) === this.normalizarTexto(categoria.nome))
          .reduce((total, despesa) => total + this.comoNumero(despesa.valor), 0);
        const lancamentos = despesasDoPeriodo.filter((despesa) => this.normalizarTexto(despesa.categoria) === this.normalizarTexto(categoria.nome)).length;
        const restante = Math.max(0, categoria.orcamento - gasto);
        const percentual = categoria.orcamento > 0 ? Math.min(100, (gasto / categoria.orcamento) * 100) : 0;

        return {
          id: categoria.id,
          nome: categoria.nome,
          descricao: categoria.descricao,
          orcamento: categoria.orcamento,
          quantidade: categoria.quantidade,
          lancamentos,
          gasto,
          restante,
          percentual,
          cor: this.obterCorCategoria(indice),
          icone: this.obterIconeCategoria(categoria.nome),
        };
      })
      .sort((a, b) => b.percentual - a.percentual);

    const totalGasto = despesasDoPeriodo.reduce((total, despesa) => total + this.comoNumero(despesa.valor), 0);
    const limiteTotal = categoriasResumo.reduce((total, categoria) => total + categoria.orcamento, 0);
    const restanteTotal = Math.max(0, limiteTotal - totalGasto);
    const percentualUso = limiteTotal > 0 ? Math.min(100, (totalGasto / limiteTotal) * 100) : 0;
    const diasDoPeriodo = this.calcularDiasNoPeriodo(referencia);
    const gastoIdealDia = diasDoPeriodo > 0 ? restanteTotal / diasDoPeriodo : 0;

    const despesasRecentes = despesasDoPeriodo
      .slice()
      .sort((a, b) => this.compararDatas(b.data, a.data))
      .slice(0, 4)
      .map((despesa) => ({
        id: despesa.id,
        descricao: this.removerTextoVazio(despesa.nome ?? despesa.descricao, 'Despesa sem nome'),
        categoria: this.removerTextoVazio(despesa.categoria, 'Sem categoria'),
        data: this.formatarDataResumo(despesa.data),
        valor: this.comoNumero(despesa.valor),
        icone: this.obterIconeCategoria(despesa.categoria ?? despesa.descricao ?? ''),
      }));

    this.categoriasResumo.set(categoriasResumo);
    this.despesasRecentes.set(despesasRecentes);
    this.totalGasto.set(totalGasto);
    this.limiteTotal.set(limiteTotal);
    this.restanteTotal.set(restanteTotal);
    this.percentualUso.set(percentualUso);
    this.diasDoPeriodo.set(diasDoPeriodo);
    this.gastoIdealDia.set(gastoIdealDia);
    this.periodoAtual.set(this.formatarPeriodo(referencia));
  }

  private navegarMes(delta: number): void {
    const atual = this.periodoSelecionado();
    const proximo = new Date(atual.getFullYear(), atual.getMonth() + delta, 1);
    this.periodoSelecionado.set(proximo);
    this.atualizarDashboard();
  }

  private agruparCategorias(categorias: CategoriaApi[]): Array<{
    id: number;
    nome: string;
    descricao: string;
    orcamento: number;
    quantidade: number;
  }> {
    const grupos = new Map<string, {
      id: number;
      nome: string;
      descricao: string;
      orcamento: number;
      quantidade: number;
    }>();

    categorias.forEach((categoria) => {
      const nome = this.removerTextoVazio(categoria.categoria, 'Categoria sem nome');
      const chave = this.normalizarTexto(nome);
      const existente = grupos.get(chave);
      const descricao = this.removerTextoVazio(categoria.descricao, 'Sem descrição cadastrada');
      const orcamento = this.comoNumero(categoria.valor);

      if (existente) {
        existente.orcamento += orcamento;
        existente.quantidade += 1;
        if (existente.descricao === 'Sem descrição cadastrada' && descricao !== 'Sem descrição cadastrada') {
          existente.descricao = descricao;
        }
        return;
      }

      grupos.set(chave, {
        id: categoria.id,
        nome,
        descricao,
        orcamento,
        quantidade: 1,
      });
    });

    return Array.from(grupos.values());
  }

  private comoNumero(valor: number | string | null): number {
    if (typeof valor === 'number') {
      return valor;
    }

    if (typeof valor === 'string') {
      const normalizado = valor.replace(',', '.');
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

  private calcularDiasNoPeriodo(referencia: Date): number {
    return new Date(referencia.getFullYear(), referencia.getMonth() + 1, 0).getDate();
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

    return 'bi bi-tag';
  }
}
