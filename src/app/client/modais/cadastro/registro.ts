import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';

export const passwordMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const senha = control.get('senha');
  const confirmarSenha = control.get('confirmarSenha');
  return senha && confirmarSenha && senha.value !== confirmarSenha.value ? { senhasNaoCoincidem: true } : null;
};

@Component({
  selector: 'app-registro-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './registro.html',
  styleUrls: ['./registro.css']
})
export class RegistroModalComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() switchToLogin = new EventEmitter<void>();

  registroForm!: FormGroup;
  carregando: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.registroForm = this.formBuilder.group({
      nome: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      senha: ['', [Validators.required, Validators.minLength(6)]],
      confirmarSenha: ['', Validators.required],
      codArea: ['', [Validators.required, Validators.maxLength(2)]],
      numeroTelefone: ['', [Validators.required, Validators.minLength(8)]],
      cep: ['', Validators.required],
      logradouro: ['', Validators.required],
      numeroEndereco: ['', Validators.required],
      complemento: [''],
      bairro: ['', Validators.required],
      idMunicipio: [null, Validators.required]
    }, { validators: passwordMatchValidator });
  }

  fecharModal() {
    this.close.emit();
  }

  onBackdropClick(event: MouseEvent) {
    if ((event.target as HTMLElement).classList.contains('modal-backdrop')) {
      this.fecharModal();
    }
  }

  fazerRegistro() {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      alert('Por favor, preencha todos os campos corretamente.');
      return;
    }

    this.carregando = true;
    const formValue = this.registroForm.value;

    const dto = {
      nome: formValue.nome,
      email: formValue.email,
      senha: formValue.senha,
      listaTelefone: [{
        codArea: formValue.codArea,
        numero: formValue.numeroTelefone
      }],
      listaEndereco: [{
        logradouro: formValue.logradouro,
        numero: formValue.numeroEndereco,
        complemento: formValue.complemento,
        bairro: formValue.bairro,
        cep: formValue.cep,
        idMunicipio: formValue.idMunicipio
      }]
    };

    this.authService.register(dto).subscribe({
      next: (usuario) => {
        this.carregando = false;
        alert('Conta criada com sucesso! Você já pode fazer o login.');
        this.irParaLogin();
      },
      error: (err) => {
        this.carregando = false;
        console.error('Erro no registro:', err);
        alert('Erro ao criar conta. Verifique os dados ou tente novamente mais tarde.');
      }
    });
  }

  irParaLogin() {
    this.switchToLogin.emit();
  }
}