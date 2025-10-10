import { CommonModule } from '@angular/common';
import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
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
  @Output() abrirPerfil = new EventEmitter<void>();
  @Output() abrirPedidos = new EventEmitter<void>();
  @Output() abrirReservas = new EventEmitter<void>();
  @Output() scrollToSection = new EventEmitter<string>();

  usuarioLogado: Usuario | null = null;
  mostrarDropdown: boolean = false;

  isAtTop = true;
  isScrolledPastThreshold = false;

  isHeaderScrolled = false;

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    this.authService.getUsuarioLogado().subscribe(usuario => {
      console.log('Usuário logado mudou:', usuario);
      this.usuarioLogado = usuario;
    });

    this.usuarioLogado = this.authService.getUsuariologadoSnapshot();
    console.log('Usuário inicial:', this.usuarioLogado);
  }

  @HostListener('window:scroll', [])
  onWindowScroll() {
    const scrollPosition = window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0;

    this.isAtTop = scrollPosition === 0;

    this.isScrolledPastThreshold = scrollPosition > 700;
  }

  onAbrirLogin() {
    this.abrirLogin.emit();
  }

  onScrollTo(sectionId: string) {
    this.scrollToSection.emit(sectionId);
  }

  onAbrirReservas() {
    this.abrirReservas.emit();
    this.fecharDropdown();
  }

  onAbrirRegistro() {
    this.abrirRegistro.emit();
  }

  onAbrirPedidos() {
    this.abrirPedidos.emit();
    this.fecharDropdown();
  }

  onAbrirPerfil() {
    this.abrirPerfil.emit();
    this.fecharDropdown();
  }

  toggleDropdown(event: Event) {
    event.stopPropagation();
    console.log('Toggle dropdown, estado atual:', this.mostrarDropdown);
    this.mostrarDropdown = !this.mostrarDropdown;
    console.log('Novo estado:', this.mostrarDropdown);
  }

  fecharDropdown() {
    console.log('Fechando dropdown');
    this.mostrarDropdown = false;
  }

  logout() {
    console.log('Fazendo logout');
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