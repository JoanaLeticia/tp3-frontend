import { Endereco } from "./endereco.model";
import { ParceiroApp } from "./parceiro-app.model";

export class AtendimentoDeliveryAplicativo {
    id!: number;
    parceiro!: ParceiroApp;
    enderecoEntrega!: Endereco;
}