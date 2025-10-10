import { Atendimento } from "./atendimento.model";
import { Cliente } from "./cliente.model";
import { Endereco } from "./endereco.model";
import { ItemCardapio } from "./item-cardapio.model";
import { StatusPedido } from "./status-pedido.model";
import { TipoPeriodo } from "./tipo-periodo.model";

export class Pedido {
    id!: number;
    cliente!: Cliente;
    enderecoEntrega!: Endereco;
    atendimento!: Atendimento;
    itens: ItemCardapio[] = [];
    dataPedido?: string;
    status?: StatusPedido
    periodo?: TipoPeriodo;
    valorTotal!: number;
}