import { TipoPeriodo } from "./tipo-periodo.model";

export class ItemCardapio {
    id!: number;
    nome!: string;
    descricao!: string;
    precoBase!: number;
    periodo?: TipoPeriodo;
    nomeImagem!: string;
    quantidade!: number;

    precoComDesconto?: number | null;
    isSugestaoChefe?: boolean;
    
    urlImagem?: string;
}