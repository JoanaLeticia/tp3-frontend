import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginModalComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();

  email: string = '';
  senha: string = '';
  lembrarMe: boolean = false;
  carregando: boolean = false;

  constructor(private router: Router) {}

  // Fechar modal
  fecharModal() {
    this.close.emit();
  }

  // Fechar ao clicar fora
  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.fecharModal();
    }
  }

  // Login
  fazerLogin() {
    if (!this.email || !this.senha) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    this.carregando = true;

    // Simulação de login - substitua pela sua lógica real
    setTimeout(() => {
      console.log('Login attempt:', { email: this.email, lembrarMe: this.lembrarMe });
      
      // Aqui você integraria com seu AuthService
      // this.authService.login(this.email, this.senha).subscribe(...)
      
      this.carregando = false;
      this.fecharModal();
      alert('Login realizado com sucesso!');
    }, 1500);
  }

  // Recuperar senha
  recuperarSenha() {
    if (!this.email) {
      alert('Por favor, informe seu email para recuperar a senha.');
      return;
    }
    alert(`Link de recuperação enviado para: ${this.email}`);
  }

  // Ir para cadastro
  criarConta() {
    this.switchToRegister.emit();
  }
}