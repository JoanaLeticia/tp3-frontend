import { Atendimento } from "./atendimento.model";

export class ParceiroApp {
    id!: number;
    nome!: string;
    percentualComissao!: number;
    taxaFixa!: number;
    listaAtendimentos: Atendimento[] = [];
}