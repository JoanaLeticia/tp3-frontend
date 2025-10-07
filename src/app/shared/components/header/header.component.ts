import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Output } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  @Output() abrirLogin = new EventEmitter<void>();
  @Output() abrirRegistro = new EventEmitter<void>();

  onAbrirLogin() {
    this.abrirLogin.emit();
  }

  onAbrirRegistro() {
    this.abrirRegistro.emit();
  }
}