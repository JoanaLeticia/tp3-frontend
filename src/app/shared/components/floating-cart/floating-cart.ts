import { Component, OnInit, OnDestroy, HostListener, ElementRef, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { ItemCardapio } from '../../../core/models/item-cardapio.model';
import { CarrinhoService } from '../../../core/services/order/carrinho.service';
import { CommonModule, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-floating-cart',
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './floating-cart.html',
  styleUrls: ['./floating-cart.css']
})
export class FloatingCartComponent implements OnInit, OnDestroy {
  @Output() finalizarCompra = new EventEmitter<void>();
  
  itensDoCarrinho: ItemCardapio[] = [];
  totalItens: number = 0;
  mostrarModal: boolean = false;
  private carrinhoSubscription!: Subscription;

  constructor(
    private carrinhoService: CarrinhoService,
    private elementRef: ElementRef
  ) { }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target)) {
      this.mostrarModal = false;
    }
  }

  ngOnInit(): void {
    this.carrinhoSubscription = this.carrinhoService.carrinho$.subscribe(itens => {
      this.itensDoCarrinho = itens;
      this.totalItens = this.carrinhoService.getTotalItens();
    });
  }

  ngOnDestroy(): void {
    this.carrinhoSubscription.unsubscribe();
  }

  toggleModal(): void {
    event?.stopPropagation(); 
    this.mostrarModal = !this.mostrarModal;
  }

  removerItem(itemId: number): void {
    this.carrinhoService.removerItem(itemId);
  }

  atualizarQuantidade(itemId: number, event: any): void {
    const novaQuantidade = parseInt((event.target as HTMLInputElement).value, 10);
    this.carrinhoService.atualizarQuantidade(itemId, novaQuantidade);
  }

  getTotalValor(): number {
    return this.carrinhoService.getTotalValor();
  }
}