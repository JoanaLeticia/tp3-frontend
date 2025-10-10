import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // RouterModule não é mais necessário aqui
import { ItemCardapio } from '../../../core/models/item-cardapio.model';
import { CardProduto } from '../card-produto/card-produto';

@Component({
  selector: 'app-grid-produtos',
  imports: [CommonModule, CardProduto], // Remova o RouterModule se não for mais usado
  templateUrl: './grid-produtos.html',
  styleUrls: ['./grid-produtos.css']
})
export class GridProdutos {
  @Input() produtos: ItemCardapio[] | null = null;
  @Input() layoutMode: 'default' | 'home' = 'default';

  @Output() adicionar = new EventEmitter<ItemCardapio>();
  @Output() verDetalhes = new EventEmitter<ItemCardapio>();

  // Remova o Router do construtor, pois não vamos mais navegar
  constructor() { }

  onAdicionar(item: ItemCardapio): void {
    this.adicionar.emit(item);
  }

  // MÉTODO CORRIGIDO:
  // Agora ele recebe o objeto 'ItemCardapio' completo e emite o evento 'verDetalhes'.
  onDetalhesItem(item: ItemCardapio): void {
    this.verDetalhes.emit(item);
  }
}