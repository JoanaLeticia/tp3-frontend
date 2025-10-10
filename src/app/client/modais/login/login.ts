import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../auth/auth.service';

@Component({
  selector: 'app-login-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();

  loginForm!: FormGroup;
  
  lembrarMe: boolean = false;
  carregando: boolean = false;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
      this.loginForm = this.formBuilder.group({
        email: ['', [Validators.required, Validators.email]],
        senha: ['', [Validators.required, Validators.minLength(6)]],
      });
  }

  fecharModal() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.fecharModal();
    }
  }

  fazerLogin() {
    if (this.loginForm.valid) {
      this.carregando = true;
      
      const email = this.loginForm.get('email')!.value;
      const senha = this.loginForm.get('senha')!.value;

      this.authService.login(email, senha).subscribe({
        next: (resp) => {
          this.carregando = false;
          this.fecharModal();
        },
        error: (err) => {
          this.carregando = false;
          console.error('Erro no login:', err);
          alert('Erro ao fazer login. Verifique suas credenciais.');
        }
      });
    } else {
      this.loginForm.markAllAsTouched();
      alert('Por favor, preencha todos os campos corretamente');
    }
  }

  recuperarSenha() {
    const email = this.loginForm.get('email')?.value;
    
    if (!email) {
      alert('Por favor, informe seu email para recuperar a senha.');
      return;
    }
    alert(`Link de recuperação enviado para: ${email}`);
  }

  criarConta() {
    this.switchToRegister.emit();
  }
}