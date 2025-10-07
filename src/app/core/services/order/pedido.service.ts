import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Pedido } from '../../models/pedido.model';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {
  private baseUrl = 'http://localhost:8080/pedidos';

  constructor(private httpClient: HttpClient) { }

  findAll(): Observable<Pedido[]> {
    return this.httpClient.get<Pedido[]>(this.baseUrl);
  }

  findById(id: number): Observable<Pedido> {
    console.log('Serviço - Buscando pedido por ID:', id); // Log 8
    return this.httpClient.get<Pedido>(`${this.baseUrl}/${id}`).pipe(
      tap({
        next: (pedido) => console.log('Serviço - Pedido retornado:', pedido), // Log 9
        error: (err) => console.error('Serviço - Erro na requisição:', err) // Log 10
      })
    );
  }

  insert(pedidoData: { itens: Array<{ idProduto: number, quantidade: number }> }): Observable<any> {
    return this.httpClient.post(`${this.baseUrl}`, pedidoData);
  }

  /*update(Pedido: Pedido): Observable<Pedido> {
    return this.httpClient.put<Pedido>(`${this.baseUrl}/${Pedido.id}`, Pedido);
  }*/

  delete(Pedido: Pedido): Observable<any> {
    return this.httpClient.delete<any>(`${this.baseUrl}/${Pedido.idPedido}`);
  }

  count(): Observable<number> {
    return this.httpClient.get<number>(`${this.baseUrl}/count`);
  }

  findLastByUser(): Observable<Pedido> {
    return this.httpClient.get<Pedido>(`${this.baseUrl}/ultimo-pedido`);
  }

  findByClienteId(clienteId: number): Observable<Pedido[]> {
    return this.httpClient.get<Pedido[]>(`${this.baseUrl}/cliente/${clienteId}`);
  }
}