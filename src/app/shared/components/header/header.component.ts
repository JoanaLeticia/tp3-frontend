import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../auth/auth.service'; 
import { Usuario } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  @Output() abrirLogin = new EventEmitter<void>();
  @Output() abrirRegistro = new EventEmitter<void>();

  usuarioLogado: Usuario | null = null;
  mostrarDropdown: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    // Observar mudanças no estado de login
    this.authService.getUsuarioLogado().subscribe(usuario => {
      console.log('Usuário logado mudou:', usuario); // Debug
      this.usuarioLogado = usuario;
    });

    // Carregar estado inicial
    this.usuarioLogado = this.authService.getUsuariologadoSnapshot();
    console.log('Usuário inicial:', this.usuarioLogado); // Debug
  }

  onAbrirLogin() {
    this.abrirLogin.emit();
  }

  onAbrirRegistro() {
    this.abrirRegistro.emit();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation(); // Prevenir que o clique se propague
    console.log('Toggle dropdown, estado atual:', this.mostrarDropdown); // Debug
    this.mostrarDropdown = !this.mostrarDropdown;
    console.log('Novo estado:', this.mostrarDropdown); // Debug
  }

  fecharDropdown() {
    console.log('Fechando dropdown'); // Debug
    this.mostrarDropdown = false;
  }

  logout() {
    console.log('Fazendo logout'); // Debug
    this.authService.logoutCompleto();
    this.mostrarDropdown = false;
    this.usuarioLogado = null;
  }

  getPrimeiroNome(): string {
    if (!this.usuarioLogado?.nome) return 'Usuário';
    
    const nomeCompleto = this.usuarioLogado.nome;
    return nomeCompleto;
  }
}