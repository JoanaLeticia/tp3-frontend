import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIcon } from '@angular/material/icon';
import { ItemCardapio } from '../../../core/models/item-cardapio.model';
import { ItemCardapioService } from '../../../core/services/pratos/item-cardapio.service'; // ← Adicione esta importação

@Component({
  selector: 'app-card-produto',
  imports: [CommonModule, MatIcon],
  templateUrl: './card-produto.html',
  styleUrl: './card-produto.css'
})
export class CardProduto implements OnInit { // ← Implemente OnInit
  @Input() itemCardapio!: ItemCardapio;
  @Output() adicionar = new EventEmitter<ItemCardapio>();
  
  urlImagemCompleta!: string;

  constructor(private itemCardapioService: ItemCardapioService) {} // ← Injete o serviço

  ngOnInit() {
    // Use o serviço para obter a URL completa da imagem
    this.urlImagemCompleta = this.itemCardapioService.getUrlImagem(this.itemCardapio.nomeImagem);
  }

  onAdicionar() {
    this.adicionar.emit(this.itemCardapio);
  }
}