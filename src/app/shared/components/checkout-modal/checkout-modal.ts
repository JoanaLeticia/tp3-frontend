import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ItemCardapio } from '../../../core/models/item-cardapio.model';
import { Endereco } from '../../../core/models/endereco.model'; 
import { ClienteService } from '../../../core/services/user/cliente.service'; 
// Crie estes modelos e serviços se ainda não existirem
import { ParceiroApp } from '../../../core/models/parceiro-app.model'; 
import { ParceiroService } from '../../../core/services/utils/parceiro.service';

@Component({
  selector: 'app-checkout-modal',
  imports: [CommonModule, FormsModule, CurrencyPipe],
  templateUrl: './checkout-modal.html',
  styleUrls: ['./checkout-modal.css']
})
export class CheckoutModalComponent implements OnInit {
  @Input() itens: ItemCardapio[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() pedidoConfirmado = new EventEmitter<any>();

  subtotal = 0;
  taxaEntrega = 0;
  valorTotal = 0;

  tipoAtendimentoSelecionado = 1;
  nomeRetirada = '';
  idEnderecoSelecionado: number | null = null;
  idParceiroSelecionado: number | null = null;

  enderecosUsuario: Endereco[] = [];
  parceirosDelivery: ParceiroApp[] = [];

  constructor(
    private clienteService: ClienteService,
    private parceiroService: ParceiroService
  ) { }

  ngOnInit(): void {
    this.calcularSubtotal();
    this.clienteService.getEnderecos().subscribe(data => this.enderecosUsuario = data);
    this.parceiroService.findAllSimple().subscribe(data => this.parceirosDelivery = data);
  }

  calcularSubtotal() {
    this.subtotal = this.itens.reduce((total, item) => total + (item.precoBase * item.quantidade), 0);
    this.calcularTaxa();
  }

  selecionarTipoAtendimento(tipo: number) {
    this.tipoAtendimentoSelecionado = tipo;
    this.calcularTaxa();
  }

  calcularTaxa() {
    if (this.tipoAtendimentoSelecionado === 2) {
      this.taxaEntrega = 5.00;
    } else if (this.tipoAtendimentoSelecionado === 3 && this.idParceiroSelecionado) {
      const parceiro = this.parceirosDelivery.find(p => p.id === this.idParceiroSelecionado);
      this.taxaEntrega = parceiro?.taxaFixa || 0;
    } else {
      this.taxaEntrega = 0;
    }
    this.valorTotal = this.subtotal + this.taxaEntrega;
  }

  isFormularioValido(): boolean {
    if (this.tipoAtendimentoSelecionado === 1) return this.nomeRetirada.trim() !== '';
    if (this.tipoAtendimentoSelecionado === 2) return this.idEnderecoSelecionado !== null;
    if (this.tipoAtendimentoSelecionado === 3) return this.idEnderecoSelecionado !== null && this.idParceiroSelecionado !== null;
    return false;
  }

  confirmarPedido() {
    if (!this.isFormularioValido()) return;

    const pedidoDTO = {
      idsItens: this.itens.map(i => i.id),
      idPeriodo: this.itens[0].periodo?.id,
      idTipoAtendimento: this.tipoAtendimentoSelecionado,
      nomeRetirada: this.tipoAtendimentoSelecionado === 1 ? this.nomeRetirada : undefined,
      idEndereco: this.tipoAtendimentoSelecionado > 1 ? this.idEnderecoSelecionado : undefined,
      idParceiro: this.tipoAtendimentoSelecionado === 3 ? this.idParceiroSelecionado : undefined
    };

    this.pedidoConfirmado.emit(pedidoDTO);
  }

  fecharModal() { this.close.emit(); }
}