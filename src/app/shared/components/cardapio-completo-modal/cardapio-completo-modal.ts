import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { ItemCardapio } from '../../../core/models/item-cardapio.model';
import { ItemCardapioService } from '../../../core/services/pratos/item-cardapio.service';
import { GridProdutos } from '../../../client/pages/grid-produtos/grid-produtos'; 

@Component({
  selector: 'app-cardapio-completo-modal',
  standalone: true,
  imports: [CommonModule, GridProdutos],
  templateUrl: './cardapio-completo-modal.html',
  styleUrls: ['./cardapio-completo-modal.css']
})
export class CardapioCompletoModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() verDetalhes = new EventEmitter<ItemCardapio>();
  @Output() adicionar = new EventEmitter<ItemCardapio>();

  produtosAlmoco: ItemCardapio[] = [];
  produtosJantar: ItemCardapio[] = [];
  produtosExibidos: ItemCardapio[] = [];
  periodoSelecionado: 'ALMOCO' | 'JANTAR' = 'ALMOCO';
  carregando = true;

  constructor(private itemService: ItemCardapioService) {}

  ngOnInit(): void {
    forkJoin({
      almoco: this.itemService.getByPeriodo('ALMOCO'),
      jantar: this.itemService.getByPeriodo('JANTAR')
    }).subscribe({
      next: (resultados) => {
        this.produtosAlmoco = resultados.almoco;
        this.produtosJantar = resultados.jantar;
        this.produtosExibidos = this.produtosAlmoco;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao carregar cardápios completos:', err);
        this.carregando = false;
      }
    });
  }

  selecionarPeriodo(periodo: 'ALMOCO' | 'JANTAR') {
    this.periodoSelecionado = periodo;
    this.produtosExibidos = periodo === 'ALMOCO' ? this.produtosAlmoco : this.produtosJantar;
  }

  onVerDetalhes(item: ItemCardapio) { this.verDetalhes.emit(item); }
  onAdicionarAoCarrinho(item: ItemCardapio) { this.adicionar.emit(item); }
  fecharModal() { this.close.emit(); }
}