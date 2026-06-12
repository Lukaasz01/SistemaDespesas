import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface DespesaApi {
  id: number;
  nome: string | null;
  categoria: string | null;
  descricao: string | null;
  valor: number | string | null;
  data: string | null;
}

export interface CategoriaApi {
  id: number;
  categoria: string | null;
  descricao: string | null;
  valor: number | string | null;
}

@Injectable({
  providedIn: 'root',
})
export class FinancasService {
  private readonly http = inject(HttpClient);
  private readonly despesasUrl = 'http://localhost:9000/despesas';
  private readonly categoriasUrl = 'http://localhost:9000/categorias';

  listarDespesas(): Observable<DespesaApi[]> {
    return this.http.get<DespesaApi[]>(this.despesasUrl);
  }

  listarCategorias(): Observable<CategoriaApi[]> {
    return this.http.get<CategoriaApi[]>(this.categoriasUrl);
  }
}
