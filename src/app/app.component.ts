import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common'; // 1. Importe o CommonModule
import { FloatingCartComponent } from './shared/components/floating-cart/floating-cart';
import { CheckoutModalComponent } from './shared/components/checkout-modal/checkout-modal';
import { ItemCardapio } from './core/models/item-cardapio.model';
import { CarrinhoService } from './core/services/order/carrinho.service';
import { PedidoService } from './core/services/order/pedido.service';
import { filter } from 'rxjs';
import { MeuPerfilModalComponent } from './shared/components/meu-perfil-modal/meu-perfil-modal';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, FloatingCartComponent, CheckoutModalComponent, MeuPerfilModalComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FoodFlow';

  mostrarModalCheckout = false;
  itensDoCarrinho: ItemCardapio[] = [];

  mostrarModalConfirmacaoPedido = false;
  pedidoConfirmado: any = null;

  constructor(
    private router: Router,
    private carrinhoService: CarrinhoService,
    private pedidoService: PedidoService
  ) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      window.scrollTo(0, 0);
    });
    this.carrinhoService.carrinho$.subscribe(itens => this.itensDoCarrinho = itens);
  }

  abrirModalCheckout() { this.mostrarModalCheckout = true; }
  fecharModalCheckout() { this.mostrarModalCheckout = false; }

  criarPedido(dto: any) {
    this.pedidoService.insert(dto).subscribe({
      next: (pedido) => {
        // LÓGICA ALTERADA:
        this.pedidoConfirmado = pedido;
        this.carrinhoService.limparCarrinho();
        this.fecharModalCheckout();
        this.mostrarModalConfirmacaoPedido = true;
      },
      error: (err) => {
        console.error('Erro ao criar pedido:', err);
        alert('Não foi possível criar o pedido.');
      }
    });
  }

  fecharModalConfirmacaoPedido() {
    this.mostrarModalConfirmacaoPedido = false;
    this.pedidoConfirmado = null;
  }
}
