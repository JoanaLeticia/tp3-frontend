import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Reserva } from '../../../core/models/reserva.model';
import { ReservaService } from '../../../core/services/reserva/reserva.service';

@Component({
  selector: 'app-minhas-reservas-modal',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './minhas-reservas-modal.html',
  styleUrls: ['./minhas-reservas-modal.css']
})
export class MinhasReservasModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();

  reservas: Reserva[] = [];
  carregando = true;

  constructor(private reservaService: ReservaService) {}

  ngOnInit(): void {
    this.carregarReservas();
  }

  carregarReservas() {
    this.carregando = true;
    this.reservaService.getMinhasReservas().subscribe({
      next: (data) => {
        this.reservas = data;
        this.carregando = false;
      },
      error: (err) => {
        console.error('Erro ao buscar reservas:', err);
        this.carregando = false;
      }
    });
  }

  isFutura(dataHora: string | Date): boolean {
    return new Date(dataHora) > new Date();
  }

  cancelarReserva(id: number) {
    if (confirm('Tem certeza que deseja cancelar esta reserva?')) {
      this.reservaService.cancelarReserva(id).subscribe({
        next: () => {
          alert('Reserva cancelada com sucesso!');
          this.carregarReservas();
        },
        error: (err) => {
          console.error('Erro ao cancelar reserva:', err);
          alert('Não foi possível cancelar a reserva.');
        }
      });
    }
  }

  fecharModal() {
    this.close.emit();
  }
}