import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { ItemCardapio } from '../../../core/models/item-cardapio.model';
import { CardProduto } from '../card-produto/card-produto';

@Component({
  selector: 'app-grid-produtos',
  imports: [CommonModule, RouterModule, CardProduto],
  templateUrl: './grid-produtos.html',
  styleUrls: ['./grid-produtos.css']
})
export class GridProdutos {
  @Input() produtos: ItemCardapio[] | null = null;
  
  @Input() layoutMode: 'default' | 'home' = 'default';

  constructor(private router: Router) { }

  onDetalhesItem(id: number): void {
    this.router.navigate(['/cardapio/item', id]);
  }
}