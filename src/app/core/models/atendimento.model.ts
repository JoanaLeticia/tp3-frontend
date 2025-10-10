import { Endereco } from "./endereco.model";
import { ParceiroApp } from "./parceiro-app.model";
import { TipoAtendimento } from "./tipo-atendimento.model";

export interface Atendimento {
    id: number;
    tipo: TipoAtendimento;

    numeroMesa?: number;
    nomeRetirada?: string;
    enderecoEntrega?: Endereco;
    parceiro?: ParceiroApp;
    taxa?: number;
}