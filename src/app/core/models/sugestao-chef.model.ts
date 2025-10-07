import { ItemCardapio } from "./item-cardapio.model";

export class SugestaoChef {
    id!: number;
    data!: string;
    itemAlmoco!: ItemCardapio;
    itemJantar!: ItemCardapio;
}