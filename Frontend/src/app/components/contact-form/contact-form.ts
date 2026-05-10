import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.css'
})
export class ContactFormComponent {
  contactForm: FormGroup;

  constructor(private fb: FormBuilder) {
    this.contactForm = this.fb.group({
      // Agregamos el Validators.pattern para solo letras y espacios
      nombre: ['', [
        Validators.required, 
        Validators.minLength(3),
        Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$')
      ]],
      email: ['', [Validators.required, Validators.email]],
      mensaje: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(200)]]
    });
  }

  // Método para facilitar la lectura de errores en el HTML
  get f() { return this.contactForm.controls; }

  onSubmit() {
    if (this.contactForm.valid) {
      console.log('Datos del formulario:', this.contactForm.value);
      alert('¡Gracias por contactarte con Nexus Digital!');
      this.contactForm.reset();
    }
  }
}