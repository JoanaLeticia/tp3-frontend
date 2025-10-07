import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ItemCardapio } from '../../models/item-cardapio.model'; 

export interface SugestaoChefResponse {
  id: number;
  itemAlmoco: ItemCardapio | null;
  itemJantar: ItemCardapio | null;
  data: string; // ← Corrigido: é 'data', não 'dataInicio/dataFim'
  ativa: boolean; // ← Pode não vir do back-end, mas podemos calcular
}

@Injectable({
  providedIn: 'root'
})
export class SugestaoChefeService {
  private baseUrl = 'http://localhost:8080/sugestoes-chef';

  constructor(private http: HttpClient) { }

  findSugestaoAtiva(): Observable<SugestaoChefResponse> {
    return this.http.get<SugestaoChefResponse>(`${this.baseUrl}/ativa`);
  }

  // Método opcional para buscar por data específica
  findByData(data: string): Observable<SugestaoChefResponse> {
    return this.http.get<SugestaoChefResponse>(`${this.baseUrl}/data/${data}`);
  }
}