import { Mesa } from "./mesa.model";
import { Usuario } from "./usuario.model";

export class Reserva {
    id!: number;
    usuario!: Usuario;
    mesa!: Mesa;
    horario?: string;
    numeroPessoas!: number;
    codigoConfirmacao!: string;
}