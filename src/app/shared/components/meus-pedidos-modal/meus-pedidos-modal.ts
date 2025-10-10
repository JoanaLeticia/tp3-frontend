import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Pedido } from '../../../core/models/pedido.model';
import { PedidoService } from '../../../core/services/order/pedido.service';

@Component({
  selector: 'app-meus-pedidos-modal',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './meus-pedidos-modal.html',
  styleUrls: ['./meus-pedidos-modal.css']
})
export class MeusPedidosModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() verDetalhes = new EventEmitter<Pedido>();

  pedidos: Pedido[] = [];
  carregando = true;

  constructor(private pedidoService: PedidoService) { }

  ngOnInit(): void {
    this.pedidoService.getMeusPedidos().subscribe({
      next: (data) => {
        this.pedidos = data;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao buscar pedidos:', err);
        this.carregando = false;
      }
    });
  }

  getStatusClass(status: string): string {
    return 'status-' + status.toLowerCase().replace('_', '-');
  }

  fecharModal() {
    this.close.emit();
  }

  onVerDetalhes(pedido: Pedido) {
    this.verDetalhes.emit(pedido);
  }
}