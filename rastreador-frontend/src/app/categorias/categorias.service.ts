import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';

export interface CategoriaApi {
  id: number;
  categoria: string | null;
  descricao: string | null;
  valor: number | null;
}

export interface CriarCategoriaPayload {
  categoria: string;
  descricao: string;
  valor: number | null;
}

export interface AtualizarCategoriaPayload extends CriarCategoriaPayload {}

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = 'http://localhost:9000/categorias';

  listarCategorias(): Observable<CategoriaApi[]> {
    return this.http.get<CategoriaApi[]>(this.apiUrl);
  }

  criarCategoria(payload: CriarCategoriaPayload): Observable<CategoriaApi> {
    return this.http.post<CategoriaApi>(this.apiUrl, payload);
  }

  buscarCategoriaPorId(id: number): Observable<CategoriaApi> {
    return this.http.get<CategoriaApi>(`${this.apiUrl}/${id}`);
  }

  atualizarCategoria(id: number, payload: AtualizarCategoriaPayload): Observable<CategoriaApi> {
    return this.http.put<CategoriaApi>(`${this.apiUrl}/${id}`, payload);
  }

  removerCategoria(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
