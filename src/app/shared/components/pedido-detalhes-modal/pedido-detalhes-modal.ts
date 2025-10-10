import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Pedido } from '../../../core/models/pedido.model';

@Component({
  selector: 'app-pedido-detalhes-modal',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './pedido-detalhes-modal.html',
  styleUrls: ['./pedido-detalhes-modal.css']
})
export class PedidoDetalhesModalComponent {
  @Input() pedido: Pedido | null = null;
  @Output() close = new EventEmitter<void>();

  getStatusClass(status: string): string {
    return 'status-' + (status || '').toLowerCase().replace('_', '-');
  }

  fecharModal() {
    this.close.emit();
  }
}