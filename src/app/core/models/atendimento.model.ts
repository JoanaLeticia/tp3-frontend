import { Pedido } from "./pedido.model";
import { TipoAtendimento } from "./tipo-atendimento.model";

export interface Atendimento {
    id: number;
    pedido: Pedido;
    tipo: 'PRESENCIAL' | 'DELIVERY_PROPRIO' | 'DELIVERY_APLICATIVO';
}