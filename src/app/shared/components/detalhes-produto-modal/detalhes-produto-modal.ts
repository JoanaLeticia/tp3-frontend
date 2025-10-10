import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemCardapio } from '../../../core/models/item-cardapio.model';

@Component({
  selector: 'app-detalhes-produto-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './detalhes-produto-modal.html',
  styleUrls: ['./detalhes-produto-modal.css']
})
export class DetalhesProdutoModalComponent {
  @Input() item: ItemCardapio | null = null;
  @Output() close = new EventEmitter<void>();
  @Output() adicionar = new EventEmitter<{ item: ItemCardapio, quantidade: number, observacao: string }>();

  quantidade = 1;
  observacao = '';

  fecharModal() {
    this.close.emit();
  }

  incrementarQuantidade() {
    this.quantidade++;
  }

  decrementarQuantidade() {
    if (this.quantidade > 1) {
      this.quantidade--;
    }
  }

  adicionarAoCarrinho() {
    if (this.item) {
      this.adicionar.emit({ 
        item: this.item, 
        quantidade: this.quantidade, 
        observacao: this.observacao 
      });
      this.fecharModal();
    }
  }
}