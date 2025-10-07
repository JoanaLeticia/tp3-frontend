import { Endereco } from "./endereco.model";

export class AtendimentoDeliveryProprio {
    id!: number;
    enderecoEntrega!: Endereco;
    taxaEntrega!: number;
}